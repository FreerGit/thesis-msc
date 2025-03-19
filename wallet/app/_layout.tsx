import "react-native-get-random-values"
import 'react-native-reanimated'
import 'react-native-gesture-handler'
import { Stack } from "expo-router";
import SolanaWalletScreen from "./SolanaWallet";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../redux/store";
import { setIsAuthenticated, setWalletExists } from "../redux/walletSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from "expo-linear-gradient";
import LogInScreen from "./LogInScreen";


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
  const isAuthenticated = useSelector((state: RootState) => state.wallet.isAuthenticated);
  const insets = useSafeAreaInsets();

  const authenticateUser = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (hasHardware) {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate to continue",
          fallbackLabel: "Enter your passcode"
        });
        if (result.success) {
          dispatch(setIsAuthenticated(true));
        } else {
          dispatch(setIsAuthenticated(false));
        }
      }
    }
  }

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
    <LinearGradient
      colors={["#000000", "#333", "#333", "#000000"]}
      start={[0, 0.2]}
      style={{ flex: 1 }}
    >
      <GestureHandlerRootView style={{ flex: 1, paddingTop: insets.top }}>
        {isAuthenticated ? (
          <Stack screenOptions={{ headerShown: false, contentStyle: { flex: 1 } }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        ) : (
          <LogInScreen authenticateUser={authenticateUser} />
        )
        }
      </GestureHandlerRootView >
    </LinearGradient>
  ) : (
    <SolanaWalletScreen />
  );
}
