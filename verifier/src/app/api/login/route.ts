import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verify, verifyCredential } from "@digitalbazaar/vc"
import * as verKey from "@digitalbazaar/ed25519-verification-key-2020"
import * as edSign from "@digitalbazaar/ed25519-signature-2020";
import jsonld from "jsonld"

const prisma = new PrismaClient();

// const verifyCredential = async (credential: Record<string, object>) => {
//     if (credential) {
//         return { "id": "1", "did": "did:example:123" };
//     }
// }

const customDocumentLoader = async (url: string) => {
    if (url === "http://example.com/") {
        return {
            contextUrl: null,
            documentUrl: url,
            document: {
                "@context": [
                    "https://www.w3.org/ns/did/v1",
                    "https://w3id.org/security/suites/ed25519-2020/v1",
                ],
                "id": url,
                "assertionMethod": [
                    "did:example:issuer123#1"
                ],
            },
        }
    }

    return jsonld.documentLoaders.node()(url)
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

    const key = await verKey.Ed25519VerificationKey2020.from({
        id: credential.proof.verificationMethod,
        controller: credential.issuer,
        publicKeyMultibase: `z6MkrTp3mSzGM8qisEUqPhvjsVPhsCWvMSNq7J6cbsmgT6dM`
    });

    const suite = new edSign.Ed25519Signature2020({ key });

    const result = await verifyCredential({ credential, suite, documentLoader: customDocumentLoader })

    console.log("Result: ", JSON.stringify(result, null, 2));

    if (!result.verified) {
        return NextResponse.json({ message: "Invalid credential" }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            did: credential.credentialSubject.id,
        },
    });

    if (!existingUser) {
        await prisma.user.create({
            data: {
                did: credential.credentialSubject.id,
            },
        });
    }

    // const session = await prisma.session.create({
    //     data: {
    //         userId: vcData.id,
    //         expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    //     },
    // });

    // (await cookies()).set("sessionId", session.id, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "strict",
    //     path: "/",
    //     maxAge: 1800,
    // })

    return NextResponse.json({ message: "Successfully logged in" });
}