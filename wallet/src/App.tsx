import { useState } from 'react';
import './App.css';
import { utils, getPublicKeyAsync, Bytes } from '@noble/ed25519';
// import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import * as DIDKit from "@spruceid/didkit-wasm";
import { decode, encode } from "universal-base64url";

const generateKeys = async () => {
  const privKey = utils.randomPrivateKey();
  const pubKey = await getPublicKeyAsync(privKey);
  return { privKey, pubKey };
};

const generateDIDKey = (prefix: string) => {
  return `did:web:localhost%3A8000:${prefix}`;
};

const generateDIDJWK = (pubKey: Bytes) => ({
  kty: "OKP",
  crv: "Ed25519",
  x: encode(pubKey.toString()),
});

const generateDIDDocument = async (prefix: string, pubKey: Bytes) => {
  const jwk = generateDIDJWK(pubKey);
  const did = generateDIDKey(prefix);

  return {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/jws-2020/v1",
    ],
    id: did,
    verificationMethod: [
      {
        id: `${did}#key1`,
        type: "JsonWebKey2020",
        controller: did,
        publicKeyJwk: jwk,
      },
    ],
    authentication: [`${did}#key1`],
    assertionMethod: [`${did}#key1`],
  };
};

// const generateVerifiableCredential = async (prefix: string, pubKey: Bytes) => {
//   const jwk = generateDIDJWK(pubKey);
//   const did = generateDIDKey(prefix);

//   return {
//     "@context": ["https://www.w3.org/2018/credentials/v1"],
//     id: `uuid:${uuidv4()}`,
//     type: ["VerifiableCredential"],
//     credentialSubject: {
//       id: did,
//       assertionMethod: [`${did}#key1`],
//       authentication: [`${did}#key1`],
//     },
//     issuer: did,
//     issuanceDate: new Date().toISOString(),
//     proof: {
//       verificationMethod: `${did}#key1`,
//       type: "Ed25519Signature2018",
//     },
//   };
// };

// const signVerifiableCredential = async (vc: any, privKey: Uint8Array, verfMethod: string) => {
//   console.log("Preparing to sign VC...");
  
//   const pubKey = await getPublicKeyAsync(privKey);
  
//   const privateKeyJWK = JSON.stringify({
//     kty: "OKP",
//     crv: "Ed25519",
//     x: encode(pubKey.toString()), // Correctly encode the public key
//     d: encode(privKey.toString()), // Correctly encode the private key
//   });

//   const proofOptions = JSON.stringify({
//     proofPurpose: "assertionMethod",
//     verificationMethod: verfMethod, // Should be something like `did:web:localhost:abcd#key1`
//     type: "Ed25519Signature2018",
//     created: new Date().toISOString(),
//   });

//   console.log("Signing VC with DIDKit...");
  
//   try {
//     const signedVC = await DIDKit.issueCredential(JSON.stringify(vc), proofOptions, privateKeyJWK);
//     console.log("Successfully signed VC");
//     return JSON.parse(signedVC);
//   } catch (error) {
//     console.error("Error while signing VC:", error);
//     throw error;
//   }
// };


const fetchProofParameters = async (prefix: string, serverUrl: string) => {
  console.log(`${serverUrl}/${prefix}/did.json?proofParameters`)
  const response = await axios.get(`${serverUrl}/${prefix}/did.json?proofParameters`);
  return response.data;
};

// const createVerifiablePresentation = (holderDID: string, signedVC: any) => ({
//   "@context": "https://www.w3.org/2018/credentials/v1",
//   type: ["VerifiablePresentation"],
//   holder: holderDID,
//   verifiableCredential: signedVC,
// });

// const signVerifiablePresentation = async (vp: any, privKey: Uint8Array, proofParams: any) => {
//   const privateKeyJWK = JSON.stringify({
//     kty: "OKP",
//     crv: "Ed25519",
//     x: encode((await getPublicKeyAsync(privKey)).toString()),
//     d: encode(privKey.toString()),
//   });

//   const proofOptions = JSON.stringify({
//     proofPurpose: proofParams.proof_purpose,
//     verificationMethod: `${vp.holder}#key1`,
//     created: new Date().toISOString(),
//     domain: proofParams.domain,
//     challenge: proofParams.challenge,
//     type: "Ed25519Signature2018",
//   });

//   const signedVP = await DIDKit.issuePresentation(JSON.stringify(vp), proofOptions, privateKeyJWK);
//   return JSON.parse(signedVP);
// };

// const registerDIDOnServer = async (prefix: string, signedVP: any, serverUrl: string) => {
//   await axios.post(`${serverUrl}/${prefix}/did.json`, signedVP);
// };

function App() {
  const [keys, setKeys] = useState({ privKey: "", pubKey: "" });

  const handleGenerateKeys = async () => {
    const { privKey, pubKey } = await generateKeys();

    setKeys({
      privKey: encode(privKey.toString()),
      pubKey: encode(pubKey.toString()),
    });

    const prefix = "abcd";
    // const serverUrl = "http://localhost:8080"; // NGINX proxy
    // const doc = await generateDIDDocument(prefix, pubKey);
    // console.log("DID Document:\n", doc);

    // const vc = await generateVerifiableCredential(prefix, pubKey);
    // console.log("Verifiable Credential:\n", vc);

    // const didKey = generateDIDKey(prefix);
    // const verificationMethod = `${didKey}#key1`;
    // console.log("Verification Method:", verificationMethod);

    // const signedVC = await signVerifiableCredential(vc, privKey, verificationMethod);
    // console.log("Signed VC:\n", signedVC);

    // const proofParams = await fetchProofParameters(prefix, serverUrl);
    // const vp = createVerifiablePresentation(vc.issuer, signedVC);
    // const signedVP = await signVerifiablePresentation(vp, privKey, proofParams);
    // console.log("Signed VP:\n", signedVP);

    // await registerDIDOnServer(prefix, signedVP, serverUrl);
  
    const key = DIDKit.generateEd25519Key();
    console.log('Generated key:', key);

    const did = DIDKit.keyToDID('key', key);
    const verificationMethod = await DIDKit.keyToVerificationMethod('key', key);

    const serverUrl = "http://localhost:8080"; // NGINX proxy
    console.log('Verification Method:', verificationMethod);

    const vc = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "id": `uuid:${crypto.randomUUID()}`,
      "type": ["VerifiableCredential"],
      "issuer": did, // DID is the issuer
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": generateDIDKey(prefix),
      }
    };

    console.log("Generated VC:", vc);

    // const proofOptions = {
    //   proofPurpose: "assertionMethod",
    //   verificationMethod: verificationMethod, // The verification method from earlier
    //   type: "Ed25519Signature2018",
    //   created: new Date().toISOString()
    // }; 
    
    const signedVC = await DIDKit.issueCredential(JSON.stringify(vc), JSON.stringify({}), key);

    console.log("Signed VC:", signedVC);

    const vp = {
      "@context": "https://www.w3.org/2018/credentials/v1",
      type: ["VerifiablePresentation"],
      holder: did, // This is typically the DID of the holder
      verifiableCredential: [signedVC], // The signed VC(s)
    };
    
    const proofParams = await fetchProofParameters(prefix, serverUrl);
    const proofOptions = JSON.stringify({
      proofPurpose: proofParams.proof_purpose,
      verificationMethod: verificationMethod, // Assumes the holder has a key named "key1"
      created: new Date().toISOString(),
      domain: proofParams.domain,
      challenge: proofParams.challenge,
      type: "Ed25519Signature2018",
    });
  
    console.log(JSON.parse(proofOptions))
    // Sign the presentation
    const signedVP = await DIDKit.issuePresentation(JSON.stringify(vp), proofOptions, key);
    console.log(signedVP)
    return JSON.parse(signedVP);


  };

  return (
    <div className="App">
      <h1>Generate DID and Keys</h1>
      <button onClick={handleGenerateKeys}>Generate Keys</button>
      {keys.privKey && (
        <div>
          <h2>Generated Keys</h2>
          <p><strong>Private Key:</strong> {keys.privKey}</p>
          <p><strong>Public Key:</strong> {keys.pubKey}</p>
        </div>
      )}
    </div>
  );
}

export default App;
