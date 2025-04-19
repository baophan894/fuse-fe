// import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
// import { initializeApp } from 'firebase/app';


// import { toast } from 'sonner';
// import { app } from './firsebase';
// // Đảm bảo bạn đã export messaging đúng cách

// const VAPID_KEY = 'BG_agOnVt0wmKGzEd08bZ1gz3d-h8SCPmA02ZshuvWF69SBijd_Dh8w-5dYTS2_CoDK2fLmiKDhfZhr3h7pYUMY'; // 🔁 Thay bằng VAPID key của bạn

// let messaging: ReturnType<typeof getMessaging> | null = null;

// if (typeof window !== 'undefined') {
//   isSupported().then((supported) => {
//     if (supported) {
//       messaging = getMessaging(app);
//     } else {
//       console.warn('❌ Firebase messaging is not supported on this browser.');
//     }
//   });
// }

// export const requestFirebaseToken = async (): Promise<string | null> => {
//   if (typeof window === 'undefined' || !messaging) return null;

//   try {
//     const permission = await Notification.requestPermission();

//     if (permission !== 'granted') {
//       console.warn('🔒 Permission for notifications not granted.');
//       return null;
//     }

//     const token = await getToken(messaging, {
//       vapidKey: VAPID_KEY,
//     });

//     if (token) {
//       console.log('✅ Firebase token:', token);
//       return token;
//     } else {
//       console.warn('⚠️ No token received');
//       return null;
//     }
//   } catch (error) {
//     console.error('🔥 Error getting Firebase token:', error);
//     return null;
//   }
// };

// export const listenToMessages = () => {
//   if (!messaging) {
//     console.warn('🚫 Messaging not initialized yet.');
//     return;
//   }

//   console.log('🔔 Listening to messages...');
  
//   onMessage(messaging, (payload) => {
//     console.log('📩 New message received:', payload);

//     const { title, body } = payload?.notification || {};

//     toast(title || 'Thông báo mới', {
//       description: body || 'Bạn có một tin nhắn mới.',
//     });
//   });
// };