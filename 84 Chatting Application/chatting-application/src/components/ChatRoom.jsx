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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // Adjust path as needed
import { formatDistanceToNow } from "date-fns";
import usePresence from "../hooks/usePresence";
import useUserStatus from "../hooks/useUserStatus";

const ChatRoom = ({ chatId, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState({});
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [lastSeen, setLastSeen] = useState(null);

  const targetUserId = currentUserId === "user1" ? "user2" : "user1";
  const isOnline = useUserStatus(targetUserId);
  //Track current user presence
  usePresence(currentUserId);

  // Fetch messages in real-time
  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    console.log("structure of the query: ", q);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Collection of All Messages: ", messages);

      setMessages(messages);
    });
    return () => unsubscribe();
  }, [chatId]);

  // useEffect for Last Seen
  // ✅ Track target user online status (RTDB)
 

  // ✅ Get target user's lastSeen (Firestore)
  useEffect(() => {
    const targetDocRef = doc(db, "users", targetUserId);
    const unsubscribe = onSnapshot(targetDocRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.lastSeen) {
        setLastSeen(data.lastSeen.toDate());
      }
    });

    return () => unsubscribe();
  }, [targetUserId]);

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

    console.log("chatDocRef contains this: ", chatDocRef);
    const docSnap = await getDoc(chatDocRef);

    console.log("docSnap contains this: ", docSnap);

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

        <div>
          Status:{" "}
          {isOnline
            ? "🟢 Online"
            : `⚫️ Last seen at ${lastSeen?.toLocaleString()}`}
        </div>
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
