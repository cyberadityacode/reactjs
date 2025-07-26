import React, { useState } from "react";
import ChatRoom from "./components/ChatRoom";

const App = () => {
  const [userId, setUserId] = useState("user1");
  const [currentOn, setCurrentOn] = useState("On");

  const toggleDarkMode = () => {
    setCurrentOn((prev) => (prev === "On" ? "Off" : "On"));
  };
  const toggleUser = () => {
    setUserId((prev) => (prev === "user1" ? "user2" : "user1"));
  };

  const divStyle = {
    backgroundColor: currentOn === "On" ? "gray" : "white",
  };

  return (
    <div className="app" style={divStyle}>
      <h1>Firebase Chat</h1>
      <button onClick={toggleUser}>Switch User (Current: {userId})</button>
      <button onClick={toggleDarkMode}>Dark Mode Status {currentOn}</button>
      {/*  Use dynamic userId here */}
      <ChatRoom chatId="chat123" currentUserId={userId} />
    </div>
  );
};

export default App;
