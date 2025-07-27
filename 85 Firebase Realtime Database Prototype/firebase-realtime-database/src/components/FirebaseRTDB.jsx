import React, { useState } from "react";
import OnlineStatus from "./OnlineStatus";

export default function FirebaseRTDB() {
  const [userId, setUserId] = useState("aditya");

  const toggleUser = () => {
    setUserId((prev) => (prev === "aditya" ? "pramod" : "aditya"));
  };

  return (
    <div>
      <h1>Firebase RealTime Database Prototype</h1>
      <h2>Welcome {userId}</h2>
      <button onClick={toggleUser}>Switch User</button>
      <OnlineStatus currentUserid= {userId} />
    </div>
  );
}
