import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import * as vcIssuer from "@digitalbazaar/vc"
import * as verKey from "@digitalbazaar/ed25519-verification-key-2020"
import * as sig from "@digitalbazaar/ed25519-signature-2020"
import jsonld from "jsonld"

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse JSON files
const credential = JSON.parse(readFileSync(join(__dirname, "../../data/credential.json"), "utf-8"));
const credentialExample = JSON.parse(readFileSync(join(__dirname, "../../data/credentialExample.json"), "utf-8"));
const issuerExample = JSON.parse(readFileSync(join(__dirname, "../../data/issuerExample.json"), "utf-8"));
const securitySuites = JSON.parse(readFileSync(join(__dirname, "../../data/securitySuites.json"), "utf-8"));
const jsonLd = JSON.parse(readFileSync(join(__dirname, "../../data/jsonLd.json"), "utf-8"));

// console.log(credentialExample, issuerExample, securitySuites, jsonLd);
const app = express();

app.use(express.json());
// app.use(cors())

const wss = new WebSocketServer({ noServer: true });

// client connects, sends unique nonce
// Wallet scans qr code to attain the nonce
// Wallet sends http request with the data and nonce
// Lookup in the map to find the associated connection to the nonce
// Push the data acquired from the wallet
const nonceToConnectionMap = new Map();
// TODO: remove the entry on close (probably wont do this though lmeow)

const generateKeyPair = async () => {
    return await verKey.Ed25519VerificationKey2020.generate();
}

const keypair = await generateKeyPair();

// const vc = {
//     '@context': ['https://www.w3.org/2018/credentials/v1'],
//     type: ['VerifiableCredential'],
//     issuer: 'did:example:issuer123',
//     issuanceDate: new Date().toISOString(),
//     credentialSubject: {
//         id: 'did:example:john_doe',
//         name: 'John Doe',
//         email: 'john.doe@example.com'
//     }
// };

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

const generateVC = async (keyPair, did) => {
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
            "id": did,
            "alumniOf": "Example University"
        }
    };

    const signedVC = await vcIssuer.issue({ credential, suite, documentLoader: customDocumentLoader });
    console.log("Credential", JSON.stringify(signedVC, null, 2));
}


wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        const { nonce } = JSON.parse(message.toString());
        console.log("Received nonce:", nonce);

        nonceToConnectionMap.set(nonce, ws);

        ws.send(JSON.stringify({ message: "Nonce received successfully!" }));
    });

    ws.on("close", () => {
        nonceToConnectionMap.clear();
        console.log("Client disconnected");
    });
});

app.post('/present-did', (req, res) => {
    const { nonce, did, data } = req.body;
    console.log(`Received nonce via HTTP: ${nonce}`);
    if (nonceToConnectionMap.has(nonce)) {
        const ws = nonceToConnectionMap.get(nonce);
        ws.send(JSON.stringify({ message: "Data from server", data }))
        const vc = generateVC(keypair, did)
        // console.log(generateVC(keypair, did))
        res.status(200).send(JSON.stringify(vc));
    } else {
        res.status(404).send('Nonce not found!');
    }
});

const server = http.createServer(app);

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

server.listen(8000, () => {
    console.log("HTTP and WebSocket server is running on http://localhost:8000");
});
