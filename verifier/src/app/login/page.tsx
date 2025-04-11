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
                    '@context': [
                        'https://www.w3.org/2018/credentials/v1'
                    ],
                    type: ['VerifiableCredential'],
                    issuer: 'did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb',
                    issuanceDate: '2010-01-01T19:23:24Z',
                    credentialSubject: { id: 'did:sol:devnet:E13rUS8is8BU2J7KYnnti4rrmZ6hFCKW6JF9F33QCKhT' },
                    proof: {
                        type: 'Ed25519Signature2018',
                        created: '2025-04-08T09:13:56Z',
                        verificationMethod: 'did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb#default',
                        proofPurpose: 'assertionMethod',
                        jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..o-PFzjPfFKlt7nAz2S2HYRkfB4I2a1bJSsetTkuQ7gCTK4XpzyXANleLrLGo843CQoWd5pU4NLVASrv67NdhCw'
                    }
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
