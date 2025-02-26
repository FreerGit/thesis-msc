import { Keypair} from '@solana/web3.js';
import { DidSolService, DidSolIdentifier, ExtendedCluster } from '@identity.com/sol-did-client';

const keypair = Keypair.generate();
// const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const cluster: ExtendedCluster = 'devnet';
const didSolIdentifier = DidSolIdentifier.create(keypair.publicKey, cluster);

const service = DidSolService.build(didSolIdentifier);

// Empty DID document
const emptyDidDoc = {
  "@context": ["https://w3id.org/did/v1.0", "https://w3id.org/sol/v2.0"],
  "id": didSolIdentifier.toString(),
  "verificationMethod": [],
  "authentication": [],
  "service": []
};

const transaction = service.initialize(); 
console.log(transaction);

const resolvedDidDoc = await service.resolve();
console.log('Resolved DID Document:', JSON.stringify(resolvedDidDoc, null, 2));
