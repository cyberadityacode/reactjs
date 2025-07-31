import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { onValue, ref, off } from "firebase/database";
import { db, rtdb } from "../firebase";

export default function UserList({ currentUser, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalCounts, setTotalCounts] = useState({});

  useEffect(() => {
    if (!currentUser?.uid) return;

    const statusRefs = [];

    // Load users and set their status listeners
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.uid !== currentUser.uid);

      setUsers(userList);

      // Setup RTDB listeners for online status
      userList.forEach((user) => {
        const statusRef = ref(rtdb, `status/${user.uid}`);
        statusRefs.push(statusRef);

        onValue(statusRef, (snapshot) => {
          setOnlineStatus((prev) => ({
            ...prev,
            [user.uid]: snapshot.val(),
          }));
        });
      });
    });

    // Firestore listener to unread messages
    const messagesQuery = query(
      collection(db, "messages"),
      where("receiverId", "==", currentUser.uid),
      where("isRead", "==", false)
    );

    const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
      console.log("Unread messages snapshot size:", snapshot.size);
      const unreadMap = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        console.log("Message doc:", data);
        const senderId = data.senderId;

        if (senderId) {
          unreadMap[senderId] = (unreadMap[senderId] || 0) + 1;
        } else {
          console.warn("Missing senderId in message:", doc.id, data);
        }
      });

      setUnreadCounts(unreadMap);
    });

    return () => {
      statusRefs.forEach((statusRef) => off(statusRef));
      unsubUsers();
      unsubMessages();
    };
  }, [currentUser.uid]);

  return (
    <div>
      <h2>Users List - Total Users: {users.length}</h2>
      <ul>
        {users.map((user) => {
          const status = onlineStatus[user.uid];
          const isOnline = status?.state === "online";
          const unread = unreadCounts[user.uid] || 0;

          return (
            <li
              key={user.uid}
              onClick={() => onSelectUser(user)}
              style={{
                cursor: "pointer",
                marginBottom: "10px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: unread > 0 ? "#fff7f7" : "#f9f9f9",
              }}
            >
              <strong>{user.username}</strong> -{" "}
              <span style={{ color: isOnline ? "green" : "gray" }}>
                {isOnline ? "🟢 Online" : "⚪ Offline"}
              </span>
              <p>Total messages from this user: {totalCounts[user.uid] || 0}</p>
              {unread > 0 && (
                <span
                  style={{
                    color: "white",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    padding: "3px 7px",
                    marginLeft: "10px",
                    fontSize: "0.8em",
                  }}
                >
                  {unread}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
