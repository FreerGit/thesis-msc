import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Animated, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

interface ModalHeaderProps {
    closeModal: () => void,
    translateY: Animated.Value,
    blurIntensity: number,
    setModalBackgroundBlur?: (intensity: number) => void,
    title?: string,
}

export default function ModalHeader({ closeModal, translateY, blurIntensity, setModalBackgroundBlur, title }: ModalHeaderProps) {
    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: false }
    )

    const windowHeight = Dimensions.get('window').height;

    const onHandlerStateChange = ({ nativeEvent }: any) => {
        if (nativeEvent.state === State.END) {
            if (nativeEvent.translationY >= windowHeight / 3) {
                if (setModalBackgroundBlur) {
                    setModalBackgroundBlur(0)
                }
                closeModal();
            } else {
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: false,
                }).start()
            }
        }
    }

    translateY.addListener(({ value }) => {
        if (setModalBackgroundBlur) {
            const intensity = 100 - value / 5;
            setModalBackgroundBlur(intensity);
        }
    });

    return (
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
            <BlurView
                style={[styles.modalHeader, {
                    borderBottomWidth: blurIntensity > 0 ? 1 : 0,
                    borderBottomColor: 'rgba(255, 255, 255, 0.5)'

                }]}
                intensity={blurIntensity}
                tint='dark'
            >
                <Text style={[styles.modalTitle, { textAlign: 'center' }]}>{title ?? "VC Details"}</Text>
                <View style={styles.closeButton}>
                    <Button
                        title='Close'
                        onPress={() => closeModal()}
                    ></Button>
                </View>
            </BlurView>
        </PanGestureHandler >
    )
}

const styles = StyleSheet.create({

    modalHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderStartStartRadius: 10,
        borderStartEndRadius: 10,
        padding: 10,
        overflow: 'hidden',
    },

    modalTitle: {
        flex: 1,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
        justifyContent: 'center',
    },

    closeButton: {
        position: 'absolute',
        right: 10,
    },
});