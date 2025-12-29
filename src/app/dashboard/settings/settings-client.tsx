"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ThemeSelector } from "@/components/dashboard/settings/theme-selector"
import { logout } from "@/app/(auth)/logout-action"
import { useNotifications } from "@/hooks/use-notifications"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"

import {
    Settings,
    Bell,
    Activity,
    Video,
    Shield,
    Key,
    AlertTriangle,
    ChevronRight,
    ArrowLeft,
    CreditCard,
    Globe,
    User
} from "lucide-react"

interface SettingsClientProps {
    user: {
        id: string
        email: string | undefined
        user_metadata: any
    }
    stats: any
    memberSince: string
}

type SectionId = "account" | "preferences" | "notifications" | "habits" | "resources" | "privacy" | "danger";

const sections: { id: SectionId; label: string; icon: any; description: string }[] = [
    { id: "account", label: "Security", icon: Key, description: "Password & Authentication" },
    { id: "preferences", label: "Preferences", icon: Settings, description: "Theme & Timezone" },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Email & Push alerts" },
    { id: "habits", label: "Habits & Tracking", icon: Activity, description: "Streak goals & confetti" },
    { id: "resources", label: "Resources", icon: Video, description: "Helpful content" },
    { id: "privacy", label: "Data & Privacy", icon: Shield, description: "Exports & Sessions" },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle, description: "Delete account" },
]

export function SettingsClient({ user, memberSince }: SettingsClientProps) {
    const { permission, requestPermission, sendNotification } = useNotifications()
    const [activeSection, setActiveSection] = useState<SectionId>("account")
    const [isMobile, setIsMobile] = useState(false)
    const [mobileView, setMobileView] = useState<"menu" | "detail">("menu")

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
            if (!mobile) setMobileView("menu") // Reset on desktop
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleSectionClick = (id: SectionId) => {
        setActiveSection(id)
        if (isMobile) setMobileView("detail")
    }

    const goBack = () => setMobileView("menu")

    const renderContent = (sectionId: SectionId) => {
        switch (sectionId) {
            case "account":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Security</h3>
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
                )
            case "preferences":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">App Preferences</h3>
                            <p className="text-sm text-muted-foreground">Customize your experience.</p>
                        </div>
                        <Separator />
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
                )
            case "notifications":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Notifications</h3>
                            <p className="text-sm text-muted-foreground">Manage how you receive alerts.</p>
                        </div>
                        <Separator />
                        <Card>
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Browser Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive push alerts.</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={permission === 'granted' ? "outline" : "default"}
                                        onClick={requestPermission}
                                        disabled={permission === 'granted'}
                                    >
                                        {permission === 'granted' ? 'Enabled' : 'Enable'}
                                    </Button>
                                </div>
                                {permission === 'granted' && (
                                    <Button variant="ghost" size="sm" onClick={() => sendNotification("Test", { body: "Working!" })}>
                                        Test Notification
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )
            case "habits":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Habits & Tracking</h3>
                            <p className="text-sm text-muted-foreground">Tracking preferences.</p>
                        </div>
                        <Separator />
                        <Card>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label>Streak Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Warn before streak loss</p>
                                </div>
                                <Switch defaultChecked />
                            </CardContent>
                        </Card>
                    </div>
                )
            case "danger":
                return (
                    <div className="space-y-6">
                        <div className="text-destructive">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" /> Danger Zone
                            </h3>
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
            default:
                return <div>Select a section</div>
        }
    }

    const Separator = ({ className }: { className?: string }) => (
        <div className={cn("h-px bg-border w-full", className)} />
    )

    // MAIN RENDER
    return (
        <div className="max-w-md mx-auto md:max-w-5xl md:mx-auto pb-10 px-4 md:px-0 min-h-[500px]">
            {isMobile ? (
                // MOBILE VIEW (Drill Down)
                <div className="relative overflow-hidden w-full">
                    <AnimatePresence mode="wait">
                        {mobileView === "menu" ? (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                {/* Mobile Menu List */}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium px-1">Account</h3>
                                    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                                        <Link href="/dashboard/profile" className="flex items-center justify-between p-4 hover:bg-muted/50 border-b last:border-0 border-border/50">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full"><User className="h-4 w-4 text-blue-600" /></div>
                                                <span className="font-medium">Profile</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </Link>
                                        <button onClick={() => handleSectionClick('account')} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 border-b last:border-0 border-border/50">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full"><Key className="h-4 w-4 text-gray-600" /></div>
                                                <span className="font-medium">Security</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                        <Link href="/dashboard/billing" className="flex items-center justify-between p-4 hover:bg-muted/50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full"><CreditCard className="h-4 w-4 text-green-600" /></div>
                                                <span className="font-medium">Billing</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium px-1">App Settings</h3>
                                    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                                        {sections.filter(s => ['preferences', 'notifications', 'habits'].includes(s.id)).map(section => (
                                            <button key={section.id} onClick={() => handleSectionClick(section.id)} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 border-b last:border-0 border-border/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-secondary p-2 rounded-full"><section.icon className="h-4 w-4 text-foreground" /></div>
                                                    <span className="font-medium">{section.label}</span>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium px-1">Other</h3>
                                    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                                        {sections.filter(s => ['resources', 'privacy', 'danger'].includes(s.id)).map(section => (
                                            <button key={section.id} onClick={() => handleSectionClick(section.id)} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 border-b last:border-0 border-border/50">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-full ${section.id === 'danger' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-secondary'}`}>
                                                        <section.icon className={`h-4 w-4 ${section.id === 'danger' ? 'text-red-600' : 'text-foreground'}`} />
                                                    </div>
                                                    <span className={`font-medium ${section.id === 'danger' ? 'text-red-600' : ''}`}>{section.label}</span>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => logout()}>
                                    Log Out
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="sm" className="gap-1 pl-2" onClick={goBack}>
                                        <ArrowLeft className="h-4 w-4" /> Back
                                    </Button>
                                    <h2 className="font-semibold text-lg">{sections.find(s => s.id === activeSection)?.label}</h2>
                                </div>
                                {renderContent(activeSection)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                // DESKTOP VIEW (Sidebar + Content)
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="lg:w-64 shrink-0 space-y-1">
                        <Link href="/dashboard/profile" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            <User className="h-4 w-4" /> Profile
                        </Link>
                        <Link href="/dashboard/billing" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            <CreditCard className="h-4 w-4" /> Billing
                        </Link>
                        <Separator className="my-2" />
                        {sections.map((item) => (
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

                    <main className="flex-1 min-w-0">
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {renderContent(activeSection)}
                        </div>
                    </main>
                </div>
            )}
        </div>
    )
}
