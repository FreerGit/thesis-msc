import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    "name": "Wallet",
    "slug": "Wallet",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
        "supportsTablet": true,
        "infoPlist": {
            "NSCameraUsageDescription": "This app uses the camera to scan QR codes",
            "NSFaceIDUsageDescription": "This app uses Face ID to authenticate you",
        },
        "config": {
            "usesNonExemptEncryption": false
        }
    },
    "android": {
        "adaptiveIcon": {
            "foregroundImage": "./assets/images/adaptive-icon.png",
            "backgroundColor": "#ffffff"
        }
    },
    "web": {
        "bundler": "metro",
        "output": "static",
        "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
        "expo-router",
        [
            "expo-splash-screen",
            {
                "image": "./assets/images/splash-icon.png",
                "imageWidth": 200,
                "resizeMode": "contain",
                "backgroundColor": "#ffffff"
            }
        ],
        [
            "expo-camera",
            {
                "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
                "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
                "recordAudioAndroid": true
            }
        ],
        [
            "expo-secure-store"
        ],
        [
            "expo-local-authentication",
            {
                "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID."
            }
        ]
    ],
    "experiments": {
        "typedRoutes": true
    }
});