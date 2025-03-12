import { View, Text, StyleSheet, Button } from "react-native";
import ImportModal from "../components/ImportModal";
import { useState } from "react";
import * as Solana from "../utils/solanaWallet";

interface SolanaWalletScreenProps {
  setWalletExists: (exists: boolean) => void;
}

export default function SolanaWalletScreen({
  setWalletExists,
}: SolanaWalletScreenProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");

  const storeNewSolanaKey = async () => {
    const key = await Solana.generatePrivateKey();
    if (key) {
      await Solana.saveKeypair(key);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <View style={styles.buttons}>
        <Button
          title="Import Solana Key"
          onPress={() => setModalVisible(true)}
        ></Button>
        <Button
          title="Create new Solana wallet"
          onPress={() => storeNewSolanaKey()}
        ></Button>
      </View>

      {modalVisible && (
        <ImportModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          text={text}
          setText={setText}
          setWalletExists={setWalletExists}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },

  text: {
    marginTop: 80,
    fontSize: 50,
    // color: '#fff',
    fontWeight: "bold",
  },

  buttons: {
    display: "flex",
    flexDirection: "row",
  },
});
