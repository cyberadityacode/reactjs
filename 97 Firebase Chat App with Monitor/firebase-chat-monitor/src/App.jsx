// src/App.js
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, ensureAnonymousSignIn } from "./firebase";
import ChatRoom from "./ChatRoom";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    ensureAnonymousSignIn();
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) return <div>Signing in...</div>;
  return <ChatRoom user={user} />;
}
