import { View, Text, StyleSheet } from "react-native"
import { useEffect, useState } from "react";
import * as Solana from "../../utils/solanaWallet"

export default function ProfileScreen() {
    const [solanaPubKey, setSolanaPubKey] = useState("");

    useEffect(() => {
        const getWallet = async () => {
            const { publicKey } = await Solana.fetchKeypair();
            setSolanaPubKey(publicKey ? publicKey : "")
            console.log(publicKey)
        };
        getWallet();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Profile</Text>
            <Text style={styles.publicKey}>Solana public key: {solanaPubKey}</Text>

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