import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

function generateChatId(uid1, uid2) {
  return uid1 > uid2 ? uid1 + "_" + uid2 : uid2 + "_" + uid1;
}

export default function ChatWindow({ currentUser, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const chatId = generateChatId(currentUser.uid, selectedUser.uid);

  // inside useEffect, after chatId is defined
  useEffect(() => {
    const markAsRead = async () => {
      const q = query(
        collection(db, "chats", chatId, "messages"),
        where("receiverId", "==", currentUser.uid),
        where("isRead", "==", false)
      );

      const snapshot = await getDocs(q);

      const updates = snapshot.docs.map((docSnap) =>
        updateDoc(docSnap.ref, { isRead: true })
      );

      await Promise.all(updates);
    };

    markAsRead();
  }, [chatId]);
  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
      scrollToBottom();
    });

    return () => unsub();
  }, [chatId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUser.uid,
      receiverId: selectedUser.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
      isRead: false,
    });

    setNewMessage("");
  };

  return (
    <div style={{ border: "1px solid gray", padding: "1rem" }}>
      <h3>Chatting with {selectedUser.username}</h3>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <p
            key={idx}
            style={{
              textAlign: msg.senderId === currentUser.uid ? "right" : "left",
              background: msg.senderId === currentUser.uid ? "#daf" : "#eee",
              margin: "5px",
              padding: "5px",
              borderRadius: "8px",
            }}
          >
            {msg.text}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
