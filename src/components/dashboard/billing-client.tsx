"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Check, Loader2, Zap, CreditCard, Clock, Receipt } from "lucide-react"

interface BillingClientProps {
    usage: any
}

// Mock History Data - Typically fetched from Stripe via backend
const paymentHistory: any[] = []

export function BillingClient({ usage }: BillingClientProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleUpgrade = async (priceId: string) => {
        setIsLoading(true)
        // Mock upgrade flow
        setTimeout(() => {
            setIsLoading(false)
            alert("This connects to Stripe in production.")
        }, 1000)
    }

    const isPro = usage?.plan === 'pro'
    const currentPlanName = isPro ? "Pro Plan" : "Free Plan"

    // Feature Logic: 8 credits for Free, 35 for Pro
    const dailyCredits = isPro ? 35 : 8

    return (
        <div className="space-y-8 pb-10 max-w-md mx-auto md:max-w-5xl px-4 md:px-0">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Billing & Plans</h2>
                <p className="text-muted-foreground">Manage your subscription and credits.</p>
            </div>

            {/* Current Plan Card (Mobile Optimized) */}
            <Card className="border-none shadow-md bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <CardHeader className="relative z-10 pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardDescription className="text-indigo-100 mb-1">Current Plan</CardDescription>
                            <CardTitle className="text-3xl font-bold">{currentPlanName}</CardTitle>
                        </div>
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">Active</Badge>
                    </div>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-50">
                        <Zap className="h-5 w-5 fill-indigo-50" />
                        <span className="font-medium">{dailyCredits} Daily AI Credits included</span>
                    </div>
                    {isPro && (
                        <div className="flex items-center gap-2 text-indigo-50">
                            <CreditCard className="h-5 w-5" />
                            <span className="font-medium">Renews every 15 days ($19.99 / ₹599)</span>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="relative z-10 pt-2">
                    <Button
                        size="lg"
                        variant="secondary"
                        className="w-full sm:w-auto font-semibold shadow-sm text-indigo-600 hover:text-indigo-700"
                        onClick={() => handleUpgrade('price_pro')}
                    >
                        {isPro ? "Manage Subscription" : "Upgrade to Pro ($19.99 / ₹599)"}
                    </Button>
                </CardFooter>
            </Card>

            {/* Credit Usage */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Available Daily Credits</CardTitle>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">{dailyCredits}</span>
                            <span className="text-sm text-muted-foreground">/ day</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-full" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Refreshes every 24 hours.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Top-up Credits</CardTitle>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">{usage?.purchased_credits || 0}</span>
                            <span className="text-sm text-muted-foreground">available</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" size="sm" className="w-full">Buy More Credits</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Pro Plan Benefits - Only show for Free users */}
            {!isPro && (
                <Card className="border-primary/20 bg-primary/5 shadow-none">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Why Upgrade to Pro?</CardTitle>
                        </div>
                        <CardDescription>
                            Unlock premium features for <span className="text-foreground font-medium">$19.99 / ₹599 for 15 days</span>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                            {[
                                "35 AI Credits per Day",
                                "Advanced Weekly Analytics",
                                "Unlimited Habit Integrations",
                                "Advanced AI Therapist Access",
                                "Detailed Mood & Sleep Insights",
                                "Early Access to New Features"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="shrink-0 p-1 rounded-full bg-primary/10 text-primary">
                                        <Check className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Payment History - Only show if data exists */}
            {paymentHistory.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Payment History</h3>

                    {/* Desktop View */}
                    <div className="hidden md:block rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentHistory.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell>{invoice.date}</TableCell>
                                        <TableCell>{invoice.plan}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">{invoice.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{invoice.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View (Stacked Cards) */}
                    <div className="md:hidden space-y-3">
                        {paymentHistory.map((invoice) => (
                            <Card key={invoice.id} className="bg-card">
                                <CardContent className="p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-secondary p-2 rounded-full">
                                                <Receipt className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{invoice.plan}</p>
                                                <p className="text-xs text-muted-foreground">{invoice.date}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold">{invoice.amount}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                        <span className="text-xs text-muted-foreground">ID: {invoice.id}</span>
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-500/10 dark:bg-green-900/20 dark:text-green-400 font-normal">
                                            {invoice.status}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
