import { DidSolService, DidSolIdentifier, ExtendedCluster, DidSolDocument } from '@identity.com/sol-did-client';
import { hexToBytes } from '@movingco/bytes-to-hex';
import { Wallet } from '@project-serum/anchor';
import { Keypair } from '@solana/web3.js';


export const createDIDClient = (privateKey: string): DidSolService => {

    const cluster: ExtendedCluster = 'devnet';
    const keypair = Keypair.fromSecretKey(hexToBytes(privateKey));
    const wallet = new Wallet(keypair);
    const didSolIdentifier = DidSolIdentifier.create(keypair.publicKey, cluster);
    const service = DidSolService.build(didSolIdentifier)
        .withSolWallet(wallet)
        .withAutomaticAlloc(keypair.publicKey);
    return service;
    // service.addService({
    //     "fragment": `#ipfsService`,
    //     "serviceType": "LinkedDomains",
    //     "serviceEndpoint": "ipfs://QmP8jTG1m9GSDJLCbeWhVSVgEzCPPwXRdCRuJtQ5Tz9Kc9"
    // }).withAutomaticAlloc(keypair.publicKey).withSolWallet(wallet).rpc();

    // await service.initialize(1000, keypair.publicKey).rpc();
}







// Create the updated DID Document
// const didDoc = DidSolDocument.fromDoc({
//     "@context": ["https://w3id.org/did/v1.0", "https://w3id.org/sol/v2.0"
//     ],
//     "id": didSolIdentifier.toString(),
//     // "controller": [didSolIdentifier.toString()],
//     "verificationMethod": [

//     ],
//     "authentication": [`${didSolIdentifier.toString()}#key1`],
//     "service": [
//         {
//             "id": `${didSolIdentifier.toString()}#ipfsService`,
//             "type": "LinkedDomains",
//             "serviceEndpoint": "ipfs://QmP8jTG1m9GSDJLCbeWhVSVgEzCPPwXRdCRuJtQ5Tz9Kc9"
//         }
//     ]
// });

// {
//   "id": `${didSolIdentifier.toString()}#key1`,
//   "type": "Ed25519VerificationKey2018",
//   "controller": didSolIdentifier.toString(),
//   "publicKeyBase58": keypair.publicKey.toBase58()
// },
// console.log("DID Document:", JSON.stringify(didDoc, null, 2));

// const s = await service.updateFromDoc(didDoc).withAutomaticAlloc(keypair.publicKey).rpc();
// console.log(s)

// const skibidy = service.setControllers([])
//   .withAutomaticAlloc(keypair.publicKey)
//   .rpc();

// // Resolve the DID Document to verify changes
// try {
// const resolvedDidDoc = await service.resolve();
// console.log(resolvedDidDoc)
//   console.log('Resolved DID Document:', JSON.stringify(resolvedDidDoc, null, 2));
// } catch (error) {
//   console.error('Error resolving DID document:', error);
// }

export const resolveDID = async (client: DidSolService) => {
    return await client.resolve();
}