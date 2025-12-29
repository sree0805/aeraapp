"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/(auth)/logout-action"
import Link from "next/link"
import { User, Settings, CreditCard, LogOut } from "lucide-react"

export function UserNav() {
    const [user, setUser] = useState<any>(null)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Fetch User
    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                // Check if meta contains avatar_url or if we need to fetch profile table
                // For now, prioritize user_metadata which usually stores simple profile info
                const metaAvatar = user.user_metadata?.avatar_url
                if (metaAvatar) setAvatarUrl(metaAvatar)

                // If you have a profiles table, fetch here:
                /*
                const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single()
                if (profile?.avatar_url) setAvatarUrl(profile.avatar_url)
                */
            }
        }
        fetchUser()
    }, [])

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"
    const displayEmail = user?.email || "user@example.com"

    const initials = displayName
        ? displayName.charAt(0).toUpperCase()
        : user?.email?.charAt(0).toUpperCase() || "U"

    const Trigger = (
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border border-border/50">
                <AvatarImage src={avatarUrl || ""} alt={displayName} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium text-xs">
                    {initials}
                </AvatarFallback>
            </Avatar>
        </Button>
    )

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    {Trigger}
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-[20px] px-0 pb-6">
                    <SheetHeader className="px-6 pb-4 text-left">
                        <SheetTitle>Account</SheetTitle>
                    </SheetHeader>

                    {/* User Info Header in Sheet */}
                    <div className="px-6 pb-6 flex items-center gap-4">
                        <Avatar className="h-14 w-14 border border-border">
                            <AvatarImage src={avatarUrl || ""} alt={displayName} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="font-semibold text-lg leading-none">{displayName}</p>
                            <p className="text-sm text-muted-foreground">{displayEmail}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 px-2">
                        <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Profile</span>
                            </div>
                        </Link>
                        <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors">
                                <Settings className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Settings</span>
                            </div>
                        </Link>
                        <Link href="/dashboard/billing" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors">
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Billing</span>
                            </div>
                        </Link>

                        <div className="h-px bg-border my-2 mx-4" />

                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 transition-colors w-full text-left"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Log out</span>
                        </button>
                    </div>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {Trigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {displayEmail}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/dashboard/profile">
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/billing">
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Billing
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/settings">
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
