"use client"

import { useState } from "react"
import { format, eachDayOfInterval, isToday, getDay } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getEmotionId, EmotionIcon } from "@/components/dashboard/emotion-icons"

interface EmotionsCalendarProps {
    currentMonthStart: Date
    currentMonthEnd: Date
    dayLogs: Record<string, any>
}

export function EmotionsCalendar({ currentMonthStart, currentMonthEnd, dayLogs }: EmotionsCalendarProps) {
    const [selectedLog, setSelectedLog] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Calendar generation
    const days = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd })

    const startDayOfWeek = getDay(currentMonthStart) // 0 = Sun
    const padding = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
    const paddingDays = Array(padding).fill(null)

    const handleDateClick = (log: any) => {
        if (log) {
            setSelectedLog(log)
            setIsDialogOpen(true)
        }
    }

    return (
        <>
            <Card className="relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none -z-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
                </div>
                <CardContent className="p-6 relative z-10">
                    <div className="grid grid-cols-7 gap-2 text-center mb-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="text-sm font-medium text-muted-foreground">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {paddingDays.map((_, i) => (
                            <div key={`pad-${i}`} className="aspect-square" />
                        ))}

                        {days.map((day) => {
                            const dateKey = format(day, 'yyyy-MM-dd')
                            const log = dayLogs[dateKey]
                            const isCurrentDay = isToday(day)

                            return (
                                <div
                                    key={dateKey}
                                    onClick={() => handleDateClick(log)}
                                    className={cn(
                                        "aspect-square flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm transition-all relative group",
                                        isCurrentDay ? "ring-2 ring-primary" : "",
                                        log ? "hover:bg-muted/50 cursor-pointer" : "cursor-default"
                                    )}
                                >
                                    <span className={cn("text-xs absolute top-1 left-1", !log && "text-muted-foreground")}>
                                        {format(day, 'd')}
                                    </span>

                                    {log ? (
                                        <div className="flex flex-col items-center justify-center w-full h-full p-2">
                                            <EmotionIcon
                                                id={getEmotionId(log.mood_score)}
                                                className="w-full h-full max-w-[32px] max-h-[32px] !p-1"
                                            />
                                            {/* Little indicator dot if note exists */}
                                            {log.note && (
                                                <div className="absolute bottom-1 w-1.5 h-1.5 bg-primary/50 rounded-full" />
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground/20 text-xl font-bold">
                                            —
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-2xl">
                            {selectedLog && (
                                <EmotionIcon
                                    id={getEmotionId(selectedLog.mood_score)}
                                    className="w-10 h-10"
                                />
                            )}
                            <span>Mood Details</span>
                        </DialogTitle>
                        <DialogDescription>
                            {selectedLog && format(new Date(selectedLog.created_at), "EEEE, MMMM do, yyyy")}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <span className="font-semibold">Score: {selectedLog.mood_score}/10</span>
                                <div className="flex gap-2">
                                    {selectedLog.emotions?.map((e: string) => (
                                        <span key={e} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{e}</span>
                                    ))}
                                </div>
                            </div>

                            {selectedLog.note && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">Journal Note</h4>
                                    <p className="text-sm italic border-l-2 pl-4 py-1">"{selectedLog.note}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
