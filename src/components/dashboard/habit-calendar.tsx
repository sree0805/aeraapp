"use client"

import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick if we want it later
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface HabitCalendarProps {
    activityData: { date: string; count: number }[]
}

export function HabitCalendar({ activityData }: HabitCalendarProps) {

    // Convert daily stats to events
    // We will use 'background' events for coloring the cells based on intensity
    const events = activityData.map(day => {
        // Determine intensity color
        // This is a simple scale, can be refined
        let color = 'rgba(34, 197, 94, 0.2)' // default slight green
        if (day.count >= 1) color = 'rgba(34, 197, 94, 0.4)'
        if (day.count >= 3) color = 'rgba(34, 197, 94, 0.6)'
        if (day.count >= 5) color = 'rgba(34, 197, 94, 0.8)'
        if (day.count >= 8) color = 'rgba(34, 197, 94, 1.0)'

        return {
            title: `${day.count} Habits`, // Optional: text to show? Background events don't show text usually.
            start: day.date,
            display: 'background',
            backgroundColor: color,
            allDay: true
        }
    })

    // We can ALSO add "foreground" events just to show the count number if we want
    const textEvents = activityData.map(day => ({
        title: String(day.count),
        start: day.date,
        allDay: true,
        classNames: ['text-center', 'font-bold', 'text-xs', 'pointer-events-none']
    }))

    return (
        <div className="h-full w-full calendar-wrapper">
            <style jsx global>{`
        .fc {
          --fc-border-color: hsl(var(--border));
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: transparent;
          --fc-today-bg-color: hsl(var(--accent) / 0.1);
          font-family: inherit;
        }
        .fc-theme-standard td, .fc-theme-standard th {
            border-color: hsl(var(--border));
        }
        .fc-col-header-cell-cushion {
            padding-top: 8px;
            padding-bottom: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            color: hsl(var(--muted-foreground));
        }
        .fc-button-primary {
            background-color: hsl(var(--primary));
            border-color: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
        }
        .fc-button-primary:hover {
            background-color: hsl(var(--primary) / 0.9);
            border-color: hsl(var(--primary) / 0.9);
        }
        .fc-daygrid-day-number {
             color: hsl(var(--foreground));
             font-size: 0.875rem;
             padding: 8px;
        }
      `}</style>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth'
                }}
                height="auto" // Let container control it or grow
                contentHeight="auto"
                aspectRatio={1.5}
                events={[...events, ...textEvents]}
                selectable={true}
                editable={false}
            />
        </div>
    )
}
