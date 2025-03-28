import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

import * as vcIssuer from "@digitalbazaar/vc"
import * as verKey from "@digitalbazaar/ed25519-verification-key-2020"
import * as sig from "@digitalbazaar/ed25519-signature-2020"
import jsonld from "jsonld"
import credential from "../data/credential.json"
import credentialExample from "../data/credentialExample.json"
import issuerExample from "../data/issuerExample.json"
import securitySuites from "../data/securitySuites.json"
import jsonLd from "../data/jsonLd.json"

// Function to generate a UUID (v4)
const generateNonce = () => crypto.randomUUID();


function App() {
  const nonce = generateNonce();


  const vc = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential'],
    issuer: 'did:example:issuer123',
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: 'did:example:john_doe',
      name: 'John Doe',
      email: 'john.doe@example.com'
    }
  };

  useEffect(() => {
    const customContexts: Record<string, object> = {
      "https://www.w3.org/2018/credentials/v1": credential,
      "https://www.w3.org/2018/credentials/examples/v1": credentialExample,
      "http://example.com/": issuerExample,
      "https://w3id.org/security/suites/ed25519-2020/v1": securitySuites,
      "https://www.w3.org/ns/odrl.jsonld": jsonLd
    };
    const customDocumentLoader = async (url: string) => {
      if (customContexts[url]) {
        return {
          contextUrl: null,
          document: customContexts[url],
          documentUrl: url,
        };
      }

      return jsonld.documentLoaders.node()(url);
    }
    const generateKeyPair = async () => {
      const keyPair = await verKey.Ed25519VerificationKey2020.generate();
      keyPair.id = "did:example:issuer123#1";
      keyPair.controller = "did:example:issuer123";
      const suite = new sig.Ed25519Signature2020({ key: keyPair });
      const credential = {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.w3.org/2018/credentials/examples/v1"
        ],
        "type": ["VerifiableCredential", "AlumniCredential"],
        "issuer": "http://example.com/",
        "issuanceDate": "2010-01-01T19:23:24Z",
        "credentialSubject": {
          "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
          "alumniOf": "Example University"
        }
      };

      const signedVC = await vcIssuer.issue({ credential, suite, documentLoader: customDocumentLoader });
      console.log("Credential", JSON.stringify(signedVC, null, 2));
    }
    generateKeyPair();
  }, [])



  useEffect(() => {
    const socket = new WebSocket("ws://52.158.36.185:8000");
    socket.onopen = () => {
      console.log("WebSocket connected, sending nonce...");
      socket.send(JSON.stringify({ nonce }));
    };

    socket.onmessage = (event) => {

      // const keyPair = await Ed25519KeyPair.generate();

      // // Sign the VC using the key pair
      // const signedVC = await createVerifiableCredential({
      //   credential: vc,
      //   suite: keyPair, // Sign the VC with the key pair
      //   documentLoader: () => {
      //     // Provide a document loader for resolving contexts (e.g., for JSON-LD)
      //     return { contextUrl: null, document: vc };
      //   }
      // });

      // console.log(signedVC);
    };


    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, [nonce]);


  return (
    <div style={containerStyle}>
      <div style={qrContainerStyle}>
        <h1 style={{ color: "black" }}>Scan this QR Code</h1>
        <QRCodeSVG value={nonce} size={250} level="H" fgColor="#000000" bgColor="#ffffff" />
        <p>Nonce: {nonce}</p>
      </div>
    </div>
  );
}

const containerStyle = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f4f4f4",
};

const qrContainerStyle = {
  textAlign: "center" as const,
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
};

export default App;
