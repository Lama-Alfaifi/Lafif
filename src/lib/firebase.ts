import { initializeApp }
from "firebase/app";

import { getFirestore }
from "firebase/firestore";

import { getAuth }
from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATI0fJGl_BQjsS6QxrzmnIqL71-gAmKzU",
  authDomain: "lafif-f1518.firebaseapp.com",
  projectId: "lafif-f1518",
  storageBucket: "lafif-f1518.firebasestorage.app",
  messagingSenderId: "1077047317270",
  appId: "1:1077047317270:web:abfc03d5321b2e73dbf637",
  measurementId: "G-410YR6GDFE"
};

// Initialize Firebase
const app =
  initializeApp(firebaseConfig);

export { app };

export const db =
  getFirestore(app);

export const auth =
  getAuth(app);