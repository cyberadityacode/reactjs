import { useState } from "react";

export default function JoinRoom({ setUsername }) {
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (!name.trim()) return;
    localStorage.setItem("username", name);
    setUsername(name);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Welcome to Chat</h2>
      <input
        type="text"
        placeholder="Enter a username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}
