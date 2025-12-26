import { Navbar } from "@/components/layout/navbar";

export default function CancellationPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-sans">
            <Navbar />
            <div className="container mx-auto px-4 py-32 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8">Cancellation & Refund Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 25, 2025</p>

                <div className="space-y-8 text-white/90 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">Cancellation</h2>
                        <p className="mb-4">
                            You may cancel your subscription at any time through your account settings.
                            Upon cancellation, your premium access will continue until the end of the current billing cycle.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">Refunds</h2>
                        <p className="mb-2">
                            As stated in our Terms & Conditions, all purchases are generally final.
                        </p>
                        <p className="mb-4">
                            However, if you believe you have been charged in error or have a specific issue with the service that warrants a refund,
                            please contact our support team within 7 days of the charge.
                        </p>
                        <p className="text-red-400 font-medium">
                            Note: We do not provide refunds for partial months or unused annual subscriptions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
                        <p>
                            If you have any questions about our Cancellation Policy, please contact us at <a href="mailto:billing@aera.app" className="text-primary hover:underline">billing@aera.app</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
