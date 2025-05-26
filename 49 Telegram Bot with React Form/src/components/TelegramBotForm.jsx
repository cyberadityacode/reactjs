import React from "react";
import { useState } from "react";

export default function TelegramBotForm() {
  const [message, setMessage] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();
    const botToken = import.meta.env.VITE_botToken;
    const chatId = import.meta.env.VITE_chatId;
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Message sent successfully:", data);
      setMessage(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <div>
      <h1>TelegramBot Form</h1>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="enter message"
        />
        <button>Send message</button>
      </form>
    </div>
  );
}
