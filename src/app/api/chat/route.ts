import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        // 1. Auth & Billing Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ reply: "Please log in to chat." }, { status: 401 });
        }

        // --- BILLING LOGIC START ---
        // Fetch or Create Usage Record
        let { data: usage } = await supabase
            .from('user_usage')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (!usage) {
            // Create default record if missing
            const { data: newUsage, error } = await supabase
                .from('user_usage')
                .insert({
                    user_id: user.id,
                    plan: 'free',
                    daily_credits: 5,
                    purchased_credits: 0,
                    last_reset_date: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error("Failed to create billing record:", error);
                // Fail open or closed? Closed for safety, but open for UX? 
                // Let's allow one free message if billing fails to init? No, strict.
                return NextResponse.json({ reply: "Billing system error. Please contact support." }, { status: 500 });
            }
            usage = newUsage;
        }

        // Daily Reset Logic
        // We use an offset of -3.5 hours (3.5 hours before UTC midnight).
        // This targets 9:00 AM IST. (IST = UTC+5.5).
        // 9 AM IST = 3:30 AM UTC.
        // 3:30 UTC - 3.5h = 00:00 (New Day Reset).
        const MILLIS_PER_HOUR = 60 * 60 * 1000;
        const OFFSET_HOURS = -3.5;

        const now = new Date();
        const adjustedNow = new Date(now.getTime() + (OFFSET_HOURS * MILLIS_PER_HOUR));
        const todayStr = adjustedNow.toISOString().split('T')[0];

        // Parse DB date safely
        const lastResetDate = new Date(usage.last_reset_date);
        const adjustedLastReset = new Date(lastResetDate.getTime() + (OFFSET_HOURS * MILLIS_PER_HOUR));
        const lastResetStr = adjustedLastReset.toISOString().split('T')[0];

        if (todayStr !== lastResetStr) {
            const { error: resetError } = await supabase
                .from('user_usage')
                .update({
                    daily_credits: 5,
                    // Store the ACTUAL (UTC) time of reset for record keeping, 
                    // but the logic relies on the date string comparison.
                    last_reset_date: new Date().toISOString()
                })
                .eq('user_id', user.id);

            if (resetError) console.error("Reset error", resetError);
            usage.daily_credits = 5; // Optimistic update
        }

        // Check Availability
        if (usage.daily_credits <= 0 && usage.purchased_credits <= 0) {
            return NextResponse.json({
                reply: "You have run out of AI credits for today. Upgrade to keep chatting!"
            }, { status: 402 });
        }
        // --- BILLING LOGIC END ---

        // 2. Fetch Context
        let contextString = "";
        try {
            const { data: recentMoods } = await supabase
                .from("emotion_logs")
                .select("mood_score, emotions, note, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(3);

            const { data: dailyStats } = await supabase
                .from("daily_stats")
                .select("*")
                .eq("user_id", user.id)
                .eq("date", todayStr)
                .single();

            contextString = `
CONTEXT ABOUT THE USER:
- Recent Mood History (Newest first):
${recentMoods?.map((m: any) => `  * Date: ${m.created_at.slice(0, 10)}, Score: ${m.mood_score}/10, Emotions: [${m.emotions?.join(', ')}], Note: "${m.note || ''}"`).join('\n') || "  No recent mood logs."}

- Today's Balance:
${dailyStats ? `  * Sleep: ${dailyStats.sleep_hours}h, Work: ${dailyStats.work_hours}h, Leisure: ${dailyStats.leisure_hours}h` : "  No data logged for today yet."}
`;
        } catch (contextError) {
            console.warn("Context fetch warning:", contextError);
        }

        const { messages } = await req.json();

        // 3. AI Execution
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { reply: "Configuration Error: Missing GEMINI_API_KEY in .env file." },
                { status: 503 }
            );
        }

        const systemInstruction = `You are a compassionate, empathetic, and wise AI therapist and productivity coach embedded in a wellness app. 
Your goal is to help the user manage their time, process their emotions, and build healthy habits.

GUIDELINES:
- Be concise (max 2-3 paragraphs), encouraging, and practical.
- Use the provided context to personalize your advice.
- Do not mention that you are "reading data" unless relevant.
- Ask ONE thought-provoking question to deepen the conversation.
- Do NOT diagnose mental health conditions.
${contextString}`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // History Construction
        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const cleanHistory: any[] = [];
        let lastRole = null;
        for (const msg of history) {
            if (msg.role === lastRole && cleanHistory.length > 0) {
                cleanHistory[cleanHistory.length - 1].parts[0].text += "\n\n" + msg.parts[0].text;
            } else {
                cleanHistory.push(msg);
                lastRole = msg.role;
            }
        }

        while (cleanHistory.length > 0 && cleanHistory[0].role === 'model') {
            cleanHistory.shift();
        }

        const lastMessage = messages[messages.length - 1];
        const fullPrompt = `${systemInstruction}\n\nUser: ${lastMessage.content}`;

        const chat = model.startChat({ history: cleanHistory });

        let retries = 1;
        let responseText = "";

        while (retries >= 0) {
            try {
                const result = await chat.sendMessage(fullPrompt);
                const response = result.response;
                responseText = response.text();
                break;
            } catch (err: any) {
                if (retries === 0) throw err;
                console.warn(`Gemini API Retry: ${err.message}`);
                retries--;
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        // --- BILLING DEDUCTION ---
        // Deduct 1 credit. Prefer daily first.
        if (usage.daily_credits > 0) {
            await supabase.from('user_usage').update({ daily_credits: usage.daily_credits - 1 }).eq('user_id', user.id);
        } else {
            await supabase.from('user_usage').update({ purchased_credits: usage.purchased_credits - 1 }).eq('user_id', user.id);
        }

        return NextResponse.json({ reply: responseText });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ reply: `Error: ${error.message}` }, { status: 500 });
    }
}
