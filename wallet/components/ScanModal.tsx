import { Modal, ScrollView, Text, View, StyleSheet, Animated } from 'react-native';
import Button from './Button';
import { BlurView } from 'expo-blur';
import ModalHeader from './ModalHeader';
import { useState } from 'react';

interface ScanModalProps {
    modalVisible: boolean;
    vc: any;
    handleModalClose: () => void;
    handleSaveVC: () => void;
}

export default function ScanModal({ modalVisible, vc, handleModalClose, handleSaveVC }: ScanModalProps) {
    const [blurIntensity, setBlurIntensity] = useState(0);
    const [backgroundBlur, setBackgroundBlur] = useState(0);
    const translateY = new Animated.Value(0);

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
                        closeModal={handleModalClose}
                        translateY={translateY}
                        blurIntensity={blurIntensity}
                        setModalBackgroundBlur={setBackgroundBlur}
                        title="Scan Result"
                    />
                    <ScrollView
                        contentContainerStyle={{ padding: 10 }}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        <Text style={{ color: "white" }}>
                            {JSON.stringify(vc, null, 2)}
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
                    </ScrollView>
                </Animated.View>
            </BlurView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        borderRadius: 10,
        backgroundColor: '#333',
        marginTop: 50,
    },

    modalContentContainer: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        backgroundColor: '#333'
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 10,
    },
})