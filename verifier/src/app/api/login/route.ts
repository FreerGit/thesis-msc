import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verify, verifyCredential } from "@digitalbazaar/vc"
import * as verKey from "@digitalbazaar/ed25519-verification-key-2018"
import * as edSign from "@digitalbazaar/ed25519-signature-2018";
import jsonld from "jsonld"

import { DidSolService, DidSolIdentifier, DidSolDocument } from "@identity.com/sol-did-client"

const prisma = new PrismaClient();

const customDocumentLoader = async (url: string) => {
    if (url.startsWith("did:sol:")) {
        const did = DidSolIdentifier.parse(url);
        const service = DidSolService.build(did)

        const doc = await service.resolve()

        doc["@context"] = [
            "https://w3id.org/did/v1",
            "https://www.w3id.org/security/suites/ed25519-2018/v1"
        ]


        return {
            contextUrl: null,
            documentUrl: url,
            document: doc
        };
    }
    return jsonld.documentLoaders.node()(url);
}

export async function POST(req: Request) {
    const { credential } = await req.json();

    if (!credential) {
        return NextResponse.json({ message: "Missing credential" }, { status: 400 });
    }

    const issuer = credential.issuer;
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

    const verificationKey = await verKey.Ed25519VerificationKey2018.from({
        id: "did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb#default",
        type: "Ed25519VerificationKey2018",
        controller: "did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb",
        publicKeyBase58: "7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb"
    });

    const suite = new edSign.Ed25519Signature2018({
        key: verificationKey
    });

    const result = await verifyCredential({ credential, suite, documentLoader: customDocumentLoader });

    if (!result.verified) {
        return NextResponse.json({ message: "Invalid credential" }, { status: 401 });
    }

    const user = await prisma.user.upsert({
        where: {
            did: credential.credentialSubject.id,
        },
        update: {},
        create: {
            did: credential.credentialSubject.id,
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