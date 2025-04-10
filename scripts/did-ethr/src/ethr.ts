import { ethers, formatEther, SigningKey, Wallet } from 'ethers'
import { EthrDID } from 'ethr-did'
import { getResolver } from 'ethr-did-resolver'
import { Resolver } from 'did-resolver'
import { createVerifiableCredentialJwt, createVerifiablePresentationJwt, verifyCredential } from 'did-jwt-vc'
import { decodeJWT } from "did-jwt";
import * as dotenv from "dotenv";

const env = dotenv.config().parsed!;

const chainNameOrId = "sepolia"
const RPC_URL = `https://rpc.ankr.com/eth_sepolia/${env.ANKR_API_KEY}`
const registry = "0x03d5003bf0e79C5F5223588F347ebA39AfbC3818" // the smart contract addr for registry
const issuer = "did:ethr:sepolia:0x9Cf4710D6D53f8E6B579e9EF766eE8E39E03E96F";
console.log(RPC_URL)

// Initialize ethers provider for Sepolia
const provider = new ethers.JsonRpcProvider(RPC_URL)

const wallet = new Wallet(env.WALLET_PRIVATE_KEY, provider)
const private_key = wallet.privateKey;
const public_key = new SigningKey(wallet.privateKey).compressedPublicKey;

let did = new EthrDID({
    identifier: wallet.address,
    privateKey: private_key,
    provider,
    chainNameOrId,
    registry
})
console.log(did)

// const s = await did.revokeAttribute('did/svc/HubService', 'https://hubs.uport.me')
// console.log(s)
const args = process.argv.slice(2);

const resolveDidDoc = async () => {
    const didResolver = new Resolver(getResolver({ rpcUrl: RPC_URL, name: "sepolia", chainId: 11155111, registry }));
    const didDocument = (await didResolver.resolve(did.did)).didDocument
    return didDocument
}

if (args.length == 1 && args[0] == "--resolve") {
    console.log(await resolveDidDoc())

}

if (args.length == 1 && args[0] == "--balance") {
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet balance: ${formatEther(balance)} ETH`);
}

const subjectWallet = ethers.Wallet.createRandom();
const subjectDid = new EthrDID({
    identifier: subjectWallet.address,
    privateKey: subjectWallet.privateKey.slice(2),
    provider,
    registry,
    chainNameOrId: 'sepolia'
});

async function createAndSignVC() {
    console.log(`Issuer DID: ${did.did}`);
    console.log(`Subject DID: ${subjectDid.did}`);

    // Define the VC payload
    const vcPayload = {
        sub: subjectDid.did,    // Subject of the credential
        // nbf: Math.floor(Date.now() / 1000),  // Not valid before now (in seconds)
        // exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,  // Expires in 30 days
        vc: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential', 'ExampleCredential'],
            credentialSubject: {
                id: subjectDid.did,
                name: 'Example User',
                degree: {
                    type: 'BachelorDegree',
                    name: 'Bachelor of Science in Computer Science'
                }
            }
        }
    };

    try {
        const issuer = {
            did: did.did,
            signer: did.signer!,
            alg: 'ES256K-R'
        };
        // Create and sign the Verifiable Credential
        const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);

        console.log('\nVerifiable Credential JWT:');
        console.log(vcJwt);
        console.log(JSON.stringify(decodeJWT(vcJwt).payload, null, 3))

        // Optional: Verify the credential
        // The verification would typically be done by the verifier
        // This is just to demonstrate how it works
        // console.log('\nVerifying the credential...');
        // const didResolver = new Resolver(getResolver({ rpcUrl: RPC_URL, name: "sepolia", chainId: 11155111, registry }));

        // const verifiedVC = await verifyCredential(vcJwt, didResolver);
        // console.log(verifiedVC)
    } catch (error) {
        console.error('Error creating or verifying VC:', error);
    }
}

await createAndSignVC()


// const registry = new ethers.Contract(registryAddress, ['function setDIDDocument(address,bytes32)'], wallet);
// const tx = await registry.setDIDDocument(wallet.address, ethers.hashMessage(did.did));  // Just an example; ensure the actual data matches your DID structure
// console.log('Publishing DID:', tx.hash);
// await tx.wait();
// console.log('DID Document Published!');

// // Explicitly pass the network configuration to the resolver
// const didResolver = new Resolver(getResolver({
//     networks: [{
//         provider,
//         name: 'sepolia',
//         chainId: 11155111,
//         // rpcUrl: RPC_URL,
//         // registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b', // Sepolia DID registry contract address
//     }],
// }))

// async function resolve() {
//     try {
//         const didDocument = await didResolver.resolve(did.did)
//         console.log('DID Document:', JSON.stringify(didDocument, null, 2))
//     } catch (err) {
//         console.error('Error resolving DID:', err)
//     }
// }

// resolve()
