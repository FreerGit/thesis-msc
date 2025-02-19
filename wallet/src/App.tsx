import { useState } from 'react';
import './App.css';
import { utils, etc, getPublicKeyAsync, Bytes, sign as edSign, verify, sign } from '@noble/ed25519';
import bs58 from 'bs58';
import { v4 as uuidv4 } from 'uuid';
import { createJWS, ES256KSigner } from 'did-jwt';

const generateKeys = async () => {
  const privKey = utils.randomPrivateKey();
  const pubKey = await getPublicKeyAsync(privKey);
  return { privKey, pubKey }
}

// TODO: im unsure how this should be derived, since this lives on the did-web-server.
const generateDIDKey = async (privKey: Bytes) => {
  const pub = await getPublicKeyAsync(privKey);
  const pubKeyBase58 = bs58.encode(pub);
  return `did:key:z6Mkp${pubKeyBase58}`;
}

const generateDIDJWK = (pubKey: Bytes) => {
  return {
    kty: "OKP",
    crv: "Ed25519",
    x: bs58.encode(pubKey),
  };
};

const generateDIDDocument = async (prefix: string, pubKey: Bytes) => {
  const jwk = generateDIDJWK(pubKey);

  // TODO: There probably exists a library for this? path to server is hardcoded...
  const DWS_EXTERNAL_HOSTNAME = "localhost"
  const DID_KEY_PREFIX = prefix;
  const didDocument = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    "id": `did:web:${DWS_EXTERNAL_HOSTNAME}%3A8000:${DID_KEY_PREFIX}`,
    "verificationMethod": [
      {
        "id": `did:web:${DWS_EXTERNAL_HOSTNAME}%3A8000:${DID_KEY_PREFIX}#key1`,
        "type": "JsonWebKey2020",
        "controller": `did:web:${DWS_EXTERNAL_HOSTNAME}%3A8000:${DID_KEY_PREFIX}`,
        "publicKeyJwk": jwk
      }
    ],
    "authentication": [
      `did:web:${DWS_EXTERNAL_HOSTNAME}%3A8000:${DID_KEY_PREFIX}#key1`
    ],
    "assertionMethod": [
      `did:web:${DWS_EXTERNAL_HOSTNAME}%3A8000:${DID_KEY_PREFIX}#key1`
    ]
  };

  return didDocument;
}

// create_verifiable_credential() {
//   echo "Creating Verifiable Credential (VC) for $DID_KEY_PREFIX..."
//   cat > "$DID_KEY_PREFIX-vc-did.json" <<EOF
// {
//   "@context": [
//     "https://www.w3.org/2018/credentials/v1"
//   ],
//   "id": "uuid:$(uuidgen)",
//   "type": ["VerifiableCredential"],
//   "issuer": "$(cat $OWNER_DID_FILE)",
//   "issuanceDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
//   "credentialSubject": $(cat $DID_KEY_PREFIX-did.json)
// }
// EOF
// }



const generateVerifiableCredential = async (prefix: string, pubKey: Bytes, privKey: Bytes) => {
  const jwk = {
    kty: 'OKP',
    crv: 'Ed25519',
    x: bs58.encode(pubKey)
  };

  const DID_KEY_PREFIX = prefix;
  const vc = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "id": `uuid:${uuidv4()}`,
    "type": ["VerifiableCredential"],
    "credentialSubject": {
      "id": `did:web:localhost%3A8000:${DID_KEY_PREFIX}`,
      "assertionMethod": [`did:web:localhost%3A8000:${DID_KEY_PREFIX}#key1`],
      "authentication": [`did:web:localhost%3A8000:${DID_KEY_PREFIX}#key1`],
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/jws-2020/v1"
      ],
      "verificationMethod": [
        {
          "controller": `did:web:localhost%3A8000:${DID_KEY_PREFIX}`,
          "id": `did:web:localhost%3A8000:${DID_KEY_PREFIX}#key1`,
          "publicKeyJwk": jwk,
          "type": "JsonWebKey2020"
        }
      ]
    },
    "issuer": await generateDIDKey(privKey),
    "issuanceDate": new Date().toISOString()
  };

  return vc;

}

const signVerifiableCredential = async (vc: any, privKey: Uint8Array) => {
  const pubKey = await getPublicKeyAsync(privKey);
  const pubKeyBase58 = bs58.encode(pubKey);
  const issuerDID = vc.issuer;

  // Convert private key into a JWS signer function
  const signer = ES256KSigner(privKey)

  // Create the JWT representation of the Verifiable Credential
  const jwt = await createJWS(vc, signer, {
    alg: 'EdDSA',
    kid: `${issuerDID}#z6Mkp${pubKeyBase58}`,
  });

  // Add the proof field
  vc.proof = {
    type: 'Ed25519Signature2018',
    proofPurpose: 'assertionMethod',
    verificationMethod: `${issuerDID}#z6Mkp${pubKeyBase58}`,
    created: new Date().toISOString(),
    jws: jwt,
  };

  return vc;
};

function App() {
  const [keys, setKeys] = useState({ privKey: "", pubKey: "" });
  const handleGenerateKeys = async () => {
    const { privKey, pubKey } = await generateKeys();

    setKeys({
      privKey: etc.bytesToHex(privKey),
      pubKey: etc.bytesToHex(pubKey),
    });

    const prefix = "abcd"
    const doc = await generateDIDDocument(prefix, privKey);
    console.log("DOC:\n", doc)

    const vc = await generateVerifiableCredential(prefix, pubKey, privKey);
    console.log("VC:\n", vc);

    const signedVC = await signVerifiableCredential(vc, privKey);
    console.log("Signed VC:\n", signedVC);
  }

  return (
    <div className="App">
      <h1>Generate Ed25519 Key Pair</h1>
      <button onClick={handleGenerateKeys}>Generate Keys</button>
      {keys.privKey.length > 0 && (
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
