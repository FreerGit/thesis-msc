import { StyleSheet, View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult, Camera, ScanningResult } from "expo-camera"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from "expo-haptics"
import React, { useEffect, useRef, useState } from 'react';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import Button from '@/components/Button';
import { SymbolView } from 'expo-symbols';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchKeypair, getEthrDID } from '@/utils/ethWallet';
import { saveVC } from '@/utils/vcFileSystem';
import { decodeJWT } from "did-jwt";
import { getResolver } from 'ethr-did-resolver'
import { Resolver } from 'did-resolver'
import { VC_ERROR, verifyCredential, verifyPresentation } from 'did-jwt-vc'
import Constants from 'expo-constants'
import WalletModal from '@/components/WalletModal';
import SaveCredentialView from '@/components/SaveVC';
import PresentationRequest from '@/components/PresentationRequest';

const chainNameOrId = "sepolia"
const RPC_URL = `https://rpc.ankr.com/eth_sepolia/${Constants.expoConfig?.extra?.ANKR_API_KEY}`
const registry = "0x03d5003bf0e79C5F5223588F347ebA39AfbC3818"

enum QRCodeType {
    VerifierChallenge = "VerifierChallenge",
    createVC = "createVC",
}

export default function ScanScreen() {
    const tabBarHeight = useBottomTabBarHeight();
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [vc, setVC] = useState({});
    const [vcJwt, setVCJwt] = useState("");
    const hasScannerRegistered = useRef(false);

    const createVC = async (nonce: string) => {
        if (nonce) {
            const url = `http://4.231.235.89:8000/present-did`;
            const ethrdid = await getEthrDID();

            try {

                axios.post(url, { nonce: nonce, did: ethrdid.did, data: {} }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then(async response => {
                        const vc = response.data.vc;
                        const didResolver = new Resolver(getResolver({ rpcUrl: RPC_URL, name: chainNameOrId, chainId: 11155111, registry }));
                        const verifiedVC = await verifyCredential(vc, didResolver);
                        setVCJwt(vc);
                        setVC(verifiedVC.verifiableCredential);
                    })
                    .catch(error => {
                        console.error('Error sending nonce:', error);
                    });
            } catch (error) {
                console.error("Error getting EthrDID", error);

            }

        }

    }

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
            const parsedData = JSON.parse(data.data);
            setScannedData(parsedData);


            switch (parsedData.type) {
                case QRCodeType.VerifierChallenge:
                    console.log("VerifierChallenge QR code scanned");
                    setVC(parsedData);
                    break;
                case QRCodeType.createVC:
                    console.log("createVC QR code scanned");
                    const nonce = parsedData.nonce;
                    await createVC(nonce);
                    break;
                default:
                    console.log("Unknown QR code scanned", parsedData.type);
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
        setScannedData(null);
        setVC({});
        setVCJwt("");
    }

    const handleSaveVC = async () => {

        await saveVC(vc, vc.issuer.id, vcJwt);

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

            </View >
            <WalletModal
                modalVisible={modalVisible}
                handleModalClose={handleModalClose}
                modalTitle={scannedData?.type === QRCodeType.createVC ? "Save Credential" : "Presentation Request"}
            >
                {
                    scannedData?.type === QRCodeType.createVC &&
                    <SaveCredentialView
                        onSave={handleSaveVC}
                        onCancel={handleModalClose}
                        credential={vc}
                    />
                }
                {
                    scannedData?.type === QRCodeType.VerifierChallenge &&
                    <PresentationRequest
                        closeOuterModal={handleModalClose}
                        presentationRequest={scannedData}
                    />
                }
            </WalletModal>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 10,
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

    text: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 10,
    },
})