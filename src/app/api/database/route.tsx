import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { Pool } from 'pg';

// Create a new pool using the connection string from environment variables
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false // Required for some hosting providers
    }
});

export async function GET(request: NextRequest) {
    try {
        // Get pagination parameters from URL
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = (page - 1) * limit;

        // Get total count for pagination
        const countResult = await pool.query(
            'SELECT COUNT(*) FROM programs'
        );
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        // Fetch paginated programs from the database
        const { rows } = await pool.query(
            `SELECT 
                program,
                version,
                address,
                instructions_referenced,
                accounts_used,
                error_messages,
                mutable,
                idl,
                deployed,
                verified
            FROM programs
            ORDER BY program
            LIMIT $1
            OFFSET $2`,
            [limit, offset]
        );

        return NextResponse.json({
            success: true,
            data: rows,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch data from database'
            },
            { status: 500 }
        );
    }
}
