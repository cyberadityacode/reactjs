import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import UserList from "../components/UserList";
import { setUserOfflineStatus } from "../utils/setUserOfflineStatus";
import ChatWindow from "../components/ChatWindow";

export default function ChatRoom({ currentUser }) {
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      setUserOfflineStatus(currentUser);
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <h1>Welcome, {currentUser.email || currentUser.username} </h1>
      <button onClick={handleLogout}>Logout</button>

      <h1>List of Users</h1>
      <UserList currentUser={currentUser} onSelectUser={setSelectedUser} />

      {selectedUser && (
        <ChatWindow currentUser={currentUser} selectedUser={selectedUser} />
      )}
    </div>
  );
}
