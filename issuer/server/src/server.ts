import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import * as vcIssuer from "@digitalbazaar/vc"
import { Ed25519VerificationKey2018 } from '@digitalbazaar/ed25519-verification-key-2018';
import { Ed25519Signature2018 } from '@digitalbazaar/ed25519-signature-2018';
import jsonld from "jsonld"

import { DidSolService, DidSolIdentifier } from '@identity.com/sol-did-client';
import { Wallet } from '@project-serum/anchor';
import { Keypair } from '@solana/web3.js';

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const credential = JSON.parse(readFileSync(join(__dirname, "../../data/credential.json"), "utf-8"));
// const credentialExample = JSON.parse(readFileSync(join(__dirname, "../../data/credentialExample.json"), "utf-8"));
// const issuerExample = JSON.parse(readFileSync(join(__dirname, "../../data/issuerExample.json"), "utf-8"));
const securitySuites = JSON.parse(readFileSync(join(__dirname, "../../data/securitySuites.json"), "utf-8"));
// const jsonLd = JSON.parse(readFileSync(join(__dirname, "../../data/jsonLd.json"), "utf-8"));

const app = express();

app.use(express.json());

const wss = new WebSocketServer({ noServer: true });

// client connects, sends unique nonce
// Wallet scans qr code to attain the nonce
// Wallet sends http request with the data and nonce
// Lookup in the map to find the associated connection to the nonce
// Push the data acquired from the wallet
const nonceToConnectionMap = new Map();
// TODO: remove the entry on close (probably wont do this though)

const customContexts: Record<string, object> = {
    // "https://www.w3.org/2018/credentials/v1": credential,
    // "https://www.w3.org/2018/credentials/examples/v1": credentialExample,
    // "http://example.com/": issuerExample,
    "https://w3id.org/security/v2": securitySuites,
    // "https://www.w3.org/ns/odrl.jsonld": jsonLd
};


const parsed = dotenv.config().parsed!;

const issuer_did = "did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb";

const key = await Ed25519VerificationKey2018.generate({
    id: "did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb#default",
    type: "Ed25519VerificationKey2018",
    publicKeyBase58: parsed["PUBLIC_KEY"],
    privateKeyBase58: parsed["PRIVATE_KEY"]
});

const suite = new Ed25519Signature2018({ key });


const customDocumentLoader = async (url: string) => {
    if (url == "did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb#default") {
        const did = DidSolIdentifier.parse(url)
        const service = DidSolService.build(did);
        const doc = await service.resolve();
        doc["@context"] = [
            "https://w3id.org/did/v1",
            "https://w3id.org/security/suites/ed25519-2018/v1",
        ]
        console.log("loader:", doc);
        return {
            contextUrl: null,
            document: doc,
            documentUrl: url,
        }
    }
    console.log("Loader", url)
    if (customContexts[url]) {
        return {
            contextUrl: null,
            document: customContexts[url],
            documentUrl: url,
        };
    }

    return jsonld.documentLoaders.node()(url);
}

const generateVC = async (issuer, wallet) => {
    // keyPair.id = "did:example:issuer123#1";
    // keyPair.controller = "did:example:issuer123";
    // const suite = new Ed25519Signature2018({ key: keyPair });
    const credential = {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/https://digitalbazaar.github.io/ed25519-signature-2018-context/contexts/ed25519-signature-2018-v1.jsonld/suites/ed25519-2018/v1",
            // "https://www.w3.org/2018/credentials/examples/v1"
        ],
        "type": ["VerifiableCredential"],
        "issuer": issuer,
        "issuanceDate": "2010-01-01T19:23:24Z",
        "credentialSubject": {
            "id": wallet,
            // "alumniOf": "Example University"
        }
    };
    // , documentLoader: customDocumentLoader }
    const signedVC = await vcIssuer.issue({ credential, suite });
    return signedVC;
}


const wallet_did = "did:sol:devnet:E13rUS8is8BU2J7KYnnti4rrmZ6hFCKW6JF9F33QCKhT";

const vc = await generateVC(issuer_did, wallet_did)



console.log(vc)

const pubk = await Ed25519VerificationKey2018.from({
    id: "did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb#default",
    type: "Ed25519VerificationKey2018",
    controller: "did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb",
    publicKeyBase58: parsed["PUBLIC_KEY"],
    // privateKeyBase58: parsed["PRIVATE_KEY"]
});

const pub_suite = new Ed25519Signature2018({ pubk });


const vc_result = await vcIssuer.verifyCredential({ credential: vc, suite: pub_suite, documentLoader: customDocumentLoader })

console.log(vc_result)

// const presentation = vcIssuer.createPresentation({
//     verifiableCredential: [vc]
// });


// const vp = await vcIssuer.signPresentation({
//     presentation, suite, challenge: "idk", documentLoader: customDocumentLoader
// })

// console.log(vp)

// const result = await vcIssuer.verify({ presentation: vp, challenge: "idk", suite, documentLoader: customDocumentLoader })

// console.log(result)


// wss.on("connection", (ws) => {
//     console.log("Client connected");

//     ws.on("message", (message) => {
//         const { nonce } = JSON.parse(message.toString());
//         console.log("Received nonce:", nonce);

//         nonceToConnectionMap.set(nonce, ws);

//         ws.send(JSON.stringify({ message: "Nonce received successfully!" }));
//     });

//     ws.on("close", () => {
//         nonceToConnectionMap.clear();
//         console.log("Client disconnected");
//     });
// });

// app.post('/present-did', async (req, res) => {
//     const { nonce, did, data } = req.body; // did -> wallet did
//     console.log(`Received nonce via HTTP: ${nonce}`);
//     if (nonceToConnectionMap.has(nonce)) {
//         const ws = nonceToConnectionMap.get(nonce);
//         ws.send(JSON.stringify({ message: "Data from server", data }))
//         const vc = await generateVC(issuer_did, did)
//         const response = {
//             title: "A VC shared by QR code",
//             vc: vc,
//         };
//         res.status(200).send(JSON.stringify(response));
//     } else {
//         res.status(404).send('Nonce not found!');
//     }
// });

// const server = http.createServer(app);

// server.on('upgrade', (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit('connection', ws, request);
//     });
// });

// server.listen(8000, () => {
//     console.log("HTTP and WebSocket server is running on http://localhost:8000");
// });