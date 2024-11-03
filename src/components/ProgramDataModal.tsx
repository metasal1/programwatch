'use client';

import { Package } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ProgramData {
    programId?: string;
    owner?: string;
    programdataAddress?: string;
    authority?: string;
    lastDeploySlot?: number;
    dataLen?: number;
    lamports?: number;
    success?: boolean;
    error?: string;
    performance: {
        totalTime: number;
        programAccountFetch: number;
        programDataAccountFetch: number;
    };
}

interface ProgramDataModalProps {
    programAddress: string;
}

export default function ProgramDataModal({ programAddress }: ProgramDataModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [programData, setProgramData] = useState<ProgramData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const fetchProgramData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/progdata?address=${programAddress}`);
            const data = await response.json();
            setProgramData(data);
        } catch (error) {
            console.error('Error fetching program data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        fetchProgramData();
    };

    const formatPerformance = (performance: ProgramData['performance']) => {
        return (
            <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-semibold mb-2">Performance Metrics</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>Total Time: {performance.totalTime.toFixed(2)}ms</div>
                    <div>Program Account Fetch: {performance.programAccountFetch.toFixed(2)}ms</div>
                    <div>Program Data Account Fetch: {performance.programDataAccountFetch.toFixed(2)}ms</div>
                </div>
            </div>
        );
    };

    const renderProgramData = () => {
        if (!programData) return null;

        if (programData.success === false) {
            return (
                <div className="space-y-4">
                    <div className="text-red-500 font-medium">{programData.error}</div>
                    {formatPerformance(programData.performance)}
                </div>
            );
        }

        return (
            <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <span className="font-semibold">Program ID:</span>
                        <div className="font-mono text-sm">{programData.programId}</div>
                    </div>
                    <div>
                        <span className="font-semibold">Owner:</span>
                        <div className="font-mono text-sm">{programData.owner}</div>
                    </div>
                    <div>
                        <span className="font-semibold">Program Data Address:</span>
                        <div className="font-mono text-sm">{programData.programdataAddress}</div>
                    </div>
                    <div>
                        <span className="font-semibold">Authority:</span>
                        <div className="font-mono text-sm">{programData.authority}</div>
                    </div>
                    <div>
                        <span className="font-semibold">Last Deploy Slot:</span>
                        <div>{programData.lastDeploySlot}</div>
                    </div>
                    <div>
                        <span className="font-semibold">Data Length:</span>
                        <div>{programData.dataLen?.toLocaleString()} bytes</div>
                    </div>
                    <div>
                        <span className="font-semibold">Lamports:</span>
                        <div>{programData.lamports?.toLocaleString()} lamports</div>
                    </div>
                </div>
                {formatPerformance(programData.performance)}
            </div>
        );
    };

    return (
        <div>
            <button
                onClick={handleOpen}
                className="p-2 hover:bg-gray-100 rounded-full"
            >
                <Package className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={modalRef}
                        className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Program Data</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded">
                                {renderProgramData()}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
