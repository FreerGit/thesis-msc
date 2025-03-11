import { StyleSheet, View, Text } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

export default function ScanScreen() {
    // const onSuccess = (e) => {
    //     console.log(e)
    // }

    return (
        // <QRCodeScanner
        //     onRead={onSuccess}
        //     flashMode={RNCamera.Constants.FlashMode.torch}
        // />
        <View style={styles.container}>
            <Text style={styles.text}>Scan</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },

    text: {
        fontSize: 36,
        color: '#fff',
    }
})