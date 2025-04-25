import { sessions } from "@/data/sessions";
import { NextRequest, NextResponse } from "next/server";
import { verifyPresentation } from 'did-jwt-vc'
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";
import { assert } from "console";
import * as dotenv from "dotenv";

const env = dotenv.config().parsed!;

const RPC_URL = `https://rpc.ankr.com/eth_sepolia/${env.ANKR_API_KEY}`
const registry = "0x03d5003bf0e79C5F5223588F347ebA39AfbC3818" // the smart contract addr for registry
// const issuer = "did:ethr:sepolia:0x9Cf4710D6D53f8E6B579e9EF766eE8E39E03E96F";

const didResolver = new Resolver(getResolver({ rpcUrl: RPC_URL, name: "sepolia", chainId: 11155111, registry }));

export async function POST(req: NextRequest) {
    console.log('here')

    const body = await req.json();
    const vp = body.vp;
    const sessionId = body.challenge

    if (!sessionId || !sessions.has(sessionId)) {
        return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    if (!vp) {
        return NextResponse.json({ error: "Invalid VP or challenge mismatch" }, { status: 400 });
    }

    try {
        const verifiedVP = await verifyPresentation(vp, didResolver, {
            challenge: sessionId
        })

        assert(verifiedVP.verified)

        // Mark session as authenticated
        const session = sessions.get(sessionId)!;
        session.status = "authenticated";
        sessions.set(sessionId, session);

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Invalid VP or challenge mismatch" }, { status: 400 });
    }
}