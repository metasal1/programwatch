import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a new pool using the connection string from environment variables
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export async function GET() {
    try {
        // First, test the database connection
        await pool.query('SELECT NOW()');

        // Get overall statistical counts
        const statsQuery = `
            SELECT 
                COUNT(*) as total_count,
                COUNT(CASE WHEN executable = true THEN 1 END) as executable_count,
                COUNT(CASE WHEN verified = true THEN 1 END) as verified_count,
                COUNT(CASE WHEN mutable = true THEN 1 END) as mutable_count,
                COUNT(CASE WHEN mutable = false THEN 1 END) as non_mutable_count,
                COUNT(CASE WHEN idl = true THEN 1 END) as has_idl_count
            FROM programs
        `;

        // Get counts by owner
        const ownerStatsQuery = `
            SELECT 
                owner,
                COUNT(*) as program_count,
                COUNT(CASE WHEN executable = true THEN 1 END) as executable_count,
                COUNT(CASE WHEN verified = true THEN 1 END) as verified_count,
                COUNT(CASE WHEN mutable = true THEN 1 END) as mutable_count,
                COUNT(CASE WHEN mutable = false THEN 1 END) as non_mutable_count,
                COUNT(CASE WHEN idl = true THEN 1 END) as has_idl_count
            FROM programs
            GROUP BY owner
            ORDER BY program_count DESC
        `;

        const [statsResult, ownerStatsResult] = await Promise.all([
            pool.query(statsQuery),
            pool.query(ownerStatsQuery)
        ]);

        const stats = statsResult.rows[0];
        const ownerStats = ownerStatsResult.rows;

        return NextResponse.json({
            success: true,
            stats: {
                totalCount: parseInt(stats.total_count),
                executableCount: parseInt(stats.executable_count),
                verifiedCount: parseInt(stats.verified_count),
                mutableCount: parseInt(stats.mutable_count),
                nonMutableCount: parseInt(stats.non_mutable_count),
                hasIdlCount: parseInt(stats.has_idl_count)
            },
            ownerStats: ownerStats.map(row => ({
                owner: row.owner,
                programCount: parseInt(row.program_count),
                executableCount: parseInt(row.executable_count),
                verifiedCount: parseInt(row.verified_count),
                mutableCount: parseInt(row.mutable_count),
                nonMutableCount: parseInt(row.non_mutable_count),
                hasIdlCount: parseInt(row.has_idl_count)
            }))
        });

    } catch (error) {
        console.error('Database error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error
        });

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch data from database',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
