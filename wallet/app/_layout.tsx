import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import SolanaWalletScreen from "./SolanaWallet";
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from "react";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [walletExists, setWalletExists] = useState(false);

  useEffect(() => {
    const checkWallet = async () => {
      try {
        SecureStore.getItemAsync('solanaKey').then((key) => {
          setWalletExists(key !== null);
        })
      } catch (error) {
        console.error(error);
        setWalletExists(false);
      } finally {
        setLoading(false);
      }
    }
    checkWallet();
  }
    , []
  )

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }


  return (
    walletExists ? (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack >
    ) : (
      < SolanaWalletScreen setWalletExists={setWalletExists} />
    )
  )
}
