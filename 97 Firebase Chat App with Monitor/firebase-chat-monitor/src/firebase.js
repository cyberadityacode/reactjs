// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyB04VJd8Wk3fli2uJ2WHsJ0M0sSq9OuE7w",

    authDomain: "adityadubeytest.firebaseapp.com",

    databaseURL: "https://adityadubeytest-default-rtdb.firebaseio.com",

    projectId: "adityadubeytest",

    storageBucket: "adityadubeytest.firebasestorage.app",

    messagingSenderId: "837004099641",

    appId: "1:837004099641:web:1a630941726edbea3b8de8",

    measurementId: "G-85DZWKKJR5"

};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// helper to sign in anonymously (we'll call this from App)
export async function ensureAnonymousSignIn() {
    try {
        await signInAnonymously(auth);
    } catch (err) {
        // ignore if already signed in or error
        console.error("Anonymous sign-in failed:", err);
    }
}
