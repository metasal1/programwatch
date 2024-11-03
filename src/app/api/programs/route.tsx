import { Connection, PublicKey } from '@solana/web3.js';
import { NextResponse } from 'next/server';

const BPF_PROGRAM_ID = 'BPFLoaderUpgradeab1e11111111111111111111111';
const PROGRAM_DATA_SIZE = 36;

// Initialize Solana connection
const connection = new Connection(`https://api.mainnet-beta.solana.com`);

export async function GET() {
    try {
        // Fetch programs from Solana
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

        // Transform the data to include only necessary information
        const programData = programs.map(program => ({
            pubkey: program.pubkey.toString(),
            account: {
                data: program.account.data,
                executable: program.account.executable,
                lamports: program.account.lamports,
                owner: program.account.owner.toString(),
            }
        }));

        // Return the response
        return NextResponse.json({
            success: true,
            count: programs.length,
            programs: programData
        });

    } catch (error) {
        console.error('Error fetching programs:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch programs'
            },
            { status: 500 }
        );
    }
}
