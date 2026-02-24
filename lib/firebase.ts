import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB6ICqxOMNnSUiqXLYY92YGZtWLRK7vWGM",
  authDomain: "todoapp-45f45.firebaseapp.com",
  projectId: "todoapp-45f45",
  storageBucket: "todoapp-45f45.firebasestorage.app",
  messagingSenderId: "266285049783",
  appId: "1:266285049783:web:7875db1ad6657e8adbaa32",
  measurementId: "G-B2LNC5FDH0"
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
