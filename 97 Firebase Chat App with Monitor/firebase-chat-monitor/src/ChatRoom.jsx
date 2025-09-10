// src/ChatRoom.js
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  runTransaction,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import MessageList from "./MessageList";
import SendMessage from "./SendMessage";

const CHAT_ID = "global";          // single chat room for minimal demo
const WRITE_LIMIT = 100;          // per-user plan write limit
const READ_LIMIT = 200;           // per-user plan read limit
const PAGE_SIZE = 50;

export default function ChatRoom({ user }) {
  const uid = user.uid;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // initial load: use fetchMessages() (see below)
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [uid]);

  // 1) send message atomically: check user's writeCount and write message + increment in same transaction
  async function sendMessage(text) {
    const messageRef = doc(collection(db, "chats", CHAT_ID, "messages"));
    const usageRef = doc(db, "userUsage", uid);

    try {
      await runTransaction(db, async (tx) => {
        const usageSnap = await tx.get(usageRef);
        if (!usageSnap.exists()) {
          // first-time usage doc
          tx.set(usageRef, { readCount: 0, writeCount: 0, lastReset: serverTimestamp() });
        }
        const currentWrites = usageSnap.exists() ? (usageSnap.data().writeCount || 0) : 0;
        if (currentWrites >= WRITE_LIMIT) {
          throw new Error("Write limit reached for your plan.");
        }
        tx.set(messageRef, {
          senderId: uid,
          text,
          timestamp: serverTimestamp(),
        });
        tx.update(usageRef, { writeCount: increment(1) });
      });
    } catch (err) {
      alert(err.message || "Failed to send message");
      console.error(err);
    }
  }

  // 2) fetch messages (non-realtime) while incrementing readCount (transactionally checks limit)
  async function fetchMessages() {
    setLoading(true);
    const usageRef = doc(db, "userUsage", uid);
    try {
      // 1) increment readCount in a transaction (and fail if limit reached)
      await runTransaction(db, async (tx) => {
        const usageSnap = await tx.get(usageRef);
        if (!usageSnap.exists()) {
          tx.set(usageRef, { readCount: 1, writeCount: 0, lastReset: serverTimestamp() });
          return;
        }
        const currentReads = usageSnap.data().readCount || 0;
        if (currentReads >= READ_LIMIT) {
          throw new Error("Read limit reached for your plan.");
        }
        tx.update(usageRef, { readCount: increment(1) });
      });

      // 2) perform the actual read
      const q = query(
        collection(db, "chats", CHAT_ID, "messages"),
        orderBy("timestamp", "desc"),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() })).reverse(); // oldest-first
      setMessages(docs);
    } catch (err) {
      if (err.message) alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 8 }}>
      <h2>Simple Chat</h2>
      <button onClick={fetchMessages} disabled={loading} style={{ marginBottom: 8 }}>
        {loading ? "Loading..." : "Refresh (counts as 1 read)"}
      </button>
      <MessageList messages={messages} currentUid={uid} />
      <SendMessage onSend={sendMessage} />
    </div>
  );
}
