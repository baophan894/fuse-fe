// // Import the functions you need from the SDKs you need
// import { getApps, initializeApp } from "firebase/app";
// import { getAnalytics, isSupported } from "firebase/analytics";
// import { getMessaging, getToken } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!


// };

// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// let messaging: ReturnType<typeof getMessaging> | null = null;

// if (typeof window !== 'undefined') {
//   isSupported().then((supported) => {
//     if (supported) {
//       messaging = getMessaging(app);
//     } else {
//       console.warn('Firebase messaging is not supported on this browser.');
//     }
//   });
// }

// export { app, messaging };