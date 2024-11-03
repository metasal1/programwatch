import { Connection, PublicKey } from '@solana/web3.js';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

const UPGRADEABLE_LOADER = 'BPFLoaderUpgradeab1e11111111111111111111111';

const connection = new Connection(`https://api.mainnet-beta.solana.com`);

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const programAddress = searchParams.get('address');

        if (!programAddress) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Program address is required'
                },
                { status: 400 }
            );
        }

        const programPublicKey = new PublicKey(programAddress);

        // Get program account
        const programAccount = await connection.getAccountInfo(programPublicKey);

        if (!programAccount) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Program not found'
                },
                { status: 404 }
            );
        }

        // Check if program is owned by upgradeable loader
        const isUpgradeable = programAccount.owner.toBase58() === UPGRADEABLE_LOADER;

        if (!isUpgradeable) {
            return NextResponse.json({
                programId: programAddress,
                owner: programAccount.owner.toBase58(),
                programdataAddress: null,
                authority: null,
                lastDeploySlot: null,
                dataLen: programAccount.data.length,
                lamports: programAccount.lamports
            });
        }

        // Get PDA for program data account
        const [programDataAddress] = PublicKey.findProgramAddressSync(
            [programPublicKey.toBytes()],
            new PublicKey(UPGRADEABLE_LOADER)
        );

        const programDataAccount = await connection.getAccountInfo(programDataAddress);

        if (!programDataAccount) {
            return NextResponse.json({
                success: false,
                error: 'Program data account not found'
            }, { status: 404 });
        }

        const accountData = Buffer.from(programDataAccount.data);

        // Get slot from bytes 1-9 using readBigUint64LE for 64-bit number
        const slot = Number(accountData.readBigUInt64LE(1));

        // Get upgrade authority from bytes 13-45
        const upgradeAuthorityBytes = accountData.subarray(13, 45);
        const upgradeAuthority = new PublicKey(upgradeAuthorityBytes);

        return NextResponse.json({
            programId: programAddress,
            owner: programAccount.owner.toBase58(),
            programdataAddress: programDataAddress.toBase58(),
            authority: upgradeAuthority.toBase58(),
            lastDeploySlot: slot,
            dataLen: programDataAccount.data.length,
            lamports: programDataAccount.lamports
        });

    } catch (error) {
        console.error('Error fetching program info:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch program info',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
