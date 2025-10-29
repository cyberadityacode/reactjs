// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB04VJd8Wk3fli2uJ2WHsJ0M0sSq9OuE7w",
  authDomain: "adityadubeytest.firebaseapp.com",
  databaseURL: "https://adityadubeytest-default-rtdb.firebaseio.com",
  projectId: "adityadubeytest",
  storageBucket: "adityadubeytest.firebasestorage.app",
  messagingSenderId: "837004099641",
  appId: "1:837004099641:web:1a630941726edbea3b8de8",
  measurementId: "G-85DZWKKJR5",
};

// ✅ Init Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// ✅ Firestore (for chat messages)
export const firestoreDB = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

// ✅ Realtime DB (for calling)
export const db = getDatabase(app);
