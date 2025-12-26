import { Sidebar } from "@/components/Sidebar"
import { UserNav } from "@/components/UserNav"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { QuickAdd } from "@/components/dashboard/quick-add"
import { FloatingChat } from "@/components/dashboard/floating-chat"
import { Notifications } from "@/components/dashboard/notifications"
import { DailyInsight } from "@/components/dashboard/daily-insight"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="m-4">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0">
                        <Sidebar className="border-none w-full" />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 shrink-0">
                <Sidebar className="fixed w-64" />
            </aside>

            <div className="flex-1">
                <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
                    <div className="flex flex-1 items-center justify-end">
                        <QuickAdd />
                        <Notifications />
                        <UserNav />
                    </div>
                </header>
                <main className="flex-1 space-y-4 p-8 pt-6">
                    {children}
                </main>
            </div>
            <FloatingChat />
            <DailyInsight />
        </div>
    )
}
