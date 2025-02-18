import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { utils, etc, getPublicKeyAsync, Bytes } from '@noble/ed25519';
import bs58 from 'bs58';
import { sortAndDeduplicateDiagnostics } from 'typescript';


const generateKeys = async () => {
  const privKey = utils.randomPrivateKey();
  const pubKey = await getPublicKeyAsync(privKey);
  return { privKey, pubKey }
}

const generateDIDDocument = async (prefix:string, pubKey: Bytes, privKey: Bytes) => {
  const jwk = {
    kty: 'OKP',
    crv: 'Ed25519',
    x: bs58.encode(pubKey)
  };

  const privateKeyJwk = {
    kty: 'OKP',
    crv: 'Ed25519',
    x: bs58.encode(privKey)
  }

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

function App() {
  const [keys, setKeys] = useState({ privKey: "" , pubKey: "" });
  const handleGenerateKeys = async () => {
    const { privKey, pubKey } = await generateKeys();
    
    setKeys({
      privKey: etc.bytesToHex(privKey),
      pubKey: etc.bytesToHex(pubKey),
    });

    const doc = await generateDIDDocument("abcd", privKey, pubKey);
    console.log(doc)
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
