import { Navbar } from "@/components/layout/navbar";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-sans">
            <Navbar />
            <div className="container mx-auto px-4 py-32 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8">Aera – Terms & Conditions</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 23, 2025</p>

                <div className="space-y-8 text-white/90 leading-relaxed">
                    <section>
                        <p className="mb-4">By downloading or using Aera, you agree to the following terms:</p>
                        <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                            <li>Aera is a habit, recovery, and self-discipline tracking tool, not medical or professional advice.</li>
                            <li>You are responsible for how you use the app and its content.</li>
                            <li>Do not misuse, reverse engineer, or attempt to disrupt the app.</li>
                            <li>We may update features or terms at any time.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">Payments & Refunds</h2>
                        <p className="mb-2">All purchases are final.</p>
                        <p className="font-bold text-red-400 mb-4">NO REFUNDS under any circumstances.</p>
                    </section>

                    <section>
                        <p className="font-medium text-white">If you do not agree with these terms, please do not use Aera.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
