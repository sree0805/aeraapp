"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, LayoutTemplate } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

const navItems = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [user, setUser] = React.useState<any>(null)
    const supabase = createClient()

    React.useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [supabase])

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                {/* Logo */}
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <LayoutTemplate className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">
                            ProjectName
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Mobile Menu Button & Sheet Trigger would go here normally, but doing simple state for now */}
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search or other items could go here */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="mr-2 px-0 hover:bg-transparent md:hidden" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                        <div className="hidden md:flex gap-2">
                            {user ? (
                                <Link href="/dashboard">
                                    <Button size="sm">Go to Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">Log in</Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button size="sm">Sign up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden border-b bg-background">
                    <div className="container py-4 space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 flex flex-col gap-2">
                            {user ? (
                                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full justify-start">Go to Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full justify-start">Log in</Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full justify-start">Sign up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
