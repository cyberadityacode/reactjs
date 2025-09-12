// App.jsx
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import ChatRoom from "./components/ChatRoom";

export default function App() {
  const [uid, setUid] = useState(null);
  const [chatWith, setChatWith] = useState("userB"); // example

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if (user) setUid(user.uid);
      else setUid(null);
    });
    return () => unsub();
  }, []);

  if (!uid) return <Auth onAuth={setUid} />;

  const chatId = uid < chatWith ? `${uid}_${chatWith}` : `${chatWith}_${uid}`;

  return <ChatRoom chatId={chatId} />;
}
