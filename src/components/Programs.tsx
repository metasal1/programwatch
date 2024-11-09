'use client'

import { useState, useEffect, useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import { Copy, ArrowUpRight, ArrowRight, Package as IDLIcon, PackageX as NoIDLIcon, SnowflakeIcon as FrozenIcon, SquareTerminalIcon as ExecutableIcon, CircleX as ClosedIcon, ShieldX as NotVerifiedIcon, Upload as UpgradeableIcon, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import TooltipComponent from '@/components/TooltipComponent';
import SecurityModal from '@/components/SecurityModal';
import { Button } from './ui/button';
const BPF_LOADER_UPGRADEABLE = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111');

interface Program {
    program_name: string
    version: string
    program_address: string
    program_derived_address: string
    instructions_referenced: string
    accounts_used: string
    error_messages: string
    executable: boolean | null
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
            <div onClick={() => handleCopy(address)}>
                {TooltipComponent({ icon: Copy, title: '', content: copiedAddress === address ? 'Copied!' : 'Copy to clipboard' })}
            </div>
        </div>
    );

    const OpenInNewTab = ({ address }: { address: string }) => (
        <div className="flex items-center gap-2">
            <button
                onClick={() => window.open(`https://solana.fm/address/${address}`, '_blank')}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
                <ArrowUpRight className="h-4 w-4 text-gray-500" />
            </button>
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
                            <TableHead>Status</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Derived Address</TableHead>
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
                                    <div className="flex items-center gap-2">
                                        {TooltipComponent({ title: '', content: program.mutable ? 'The program is upgradeable.' : 'The program is not upgradeable.', icon: program.mutable ? UpgradeableIcon : FrozenIcon, iconColor: program.mutable ? 'text-green-500' : 'text-gray-500' })}
                                        {program.verified ?
                                            <SecurityModal program_address={program.program_address} />
                                            // TooltipComponent({title: '', content: 'The program is verified.', icon: VerifiedIcon, iconColor: 'text-green-500' })
                                            :
                                            TooltipComponent({ title: '', content: 'The program is not verified.', icon: NotVerifiedIcon, iconColor: 'text-gray-500' })
                                        }
                                        {TooltipComponent({ title: '', content: program.executable ? 'The program is executable.' : 'The program is not executable.', icon: program.executable ? ExecutableIcon : ClosedIcon, iconColor: program.executable ? 'text-green-500' : 'text-gray-500' })}
                                        <div onClick={program.idl ? () => handleOpen(program.program_address || '') : undefined}>
                                            {TooltipComponent({ title: '', content: program.idl ? 'The program has an IDL.' : 'The program does not have an IDL.', icon: program.idl ? IDLIcon : NoIDLIcon, iconColor: program.idl ? 'text-green-500' : 'text-gray-500' })}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {program.program_address && <div className="flex items-center gap-2"><CopyableAddress address={program.program_address} />
                                        <OpenInNewTab address={program.program_address} />
                                    </div>}
                                </TableCell>
                                <TableCell>
                                    {program.program_address && (
                                        <div className="flex items-center gap-2"><CopyableAddress address={getDerivedAddress(program.program_address)} />
                                            <OpenInNewTab address={getDerivedAddress(program.program_address)} />
                                        </div>
                                    )}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-center gap-2 mt-4">
                <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    <ArrowLeft /> Previous
                </Button>
                <span className="px-4 py-2 text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Next <ArrowRight />
                </Button>
            </div>
        </div >
    )
}
