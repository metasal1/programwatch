'use client'

import { useState, useEffect, useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import { Copy, Check, Package, ShieldX, ShieldCheck } from 'lucide-react'
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
import SecurityModal from './SecurityModal';

const BPF_LOADER_UPGRADEABLE = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111');

interface Program {
    program_name: string
    version: string
    program_address: string
    program_derived_address: string
    instructions_referenced: string
    accounts_used: string
    error_messages: string
    mutable: boolean | null
    idl: string | null
    idl_address: string | null
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
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setError(null);
                const response = await fetch(`/api/database?page=${currentPage}&query=${encodeURIComponent(searchQuery)}`);
                const result = await response.json();

                if (result.success) {
                    setPrograms(result.data || []);
                    if (result.pagination) {
                        setTotalPages(result.pagination.totalPages);
                        setTotalItems(result.pagination.totalItems);
                    }
                } else {
                    const errorMessage = result.details || result.error || 'An unknown error occurred';
                    console.error('API Error:', errorMessage);
                    setError(errorMessage);
                    setPrograms([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching programs:', error);
                setError('Failed to fetch programs. Please try again later.');
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

    const handleOpen = (idlAddress: string) => {
        window.open(`/idl/${idlAddress}.json`, '_blank');
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
            program.program_name?.toLowerCase().includes(searchLower) ||
            program.program_address?.toLowerCase().includes(searchLower)
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

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Program</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Derived Address</TableHead>
                            <TableHead>Verified</TableHead>
                            <TableHead>Upgradable</TableHead>
                            <TableHead>IDL</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredPrograms.map((program, index) => (
                            <TableRow key={program.program_address || `program-${index}`}>
                                <TableCell>{program.program_name}</TableCell>
                                <TableCell>{program.version}</TableCell>
                                <TableCell>
                                    {program.program_address && <CopyableAddress address={program.program_address} />}
                                </TableCell>
                                <TableCell>
                                    {program.program_address && (
                                        <CopyableAddress address={getDerivedAddress(program.program_address)} />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {!program.verified && <SecurityModal programAddress={program.program_address} />}
                                </TableCell>
                                <TableCell>{program.mutable ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldX className="h-4 w-4 text-red-500" />}</TableCell>
                                <TableCell>
                                    {program.idl ?
                                        <>
                                            <Package onClick={() => handleOpen(program.program_address!)} className="h-4 w-4 text-green-500 cursor-pointer hover:text-green-900-600" />
                                            <CopyableAddress address={program.idl_address!} />
                                        </>
                                        : ''}
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
        </div >
    )
}
