"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OverviewChartsProps {
    dailyData: {
        completed: number
        total: number
    }
    weeklyData: {
        completedDays: number
    }
    hideDaily?: boolean
    hideWeekly?: boolean
}

export function OverviewCharts({ dailyData, weeklyData, hideDaily, hideWeekly }: OverviewChartsProps) {
    const dailyRemaining = Math.max(0, dailyData.total - dailyData.completed)
    // Use CSS variables for colors to match theme
    const dailyChart = [
        { name: "Completed", value: dailyData.completed, fill: "hsl(var(--primary))" },
        { name: "Remaining", value: dailyRemaining, fill: "hsl(var(--muted))" },
    ]

    const weeklyRemaining = Math.max(0, 7 - weeklyData.completedDays)
    const weeklyChart = [
        { name: "Active Days", value: weeklyData.completedDays, fill: "hsl(var(--primary))" },
        { name: "Remaining", value: weeklyRemaining, fill: "hsl(var(--muted))" },
    ]

    return (
        <div className={`grid gap-6 ${hideDaily || hideWeekly ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
            {/* Daily Overview */}
            {!hideDaily && (
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium tracking-tight">Daily Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full min-w-[350px] flex items-center justify-between gap-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dailyChart}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={75}
                                        startAngle={90}
                                        endAngle={-270}
                                        paddingAngle={5}
                                        cornerRadius={10}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {dailyChart.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex-1 flex flex-col justify-center space-y-1 pr-4">
                                <span className="text-4xl font-bold tracking-tighter text-foreground">
                                    {dailyData.completed} <span className="text-xl text-muted-foreground font-medium">/ {dailyData.total}</span>
                                </span>
                                <p className="text-sm text-muted-foreground font-medium">Habits Done Today</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Weekly Overview */}
            {!hideWeekly && (
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium tracking-tight">Weekly Consistency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full min-w-[350px] flex items-center justify-between gap-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={weeklyChart}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={75}
                                        startAngle={90}
                                        endAngle={-270}
                                        paddingAngle={5}
                                        cornerRadius={10}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {weeklyChart.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex-1 flex flex-col justify-center space-y-1 pr-4">
                                <span className="text-4xl font-bold tracking-tighter text-foreground">
                                    {weeklyData.completedDays} <span className="text-xl text-muted-foreground font-medium">/ 7</span>
                                </span>
                                <p className="text-sm text-muted-foreground font-medium">Active Days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
