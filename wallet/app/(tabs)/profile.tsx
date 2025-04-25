import { ScrollView, Text, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { setIsAuthenticated, setWalletExists } from '../../redux/walletSlice';
import { useDispatch } from "react-redux";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Skeleton } from "moti/skeleton"
import { MotiView } from "moti"
import Button from "@/components/Button";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import { fetchKeypair, resolveDidDoc, getBalance, deleteKeypair } from "../../utils/ethWallet";

export default function ProfileScreen() {
    const [balance, setBalance] = useState<string | undefined>(undefined);
    const [resolvedDid, setResolvedDid] = useState({});
    const [loading, setLoading] = useState(true);
    const tabBarHeight = useBottomTabBarHeight();

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchDid = async () => {
            const did = await resolveDidDoc();
            setResolvedDid(did!);
        }

        const getEthBalance = async () => {
            const bal = await getBalance();
            setBalance(bal.toString())
        }

        fetchDid();
        getEthBalance();
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
                        <Text style={styles.text}>Account balance: {balance}</Text>
                        <Button title="Remove Ethereum Key" type="secondary" onPress={async () => {
                            await deleteKeypair();
                            dispatch(setWalletExists(false));
                        }} />
                    </View>
                    <MotiView style={{ flex: 1, gap: 5 }}>
                        <Skeleton.Group show={Object.keys(resolvedDid ?? {}).length === 0}>
                            <Skeleton>
                                <Text style={[styles.header, { marginTop: 0 }]}>Decentralized Identifier</Text>
                            </Skeleton>
                            <Skeleton width={"100%"} height={500}>
                                <View style={styles.entryView}>
                                    {resolvedDid &&
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
                        type="secondary"
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
        backgroundColor: "rgba(144, 144, 144, 0.2)",
        borderRadius: 5,
        width: "100%",
    },

    value: {
        fontSize: 16,
        color: "#fff",
    },
})
