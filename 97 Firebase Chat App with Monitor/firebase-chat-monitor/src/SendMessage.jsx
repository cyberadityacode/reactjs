// src/SendMessage.js
import React, { useState } from "react";

export default function SendMessage({ onSend }) {
  const [text, setText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    await onSend(t);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 8, display: "flex", gap: 8 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        style={{ flex: 1, padding: 8 }}
      />
      <button type="submit">Send</button>
    </form>
  );
}
