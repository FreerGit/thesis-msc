import { Text, StyleSheet, ScrollView } from "react-native"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"

export default function HomeScreen() {
    const tabBarHeight = useBottomTabBarHeight()

    return (
        <ScrollView
            style={[styles.container, { paddingBottom: tabBarHeight }]}
            contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
        >
            <Text style={styles.text}>Home</Text>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },

    text: {
        marginTop: 80,
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    }
})