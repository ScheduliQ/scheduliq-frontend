import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA59rciBG3IOD43Zj1nDaYva8OhKtYsldI",
  authDomain: "scheduliq.firebaseapp.com",
  projectId: "scheduliq",
  storageBucket: "scheduliq.firebasestorage.app",
  messagingSenderId: "125158559800",
  appId: "1:125158559800:web:89cf50482f70f3d23196cd",
  measurementId: "G-KSG7MFYB8S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
