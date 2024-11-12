import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
interface OwnerStats {
    owner: string;
    programCount: number;
    executableCount: number;
    mutableCount: number;
    frozenCount: number;
    hasIdlCount: number;
    verifiedCount: number;
}

interface BreakdownDashboardProps {
    data: {
        ownerStats: OwnerStats[];
    };
}

export function BreakdownDashboard({ data }: BreakdownDashboardProps) {

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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Owner</TableHead>
                    <TableHead>Programs</TableHead>
                    <TableHead>Executable</TableHead>
                    <TableHead>Upgradeable</TableHead>
                    <TableHead>Frozen</TableHead>
                    <TableHead>Has IDL</TableHead>
                    <TableHead>Verified</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.ownerStats.map((owner) => (
                    <TableRow
                        key={owner.owner}
                        className="border-b transition-colors hover:bg-muted/50 text-xs"
                    >
                        <TableCell className="p-4 align-middle font-mono text-xs">
                            {owner.owner || "Native Programs"}
                        </TableCell>
                        <TableCell>{owner.programCount.toLocaleString()}</TableCell>
                        <TableCell>{owner.executableCount.toLocaleString()}</TableCell>
                        <TableCell>{owner.mutableCount.toLocaleString()}</TableCell>
                        <TableCell>{owner.frozenCount.toLocaleString()}</TableCell>
                        <TableCell>{owner.hasIdlCount.toLocaleString()}</TableCell>
                        <TableCell>{owner.verifiedCount.toLocaleString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table>
    )
}
