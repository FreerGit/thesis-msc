import { Buffer } from 'buffer';
import { Keypair, PublicKey } from '@solana/web3.js';
import { DidSolService, DidSolIdentifier, ExtendedCluster } from '@identity.com/sol-did-client';
import * as SecureStore from 'expo-secure-store';
import bs58 from 'bs58';
import { Wallet } from '@project-serum/anchor';

global.Buffer = Buffer;


export const checkWallet = async (): Promise<string | null> => {
    try {
        const key = await SecureStore.getItemAsync('solanaKey');
        return key;
    } catch (error) {
        console.error('Error checking wallet:', error);
        return null;
    }
};

export const resolveDid = async (keypair: Keypair) => {
    try {
        const cluster: ExtendedCluster = 'devnet';
        const didSolIdentifier = DidSolIdentifier.create(keypair.publicKey, cluster);
        const service = DidSolService.build(didSolIdentifier)
            // .withSolWallet(wallet)
            .withAutomaticAlloc(keypair.publicKey);
        const did = await service.resolve();

        return did;
    } catch (error) {
        console.error('Error resolving DID:', error);
        throw error;
    }
};