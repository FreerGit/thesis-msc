import 'react-native-get-random-values';
import { install } from "@solana/webcrypto-ed25519-polyfill";
import { sha512 } from "@noble/hashes/sha512";
import * as SecureStore from "expo-secure-store";
import { bytesToHex, hexToBytes } from "@movingco/bytes-to-hex";

if (!globalThis.crypto?.subtle) {
  install();
}

import {
  utils,
  etc,
  getPublicKeyAsync,
  Hex,
  Bytes,
} from "@noble/ed25519";
import { isBytes } from "@noble/hashes/utils";

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
  const b = await getPublicKeyAsync(priv);
  return bytesToHex(b);
};

export const saveKeypair = async (priv: Hex) => {
  await SecureStore.setItemAsync(
    "solanaKey",
    isBytes(priv) ? bytesToHex(priv) : priv
  );
}

export const deleteKeypair = async () => {
  await SecureStore.deleteItemAsync("solanaKey")
}

export const fetchKeypair = async () => {
  const privateKey = await SecureStore.getItemAsync("solanaKey");
  var publicKey = null;
  if (privateKey) {
    publicKey = await toPublicKey(privateKey);
  }

  return { publicKey, privateKey };
}
