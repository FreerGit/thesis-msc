import { ScrollView, Text, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import * as Solana from "../../utils/solanaWallet";
import { setIsAuthenticated, setWalletExists } from '../../redux/walletSlice';
import { useDispatch } from "react-redux";
import { checkWallet, resolveDid } from "@/utils/walletUtils";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Skeleton } from "moti/skeleton"
import { MotiView } from "moti"
import Button from "@/components/Button";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";

export default function ProfileScreen() {
    const [solanaPubKey, setSolanaPubKey] = useState("");
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [resolvedDid, setResolvedDid] = useState({});
    const [loading, setLoading] = useState(true);
    const tabBarHeight = useBottomTabBarHeight();

    const dispatch = useDispatch();

    useEffect(() => {
        const getWallet = async () => {
            const { publicKey } = await Solana.fetchKeypair();
            setSolanaPubKey(publicKey ? publicKey : "")
        };
        const getAccountBalance = async () => {
            const { privateKey } = await Solana.fetchKeypair();
            if (!privateKey) {
                throw new Error("No private key found!")
            }
            const bal = await Solana.fetchAccountBalance(privateKey);
            setBalance(bal);
        }
        const fetchDid = async () => {
            const key = await checkWallet();
            if (key) {
                const did = await resolveDid(key);
                setResolvedDid(did);
            }
        }
        getAccountBalance();
        getWallet();
        fetchDid();
    }, []);

    useEffect(() => {
        if (resolvedDid) {
            setLoading(false);
        }
    }, [resolvedDid])

    return (
        <LinearGradient colors={["#000000", "#333", "#333", "#000000"]} style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={{ marginBottom: tabBarHeight + 20, gap: 10 }}>
                    <Text style={styles.header}>Profile</Text>
                    <View style={{ flex: 1, gap: 5 }}>
                        <Text style={styles.text}>Solana public key: {solanaPubKey}</Text>
                        <Text style={styles.text}>Account balance: {balance}</Text>
                        <Button title="Remove Sol Key" onPress={async () => {
                            await Solana.deleteKeypair();
                            dispatch(setWalletExists(false));
                        }} />
                    </View>
                    <MotiView style={{ flex: 1, gap: 5 }}>
                        <Skeleton.Group show={Object.keys(resolvedDid).length === 0}>
                            <Skeleton>
                                <Text style={[styles.header, { marginTop: 0 }]}>Decentralized Identifier</Text>
                            </Skeleton>
                            <Skeleton width={"100%"} height={500}>
                                <View style={styles.entryView}>
                                    {
                                        Object.entries(resolvedDid).map(([key, value]) => {
                                            return (
                                                <View style={styles.entry} key={key}>
                                                    <Text style={styles.key}>{key}</Text>
                                                    <Text style={styles.value}>{JSON.stringify(value, null, 2)}</Text>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </Skeleton>
                        </Skeleton.Group>
                    </MotiView>
                    <Button
                        title="Lock wallet"
                        size="large"
                        onPress={async () => {
                            dispatch(setIsAuthenticated(false));
                        }}
                    >
                        <SymbolView name="lock.fill" tintColor="white" size={24} />
                    </Button>
                </View>
            </ScrollView >
        </LinearGradient>
    )
}

const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        padding: 20,
    },

    header: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    },

    text: {
        color: '#fff',
        fontWeight: 'bold',
    },

    entryView: {
        flex: 1,
        flexDirection: 'column',
        gap: 5,
        width: "100%",
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
        backgroundColor: "rgba(144, 144, 144, 0.1)",
        borderRadius: 5,
        width: "100%",
    },

    value: {
        fontSize: 16,
        color: "#fff",
    },
})
