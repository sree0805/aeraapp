"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil } from "lucide-react"
import { toggleTask, deleteTask } from "./actions"
import { useTransition, useState } from "react"
import { cn } from "@/lib/utils"
import { EditTaskDialog } from "./edit-task-dialog"

interface TaskItemProps {
    task: {
        id: number
        title: string
        is_completed: boolean
        priority: string
        description?: string | null
    }
}

export function TaskItem({ task }: TaskItemProps) {
    const [isPending, startTransition] = useTransition()
    const [isEditOpen, setIsEditOpen] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between space-x-2 rounded-md border p-4 shadow-sm hover:bg-muted/50 transition-colors group">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={`task-${task.id}`}
                        checked={task.is_completed}
                        onCheckedChange={(checked) => {
                            startTransition(() => {
                                toggleTask(task.id, checked === true).then(res => {
                                    if (res?.error) alert(res.error)
                                })
                            })
                        }}
                        disabled={isPending}
                    />
                    <div className="flex flex-col">
                        <label
                            htmlFor={`task-${task.id}`}
                            className={cn(
                                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                                task.is_completed && "line-through text-muted-foreground"
                            )}
                        >
                            {task.title}
                        </label>
                        {task.description && (
                            <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{task.description}</p>
                        )}
                    </div>

                    {task.priority === 'high' && <span className="text-xs text-red-500 font-bold px-2 py-0.5 bg-red-100 dark:bg-red-900/30 rounded-full">High</span>}
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => setIsEditOpen(true)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                            startTransition(() => {
                                deleteTask(task.id).then(res => {
                                    if (res?.error) alert(res.error)
                                })
                            })
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <EditTaskDialog task={task} open={isEditOpen} onOpenChange={setIsEditOpen} />
        </>
    )
}
