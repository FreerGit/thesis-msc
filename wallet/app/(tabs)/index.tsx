import { Text, StyleSheet, ScrollView } from "react-native"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useEffect } from "react"
import { LinearGradient } from "expo-linear-gradient"

export default function HomeScreen() {
    const tabBarHeight = useBottomTabBarHeight()

    return (
        <LinearGradient colors={["#000000", "#333", "#333", "#000000"]} style={styles.container}>
            <ScrollView
                style={[styles.container, { paddingBottom: tabBarHeight }]}
                contentContainerStyle={{ flexGrow: 1, padding: 20 }}
            >
                <Text style={styles.text}>Home</Text>
            </ScrollView >

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    text: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    }
})