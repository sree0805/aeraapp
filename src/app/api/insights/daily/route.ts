
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Fetch Data (Last 14 Days)
        const today = new Date();
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(today.getDate() - 14);
        const isoDate = fourteenDaysAgo.toISOString();

        const { data: emotions } = await supabase
            .from("emotion_logs")
            .select("mood_score, created_at")
            .eq("user_id", user.id)
            .gte("created_at", isoDate)
            .order("created_at", { ascending: true });

        const { data: dailyStats } = await supabase
            .from("daily_stats")
            .select("sleep_hours, work_hours, leisure_hours, date")
            .eq("user_id", user.id)
            .gte("date", isoDate.split('T')[0])
            .order("date", { ascending: true });

        const { data: completedTasks } = await supabase
            .from("tasks")
            .select("created_at") // Using created_at as proxy for completion time if completed_at missing, strictly tasks table has created_at
            .eq("user_id", user.id)
            .eq("is_completed", true)
            .gte("created_at", isoDate);

        // Check for sufficient data
        const hasEmotions = emotions && emotions.length >= 3;
        const hasStats = dailyStats && dailyStats.length >= 3;

        if (!hasEmotions && !hasStats) {
            return NextResponse.json({ skipped: true, reason: "Insufficient data" });
        }

        // 2. Prepare Context
        let context = "User Data (Last 14 Days):\n";

        // Group by Date for correlation
        const dataByDate: Record<string, any> = {};

        dailyStats?.forEach(stat => {
            const date = stat.date;
            if (!dataByDate[date]) dataByDate[date] = {};
            dataByDate[date].sleep = stat.sleep_hours;
            dataByDate[date].work = stat.work_hours;
        });

        emotions?.forEach(log => {
            const date = log.created_at.split('T')[0];
            if (!dataByDate[date]) dataByDate[date] = {};
            // Average mood if multiple
            if (!dataByDate[date].moods) dataByDate[date].moods = [];
            dataByDate[date].moods.push(log.mood_score);
        });

        completedTasks?.forEach(task => {
            const date = task.created_at.split('T')[0];
            if (!dataByDate[date]) dataByDate[date] = {};
            dataByDate[date].tasks = (dataByDate[date].tasks || 0) + 1;
        });

        // Format for Prompt
        Object.entries(dataByDate).forEach(([date, metrics]) => {
            const mood = metrics.moods ? (metrics.moods.reduce((a: any, b: any) => a + b, 0) / metrics.moods.length).toFixed(1) : "N/A";
            const tasks = metrics.tasks || 0;
            const sleep = metrics.sleep !== undefined ? metrics.sleep : "N/A";
            context += `- ${date}: Mood ${mood}/10, Sleep ${sleep}h, Tasks Completed ${tasks}\n`;
        });

        // 3. Generate Insight using Gemini
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            // Fallback Logic if API missing
            return NextResponse.json({ insight: "Consistency is essentially to building long-term habits. Keep tracking!" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use working model

        const prompt = `
        Analyze the following user data to find meaningful correlations between Mood, Sleep, and Task Productivity.
        
        ${context}
        
        Generate EXACTLY ONE short, supportive insight sentence (max 20 words).
        - Connect at least two factors (e.g., Sleep & Mood, Mood & Tasks).
        - Be observation-based ("You tend to...", "Days with...").
        - Avoid medical advice.
        - If no clear pattern, give a general supportive tip about consistency.
        
        Insight:
        `;

        const result = await model.generateContent(prompt);
        const insight = result.response.text().trim();

        return NextResponse.json({ insight });

    } catch (error) {
        console.error("Insight Error:", error);
        return NextResponse.json({ insight: "Tracking your daily habits helps reveal hidden patterns in your well-being." });
    }
}
