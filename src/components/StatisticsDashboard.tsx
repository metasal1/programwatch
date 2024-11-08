'use client';

import { useEffect, useState } from 'react';
import { StatisticsCard } from './StatisticsCard';

interface Stats {
    totalCount: number;
    executableCount: number;
    verifiedCount: number;
    mutableCount: number;
    hasIdlCount: number;
}

interface OwnerStat {
    owner: string;
    programCount: number;
    executableCount: number;
    verifiedCount: number;
    mutableCount: number;
    hasIdlCount: number;
}

interface ApiResponse {
    success: boolean;
    stats: Stats;
    ownerStats: OwnerStat[];
}

export function StatisticsDashboard() {
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

    if (!data) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
                    ))}
                </div>
                <div className="rounded-lg bg-muted h-64 animate-pulse" />
            </div>
        );
    }

    const formatOwnerName = (owner: string) => {
        // Shorten the owner name for display
        return owner.slice(0, 12) + '...' + owner.slice(-4);
    };

    return (
        <div className="space-y-8">
            <div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <StatisticsCard title="Total Programs" value={data.stats.totalCount} />
                    <StatisticsCard title="Executable" value={data.stats.executableCount} />
                    <StatisticsCard title="Verified" value={data.stats.verifiedCount} />
                    <StatisticsCard title="Upgradable" value={data.stats.mutableCount} />
                    <StatisticsCard title="IDL Available" value={data.stats.hasIdlCount} />
                </div>
            </div>
            <div className="rounded-lg border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Owner</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Programs</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Executable</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Verified</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Upgradeable</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Has IDL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.ownerStats.map((owner) => (
                                <tr
                                    key={owner.owner}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <td className="p-4 align-middle font-mono text-sm">
                                        {formatOwnerName(owner.owner)}
                                    </td>
                                    <td className="p-4 text-right align-middle">{owner.programCount.toLocaleString()}</td>
                                    <td className="p-4 text-right align-middle">{owner.executableCount.toLocaleString()}</td>
                                    <td className="p-4 text-right align-middle">{owner.verifiedCount.toLocaleString()}</td>
                                    <td className="p-4 text-right align-middle">{owner.mutableCount.toLocaleString()}</td>
                                    <td className="p-4 text-right align-middle">{owner.hasIdlCount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
