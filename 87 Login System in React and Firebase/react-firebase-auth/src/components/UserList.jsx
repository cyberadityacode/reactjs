import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, rtdb } from "../firebase";
import { onValue, ref, off } from "firebase/database"; // added `off`

export default function UserList({ currentUser, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    const statusRefs = [];

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.uid !== currentUser.uid);

      setUsers(userList);

      // Track online/offline status
      userList.forEach((user) => {
        const statusRef = ref(rtdb, `status/${user.uid}`);
        statusRefs.push(statusRef); // store for cleanup
        onValue(statusRef, (snapshot) => {
          setOnlineStatus((prev) => ({
            ...prev,
            [user.uid]: snapshot.val(),
          }));
        });
      });
    });

    // Unread messages listener
    const unsubMessages = onSnapshot(
      query(
        collection(db, "messages"),
        where("receiverId", "==", currentUser.uid),
        where("isRead", "==", false)
      ),
      (snapshot) => {
        console.log("Unread snapshot size:", snapshot.size); // <-- add this
        const unread = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          console.log("Unread message from:", data.senderId); // <-- log here
          const sender = data.senderId;
          unread[sender] = (unread[sender] || 0) + 1;
        });
        setUnreadCounts(unread);
      }
    );

    return () => {
      statusRefs.forEach((refItem) => off(refItem)); //  cleanup RTDB listeners
      unsubUsers();
      unsubMessages();
    };
  }, [currentUser.uid]); //  safe to use currentUser.uid as dependency

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map((user) => {
          const status = onlineStatus[user.uid];
          const isOnline = status?.state === "online";
          const unread = unreadCounts[user.uid] || 0;

          return (
            <li
              key={user.uid}
              onClick={() => onSelectUser(user)}
              style={{ cursor: "pointer", marginBottom: "8px" }}
            >
              {user.username} - {isOnline ? "🟢 Online" : "⚪ Offline"}
              {unread > 0 && (
                <span style={{ color: "red", marginLeft: "8px" }}>
                  ({unread} unread)
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
