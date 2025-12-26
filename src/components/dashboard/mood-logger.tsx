"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { logEmotion } from "@/app/dashboard/emotions/actions";
import { Smile, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmotionId, EmotionIcon, ATTR_MAP } from "@/components/dashboard/emotion-icons";

const EMOTION_TAGS = [
    "Happy", "Excited", "Grateful", "Relaxed",
    "Focused", "Tired", "Anxious", "Stressed",
    "Sad", "Angry", "Bored", "Confused"
];

export function MoodLogger() {
    const [open, setOpen] = useState(false);
    const [moodScore, setMoodScore] = useState(5);
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleEmotion = (tag: string) => {
        setSelectedEmotions(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("moodScore", moodScore.toString());
        selectedEmotions.forEach(e => formData.append("emotions", e));
        formData.append("note", note);

        const result = await logEmotion(formData);
        setIsSubmitting(false);

        if (result.success) {
            setOpen(false);
            // Reset form
            setMoodScore(5);
            setSelectedEmotions([]);
            setNote("");
        } else {
            // Handle error (could add toast later)
            console.error("Failed to log mood");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 rounded-full gap-2 px-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-all">
                    <Smile className="h-4 w-4" />
                    <span className="font-medium">Log Mood</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>How are you feeling?</DialogTitle>
                    <DialogDescription>
                        Track your emotional well-being over time.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    {/* Mood Slider Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="transition-all duration-300 transform scale-110">
                            <EmotionIcon
                                id={getEmotionId(moodScore)}
                                className="w-16 h-16"
                            />
                        </div>
                        <div className="font-semibold text-lg text-foreground/80">
                            {ATTR_MAP[getEmotionId(moodScore)].label} ({moodScore}/10)
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={moodScore}
                            onChange={(e) => setMoodScore(parseInt(e.target.value))}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between w-full text-xs text-muted-foreground px-1">
                            <span>1</span>
                            <span>10</span>
                        </div>
                    </div>

                    {/* Emotion Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            What emotions are you feeling?
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {EMOTION_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleEmotion(tag)}
                                    className={cn(
                                        "px-3 py-1 text-xs rounded-full border transition-colors",
                                        selectedEmotions.includes(tag)
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background hover:bg-secondary text-secondary-foreground border-input"
                                    )}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note Area */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Add a note (optional)
                        </label>
                        <Textarea
                            placeholder="Why do you feel this way?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Entry
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
