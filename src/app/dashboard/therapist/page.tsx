import { ChatInterface } from "@/components/dashboard/chat-interface";

export default function TherapistPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">AI Therapist</h2>
                <p className="text-muted-foreground">
                    A safe space to reflect, vent, or seek advice. All conversations are private.
                </p>
            </div>

            <div className="max-w-4xl mx-auto w-full">
                <ChatInterface />
            </div>
        </div>
    )
}
