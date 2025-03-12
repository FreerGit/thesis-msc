import 'react-native-get-random-values';
import { install } from "@solana/webcrypto-ed25519-polyfill";
import { sha512 } from "@noble/hashes/sha512";
import * as SecureStore from "expo-secure-store";
import { bytesToHex, hexToBytes } from "@movingco/bytes-to-hex";
import { Connection, PublicKey } from "@solana/web3.js";
import { base58 } from "@scure/base";

if (!globalThis.crypto?.subtle) {
  install();
}

import {
  utils,
  etc,
  getPublicKeyAsync, Bytes
} from "@noble/ed25519";

etc.sha512Async = async (message: Uint8Array): Promise<Uint8Array> => {
  return sha512(message);
};

export const generatePrivateKey = async () => {
  try {
    const privateKey = utils.randomPrivateKey();
    const privateKeyHex = privateKey;
    return privateKeyHex;
  } catch (error) {
    console.error("Error generating keypair:", error);
    return null;
  }
};

export const toPublicKey = async (priv: Bytes) => {
  try {
    const b = await getPublicKeyAsync(priv);
    return base58.encode(b);
  } catch (e) {
    console.error("Can't get public key", e)
  }
};

export const saveKeypair = async (priv: Bytes) => {
  const privHex = bytesToHex(priv);
  await SecureStore.setItemAsync("solanaKey", privHex);
}

export const deleteKeypair = async () => {
  await SecureStore.deleteItemAsync("solanaKey")
}

export const fetchKeypair = async () => {
  const privateKeyHex = await SecureStore.getItemAsync("solanaKey");
  console.log("solanaKey (hex)", privateKeyHex);

  let publicKey = null;
  let privateKey = null;

  if (privateKeyHex) {
    privateKey = hexToBytes(privateKeyHex); // Convert back to bytes
    publicKey = await toPublicKey(privateKey);
  }

  console.log("pair", publicKey, privateKey);
  return { publicKey, privateKey };
};

export const fetchAccountBalance = async (priv: Bytes) => {
  try {
    const SOLANA_RPC_URL = "https://api.devnet.solana.com";
    const connection = new Connection(SOLANA_RPC_URL, "confirmed");

    const publicKey = await toPublicKey(priv);
    if (!publicKey) throw new Error("Public key is null");

    const balance = await connection.getBalance(new PublicKey(publicKey));
    console.log("Balance:", balance);
    return balance;
  } catch (e) {
    console.error("Error fetching balance:", e);
  }
};
