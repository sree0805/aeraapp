"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client"; // Use Client Component-safe client
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/hooks/use-notifications";

export function Notifications() {
    const { sendNotification } = useNotifications();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const supabase = createClient();
    // Track scheduled timeout IDs to prevent duplicates
    const scheduledTimeouts = useState<Set<string>>(new Set())[0];

    // Main Sync & Schedule Function
    const syncAndSchedule = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch DB Tasks
        const { data: tasks } = await supabase
            .from('tasks')
            .select('id, title, scheduled_at, reminder_minutes, is_completed')
            .eq('user_id', user.id)
            .eq('is_completed', false)
            .not('scheduled_at', 'is', null);

        const now = Date.now();
        const newReminders: any[] = [];

        if (tasks) {
            tasks.forEach(task => {
                if (!task.scheduled_at) return;
                const scheduledTime = new Date(task.scheduled_at).getTime();
                const reminderTime = scheduledTime - ((task.reminder_minutes || 5) * 60000);

                if (reminderTime > now) {
                    newReminders.push({
                        id: `task-${task.id}`,
                        title: `Reminder: ${task.title}`,
                        body: `Due in ${task.reminder_minutes || 5} minutes`,
                        timestamp: reminderTime,
                    });
                }
            });
        }

        // 2. Fetch Local Test Reminders
        const stored = localStorage.getItem('scheduled_reminders');
        const localReminders: any[] = stored ? JSON.parse(stored) : [];
        const validLocal = localReminders.filter((r: any) => r.timestamp > now);

        // Update local storage to clean up old ones
        if (validLocal.length !== localReminders.length) {
            localStorage.setItem('scheduled_reminders', JSON.stringify(validLocal));
        }

        const allReminders = [...newReminders, ...validLocal];

        // 3. Schedule Timeouts
        allReminders.forEach(rem => {
            if (scheduledTimeouts.has(rem.id)) return;

            const delay = rem.timestamp - now;
            if (delay <= 0) return;

            console.log(`Scheduling reminder: ${rem.title} in ${delay}ms`);

            // Mark as scheduled
            scheduledTimeouts.add(rem.id);

            setTimeout(() => {
                console.log(`Firing reminder: ${rem.title}`);

                sendNotification(rem.title, {
                    body: rem.body,
                    tag: rem.id
                });
                new Audio('/notification.mp3').play().catch(() => { });

                // Update UI
                setNotifications(prev => [{
                    id: rem.id,
                    title: rem.title,
                    message: rem.body,
                    created_at: new Date().toISOString(),
                    is_read: false
                }, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Cleanup from local storage if it was local
                if (rem.id.startsWith('test-')) {
                    const current = JSON.parse(localStorage.getItem('scheduled_reminders') || '[]');
                    const remaining = current.filter((r: any) => r.id !== rem.id);
                    localStorage.setItem('scheduled_reminders', JSON.stringify(remaining));
                }

                // Allow re-scheduling if needed
                scheduledTimeouts.delete(rem.id);

            }, delay);
        });

    }, [supabase, sendNotification, scheduledTimeouts]);

    // Initial Sync
    useEffect(() => {
        syncAndSchedule();

        // Listen for window focus to catch updates
        window.addEventListener('focus', syncAndSchedule);
        return () => window.removeEventListener('focus', syncAndSchedule);
    }, [syncAndSchedule]);

    // Daily Reminder Logic
    useEffect(() => {
        const checkDaily = () => {
            const enabled = localStorage.getItem('daily_reminder') === 'true';
            if (!enabled) return;

            const now = new Date();
            if (now.getHours() >= 9) {
                const today = now.toDateString();
                const last = localStorage.getItem('last_daily_reminder_date');
                if (last !== today) {
                    sendNotification("Good Morning! ☀️", { body: "Time to check your habits." });
                    localStorage.setItem('last_daily_reminder_date', today);
                }
            }
        };
        checkDaily();
        const interval = setInterval(checkDaily, 60000); // Check every min for daily greeting
        return () => clearInterval(interval);
    }, [sendNotification]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (data) {
                setNotifications(prev => {
                    // Merge with any local notifications generated before fetch
                    // Filter out duplicates if any (ID check)
                    const existingIds = new Set(data.map(n => n.id));
                    const locals = prev.filter(n => !existingIds.has(n.id));
                    return [...locals, ...data];
                });
                setUnreadCount(prev => prev + data.filter(n => !n.is_read).length);
            }
        };

        fetchNotifications();

        const channel = supabase
            .channel('realtime-notifications')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications' },
                (payload) => {
                    const newNotif = payload.new;
                    setNotifications((prev) => [newNotif, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                    new Audio('/notification.mp3').play().catch(() => { });

                    sendNotification(newNotif.title || "New Notification", {
                        body: newNotif.message || "You have a new alert",
                        tag: newNotif.id
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, sendNotification]);

    const markRead = async () => {
        // Optimistic update
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" onClick={markRead}>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-background">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[300px] p-0">
                <div className="p-4 border-b font-semibold">Notifications</div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} className={`p-3 border-b text-sm hover:bg-muted/50 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}>
                                <div className="font-medium">{n.title}</div>
                                <div className="text-muted-foreground">{n.message}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
