"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Moon } from "lucide-react"
import { logSleep } from "@/app/dashboard/actions"
import { format } from "date-fns" // Assuming date-fns is installed
// import { toast } from "sonner"

export function SleepLogger() {
    const [open, setOpen] = useState(false)
    const [hours, setHours] = useState("8")
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        await logSleep(date, parseFloat(hours))

        setLoading(false)
        setOpen(false)
        // toast.success("Sleep logged!") 
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 rounded-full gap-2 px-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all">
                    <Moon className="h-4 w-4" />
                    <span className="font-medium">Log Sleep</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Log Sleep</DialogTitle>
                    <DialogDescription>
                        How many hours did you sleep last night?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Date
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hours" className="text-right">
                                Hours
                            </Label>
                            <Input
                                id="hours"
                                type="number"
                                step="0.5"
                                min="0"
                                max="24"
                                required
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
