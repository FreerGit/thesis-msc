import { Image } from 'expo-image';
import { ScrollView, Text, Modal, StyleSheet, View, Animated } from 'react-native';
import ModalHeader from './ModalHeader';
import { PanGestureHandler, Gesture, State } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';

interface VcModalProps {
    vc: any;
    modalVisible: boolean;
    closeModal: () => void;
}

export default function VcModal({ vc, modalVisible, closeModal }: VcModalProps) {
    const [blurIntensity, setBlurIntensity] = useState(0);

    const translateY = new Animated.Value(0);
    const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        const intensity = scrollY * 100;
        setBlurIntensity(intensity);
    }

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
        >
            <Animated.View
                style={[
                    styles.modalContainer,
                    {
                        flex: 1,
                        transform: [{ translateY }]
                    }
                ]}
            >
                <ModalHeader
                    closeModal={closeModal}
                    translateY={translateY}
                    blurIntensity={blurIntensity}
                >
                </ModalHeader>
                <ScrollView
                    style={{ padding: 10 }}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <View style={styles.modalContentContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Image
                                style={styles.image}
                                source={vc?.issuer.imgUrl}
                                placeholder={{ blurhash }}
                                contentFit="cover"
                                transition={1000}
                            />
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: "space-between" }}>
                                <Text style={styles.vcTitle}>
                                    {vc?.credentialSubject.title}
                                </Text>
                                <Text style={styles.modalText}>
                                    {vc?.issuer.name}
                                </Text>
                            </View>
                        </View>
                        {vc &&
                            Object.entries(vc).map(([key, value], index) => {
                                return (
                                    <Text key={index} style={styles.modalText}>
                                        <Text style={{ fontWeight: "bold" }}>
                                            {key}: {" "}
                                        </Text>
                                        {JSON.stringify(value, null, 2)}
                                    </Text>
                                );
                            })
                        }
                    </View>
                </ScrollView>
            </Animated.View>
        </Modal >
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#333',
        borderRadius: 10,
        marginTop: 50,
    },

    modalContentContainer: {
        alignItems: 'center',
        width: '100%',
        padding: 10,
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
});