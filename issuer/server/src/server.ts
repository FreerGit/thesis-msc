import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();

app.use(express.json());

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        const { nonce } = JSON.parse(message.toString());
        console.log("Received nonce:", nonce);
        ws.send(JSON.stringify({ message: "Nonce received successfully!" }));
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

app.get('/present-did', (req, res) => {
    const nonce = req.query.nonce;
    console.log(`Received nonce via HTTP: ${nonce}`);

    res.json({ message: `Received nonce: ${nonce}` });
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
