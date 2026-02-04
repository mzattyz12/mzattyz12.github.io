

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDdmrhtCWO0Dk_g1ZjVD3W7YvIfbJRi0jI",
  authDomain: "messgsender.firebaseapp.com",
  projectId: "messgsender",
  storageBucket: "messgsender.firebasestorage.app",
  messagingSenderId: "271051103266",
  appId: "1:271051103266:web:c92c4d33e340bdb3a2fe7b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
});
