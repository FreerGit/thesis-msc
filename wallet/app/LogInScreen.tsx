import { View, Text, Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols"
import Button from "@/components/Button";

// interface LogInScreenProps {
//     authenticateUser: () => void;
// }
// { authenticateUser }: LogInScreenProps

export default function LogInScreen() {

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <SymbolView tintColor="white" name="wallet.bifold.fill" size={50} />
                <Text style={{ fontSize: 50, fontWeight: "bold", color: "white" }}>Wallet</Text>
            </View>
            {/* <Button
    title="Unlock"
    onPress={authenticateUser}
    size="large"
>
            <SymbolView tintColor="white" name="lock.open.fill" size={30} />
            </Button> */}
        </View >
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: "gray",
        padding: 10,
        borderRadius: 5
    }
})