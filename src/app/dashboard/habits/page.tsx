import { createClient } from "@/lib/supabase/server"
import { CreateHabitDialog } from "./create-habit-dialog"
import { HabitCard } from "./habit-card"
import { startOfWeek, endOfWeek, format } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function HabitsPage() {
    const supabase = await createClient()

    const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .neq('archived', true)
        .order('created_at', { ascending: false })

    // Fetch this week's logs
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 }) // Sunday

    // Add buffer to query to handle timezone shifts (e.g. UTC date might be before Server Local Week Start)
    const queryStart = new Date(weekStart);
    queryStart.setDate(queryStart.getDate() - 2);

    const queryEnd = new Date(weekEnd);
    queryEnd.setDate(queryEnd.getDate() + 2);

    const { data: logs } = await supabase
        .from('habit_logs')
        .select('habit_id, completed_at')
        .gte('completed_at', queryStart.toISOString())
        .lte('completed_at', queryEnd.toISOString())

    // Map habit_id -> Set of completed YYYY-MM-DD
    const completedMap = new Map<number, Set<string>>()

    logs?.forEach(log => {
        const dateKey = log.completed_at.split('T')[0]
        if (!completedMap.has(log.habit_id)) {
            completedMap.set(log.habit_id, new Set())
        }
        completedMap.get(log.habit_id)?.add(dateKey)
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Habits</h2>
                    <p className="text-muted-foreground">Manage and track your daily habits.</p>
                </div>
                <CreateHabitDialog />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {habits?.map((habit) => (
                    <HabitCard
                        key={habit.id}
                        habit={habit}
                        completedDates={Array.from(completedMap.get(habit.id) || [])}
                        weekStart={weekStart.toISOString()}
                    />
                ))}
                {habits?.length === 0 && (
                    <div className="col-span-full flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed text-muted-foreground">
                        <p>No habits yet. Create one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
