"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { createTask } from "@/app/dashboard/tasks/actions";
import { createHabit } from "@/app/dashboard/habits/actions";
import { Textarea } from "@/components/ui/textarea";

export function QuickAdd() {
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Task State
    const [taskTitle, setTaskTitle] = useState("");
    const [taskPriority, setTaskPriority] = useState("medium");

    // Habit State
    const [habitTitle, setHabitTitle] = useState("");
    const [habitFrequency, setHabitFrequency] = useState("daily");

    const handleCreateTask = async () => {
        if (!taskTitle) return;
        setIsSaving(true);
        const formData = new FormData();
        formData.append("title", taskTitle);
        formData.append("priority", taskPriority);

        await createTask(formData);
        setTaskTitle("");
        setOpen(false);
        setIsSaving(false);
    };

    const handleCreateHabit = async () => {
        if (!habitTitle) return;
        setIsSaving(true);
        const formData = new FormData();
        formData.append("title", habitTitle);
        formData.append("frequency", habitFrequency);
        formData.append("description", ""); // Optional

        await createHabit(formData);
        setHabitTitle("");
        setOpen(false);
        setIsSaving(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="mr-0 md:mr-2 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-sm transition-all hover:scale-105">
                    <Plus className="h-4 w-4" />
                    <span className="hidden md:inline">Quick Add</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="task" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="task">Task</TabsTrigger>
                        <TabsTrigger value="habit">Habit</TabsTrigger>
                    </TabsList>

                    {/* Task Tab */}
                    <TabsContent value="task" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="task-title">What needs to be done?</Label>
                            <Input
                                id="task-title"
                                placeholder="e.g. Finish report"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={taskPriority} onValueChange={setTaskPriority}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleCreateTask} disabled={isSaving || !taskTitle} className="w-full">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Task
                        </Button>
                    </TabsContent>

                    {/* Habit Tab */}
                    <TabsContent value="habit" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="habit-title">New Habit</Label>
                            <Input
                                id="habit-title"
                                placeholder="e.g. Drink 2L water"
                                value={habitTitle}
                                onChange={(e) => setHabitTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="frequency">Frequency</Label>
                            <Select value={habitFrequency} onValueChange={setHabitFrequency}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleCreateHabit} disabled={isSaving || !habitTitle} className="w-full">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Track Habit
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
