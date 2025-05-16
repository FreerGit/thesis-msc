// app/api/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sessions } from '@/data/sessions';

export function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session");

    if (sessionId) {
        const session = sessions.get(sessionId);

        if (session && session.status === "authenticated") {
            return NextResponse.json({ status: 200 });
        }

    }
    return NextResponse.json({ status: 401 });
}

