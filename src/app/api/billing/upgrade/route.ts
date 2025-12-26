
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { plan } = await req.json();
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Define Plan Credits
        let creditsToAdd = 0;
        let newPlanName = plan;

        if (plan === 'starter') {
            creditsToAdd = 100;
        } else if (plan === 'pro') {
            creditsToAdd = 500;
        } else {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        // Get current usage to accumulate or create
        const { data: usage } = await supabase
            .from('user_usage')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (usage) {
            // Update existing
            // Note: In a real app we'd handle "changing plan" logic more complexly (proration etc)
            // Here we just "Grant One-Time Credits" as per prompt "Starter: 100 AI credits (one-time)"
            // But we also update the plan name for display.

            const { error } = await supabase
                .from('user_usage')
                .update({
                    plan: newPlanName,
                    purchased_credits: usage.purchased_credits + creditsToAdd
                })
                .eq('user_id', user.id);

            if (error) throw error;
        } else {
            // Create New
            const { error } = await supabase
                .from('user_usage')
                .insert({
                    user_id: user.id,
                    plan: newPlanName,
                    daily_credits: 5,
                    purchased_credits: creditsToAdd,
                    last_reset_date: new Date().toISOString()
                });

            if (error) throw error;
        }

        return NextResponse.json({ success: true, added: creditsToAdd });

    } catch (error: any) {
        console.error("Billing Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
