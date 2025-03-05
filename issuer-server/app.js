
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as didkit from "@spruceid/didkit-wasm-node";
import crypto from 'crypto';

const key = JSON.parse(process.env.PRIVATE_KEY);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post("/issue-credential", async (req, res) => {
    const data = JSON.parse(req.body.body);

    const did = didkit.keyToDID("key", JSON.stringify(key));
    const verificationMethod = await didkit.keyToVerificationMethod("key", JSON.stringify(key));


    const vc = {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1",
            "https://schema.org/"
        ],
        "type": ["VerifiableCredential", "Person"],
        "issuer": did,
        "issuanceDate": new Date().toISOString(),
        "credentialSubject": {
            "name": data.name,
            "email": data.email,
            "age": data.age,
            "address": data.address,
            "nationality": "Sweden"
        },
    };


    try {
        const signedVc = await didkit.issueCredential(JSON.stringify(vc), JSON.stringify({}), JSON.stringify(key));
        console.log("Credential signed", signedVc);
    } catch (err) {
        console.error("Error", err);
    }

    res.send('Credential issued');
});

app.listen(4000, () => {
    console.log('Server started on http://localhost:4000');
});
