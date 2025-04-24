import { Modal, ScrollView, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import ModalHeader from './ModalHeader';
import { useState } from 'react';

interface ModalProps {
    modalVisible: boolean;
    handleModalClose: () => void;
    modalTitle?: string;
    children?: React.ReactNode;
}

export default function WalletModal({ modalVisible, handleModalClose, modalTitle, children }: ModalProps) {
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
                        title={modalTitle}
                    />
                    <ScrollView
                        contentContainerStyle={{ padding: 10 }}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {children}
                    </ScrollView>
                </Animated.View>
            </BlurView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        borderRadius: 10,
        backgroundColor: '#222',
        marginTop: 50,
    },
})