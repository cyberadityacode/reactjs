import { useState } from "react";
import "./App.css";
import JoinRoom from "./components/JoinRoom";
import ChatRoom from "./components/ChatRoom";

export default function App() {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  return username ? (
    <ChatRoom username={username} setUsername={setUsername} />
  ) : (
    <JoinRoom setUsername={setUsername} />
  );
}
