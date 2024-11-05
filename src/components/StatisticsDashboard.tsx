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

export function StatisticsDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/stats');
                const data = await response.json();

                if (data.success) {
                    setStats(data.stats);
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
        return <div className="text-red-500">{error}</div>;
    }

    if (!stats) {
        return <div className="animate-pulse">Loading statistics...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatisticsCard title="Total Programs" value={stats.totalCount} />
            <StatisticsCard title="Executable Programs" value={stats.executableCount} />
            <StatisticsCard title="Verified Programs" value={stats.verifiedCount} />
            <StatisticsCard title="Mutable Programs" value={stats.mutableCount} />
            <StatisticsCard title="Programs with IDL" value={stats.hasIdlCount} />
        </div>
    );
} 
