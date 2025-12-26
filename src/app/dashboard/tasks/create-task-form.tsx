"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createTask } from "./actions"
import { useRef } from "react"
import { Label } from "@/components/ui/label";

export function CreateTaskForm() {
    const formRef = useRef<HTMLFormElement>(null)

    async function action(formData: FormData) {
        const res = await createTask(formData)
        if (res?.error) {
            alert(res.error)
            return
        }
        formRef.current?.reset()
    }

    return (
        <form ref={formRef} action={action} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end border p-4 rounded-lg bg-card">

            <div className="md:col-span-4 space-y-1">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" name="title" placeholder="What needs to be done?" required />
            </div>

            <div className="md:col-span-2 space-y-1">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue="work">
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="work">Work (Productivity)</SelectItem>
                        <SelectItem value="rest">Rest (Sleep/Nap)</SelectItem>
                        <SelectItem value="leisure">Leisure (Wellness)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="md:col-span-2 space-y-1">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" defaultValue="medium">
                    <SelectTrigger id="priority">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="md:col-span-2 space-y-1">
                <Label htmlFor="duration">Duration (mins)</Label>
                <Input id="duration" name="duration" type="number" placeholder="60" defaultValue="30" min="1" />
            </div>

            <div className="md:col-span-4 space-y-1">
                <Label htmlFor="scheduled-at">Schedule (Optional)</Label>
                <Input id="scheduled-at" name="scheduled_at" type="datetime-local" />
            </div>

            <div className="md:col-span-12">
                <Button type="submit" className="w-full">Add Task & Set Reminder</Button>
            </div>
        </form>
    )
}
