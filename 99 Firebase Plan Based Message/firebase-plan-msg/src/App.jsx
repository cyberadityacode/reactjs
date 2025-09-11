// App.js
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import Auth from "../src/components/Auth";
import ChatRoom from "../src/components/ChatRoom";

export default function App() {
  const [uid, setUid] = useState(null);
  const [chatWith, setChatWith] = useState("userB"); // example for switching chat

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) setUid(user.uid);
    });
  }, []);

  if (!uid) return <Auth onAuth={setUid} />;

  const chatId = uid < chatWith ? `${uid}_${chatWith}` : `${chatWith}_${uid}`;

  return <ChatRoom chatId={chatId} />;
}
