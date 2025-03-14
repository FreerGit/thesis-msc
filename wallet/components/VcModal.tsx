import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { ScrollView, Text, Button, Modal, StyleSheet, View } from 'react-native';


interface VcModalProps {
    vc: any,
    modalVisible: boolean,
    closeModal: () => void,
}

export default function VcModal({ vc, modalVisible, closeModal }: VcModalProps) {
    const blurhash =
        '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
        >
            <BlurView
                intensity={20}
                tint="light"
                style={{ flex: 1 }}
            >
                {
                    vc &&
                    <ScrollView
                        style={styles.modalContainer}
                        contentContainerStyle={styles.modalContentContainer}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Image
                                style={styles.image}
                                source={vc.issuer.imgUrl}
                                placeholder={{ blurhash }}
                                contentFit="cover"
                                transition={1000}
                            ></Image>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: "space-between" }}>
                                <Text style={styles.vcTitle}>
                                    {vc.credentialSubject.title}
                                </Text>
                                <Text style={styles.modalText}>
                                    {vc.issuer.name}
                                </Text>

                            </View>
                        </View>
                        <Button
                            title="Close"
                            onPress={() => closeModal()}
                        ></Button>
                        {
                            Object.entries(vc).map(([key, value], index) => {
                                return (
                                    <Text key={index} style={styles.modalText}>
                                        <Text style={{ fontWeight: "bold" }}>
                                            {key}: {" "}
                                        </Text>
                                        {JSON.stringify(value, null, 2)}
                                    </Text>
                                )
                            })
                        }
                    </ScrollView>
                }
            </BlurView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        borderRadius: 10,
        marginTop: 50,
        backgroundColor: '#333',
        padding: 20,
    },

    modalContentContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        flexGrow: 1,
        alignItems: 'center',
    },

    modalText: {
        flexWrap: 'wrap',
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },

    vcTitle: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
        flexWrap: 'wrap',
    },

    image: {
        flex: 1,
        minHeight: 100,
        maxHeight: 100,
        minWidth: 100,
        maxWidth: 100,
        borderRadius: 10,
    },
})