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
import { listAllVCs } from "@/utils/vcFileSystem";
import WalletModal from "@/components/WalletModal";
import * as Filesystem from "expo-file-system";
import CredentialView from "@/components/CredentialView";
import { deleteVC } from "@/utils/vcFileSystem";


export default function WalletScreen() {
    const [savedVCList, setSavedVcList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVc, setSelectedVc] = useState<any | null>(null);
    const [filePath, setFilePath] = useState<string | null>(null);

    const tabBarHeight = useBottomTabBarHeight();

    useEffect(() => {
        const getVcList = async () => {
            const vcs = await listAllVCs();
            setSavedVcList(vcs);
            setLoading(false);
        }
        getVcList()
    }, [])

    const handleVcPress = (vc: any, filePath: string) => {
        setSelectedVc(vc);
        setFilePath(filePath);
        setModalVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false);
        setSelectedVc(null);
    }

    const deleteCredential = async (filePath: string) => {
        try {
            const fileInfo = await Filesystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                throw new Error("File does not exist");
            }
            await deleteVC(filePath);
            setSavedVcList((prevList) => prevList.filter((vc) => vc.path !== filePath));
        } catch (error) {
            console.error("Error deleting VC:", error);
        }
    }

    return (
        <LinearGradient colors={["#000000", "#333", "#333", "#000000"]} style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={{ marginBottom: tabBarHeight + 20 }}>
                    <Text style={styles.text}>Wallet</Text>
                    {
                        savedVCList &&
                        <View style={styles.cardView}>
                            {
                                savedVCList.map((savedVC, index) => {
                                    return (
                                        <VcCard key={index} title={savedVC["title"]} vc={savedVC["vc"]} filePath={savedVC["path"]} onVcPress={handleVcPress} />
                                    )
                                })
                            }
                        </View>
                    }
                </View>

                <WalletModal
                    modalVisible={modalVisible}
                    handleModalClose={closeModal}
                    modalTitle="Credential"
                >
                    <CredentialView
                        vc={selectedVc}
                        filePath={filePath ?? ""}
                        onClose={closeModal}
                        deleteVC={deleteCredential}
                    />
                </WalletModal>
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

