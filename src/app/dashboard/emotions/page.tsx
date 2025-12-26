import { createClient } from "@/lib/supabase/server";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { EmotionsCalendar } from "./emotions-calendar";

export const dynamic = 'force-dynamic';

export default async function EmotionsPage() {
    const supabase = await createClient();

    // Default to current month for MVP
    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);

    // Fetch logs for this month
    const { data: logs } = await supabase
        .from("emotion_logs")
        .select("*")
        .gte("created_at", currentMonthStart.toISOString())
        .lte("created_at", currentMonthEnd.toISOString())
        .order("created_at", { ascending: true });

    // Map logs to dates (Last log of the day takes precedence)
    const dayLogs: Record<string, any> = {};
    logs?.forEach(log => {
        const dateKey = log.created_at.split('T')[0];
        dayLogs[dateKey] = log;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Emotional Journey</h2>
                <p className="text-muted-foreground">{format(today, "MMMM yyyy")}</p>
            </div>

            <EmotionsCalendar
                currentMonthStart={currentMonthStart}
                currentMonthEnd={currentMonthEnd}
                dayLogs={dayLogs}
            />

            <div className="text-sm text-muted-foreground text-center">
                * Click on a mood to view details.
            </div>
        </div>
    );
}
