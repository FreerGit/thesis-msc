import { Text, Pressable, StyleSheet } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    title: string;
    size?: "small" | "medium" | "large";
    children?: any;
}

export default function Button({ onPress, title, size, children }: ButtonProps) {


    const textStyles = {
        small: styles.textSmall,
        medium: styles.textMedium,
        large: styles.textLarge,
    }

    return (
        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1 },
                styles.button,
            ]
            }
            onPress={onPress}
        >
            {children}
            <Text style={textStyles[size || "medium"]}>{title}</Text>
        </Pressable >
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        backgroundColor: "rgba(144, 144, 144, 0.1)",
        padding: 10,
        borderRadius: 5,
    },

    textLarge: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
    },


    textMedium: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },


    textSmall: {
        fontSize: 10,
        fontWeight: "bold",
        color: "white",
    }
})