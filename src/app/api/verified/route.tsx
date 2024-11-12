import { NextResponse } from "next/server";
import { performance } from "perf_hooks";

export async function GET() {
    const startTime = performance.now();

    try {
        const verified = await fetch(`https://verify.osec.io/verified-programs`);

        // Check if the fetch was successful
        if (!verified.ok) {
            throw new Error(`HTTP error! status: ${verified.status}`);
        }

        const verifiedData = await verified.json();

        // Calculate performance metrics
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        return NextResponse.json({
            count: verifiedData.verified_programs.length,
            programs: verifiedData.verified_programs,
            responseTime: `${responseTime.toFixed(2)}ms`,
        });

    } catch (error) {

        const endTime = performance.now();
        const responseTime = endTime - startTime;

        return NextResponse.json({
            error: error,
            message: 'Failed to fetch verified programs',
            metrics: {
                responseTime: `${responseTime.toFixed(2)}ms`,
            }
        }, {
            status: 500
        });
    }
}
