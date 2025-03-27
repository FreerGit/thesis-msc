import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

import { createVerifiableCredential } from "vc-js";
import * as ed from '@noble/ed25519';

// const documentLoader = securityLoader().build();

// Function to generate a UUID (v4)
const generateNonce = () => crypto.randomUUID();

async function App() {
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

  const privateKey = ed.utils.randomPrivateKey(); // Generate a random private key (32 bytes)
  const publicKey = await ed.getPublicKey(privateKey); // Get the corresponding public key
  const suite = {
    type: 'Ed25519Signature2018',
    sign: async (data: Buffer) => {
      return ed.sign(data, privateKey); // Sign the data (VC) with the private key
    },
    publicKey: publicKey // Include the public key
  };

  const signedVC = await createVerifiableCredential({
    credential: vc,
    suite, // Use the signature suite created above
    documentLoader: () => {
      return { contextUrl: null, document: vc };
    }
  });
  console.log("Signed VC:", signedVC);


  useEffect(() => {
    const socket = new WebSocket("ws://52.158.36.185:8000");
    socket.onopen = () => {
      console.log("WebSocket connected, sending nonce...");
      socket.send(JSON.stringify({ nonce }));
    };

    socket.onmessage = async (event) => {


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
        <h1>Scan this QR Code</h1>
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
