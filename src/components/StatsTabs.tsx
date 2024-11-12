'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatisticsDashboard } from "./StatisticsDashboard"
import { BreakdownDashboard } from "./BreakdownDashboard"
import { useEffect, useState } from 'react';

interface Stats {
    totalCount: number;
    executableCount: number;
    verifiedCount: number;
    mutableCount: number;
    frozenCount: number;
    hasIdlCount: number;
}

interface OwnerStat {
    owner: string;
    programCount: number;
    executableCount: number;
    verifiedCount: number;
    mutableCount: number;
    frozenCount: number;
    hasIdlCount: number;
}

interface ApiResponse {
    success: boolean;
    stats: Stats;
    ownerStats: OwnerStat[];
}

export default function StatsTabs() {

    const [data, setData] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/stats');
                const data = await response.json();

                if (data.success) {
                    setData(data);
                } else {
                    setError('Failed to load statistics');
                }
            } catch (err) {
                setError('Error fetching statistics');
                console.error('Error fetching stats:', err);
            }
        }

        fetchStats();
    }, []);

    if (error) {
        return (
            <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
                {error}
            </div>
        );
    }

    // The loaders

    if (!data) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Tabs defaultValue="statistics" className="">
            <TabsList>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="statistics">
                <StatisticsDashboard data={data} />
            </TabsContent>
            <TabsContent value="breakdown">
                <BreakdownDashboard data={data} />
            </TabsContent>
        </Tabs>
    )
}

