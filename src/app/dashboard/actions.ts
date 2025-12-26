'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logSleep(dateStr: string, hours: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    // Upsert into daily_stats
    const { error } = await supabase
        .from('daily_stats')
        .upsert({
            user_id: user.id,
            date: dateStr,
            sleep_hours: hours
        }, {
            onConflict: 'user_id, date'
        })

    if (error) {
        console.error("Error logging sleep:", error)
        return { error: 'Failed to log sleep' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/analytics')
    return { success: true }
}
