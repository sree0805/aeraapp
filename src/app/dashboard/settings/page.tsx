import { createClient } from "@/lib/supabase/server"
import { SettingsClient } from "./settings-client"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Please log in</div>
    }

    // Fetch Stats (Copied from profile/page.tsx)
    const { count: habitsCount } = await supabase
        .from('habits')
        .select('*', { count: 'exact', head: true })
        .neq('archived', true)

    const { data: streaks } = await supabase
        .from('habits')
        .select('streak')
        .neq('archived', true)

    const maxStreak = streaks?.reduce((max, h) => Math.max(max, h.streak || 0), 0) || 0

    const { count: tasksCompleted } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', true)

    const { data: logs } = await supabase
        .from('habit_logs')
        .select('completed_at')

    const uniqueDays = new Set(logs?.map(l => l.completed_at.split('T')[0]))
    const totalCompletions = (logs?.length || 0) + (tasksCompleted || 0)

    const memberSince = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    // Construct stats object
    const stats = {
        habitsCount: habitsCount || 0,
        maxStreak,
        totalCompletions,
        datesActive: uniqueDays.size || 1 // Assuming at least 1 day if they are here, or 0 if truly new. uniqueDays.size is safe.
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <SettingsClient user={{ id: user.id, email: user.email, user_metadata: user.user_metadata }} stats={stats} memberSince={memberSince} />
        </div>
    )
}
