// ChatRoom.jsx
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
  getDoc
} from "firebase/firestore";

export default function ChatRoom({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [plan, setPlan] = useState("free");
  const [errorMsg, setErrorMsg] = useState("");
  const scrollRef = useRef();

  const uid = auth.currentUser.uid;
  const usageRef = doc(db, "usage", uid);

  const [id1, id2] = chatId.split("_");
  const otherUser = id1 === uid ? id2 : id1;

  // Listen to messages with error handling
  useEffect(() => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(
      q,
      async snapshot => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);

        // Try to increment read count
        try {
          await runTransaction(db, async (t) => {
            const snap = await t.get(usageRef);
            if (!snap.exists()) return;
            const readCount = snap.data().readCount || 0;
            const writeCount = snap.data().writeCount || 0;
            const currentPlan = snap.data().plan || "free";

            t.set(usageRef, {
              readCount: readCount + 1,
              writeCount,
              plan: currentPlan
            }, { merge: true });
          });
        } catch (err) {
          if (err.code === "permission-denied") {
            setErrorMsg("Daily read limit reached.");
          } else {
            console.error("Read transaction error:", err);
          }
        }
      },
      err => {
        if (err.code === "permission-denied") {
          setErrorMsg("You do not have permission to read more messages (limit reached).");
        } else {
          setErrorMsg("Error loading messages: " + err.message);
        }
      }
    );

    return () => unsub();
  }, [chatId]);

  // Fetch plan once
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
        if (!usageSnap.exists()) throw new Error("Usage doc not found");

        const writeCount = usageSnap.data().writeCount || 0;
        const currentPlan = usageSnap.data().plan || "free";
        const limit = currentPlan === "pro" ? 20 : 5;

        if (writeCount >= limit) throw new Error(`Daily message limit reached (${limit})`);

        const msgRef = doc(messagesRef);
        t.set(msgRef, {
          text: input,
          from: uid,
          to: otherUser,
          createdAt: serverTimestamp()
        });

        t.set(usageRef, {
          writeCount: writeCount + 1,
          readCount: usageSnap.data().readCount || 0,
          plan: currentPlan
        }, { merge: true });
      });

      setInput("");
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      if (err.code === "permission-denied") {
        setErrorMsg("Daily write limit reached.");
      } else {
        setErrorMsg(err.message);
      }
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

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type message..." />
      <button onClick={sendMessage}>Send</button>
      <p>Plan: {plan}</p>
    </div>
  );
}
