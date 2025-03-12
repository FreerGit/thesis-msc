import { ScrollView, Text, StyleSheet, View, Button } from "react-native";
import { useEffect, useState } from "react";
import * as Solana from "../../utils/solanaWallet";
import { setWalletExists } from '../../redux/walletSlice';
import { useDispatch } from "react-redux";
import { checkWallet, resolveDid } from "@/utils/walletUtils";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

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
    const tabBarHeight = useBottomTabBarHeight();

    const [resolvedDid, setResolvedDid] = useState({});
    const [secretKey, setSecretKey] = useState('');

    useEffect(() => {
        const fetchWallet = async () => {
            const key = await checkWallet();
            setSecretKey(key ? key : '');
        };
        fetchWallet();
    }, []);

    useEffect(() => {
        const fetchDid = async () => {
            if (secretKey) {
                const did = await resolveDid(secretKey);
                setResolvedDid(did);
            }
        };
        fetchDid();
    }, [secretKey]);

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
        flexGrow: 1,
        padding: 20,
        marginTop: 60,
    },

    header: {
        fontSize: 50,
        color: '#fff',
    },

    text: {
        color: '#fff',
        fontWeight: 'bold',
    },

    documentText: {
        fontSize: 16,
        color: "#fff",
    },

    key: {
        fontSize: 20,
        color: "#fff",
        fontWeight: 'bold',
    },

    entry: {
        flex: 1,
        flexDirection: 'column',
        padding: 5,
        backgroundColor: "#111",
        borderRadius: 5,
        width: "100%",
    },

    value: {
        fontSize: 16,
        color: "#fff",
    },
})
