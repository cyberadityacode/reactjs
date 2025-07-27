// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";

import {
  getDatabase,
  ref,
  onDisconnect,
  set,
  serverTimestamp as rtdbServerTimestamp,
} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzhFNLwizAcjHfd8Dxb5wc4qYAxU_vD80",
  authDomain: "vedicview-1077.firebaseapp.com",
  projectId: "vedicview-1077",
  storageBucket: "vedicview-1077.firebasestorage.app",
  messagingSenderId: "809593967707",
  appId: "1:809593967707:web:92d1f42eca535e7cc35b7e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
export {
  db,
  rtdb,
  ref,
  onDisconnect,
  set,
  rtdbServerTimestamp,
  serverTimestamp,
};
