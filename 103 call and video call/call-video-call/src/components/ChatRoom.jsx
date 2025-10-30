// src/components/ChatRoom.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, set, remove, onValue } from "firebase/database";
import CallUI from "./CallUI";
import { v4 as uuidv4 } from "uuid";

export default function ChatRoom({ username, setUsername }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [callData, setCallData] = useState(null); // { callId, remoteUser, isCaller }
  const [incomingCallsMap, setIncomingCallsMap] = useState({}); // Track incoming calls

  // Listen to messages
  useEffect(() => {
    const msgRef = ref(db, "messages/");
    const unsub = onValue(msgRef, (snap) => {
      try {
        const data = snap.val();
        setMessages(
          data ? Object.values(data).sort((a, b) => a.time - b.time) : []
        );
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    });
    return () => unsub();
  }, []);

  // Listen for incoming calls for this user (optimized query)
  useEffect(() => {
    const callsRef = ref(db, "calls/");
    const unsub = onValue(callsRef, (snap) => {
      try {
        const data = snap.val();
        if (!data) return;

        const incomingCalls = {};
        for (const [id, call] of Object.entries(data)) {
          if (call.receiver === username && call.status === "calling") {
            incomingCalls[id] = {
              callId: id,
              remoteUser: call.caller,
              isCaller: false,
            };
          }
        }

        // If there are incoming calls and we don't have an active call, set the first one
        if (Object.keys(incomingCalls).length > 0 && !callData) {
          const firstCallId = Object.keys(incomingCalls)[0];
          setCallData(incomingCalls[firstCallId]);
        }

        setIncomingCallsMap(incomingCalls);
      } catch (err) {
        console.error("Error processing incoming calls:", err);
      }
    });
    return () => unsub();
  }, [username, callData]);

  const sendMessage = () => {
    if (!message.trim()) return;
    try {
      const id = uuidv4();
      set(ref(db, "messages/" + id), {
        id,
        username,
        text: message,
        time: Date.now(),
      });
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    }
  };

  // Create call node and open CallUI as caller
  const startCall = (remoteUser) => {
    if (!remoteUser || !remoteUser.trim()) {
      alert("Please provide a valid username");
      return;
    }

    if (remoteUser === username) {
      alert("Cannot call yourself");
      return;
    }

    try {
      const callId = uuidv4();
      set(ref(db, `calls/${callId}`), {
        caller: username,
        receiver: remoteUser,
        status: "calling",
        createdAt: Date.now(),
      });
      setCallData({ callId, remoteUser, isCaller: true });
    } catch (err) {
      console.error("Error starting call:", err);
      alert("Failed to start call");
    }
  };

  const handleDirectCall = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      startCall(e.target.value.trim());
      e.target.value = "";
    }
  };

  const handleLogout = () => {
    setUsername("");
    try {
      localStorage.removeItem("username");
    } catch (err) {
      console.error("Error clearing localStorage:", err);
    }
  };

  return (
    <div style={{ padding: 12, fontFamily: "sans-serif" }}>
      <h2>Welcome, {username}</h2>

      <div
        style={{
          maxHeight: 300,
          overflow: "auto",
          marginBottom: 10,
          border: "1px solid #ddd",
          padding: 8,
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ color: "#999", textAlign: "center" }}>No messages yet</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                marginBottom: 6,
                padding: 6,
                backgroundColor: "#fff",
                borderRadius: 4,
              }}
            >
              <strong>{m.username}:</strong> {m.text}
              {m.username !== username && (
                <button
                  style={{ marginLeft: 8, padding: "4px 8px", fontSize: 12 }}
                  onClick={() => startCall(m.username)}
                  title={`Call ${m.username}`}
                >
                  📞 Call
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Enter message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Enter username to call directly"
          onKeyDown={handleDirectCall}
          style={{
            padding: 8,
            flex: 1,
            borderRadius: 4,
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {callData && (
        <CallUI
          callId={callData.callId}
          username={username}
          remoteUser={callData.remoteUser}
          isCaller={callData.isCaller}
          onCallEnd={() => setCallData(null)}
        />
      )}
    </div>
  );
}
