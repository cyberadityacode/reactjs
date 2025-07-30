// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

export const db = getFirestore(app);
