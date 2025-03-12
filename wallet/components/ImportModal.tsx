import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Modal
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
            visible={modalVisible}
            animationType="slide"
        >
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
        </Modal >
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginTop: 100,
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