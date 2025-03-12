import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import SolanaWalletScreen from "./SolanaWallet";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../redux/store";
import { setWalletExists } from "../redux/walletSlice";

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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  ) : (
    <SolanaWalletScreen />
  );
}
