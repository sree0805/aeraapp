"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAnalyticsData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString();

    // 1. Fetch Sleep Data
    const { data: sleepData } = await supabase
        .from("daily_stats")
        .select("date, sleep_hours")
        .eq("user_id", user.id)
        .gte("date", dateStr)
        .order("date", { ascending: true });

    // 2. Fetch Mood Data
    const { data: moodData } = await supabase
        .from("emotion_logs")
        .select("created_at, mood_score")
        .eq("user_id", user.id)
        .gte("created_at", dateStr)
        .order("created_at", { ascending: true });

    // 3. Fetch Habits and Logs
    const { data: habits } = await supabase.from('habits').select('id, title, frequency').neq('archived', true);

    const { data: habitLogs } = await supabase
        .from("habit_logs")
        .select("habit_id, completed_at")
        .gte("completed_at", dateStr);

    // 4. Calculate Metrics server-side
    const habitsMap = new Map();

    habits?.forEach(h => {
        habitsMap.set(h.id, {
            id: h.id,
            title: h.title,
            frequency: h.frequency,
            weeklyCompletion: 0,
            momentum: 0,
            dates: [] as string[]
        });
    });

    const now = new Date();
    // Week Start (Monday) for Weekly Progress
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    // 14 Days Ago for Momentum
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 14);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    // Weekly Aggregate for Donut Chart
    const weeklyUniqueDays = new Set<string>();

    habitLogs?.forEach(log => {
        const h = habitsMap.get(log.habit_id);
        if (h) {
            const logDate = new Date(log.completed_at);
            const dateStr = log.completed_at.split('T')[0];
            h.dates.push(dateStr);

            // Weekly Progress: Strictly this week (Mon-Sun)
            if (logDate >= weekStart) {
                h.weeklyCompletion++;
                weeklyUniqueDays.add(dateStr);
            }

            // Momentum: Last 14 days rolling window
            if (logDate >= fourteenDaysAgo) {
                h.momentum++;
            }
        }
    });

    const habitMetrics = Array.from(habitsMap.values()).map(h => ({
        ...h,
        weeklyScore: Math.min(100, Math.round((h.weeklyCompletion / 7) * 100)),
        momentumScore: Math.min(100, Math.round((h.momentum / 14) * 100))
    }));

    const daysCompleted = weeklyUniqueDays.size;
    const daysRemaining = Math.max(0, 7 - daysCompleted);

    // 5. Fetch Plan Status
    const { data: usage } = await supabase
        .from('user_usage')
        .select('plan')
        .eq('user_id', user.id)
        .single();

    // Type assertion for plan
    const userPlan = (usage?.plan === 'pro') ? 'pro' : 'free';

    return {
        sleepData: sleepData || [],
        moodData: moodData || [],
        habitMetrics,
        weeklyChartData: [
            { name: "Completed", value: daysCompleted, fill: "#4f46e5" }, // Indigo-600
            { name: "Remaining", value: daysRemaining, fill: "#e2e8f0" }, // Slate-200
        ],
        plan: userPlan
    };
}
