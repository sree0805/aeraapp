"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ThemeSelector } from "@/components/dashboard/settings/theme-selector"
import { updateProfile } from "@/app/dashboard/profile/actions"
import { logout } from "@/app/(auth)/logout-action"
import { ShareStreak } from "@/components/dashboard/share-streak"
import { useNotifications } from "@/hooks/use-notifications"

import {
    User,
    Settings,
    Bell,
    Activity,
    Video,
    Shield,
    Key,
    AlertTriangle,
    Check,
    X,
    Loader2,
    Calendar,
    Flame,
    CheckSquare,
    Trophy,
    ExternalLink,
    LogOut,
    Download,
    CheckCircle2,
    Edit2,
    Clock,
    Globe
} from "lucide-react"

interface SettingsClientProps {
    user: {
        id: string
        email: string | undefined
        user_metadata: any
    }
    stats: {
        habitsCount: number
        maxStreak: number
        totalCompletions: number
        datesActive: number
    }
    memberSince: string
}

const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Key },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "habits", label: "Habits & Tracking", icon: Activity },
    { id: "resources", label: "Resources", icon: Video },
    { id: "privacy", label: "Data & Privacy", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
]

export function SettingsClient({ user, stats, memberSince }: SettingsClientProps) {
    const { permission, requestPermission, sendNotification } = useNotifications()
    const [activeSection, setActiveSection] = useState("profile")

    // Settings State
    const [dailyReminder, setDailyReminder] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem('daily_reminder')
        if (stored) {
            setDailyReminder(JSON.parse(stored))
        }
    }, [])

    const toggleDailyReminder = (checked: boolean) => {
        setDailyReminder(checked)
        localStorage.setItem('daily_reminder', JSON.stringify(checked))
        if (checked && permission === 'default') {
            requestPermission()
        }
    }

    const scheduleTestReminder = () => {
        if (permission !== 'granted') {
            requestPermission();
            return;
        }

        const now = Date.now();
        const scheduledTime = now + 60000; // 1 minute
        const reminder = {
            id: `test-${now}`,
            title: "Test Reminder ⏰",
            body: "This is a scheduled reminder (1 min delayed).",
            timestamp: scheduledTime
        };

        const stored = localStorage.getItem('scheduled_reminders');
        const queue = stored ? JSON.parse(stored) : [];
        queue.push(reminder);
        localStorage.setItem('scheduled_reminders', JSON.stringify(queue));

        // Feedback
        sendNotification("Timer Started", { body: "You will be notified in 1 minute." });
    }

    // Profile Edit State
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Sync name when not editing
    useEffect(() => {
        if (!isEditing) {
            setName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
        }
    }, [user.user_metadata?.full_name, user.email, isEditing])

    const handleSaveProfile = async () => {
        if (!name.trim()) {
            setError("Name cannot be empty")
            return
        }

        setIsSaving(true)
        setError(null)

        const formData = new FormData()
        formData.append('name', name)

        const res = await updateProfile(formData)

        if (res?.error) {
            setError(res.error)
        } else {
            setIsEditing(false)
        }
        setIsSaving(false)
    }

    const handleCancelEdit = () => {
        setName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
        setIsEditing(false)
        setError(null)
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto pb-10">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 shrink-0 space-y-1">
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            activeSection === item.id
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </button>
                ))}
            </aside>

            {/* Content Panel */}
            <main className="flex-1 min-w-0 space-y-6">

                {/* PROFILE SECTION */}
                {activeSection === "profile" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pb-6 border-b">
                            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
                                <Avatar className="h-28 w-28 ring-4 ring-background shadow-xl">
                                    <AvatarImage src="/avatars/01.png" alt={name} />
                                    <AvatarFallback className="text-3xl font-light bg-muted uppercase">
                                        {name.substring(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1.5 text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        {isEditing ? (
                                            <div className="space-y-1">
                                                <Input
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="h-9 text-lg font-semibold w-[200px]"
                                                    placeholder="Full Name"
                                                    autoFocus
                                                />
                                                {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
                                            </div>
                                        ) : (
                                            <>
                                                <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
                                                <CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-500/10" />
                                            </>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground font-medium">{user.email}</p>
                                    <p className="text-xs text-muted-foreground/80 flex items-center justify-center sm:justify-start gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Member since {memberSince}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 h-9 px-4 rounded-full"
                                            onClick={handleCancelEdit}
                                            disabled={isSaving}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="gap-2 h-9 px-4 rounded-full"
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 shadow-sm h-9 px-4 rounded-full"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit2 className="h-3.5 w-3.5" />
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Active Habits", value: stats.habitsCount, icon: CheckSquare, color: "text-blue-500" },
                                { label: "Best Streak", value: `${stats.maxStreak}d`, icon: Flame, color: "text-orange-500" },
                                { label: "Total Wins", value: stats.totalCompletions, icon: Trophy, color: "text-yellow-600" },
                                { label: "Days Active", value: stats.datesActive, icon: Activity, color: "text-green-600" }
                            ].map((stat, i) => (
                                <Card key={i} className="border-none shadow-none bg-muted/30 dark:bg-muted/10 ring-1 ring-border/50">
                                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 text-left">
                                        <CardTitle className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
                                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-left">
                                        <div className="flex items-center gap-2">
                                            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                                            {stat.label === "Best Streak" && <ShareStreak streak={stats.maxStreak} variant="icon" />}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* ACCOUNT SECTION */}
                {activeSection === "account" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h3 className="text-lg font-medium">Account Security</h3>
                            <p className="text-sm text-muted-foreground">Manage your password and key account settings.</p>
                        </div>
                        <Separator />
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>Change your password securely.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current">Current Password</Label>
                                    <Input id="current" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new">New Password</Label>
                                    <Input id="new" type="password" />
                                </div>
                                <div className="flex justify-end">
                                    <Button size="sm">Update Password</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* PREFERENCES SECTION */}
                {activeSection === "preferences" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h3 className="text-lg font-medium">App Preferences</h3>
                            <p className="text-sm text-muted-foreground">Customize your experience.</p>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Appearance</p>
                                        <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
                                    </div>
                                    <ThemeSelector />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Timezone</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Automatic based on browser.</p>
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        UTC {new Date().getTimezoneOffset() / -60 > 0 ? '+' : ''}{new Date().getTimezoneOffset() / -60}:00
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* NOTIFICATIONS SECTION */}
                {activeSection === "notifications" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h3 className="text-lg font-medium">Notifications</h3>
                            <p className="text-sm text-muted-foreground">Manage how you receive alerts.</p>
                        </div>
                        <Separator />
                        <Card>
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Label>Browser Notifications</Label>
                                            {permission === 'granted' && (
                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                    Enabled
                                                </span>
                                            )}
                                            {permission === 'denied' && (
                                                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                    Denied
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {permission === 'denied'
                                                ? "Notifications are blocked. Please enable them in your browser settings."
                                                : "Receive native browser notifications even when the app is in the background."}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {permission === 'granted' ? (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => sendNotification("Test Notification", { body: "This is how your reminders will appear!" })}
                                                >
                                                    Test Notification
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={scheduleTestReminder}
                                                >
                                                    Test Reminder (1 min)
                                                </Button>
                                            </>
                                        ) : permission === 'denied' ? (
                                            <Button variant="outline" size="sm" disabled>
                                                Blocked
                                            </Button>
                                        ) : (
                                            <Button size="sm" onClick={() => requestPermission()}>
                                                Enable
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Daily Reminders (9 AM)</Label>
                                        <p className="text-sm text-muted-foreground">Receive a summary of your habits.</p>
                                    </div>
                                    <Switch checked={dailyReminder} onCheckedChange={toggleDailyReminder} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
                }

                {/* HABITS SECTION */}
                {
                    activeSection === "habits" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-lg font-medium">Habits & Tracking</h3>
                                <p className="text-sm text-muted-foreground">Configure your tracking preferences.</p>
                            </div>
                            <Separator />
                            <Card>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Habit Streak Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Get notified if you're about to break a streak.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Confetti Effects</Label>
                                        <p className="text-sm text-muted-foreground">Show confetti when completing habits.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </CardContent>
                            </Card>
                        </div>
                    )
                }

                {/* RESOURCES SECTION */}
                {
                    activeSection === "resources" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-lg font-medium">Curated Resources</h3>
                                <p className="text-sm text-muted-foreground">Hand-picked videos to help you focus.</p>
                            </div>
                            <Separator />
                            <div className="grid gap-4 md:grid-cols-2">
                                <a
                                    href="https://www.youtube.com/watch?v=PZ7lDrwYdZc"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium">Atomic Habits Summary</p>
                                        <p className="text-xs text-muted-foreground">Master your habits</p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <a
                                    href="https://www.youtube.com/watch?v=nm1TxQj9IsQ"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium">Sleep Toolkit (Huberman)</p>
                                        <p className="text-xs text-muted-foreground">Optimize your rest</p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <a
                                    href="https://www.youtube.com/watch?v=w76ZabrHA-w"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium">Mental Wellness Guide</p>
                                        <p className="text-xs text-muted-foreground">Mindfulness & Balance</p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <a
                                    href="https://www.youtube.com/watch?v=n-2pD30UqE0"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium">Mastering Self-Help</p>
                                        <p className="text-xs text-muted-foreground">Practical Psychology</p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </div>
                        </div>
                    )
                }

                {/* PRIVACY SECTION */}
                {
                    activeSection === "privacy" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-lg font-medium">Data & Privacy</h3>
                                <p className="text-sm text-muted-foreground">Manage your data ownership.</p>
                            </div>
                            <Separator />
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Export Data</p>
                                            <p className="text-sm text-muted-foreground">Download a JSON copy of all your habits and logs.</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Download className="h-4 w-4" />
                                            Export JSON
                                        </Button>
                                    </div>
                                    <Separator />
                                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Session Management</p>
                                            <p className="text-sm text-muted-foreground">Sign out of all active sessions.</p>
                                        </div>
                                        <Button variant="ghost" onClick={() => logout()} className="gap-2 text-muted-foreground">
                                            <LogOut className="h-4 w-4" />
                                            Log Out
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )
                }

                {/* DANGER ZONE */}
                {
                    activeSection === "danger" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="text-destructive">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Danger Zone
                                </h3>
                                <p className="text-sm text-destructive/80">Irreversible actions.</p>
                            </div>
                            <Separator className="bg-destructive/10" />
                            <Card className="border-destructive/20 bg-destructive/5">
                                <CardContent className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-destructive">Delete Account</p>
                                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                                    </div>
                                    <Button variant="destructive" size="sm">Delete Account</Button>
                                </CardContent>
                            </Card>
                        </div>
                    )
                }
            </main >
        </div >
    )
}
