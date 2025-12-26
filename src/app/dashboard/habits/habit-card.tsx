"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Pencil, Activity, Book, Briefcase, Coffee, Droplets, Dumbbell, Heart, Moon, Music, Sun, Utensils, Zap } from "lucide-react"
import { archiveHabit, toggleHabitCompletion } from "./actions"
import { cn } from "@/lib/utils"
// import { useTransition } from "react" // Not using useTransition for checkbox due to multiple optimistics needed, managing local state
import { useState, useOptimistic, startTransition } from "react"
import { EditHabitDialog } from "./edit-habit-dialog"
import { addDays, format, isSameDay } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"

const iconMap: Record<string, any> = {
    activity: Activity,
    book: Book,
    briefcase: Briefcase,
    coffee: Coffee,
    droplets: Droplets,
    dumbbell: Dumbbell,
    heart: Heart,
    moon: Moon,
    music: Music,
    sun: Sun,
    utensils: Utensils,
    zap: Zap,
}

interface HabitCardProps {
    habit: {
        id: number
        title: string
        description: string | null
        frequency: string
        streak: number | null
        icon?: string | null
        archived?: boolean | null
    }
    completedDates: string[] // YYYY-MM-DD
    weekStart: string // ISO
}

export function HabitCard({ habit, completedDates, weekStart }: HabitCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const startDate = new Date(weekStart)
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i))

    // Icon resolution
    const IconComponent = (habit.icon && iconMap[habit.icon]) ? iconMap[habit.icon] : Activity

    // Optimistic UI for completions
    const [optimisticCompletedDates, addOptimisticDate] = useOptimistic(
        completedDates,
        (state, { date, completed }: { date: string; completed: boolean }) => {
            if (completed) {
                return [...state, date]
            } else {
                return state.filter((d) => d !== date)
            }
        }
    )

    const handleToggle = async (dateStr: string, currentStatus: boolean) => {
        // Optimistic update
        startTransition(() => {
            addOptimisticDate({ date: dateStr, completed: !currentStatus })
        })

        // Server action
        await toggleHabitCompletion(habit.id, !currentStatus, dateStr)
    }

    return (
        <>
            <Card className="transition-all hover:border-indigo-200 dark:hover:border-indigo-900 group">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <IconComponent className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-base font-semibold">
                            {habit.title}
                        </CardTitle>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                            onClick={() => setIsEditOpen(true)}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <form action={archiveHabit.bind(null, habit.id)}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Archive</span>
                            </Button>
                        </form>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription className="mb-4">{habit.description || "No description"}</CardDescription>

                    {/* Weekly Checkboxes */}
                    <div className="flex justify-between items-center bg-secondary/30 p-2 rounded-lg">
                        {weekDays.map((day) => {
                            const dateStr = format(day, 'yyyy-MM-dd')
                            const isCompleted = optimisticCompletedDates.includes(dateStr)
                            const isToday = isSameDay(day, new Date())
                            const isFuture = day > new Date() && !isToday // Simple check

                            return (
                                <div key={dateStr} className="flex flex-col items-center gap-2">
                                    <span className={cn("text-xs font-medium", isToday ? "text-primary" : "text-muted-foreground")}>
                                        {format(day, 'EEE')}
                                    </span>
                                    <Checkbox
                                        checked={isCompleted}
                                        disabled={isFuture}
                                        onCheckedChange={() => !isFuture && handleToggle(dateStr, isCompleted)}
                                        className={cn(
                                            "h-6 w-6 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
                                            isToday && !isCompleted && "border-primary",
                                            isFuture && "opacity-50 cursor-not-allowed bg-muted"
                                        )}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-xs text-muted-foreground">
                            {habit.frequency}
                        </span>
                        <div className="text-muted-foreground">
                            Streak: <span className="font-medium text-foreground">{habit.streak || 0}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <EditHabitDialog habit={{ ...habit, icon: habit.icon ?? null }} open={isEditOpen} onOpenChange={setIsEditOpen} />
        </>
    )
}
