"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CheckSquare, Settings, LayoutDashboard, Calendar, Search, Smile, PieChart, Sparkles, CreditCard } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Habits", icon: CheckSquare, href: "/dashboard/habits" },
        { label: "Tasks", icon: Search, href: "/dashboard/tasks" }, // Using Search/List icon or keeping CheckSquare
        { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
        { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
        { label: "Emotions", icon: Smile, href: "/dashboard/emotions" },
    ]

    return (
        <div className={cn("pb-12 h-screen border-r bg-card/30 backdrop-blur-xl border-white/5", className)}>
            <div className="space-y-4 py-6">
                <div className="px-4 mb-6">
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent px-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-8 h-8 text-primary">
                            <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                        </svg>
                        Aera
                    </h2>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-2">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={pathname === route.href ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start h-12 rounded-xl transition-all duration-200 ease-in-out",
                                    pathname === route.href
                                        ? "bg-primary/10 text-primary shadow-sm hover:bg-primary/20"
                                        : "text-muted-foreground hover:bg-white/5 hover:translate-x-1 hover:text-foreground"
                                )}
                                asChild
                            >
                                <Link href={route.href} className="flex items-center gap-3">
                                    <route.icon className={cn("h-5 w-5", pathname === route.href ? "text-primary" : "text-muted-foreground")} />
                                    <span className="text-base font-medium">{route.label}</span>
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="px-3 mt-auto absolute bottom-8 w-full space-y-2">
                    <Button
                        variant={pathname === "/dashboard/billing" ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start h-12 rounded-xl",
                            pathname === "/dashboard/billing" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5"
                        )}
                        asChild
                    >
                        <Link href="/dashboard/billing" className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <span className="text-base font-medium">Billing</span>
                        </Link>
                    </Button>

                    <Button
                        variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start h-12 rounded-xl",
                            pathname === "/dashboard/settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5"
                        )}
                        asChild
                    >
                        <Link href="/dashboard/settings" className="flex items-center gap-3">
                            <Settings className="h-5 w-5" />
                            <span className="text-base font-medium">Settings</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
