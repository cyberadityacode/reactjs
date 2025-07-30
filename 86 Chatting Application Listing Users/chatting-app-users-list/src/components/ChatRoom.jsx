import { useEffect, useState } from "react";
import { generateChatId } from "../utils/chat";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { markMessagesAsRead } from "../utils/chat";

export default function ChatRoom({ currentUser, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const chatId = generateChatId(currentUser.id, selectedUser.id);

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      //   mark messages as read for current user
      markMessagesAsRead(chatId, currentUser.id);
    });

    return () => unsubscribe();
  }, [chatId, currentUser.id]);

  const handleSend = async () => {
    if (text.trim() === "") return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      timestamp: serverTimestamp(),
      read: false,
    });

    setText("");
  };

  return (
    <div>
      <h2>Chat is {selectedUser.name}</h2>
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid gray",
          padding: "1rem",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.senderId === currentUser.id ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <span
              style={{
                background:
                  msg.senderId === currentUser.id ? "#dcf8c6" : " #f1f0f0",
                padding: "6px 12px",
                borderRadius: "20px",
                display: "inline-block",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <input
          value={text}
          type="text"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type message..."
          style={{ width: "80%" }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
