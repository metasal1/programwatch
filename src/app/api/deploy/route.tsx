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

        // Get monthly deployment statistics
        const monthlyStatsQuery = `
            SELECT 
                TO_CHAR(NULLIF(deployed, '')::timestamp, 'YYYY-MM') as month,
                COUNT(*) as count
            FROM programs
            WHERE deployed IS NOT NULL AND deployed != ''
            GROUP BY TO_CHAR(NULLIF(deployed, '')::timestamp, 'YYYY-MM')
        `;

        const monthlyStatsResult = await pool.query(monthlyStatsQuery);

        // Transform the results to ensure numbers are parsed as integers
        const monthlyStats = monthlyStatsResult.rows.map(row => ({
            month: row.month,
            count: parseInt(row.count)
        }));

        return NextResponse.json({
            success: true,
            monthlyStats: monthlyStats
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
