import { View, Text, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Keypair } from '@solana/web3.js';

const create_sol_wallet = async () => {
    const fileUri = FileSystem.documentDirectory + 'example.txt';
    const content = 'Hello, Expo FileSystem!';
    console.log(fileUri)
    try {
        await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });
        console.log('File written successfully');
    } catch (error) {
        console.error('Error writing file:', error);
    }

    try {
        const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
        console.log('File content:', content);
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

const generate_keypair = () => {
    const keypair = Keypair.generate();
    console.log(keypair)
}

export default function WalletScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Wallet</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black',
    },

    text: {
        marginTop: 80,
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    },
})

