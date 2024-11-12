import { StatisticsCard } from './StatisticsCard';

export function StatisticsDashboard({ data }: {
    data: {
        stats: {
            totalCount: number;
            executableCount: number;
            mutableCount: number;
            frozenCount: number;
            hasIdlCount: number;
            verifiedCount: number;
        }
    }
}) {

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
        <div className="space-y-8">
            <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    <StatisticsCard title="Total Programs" value={data.stats.totalCount} />
                    <StatisticsCard title="Executable" value={data.stats.executableCount} />
                    <StatisticsCard title="Upgradable" value={data.stats.mutableCount} />
                    <StatisticsCard title="Frozen" value={data.stats.frozenCount} />
                    <StatisticsCard title="IDL Available" value={data.stats.hasIdlCount} />
                    <StatisticsCard title="Verified" value={data.stats.verifiedCount} />
                </div>
            </div>
        </div>
    );
}
