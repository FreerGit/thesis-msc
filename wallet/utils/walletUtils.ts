import { Keypair } from '@solana/web3.js';
import { DidSolService, DidSolIdentifier, ExtendedCluster } from '@identity.com/sol-did-client';
import * as SecureStore from 'expo-secure-store';
import bs58 from 'bs58';
import { Wallet as SolanaWallet } from '@project-serum/anchor';

export const checkWallet = async (): Promise<string | null> => {
    try {
        const key = await SecureStore.getItemAsync('solanaKey');
        return key;
    } catch (error) {
        console.error('Error checking wallet:', error);
        return null;
    }
};

export const resolveDid = async (secretKey: string) => {
    try {
        const secretKeyArray = bs58.decode(secretKey);

        const keypair = Keypair.fromSecretKey(secretKeyArray);

        const cluster: ExtendedCluster = 'devnet';
        const didSolIdentifier = DidSolIdentifier.create(keypair.publicKey, cluster);

        // const wallet = new SolanaWallet(keypair);
        // console.log('Created Solana wallet:', wallet);

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