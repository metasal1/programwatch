import { Connection, PublicKey } from '@solana/web3.js';
import { NextResponse } from 'next/server';

const BPF_PROGRAM_ID = 'BPFLoaderUpgradeab1e11111111111111111111111';
const PROGRAM_DATA_SIZE = 36;

interface PerformanceMetrics {
    totalTime: number;
    rpcCallTime: number;
    dataTransformTime: number;
}

// Initialize Solana connection
const connection = new Connection(`https://api.mainnet-beta.solana.com`);

export async function GET() {
    const startTime = performance.now();
    const metrics: PerformanceMetrics = {
        totalTime: 0,
        rpcCallTime: 0,
        dataTransformTime: 0
    };

    try {
        // Fetch programs from Solana with timing
        const rpcStart = performance.now();
        const programs = await connection.getProgramAccounts(
            new PublicKey(BPF_PROGRAM_ID),
            {
                filters: [
                    {
                        dataSize: PROGRAM_DATA_SIZE,
                    },
                ],
            }
        );
        metrics.rpcCallTime = performance.now() - rpcStart;

        // Transform the data with timing
        const transformStart = performance.now();
        const programData = programs.map(program => ({
            pubkey: program.pubkey.toString(),
            account: {
                data: program.account.data,
                executable: program.account.executable,
                lamports: program.account.lamports,
                owner: program.account.owner.toString(),
            }
        }));
        metrics.dataTransformTime = performance.now() - transformStart;

        // Calculate total time
        metrics.totalTime = performance.now() - startTime;

        // Return the response with performance metrics
        return NextResponse.json({
            success: true,
            count: programs.length,
            programs: programData,
            performance: {
                ...metrics,
                programsPerSecond: (programs.length / (metrics.totalTime / 1000)).toFixed(2)
            }
        });

    } catch (error) {
        metrics.totalTime = performance.now() - startTime;
        console.error('Error fetching programs:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch programs',
                performance: metrics
            },
            { status: 500 }
        );
    }
}
