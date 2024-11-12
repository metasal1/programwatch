import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const programAddress = searchParams.get('address');

    if (!programAddress) {
        return NextResponse.json({
            success: false,
            error: 'Program address is required'
        }, { status: 400 });
    }

    const verified = await fetch(`https://verify.osec.io/status/${programAddress}`)
    const verifiedData = await verified.json();
    return NextResponse.json(verifiedData);
}
