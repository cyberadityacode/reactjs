import React, { useState } from "react";
import ChatRoom from "./components/ChatRoom";

const App = () => {
  const [userId, setUserId] = useState("user1");

  const toggleUser = () => {
    setUserId((prev) => (prev === "user1" ? "user2" : "user1"));
  };

  return (
    <div className="app">
      <h1>Firebase Chat</h1>
      <button onClick={toggleUser}>Switch User (Current: {userId})</button>
      {/*  Use dynamic userId here */}
      <ChatRoom chatId="chat123" currentUserId={userId} />
    </div>
  );
};

export default App;
