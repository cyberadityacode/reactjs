import React, { useState } from "react";
import ChatRoom from "./components/ChatRoom";
import UserList from "./components/UserList";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); //simulate Login
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div>
      <h1>React Firebase Chat Application</h1>

      {!currentUser ? (
        <div>
          <h2>Select Current User (simulate login)</h2>
          <UserList onSelect={(user) => setCurrentUser(user)} />
        </div>
      ) : !selectedUser ? (
        <div>
          <h3>Logged in as : {currentUser.name}</h3>
          <h4>Select someone to chat with:</h4>
          <UserList
            currentUser={currentUser}
            onSelect={(user) =>
              user.id !== currentUser.id && setSelectedUser(user)
            }
          />
        </div>
      ) : (
        <ChatRoom currentUser={currentUser} selectedUser={selectedUser} />
      )}
    </div>
  );
}
