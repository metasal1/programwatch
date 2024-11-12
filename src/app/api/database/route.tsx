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
        const limit = parseInt(searchParams.get('limit') || '10');
        const searchQuery = searchParams.get('query') || '';
        const executable = searchParams.get('executable');
        const verified = searchParams.get('verified');
        const idl = searchParams.get('idl');
        const mutable = searchParams.get('mutable');
        const frozen = searchParams.get('frozen');
        const offset = (page - 1) * limit;

        // Log the query parameters for debugging
        console.log('Query params:', {
            page,
            limit,
            searchQuery,
            offset,
            executable,
            verified,
            idl,
            mutable,
            frozen
        });

        const conditions: string[] = [];
        const params: (string | number | boolean)[] = [];
        let paramCounter = 1;

        if (searchQuery) {
            conditions.push(`(LOWER(program_name) LIKE LOWER($${paramCounter}) OR LOWER(program_address) LIKE LOWER($${paramCounter}))`);
            params.push(`%${searchQuery}%`);
            paramCounter++;
        }

        if (executable !== null) {
            conditions.push(`executable = $${paramCounter}`);
            params.push(executable === 'true');
            paramCounter++;
        }

        if (verified !== null) {
            conditions.push(`verified = $${paramCounter}`);
            params.push(verified === 'true');
            paramCounter++;
        }

        if (idl !== null) {
            conditions.push(`idl = $${paramCounter}`);
            params.push(idl === 'true');
            paramCounter++;
        }

        if (mutable !== null) {
            conditions.push(`mutable = $${paramCounter}`);
            params.push(mutable === 'true');
            paramCounter++;
        }

        if (frozen !== null) {
            conditions.push(`(update_authority_address IS NULL OR TRIM(update_authority_address) = '')`);
        }

        // Build the WHERE clause
        const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

        // Count query
        const countQuery = `SELECT COUNT(*) FROM programs ${whereClause}`;
        console.log('Count query:', countQuery, params);

        const countResult = await pool.query(countQuery, params);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        // Data query
        let dataQuery = `SELECT * FROM programs ${whereClause}`;

        // Add ORDER BY clause
        dataQuery += `
            ORDER BY 
                CASE 
                    WHEN TRIM(program_name) = '' OR program_name IS NULL THEN 2
                    ELSE 1 
                END,
                program_name ASC
            LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;

        // Add limit and offset to params
        params.push(limit, offset);

        console.log('Data query:', dataQuery, params);

        const { rows } = await pool.query(dataQuery, params);
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
