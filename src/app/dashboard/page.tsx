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
        <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto px-4 pt-4 md:px-0 md:pt-0">
            {/* Top Section: Hero & Weekly Pulse */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COL: Hero + Daily Focus (Span 8) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Hero Card - Native Mobile Feel */}
                    <Card className="border-none shadow-sm md:shadow-md bg-gradient-to-br from-primary/10 via-card to-card relative overflow-hidden">

                        {/* Subtle Abstract Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-[30px] pointer-events-none" />

                        <CardContent className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-12">

                                {/* Text Content */}
                                <div className="space-y-4 md:space-y-3 text-center md:text-left w-full md:w-auto z-10">
                                    <div className="space-y-1">
                                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                            Welcome!
                                        </h2>
                                        <p className="text-muted-foreground text-sm md:text-lg">
                                            You&apos;ve completed <span className="font-semibold text-primary">{uniqueHabitsCompletedToday}</span> of <span className="font-semibold text-foreground">{totalHabits}</span> habits today.
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                                        <SleepLogger />
                                        <MoodLogger />
                                    </div>
                                </div>

                                {/* Daily Progress Ring (integrated into Hero) */}
                                <div className="shrink-0 scale-100 md:scale-110 w-full md:w-auto md:min-w-[400px]">
                                    <OverviewCharts
                                        dailyData={{ completed: uniqueHabitsCompletedToday, total: totalHabits || 0 }}
                                        weeklyData={{ completedDays: 0 }} // Weekly hidden here, shown in side col
                                        hideWeekly={true}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Grid - Mobile: Horizontal Scroll or Compact Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <Card className="bg-card border-border shadow-sm hover:border-primary/20 transition-colors">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="p-2 bg-blue-50/50 dark:bg-blue-900/10 rounded-full">
                                    <CheckSquare className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold tracking-tight">{totalHabits || 0}</div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Habits</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border shadow-sm hover:border-primary/20 transition-colors">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="p-2 bg-orange-50/50 dark:bg-orange-900/10 rounded-full">
                                    <Flame className="h-5 w-5 text-orange-500" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-center gap-1">
                                        <div className="text-xl font-bold tracking-tight">{highestStreak}</div>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Day Streak</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border shadow-sm hover:border-primary/20 transition-colors">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="p-2 bg-pink-50/50 dark:bg-pink-900/10 rounded-full">
                                    <ListTodo className="h-5 w-5 text-pink-500" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold tracking-tight">{pendingTasksCount || 0}</div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">To-Do</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border shadow-sm hover:border-primary/20 transition-colors">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="p-2 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-full">
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold tracking-tight">{completedTasksCount || 0}</div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Wins</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* RIGHT COL: Weekly Pulse (Desktop Only mainly, or stacked at bottom) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card className="h-full border-none shadow-sm md:shadow-md bg-card relative overflow-hidden flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Weekly Pulse</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center py-8">
                            <div className="w-full md:min-w-[350px]">
                                <OverviewCharts
                                    dailyData={{ completed: 0, total: 0 }}
                                    weeklyData={{ completedDays: weekUniqueDays }}
                                    hideDaily={true}
                                />
                            </div>
                        </CardContent>
                        <div className="p-4 bg-secondary/30 mt-auto border-t border-border/50">
                            <p className="text-xs text-muted-foreground text-center italic">
                                &quot;Consistency is the key to breakthrough.&quot;
                            </p>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}
