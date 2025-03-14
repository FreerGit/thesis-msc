import "react-native-get-random-values"
import 'react-native-reanimated'
import 'react-native-gesture-handler'
import { Stack } from "expo-router";
import SolanaWalletScreen from "./SolanaWallet";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { RootState, store } from "../redux/store";
import { setWalletExists } from "../redux/walletSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayoutWrapper() {
  return (
    <Provider store={store}>
      <RootLayout />
    </Provider>
  );
}

function RootLayout() {
  const dispatch = useDispatch();
  const walletExists = useSelector((state: RootState) => state.wallet.walletExists);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const checkWallet = async () => {
      try {
        const key = await SecureStore.getItemAsync("solanaKey");
        dispatch(setWalletExists(key !== null));
      } catch (error) {
        console.error(error);
        dispatch(setWalletExists(false));
      }
    };

    checkWallet();
  }, [dispatch]);

  return walletExists ? (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "black", paddingTop: insets.top }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { flex: 1 } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView >
  ) : (
    <SolanaWalletScreen />
  );
}
