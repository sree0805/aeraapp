'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTask(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Authentication required. Please refresh or sign in again.' }
    }

    const title = formData.get('title') as string
    const priority = formData.get('priority') as string
    const category = formData.get('category') as string
    const duration = parseInt(formData.get('duration') as string) || 30

    const scheduledAtRaw = formData.get('scheduled_at') as string;
    const scheduledAt = scheduledAtRaw ? new Date(scheduledAtRaw).toISOString() : null;

    const { error } = await supabase
        .from('tasks')
        .insert({
            title,
            priority,
            category,
            duration_minutes: duration,
            scheduled_at: scheduledAt,
            reminder_minutes: 5, // Default reminder 5 mins before
            user_id: user.id,
        })

    if (error) {
        console.error('Error creating task:', error)
        return { error: 'Failed to create task' }
    }

    revalidatePath('/dashboard/tasks')
    revalidatePath('/dashboard/balance') // Update balance view
    return { success: true }
}

export async function toggleTask(taskId: number, isCompleted: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Authentication required.' }
    }

    const { error } = await supabase
        .from('tasks')
        .update({ is_completed: isCompleted })
        .eq('id', taskId)

    if (error) throw new Error('Failed to update task')

    revalidatePath('/dashboard/tasks')
    revalidatePath('/dashboard/balance')
}

export async function updateTaskDetails(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Authentication required.' }
    }

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string
    const category = formData.get('category') as string
    const duration = parseInt(formData.get('duration') as string)

    const { error } = await supabase
        .from('tasks')
        .update({
            title,
            description,
            priority,
            category,
            duration_minutes: duration
        })
        .eq('id', id)

    if (error) {
        console.error("Error updating task", error)
        return { error: "Failed to update task" }
    }

    revalidatePath('/dashboard/tasks')
    revalidatePath('/dashboard/balance')
    return { success: true }
}

export async function deleteTask(taskId: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Authentication required.' }
    }

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

    if (error) throw new Error('Failed to delete task')

    revalidatePath('/dashboard/tasks')
    revalidatePath('/dashboard/balance')
}
