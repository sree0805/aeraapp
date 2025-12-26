"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/dashboard/chat-interface";
import { MessageCircle, X } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function FloatingChat() {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    className="fixed bottom-24 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg p-0 bg-primary hover:bg-primary/90 z-50 transition-all duration-300 hover:scale-105"
                >
                    {open ? <X className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" /> : <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" className="w-[90vw] md:w-[400px] h-[500px] md:h-[600px] p-0 border-none shadow-xl mr-2 md:mr-6 mb-2 rounded-xl overflow-hidden">
                <div className="h-full w-full bg-background border rounded-xl flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
                        <h3 className="font-semibold flex items-center gap-2">
                            AI Therapist & Coach
                        </h3>
                    </div>
                    {/* Chat Area - Reuse existing component logic but ensure it fits */}
                    <div className="flex-1 overflow-hidden">
                        <ChatInterface />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
