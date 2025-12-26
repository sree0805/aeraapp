
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  CheckCircle2,
  BarChart,
  Star,
  BrainCircuit,
  Moon,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Vertical parallax: moved back to y
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className={cn("overflow-hidden relative w-full h-full", className)}>
      <motion.div style={{ y }} className="absolute inset-0 h-[130%] w-full -top-[15%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans relative overflow-x-hidden">
      {/* Global Background: Grid & Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle Grid Pattern */}
        {/* Subtle Grid Pattern - Adjusted for Light/Dark */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.1)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Purple/Pink Colorgrade Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-fuchsia-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
          {/* Additional Hero-Specific Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto px-4 text-center z-10 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-white/80">Productivity Redefined</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 max-w-5xl mx-auto">
              Master Your Habits <br className="hidden md:block" />
              <span className="text-foreground">Master Your Life</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The all-in-one productivity suite for high achievers. Track habits, monitor mood,
              and gain AI-driven insights to reach your peak potential.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 rounded-full text-base bg-primary hover:bg-primary/90 shadow-[0_0_40px_-10px_rgba(129,74,200,0.5)] transition-all hover:scale-105">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-base border-white/10 hover:bg-white/5 hover:text-white">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Hero Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-16 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm"
            >
              <div className="rounded-lg bg-black/80 aspect-[16/9] w-full overflow-hidden border border-white/5 relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                <ParallaxImage src="/dashboard.png" alt="Zenith Dashboard" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4 space-y-32">

            {/* Feature 1: Habit Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg text-primary">
                  <CheckCircle2 size={24} />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold">Scientific Habit Tracking</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Build streaks that last. Our streak engine helps you stay consistent every single day
                  to help you balance work, rest, and play. Visual progress bars keep you motivated.
                </p>
                <ul className="space-y-4 pt-4">
                  {['Daily Streak Engine', 'Visual Progress Bars', 'Category Filtering'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="text-primary h-5 w-5" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 aspect-video md:aspect-auto md:h-[400px] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50 z-10 pointer-events-none" />
                <ParallaxImage src="/habits page.png" alt="Habits Tracking Interface" />
              </div>
            </motion.div>

            {/* Feature 2: Analytics & Wellness */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse"
            >
              <div className="space-y-6 md:order-2">
                <div className="inline-flex items-center justify-center p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <BarChart size={24} />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold">Total Aera Analytics</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Connect the dots between your sleep, mood, and productivity.
                  Our dashboard visualizes how your rest affects your output.
                </p>
                <div className="flex gap-4 pt-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">
                    <Moon size={14} /> Sleep Tracking
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-sm">
                    <BrainCircuit size={14} /> Mood Logging
                  </span>
                </div>
                <Button variant="outline" className="mt-4 border-white/10 hover:bg-white/5 text-white">
                  View Analytics Demo
                </Button>
              </div>
              <div className="md:order-1 relative rounded-2xl border border-white/10 bg-white/5 p-4 aspect-video md:aspect-auto md:h-[400px] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 to-transparent opacity-50 z-10 pointer-events-none" />
                <ParallaxImage src="/analytics page.png" alt="Analytics Dashboard" />
              </div>
            </motion.div>

          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-zinc-950/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Community Loved</h2>
              <p className="text-muted-foreground text-lg">
                Helping thousands of users regain control of their time.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { q: "Finally, a habit tracker that doesn't feel like a chore. The design is stunning.", n: "Alex R.", t: "Designer" },
                { q: "The mood and sleep correlations gave me insights I never knew I needed.", n: "Sarah J.", t: "Product Manager" },
                { q: "Simple, effective, and beautiful. I use it every single day.", n: "Mike T.", t: "Developer" }
              ].map((item, i) => (
                <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors duration-300 shadow-sm">
                  <CardHeader>
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} className="fill-primary text-primary" />
                      ))}
                    </div>
                    <CardDescription className="text-base text-card-foreground/90 italic">
                      &quot;{item.q}&quot;
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white/50">
                      {item.n[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.n}</p>
                      <p className="text-xs text-muted-foreground">{item.t}</p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Level Up?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Start tracking, analyzing, and improving your life today.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 text-white">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border bg-background">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xl font-bold tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-5 h-5">
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
              Aera
            </p>

            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            </div>

            <p className="text-sm text-zinc-600">
              © 2024 Aera App. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
