// src/MessageList.js
import React from "react";

export default function MessageList({ messages = [], currentUid }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 8, minHeight: 200 }}>
      {messages.length === 0 && <div>No messages yet.</div>}
      {messages.map((m) => (
        <div
          key={m.id}
          style={{
            textAlign: m.senderId === currentUid ? "right" : "left",
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 12, color: "#666" }}>
            {m.senderId === currentUid ? "You" : m.senderId}
          </div>
          <div style={{ display: "inline-block", padding: "6px 10px", borderRadius: 8, background: m.senderId === currentUid ? "#e6f7ff" : "#f5f5f5" }}>
            {m.text}
          </div>
        </div>
      ))}
    </div>
  );
}
