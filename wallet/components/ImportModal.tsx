import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    TouchableWithoutFeedback
} from "react-native";
import { setWalletExists } from '../redux/walletSlice';
import * as SecureStore from 'expo-secure-store';

interface ImportModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    text: string;
    setText: (text: string) => void;
}

export default function ImportModal({ modalVisible, setModalVisible, text, setText }: ImportModalProps) {

    const setSolanaKey = async () => {
        try {
            await SecureStore.setItemAsync('solanaKey', text);
            setWalletExists(true);
        } catch (error) {
            console.error(error);
        }
        setModalVisible(false);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalBackground}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Import Solana key</Text>
                            <TextInput
                                placeholder="Enter your Solana key"
                                value={text}
                                onChangeText={setText}
                                style={{
                                    borderBottomWidth: 1,
                                    color: 'black',
                                }}
                            />
                            <Button
                                title="Import"
                                onPress={() => setSolanaKey()}
                            />

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    modalContainer: {
        width: '90%',
        maxHeight: 200,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        flex: 1,
        justifyContent: "space-between"
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    buttons: {
        display: 'flex',
        flexDirection: 'row',
    }

})