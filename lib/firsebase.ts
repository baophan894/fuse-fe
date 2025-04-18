// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBLwu6QBXhNzvf0B5aYvOa2hKk-FuPuq4M",
  authDomain: "fuse-387ee.firebaseapp.com",
  projectId: "fuse-387ee",
  storageBucket: "fuse-387ee.firebasestorage.app",
  messagingSenderId: "268316893486",
  appId: "1:268316893486:web:c2e1a21e44d49668c21abf",
  measurementId: "G-ZE2ZHCN195"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let messaging: ReturnType<typeof getMessaging> | null = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    } else {
      console.warn('Firebase messaging is not supported on this browser.');
    }
  });
}

export { app, messaging };