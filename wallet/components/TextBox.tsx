import { Text, View, StyleSheet } from "react-native"

interface TextBoxProps {
    title: string;
    content: Record<string, any>;
}

export default function TextBox({ title, content }: TextBoxProps) {

    return (
        <View style={[styles.container]}>
            <Text style={[styles.title]}>{title}</Text>
            <Text style={[styles.content]}>
                {JSON.stringify(content, null, 2)}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: "rgba(144, 144, 144, 0.2)",
        padding: 10,
        gap: 5,
    },

    title: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },

    content: {
        color: "white",
    },
})