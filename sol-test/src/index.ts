import { Keypair } from '@solana/web3.js';
import { DidSolService, DidSolIdentifier, ExtendedCluster } from '@identity.com/sol-did-client';
import { createHelia } from 'helia'
import { strings } from '@helia/strings'


// const initIPFS = async () => {
//   const ipfs = await createHelia();
//   console.log("IPFS Node started")

//   const s = strings(ipfs);

//   const addr = await s.add('hello world')

//   console.log(await s.get(addr))
//   await ipfs.stop()
// }


// // await initIPFS();

// async function main() {
//   const keypair = Keypair.generate();
//   const cluster: ExtendedCluster = 'devnet';
// const didSolIdentifier = DidSolIdentifier.create(keypair.publicKey, cluster);
//   const service = DidSolService.build(didSolIdentifier);

//   // Empty DID document
//   const didDoc = {
//     "@context": ["https://w3id.org/did/v1.0", "https://w3id.org/sol/v2.0"],
//     "id": didSolIdentifier.toString(),
//     "verificationMethod": [],
//     "authentication": [],
//     "service": []
//   };

//   // Upload DID Document to IPFS
//   // const { cid } = await ipfs.add(JSON.stringify(didDoc));
//   // console.log('IPFS CID:', cid.toString());

//   // Add IPFS CID as a service entry in the DID document
//   const didService = {
//     fragment: `${didSolIdentifier}#ipfs`,
//     serviceType: "LinkedData",
//     serviceEndpoint: `ipfs://${cid.toString()}`
//   };

//   // Register service with DID
//   await service.addService(didService);
//   console.log('DID Service added:', didService);

//   // Commit the transaction
//   const transaction = service.initialize();
//   console.log('Transaction:', transaction);

//   // Resolve the DID Document to verify changes
//   const resolvedDidDoc = await service.resolve();
//   console.log('Resolved DID Document:', JSON.stringify(resolvedDidDoc, null, 2));
// }

// // main().catch(console.error);



const createSolanaDID = async () => {
  // const keypair = Keypair.generate();
  const privateKey = process.env.SOLANA_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('SOLANA_PRIVATE_KEY environment variable is required');
  }

  const arr = JSON.parse(privateKey);

  const uInt8Key = Uint8Array.from(arr);

  const keypair = Keypair.fromSecretKey(uInt8Key);

  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  const cluster: ExtendedCluster = 'devnet';
  const didSolIdentifier = DidSolIdentifier.create(keypair.publicKey, cluster);

  const service = DidSolService.build(didSolIdentifier);

  // // Empty DID document
  const emptyDidDoc = {
    "@context": ["https://w3id.org/did/v1.0", "https://w3id.org/sol/v2.0"],
    "id": didSolIdentifier.toString(),
    "verificationMethod": [],
    "authentication": [],
    "service": []
  };

  // Upload DID Document to Solana


  const transaction = service.initialize();
  console.log(transaction);

  const resolvedDidDoc = await service.resolve();
  console.log('Resolved DID Document:', JSON.stringify(resolvedDidDoc, null, 2));
}

await createSolanaDID().catch(console.error);