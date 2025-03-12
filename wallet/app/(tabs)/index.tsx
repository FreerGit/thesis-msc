import { Text, StyleSheet, ScrollView } from "react-native"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useEffect } from "react"

export default function HomeScreen() {
    const tabBarHeight = useBottomTabBarHeight()

    return (
        <ScrollView
            style={[styles.container, { paddingBottom: tabBarHeight }]}
            contentContainerStyle={{ flexGrow: 1, padding: 20 }}
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
        marginTop: 60,
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    }
})