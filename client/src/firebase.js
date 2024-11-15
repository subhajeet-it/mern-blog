
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-blog-3c6d8.firebaseapp.com",
  projectId: "mern-blog-3c6d8",
  storageBucket: "mern-blog-3c6d8.firebasestorage.app",
  messagingSenderId: "281929688963",
  appId: "1:281929688963:web:4ded7c2847bf1d4c9a78b6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);