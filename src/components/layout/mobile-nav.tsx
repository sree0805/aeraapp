"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CheckSquare, Smile, BarChart3, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const pathname = usePathname()

    const routes = [
        { label: "Home", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Habits", icon: CheckSquare, href: "/dashboard/habits" },
        { label: "Mood", icon: Smile, href: "/dashboard/emotions" },
        { label: "Stats", icon: BarChart3, href: "/dashboard/analytics" },
        { label: "Plan", icon: Calendar, href: "/dashboard/calendar" },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-border/50 pb-safe md:hidden">
            <div className="flex items-center justify-around h-16 px-2">
                {routes.map((route) => {
                    const isActive = route.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(route.href)

                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className={cn(
                                "p-1 rounded-xl transition-all",
                                isActive ? "bg-primary/10" : "bg-transparent"
                            )}>
                                <route.icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            </div>
                            <span className="text-[10px] font-medium tracking-tight">
                                {route.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
