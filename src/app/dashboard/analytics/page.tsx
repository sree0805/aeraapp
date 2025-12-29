import { getAnalyticsData } from "@/app/dashboard/analytics/actions";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-charts";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const data = await getAnalyticsData();

    if (!data) {
        return <div>User not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground">
                    Visual insights into your sleep, emotions, and habits over the last 30 days.
                </p>
            </div>

            <AnalyticsDashboard
                sleepData={data.sleepData}
                moodData={data.moodData}
                habitMetrics={data.habitMetrics}
                weeklyChartData={data.weeklyChartData}
                subscriptionPlan={data.plan as 'free' | 'pro'}
            />
        </div>
    );
}
