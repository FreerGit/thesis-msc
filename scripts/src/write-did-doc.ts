import { PublicKey, Connection, Keypair, SystemProgram } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import bs58 from 'bs58';
import idlJson from '../did_doc_updater/target/idl/did_doc_updater.json';
import { DidSolIdentifier, DidSolService, ExtendedCluster } from '@identity.com/sol-did-client';
import { Wallet } from '@coral-xyz/anchor';

const base58Key = "3Z3ot1kNcsRGnkGEJ5rXtsb4yXMsz7QUNRt84Ua1ZANsnqGCYiZ11XZ9drsyJBvE8oDGKu1he1KhimJEgtxnuwWd";

const createDIDClient = (keypair: Keypair): DidSolService => {
    const cluster: ExtendedCluster = 'devnet';
    const wallet = new Wallet(keypair);
    const didSolIdentifier = DidSolIdentifier.create(keypair.publicKey, cluster);
    const service = DidSolService.build(didSolIdentifier)
        .withSolWallet(wallet)
        .withAutomaticAlloc(keypair.publicKey);
    return service;
}


async function main() {
    // === CONFIG ===
    const idl = idlJson as anchor.Idl;
    const keypair = Keypair.fromSecretKey(bs58.decode(base58Key));
    console.log(keypair.publicKey.toString())
    // Establish a connection
    const connection = new Connection("https://api.devnet.solana.com");

    // Create the wallet provider
    const wallet = new anchor.Wallet(keypair);
    const provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' });

    // Set the provider for Anchor
    anchor.setProvider(provider);

    // Create the program object using the IDL and provider
    const program = new anchor.Program(idl, provider);

    // Program ID is now accessible from the program instance
    const programId = program.programId;
    console.log(programId)
    const service = createDIDClient(keypair);

    const did_doc = await service.resolve();

    const didDocPDA = await PublicKey.findProgramAddress(
        [keypair.publicKey.toBuffer()],
        programId
    );
    console.log('Derived PDA:', didDocPDA[0].toBase58());

    console.log(program.account)
    // Check if the account exists or is initialized
    // @ts-ignore
    const didDocAccount = await program.account.didDoc.fetch(didDocPDA[0]) as DidDoc;

    console.log(didDocAccount)

    // Initialize the did_doc account if it doesn't exist
    // const tx = await program.methods
    //     .initializeDidDoc(Buffer.from([]))
    //     .accounts({
    //         didDoc: didDocPDA[0],
    //         payer: keypair.publicKey,
    //         systemProgram: SystemProgram.programId
    //         // Add other required accounts like payer, etc.
    //     })
    //     .signers([keypair])
    //     .rpc();
    // console.log('did_doc account initialized:', tx);

    if (Array.isArray(did_doc['@context'])) {
        did_doc['@context'] = did_doc['@context']?.concat([
            "https://w3id.org/did/v1",
            "https://w3id.org/security/suites/ed25519-2018/v1",
        ]);
    }



    // // Update the DID document
    const tx = await program.methods
        .update(Buffer.from(JSON.stringify(did_doc)))
        .accounts({
            didDoc: didDocPDA[0],
        })
        .rpc();

    console.log("Transaction Signature:", tx);
}

main().catch(console.error);
