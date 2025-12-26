import { createClient } from "@/lib/supabase/server"
import { CreateTaskForm } from "./create-task-form"
import { TaskItem } from "./task-item"

export const dynamic = 'force-dynamic'

export default async function TasksPage() {
    const supabase = await createClient()

    const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .order('is_completed', { ascending: true }) // Incomplete first
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-4 max-w-3xl mx-auto">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
                <p className="text-muted-foreground">Stay organized with your daily to-dos.</p>
            </div>

            <CreateTaskForm />

            <div className="space-y-2 group">
                {tasks?.map((task) => (
                    <TaskItem key={task.id} task={task as any} />
                ))}
                {(!tasks || tasks.length === 0) && (
                    <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed text-muted-foreground">
                        <p>No tasks yet. Enjoy your free time!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
