import { Laugh, Smile, Meh, Frown, CloudRain } from "lucide-react"
import React from "react"

export type EmotionId = 'ecstatic' | 'happy' | 'neutral' | 'sad' | 'terrible'

export const EMOTION_ICONS: Record<EmotionId, React.ElementType> = {
    ecstatic: Laugh,
    happy: Smile,
    neutral: Meh,
    sad: Frown,
    terrible: CloudRain,
}

export const ATTR_MAP: Record<EmotionId, { label: string, color: string, bg: string }> = {
    ecstatic: { label: "Amazing", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    happy: { label: "Good", color: "text-green-500", bg: "bg-green-500/10" },
    neutral: { label: "Okay", color: "text-blue-500", bg: "bg-blue-500/10" },
    sad: { label: "Low", color: "text-orange-500", bg: "bg-orange-500/10" },
    terrible: { label: "Terrible", color: "text-red-500", bg: "bg-red-500/10" },
}

export function getEmotionId(score: number): EmotionId {
    if (score >= 9) return 'ecstatic'
    if (score >= 7) return 'happy'
    if (score >= 5) return 'neutral'
    if (score >= 3) return 'sad'
    return 'terrible'
}

interface EmotionIconProps {
    id: EmotionId
    className?: string
}

export function EmotionIcon({ id, className }: EmotionIconProps) {
    const Icon = EMOTION_ICONS[id]
    const attrs = ATTR_MAP[id]

    return (
        <div className={`rounded-full p-2 ${attrs.bg} ${attrs.color} ${className}`}>
            <Icon className="w-full h-full" />
        </div>
    )
}
