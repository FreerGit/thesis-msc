import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { decodeJWT } from "did-jwt"
import { getResolver } from "ethr-did-resolver"
import { Resolver } from "did-resolver"
// import { ethers } from 'ethers'
import { verifyCredential } from "did-jwt-vc"

const prisma = new PrismaClient();
const RPC_URL = `https://rpc.ankr.com/eth_sepolia/${process.env.ANKR_API_KEY}`
const registry = "0x03d5003bf0e79C5F5223588F347ebA39AfbC3818"
// const provider = new ethers.JsonRpcProvider(RPC_URL)

export async function POST(req: Request) {
    const { credential } = await req.json();

    if (!credential) {
        return NextResponse.json({ message: "Missing credential" }, { status: 400 });
    }

    const decoded = decodeJWT(credential);

    if (!decoded) {
        return NextResponse.json({ message: "Invalid credential" }, { status: 400 });
    }

    const issuer = decoded.payload.iss;
    if (!issuer) {
        return NextResponse.json({ message: "Missing issuer" }, { status: 400 });
    }

    const issuerData = await prisma.trustedIssuer.findMany({
        where: {
            did: {
                equals: issuer,
            },
        },
    });

    if (issuerData.length === 0) {
        return NextResponse.json({ message: "Issuer not trusted" }, { status: 401 });
    }

    const resolver = new Resolver(getResolver({
        name: "sepolia",
        rpcUrl: RPC_URL,
        registry: registry,
        chainId: process.env.CHAIN_ID
    }));

    const verification = await verifyCredential(credential, resolver)

    if (!verification.verified) {
        return NextResponse.json({ message: "Invalid credential" }, { status: 401 });
    }

    const userDid = decoded.payload.vc.credentialSubject.id;

    const user = await prisma.user.upsert({
        where: {
            did: userDid,
        },
        update: {},
        create: {
            did: userDid,
        }
    });

    const session = await prisma.session.create({
        data: {
            userId: user.id,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
    });

    (await cookies()).set("sessionId", session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 1800,
    })

    return NextResponse.json({ message: "Successfully logged in" });
}