"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Need to ensure I have Progress component or use custom bar
import { Moon, Briefcase, Coffee } from "lucide-react";

interface Stats {
    work: number;
    rest: number;
    leisure: number;
    total: number;
}

export function BalanceVisualizer({ stats }: { stats: Stats }) {

    // Calculate percentages relative to 24h or relative to Total Logged?
    // User wants 8+8+8 24h split.
    const getPercent = (hours: number) => Math.min((hours / 8) * 100, 100);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                {/* Rest Card */}
                <Card className="border-indigo-200 dark:border-indigo-900 border-l-4 border-l-indigo-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center text-indigo-500">
                            <Moon className="w-4 h-4 mr-2" />
                            Rest
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.rest.toFixed(1)} hrs</div>
                        <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${getPercent(stats.rest)}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Goal: 8h</p>
                    </CardContent>
                </Card>

                {/* Work Card */}
                <Card className="border-blue-200 dark:border-blue-900 border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center text-blue-500">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Work
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.work.toFixed(1)} hrs</div>
                        <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${getPercent(stats.work)}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Goal: 8h</p>
                    </CardContent>
                </Card>

                {/* Leisure Card */}
                <Card className="border-green-200 dark:border-green-900 border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center text-green-500">
                            <Coffee className="w-4 h-4 mr-2" />
                            Leisure
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.leisure.toFixed(1)} hrs</div>
                        <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${getPercent(stats.leisure)}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Goal: 8h</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Total Day Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-12 w-full rounded-md overflow-hidden bg-secondary">
                        {stats.total > 0 ? (
                            <>
                                <div className="bg-indigo-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${(stats.rest / 24) * 100}%` }}>
                                    {stats.rest > 0 && "Rest"}
                                </div>
                                <div className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${(stats.work / 24) * 100}%` }}>
                                    {stats.work > 0 && "Work"}
                                </div>
                                <div className="bg-green-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${(stats.leisure / 24) * 100}%` }}>
                                    {stats.leisure > 0 && "Leisure"}
                                </div>
                                {/* Remaining */}
                                <div className="bg-transparent flex-1" />
                            </>
                        ) : (
                            <div className="flex items-center justify-center w-full text-muted-foreground text-sm">
                                No tasks logged. Add tasks with categories to see your balance.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
