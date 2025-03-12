import { View, Text, StyleSheet } from "react-native";


export default function WalletScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Wallet</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'black',
    },

    text: {
        marginTop: 60,
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    },
})

