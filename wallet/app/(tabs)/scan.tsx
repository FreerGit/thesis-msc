import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult, Camera, ScanningResult } from "expo-camera"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from "expo-haptics"
import React, { useEffect, useRef, useState } from 'react';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import Button from '@/components/Button';
import { SymbolView } from 'expo-symbols';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchKeypair } from '@/utils/solanaWallet';
import { saveVC } from '@/utils/vcFileSystem';



export default function ScanScreen() {

    const tabBarHeight = useBottomTabBarHeight();
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState<ScanningResult | null>(null);
    const [vc, setVC] = useState({});
    const hasScannerRegistered = useRef(false);

    useEffect(() => {
        if (permission?.canAskAgain || permission?.status === "undetermined") {
            requestPermission();
        }

        if (hasScannerRegistered.current) return;
        hasScannerRegistered.current = true;

        const onBarcodeScanned = async (data: ScanningResult) => {
            CameraView.dismissScanner();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setModalVisible(true);
            setData(data);
            const keypair = await fetchKeypair();
            const nonce = data?.data;
            console.log(nonce, keypair, nonce && keypair)
            if (nonce && keypair) {
                const url = `http://52.158.36.185:8000/present-did`;

                const did = `did:sol:devnet:${keypair.publicKey.toBase58()}`
                axios.post(url, { nonce: nonce, did: did, data: {} }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then(response => {
                        setVC(response.data)
                        console.log('Server Response:', response.data);
                    })
                    .catch(error => {
                        console.error('Error sending nonce:', error);
                    });
            }

        }

        CameraView.onModernBarcodeScanned(onBarcodeScanned);

    }, [])

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>No camera permissions</Text>
                <Button title="Request permissions" onPress={requestPermission} />
            </View>
        )
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Camera permissions denied</Text>
                <Button title="Request permissions" onPress={requestPermission} />
            </View>
        )
    }


    const onCameraReady = async () => {
        await CameraView.launchScanner({ barcodeTypes: ["qr"], isGuidanceEnabled: false });
    }

    const handleModalClose = () => {
        setModalVisible(false);
    }

    const handleSaveVC = async () => {
        console.log(vc)
        saveVC(vc, vc["vc"]["credentialSubject"]["id"]);

        handleModalClose()
    }

    return (
        <LinearGradient colors={["#000000", "#333", "#333", "#000000"]} style={{ flex: 1 }}>
            <View style={[styles.container, { paddingBottom: tabBarHeight }]}>
                <Text style={styles.text}>Scan QR</Text>
                <View style={styles.content}>
                    <Button
                        title="Toggle scanning"
                        size='large'
                        onPress={() => onCameraReady()}
                    >
                        <SymbolView name='qrcode.viewfinder' tintColor={"white"} size={30}></SymbolView>
                    </Button>
                </View>

                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                >
                    <BlurView
                        intensity={20}
                        tint='light'
                        style={{ flex: 1 }}
                    >
                        <View style={styles.modalContainer}>
                            <Text style={{ color: "white" }}>
                                {JSON.stringify(vc)}
                            </Text>
                            <View style={styles.buttons}>
                                <Button
                                    title="Cancel"
                                    onPress={() => handleModalClose()}
                                >
                                </Button>
                                <Button
                                    title="Save"
                                    onPress={() => handleSaveVC()}
                                >
                                </Button>
                            </View>
                        </View>
                    </BlurView>
                </Modal>
            </View >
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 10,
    },

    modalContainer: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        backgroundColor: '#333'
    },

    cameraView: {
        height: 350,
        width: "100%",
        overflow: 'hidden',
        borderRadius: 10,
    },

    content: {
        flex: 1,
        alignItems: "center"
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },

    text: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    }
})