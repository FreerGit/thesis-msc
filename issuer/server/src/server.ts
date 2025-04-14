import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from "dotenv";
import { EthrDID } from 'ethr-did';
import { createVerifiableCredentialJwt } from 'did-jwt-vc';
import { ethers, Wallet } from 'ethers';


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

const keysEnv = dotenv.config({ path: "./.env" }).parsed!;
const apiEnv = dotenv.config({ path: "./.env.api" }).parsed!;
const chainNameOrId = "sepolia"
const RPC_URL = `https://rpc.ankr.com/eth_sepolia/${apiEnv.ANKR_API_KEY}`
const registry = "0x03d5003bf0e79C5F5223588F347ebA39AfbC3818" // the smart contract addr for registry
const provider = new ethers.JsonRpcProvider(RPC_URL)

const wallet = new Wallet(keysEnv.WALLET_PRIVATE_KEY, provider)
const private_key = wallet.privateKey;


let issuerDID = new EthrDID({
    identifier: wallet.address,
    privateKey: private_key,
    provider,
    chainNameOrId,
    registry
})

const generateVC = async (issuer: EthrDID, wallet: string) => {
    const vcPayload = {
        sub: wallet,    // Subject of the credential
        vc: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential', 'ExampleCredential'],
            credentialSubject: {
                id: wallet,
                name: 'Example User',
                degree: {
                    type: 'BachelorDegree',
                    name: 'Bachelor of Science in Computer Science'
                }
            }
        }
    };

    const issuerForJWT = {
        did: issuer.did,
        signer: issuer.signer!,
        alg: 'ES256K-R'
    };

    const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuerForJWT);

    return vcJwt;
}

app.post('/present-did', async (req, res) => {
    try {

        const { nonce, did, data } = req.body; // did -> wallet did
        console.log(`Received nonce via HTTP: ${nonce}`);
        if (nonceToConnectionMap.has(nonce)) {
            const ws = nonceToConnectionMap.get(nonce);
            ws.send(JSON.stringify({ message: "Data from server", data }))
            const vc = await generateVC(issuerDID, did)
            const response = {
                title: "A VC shared by QR code",
                vc: vc,
            };
            res.status(200).send(JSON.stringify(response));
        } else {
            res.status(404).send('Nonce not found!');
        }
    } catch (e) {
        console.error("Could not create VC:", e)
    }
});

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

const server = http.createServer(app);

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

server.listen(8000, () => {
    console.log("HTTP and WebSocket server is running on http://localhost:8000");
});