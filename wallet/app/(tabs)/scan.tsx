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
import { fetchKeypair } from '@/utils/ethWallet';
import { saveVC } from '@/utils/vcFileSystem';
import { decodeJWT } from "did-jwt";
import { getResolver } from 'ethr-did-resolver'
import { Resolver } from 'did-resolver'
import { verifyCredential, verifyPresentation } from 'did-jwt-vc'
import Constants from 'expo-constants'

const chainNameOrId = "sepolia"
const RPC_URL = `https://rpc.ankr.com/eth_sepolia/${Constants.expoConfig?.extra?.ANKR_API_KEY}`
const registry = "0x03d5003bf0e79C5F5223588F347ebA39AfbC3818" // the smart contract addr for registry

// const createVC = async (nonce: string) => {

//     console.log(nonce, keypair, nonce && keypair)
//     if (nonce && keypair) {
//         const url = `http://52.158.36.185:8000/present-did`;

//         const did = `did:sol:devnet:${keypair.publicKey.toBase58()}`
//         axios.post(url, { nonce: nonce, did: did, data: {} }, {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         })
//             .then(async response => {
//                 const vc = response.data.vc;
//                 setVC(decodeJWT(vc).payload)
//                 const didResolver = new Resolver(getResolver({ rpcUrl: RPC_URL, chainId: chainNameOrId, registry }));

//                 const verifiedVC = await verifyCredential(vc, didResolver);
//                 console.log('Verified VC:', verifiedVC);

//             })
//             .catch(error => {
//                 console.error('Error sending nonce:', error);
//             });
//     }

// }

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
            console.log("???/")
            CameraView.dismissScanner();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setModalVisible(true);
            setData(data);

            console.log(data)
            const parsedData = JSON.parse(data.data);
            console.log(parsedData)
            switch (parsedData.type) {
                case "VerifierChallenge":
                    console.log("VerifierChallenge QR code scanned");
                    break;
                case "createVC":
                    const nonce = parsedData.nonce;
                    console.log("create VC,", nonce);
                    break;
                default:
                    console.log("Unknown QR code scanned");
                    break;
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
                        style={{ flex: 1, paddingTop: 50 }}
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