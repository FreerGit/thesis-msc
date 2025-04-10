import { DidSolService, DidSolIdentifier, ExtendedCluster } from '@identity.com/sol-did-client';
import { Wallet } from '@project-serum/anchor';
import { Keypair } from '@solana/web3.js';
import bs58 from "bs58";
import dotenv from "dotenv";
import fs from "fs";
import { exit } from 'process';


const createDIDClient = (keypair: Keypair): DidSolService => {
    const cluster: ExtendedCluster = 'devnet';
    const wallet = new Wallet(keypair);
    const didSolIdentifier = DidSolIdentifier.create(keypair.publicKey, cluster);
    const service = DidSolService.build(didSolIdentifier)
        .withSolWallet(wallet)
        .withAutomaticAlloc(keypair.publicKey);
    return service;
}

const getDotenvFromPathArg = (args: string[], assoc: string) => {
    const pathArg = args.find(arg => arg.startsWith('--path='));
    const pathValue = pathArg ? pathArg.split('=')[1] : null;

    if (process.argv.length < 3 || pathValue == null) {
        console.log(`When using \"${assoc}\", you must also pass --env-path=<path-to-dot-env> as second argument`);
        exit(1);
    }

    const env = dotenv.config({ path: pathValue });
    if (!env.parsed) {
        console.log("Could not read .env file, either invalid .env format or incorrect path.");
        exit(1);
    }

    return env;
}

const printUsage = () => {
    console.log("Usage:");
    console.log("To create a new keypair:\n     npm run dev -- --key\n");
    console.log("To generate a .env file with a new keypair:\n     npm run dev -- --generate-env\n");
    console.log("To get (devnet) funds:\n     npm run dev -- --airdrop\n");
    console.log("To get current verificationMethod:\n     npm run --silent dev --get-verification-method --path=<path-to-dot-env>\n");
    console.log("To set a new assertionMethod, reads from stdin:\n     echo '<assertions-as-json>' | npm run dev --set-assertion-method --path=<path-to-dot-env>\n");
    console.log("To resolve the current DID Document:\n     npm run dev -- --resolve --path=../issuer/server/.env")
}

const readInputJson = () => {
    return new Promise<any>((resolve, reject) => {
        let input = '';
        process.stdin.on('data', (chunk) => {
            input += chunk;
        });

        process.stdin.on('end', () => {
            try {
                const parsedInput = JSON.parse(input);
                resolve(parsedInput);
            } catch (error) {
                reject("Invalid JSON input");
            }
        });
    });
};

const main = async () => {
    if (process.argv.length <= 2) {
        printUsage();
        return;
    }

    const args = process.argv.slice(2);

    if (args[0] == "--key") {
        const keypair = Keypair.generate();
        console.log("Public key:", keypair.publicKey.toString());
        console.log("Private key:", bs58.encode(keypair.secretKey));
        return;
    }

    if (args[0] == "--generate-env") {
        const keypair = Keypair.generate();
        const pubkey = keypair.publicKey.toString();
        const privkey = bs58.encode(keypair.secretKey);
        const env_pubkey = "PUBLIC_KEY=" + pubkey;
        const env_privkey = "PRIVATE_KEY=" + privkey;
        const to_write = env_pubkey + "\n" + env_privkey;
        fs.writeFileSync(".env", to_write)
        return;
    }

    if (args[0] == "--airdrop") {
        console.log("To get (devnet) sol to your wallet (key) you have to vists the website https://faucet.solana.com/");
        console.log("Follow the instructions on said website, it may take some time and multiple tries to successfully airdrop some (devnet) funds");
        console.log("To confirm that the funds where airdropped, visit https://explorer.solana.com/?cluster=devnet and enter your public key")
        return;
    }

    if (args[0] == "--get-verification-method") {
        const env = getDotenvFromPathArg(args, "--get-verfication-method");

        const pair = Keypair.fromSecretKey(bs58.decode(env.parsed!["PRIVATE_KEY"]));
        const service = createDIDClient(pair);
        const didDoc = await service.resolve();

        console.log(JSON.stringify(didDoc.verificationMethod))
        return;
    }

    if (args[0] == "--set-assertion-method") {
        const env = getDotenvFromPathArg(args, "--set-assertion-method");
        const verf_method = await readInputJson();

        const pair = Keypair.fromSecretKey(bs58.decode(env.parsed!["PRIVATE_KEY"]));
        const service = createDIDClient(pair);
        const did_doc = await service.resolve();

        did_doc.assertionMethod = verf_method;
        const s = await service
            .updateFromDoc(did_doc)
            .withAutomaticAlloc(pair.publicKey)
            .rpc();

        const new_did_dic = await service.resolve();

        console.log("Solana TX:", s);
        console.log("Updated DID Document:\n", new_did_dic);
        return;

    }

    if (args[0] == "--resolve") {
        const env = getDotenvFromPathArg(args, "--resolve");
        const pair = Keypair.fromSecretKey(bs58.decode(env.parsed!["PRIVATE_KEY"]));
        const service = createDIDClient(pair);
        const did_doc = await service.resolve();

        console.log(did_doc)
        return;
    }

    printUsage();

}

main();
