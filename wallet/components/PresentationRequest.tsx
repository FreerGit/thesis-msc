import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from './Button';
import { useEffect, useState } from 'react';

interface PresentationRequestProps {
    onAccept: () => void;
    onDecline: () => void;
    presentationRequest?: any;
}

export default function PresentationRequest({ onAccept, onDecline, presentationRequest }: PresentationRequestProps) {
    const [constrains, setConstrains] = useState<any[]>([]);

    useEffect(() => {
        console.log("Presentation Request: ", JSON.stringify(presentationRequest, null, 2));

        if (presentationRequest) {
            presentationRequest?.presentation_definition?.input_descriptors.forEach((i: any) => {
                const constraints = i.constraints?.fields?.map((descriptor: any) => {
                    return {
                        pattern: descriptor?.filter?.pattern,
                        constraints: descriptor?.constraints?.fields
                    }
                });
                setConstrains(prev => [...prev, ...constraints]);
            })
        }

    }, [presentationRequest])



    return (
        <ScrollView style={styles.container} contentContainerStyle={{ gap: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
                {presentationRequest?.domain} is asking for credentials with the following data:
            </Text>

            <View style={styles.dataView}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
                    {JSON.stringify(constrains, null, 2)}
                </Text>
            </View>

            <View style={styles.buttons}>
                <Button
                    title="Decline"
                    onPress={onDecline}
                />
                <Button
                    title="Accept"
                    onPress={onAccept}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 10,
        marginBottom: 20,
    },

    dataView: {
        flex: 1,
        gap: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#333',
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    }

})