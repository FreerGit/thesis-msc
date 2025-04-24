import { Image } from 'expo-image';
import { ScrollView, Text, Modal, StyleSheet, View, Animated } from 'react-native';
import ModalHeader from './ModalHeader';
import { PanGestureHandler, Gesture, State } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';

interface VcModalProps {
    vc: any;
    modalVisible: boolean;
    closeModal: () => void;
}

export default function VcModal({ vc, modalVisible, closeModal }: VcModalProps) {
    const [blurIntensity, setBlurIntensity] = useState(0);
    const [backgroundBlur, setBackgroundBlur] = useState(0);

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
            <BlurView
                intensity={backgroundBlur}
                tint='dark'
                style={{ flex: 1 }}
            >
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            flex: 1,
                            transform: [{ translateY }],
                        }
                    ]}
                >
                    <ModalHeader
                        closeModal={closeModal}
                        translateY={translateY}
                        blurIntensity={blurIntensity}
                        setModalBackgroundBlur={setBackgroundBlur}
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
                                        {vc?.credentialSubject.name}
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {vc?.issuer.name}
                                    </Text>
                                </View>
                            </View>
                            {vc &&
                                <View style={styles.textBodyView}>
                                    {Object.entries(vc).map(([key, value], index) => {
                                        return (
                                            <View key={index} style={styles.keyValueView}>
                                                <Text style={styles.keyText}>
                                                    {key}: {" "}
                                                </Text>
                                                <Text style={styles.modalText}>
                                                    {JSON.stringify(value, null, 2)}
                                                </Text>
                                            </View>

                                        );
                                    })}
                                </View>
                            }
                        </View>
                    </ScrollView>
                </Animated.View>
            </BlurView>

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
        width: '100%',
        padding: 10,
        gap: 15,
    },

    textBodyView: {
        flex: 1,
        flexDirection: 'column',
        gap: 5,
    },

    keyValueView: {
        gap: 5,
        backgroundColor: "rgba(144, 144, 144, 0.1)",
        padding: 10,
        borderRadius: 10,
    },

    keyText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },

    modalText: {
        flexWrap: 'wrap',
        fontSize: 16,
        color: '#fff',
        // fontWeight: 'bold',
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