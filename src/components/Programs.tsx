'use client'

import { useState, useEffect, useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import { Copy, ArrowUpRight, ArrowRight, Package as IDLIcon, PackageX as NoIDLIcon, SnowflakeIcon as FrozenIcon, SquareTerminalIcon as ExecutableIcon, CircleX as ClosedIcon, ShieldX as NotVerifiedIcon, Upload as UpgradeableIcon, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import TooltipComponent from '@/components/TooltipComponent';
import SecurityModal from '@/components/SecurityModal';
import { Button } from './ui/button';
import TableSkeleton from './TableSkeleton';
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const BPF_LOADER_UPGRADEABLE = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111');

interface Program {
    program_name: string
    version: string
    program_address: string
    program_derived_address: string
    instructions_referenced: string
    accounts_used: string
    size: string
    slot: string
    error_messages: string
    executable: boolean | null
    mutable: boolean | null
    idl: string | null
    idl_address: string | null
    deployed: string | null
    verified: boolean | null
}

interface Filters {
    executable: boolean | null
    upgradeable: boolean | null
    verified: boolean | null
    hasIdl: boolean | null
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
    const [filters, setFilters] = useState<Filters>({
        executable: null,
        upgradeable: null,
        verified: null,
        hasIdl: null,
    })

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setError(null);
                const queryParams = new URLSearchParams({
                    page: currentPage.toString(),
                    query: searchQuery,
                    ...(filters.executable !== null && { executable: filters.executable.toString() }),
                    ...(filters.upgradeable !== null && { mutable: filters.upgradeable.toString() }),
                    ...(filters.verified !== null && { verified: filters.verified.toString() }),
                    ...(filters.hasIdl !== null && { idl: filters.hasIdl.toString() }),
                });

                const response = await fetch(`/api/database?${queryParams}`);
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
        const timeoutId = setTimeout(() => {
            fetchPrograms();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, currentPage, filters]);

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedAddress(text);
        setTimeout(() => setCopiedAddress(null), 2000);
    };

    const handleOpen = (idlAddress: string) => {
        toast.info(`Opening IDL for ${idlAddress} in new window.`);
        setTimeout(() => {
            window.open(`/idl/${idlAddress}.json`, '_blank');
        }, 1000);
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

    const FilterButtons = () => (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Executable:</span>
                <ToggleGroup type="single" value={filters.executable === null ? 'Any' : filters.executable ? 'Yes' : 'No'}
                    onValueChange={(value) => setFilters(prev => ({
                        ...prev,
                        executable: value === 'Yes' ? true : value === 'No' ? false : null
                    }))}
                >
                    <ToggleGroupItem value="Any" aria-label="Any Executable">Doesn't Matter</ToggleGroupItem>
                    <ToggleGroupItem value="Yes" aria-label="Executable">Yes</ToggleGroupItem>
                    <ToggleGroupItem value="No" aria-label="Not Executable">No</ToggleGroupItem>
                </ToggleGroup>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Upgradeable:</span>
                <ToggleGroup type="single" value={filters.upgradeable === null ? 'Any' : filters.upgradeable ? 'Yes' : 'No'}
                    onValueChange={(value) => setFilters(prev => ({
                        ...prev,
                        upgradeable: value === 'Yes' ? true : value === 'No' ? false : null
                    }))}
                >
                    <ToggleGroupItem value="Any" aria-label="Any Upgradeable">Doesn't Matter</ToggleGroupItem>
                    <ToggleGroupItem value="Yes" aria-label="Upgradeable">Yes</ToggleGroupItem>
                    <ToggleGroupItem value="No" aria-label="Not Upgradeable">No</ToggleGroupItem>
                </ToggleGroup>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Verified:</span>
                <ToggleGroup type="single" value={filters.verified === null ? 'Any' : filters.verified ? 'Yes' : 'No'}
                    onValueChange={(value) => setFilters(prev => ({
                        ...prev,
                        verified: value === 'Yes' ? true : value === 'No' ? false : null
                    }))}
                >
                    <ToggleGroupItem value="Any" aria-label="Any Verified">Doesn't Matter</ToggleGroupItem>
                    <ToggleGroupItem value="Yes" aria-label="Verified">Yes</ToggleGroupItem>
                    <ToggleGroupItem value="No" aria-label="Not Verified">No</ToggleGroupItem>
                </ToggleGroup>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Has IDL:</span>
                <ToggleGroup type="single" value={filters.hasIdl === null ? 'Any' : filters.hasIdl ? 'Yes' : 'No'}
                    onValueChange={(value) => setFilters(prev => ({
                        ...prev,
                        hasIdl: value === 'Yes' ? true : value === 'No' ? false : null
                    }))}
                >
                    <ToggleGroupItem value="Any" aria-label="Any IDL">Doesn't Matter</ToggleGroupItem>
                    <ToggleGroupItem value="Yes" aria-label="Has IDL">Yes</ToggleGroupItem>
                    <ToggleGroupItem value="No" aria-label="No IDL">No</ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    );

    const getToggleValue = (value: boolean | null): string => {
        if (value === true) return 'Yes';
        if (value === false) return 'No';
        return 'Any';
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="text-sm italic">
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
                <FilterButtons />
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
                            <TableHead>Size</TableHead>
                            <TableHead>Slot</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Derived Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton />
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
                                <TableCell>{program.size}</TableCell>
                                <TableCell>{program.slot}</TableCell>
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
