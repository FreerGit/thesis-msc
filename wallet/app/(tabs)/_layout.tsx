import { Tabs } from "expo-router"
import { BlurView } from "expo-blur"
import { SymbolView } from "expo-symbols"
import { StyleSheet } from "react-native"

export default function RootLayout() {

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                },
                tabBarBackground: () => <BlurView tint="light" intensity={100} style={{ flex: 1 }} />,
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#8a8a8a',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                },
            }} >
            <Tabs.Screen name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <SymbolView tintColor={color} name="house.fill" size={24} />,
                }}
            />
            <Tabs.Screen name="scan"
                options={{
                    title: 'Scan',
                    tabBarIcon: ({ color }) => <SymbolView tintColor={color} name="qrcode.viewfinder" size={24} />,
                }}
            />
            <Tabs.Screen name="wallet"
                options={{
                    title: 'Wallet',
                    tabBarIcon: ({ color }) => <SymbolView tintColor={color} name="wallet.bifold.fill" size={24} />,
                }}
            />
            < Tabs.Screen name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <SymbolView tintColor={color} name="person.fill" size={24} />,
                }}
            />
        </ Tabs >
    )
}

const styles = StyleSheet.create({

    icon: {
        color: '#fff',
    }

})