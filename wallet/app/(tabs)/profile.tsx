import { View, Text, StyleSheet, Button } from "react-native";
import { useEffect, useState } from "react";
import * as Solana from "../../utils/solanaWallet";
import { setWalletExists } from '../../redux/walletSlice';
import { useDispatch } from "react-redux";

export default function ProfileScreen() {
    const [solanaPubKey, setSolanaPubKey] = useState("");
    const [balance, setBalance] = useState<number | undefined>(undefined);

    const dispatch = useDispatch();

    useEffect(() => {
        const getWallet = async () => {
            const { publicKey } = await Solana.fetchKeypair();
            console.log("fetch", publicKey)
            setSolanaPubKey(publicKey ? publicKey : "")
        };
        const getAccountBalance = async () => {
            const { privateKey } = await Solana.fetchKeypair();
            if (!privateKey) throw new Error("No private key found!")
            const bal = await Solana.fetchAccountBalance(privateKey);
            setBalance(bal);
        }
        getAccountBalance();
        getWallet();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile</Text>
            <Text style={styles.text}>Solana public key: {solanaPubKey}</Text>
            <Text style={styles.text}>Account balance: {balance}</Text>
            <Button title="Remove Sol Key" onPress={async () => {
                await Solana.deleteKeypair();
                dispatch(setWalletExists(false));
            }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },

    header: {
        fontSize: 36,
        color: '#fff',
    },

    text: {
        color: '#fff',
    }
})