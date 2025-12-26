"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2, Copy, Download, Check, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareStreakProps {
    streak: number
    variant?: "icon" | "outline" | "ghost"
}

export function ShareStreak({ streak, variant = "outline" }: ShareStreakProps) {
    const [copied, setCopied] = useState(false)

    if (streak <= 0) return null

    const shareData = {
        title: "My Wellness Streak",
        text: `I've reached a ${streak}-day streak on my wellness journey! Consistency builds momentum. 🔥`,
        url: window.location.origin,
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                console.error("Error sharing:", err)
            }
        } else {
            handleCopy()
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(`${shareData.text} Check it out here: ${shareData.url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={variant === "icon" ? "ghost" : variant}
                    size={variant === "icon" ? "icon" : "sm"}
                    className={cn(
                        "transition-all duration-200",
                        variant === "icon" ? "h-8 w-8 text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10" : "gap-2"
                    )}
                >
                    <Share2 className="h-4 w-4" />
                    {variant !== "icon" && <span>Share</span>}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-none shadow-2xl bg-card overflow-hidden p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-center text-muted-foreground font-medium uppercase tracking-widest text-xs">Share Your Progress</DialogTitle>
                </DialogHeader>

                <div className="p-8 flex flex-col items-center justify-center space-y-6 relative">
                    {/* Background Decorative Element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col items-center">
                        <div className="absolute -top-4 -right-4">
                            <Flame className="h-8 w-8 text-orange-500 animate-pulse fill-orange-500/20" />
                        </div>
                        <span className="text-7xl font-black tracking-tighter text-foreground drop-shadow-sm">
                            {streak}
                        </span>
                        <span className="text-lg font-bold uppercase tracking-[0.2em] text-orange-500 mt-[-10px]">
                            Day Streak
                        </span>
                    </div>

                    <div className="text-center space-y-2 relative z-10">
                        <p className="text-xl font-medium tracking-tight">
                            "Consistency builds momentum."
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Keep going. Every day is a win.
                        </p>
                    </div>

                    <div className="pt-4 flex flex-col items-center gap-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                            Powered by Wellness App
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-muted/30 flex gap-3">
                    <Button onClick={handleShare} className="flex-1 gap-2 bg-orange-600 hover:bg-orange-700 text-white border-none shadow-lg shadow-orange-500/20 rounded-full h-11">
                        <Share2 className="h-4 w-4" />
                        Share Now
                    </Button>
                    <Button variant="outline" onClick={handleCopy} className="flex-1 gap-2 rounded-full h-11 border-border/50 hover:bg-background">
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                        {copied ? "Copied" : "Copy Link"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
