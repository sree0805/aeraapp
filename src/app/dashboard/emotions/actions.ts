"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logEmotion(formData: FormData) {
    console.log("LOGGING EMOTION REQUEST RECEIVED"); // Debug log

    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        console.error("Auth Error:", authError);
        return { error: "Unauthorized" };
    }

    const moodScore = parseInt(formData.get("moodScore") as string);
    const emotions = formData.getAll("emotions") as string[];
    const note = formData.get("note") as string;

    console.log("Data:", { moodScore, emotions, note, userId: user.id });

    // Validate
    if (isNaN(moodScore)) {
        console.error("Invalid mood score");
        return { error: "Invalid mood score" };
    }

    const { error } = await supabase.from("emotion_logs").insert({
        user_id: user.id,
        mood_score: moodScore,
        emotions: emotions,
        note: note,
    });

    if (error) {
        console.error("Error inserting emotion:", error);
        return { error: "Failed to log emotion: " + error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/emotions");
    return { success: true };
}
