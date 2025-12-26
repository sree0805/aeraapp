import { Navbar } from "@/components/layout/navbar";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-sans">
            <Navbar />
            <div className="container mx-auto px-4 py-32 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8">Aera – Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 23, 2025</p>

                <div className="space-y-6 text-white/90 leading-relaxed">
                    <section>
                        <p className="mb-4">Aera respects your privacy.</p>
                        <p className="mb-4">We collect only the minimum data required to make the app work, such as:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Account details (email, login info)</li>
                            <li>Habit, recovery, and usage data you choose to enter</li>
                            <li>Basic device and app performance data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">How we use your data</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>To operate and improve Aera</li>
                            <li>To personalize your experience</li>
                            <li>To maintain security and prevent misuse</li>
                        </ul>
                    </section>

                    <section>
                        <p className="mb-4">We do not sell your personal data.</p>
                        <p className="mb-4">Your data is stored securely and used only for app functionality.</p>
                        <p className="mb-4">You can request deletion of your account and data at any time.</p>
                        <p className="font-medium text-white">By using Aera, you agree to this Privacy Policy.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
