"use client"

import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

export default function LoginPage() {
    const router = useRouter();


    /*
        This challenge will need to include the list of trusted issuers,
        the list of either credentials trusted or @context trusted.
        Additionally, it will need to include the list of fields inside the credentials
        that are required to be present for the verification to be successful.
    */
    const challenge = {
        "type": "VerifierChallenge",
        "challenge": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    }

    const handleLogin = async () => {
        const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
                credential: "eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRXhhbXBsZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6c29sOmRldm5ldDpFMTNyVVM4aXM4QlUySjdLWW5udGk0cnJtWjZoRkNLVzZKRjlGMzNRQ0toVCIsIm5hbWUiOiJFeGFtcGxlIFVzZXIiLCJkZWdyZWUiOnsidHlwZSI6IkJhY2hlbG9yRGVncmVlIiwibmFtZSI6IkJhY2hlbG9yIG9mIFNjaWVuY2UgaW4gQ29tcHV0ZXIgU2NpZW5jZSJ9fX0sInN1YiI6ImRpZDpzb2w6ZGV2bmV0OkUxM3JVUzhpczhCVTJKN0tZbm50aTRycm1aNmhGQ0tXNkpGOUYzM1FDS2hUIiwiaXNzIjoiZGlkOmV0aHI6c2Vwb2xpYToweDlDZjQ3MTBENkQ1M2Y4RTZCNTc5ZTlFRjc2NmVFOEUzOUUwM0U5NkYifQ.2YX-od7vlzsp8LN6FhXGK4u5SCnKCIPHT-DDCb_do8YGwMu4G0qG7lks7MLV7JRvd1DP5KWw_m_Ulj-to8tVHwE"
            })
        });
        if (response.ok) {
            router.push("/");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <NavBar />
            <h1 className="text-5xl font-bold">Sign in with a verifiable credential</h1>
            <QRCodeSVG
                value={JSON.stringify(challenge)}
                size={512}
            ></QRCodeSVG>
            <button
                className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
                onClick={() => handleLogin()}
            >
                Login
            </button>
        </div>
    )
}
