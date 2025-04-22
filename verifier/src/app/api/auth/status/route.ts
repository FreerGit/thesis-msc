// app/api/status/route.ts
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory session store (probably redis/db in prod)
const sessions = new Map<string, { status: 'pending' | 'authenticated'; createdAt: number }>();

export function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session");
    console.log(sessionId)
    // The case where the frontend is polling
    if (sessionId) {
        const session = sessions.get(sessionId);

        if (!session) {
            return NextResponse.json({ status: "pending" })
        }

        if (session.status === "authenticated") {
            const res = NextResponse.json({ status: "authenticated" });

            res.cookies.set("sessionToken", sessionId, {
                httpOnly: true,
                path: "/",
                sameSite: "strict",
                secure: false, // NOTE: this should be true in prod!
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            return res;
        }

        return NextResponse.json({ status: "pending" })
    }

    // Else create new session
    const newSessionId = uuidv4();

    sessions.set(newSessionId, {
        status: 'pending',
        createdAt: Date.now(),
    });

    return NextResponse.json({ sessionId: newSessionId });
}

export { sessions };
