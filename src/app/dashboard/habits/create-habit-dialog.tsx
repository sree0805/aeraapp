"use client"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createHabit } from "./actions"
import { useState } from "react"
import {
    Plus, Activity, Book, Briefcase, Coffee, Droplets,
    Dumbbell, Heart, Moon, Music, Sun, Utensils, Zap
} from "lucide-react"
import { useRouter } from "next/navigation"

const ICONS = [
    { name: 'activity', icon: Activity },
    { name: 'book', icon: Book },
    { name: 'briefcase', icon: Briefcase },
    { name: 'coffee', icon: Coffee },
    { name: 'droplets', icon: Droplets },
    { name: 'dumbbell', icon: Dumbbell },
    { name: 'heart', icon: Heart },
    { name: 'moon', icon: Moon },
    { name: 'music', icon: Music },
    { name: 'sun', icon: Sun },
    { name: 'utensils', icon: Utensils },
    { name: 'zap', icon: Zap },
]

export function CreateHabitDialog() {
    const [open, setOpen] = useState(false)
    const [selectedIcon, setSelectedIcon] = useState('activity')
    const router = useRouter()

    async function onSubmit(formData: FormData) {
        const res = await createHabit(formData)
        if (res?.success) {
            setOpen(false)
            router.refresh()
            // Reset
            setSelectedIcon('activity')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Habit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Habit</DialogTitle>
                    <DialogDescription>
                        Add a new habit to track. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form action={onSubmit}>
                    <input type="hidden" name="icon" value={selectedIcon} />
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Drink Water"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Drink 8 glasses of water daily"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="frequency" className="text-right">
                                Frequency
                            </Label>
                            <Select name="frequency" defaultValue="daily">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">Icon</Label>
                            <div className="col-span-3 grid grid-cols-6 gap-2">
                                {ICONS.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <div
                                            key={item.name}
                                            onClick={() => setSelectedIcon(item.name)}
                                            className={`p-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${selectedIcon === item.name
                                                    ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                                                    : 'bg-secondary hover:bg-secondary/80'
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
