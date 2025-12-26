import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Flame,
    CheckSquare,
    Trophy,
    Calendar,
    Edit2,
    CheckCircle2,
    Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileClient } from "./profile-client"
import { ShareStreak } from "@/components/dashboard/share-streak"

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch Stats
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

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Habits", value: habitsCount || 0, icon: CheckSquare, color: "text-blue-500" },
                    { label: "Best Streak", value: `${maxStreak}d`, icon: Flame, color: "text-orange-500" },
                    { label: "Total Wins", value: totalCompletions, icon: Trophy, color: "text-yellow-600" },
                    { label: "Days Active", value: uniqueDays.size || 1, icon: Activity, color: "text-green-600" }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-none bg-muted/30 dark:bg-muted/10 ring-1 ring-border/50">
                        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 text-left">
                            <CardTitle className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-left">
                            <div className="flex items-center gap-2">
                                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                                {stat.label === "Best Streak" && <ShareStreak streak={parseInt(stat.value as string)} variant="icon" />}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <ProfileClient
                user={{
                    id: user.id,
                    email: user.email,
                    user_metadata: user.user_metadata
                }}
                memberSince={memberSince}
            />
        </div>
    )
}
