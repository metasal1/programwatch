import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import TooltipComponent from '@/components/TooltipComponent';
import { ShieldCheck as VerifiedIcon, Loader2, Github, Copy, ArrowUpRight, Check } from "lucide-react";
import { useState, useEffect } from 'react';

interface VerificationData {
    is_verified: boolean;
    message: string;
    on_chain_hash: string;
    executable_hash: string;
    last_verified_at: string;
    repo_url: string;
    commit: string;
}

export default function SecurityModal({ program_address }: { program_address: string }) {
    const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchVerificationData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/verification?address=${encodeURIComponent(program_address)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch verification data');
                }
                const data: VerificationData = await response.json();
                setVerificationData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        if (program_address) {
            fetchVerificationData();
        }
    }, [program_address]);

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000; // years
        if (interval > 1) return Math.floor(interval) + ' years ago';

        interval = seconds / 2592000; // months
        if (interval > 1) return Math.floor(interval) + ' months ago';

        interval = seconds / 86400; // days
        if (interval > 1) return Math.floor(interval) + ' days ago';

        interval = seconds / 3600; // hours
        if (interval > 1) return Math.floor(interval) + ' hours ago';

        interval = seconds / 60; // minutes
        if (interval > 1) return Math.floor(interval) + ' minutes ago';

        return Math.floor(seconds) + ' seconds ago';
    };

    const shortenHash = (hash: string) => {
        return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(program_address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <TooltipComponent
                    title={''}
                    content={verificationData?.message || 'Loading verification status...'}
                    icon={isLoading ? Loader2 : VerifiedIcon}
                    iconColor={error ? 'text-red-500' : 'text-green-500'}
                    className={isLoading ? 'animate-spin' : ''}
                />
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <VerifiedIcon className="text-green-500" />
                        <span className="text-green-500">Verified Program</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : verificationData && (
                            <>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <p className="text-sm font-bold">Program Address</p>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-mono text-xs break-all">{program_address}</p>
                                        <button
                                            onClick={copyToClipboard}
                                            className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                            {copied ? (
                                                <Check size={16} className="text-green-500" />
                                            ) : (
                                                <Copy size={16} className="text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">On-chain Hash</p>
                                        <p className="font-mono text-xs">{shortenHash(verificationData.on_chain_hash)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Executable Hash</p>
                                        <p className="font-mono text-xs">{shortenHash(verificationData.executable_hash)}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-bold">Last Verified</p>
                                    <p className="text-sm">{verificationData.last_verified_at}</p>
                                    <p className="text-sm">{getTimeAgo(verificationData.last_verified_at)}</p>
                                </div>

                                <a
                                    href={verificationData.repo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600"
                                >
                                    <Github size={16} />
                                    <span>View Source Code</span>
                                    <span className="font-mono text-xs">({shortenHash(verificationData.commit)})</span>
                                    <ArrowUpRight size={14} />
                                </a>
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-center">
                    <AlertDialogAction>Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
