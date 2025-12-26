'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string

    // Update auth user metadata
    const { error } = await supabase.auth.updateUser({
        data: {
            full_name: name
        }
    })

    if (error) {
        console.error('Error updating profile:', error)
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/dashboard/profile')
    return { success: true }
}
