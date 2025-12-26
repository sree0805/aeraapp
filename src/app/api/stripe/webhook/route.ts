
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js"; // Use server-side admin client creation if possible or standard client

// We need a Service Role client to write to tables securely without user context in webhook
// Assuming we can use internal envs for this.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Note: In prod, MUST use SERVICE_ROLE_KEY to bypass RLS for webhook updates if user is not auth-ed in context.
// For now, if RLS on 'user_usage' allows update by owner, webhook has no owner. 
// So SERVICE_ROLE_KEY is required for "user_usage" updates from webhook.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const creditsStr = session.metadata?.credits;
        const planType = session.metadata?.planType;

        if (!userId || !creditsStr) {
            console.error("Missing metadata in Stripe session");
            return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        const creditsToAdd = parseInt(creditsStr, 10);
        const amountPaid = session.amount_total || 0;
        const currency = session.currency || 'usd';
        const paymentId = session.id;

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 1. Log Transaction
        const { error: txError } = await supabase.from('transactions').insert({
            user_id: userId,
            amount: amountPaid,
            currency: currency,
            status: 'succeeded',
            stripe_payment_id: paymentId,
            credits_added: creditsToAdd,
            plan_type: planType
        });

        if (txError) {
            console.error("Failed to log transaction:", txError);
            // Verify if it was a duplicate insert (idempotency)?
            // If unique constraint on stripe_payment_id exists, we are safe.
            return NextResponse.json({ error: "Transaction log failed" }, { status: 500 });
        }

        // 2. Add Credits
        // First get current usage
        const { data: usage, error: fetchError } = await supabase
            .from('user_usage')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError || !usage) {
            // If usage doesn't exist, create it (edge case, usually exists by now)
            await supabase.from('user_usage').insert({
                user_id: userId,
                plan: planType || 'free', // Upgrade plan text?
                daily_credits: 5,
                purchased_credits: creditsToAdd,
                last_reset_date: new Date().toISOString()
            });
        } else {
            // Update
            // If plan was "starter" or "pro", we might update the text label too if we want.
            // But primarily we add credits.
            await supabase
                .from('user_usage')
                .update({
                    purchased_credits: (usage.purchased_credits || 0) + creditsToAdd,
                    plan: planType // Update the plan badge to the latest purchased tier
                })
                .eq('user_id', userId);
        }
    }

    return NextResponse.json({ received: true });
}
