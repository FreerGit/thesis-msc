
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const trustedIssuers = await prisma.trustedIssuer.findMany();

    if (trustedIssuers.length === 0) {
        return NextResponse.json({ message: "No trusted issuers found" }, { status: 404 });
    }

    return NextResponse.json(trustedIssuers.map((issuer) => ({
        id: issuer.id,
        did: issuer.did,
        name: issuer.name,
    })));
}