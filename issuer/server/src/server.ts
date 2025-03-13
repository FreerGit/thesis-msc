import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();

app.use(express.json());

const wss = new WebSocketServer({ noServer: true });


// client connects, sends unique nonce
// Wallet scans qr code to attain the nonce
// Wallet sends http request with the data and nonce
// Lookup in the map to find the associated connection to the nonce
// Push the data acquired from the wallet
const nonceToConnectionMap = new Map();


wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        const { nonce } = JSON.parse(message.toString());
        console.log("Received nonce:", nonce);

        nonceToConnectionMap.set(nonce, ws);

        ws.send(JSON.stringify({ message: "Nonce received successfully!" }));
    });

    ws.on("close", () => {
        // TODO: remove the entry on close (probably wont do this though lmeow)
        nonceToConnectionMap.clear();
        console.log("Client disconnected");
    });
});

app.post('/present-did', (req, res) => {
    const { nonce, data } = JSON.parse(req.body);
    console.log(`Received nonce via HTTP: ${nonce}`);

    if (nonceToConnectionMap.has(nonce)) {
        const ws = nonceToConnectionMap.get(nonce);
        ws.send(JSON.stringify({ message: "Data from server", data }))

        res.status(200).send('Data sent to client!');
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
