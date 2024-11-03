'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, ShieldCheck, ShieldX } from 'lucide-react'

interface SecurityVerification {
    message: string
    onChainHash: string
    executableHash: string
    lastVerifiedAt: string
    repoUrl: string
    commit: string
}

interface SecurityResponse {
    programId: string
    verified: boolean
    verification?: SecurityVerification
    performance: {
        totalTime: number
        verificationApiFetch: number
    }
}

export default function SecurityModal({ programAddress }: { programAddress: string }) {
    const [securityInfo, setSecurityInfo] = useState<SecurityResponse | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchSecurityInfo = async () => {
        if (loading || securityInfo) return

        setLoading(true)
        try {
            const response = await fetch(`/api/security?programId=${programAddress}`)
            const data = await response.json()
            setSecurityInfo(data)
        } catch (error) {
            console.error('Error fetching security info:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger onClick={fetchSecurityInfo}>
                {loading ? (
                    <Shield className="h-4 w-4 animate-pulse" />
                ) : securityInfo ? (
                    securityInfo.verified ? (
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                    ) : (
                        <ShieldX className="h-4 w-4 text-red-500" />
                    )
                ) : (
                    <Shield className="h-4 w-4" />
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Security Verification</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="flex justify-center py-4">Loading...</div>
                ) : securityInfo ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Status:</span>
                            {securityInfo.verified ? (
                                <span className="text-green-500 flex items-center gap-1">
                                    <ShieldCheck className="h-4 w-4" />
                                    Verified
                                </span>
                            ) : (
                                <span className="text-red-500 flex items-center gap-1">
                                    <ShieldX className="h-4 w-4" />
                                    Not Verified
                                </span>
                            )}
                        </div>

                        {securityInfo.verification && (
                            <>
                                <div>
                                    <span className="font-bold">Message:</span>
                                    <p>{securityInfo.verification.message}</p>
                                </div>
                                <div>
                                    <span className="font-bold">On-Chain Hash:</span>
                                    <p className="font-mono text-sm">{securityInfo.verification.onChainHash}</p>
                                </div>
                                <div>
                                    <span className="font-bold">Executable Hash:</span>
                                    <p className="font-mono text-sm">{securityInfo.verification.executableHash}</p>
                                </div>
                                <div>
                                    <span className="font-bold">Last Verified:</span>
                                    <p>{new Date(securityInfo.verification.lastVerifiedAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <span className="font-bold">Repository:</span>
                                    <a
                                        href={securityInfo.verification.repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline ml-2"
                                    >
                                        View Source
                                    </a>
                                </div>
                                <div>
                                    <span className="font-bold">Commit:</span>
                                    <p className="font-mono text-sm">{securityInfo.verification.commit}</p>
                                </div>
                            </>
                        )}

                        <div className="text-sm text-gray-500 mt-4">
                            Verification completed in {(securityInfo.performance.totalTime / 1000).toFixed(2)}s
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-red-500">Failed to load security information</div>
                )}
            </DialogContent>
        </Dialog>
    )
} 
