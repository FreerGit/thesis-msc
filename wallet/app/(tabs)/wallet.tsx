import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Modal,
    Button
} from "react-native";
import { useEffect, useState } from "react";
import * as vcs from "../../vcs.json"
import VcCard from "@/components/VcCard";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import VcModal from "@/components/VcModal";
import { LinearGradient } from "expo-linear-gradient";

export default function WalletScreen() {
    const [vcList, setVcList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVc, setSelectedVc] = useState<any | null>(null);

    const tabBarHeight = useBottomTabBarHeight();

    useEffect(() => {
        const getVcList = async () => {
            setVcList(vcs.verifiableCredentials);
            setLoading(false);
        }
        getVcList()
    }, [])

    const handleVcPress = (vc: any) => {
        setSelectedVc(vc);
        setModalVisible(true);
    }

    const closeModal = () => {
        setSelectedVc(null);
        setModalVisible(false);
    }

    return (
        <LinearGradient colors={["#000000", "#333", "#333", "#000000"]} style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={{ marginBottom: tabBarHeight + 20 }}>
                    <Text style={styles.text}>Wallet</Text>
                    {
                        vcList &&
                        <View style={styles.cardView}>
                            {
                                vcList.map((vc, index) => {
                                    return (
                                        <VcCard key={index} vc={vc} onVcPress={handleVcPress} />
                                    )
                                })
                            }
                        </View>
                    }
                </View>

                <VcModal
                    vc={selectedVc}
                    modalVisible={modalVisible}
                    closeModal={closeModal}
                ></VcModal>
            </ScrollView >
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    modalContainer: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: '#333',
        padding: 20,
    },

    modalContentContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        flexGrow: 1,
        alignItems: 'center',
    },

    cardView: {
        flex: 1,
        gap: 5,
    },

    text: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    },

    modalText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
    }
})

