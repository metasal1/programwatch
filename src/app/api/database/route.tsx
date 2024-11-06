import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { Pool } from 'pg';

// Create a new pool using the connection string from environment variables
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export async function GET(request: NextRequest) {
    try {
        // First, test the database connection
        await pool.query('SELECT NOW()');

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '15');
        const searchQuery = searchParams.get('query') || '';
        const offset = (page - 1) * limit;

        // Log the query parameters for debugging
        console.log('Query params:', { page, limit, searchQuery, offset });

        let countQuery = 'SELECT COUNT(*) FROM programs';
        let countParams: string[] = [];

        if (searchQuery) {
            countQuery += ' WHERE LOWER(program_name) LIKE LOWER($1) OR LOWER(program_address) LIKE LOWER($1)';
            countParams = [`%${searchQuery}%`];
        }

        // Log the count query for debugging
        console.log('Count query:', countQuery, countParams);

        const countResult = await pool.query(countQuery, countParams);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        let dataQuery = `
            SELECT 
                program_name,
                version,
                program_address,
                program_derived_address,
                instructions_referenced,
                accounts_used,
                error_messages,
                mutable,
                idl,
                idl_address,
                deployed,
                verified
            FROM programs
        `;

        let dataParams: (string | number)[] = [];

        if (searchQuery) {
            dataQuery += ' WHERE LOWER(program_name) LIKE LOWER($3) OR LOWER(program_address) LIKE LOWER($3)';
            dataParams = [limit, offset, `%${searchQuery}%`];
        } else {
            dataParams = [limit, offset];
        }

        dataQuery += ' ORDER BY program_name LIMIT $1 OFFSET $2';

        // Log the data query for debugging
        console.log('Data query:', dataQuery, dataParams);

        const { rows } = await pool.query(dataQuery, dataParams);

        // Log the result size for debugging
        console.log('Rows returned:', rows.length);

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
        // Enhanced error logging
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
