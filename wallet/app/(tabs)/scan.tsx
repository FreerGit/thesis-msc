import { StyleSheet, View, Text, Button, Modal, Pressable } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult, Camera, ScanningResult } from "expo-camera"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from "expo-haptics"
import React, { useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';

export default function ScanScreen() {
    const tabBarHeight = useBottomTabBarHeight();
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState<ScanningResult | null>(null);


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
        CameraView.dismissScanner();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setModalVisible(true);
        setData(data);
    }

    const onCameraReady = async () => {
        await CameraView.launchScanner({ barcodeTypes: ["qr"], isGuidanceEnabled: false });
        CameraView.onModernBarcodeScanned(onBarcodeScanned);
    }

    return (
        <View style={[styles.container, { paddingBottom: tabBarHeight }]}>
            <Text style={styles.text}>Scan QR</Text>
            <View style={styles.content}>
                <Button
                    title="Toggle scanning"
                    onPress={() => onCameraReady()}
                ></Button>
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
                                onPress={() => setModalVisible(false)}
                            >
                            </Button>
                            <Button
                                title="Save"
                                onPress={() => setModalVisible(false)}
                            >
                            </Button>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'black',
        gap: 10,
    },

    modalContainer: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        marginTop: 50,
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
        marginTop: 60,
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    }
})