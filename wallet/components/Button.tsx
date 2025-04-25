import { Text, Pressable, StyleSheet } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    title: string;
    size?: "small" | "medium" | "large";
    children?: any;
    type?: "primary" | "secondary" | "destructive";
}

export default function Button({ onPress, title, size = "medium", type = "primary", children }: ButtonProps) {


    const textStyles = {
        small: styles.textSmall,
        medium: styles.textMedium,
        large: styles.textLarge,
    }

    const textColors = {
        primary: styles.textPrimary,
        secondary: styles.textSecondary,
        destructive: styles.textDestructive,
    }

    const buttonStyles = {
        primary: styles.buttonPrimary,
        secondary: styles.buttonSecondary,
        destructive: styles.buttonDestructive,
    }

    return (
        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1 },
                styles.button
            ]}
            onPress={onPress}
        >
            <Text style={[textStyles[size], textColors[type]]}>{title}</Text>
            {children}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        backgroundColor: "rgba(144, 144, 144, 0.1)",
        borderRadius: 5,
        padding: 10,
        minWidth: 100,
        maxWidth: 300,
    },

    buttonPrimary: {
        backgroundColor: "rgba(144, 144, 144, 0.1)",
        borderRadius: 5,
        padding: 10,
        minWidth: 100,
        maxWidth: 300,
    },

    buttonSecondary: {
        backgroundColor: "rgba(144, 144, 144, 0.1)",
        borderRadius: 5,
        padding: 10,
        minWidth: 100,
        maxWidth: 300,
    },

    buttonDestructive: {
        backgroundColor: "rgba(144, 144, 144, 0.1)",
        borderRadius: 5,
        padding: 10,
        minWidth: 100,
        maxWidth: 300,
        color: "red"
    },

    textPrimary: {
        color: "#007AFF",
    },

    textSecondary: {
        color: "white",
    },

    textDestructive: {
        color: "red",
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