import React from "react"
import { Sidebar } from "@/components/Sidebar"
import { UserNav } from "@/components/UserNav"
import { QuickAdd } from "@/components/dashboard/quick-add"
import { FloatingChat } from "@/components/dashboard/floating-chat"
import { Notifications } from "@/components/dashboard/notifications"
import { DailyInsight } from "@/components/dashboard/daily-insight"
import { MobileNav } from "@/components/layout/mobile-nav"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-background overflow-x-hidden">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="hidden md:block w-64 shrink-0 border-r bg-card z-30 fixed h-full">
                <Sidebar className="h-full" />
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen relative w-full md:pl-64">
                {/* Mobile Header (Sticky) */}
                <header className="sticky top-0 z-40 flex md:hidden h-16 items-center justify-between border-b bg-background/95 backdrop-blur-xl px-4 supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 w-5 h-5 text-primary">
                                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                            </svg>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-foreground">Aera</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <QuickAdd />
                        <UserNav />
                    </div>
                </header>

                {/* Desktop Header (Minimal, just actions) */}
                <header className="hidden md:flex h-16 items-center justify-end gap-4 border-b bg-background/50 backdrop-blur-md px-8 sticky top-0 z-40">
                    <QuickAdd />
                    <Notifications />
                    <UserNav />
                </header>

                {/* Main Content Area */}
                <main className="flex-1 w-full max-w-full p-0 md:p-8 pb-24 md:pb-8">
                    {children}
                </main>

                {/* Mobile Bottom Nav */}
                <MobileNav />
            </div>

            {/* Global Overlays */}
            <FloatingChat />
            <DailyInsight />
        </div>
    )
}
