// ChatRoom.js
import { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

export default function ChatRoom({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [plan, setPlan] = useState("free");
  const scrollRef = useRef();

  const uid = auth.currentUser.uid;
  const usageRef = doc(db, "usage", uid);

  // Listen messages
  useEffect(() => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, async snapshot => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);

      // Increment readCount for each snapshot update
      await runTransaction(db, async (t) => {
        const snap = await t.get(usageRef);
        const readCount = snap.exists() ? snap.data().readCount || 0 : 0;
        t.set(usageRef, { readCount: readCount + 1, writeCount: snap.data()?.writeCount || 0, plan: snap.data()?.plan || "free" });
      });
    });

    return () => unsub();
  }, [chatId]);

  // Fetch user plan
  useEffect(() => {
    const fetchPlan = async () => {
      const snap = await getDoc(usageRef);
      if (snap.exists()) setPlan(snap.data().plan || "free");
    };
    fetchPlan();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messagesRef = collection(db, "chats", chatId, "messages");

    try {
      await runTransaction(db, async (t) => {
        const usageSnap = await t.get(usageRef);
        const writeCount = usageSnap.exists() ? usageSnap.data().writeCount : 0;
        const currentPlan = usageSnap.exists() ? usageSnap.data().plan : "free";
        const limit = currentPlan === "pro" ? 20 : 5;

        if (writeCount >= limit) throw new Error(`Daily message limit reached (${limit})`);

        // Add message
        const msgRef = doc(messagesRef);
        t.set(msgRef, { text: input, from: uid, to: chatId.replace(uid + "_", ""), createdAt: serverTimestamp() });

        // Update writeCount
        t.set(usageRef, { writeCount: writeCount + 1, readCount: usageSnap.data()?.readCount || 0, plan: currentPlan });
      });

      setInput("");
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ height: "300px", overflowY: "scroll" }}>
        {messages.map(m => (
          <div key={m.id}><b>{m.from}</b>: {m.text}</div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type message..." />
      <button onClick={sendMessage}>Send</button>
      <p>Plan: {plan}</p>
    </div>
  );
}
