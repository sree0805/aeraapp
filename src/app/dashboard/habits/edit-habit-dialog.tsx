"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { updateHabit } from "./actions";
import {
    Loader2, Activity, Book, Briefcase, Coffee, Droplets,
    Dumbbell, Heart, Moon, Music, Sun, Utensils, Zap
} from "lucide-react";

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

interface EditHabitDialogProps {
    habit: {
        id: number;
        title: string;
        description: string | null;
        frequency: string;
        icon?: string | null;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditHabitDialog({ habit, open, onOpenChange }: EditHabitDialogProps) {
    const [title, setTitle] = useState(habit.title);
    const [description, setDescription] = useState(habit.description || "");
    const [frequency, setFrequency] = useState(habit.frequency);
    const [icon, setIcon] = useState(habit.icon || "activity");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const formData = new FormData();
        formData.append("id", habit.id.toString());
        formData.append("title", title);
        formData.append("description", description);
        formData.append("frequency", frequency);
        formData.append("icon", icon);

        const res = await updateHabit(formData);
        setIsSaving(false);

        if (res?.success) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Habit</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="frequency" className="text-right">
                            Frequency
                        </Label>
                        <Select value={frequency} onValueChange={setFrequency}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
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
                                        onClick={() => setIcon(item.name)}
                                        className={`p-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${icon === item.name
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

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
