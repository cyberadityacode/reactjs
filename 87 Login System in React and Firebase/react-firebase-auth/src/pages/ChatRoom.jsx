import { signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { auth } from "../firebase";

export default function ChatRoom({ currentUser }) {
  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <h1>Welcome, {currentUser.email} </h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
