
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia', // Use latest or recent version
});

export async function POST(req: Request) {
    try {
        const { plan } = await req.json();
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let priceData = {};
        let credits = 0;

        if (plan === 'starter') {
            priceData = {
                currency: 'usd',
                product_data: {
                    name: 'Starter Plan - 100 AI Credits',
                    description: 'One-time purchase of 100 credits for the AI Chat.',
                },
                unit_amount: 999, // $9.99
            };
            credits = 100;
        } else if (plan === 'pro') {
            priceData = {
                currency: 'usd',
                product_data: {
                    name: 'Pro Plan - 500 AI Credits',
                    description: 'One-time purchase of 500 credits for the AI Chat (Most Popular).',
                },
                unit_amount: 2999, // $29.99
            };
            credits = 500;
        } else {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: priceData as any,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
            metadata: {
                userId: user.id,
                planType: plan,
                credits: credits.toString(),
            },
            customer_email: user.email,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
