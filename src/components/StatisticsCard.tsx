import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface StatProps {
    title: string;
    value: number;
}

export function StatisticsCard({ title, value }: StatProps) {
    return (

        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl text-green-600">
                {value?.toLocaleString()}
            </CardContent>
        </Card>
    );
} 
