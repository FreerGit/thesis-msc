"use client"

import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = async () => {
        const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
                credential: {
                    "@context": ["https://www.w3.org/2018/credentials/v1",
                        "https://www.w3.org/2018/credentials/examples/v1",
                        "https://w3id.org/security/suites/ed25519-2020/v1"
                    ],
                    "credentialSubject": {
                        "alumniOf": "Example University",
                        "id": "did:sol:devnet:EjReiZwCkicEGBuBQsf3qaK7DSX8hio5whzhTeExYYKw"
                    },
                    "issuanceDate": "2010-01-01T19:23:24Z",
                    "issuer": "http://example.com/",
                    "proof": {
                        "created": "2025-04-03T09:01:09Z",
                        "proofPurpose": "assertionMethod",
                        "proofValue": "z4NZgWc7p9K6MLqN8FGCWEsmFkWNFvZNUJxsLaoLj1Sipw69A5XQddUdtarMmboGPj5vs2JyDpJrWY1xE6dNmJL2L",
                        "type": "Ed25519Signature2020",
                        "verificationMethod": "did:example:issuer123#1"
                    },
                    "type": [
                        "VerifiableCredential",
                        "AlumniCredential"
                    ]
                }
            })
        });
        if (response.ok) {
            router.push("/");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <NavBar />
            <h1 className="font-semibold text-3xl">Verifier</h1>
            <button
                className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
                onClick={() => handleLogin()}
            >
                Login
            </button>
        </div>
    )
}
