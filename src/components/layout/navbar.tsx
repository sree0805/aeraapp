"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-background/80 backdrop-blur-xl border-b border-border" // Theme aware background
                : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-6 h-6 text-primary">
                            <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                        </svg>
                        Aera
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="#features"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="#testimonials"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Testimonials
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Dashboard
                        </Link>
                    </div>

                    {/* CTA Button & Theme Toggle */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/login">
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                                Log in
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_-5px_rgba(129,74,200,0.5)] transition-all hover:scale-105">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
                            <Link
                                href="#features"
                                className="text-lg font-medium text-muted-foreground hover:text-foreground"
                                onClick={() => setIsOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-lg font-medium text-muted-foreground hover:text-foreground"
                                onClick={() => setIsOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <div className="flex flex-col gap-4 mt-4">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full border-border text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/signup" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white">
                                        Get Started
                                    </Button>
                                </Link>
                                <div className="flex justify-center pt-4">
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
