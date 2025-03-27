import 'react-native-get-random-values';
import { install } from "@solana/webcrypto-ed25519-polyfill";
import { sha512 } from "@noble/hashes/sha512";
import * as SecureStore from "expo-secure-store";
import { bytesToHex, hexToBytes } from "@movingco/bytes-to-hex";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { base58 } from "@scure/base";

if (!globalThis.crypto?.subtle) {
  install();
}

import {
  utils,
  etc,
  getPublicKeyAsync,
  Bytes
} from "@noble/ed25519";
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

etc.sha512Async = async (message: Uint8Array): Promise<Uint8Array> => {
  return sha512(message);
};

export const generatePrivateKeypair = async () => {
  try {
    const keypair = Keypair.generate();
    return keypair;
  } catch (error) {
    console.error("Error generating keypair:", error);
    return null;
  }
};

// export const toPublicKey = async (priv: Bytes) => {
//   try {
//     const b = await getPublicKeyAsync(priv);
//     return base58.encode(b);
//   } catch (e) {
//     console.error("Can't get public key", e)
//   }
// };

export const saveKeypair = async (pair: Keypair) => {
  // const privHex = bytesToHex(priv);
  console.log("real, to be saved: ", pair)
  const keyData = {
    pub: pair.publicKey.toBase58(),
    priv: bs58.encode(pair.secretKey),
  };
  await SecureStore.setItemAsync("solanaKey", JSON.stringify(keyData));
}

export const deleteKeypair = async () => {
  await SecureStore.deleteItemAsync("solanaKey")
}

export const fetchKeypair = async (): Promise<Keypair | null> => {
  try {
    const storedKeypair = await SecureStore.getItemAsync("solanaKey");
    if (!storedKeypair) return null;

    const { pub, priv } = JSON.parse(storedKeypair);
    return Keypair.fromSecretKey(bs58.decode(priv));
  } catch (error) {
    console.error("Error loading keypair:", error);
    return null;
  }
};

export const fetchAccountBalance = async (priv: Bytes) => {
  try {
    const SOLANA_RPC_URL = "https://api.devnet.solana.com";
    const connection = new Connection(SOLANA_RPC_URL, "confirmed");

    const publicKey = await toPublicKey(priv);
    if (!publicKey) throw new Error("Public key is null");

    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance;
  } catch (e) {
    console.error("Error fetching balance:", e);
  }
};
