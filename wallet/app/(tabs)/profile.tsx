import { View, Text, StyleSheet, Button } from "react-native"
import { useEffect, useState } from "react";
import * as Solana from "../../utils/solanaWallet";
import { setWalletExists } from '../../redux/walletSlice';
import { useDispatch, useSelector } from "react-redux";

export default function ProfileScreen() {
    const [solanaPubKey, setSolanaPubKey] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        const getWallet = async () => {
            const { publicKey } = await Solana.fetchKeypair();
            setSolanaPubKey(publicKey ? publicKey : "")
        };
        getWallet();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Profile</Text>
            <Text style={styles.publicKey}>Solana public key: {solanaPubKey}</Text>
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

    text: {
        fontSize: 36,
        color: '#fff',
    },

    publicKey: {
        color: '#fff',
    }
})