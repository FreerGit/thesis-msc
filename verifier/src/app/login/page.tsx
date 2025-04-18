"use client"

import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { randomBytes } from "crypto";

interface TrustedIssuer {
    id: string;
    did: string;
    name: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [presentationRequest, setPresentationRequest] = useState({});

    useEffect(() => {
        async function fetchTrustedIssuers() {
            const response = await fetch("/api/trustedIssuers");
            if (!response.ok) {
                throw new Error("Failed to fetch trusted issuers");
            }
            const data: TrustedIssuer[] = await response.json();
            return data;
        }

        const createPresentationRequest = async () => {
            const issuers = await fetchTrustedIssuers();

            const trustedIssuerPattern = issuers.map((issuer) => {
                return `^${issuer.did}$`;
            }).join("|");

            const generateRandomChallenge = () => {
                return `0x${randomBytes(32).toString("hex")}`;
            };

            const randomChallenge = generateRandomChallenge();
            const presentationRequest = {
                "type": "VerifierChallenge",
                "challenge": randomChallenge,
                "presentation_definition:": {
                    "id": "example_presentation_definition",
                    "input_descriptors": [
                        {
                            "id": "example_input_descriptor",
                            "name": "Example Input Descriptor",
                            "purpose": "This is an example input descriptor.",
                            "constraints": {
                                "fields": [
                                    {
                                        "path": ["$.iss", "$.vc.issuer", "$.issuer"],
                                        "filter": {
                                            "type": "string",
                                            "pattern": trustedIssuerPattern
                                        }
                                    },
                                    {
                                        "path": ["$.credentialSubject.degree.type"],
                                        "filter": {
                                            "type": "string",
                                            "pattern": "^Bachelor$"
                                        }
                                    },
                                    {
                                        "path": ["$.credentialSubject.degree.name"],
                                        "filter": {
                                            "type": "string",
                                            "pattern": "^Bachelor of Science$"
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            };
            setPresentationRequest(presentationRequest);
        }
        createPresentationRequest()
    }, [])


    /*
        This challenge will need to include the list of trusted issuers,
        the list of either credentials trusted or @context trusted.
        Additionally, it will need to include the list of fields inside the credentials
        that are required to be present for the verification to be successful.
    */
    // const presentation_request = {
    //     "type": "VerifierChallenge",
    //     "challenge": challenge,
    //     "presentation_definition:": {
    //         "id": "example_presentation_definition",
    //         "input_descriptors": [
    //             {
    //                 "id": "example_input_descriptor",
    //                 "name": "Example Input Descriptor",
    //                 "purpose": "This is an example input descriptor.",
    //                 "constraints": {
    //                     "fields": [
    //                         {
    //                             "path": ["$.credentialSubject.name"],
    //                             "filter": {
    //                                 "type": "string",
    //                                 "pattern": "^John Doe$"
    //                             }
    //                         }
    //                     ]
    //                 }
    //             }
    //         ]
    //     }
    // }

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
            {Object.keys(presentationRequest).length > 0 ?
                (
                    <QRCodeSVG
                        value={JSON.stringify(presentationRequest)}
                        size={400}
                    ></QRCodeSVG>
                )
                : (
                    <p className="text-2xl">Generating QR code...</p>
                )
            }
            <button
                className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
                onClick={() => handleLogin()}
            >
                Login
            </button>
        </div>
    )
}
