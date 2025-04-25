import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from './Button';
import { useEffect, useState } from 'react';
import { findAllVCsByPresentationRequest } from '@/utils/vcFileSystem';
import VcCard from './VcCard';
import WalletModal from './WalletModal';
import CredentialView from './CredentialView';
import { SymbolView } from 'expo-symbols';
import { fetchKeypair, getEthrDID } from '@/utils/ethWallet';
import { createVerifiablePresentationJwt } from 'did-jwt-vc';
import { decodeJWT } from 'did-jwt';
import axios from 'axios';

interface PresentationRequestProps {
    closeOuterModal: () => void;
    presentationRequest?: any;
}

export default function PresentationRequest({ closeOuterModal, presentationRequest }: PresentationRequestProps) {
    const [constraints, setConstraints] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [vcs, setVCs] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVc, setSelectedVc] = useState<any | null>(null);

    useEffect(() => {
        console.log('Presentation Request:', JSON.stringify(presentationRequest, null, 2));
        const parseRequest = async () => {
            if (presentationRequest) {
                const newConstraints: any[] = [];
                presentationRequest?.presentation_definition?.input_descriptors.forEach((i: any) => {
                    const constraints = i.constraints?.fields?.map((field: any) => {
                        return {
                            pattern: field?.filter?.pattern,
                            path: field?.path
                        }
                    });
                    newConstraints.push(...constraints);
                });
                setConstraints(newConstraints);

                if (newConstraints.length > 0) {
                    const vcs = await findAllVCsByPresentationRequest(newConstraints);
                    setVCs(vcs!);
                }
            }
        }

        parseRequest();
        setIsLoading(false);
    }, [presentationRequest])

    const closeModal = () => {
        setModalVisible(false);
        setSelectedVc(null);
    }

    const sendPresentation = async () => {
        if (vcs.length === 0) {
            closeOuterModal();
            return;
        }

        const did = await getEthrDID();

        const vpPayload = {
            "vp": {

                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                ],
                "type": [
                    "VerifiablePresentation",
                    "ExamplePresentation",
                ],
                "verifiableCredential": vcs.map((vc) => {
                    return vc.vcJwt;
                }),
            },
            "nonce": presentationRequest?.challenge,
        }

        const holder = {
            did: did.did,
            signer: did.signer!,
            alg: 'ES256K-R'
        }

        const vpJwt = await createVerifiablePresentationJwt(vpPayload, holder);

        console.log('\n✅ Verifiable Presentation JWT:');
        console.log(vpJwt);
        console.log(JSON.stringify(decodeJWT(vpJwt).payload, null, 3));

        const endpoint = presentationRequest?.endpoint.replace("recieve", "receive");

        await axios.post(endpoint, {
            vp: vpJwt,
            challenge: presentationRequest?.challenge,
        }, {
            headers: {
                "Content-Type": "application/json",

            },
            timeout: 5000,
        },
        ).then((response) => {
            console.log("Presentation sent successfully:", response.data);
        }
        ).catch((error) => {
            console.error("Error sending presentation:", error);
        });

        closeOuterModal();
    }


    return (
        <ScrollView style={styles.container} contentContainerStyle={{ gap: 10 }}>
            {
                !isLoading &&
                <View style={styles.dataView}>

                    {vcs.length > 0 ? (
                        <>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>{presentationRequest.domain} is requesting the following credentials:</Text>
                            {vcs.map((vc, index) => (
                                <VcCard
                                    key={index}
                                    title={vc.title}
                                    vc={vc.vc}
                                    filePath={vc.path}
                                    onVcPress={() => {
                                        setSelectedVc(vc);
                                        setModalVisible(true);
                                    }}
                                ></VcCard>
                            ))}
                            <View style={styles.buttons}>
                                <Button
                                    title="Cancel"
                                    type="secondary"
                                    onPress={closeOuterModal}
                                >
                                    <SymbolView name='clear' tintColor={"white"} size={25}></SymbolView>
                                </Button>
                                <Button
                                    title="Send"
                                    type="primary"
                                    onPress={sendPresentation}
                                >
                                    <SymbolView name='paperplane' tintColor={"#007AFF"} size={25}></SymbolView>
                                </Button>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: "bold" }}>No matching credentials available.</Text>
                            <Text style={{ color: '#fff' }}>
                                You have no credentials matching the requested data from the verifier {presentationRequest.domain}.
                                Please visit the verifier's website to see which credentials are available and where they can be issued.
                            </Text>

                            <Button
                                title="Cancel"
                                type="secondary"
                                onPress={closeOuterModal}
                            >
                                <SymbolView name='clear' tintColor={"white"} size={25}></SymbolView>
                            </Button>
                        </>
                    )}

                    <WalletModal
                        modalVisible={modalVisible}
                        handleModalClose={closeModal}
                        modalTitle="Credential"
                    >
                        <CredentialView
                            vc={selectedVc?.vc}
                            filePath={selectedVc?.path ?? ""}
                            onClose={closeModal}
                        />
                    </WalletModal>


                </View>

            }
        </ScrollView >
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 10,
        marginBottom: 20,
    },

    dataView: {
        flex: 1,
        gap: 10,
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    }

})