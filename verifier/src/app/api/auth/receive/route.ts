import { NextRequest, NextResponse } from "next/server";
import { sessions } from "@/app/api/auth/status/route";


export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session");

    if (!sessionId || !sessions.has(sessionId)) {
        return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const body = await req.json();
    const vp = body.vp;

    if (!vp || !vp.proof || vp.proof.challenge !== sessionId) {
        return NextResponse.json({ error: "Invalid VP or challenge mismatch" }, { status: 400 });
    }

    // Optional: verify DID signature here (use DIDKit or your own verifier)

    // Mark session as authenticated
    const session = sessions.get(sessionId)!;
    session.status = "authenticated";
    sessions.set(sessionId, session);

    return NextResponse.json({ ok: true });
}