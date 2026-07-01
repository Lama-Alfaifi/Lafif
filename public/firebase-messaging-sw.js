importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyATI0fJGl_BQjsS6QxrzmnIqL71-gAmKzU",
  authDomain: "lafif-f1518.firebaseapp.com",
  projectId: "lafif-f1518",
  storageBucket: "lafif-f1518.firebasestorage.app",
  messagingSenderId: "1077047317270",
  appId: "1:1077047317270:web:abfc03d5321b2e73dbf637",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? "لفيف", {
    body: body ?? "",
    icon: "/next.svg",
    badge: "/next.svg",
    dir: "rtl",
    lang: "ar",
  });
});
