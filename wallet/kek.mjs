import * as DIDKit from "@spruceid/didkit-wasm-node";
import axios from 'axios';
import { utils, getPublicKeyAsync, getPublicKey } from '@noble/ed25519';
import { decode, encode } from "universal-base64url";



const generateDIDKey = (prefix) => {
  return `did:web:localhost%3A8000:${prefix}`;
};

const fetchProofParameters = async (prefix, serverUrl) => {
  console.log(`${serverUrl}/${prefix}/did.json?proofParameters`)
  const response = await axios.get(`${serverUrl}/${prefix}/did.json?proofParameters`);
  return response.data;
};

const generateDIDDocument = async (prefix, jwk) => {
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

const prefix = "OMG"

// const key = DIDKit.generateEd25519Key();
// console.log('Generated key:', key);

const key = JSON.stringify({"kty":"OKP","crv":"Ed25519","x":"P29QmTX13p2CEKyeaATBaD48g7-r5lnZafDAHT38N3I","d":"H8kFJKFPyLj-Ra6eR4kHKlrCgvGs55x9qNpDEP6POoY"})


const did = DIDKit.keyToDID('key', key);
// const verificationMethod = await DIDKit.keyToVerificationMethod('key', key);
const verificationMethod = "did:key:z6MkiitBGXQfTTzMpRhNQmXtWmFWgKAdMmSBbPSwEpdq3Meq#z6MkiitBGXQfTTzMpRhNQmXtWmFWgKAdMmSBbPSwEpdq3Meq"
const serverUrl = "http://localhost:8080"; // NGINX proxy
console.log('Verification Method:', verificationMethod);

const jwk = {"kty":"OKP","crv":"Ed25519","x":"UIeLZ5I0cXloJutBrBESOZw3bQUOsjbIFFMNcAewMnE","d":"0C4Cx4NCiRCr7aCNWZt93RfL3KkeqNGx0FWUV2SXMVk"}


const vc = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "id": `uuid:${crypto.randomUUID()}`,
  "type": ["VerifiableCredential"],
  "issuer": did, // DID is the issuer
  "issuanceDate": new Date().toISOString(),
  "credentialSubject": await generateDIDDocument(prefix, jwk)
};
// {
//   "id": generateDIDKey(prefix),
// }

console.log("Generated VC:", vc);

// const proofOptions = {
//   proofPurpose: "assertionMethod",
//   verificationMethod: verificationMethod, // The verification method from earlier
//   type: "Ed25519Signature2018",
//   created: new Date().toISOString()
// }; 

const signedVC = await DIDKit.issueCredential(JSON.stringify(vc), JSON.stringify({}), key);
console.log("Signed VC:", JSON.parse(signedVC));

const vp = {
  "@context": "https://www.w3.org/2018/credentials/v1",
  type: ["VerifiablePresentation"],
  holder: did, // This is typically the DID of the holder
  verifiableCredential: JSON.parse(signedVC), // The signed VC(s)
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
console.log(JSON.parse(signedVP))
// return JSON.parse(signedVP);

console.log("VERF")
const verifyResult = await DIDKit.verifyPresentation(signedVP, "{}");
console.log("VP Verification Result:", verifyResult);


const registerVP = async (signedVP, serverUrl, prefix) => {
  try {
      const response = await axios.post(`${serverUrl}/${prefix}/did.json`, signedVP, {
          headers: {
              "Content-Type": "application/json"
          }
      });
      console.log("✅ VP registered successfully:", response.data);
  } catch (error) {
      console.error("❌ Failed to register VP:", error.response ? error.response.data : error.message);
  }
};

// Call this function after signing the VP
await registerVP(signedVP, serverUrl, prefix);