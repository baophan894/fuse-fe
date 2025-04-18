
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBLwu6QBXhNzvf0B5aYvOa2hKk-FuPuq4M",
  authDomain: "fuse-387ee.firebaseapp.com",
  projectId: "fuse-387ee",
  messagingSenderId: "268316893486",
  appId: "1:268316893486:web:c2e1a21e44d49668c21abf",

});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});