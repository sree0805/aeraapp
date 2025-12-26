"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sparkles, Lightbulb } from "lucide-react";

export function DailyInsight() {
    const [open, setOpen] = useState(false);
    const [insight, setInsight] = useState("");
    const [_isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkAndFetchInsight = async () => {
            // 1. Check Local Storage
            const today = new Date().toDateString();
            const lastShown = localStorage.getItem("last_insight_date");

            if (lastShown === today) {
                return; // Already shown today
            }

            // 2. Fetch Insight
            setIsLoading(true);
            try {
                const res = await fetch("/api/insights/daily", { method: "POST" });
                const data = await res.json();

                if (data.skipped) {
                    // Not enough data, mark as shown so we don't retry every refresh
                    localStorage.setItem("last_insight_date", today);
                    return;
                }

                if (data.insight) {
                    setInsight(data.insight);
                    setTimeout(() => setOpen(true), 2000); // Gentle fade in after 2s
                }
            } catch (err) {
                console.error("Failed to load insight", err);
            } finally {
                setIsLoading(false);
            }
        };

        checkAndFetchInsight();
    }, []);

    const handleClose = () => {
        const today = new Date().toDateString();
        localStorage.setItem("last_insight_date", today);
        setOpen(false);
    };

    if (!open) return null;

    return (
        // Ambient Overlay - Light dim (5% opacity), dismiss on click anywhere
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/20 transition-opacity duration-1000 ease-in-out cursor-default backdrop-blur-[1px]"
            onClick={handleClose}
        >
            {/* Soft Insight Card */}
            <div
                className="relative max-w-md w-[90%] bg-card/95 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700 ring-1 ring-black/5"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card itself
            >
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-primary/10 p-2 rounded-full shadow-sm ring-1 ring-primary/20">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>

                    <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        Daily Insight
                    </h3>

                    <p className="text-lg font-medium text-foreground leading-relaxed font-sans">
                        {insight}
                    </p>

                    <button
                        onClick={handleClose}
                        className="text-xs text-primary hover:text-primary/80 transition-colors mt-2 font-medium"
                    >
                        Got it
                    </button>

                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-4 text-muted-foreground hover:text-foreground text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>
            </div>
        </div>
    );
}
