import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { CheckSquare, Flame, ListTodo, Trophy, Sparkles } from "lucide-react"

import { MoodLogger } from "@/components/dashboard/mood-logger"
import { SleepLogger } from "@/components/dashboard/sleep-logger"
import { OverviewCharts } from "@/components/dashboard/overview-charts"
import { ShareStreak } from "@/components/dashboard/share-streak"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = await createClient()

    // STRICT: Habits only. Do not count tasks. Exclude archived.
    const { count: totalHabits } = await supabase
        .from('habits')
        .select('*', { count: 'exact', head: true })
        .neq('archived', true)

    // Fetch active habit IDs for log filtering
    const { data: activeHabitsList } = await supabase
        .from('habits')
        .select('id')
        .neq('archived', true)

    const activeHabitIds = new Set(activeHabitsList?.map(h => h.id) || [])

    const { data: habits } = await supabase
        .from('habits')
        .select('streak')
        .neq('archived', true)
        .order('streak', { ascending: false })
        .limit(1)

    const highestStreak = habits?.[0]?.streak || 0

    // Tasks are separate. Do not mix.
    const { count: pendingTasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', false)

    const { count: completedTasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', true)

    // NEW: Fetch ONLY habit logs for today and this week
    const today = new Date().toISOString().split('T')[0]

    // Week Start (Monday) calculation (UTC based)
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day == 0 ? -6 : 1);
    const weekStart = new Date(now);
    weekStart.setDate(diff);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    // Fetch logs strictly from 'habit_logs' table
    const { data: habitLogs } = await supabase
        .from('habit_logs')
        .select('habit_id, completed_at')
        .gte('completed_at', weekStartStr)

    // FILTER LOGS: Only include logs from active habits
    const activeLogs = habitLogs?.filter(log => activeHabitIds.has(log.habit_id)) || []

    // DIAGNOSIS: Log the raw data
    console.log('[Dashboard] Total Habits:', totalHabits);
    console.log('[Dashboard] Habit Logs (Week, Active Only):', activeLogs.length);
    console.log('[Dashboard] Today:', today);

    // 1. Daily Progress: Count UNIQUE habits completed today
    // Filters purely on habit logs and ensures unique habit IDs.
    const todaysLogs = activeLogs.filter(log => log.completed_at.startsWith(today));
    const uniqueHabitsCompletedToday = new Set(todaysLogs.map(l => l.habit_id)).size;

    console.log('[Dashboard] Unique Habits Completed Today:', uniqueHabitsCompletedToday);

    // 2. Weekly Consistency: Count unique days active this week (Habits ONLY)
    const uniqueDaysSet = new Set<string>();
    activeLogs.forEach(log => {
        const dateStr = log.completed_at.split('T')[0];
        uniqueDaysSet.add(dateStr);
    });
    const weekUniqueDays = uniqueDaysSet.size;

    return (
        <div className="space-y-6 p-4 md:p-8 max-w-[1600px] mx-auto">
            {/* Top Section: Hero & Weekly Pulse */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COL: Hero + Daily Focus (Span 8) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Hero Card */}
                    <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 via-card to-card relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Sparkles className="w-64 h-64 text-primary" />
                        </div>
                        {/* Dreamy Background Blobs */}
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[80px] pointer-events-none opacity-50" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

                        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div className="space-y-2 text-center md:text-left">
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                    Welcome!
                                </h2>
                                <p className="text-muted-foreground text-xl">
                                    You've completed <span className="font-bold text-foreground">{uniqueHabitsCompletedToday}</span> of <span className="font-bold text-foreground">{totalHabits}</span> habits today.
                                </p>
                                <div className="pt-4 flex justify-center md:justify-start gap-3">
                                    <SleepLogger />
                                    <MoodLogger />
                                </div>
                            </div>

                            {/* Daily Progress Ring (integrated into Hero) */}
                            <div className="shrink-0 scale-110">
                                <OverviewCharts
                                    dailyData={{ completed: uniqueHabitsCompletedToday, total: totalHabits || 0 }}
                                    weeklyData={{ completedDays: 0 }} // Weekly hidden here, shown in side col
                                    hideWeekly={true}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Grid (Below Hero) */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-sm ring-1 ring-white/10 hover:bg-card hover:translate-y-[-2px] transition-all">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="p-3 bg-blue-500/10 rounded-full">
                                    <CheckSquare className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{totalHabits || 0}</div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Habits</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-sm ring-1 ring-white/10 hover:bg-card hover:translate-y-[-2px] transition-all">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="p-3 bg-orange-500/10 rounded-full">
                                    <Flame className="h-6 w-6 text-orange-500" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="text-2xl font-bold">{highestStreak}</div>
                                        <ShareStreak streak={highestStreak} variant="icon" />
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Best Streak</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-sm ring-1 ring-white/10 hover:bg-card hover:translate-y-[-2px] transition-all">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="p-3 bg-pink-500/10 rounded-full">
                                    <ListTodo className="h-6 w-6 text-pink-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{pendingTasksCount || 0}</div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">To-Do</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-sm ring-1 ring-white/10 hover:bg-card hover:translate-y-[-2px] transition-all">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="p-3 bg-yellow-500/10 rounded-full">
                                    <Trophy className="h-6 w-6 text-yellow-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{completedTasksCount || 0}</div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Wins</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* RIGHT COL: Weekly Pulse & Tools (Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card className="h-full border-none shadow-md bg-card/80 backdrop-blur-md relative overflow-hidden flex flex-col">
                        <CardHeader>
                            <CardTitle>Weekly Consistency</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center">
                            <OverviewCharts
                                dailyData={{ completed: 0, total: 0 }}
                                weeklyData={{ completedDays: weekUniqueDays }}
                                hideDaily={true}
                            />
                        </CardContent>
                        <div className="p-6 bg-secondary/50 mt-auto">
                            <p className="text-sm text-muted-foreground text-center italic">
                                "Success is the sum of small efforts, repeated day in and day out."
                            </p>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}
