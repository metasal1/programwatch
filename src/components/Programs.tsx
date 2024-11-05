'use client'

import { useState, useEffect, useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import { Copy, Check } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import ProgramDataModal from './ProgramDataModal';
import SecurityModal from './SecurityModal';

const BPF_LOADER_UPGRADEABLE = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111');

interface Program {
    program: string
    version: string
    address: string
    instructions_referenced: string
    accounts_used: string
    error_messages: string
    mutable: boolean | null
    idl: string | null
    deployed: string | null
    verified: boolean | null
}

const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...`;
};

export default function Programs() {
    const [programs, setPrograms] = useState<Program[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch(`/api/database?page=${currentPage}&query=${encodeURIComponent(searchQuery)}`);
                const result = await response.json();

                if (result.success) {
                    setPrograms(result.data || []);
                    if (result.pagination) {
                        setTotalPages(result.pagination.totalPages);
                        setTotalItems(result.pagination.totalItems);
                    }
                } else {
                    console.error('API Error:', result.error);
                    setPrograms([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching programs:', error);
                setPrograms([]);
                setLoading(false);
            }
        };

        setLoading(true);
        // Debounce the search to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchPrograms();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, currentPage]);

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedAddress(text);
        setTimeout(() => setCopiedAddress(null), 2000);
    };

    const CopyableAddress = ({ address }: { address: string }) => (
        <div className="flex items-center gap-2">
            <span className="font-mono hidden md:block">{address}</span>
            <span className="font-mono md:hidden">{truncateAddress(address)}</span>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => handleCopy(address)}
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            {copiedAddress === address ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <Copy className="h-4 w-4 text-gray-500" />
                            )}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{copiedAddress === address ? 'Copied!' : 'Copy to clipboard'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );

    const filteredPrograms = useMemo(() => {
        const searchLower = searchQuery.toLowerCase();
        return programs.filter(program =>
            program.program?.toLowerCase().includes(searchLower) ||
            program.address?.toLowerCase().includes(searchLower)
        );
    }, [programs, searchQuery]);

    const getDerivedAddress = (programAddress: string) => {
        try {
            const publicKey = new PublicKey(programAddress);
            const [programDataAddress] = PublicKey.findProgramAddressSync(
                [publicKey.toBytes()],
                BPF_LOADER_UPGRADEABLE
            );
            return programDataAddress.toString();
        } catch (error) {
            return `Invalid: ${error}`;
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    Showing {filteredPrograms.length} of {totalItems} programs
                    {searchQuery && ` (filtered by "${searchQuery}")`}
                </div>
                <Input
                    placeholder="Search by program name or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Program</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Derived Address</TableHead>
                            <TableHead>Instructions</TableHead>
                            <TableHead>Accounts</TableHead>
                            <TableHead>Errors</TableHead>
                            <TableHead>Inspect</TableHead>
                            <TableHead>Security</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredPrograms.map((program) => (
                            <TableRow key={program.address}>
                                <TableCell>{program.program}</TableCell>
                                <TableCell>{program.version}</TableCell>
                                <TableCell>
                                    {program.address && <CopyableAddress address={program.address} />}
                                </TableCell>
                                <TableCell>
                                    {program.address && (
                                        <CopyableAddress address={getDerivedAddress(program.address)} />
                                    )}
                                </TableCell>
                                <TableCell>{program.instructions_referenced}</TableCell>
                                <TableCell>{program.accounts_used}</TableCell>
                                <TableCell>{program.error_messages}</TableCell>
                                <TableCell>
                                    {program.address && <ProgramDataModal programAddress={program.address} />}
                                </TableCell>
                                <TableCell>
                                    {program.address && <SecurityModal programAddress={program.address} />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-center gap-2 mt-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
