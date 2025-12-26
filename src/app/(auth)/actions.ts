'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    console.log("Attempting Login...")
    const supabase = await createClient()

    // Debug: Check if env vars are loaded (do not log values)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) console.error("Missing NEXT_PUBLIC_SUPABASE_URL")
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log(`Login request for: ${email}`)

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error("Login error from Supabase:", error.message)
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    console.log("Login successful, redirecting...")
    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName
            }
        }
    })

    if (error) {
        console.error("Signup error:", error.message)
        return redirect(`/signup?error=${encodeURIComponent(error.message)}`)
    }

    // Check if session exists (Auto confirm enabled?)
    if (data.session) {
        // Create default habits
        await supabase.from('habits').insert([
            { user_id: data.user?.id, title: 'Sleep 8 Hours', frequency: 'daily', description: 'Get a good night\'s rest' },
            { user_id: data.user?.id, title: 'Drink Water', frequency: 'daily', description: 'Stay hydrated' }
        ])

        revalidatePath('/', 'layout')
        redirect('/dashboard')
    } else {
        // Email confirmation required
        return redirect('/login?message=Check your email to confirm your account')
    }
}
