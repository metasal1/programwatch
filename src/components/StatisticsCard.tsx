interface StatProps {
    title: string;
    value: number;
}

export function StatisticsCard({ title, value }: StatProps) {
    return (
        <div className="flex flex-col">
            <h3 className="text-black font-bold text-sm mb-1">{title}</h3>
            <p className="text-2xl font-bold text-green-600">
                {value.toLocaleString()}
            </p>
        </div>
    );
} 
