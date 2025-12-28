import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HabitCalendar } from "@/components/dashboard/habit-calendar"

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
    const supabase = await createClient()

    // 1. Fetch Habit Logs
    const { data: habitLogs } = await supabase
        .from('habit_logs')
        .select('completed_at, habits(title)');

    // Process dates for FullCalendar
    const activityMap: Record<string, number> = {};

    habitLogs?.forEach(log => {
        if (!log.completed_at) return;
        // Use YYYY-MM-DD format. 
        // Note: This effectively uses UTC date if completed_at is Timestamptz. 
        // For simple visualization it's acceptable.
        const date = new Date(log.completed_at).toISOString().split('T')[0];
        activityMap[date] = (activityMap[date] || 0) + 1;
    });

    const activityData = Object.entries(activityMap).map(([date, count]) => ({
        date,
        count
    }));

    return (
        <div className="space-y-4 h-auto md:h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
                    <p className="text-muted-foreground">Visualize your consistency over time.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-12 h-full pb-8">
                {/* Main Calendar Card - Takes 8 columns */}
                <Card className="col-span-1 lg:col-span-8 flex flex-col h-full overflow-hidden">
                    <CardHeader>
                        <CardTitle>Habit Consistency</CardTitle>
                        <CardDescription>
                            Your daily habit completion log. Darker green indicates more completed habits.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 min-h-[500px]">
                        <HabitCalendar activityData={activityData} />
                    </CardContent>
                </Card>

                {/* Side Panel - Recent Activity - Takes 4 columns */}
                <Card className="col-span-1 lg:col-span-4 flex flex-col h-full overflow-hidden">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest completed habits</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-y-auto max-h-[600px]">
                        <div className="space-y-4">
                            {habitLogs?.slice(0, 8).map((log: any, i) => (
                                <div key={i} className="flex items-center p-2 rounded hover:bg-muted/50 transition-colors">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mr-3 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{log.habits?.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(log.completed_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(!habitLogs || habitLogs.length === 0) && (
                                <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

