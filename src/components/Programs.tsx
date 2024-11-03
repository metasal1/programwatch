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

const BPF_LOADER_UPGRADEABLE = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111');

interface Program {
    pubkey: string
    account: {
        executable: boolean
        lamports: number
        owner: string
        data: {
            type: string
            data: number[]
        }
    }
    derived?: string
}

interface ProgramsResponse {
    success: boolean
    count: number
    programs: Program[]
}

export function Programs() {
    const [programs, setPrograms] = useState<Program[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const programsPerPage = 50

    useEffect(() => {
        fetch('/api/programs')
            .then(res => res.json())
            .then((data: ProgramsResponse) => {
                const processPrograms = (startIndex: number) => {
                    const chunk = data.programs.slice(startIndex, startIndex + 100);
                    if (chunk.length === 0) {
                        setLoading(false);
                        return;
                    }

                    const processedChunk = chunk.map(program => {
                        try {
                            const publicKey = new PublicKey(program.pubkey);
                            const [programDataAddress] = PublicKey.findProgramAddressSync(
                                [publicKey.toBytes()],
                                BPF_LOADER_UPGRADEABLE
                            );
                            return {
                                ...program,
                                derived: programDataAddress.toString()
                            };
                        } catch (error) {
                            return {
                                ...program,
                                derived: `Invalid: ${error}`
                            };
                        }
                    });

                    setPrograms(prev => [...prev, ...processedChunk]);
                    setTimeout(() => processPrograms(startIndex + 100), 0);
                };

                processPrograms(0);
            })
    }, [])

    const [debouncedSearch] = useState(() => {
        let timeoutId: NodeJS.Timeout;
        return (value: string, callback: (value: string) => void) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => callback(value), 300);
        };
    });

    const filteredPrograms = useMemo(() => {
        const searchLower = search.toLowerCase();
        return programs.filter(program =>
            program.pubkey.toLowerCase().includes(searchLower) ||
            program.account.owner.toLowerCase().includes(searchLower)
        );
    }, [programs, search]);

    const currentPrograms = useMemo(() => {
        const indexOfLastProgram = currentPage * programsPerPage;
        const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
        return filteredPrograms.slice(indexOfFirstProgram, indexOfLastProgram);
    }, [filteredPrograms, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value, (debouncedValue) => {
            setSearch(debouncedValue);
            setCurrentPage(1);
        });
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedAddress(text);
        setTimeout(() => setCopiedAddress(null), 2000);
    };

    const CopyableAddress = ({ address }: { address: string }) => (
        <div className="flex items-center gap-2">
            <span className="font-mono">{address}</span>
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

    return (
        <div className="w-full space-y-4">
            <div>
                Showing {currentPrograms.length} of {filteredPrograms.length} programs
                {search && ` (filtered from ${programs.length} total)`}
            </div>
            <Input
                placeholder="Search programs..."
                value={search}
                onChange={handleSearch}
                className="max-w-sm"
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Program Address</TableHead>
                            <TableHead>Derived Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : currentPrograms.map((program) => (
                            <TableRow key={program.pubkey}>
                                <TableCell>
                                    <CopyableAddress address={program.pubkey} />
                                </TableCell>
                                <TableCell>
                                    <CopyableAddress address={program.derived || ''} />
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
                    Page {currentPage} of {Math.ceil(filteredPrograms.length / programsPerPage)}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= Math.ceil(filteredPrograms.length / programsPerPage)}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
