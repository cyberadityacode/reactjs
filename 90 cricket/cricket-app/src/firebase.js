// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat and higher
const firebaseConfig = {
  apiKey: "AIzaSyBzhFNLwizAcjHfd8Dxb5wc4qYAxU_vD80",
  authDomain: "vedicview-1077.firebaseapp.com",
  databaseURL: "https://vedicview-1077-default-rtdb.firebaseio.com",
  projectId: "vedicview-1077",
  storageBucket: "vedicview-1077.firebasestorage.app",
  messagingSenderId: "809593967707",
  appId: "1:809593967707:web:92d1f42eca535e7cc35b7e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Authentication providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

export default app;
