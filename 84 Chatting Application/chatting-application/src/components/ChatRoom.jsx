import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Adjust path as needed

const ChatRoom = ({ chatId, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState({});
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const targetUserId = currentUserId === "user1" ? "user2" : "user1";

  // Fetch messages in real-time
  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [chatId]);

  // Listen for typing indicator
  useEffect(() => {
    const chatDocRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.typing) {
        setTyping(data.typing);
      }
    });

    return () => {
      unsubscribe();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId]);

  // Update typing status
  const updateTypingStatus = async (isTyping) => {
    const chatDocRef = doc(db, "chats", chatId);
    const docSnap = await getDoc(chatDocRef);

    if (!docSnap.exists()) {
      await setDoc(chatDocRef, {
        typing: {
          [currentUserId]: isTyping,
        },
      });
    } else {
      await updateDoc(chatDocRef, {
        [`typing.${currentUserId}`]: isTyping,
      });
    }
  };

  // Handle typing input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    updateTypingStatus(true);

    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 1000);
  };

  // Handle sending messages
  const handleSend = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      sender: currentUserId,
      timestamp: new Date(),
    });

    setText("");
    updateTypingStatus(false);
    inputRef.current.focus();
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender === currentUserId ? "own" : ""}`}
          >
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
        {typing[targetUserId] && (
          <div className="typing-indicator">{targetUserId} is typing...</div>
        )}
      </div>
      <div className="input-area">
        <input
          ref={inputRef}
          value={text}
          onChange={handleInputChange}
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
