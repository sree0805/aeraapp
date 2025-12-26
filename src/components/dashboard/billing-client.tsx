"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Import UI components
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface BillingClientProps {
    usage: {
        plan: string;
        daily_credits: number;
        purchased_credits: number;
    } | null; // null if no record yet (effectively free)
}

export function BillingClient({ usage }: BillingClientProps) {
    const router = useRouter();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const currentPlan = usage?.plan || 'free';
    const dailyCredits = usage?.daily_credits ?? 5; // Default to 5 if new
    const purchasedCredits = usage?.purchased_credits ?? 0;

    const handleUpgrade = async (plan: string) => {
        setLoadingPlan(plan);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                body: JSON.stringify({ plan }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("No checkout URL returned");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Overview Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Current Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize text-indigo-900">{currentPlan}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {currentPlan === 'free' ? 'Basic daily access' : 'Premium features unlocked'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Daily Credits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dailyCredits} <span className="text-sm font-normal text-muted-foreground">/ 5</span></div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Resets every 24 hours
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Purchased Credits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{purchasedCredits}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Never expire
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Plans Section */}
            <div>
                <h3 className="text-xl font-semibold mb-6">Available Plans</h3>
                <div className="grid gap-6 md:grid-cols-3">

                    {/* FREE */}
                    <Card className={`relative ${currentPlan === 'free' ? 'border-primary shadow-sm' : ''}`}>
                        <CardHeader>
                            <CardTitle>Free</CardTitle>
                            <CardDescription>Perfect for getting started</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">$0</div>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> 5 AI Credits / Day</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Basic Habits</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Daily Insights</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline" disabled>
                                {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* STARTER */}
                    <Card className={`relative ${currentPlan === 'starter' ? 'border-primary shadow-sm' : ''}`}>
                        <CardHeader>
                            <CardTitle>Starter</CardTitle>
                            <CardDescription>A nice boost of credits</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">$9.99</div>
                            <div className="text-sm text-muted-foreground mb-4">One-time payment</div>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li className="flex items-center"><Zap className="mr-2 h-4 w-4 text-yellow-500" /> +100 AI Credits</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Everything in Free</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Priority Support</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => handleUpgrade('starter')}
                                disabled={loadingPlan === 'starter'}
                            >
                                {loadingPlan === 'starter' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {currentPlan === 'starter' || currentPlan === 'pro' ? 'Add +100 Credits' : 'Get Starter'}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* PRO */}
                    <Card className={`relative border-indigo-500 shadow-md transform scale-105 z-10 ${currentPlan === 'pro' ? 'bg-indigo-50/50' : ''}`}>
                        <div className="absolute top-0 right-0 -mt-3 -mr-3">
                            <Badge className="bg-indigo-600 hover:bg-indigo-700">Most Popular</Badge>
                        </div>
                        <CardHeader>
                            <CardTitle className="text-indigo-900">Pro</CardTitle>
                            <CardDescription>For serious productivity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-indigo-700">$29.99</div>
                            <div className="text-sm text-muted-foreground mb-4">One-time payment</div>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li className="flex items-center"><Zap className="mr-2 h-4 w-4 text-yellow-500" /> +500 AI Credits</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Advanced Insights</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Early Access Features</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={() => handleUpgrade('pro')}
                                disabled={loadingPlan === 'pro'}
                            >
                                {loadingPlan === 'pro' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {currentPlan === 'pro' ? 'Add +500 Credits' : 'Get Pro'}
                            </Button>
                        </CardFooter>
                    </Card>

                </div>
            </div>
        </div>
    );
}
