import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

interface PerformanceMetrics {
    totalTime: number;
    programAccountFetch?: number;
    verificationApiFetch?: number;
}

interface VerificationResponse {
    is_verified: boolean;
    message: string;
    on_chain_hash: string;
    executable_hash: string;
    last_verified_at: string | null;
    repo_url: string;
    commit: string;
}

export async function GET(request: NextRequest) {
    const startTime = performance.now();
    const metrics: PerformanceMetrics = {
        totalTime: 0
    };

    try {
        const searchParams = request.nextUrl.searchParams;
        const programAddress = searchParams.get('address');

        if (!programAddress) {
            metrics.totalTime = performance.now() - startTime;
            return NextResponse.json(
                {
                    success: false,
                    error: 'Program address is required',
                    performance: metrics
                },
                { status: 400 }
            );
        }

        // Fetch verification status from osec API
        const verificationStart = performance.now();
        const verificationResponse = await fetch(`https://verify.osec.io/status/${programAddress}`);
        metrics.verificationApiFetch = performance.now() - verificationStart;

        const verificationData: VerificationResponse = await verificationResponse.json();

        metrics.totalTime = performance.now() - startTime;

        return NextResponse.json({
            programId: programAddress,
            verified: verificationData.is_verified,
            verification: verificationData.is_verified ? {
                message: verificationData.message,
                onChainHash: verificationData.on_chain_hash,
                executableHash: verificationData.executable_hash,
                lastVerifiedAt: verificationData.last_verified_at,
                repoUrl: verificationData.repo_url,
                commit: verificationData.commit
            } : {
                message: verificationData.message
            },
            performance: metrics
        });

    } catch (error) {
        metrics.totalTime = performance.now() - startTime;
        console.error('Error fetching program info:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch program info',
                details: error instanceof Error ? error.message : 'Unknown error',
                performance: metrics
            },
            { status: 500 }
        );
    }
}
