"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, parseISO, subDays } from "date-fns";
import { cn } from "@/lib/utils";

interface AnalyticsProps {
    sleepData: any[];
    moodData: any[];
    habitMetrics: {
        id: number;
        title: string;
        weeklyScore: number;
        momentumScore: number;
        dates: string[];
    }[];
    weeklyChartData?: { name: string; value: number; fill: string; }[];
    subscriptionPlan?: 'free' | 'pro';
}

export function AnalyticsDashboard({ sleepData, moodData, habitMetrics, weeklyChartData, subscriptionPlan = 'free' }: AnalyticsProps) {
    const [isMobile, setIsMobile] = useState(false);

    const isPro = subscriptionPlan === 'pro';

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 1. Process Mood Data
    const processedMood = moodData.reduce((acc: any, curr: any) => {
        const date = curr.created_at.split('T')[0];
        if (!acc[date]) {
            acc[date] = { date, total: 0, count: 0 };
        }
        acc[date].total += curr.mood_score;
        acc[date].count += 1;
        return acc;
    }, {});

    const moodChartData = Object.values(processedMood)
        .map((d: any) => ({
            date: d.date,
            mood: parseFloat((d.total / d.count).toFixed(1))
        }))
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate Averages for Mobile Rings
    const avgMood = moodChartData.length > 0
        ? (moodChartData.reduce((sum: number, item: any) => sum + item.mood, 0) / moodChartData.length).toFixed(1)
        : "0";

    // Process Sleep Data
    const avgSleep = sleepData.length > 0
        ? (sleepData.reduce((sum: number, item: any) => sum + (item.sleep_hours || 0), 0) / sleepData.length).toFixed(1)
        : "0";

    const sleepRingData = [
        { name: "Sleep", value: parseFloat(avgSleep as string), fill: "#8884d8" },
        { name: "Remaining", value: 12 - parseFloat(avgSleep as string), fill: "#f3f4f6" } // Assume 12h scale
    ];

    const moodRingData = [
        { name: "Mood", value: parseFloat(avgMood as string), fill: "#10b981" },
        { name: "Remaining", value: 10 - parseFloat(avgMood as string), fill: "#f3f4f6" } // 10 scale
    ];


    // Heatmap Dates: 14 days for Pro, 7 days for Free
    const daysToShow = isPro ? 14 : 7;
    const heatmapDates = Array.from({ length: daysToShow }).map((_, i) => {
        const d = subDays(new Date(), (daysToShow - 1) - i);
        return d;
    });

    return (
        <div className="space-y-6">

            {/* Weekly Overview - Always Donut */}
            {weeklyChartData && (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="col-span-1 border-none shadow-sm ring-1 ring-border/50">
                        <CardHeader>
                            <CardTitle>Weekly Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px] relative">
                            <div className={cn("h-full w-full relative", isMobile && "max-w-[250px] mx-auto flex items-center justify-center")}>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-bold">{weeklyChartData[0]?.value || 0}</span>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={weeklyChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {weeklyChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Weekly Stats Summary */}
                    <Card className="col-span-1 flex flex-col justify-center items-center p-6 text-center text-muted-foreground border-none shadow-sm ring-1 ring-border/50 bg-card/50">
                        <p className="font-medium text-foreground">Weekly Aggregate</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-5xl font-bold text-primary">
                                {weeklyChartData[0]?.value}
                            </span>
                            <span className="text-xl">/ 7</span>
                        </div>
                        <p className="text-sm mt-2">Active Days this Week</p>
                    </Card>
                </div>
            )}

            {/* AI Smart Insight Card */}
            <Card className="border-none shadow-md bg-gradient-to-r from-violet-600/10 via-purple-500/10 to-indigo-500/10 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-24 bg-primary/5 rounded-full blur-[60px] -mr-12 -mt-12 pointer-events-none" />

                {/* Locked Overlay for Free Users */}
                {!isPro && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-center p-6">
                        <div className="p-2 bg-primary/10 rounded-full mb-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-semibold text-lg">Unlock Wellness Pulse</h4>
                        <p className="text-sm text-muted-foreground mb-3 max-w-[250px]">
                            Get daily AI analysis connecting your sleep, mood, and habits.
                        </p>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Pro Feature</span>
                    </div>
                )}

                <CardContent className="p-6 flex items-start gap-4 relative z-10">
                    <div className="p-2.5 bg-primary/20 text-primary rounded-full shrink-0 mt-0.5">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div className={cn("space-y-1", !isPro && "blur-sm opacity-50 select-none")}>
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                            Wellness Pulse
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary uppercase tracking-wider">AI Insight</span>
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {(() => {
                                // If not pro, show placeholder text behind blur
                                if (!isPro) return "Your sleep quality directly impacts your mood score. On days with 7+ hours of sleep, your mood averages 15% higher. Upgrade to unlock.";

                                // Basic Correlation Logic
                                const highSleepDays = sleepData.filter((d: any) => d.sleep_hours >= 7);
                                const lowSleepDays = sleepData.filter((d: any) => d.sleep_hours < 7);

                                // Find mood for these days (approximation matching dates)
                                const getAvgMoodForDays = (days: any[]) => {
                                    if (days.length === 0) return 0;
                                    let totalMood = 0;
                                    let count = 0;
                                    days.forEach(day => {
                                        const dateStr = day.date?.split('T')[0];
                                        const moodEntry = processedMood[dateStr]; // utilizing the processedMood map from parent
                                        if (moodEntry) {
                                            totalMood += (moodEntry.total / moodEntry.count);
                                            count++;
                                        }
                                    });
                                    return count > 0 ? totalMood / count : 0;
                                };

                                const moodOnHighSleep = getAvgMoodForDays(highSleepDays);
                                const moodOnLowSleep = getAvgMoodForDays(lowSleepDays);
                                const diff = moodOnHighSleep - moodOnLowSleep;

                                if (sleepData.length < 3) return "Keep tracking your sleep and mood for a few more days to unlock personalized patterns!";

                                if (diff > 1) {
                                    return `You tend to feel significantly better (approx +${diff.toFixed(1)} mood) when you get over 7 hours of sleep. Prioritizing rest is your key lever right now.`;
                                } else if (diff < -1) {
                                    return "Interestingly, your mood stays resilient even with less sleep. Focus on sleep quality rather than just duration.";
                                } else if (parseFloat(avgSleep as string) > 8) {
                                    return "You've been getting plenty of rest lately! This solid foundation is perfect for tackling more challenging habits.";
                                } else if (parseFloat(avgMood as string) < 5) {
                                    return "Your mood has been a bit low lately. Consider checking your sleep consistency—small adjustments can have big impacts.";
                                } else {
                                    return "Your data is building up nicely! We're analyzing the link between your rest and happiness. Keep it up!";
                                }
                            })()}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Sleep Analysis */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden relative">
                    <CardHeader>
                        <CardTitle>Sleep Analysis</CardTitle>
                        <CardDescription>{isMobile ? "Average hours past 7 days" : "Sleep trend over time"}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] relative">
                        {isMobile ? (
                            // Mobile Ring Chart
                            <div className="w-full max-w-[250px] mx-auto h-full flex items-center justify-center relative">
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                    <span className="text-4xl font-bold text-[#8884d8]">{avgSleep}</span>
                                    <span className="text-sm text-muted-foreground">hours avg</span>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sleepRingData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={100}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            <Cell fill="#8884d8" />
                                            <Cell fill="#f3f4f6" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            // Desktop Area Chart
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sleepData}>
                                    <defs>
                                        <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => format(parseISO(str), "MMM d")}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip
                                        labelFormatter={(str) => format(parseISO(str), "MMM d, yyyy")}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <Area type="monotone" dataKey="sleep_hours" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Mood Analysis */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden relative">
                    <CardHeader>
                        <CardTitle>Mood Insights</CardTitle>
                        <CardDescription>{isMobile ? "Average mood past 7 days" : "Mood changes over time"}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] relative">
                        {isMobile ? (
                            // Mobile Ring Chart
                            <div className="w-full max-w-[250px] mx-auto h-full flex items-center justify-center relative">
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                    <span className="text-4xl font-bold text-[#10b981]">{avgMood}</span>
                                    <span className="text-sm text-muted-foreground">/ 10 avg</span>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={moodRingData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={100}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            <Cell fill="#10b981" />
                                            <Cell fill="#f3f4f6" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            // Desktop Line Chart
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={moodChartData}>
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => format(parseISO(str), "MMM d")}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis domain={[0, 10]} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        labelFormatter={(str) => format(parseISO(str), "MMM d, yyyy")}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Habit Analytics */}
            <Card className="border-none shadow-sm ring-1 ring-border/50">
                <CardHeader>
                    <CardTitle>Habit Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {habitMetrics.map(habit => (
                            <div key={habit.id} className="flex flex-col md:flex-row md:items-center gap-4 border-b border-border/50 pb-6 last:border-0 last:pb-0">
                                <div className="w-full md:w-1/4">
                                    <h4 className="font-semibold">{habit.title}</h4>
                                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-wider font-semibold">Weekly</span>
                                            <span className="text-xl font-bold text-primary">{habit.weeklyScore}%</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-wider font-semibold">Momentum</span>
                                            <span className="text-xl font-bold text-foreground">{habit.momentumScore}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Heatmap - Kept for mobile as it's not a bar chart, just squares */}
                                <div className="flex-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                                    <div className="flex gap-1.5 min-w-max">
                                        {heatmapDates.map(date => {
                                            const dateStr = format(date, 'yyyy-MM-dd');
                                            const isCompleted = habit.dates.includes(dateStr);
                                            return (
                                                <div key={dateStr} className="flex flex-col items-center gap-1">
                                                    <div
                                                        title={`${format(date, 'MMM d')}: ${isCompleted ? 'Completed' : 'Missed'}`}
                                                        className={cn(
                                                            "w-8 h-8 rounded-md transition-all",
                                                            isCompleted
                                                                ? "bg-green-500 shadow-sm shadow-green-500/20"
                                                                : "bg-secondary/50 border border-border"
                                                        )}
                                                    />
                                                    <span className="text-[10px] text-muted-foreground/70">
                                                        {format(date, 'd')}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {habitMetrics.length === 0 && (
                            <div className="text-center text-muted-foreground p-4">No habit data available yet. Start tracking to see insights!</div>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
