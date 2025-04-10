// save this as `save-keypair.js`

import bs58 from "bs58";
import { writeFileSync } from "fs";

const base58Key = "3Z3ot1kNcsRGnkGEJ5rXtsb4yXMsz7QUNRt84Ua1ZANsnqGCYiZ11XZ9drsyJBvE8oDGKu1he1KhimJEgtxnuwWd";

const decoded = bs58.decode(base58Key);
if (decoded.length !== 64) throw new Error("Expected 64-byte keypair");

writeFileSync(
    "/home/a7/.config/solana/custom-id.json",
    JSON.stringify(Array.from(decoded))
);

console.log("Keypair written to /home/a7/.config/solana/custom-id.json");
