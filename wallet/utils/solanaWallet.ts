import { install } from "@solana/webcrypto-ed25519-polyfill";
import { sha512 } from "@noble/hashes/sha512";
import * as SecureStore from "expo-secure-store";
import { bytesToHex, hexToBytes } from "@movingco/bytes-to-hex";

if (!globalThis.crypto?.subtle) {
  install();
  console.log("WebCrypto Polyfill Loaded");
}

import {
  utils,
  etc,
  getPublicKeyAsync,
  Hex,
  Bytes,
} from "@noble/ed25519";

etc.sha512Async = async (message: Uint8Array): Promise<Uint8Array> => {
  return sha512(message);
};

export const generatePrivateKey = async () => {
  try {
    const privateKey = utils.randomPrivateKey();
    return privateKey;
  } catch (error) {
    console.error("Error generating keypair:", error);
    return null;
  }
};

export const toPublicKey = async (priv: Hex) => {
  return await getPublicKeyAsync(priv);
};

export const saveKeypair = async (priv: Bytes) => {
  await SecureStore.setItemAsync(
    "solanaKey",
    bytesToHex(priv)
  );
}

export const fetchKeypair = async () => {
  const privateKey = await SecureStore.getItemAsync("solanaKey");
  var publicKey = null;
  if (privateKey) {
    publicKey = await toPublicKey(privateKey);
    publicKey = bytesToHex(publicKey);
  }

  return { publicKey, privateKey };
}
