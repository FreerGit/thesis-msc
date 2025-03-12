import 'react-native-get-random-values';
import '@craftzdog/react-native-buffer';
import { View, Text, StyleSheet, Button } from 'react-native';
import ImportModal from '../components/ImportModal';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Keypair } from '@solana/web3.js';

interface SolanaWalletScreenProps {
    setWalletExists: (exists: boolean) => void;
}

if (!global.crypto.subtle) {
    import('@solana/webcrypto-ed25519-polyfill').then(() => {
        console.log('WebCrypto Polyfill Loaded');
    });
}

import { utils, getPublicKey, getPublicKeyAsync } from '@noble/ed25519';

async function generateEd25519Keypair() {
    try {
        // Generate a 32-byte random private key
        const privateKey = utils.randomPrivateKey(); // returns a Uint8Array with length 32

        // Generate the public key from the private key
        // const publicKey = await getPublicKeyAsync(privateKey); // returns a Uint8Array with length 32

        // Log private and public keys
        // console.log('Private Key (Hex):', Buffer.from(privateKey).toString('hex'));
        // console.log('Public Key (Hex):', Buffer.from(publicKey).toString('hex'));

        return { privateKey };  // Return the keypair
    } catch (error) {
        console.error('Error generating keypair:', error);
    }
}


export default function SolanaWalletScreen({ setWalletExists }: SolanaWalletScreenProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState('');

    const createNewSolanaKey = async () => {
        try {
            const randomBytes = new Uint8Array(16);
            crypto.getRandomValues(randomBytes);
            console.log('Random Values:', randomBytes);
            console.log("ABC:", await generateEd25519Keypair())
            const keypair = Keypair.generate();
            await SecureStore.setItemAsync('solanaKey', keypair.secretKey.toString());
            setWalletExists(true);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login</Text>
            <View style={styles.buttons}>
                <Button
                    title="Import Solana Key"
                    onPress={() => setModalVisible(true)}
                >
                </Button>
                <Button
                    title="Create new Solana wallet"
                    onPress={() => createNewSolanaKey()}
                >
                </Button>
            </View>

            {modalVisible && <ImportModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                text={text}
                setText={setText}
                setWalletExists={setWalletExists}
            />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },

    text: {
        marginTop: 80,
        fontSize: 50,
        // color: '#fff',
        fontWeight: 'bold',
    },

    buttons: {
        display: 'flex',
        flexDirection: 'row',
    }

})

