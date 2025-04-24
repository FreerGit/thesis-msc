import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';
import TextBox from './TextBox';

interface SaveCredentialViewProps {
    onSave: () => void;
    onCancel: () => void;
    credential: Record<string, any>;
}

export default function SaveCredentialView({ onSave, onCancel, credential }: SaveCredentialViewProps) {

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 }}>
                Credential received
            </Text>
            <View style={styles.keyValueView}>
                {
                    Object.entries(credential).map(([key, value]) => (
                        <TextBox
                            key={key}
                            title={key}
                            content={value}
                        />
                    ))
                }
            </View>
            <View style={styles.buttons}>
                <Button
                    title="Cancel"
                    onPress={() => onCancel()}
                >
                </Button>
                <Button
                    title="Save"
                    onPress={() => onSave()}
                >
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 10,
        marginBottom: 20,
    },

    keyValueView: {
        flex: 1,
        flexDirection: 'column',
        gap: 10,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 20,
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        width: '100%',
        gap: 20,
    },
});