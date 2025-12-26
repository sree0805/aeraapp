"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ThemeSelector } from "@/components/dashboard/settings/theme-selector"
import {
    Bell,
    Clock,
    Globe,
    Key,
    Download,
    LogOut,
    Trash2,
    Edit2,
    CheckCircle2,
    ShieldAlert,
    Calendar,
    Loader2,
    Check,
    X,
    User
} from "lucide-react"
import { logout } from "@/app/(auth)/logout-action"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile } from "./actions"

interface ProfileClientProps {
    user: {
        email: string | undefined
        id: string
        user_metadata?: any
    }
    memberSince: string
}

export function ProfileClient({ user, memberSince }: ProfileClientProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Keep name in sync with server data when not editing
    useEffect(() => {
        if (!isEditing) {
            setName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
        }
    }, [user.user_metadata?.full_name, user.email, isEditing])

    const handleSave = async () => {
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

    const handleCancel = () => {
        setName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
        setIsEditing(false)
        setError(null)
    }

    return (
        <div className="grid gap-8 pb-10">
            {/* Header Section */}
            <header className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 px-1">
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
                                onClick={handleCancel}
                                disabled={isSaving}
                            >
                                <X className="h-3.5 w-3.5" />
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="gap-2 h-9 px-4 rounded-full"
                                onClick={handleSave}
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
            </header>

            {/* Preferences Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <h2 className="text-xl font-semibold tracking-tight">Preferences</h2>
                </div>
                <Card className="border-none shadow-none bg-background/50 ring-1 ring-border">
                    <CardContent className="p-0 divide-y divide-border">
                        <div className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">Appearance</p>
                                <p className="text-sm text-muted-foreground">Customize how the app looks.</p>
                            </div>
                            <ThemeSelector />
                        </div>
                        <div className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm font-medium leading-none">In-App Notifications</p>
                                </div>
                                <p className="text-sm text-muted-foreground">Receive daily updates and reminders.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm font-medium leading-none">Daily Reminders</p>
                                </div>
                                <p className="text-sm text-muted-foreground">Get reminded to log your habits at 8:00 PM.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm font-medium leading-none">Timezone</p>
                                </div>
                                <p className="text-sm text-muted-foreground">Automatic based on your location.</p>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">UTC {new Date().getTimezoneOffset() / -60 > 0 ? '+' : ''}{new Date().getTimezoneOffset() / -60}:00</span>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Account Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <h2 className="text-xl font-semibold tracking-tight">Account Settings</h2>
                </div>
                <Card className="border-none shadow-none bg-background/50 ring-1 ring-border">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Security</p>
                                <p className="text-sm text-muted-foreground">Update your password or enable MFA.</p>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Key className="h-4 w-4" />
                                Change Password
                            </Button>
                        </div>
                        <div className="w-full h-px bg-border" />
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Data & Privacy</p>
                                <p className="text-sm text-muted-foreground">Download a copy of your wellness data.</p>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="h-4 w-4" />
                                Export as JSON
                            </Button>
                        </div>
                        <div className="w-full h-px bg-border" />
                        <div className="flex justify-start pt-2">
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-2 p-0 h-auto" onClick={() => logout()}>
                                <LogOut className="h-4 w-4" />
                                Sign out of all devices
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Danger Zone */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1 text-destructive">
                    <ShieldAlert className="h-5 w-5" />
                    <h2 className="text-xl font-semibold tracking-tight">Danger Zone</h2>
                </div>
                <Card className="border-destructive/20 bg-destructive/5 dark:bg-destructive/10">
                    <CardContent className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-destructive">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all wellness data. This cannot be undone.</p>
                        </div>
                        <Button variant="destructive" size="sm" className="gap-2 shadow-sm">
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
