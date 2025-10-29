import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import CallUI from "./CallUI";

export default function ChatRoom({ username, setUsername }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);
  const [activeCall, setActiveCall] = useState(null);

  const ringtoneRef = useRef(null);

  const roomRef = collection(db, "rooms", "public", "messages");
  const messageQuery = query(roomRef, orderBy("createdAt"));

  // Load incoming messages
  useEffect(() => {
    const unsub = onSnapshot(messageQuery, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize shared ringtone audio
  useEffect(() => {
    ringtoneRef.current = new Audio("/ringtone.mp3");
    ringtoneRef.current.loop = true;
  }, []);

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(roomRef, {
      text: input,
      username,
      createdAt: serverTimestamp(),
    });
    setInput("");
  };

  // Initiate call
  const startCall = async (receiver) => {
    const callDoc = await addDoc(collection(db, "calls"), {
      caller: username,
      receiver,
      status: "ringing",
      createdAt: serverTimestamp(),
    });
    setActiveCall(callDoc.id);
  };

  // Listen for incoming calls
  useEffect(() => {
    const q = query(
      collection(db, "calls"),
      where("receiver", "==", username),
      where("status", "==", "ringing")
    );

    const unsub = onSnapshot(q, (snap) => {
      snap.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const call = { id: change.doc.id, ...change.doc.data() };

          ringtoneRef.current.play().catch(() => {});

          const accept = window.confirm(`${call.caller} is calling you!`);
          if (accept) {
            stopRingtone();
            await updateDoc(doc(db, "calls", call.id), {
              status: "accepted",
            });
            setActiveCall(call.id);
          } else {
            stopRingtone();
            await updateDoc(doc(db, "calls", call.id), {
              status: "rejected",
            });
          }
        }
      });
    });

    return () => unsub();
  }, [username]);

  // Cleanup ringtone on component unmount
  useEffect(() => {
    return () => stopRingtone();
  }, []);

  const handleEndCall = () => {
    stopRingtone();
    setActiveCall(null);
  };

  const handleLogout = () => {
    localStorage.setItem("username", "");
    setUsername("");
  };
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h3>Public Chat Room</h3>

      <div style={{ height: 400, overflowY: "auto" }}>
        {messages.map((m) => (
          <div key={m.id}>
            <strong>{m.username}: </strong> {m.text}
            {m.username !== username && (
              <button
                onClick={() => startCall(m.username)}
                style={{ marginLeft: 10 }}
              >
                📞 Call User
              </button>
            )}
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>

      <input
        placeholder="Type message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>

      {activeCall && (
        <CallUI callId={activeCall} username={username} onEnd={handleEndCall} />
      )}

      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
