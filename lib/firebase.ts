import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||"AIzaSyB6ICqxOMNnSUiqXLYY92YGZtWLRK7vWGM",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||"todoapp-45f45.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||"todoapp-45f45",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||"todoapp-45f45.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||"266285049783",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||"1:266285049783:web:7875db1ad6657e8adbaa32",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ||"G-B2LNC5FDH0"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth: Auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch {
    return getAuth(app);
  }
})();

const db = getFirestore(app);

export { auth, db };
