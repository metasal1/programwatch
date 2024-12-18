import { Connection, PublicKey } from '@solana/web3.js';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Constants
const UPGRADEABLE_LOADER = "BPFLoaderUpgradeab1e11111111111111111111111";
const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";

// Create a singleton connection
const connection = new Connection(RPC_ENDPOINT);

// Type definitions
interface ProgramInfo {
    programId: string;
    pda: string;
    authority: string | null;
    upgradeable: boolean;
    slot: number | null;
    unix: number | null;
    deployed: string | null;
    space: number;
    size: number;
    performance: {
        total: number;
        pdaComputation: number;
        accountFetch: number;
        blockTimeFetch?: number;
    };
}

export async function GET(request: NextRequest) {
    const startTime = performance.now();
    let pdaComputationTime = 0;
    let accountFetchTime = 0;
    let blockTimeFetchTime = 0;

    try {
        // Extract and validate program address
        const searchParams = request.nextUrl.searchParams;
        const programAddress = searchParams.get('address');

        if (!programAddress) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Program address is required',
                    performance: {
                        total: Math.round(performance.now() - startTime)
                    }
                },
                { status: 400 }
            );
        }

        // Validate program address format
        try {
            new PublicKey(programAddress);
        } catch (e) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid program address format' + e,
                    performance: {
                        total: Math.round(performance.now() - startTime)
                    }
                },
                { status: 400 }
            );
        }

        // Get program PDA
        const pdaStartTime = performance.now();
        const programId = new PublicKey(programAddress);
        const [pda] = PublicKey.findProgramAddressSync(
            [programId.toBytes()],
            new PublicKey(UPGRADEABLE_LOADER)
        );
        pdaComputationTime = performance.now() - pdaStartTime;

        // Fetch program data
        const accountFetchStartTime = performance.now();
        const pdaData = await connection.getParsedAccountInfo(
            new PublicKey(pda),
            { commitment: 'confirmed' }
        );
        accountFetchTime = performance.now() - accountFetchStartTime;

        if (!pdaData?.value) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Program data not found',
                    performance: {
                        total: Math.round(performance.now() - startTime),
                        pdaComputation: Math.round(pdaComputationTime),
                        accountFetch: Math.round(accountFetchTime)
                    }
                },
                { status: 404 }
            );
        }

        // Extract program info
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedData = pdaData.value.data as any;
        const authority = parsedData?.parsed?.info?.authority ?? null;
        const slot = parsedData?.parsed?.info?.slot ?? null;
        const space = parsedData?.space;
        const upgradeable = Boolean(authority);

        // Get deployment time
        let unix: number | null = null;
        let deployed: string | null = null;

        if (slot) {
            try {
                const blockTimeStartTime = performance.now();
                unix = await connection.getBlockTime(slot);
                blockTimeFetchTime = performance.now() - blockTimeStartTime;
                deployed = unix ? new Date(unix * 1000).toLocaleString() : null;
            } catch (error) {
                console.warn('Failed to fetch block time:', error);
            }
        }

        const totalTime = performance.now() - startTime;

        const programInfo: ProgramInfo = {
            programId: programAddress,
            pda: pda.toBase58(),
            authority,
            upgradeable,
            slot,
            unix,
            deployed,
            space,
            size: Math.round(space / 1024),
            performance: {
                total: Math.round(totalTime),
                pdaComputation: Math.round(pdaComputationTime),
                accountFetch: Math.round(accountFetchTime),
                ...(blockTimeFetchTime && { blockTimeFetch: Math.round(blockTimeFetchTime) })
            }
        };

        return NextResponse.json({
            success: true,
            data: programInfo
        });

    } catch (error) {
        const totalTime = performance.now() - startTime;
        console.error('Error fetching program info:', error);

        // Determine if it's a connection error
        const isConnectionError = (error instanceof Error) && (
            error.message.toLowerCase().includes('network') ||
            error.message.toLowerCase().includes('connection')
        );

        return NextResponse.json(
            {
                success: false,
                error: isConnectionError ? 'Failed to connect to Solana network' : 'Failed to fetch program info',
                details: error instanceof Error ? error.message : 'Unknown error',
                performance: {
                    total: Math.round(totalTime),
                    pdaComputation: Math.round(pdaComputationTime),
                    accountFetch: Math.round(accountFetchTime),
                    ...(blockTimeFetchTime && { blockTimeFetch: Math.round(blockTimeFetchTime) })
                }
            },
            { status: isConnectionError ? 503 : 500 }
        );
    }
}
