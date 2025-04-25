import { Text, StyleSheet, ScrollView, View, Alert } from 'react-native';
import Button from './Button';
import TextBox from './TextBox';
import { SymbolView } from 'expo-symbols';

interface CredentialViewProps {
    vc: any,
    filePath?: string,
    onClose: () => void,
    deleteVC?: (filePath: string) => Promise<void>;
}

export default function CredentialView({ vc, filePath, onClose, deleteVC }: CredentialViewProps) {

    const handleDelete = async () => {
        // Handle delete logic here
        Alert.alert('Delete Confirmation', 'Are you sure you want to delete this credential?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'OK',
                style: 'destructive',
                onPress: async () => {
                    if (deleteVC) {
                        await deleteVC(filePath!);
                    }
                    onClose();
                }
            }
        ]);
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollView}>
            {vc &&
                Object.entries(vc).map(([key, value], index) => (
                    <TextBox
                        key={index}
                        title={key}
                        content={value!}
                    ></TextBox>
                ))}
            <View style={styles.buttons}>
                <Button title="Close" type="secondary" onPress={onClose}>
                    <SymbolView name='clear' tintColor={"white"} size={25}></SymbolView>
                </Button>
                {deleteVC &&
                    <Button
                        title="Delete"
                        type="destructive"
                        onPress={() => handleDelete()}
                    >
                        <SymbolView name='trash' tintColor={"red"} size={25}></SymbolView>
                    </Button>}
            </View>
        </ScrollView>)
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginBottom: 20,
        gap: 10,
    },
    scrollView: {
        flexGrow: 1,
        gap: 10,
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    }
})