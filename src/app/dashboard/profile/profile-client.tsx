"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
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
    Camera,
    Mail,
    CreditCard
} from "lucide-react"
import { logout } from "@/app/(auth)/logout-action"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

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
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user.user_metadata?.avatar_url || null)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    // Keep name in sync with server data when not editing
    useEffect(() => {
        if (!isEditing) {
            setName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
            setAvatarUrl(user.user_metadata?.avatar_url || null)
        }
    }, [user.user_metadata, user.email, isEditing])

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Name cannot be empty")
            return
        }

        setIsSaving(true)
        setError(null)

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: name }
            })

            if (error) throw error

            setIsEditing(false)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
        setIsEditing(false)
        setError(null)
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setError(null)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // 3. Update User Metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            })

            if (updateError) throw updateError

            // 4. Update Local State
            setAvatarUrl(publicUrl)

            // Optional: Reload page to sync server comp if needed, but client state is enough for now
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Failed to upload image")
        } finally {
            setIsUploading(false)
        }
    }

    const initials = name.substring(0, 2).toUpperCase()

    return (
        <div className="flex flex-col gap-6 pb-10 max-w-sm mx-auto px-4 md:px-0">
            {/* Header / Profile Card */}
            {/* Header / Profile Card */}
            <Card className="border-border shadow-sm bg-card">
                <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center gap-6">

                        {/* Avatar Section */}
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl transition-transform group-hover:scale-105">
                                <AvatarImage src={avatarUrl || ""} alt={name} className="object-cover" />
                                <AvatarFallback className="text-4xl font-light bg-gradient-to-br from-indigo-500 to-purple-600 text-white uppercase">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            {/* Edit Overlay */}
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium backdrop-blur-[2px]">
                                <Camera className="h-8 w-8" />
                            </div>

                            {/* Loading State */}
                            {isUploading && (
                                <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center z-10">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        {/* Info Section - Vertically stacked and centered */}
                        <div className="space-y-4 w-full max-w-sm">
                            <div className="space-y-2 flex flex-col items-center">
                                {isEditing ? (
                                    <div className="space-y-2 w-full">
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-10 text-xl font-bold w-full text-center"
                                            placeholder="Full Name"
                                            autoFocus
                                        />
                                        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
                                    </div>
                                ) : (
                                    <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
                                )}

                                <div className="flex flex-col items-center gap-1.5 text-muted-foreground text-sm">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>Member since {memberSince}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons - Centered Row */}
                            <div className="flex items-center justify-center gap-3 pt-2">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                                            <X className="h-4 w-4 mr-2" /> Cancel
                                        </Button>
                                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />} Save
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                        <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit Profile
                                    </Button>
                                )}
                                <Link href="/dashboard/billing">
                                    <Button variant="ghost" size="sm">
                                        <CreditCard className="h-3.5 w-3.5 mr-2" /> Billing
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Account Info Split */}
            <div className="flex flex-col gap-6">
                {/* Preferences Card */}
                <Card className="border-none shadow-sm bg-card/50 ring-1 ring-border/50">
                    <CardHeader className="text-center md:text-left">
                        <CardTitle className="text-lg">Preferences</CardTitle>
                        <CardDescription>Customize your app experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Appearance</Label>
                                <p className="text-xs text-muted-foreground">Light or Dark mode</p>
                            </div>
                            <ThemeSelector />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Notifications</Label>
                                <p className="text-xs text-muted-foreground">Push alerts</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Card */}
                <Card className="border-none shadow-sm bg-card/50 ring-1 ring-border/50">
                    <CardHeader className="text-center md:text-left">
                        <CardTitle className="text-lg">Security & Data</CardTitle>
                        <CardDescription>Manage your account security.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-between h-auto py-3">
                            <span className="flex items-center gap-2">
                                <Key className="h-4 w-4" /> Change Password
                            </span>
                            <span className="text-xs text-muted-foreground">Last changed 30d ago</span>
                        </Button>
                        <Button variant="outline" className="w-full justify-between h-auto py-3">
                            <span className="flex items-center gap-2">
                                <Download className="h-4 w-4" /> Export Data
                            </span>
                            <span className="text-xs text-muted-foreground">JSON format</span>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Danger Zone */}
            <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <div className="space-y-1">
                        <h4 className="font-semibold text-destructive flex items-center justify-center md:justify-start gap-2">
                            <ShieldAlert className="h-4 w-4" /> Danger Zone
                        </h4>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                    </div>
                    <Button variant="destructive" size="sm">Delete Account</Button>
                </CardContent>
            </Card>
        </div>
    )
}
