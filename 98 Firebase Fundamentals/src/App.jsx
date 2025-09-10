import { useEffect, useState } from "react";
import { signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import {db} from "./firebase";
import CollectionChecker from "./components/CollectionChecker";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Current user is ", currentUser);
      console.log("User ID : ", currentUser?.uid);
    });

    return () => unsub();
  }, [])

  const handleAnonLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error(error);
    }
  }

  return <div style={{ textAlign: "center", marginTop: "40px" }}>
    <h1>Firebase Anonymous Login</h1>
    {user ? (
      <div>
        <p>Logged in as UID : <b>{user.uid}</b></p>
      </div>) : (
      <div>
        <p>Not Logged in</p>
        <button onClick={handleAnonLogin}>Login Anonymously</button>
      </div>
    )
    }
    <CollectionChecker />
  </div>;
}
