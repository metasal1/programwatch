import { Connection, PublicKey } from '@solana/web3.js';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

const UPGRADEABLE_LOADER = 'BPFLoaderUpgradeab1e11111111111111111111111';

const connection = new Connection(`https://api.mainnet-beta.solana.com`);

interface PerformanceMetrics {
    totalTime: number;
    programAccountFetch?: number;
    programDataAccountFetch?: number;
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

        const programPublicKey = new PublicKey(programAddress);

        // Get program account with timing
        const programAccountStart = performance.now();
        const programAccount = await connection.getAccountInfo(programPublicKey);
        metrics.programAccountFetch = performance.now() - programAccountStart;

        if (!programAccount) {
            metrics.totalTime = performance.now() - startTime;
            return NextResponse.json(
                {
                    success: false,
                    error: 'Program not found',
                    performance: metrics
                },
                { status: 404 }
            );
        }

        // Check if program is owned by upgradeable loader
        const isUpgradeable = programAccount.owner.toBase58() === UPGRADEABLE_LOADER;

        if (!isUpgradeable) {
            metrics.totalTime = performance.now() - startTime;
            return NextResponse.json({
                programId: programAddress,
                owner: programAccount.owner.toBase58(),
                programdataAddress: null,
                authority: null,
                lastDeploySlot: null,
                dataLen: programAccount.data.length,
                lamports: programAccount.lamports,
                performance: metrics
            });
        }

        // Get PDA for program data account
        const [programDataAddress] = PublicKey.findProgramAddressSync(
            [programPublicKey.toBytes()],
            new PublicKey(UPGRADEABLE_LOADER)
        );

        // Get program data account with timing
        const programDataAccountStart = performance.now();
        const programDataAccount = await connection.getAccountInfo(programDataAddress);
        metrics.programDataAccountFetch = performance.now() - programDataAccountStart;

        if (!programDataAccount) {
            metrics.totalTime = performance.now() - startTime;
            return NextResponse.json({
                success: false,
                error: 'Program data account not found',
                performance: metrics
            }, { status: 404 });
        }

        const accountData = Buffer.from(programDataAccount.data);

        // Get slot from bytes 9-13
        const slot = accountData.readUInt32LE(9);

        // Get upgrade authority from bytes 13-45
        const upgradeAuthorityBytes = accountData.subarray(13, 45);
        const upgradeAuthority = new PublicKey(upgradeAuthorityBytes);

        metrics.totalTime = performance.now() - startTime;

        return NextResponse.json({
            programId: programAddress,
            owner: programAccount.owner.toBase58(),
            programdataAddress: programDataAddress.toBase58(),
            authority: upgradeAuthority.toBase58(),
            lastDeploySlot: slot,
            dataLen: programDataAccount.data.length,
            lamports: programDataAccount.lamports,
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
