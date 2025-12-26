import { Navbar } from "@/components/layout/navbar";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-sans">
            <Navbar />
            <div className="container mx-auto px-4 py-32 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

                <div className="space-y-6 text-white/90 leading-relaxed">
                    <p className="text-lg text-muted-foreground">
                        We&apos;d love to hear from you. Whether you have a question about features, pricing, or need support, our team is ready to answer all your questions.
                    </p>

                    <div className="grid gap-6 mt-8">
                        <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                            <h3 className="text-xl font-semibold mb-2">Contact</h3>
                            <p className="text-muted-foreground mb-4">For all inquiries, please email us directly.</p>
                            <a href="mailto:aeravision554@gmail.com" className="text-primary hover:underline">aeravision554@gmail.com</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
