import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3 } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 md:py-32 lg:py-40 text-center px-4 md:px-6 bg-gradient-to-b from-background to-muted/50">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        Build Faster. Scale Better.
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        The complete toolkit for modern web applications. Beautifully designed components
                        built with Radix UI and Tailwind CSS.
                    </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                    <Link href="/signup">
                        <Button size="lg" className="h-12 px-8 text-base">
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                            View Demo
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-12 md:py-24 lg:py-32 space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Everything you need
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                        A comprehensive suite of features designed to help you build production-ready applications in record time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <Zap className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>Lightning Fast</CardTitle>
                            <CardDescription>
                                Built for speed and performance. Optimized for the best user experience.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Edge Ready</li>
                                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Server Components</li>
                                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Zero Config</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Shield className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>Secure by Default</CardTitle>
                            <CardDescription>
                                Enterprise-grade security features built right in.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Auth Ready</li>
                                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Data Encryption</li>
                                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Role Management</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <BarChart3 className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>Analytics Included</CardTitle>
                            <CardDescription>
                                Gain insights into your users with built-in analytics dashboards.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Real-time Data</li>
                                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Custom Reports</li>
                                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Export Support</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-slate-900 text-white py-24">
                <div className="container flex flex-col items-center text-center space-y-6">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to get started?</h2>
                    <p className="max-w-[600px] text-slate-300 md:text-xl">
                        Join thousands of developers building the future of the web today.
                    </p>
                    <Button size="lg" variant="secondary" className="h-12 px-8">
                        Start Building Now
                    </Button>
                </div>
            </section>
        </div>
    );
}
