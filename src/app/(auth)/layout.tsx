import Link from "next/link";
import { OnboardingGradient } from "@/components/auth/onboarding-gradient";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container relative flex-1 flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-screen">
            <div className="relative hidden h-full flex-col lg:flex">
                <OnboardingGradient />
            </div>
            <div className="lg:p-8 flex flex-col items-center justify-center p-8 h-full">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] flex-1">
                    {children}
                </div>

                <footer className="w-full max-w-sm mt-8 py-4">
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                        <Link href="/contact" className="hover:text-primary transition-colors">
                            Contact Us
                        </Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">
                            Terms & Conditions
                        </Link>
                        <Link href="/cancellation" className="hover:text-primary transition-colors">
                            Cancellation Policy
                        </Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                    </nav>
                </footer>
            </div>
        </div>
    );
}
