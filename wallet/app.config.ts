import { ExpoConfig, ConfigContext } from "expo/config";
import { config } from "dotenv"

const parsed = config({ path: "./.env.api" })

if (!parsed) {
    console.error("Could not read .env.api (create it, check README)");
} else {
    console.log("Read .env.api successfully")
}


export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    "name": "Wallet",
    "slug": "Wallet",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/AppIcon~ios-marketing.png",
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
        ],
        [
            "expo-splash-screen",
            {
                "backgroundColor": "#333",
                "image": "./assets/images/AppIcon~ios-marketing.png",
                "imageWidth": 200,
            }
        ]
    ],
    "experiments": {
        "typedRoutes": true
    },
    extra: {
        ANKR_API_KEY: process.env.ANKR_API_KEY,
    },
});