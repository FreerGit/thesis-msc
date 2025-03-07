import { IonDid, IonKey, IonDocumentModel, JwkEs256k, IonRequest, IonPublicKeyPurpose } from '@decentralized-identity/ion-sdk';
import fetch from 'node-fetch'; // You may need to install this

async function createDidIon() {
    // Your existing key generation and document creation code...
    const authnKeyPair = await IonKey.generateEs256kOperationKeyPair();
    const recoveryKeyPair = await IonKey.generateEs256kOperationKeyPair();
    const updateKeyPair = await IonKey.generateEs256kOperationKeyPair();

    const ionDocument: IonDocumentModel = {
        publicKeys: [
            {
                id: 'auth-key',
                type: 'EcdsaSecp256k1VerificationKey2019',
                publicKeyJwk: authnKeyPair[0],
                purposes: [IonPublicKeyPurpose.Authentication]
            }
        ]
    };

    // Create the long-form DID
    const longFormDid = await IonDid.createLongFormDid({
        recoveryKey: recoveryKeyPair[0] as JwkEs256k,
        updateKey: updateKeyPair[0] as JwkEs256k,
        document: ionDocument as IonDocumentModel
    });

    console.log('Generated DID:', longFormDid);

    // Create the request object
    const createRequest = await IonRequest.createCreateRequest({
        document: ionDocument,
        recoveryKey: recoveryKeyPair[0],
        updateKey: updateKeyPair[0]
    });

    // Submit the request to an ION node (testnet in this case)
    const response = await fetch('https://testnet.ion.dfinity.network/operations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createRequest)
    });

    // Store these keys securely for future operations on this DID
    const keysToStore = {
        recoveryPrivateKey: recoveryKeyPair[1],
        updatePrivateKey: updateKeyPair[1],
        authenticationPrivateKey: authnKeyPair[1]
    };
    
    console.log('Keys to store securely:', JSON.stringify(keysToStore, null, 2));
    
    if (response.status === 200) {
        console.log('DID successfully registered on ION testnet!');
        console.log('Short-form DID:', longFormDid.split(':').slice(0, 3).join(':'));
        console.log('Anchoring may take some time to complete');
    } else {
        console.error('Failed to register DID:', await response.text());
    }
}

// Run the function
createDidIon().catch(console.error);