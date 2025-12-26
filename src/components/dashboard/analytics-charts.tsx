"use client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, subDays, isSameDay } from "date-fns";
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
}

export function AnalyticsDashboard({ sleepData, moodData, habitMetrics, weeklyChartData }: AnalyticsProps) {

    // Process Mood Data: Average mood per day
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

    // Heatmap Dates (Last 14 days)
    const heatmapDates = Array.from({ length: 14 }).map((_, i) => {
        const d = subDays(new Date(), 13 - i); // 13 days ago to today
        return d;
    });

    return (
        <div className="space-y-6">

            {/* Weekly Overview Donut */}
            {weeklyChartData && (
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Weekly Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px]">
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
                                    >
                                        {weeklyChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Placeholder for future summary metrics? Taking up 1/3, leaving Sleep/Mood to row below or separate */}
                    <Card className="col-span-2 flex flex-col justify-center items-center p-6 text-center text-muted-foreground">
                        <p>Weekly Aggregate vs Remaining Days</p>
                        <span className="text-4xl font-bold text-primary mt-2">
                            {weeklyChartData[0].value} / 7
                        </span>
                        <p className="text-sm">Active Days this Week</p>
                    </Card>
                </div>
            )}

            {/* Sleep Analysis */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Sleep Trends (Hours)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
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
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(str) => format(parseISO(str), "MMM d, yyyy")}
                                />
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <Area type="monotone" dataKey="sleep_hours" stroke="#8884d8" fillOpacity={1} fill="url(#colorSleep)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Mood Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mood History</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={moodChartData}>
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => format(parseISO(str), "MMM d")}
                                />
                                <YAxis domain={[0, 10]} />
                                <Tooltip labelFormatter={(str) => format(parseISO(str), "MMM d, yyyy")} />
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Habit Analytics */}
            <Card>
                <CardHeader>
                    <CardTitle>Habit Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {habitMetrics.map(habit => (
                            <div key={habit.id} className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 last:border-0">
                                <div className="w-full md:w-1/4">
                                    <h4 className="font-semibold">{habit.title}</h4>
                                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                        <div className="flex flex-col">
                                            <span className="text-xs uppercase tracking-wider">Weekly</span>
                                            <span className="text-xl font-bold text-primary">{habit.weeklyScore}%</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs uppercase tracking-wider">Momentum</span>
                                            <span className="text-xl font-bold text-foreground">{habit.momentumScore}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Heatmap */}
                                <div className="flex-1 overflow-x-auto">
                                    <div className="flex gap-1 min-w-max">
                                        {heatmapDates.map(date => {
                                            const dateStr = format(date, 'yyyy-MM-dd');
                                            const isCompleted = habit.dates.includes(dateStr);
                                            return (
                                                <div key={dateStr} className="flex flex-col items-center gap-1">
                                                    <div
                                                        title={`${format(date, 'MMM d')}: ${isCompleted ? 'Completed' : 'Missed'}`}
                                                        className={cn(
                                                            "w-8 h-8 rounded-sm transition-colors",
                                                            isCompleted ? "bg-green-500" : "bg-secondary"
                                                        )}
                                                    />
                                                    <span className="text-[10px] text-muted-foreground">
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
                            <div className="text-center text-muted-foreground">No habit data available.</div>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
