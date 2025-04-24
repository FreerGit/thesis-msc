import { utils as secpUtils, etc } from '@noble/secp256k1';
import * as SecureStore from 'expo-secure-store';
import { ethers, Wallet } from 'ethers';
import { EthrDID } from "ethr-did";
import Constants from 'expo-constants';
import { getResolver } from 'ethr-did-resolver';
import { Resolver } from 'did-resolver';

const RPC_URL = `https://rpc.ankr.com/eth_sepolia/${Constants.expoConfig?.extra?.ANKR_API_KEY}`
const registry = "0x03d5003bf0e79C5F5223588F347ebA39AfbC3818" // the smart contract addr for registry
const issuer = "did:ethr:sepolia:0x9Cf4710D6D53f8E6B579e9EF766eE8E39E03E96F";
const provider = new ethers.JsonRpcProvider(RPC_URL)
const chainNameOrId = "sepolia"


export const generatePrivateKeypair = async () => {
  try {
    const priv = etc.bytesToHex(secpUtils.randomPrivateKey());
    const wallet = new ethers.Wallet(priv);
    return wallet;
  } catch (error) {
    console.error("Error generating wallet:", error);
    return null;
  }
};


export const saveKeypair = async (wallet: ethers.Wallet) => {
  const keyData = {
    address: wallet.address,
    priv: wallet.privateKey,
  };
  await SecureStore.setItemAsync("ethKey", JSON.stringify(keyData));
};

export const deleteKeypair = async () => {
  await SecureStore.deleteItemAsync("ethKey");
};

export const fetchKeypair = async (): Promise<ethers.Wallet | null> => {
  try {
    const storedKey = await SecureStore.getItemAsync("ethKey");
    if (!storedKey) return null;

    const { priv } = JSON.parse(storedKey);
    return new ethers.Wallet(priv);
  } catch (error) {
    console.error("Error loading wallet:", error);
    return null;
  }
};

export const getEthrDID = async () => {
  const wallet = await fetchKeypair();
  return new EthrDID({
    identifier: wallet!.address,
    privateKey: wallet!.privateKey,
    provider,
    chainNameOrId,
    registry
  })
}

export const resolveDidDoc = async () => {
  try {
    const did = await getEthrDID();
    const didResolver = new Resolver(getResolver({ rpcUrl: RPC_URL, name: chainNameOrId, chainId: 11155111, registry }));
    const didDocument = (await didResolver.resolve(did.did)).didDocument
    return didDocument
  } catch (e) {
    console.error("Error resolving did:", e);
    return null
  }
}

export const getBalance = async () => {
  const wallet = await fetchKeypair();
  const balance = await provider.getBalance(wallet!.address);
  return balance;
}