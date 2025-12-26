'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { startOfDay, endOfDay } from 'date-fns'

export async function createHabit(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Authentication required. Please refresh or sign in again.' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const frequency = formData.get('frequency') as string
    const icon = formData.get('icon') as string

    const { error } = await supabase
        .from('habits')
        .insert({
            title,
            description,
            frequency,
            icon,
            user_id: user.id,
            archived: false
        })

    if (error) {
        console.error('Error creating habit:', error)
        return { error: 'Failed to create habit' }
    }

    revalidatePath('/dashboard/habits')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateHabit(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const frequency = formData.get('frequency') as string
    const icon = formData.get('icon') as string

    const { error } = await supabase
        .from('habits')
        .update({ title, description, frequency, icon })
        .eq('id', id)

    if (error) {
        console.error('Error updating habit:', error)
        return { error: 'Failed to update habit' }
    }

    revalidatePath('/dashboard/habits')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function archiveHabit(id: number) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('habits')
        .update({ archived: true })
        .eq('id', id)

    if (error) {
        console.error('Error archiving habit:', error)
        throw new Error('Failed to archive habit')
    }

    revalidatePath('/dashboard/habits')
    revalidatePath('/dashboard')
}

export async function deleteHabit(id: number) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting habit:', error)
        throw new Error('Failed to delete habit')
    }

    revalidatePath('/dashboard/habits')
    revalidatePath('/dashboard')
}

export async function toggleHabitCompletion(habitId: number, isCompleted: boolean, dateStr: string) {
    const supabase = await createClient()
    const targetDate = new Date(dateStr)
    const start = startOfDay(targetDate).toISOString()
    const end = endOfDay(targetDate).toISOString()

    if (!isCompleted) {
        // Remove log
        const { error } = await supabase
            .from('habit_logs')
            .delete()
            .eq('habit_id', habitId)
            .gte('completed_at', start)
            .lte('completed_at', end)

        if (error) throw error
    } else {
        // Add log
        // Check for duplicate first to be safe
        const { count } = await supabase
            .from('habit_logs')
            .select('*', { count: 'exact', head: true })
            .eq('habit_id', habitId)
            .gte('completed_at', start)
            .lte('completed_at', end)

        if (count === 0) {
            const { error } = await supabase.from('habit_logs').insert({
                habit_id: habitId,
                completed_at: targetDate.toISOString() // Store exact provided time (or start of day if just passed YYYY-MM-DD)
            })
            if (error) throw error
        }
    }

    // Recalculate Streak for this habit
    await updateHabitStreak(habitId, supabase)

    revalidatePath('/dashboard/habits')
    revalidatePath('/dashboard')
}

// Helper to calculate and update streak
// Helper to calculate and update streak
async function updateHabitStreak(habitId: number, supabase: any) {
    // Fetch all logs for this habit, ordered desc
    const { data: logs } = await supabase
        .from('habit_logs')
        .select('completed_at')
        .eq('habit_id', habitId)
        .order('completed_at', { ascending: false })

    if (!logs || logs.length === 0) {
        await supabase.from('habits').update({ streak: 0 }).eq('id', habitId)
        return
    }

    // Normalized unique dates (YYYY-MM-DD)
    // We rely on the string split to group 'same day' logs in UTC.
    // Ideally this should use the user's timezone, but we only have UTC.
    // Consistency is key: if user logs are consistently generated as YYYY-MM-DD at midnight UTC via the frontend, this works.
    const logItems = logs as { completed_at: string }[];
    const uniqueDates = Array.from(new Set(logItems.map(l => l.completed_at.split('T')[0]))).sort().reverse() as string[];

    const todayStr = new Date().toISOString().split('T')[0];
    const latestLogStr = uniqueDates[0];

    // If no logs, streak 0
    if (!latestLogStr) {
        await supabase.from('habits').update({ streak: 0 }).eq('id', habitId);
        return;
    }

    // Check if the streak is "alive".
    // Alive if latest log is Today OR Yesterday.
    // If latest log is older than yesterday, streak is broken -> 0.
    const todayDate = new Date(todayStr);
    const latestDate = new Date(latestLogStr);
    const diffToLatest = (todayDate.getTime() - latestDate.getTime()) / (1000 * 3600 * 24);

    // Tolerance: If diff is > 1.5 (rounding issues) essentially > 1 day gap
    // If diffToLatest > 1 (e.g. 2 days ago), streak is broken.
    // Exception: If the user just completed it TODAY (diff=0), streak is alive.
    // If user completed YESTERDAY (diff=1), streak is alive.
    // If user completed DAY BEFORE YESTERDAY (diff=2) and NOT today/yesterday, streak is broken.

    // Actually, we should just calculate the strict sequence from the latest log backwards,
    // and then decide if we save it or reset it based on how old the latest log is.

    if (diffToLatest > 1) {
        // Missed yesterday? Streak broken.
        // Wait, if I missed yesterday, my streak IS broken.
        await supabase.from('habits').update({ streak: 0 }).eq('id', habitId);
        return;
    }

    let streak = 1;
    let currentStr = latestLogStr;

    for (let i = 1; i < uniqueDates.length; i++) {
        const prevStr = uniqueDates[i];

        const curDate = new Date(currentStr);
        const prevDate = new Date(prevStr);

        const diff = (curDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);

        if (diff === 1) {
            // Consecutive day found
            streak++;
            currentStr = prevStr;
        } else {
            // Gap found, stop counting
            break;
        }
    }

    await supabase.from('habits').update({ streak }).eq('id', habitId);
}
