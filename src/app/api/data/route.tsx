import { Connection, PublicKey } from '@solana/web3.js';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

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
        const programId = new PublicKey(programAddress);
        const UPGRADEABLE_LOADER = "BPFLoaderUpgradeab1e11111111111111111111111";
        const [pda] = PublicKey.findProgramAddressSync([programId.toBytes()], new PublicKey(UPGRADEABLE_LOADER));

        const pdaData = await connection.getParsedAccountInfo(new PublicKey(pda), { dataSlice: { offset: 0, length: 0 } });


        const authority = pdaData?.value?.data.parsed?.info.authority;
        const slot = pdaData?.value?.data.parsed?.info.slot;
        const space = pdaData.value.space
        const upgradeable = authority ? true : false
        const unix = await connection.getBlockTime(slot);
        const deployed = new Date(unix * 1000).toLocaleString();
        const size = Math.round(space / 1024)

        const idl = { link: null, instructions: null, accounts: null, errors: null }

        return NextResponse.json({
            programId: programAddress,
            pda: pda.toBase58(),
            authority,
            upgradeable,
            slot,
            unix,
            deployed,
            space,
            size
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
