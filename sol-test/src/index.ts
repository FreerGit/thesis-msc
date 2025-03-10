import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
import { DidSolService, DidSolIdentifier, ExtendedCluster, DidSolDocument } from '@identity.com/sol-did-client';
import * as dotenv from 'dotenv';
import { connect } from 'http2';
import { connected } from 'process';
import { Wallet } from '@project-serum/anchor';

async function main() {
  dotenv.config();

  const secretKeyString = process.env.SOLANA_PRIVATE_KEY;
  if (!secretKeyString) {
    throw new Error('SOLANA_PRIVATE_KEY is not set in .env');
  }

  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const keypair = Keypair.fromSecretKey(secretKey);
  // const keypair = Keypair.generate();
  const cluster: ExtendedCluster = 'devnet';
  const didSolIdentifier = DidSolIdentifier.create(keypair.publicKey, cluster);
  const wallet = new Wallet(keypair);
  const service = DidSolService.build(didSolIdentifier)
    .withSolWallet(wallet)
    .withAutomaticAlloc(keypair.publicKey);
  console.log("Public Key:", keypair.publicKey.toBase58());

  // console.log("service:", service);
  service.addService(      {
    "fragment": `#ipfsService`,
    "serviceType": "LinkedDomains",
    "serviceEndpoint": "ipfs://QmP8jTG1m9GSDJLCbeWhVSVgEzCPPwXRdCRuJtQ5Tz9Kc9"
  }).withAutomaticAlloc(keypair.publicKey).withSolWallet(wallet).rpc();




  // await service.initialize(1000, keypair.publicKey).rpc();

  // Create the updated DID Document
  const didDoc = DidSolDocument.fromDoc({
    "@context": ["https://w3id.org/did/v1.0", "https://w3id.org/sol/v2.0"
    ],
    "id": didSolIdentifier.toString(),
    // "controller": [didSolIdentifier.toString()],
    "verificationMethod": [

    ],
    "authentication": [`${didSolIdentifier.toString()}#key1`],
    "service": [
      {
        "id": `${didSolIdentifier.toString()}#ipfsService`,
        "type": "LinkedDomains",
        "serviceEndpoint": "ipfs://QmP8jTG1m9GSDJLCbeWhVSVgEzCPPwXRdCRuJtQ5Tz9Kc9"
      }
    ]
  });

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
  const resolvedDidDoc = await service.resolve();
  console.log(resolvedDidDoc)
  //   console.log('Resolved DID Document:', JSON.stringify(resolvedDidDoc, null, 2));
  // } catch (error) {
  //   console.error('Error resolving DID document:', error);
  // }
}

main().catch(console.error);
