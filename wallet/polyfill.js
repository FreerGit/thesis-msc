// import 'react-native-get-random-values';
import { getRandomValues } from 'expo-crypto';

// First check if crypto already exists
if (typeof global.crypto !== 'object') {
    global.crypto = {};
}

if (typeof global.crypto.getRandomValues !== 'function') {
    global.crypto.getRandomValues = function (arr) {
        return getRandomValues(arr);
    };
}

// // Fix for @solana/web3.js which looks for window.crypto
// if (typeof window === 'object' && !window.crypto) {
//     window.crypto = global.crypto;
// }

// // Required to prevent a common error with @solana/web3.js
// global.Buffer = global.Buffer || require('buffer').Buffer;
