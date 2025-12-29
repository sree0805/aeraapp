import { createClient } from "@/lib/supabase/server"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { HabitCalendar } from "@/components/dashboard/habit-calendar"

export const dynamic = "force-dynamic"

type HabitLog = {
    completed_at: string
    habit: {
        title: string
    } | null
}

export default async function CalendarPage() {
    const supabase = await createClient()

    // We explicitly cast the response data to match our expected shape
    const { data: rawData, error } = await supabase
        .from("habit_logs")
        .select(`
      completed_at,
      habit:habits ( title )
    `)
        .order("completed_at", { ascending: false })

    if (error) {
        console.error("Error fetching habit logs:", error)
    }

    // Safe cast with validation if needed, or just type assertion
    const habitLogs = (rawData as unknown as HabitLog[]) || []

    // Build activity map for calendar
    const activityMap: Record<string, number> = {}

    habitLogs.forEach((log) => {
        if (!log.completed_at) return

        const date = new Date(log.completed_at)
            .toISOString()
            .split("T")[0]

        activityMap[date] = (activityMap[date] || 0) + 1
    })

    // Format data for the HabitCalendar component
    const activityData = Object.entries(activityMap).map(
        ([date, count]) => ({
            date,
            count,
        })
    )

    return (
        <div className="space-y-6 h-full p-0">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
                    <p className="text-muted-foreground">
                        Visualize your consistency over time.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-12 h-auto">
                {/* Calendar Section */}
                <Card className="lg:col-span-8 flex flex-col overflow-hidden h-auto">
                    <CardHeader>
                        <CardTitle>Habit Consistency</CardTitle>
                        <CardDescription className="line-clamp-2 md:line-clamp-none">
                            Darker green means more habits completed that day.
                        </CardDescription>
                    </CardHeader>
                    {/* Mobile: Min height 350px. Desktop: Flex grow */}
                    <CardContent className="p-4 min-h-[350px] flex-1 overflow-auto">
                        <HabitCalendar activityData={activityData} />
                    </CardContent>
                </Card>

                {/* Recent Activity Section */}
                <Card className="lg:col-span-4 flex flex-col h-[400px] md:h-[600px]">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest completed habits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 overflow-y-auto flex-1 pr-2">
                        {habitLogs.length > 0 ? (
                            habitLogs.slice(0, 20).map((log, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-border"
                                >
                                    <span className="mt-2 h-2 w-2 rounded-full bg-green-500 shrink-0 shadow-sm shadow-green-500/50" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-none truncate">
                                            {log.habit?.title ?? "Unknown Habit"}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(log.completed_at).toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                                <p>No activity recorded yet.</p>
                                <p className="text-xs">Complete a habit to see it here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
