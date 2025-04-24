import { sessions } from "@/data/sessions";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    console.log('here')
    const body = await req.json();
    const vp = body.vp;
    const sessionId = body.challenge;

    if (!sessionId || !sessions.has(sessionId)) {
        return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }


    if (!vp || !vp.proof || vp.proof.challenge !== sessionId) {
        return NextResponse.json({ error: "Invalid VP or challenge mismatch" }, { status: 400 });
    }

    console.log("TODO: Verify VP")

    // Mark session as authenticated
    const session = sessions.get(sessionId)!;
    session.status = "authenticated";
    sessions.set(sessionId, session);

    return NextResponse.json({ ok: true });
}