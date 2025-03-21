import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult, Camera, ScanningResult } from "expo-camera"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from "expo-haptics"
import React, { useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import Button from '@/components/Button';
import { SymbolView } from 'expo-symbols';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScanScreen() {
    const tabBarHeight = useBottomTabBarHeight();
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState<ScanningResult | null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (permission?.canAskAgain || permission?.status === "undetermined") {
            requestPermission();
        }
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

    const onBarcodeScanned = (data: ScanningResult) => {
        if (scanned) return;

        setScanned(true);
        CameraView.dismissScanner();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setModalVisible(true);
        setData(data);

        const nonce = data?.data;
        if (nonce) {
            const url = `http://20.123.83.171:8000/present-did`;

            axios.post(url, { nonce: nonce, data: {} }, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(response => {
                    console.log('Server Response:', response.data);
                })
                .catch(error => {
                    console.error('Error sending nonce:', error);
                });
        }
    }

    const onCameraReady = async () => {
        await CameraView.launchScanner({ barcodeTypes: ["qr"], isGuidanceEnabled: false });
        CameraView.onModernBarcodeScanned(onBarcodeScanned);
    }

    const handleModalClose = () => {
        setScanned(false);
        setModalVisible(false);
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
                                {JSON.stringify(data, null, 2)}
                            </Text>
                            <View style={styles.buttons}>
                                <Button
                                    title="Cancel"
                                    onPress={() => handleModalClose()}
                                >
                                </Button>
                                <Button
                                    title="Save"
                                    onPress={() => handleModalClose()}
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