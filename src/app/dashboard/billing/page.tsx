
import { createClient } from "@/lib/supabase/server";
import { BillingClient } from "@/components/dashboard/billing-client";

export default async function BillingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Please log in</div>;
    }

    const { data: usage } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .single();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Subscription & Credits</h2>
            </div>
            <BillingClient usage={usage} />
        </div>
    );
}
