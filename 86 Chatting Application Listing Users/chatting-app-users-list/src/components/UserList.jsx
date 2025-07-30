import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { generateChatId } from "../utils/chat";

export default function UserList({ onSelect, currentUser }) {
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Fetch all users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Fetch unread messages
  /* useEffect(() => {
    if (!currentUser || users.length === 0) return;

    const fetchUnreadCounts = async () => {
      try {
        const promises = users
          .filter((user) => user.id !== currentUser.id)
          .map(async (user) => {
            const chatId = generateChatId(currentUser.id, user.id);
            const q = query(
              collection(db, "chats", chatId, "messages"),
              where("receiverId", "==", currentUser.id),
              where("read", "==", false)
            );
            const snapshot = await getDocs(q);
            return { userId: user.id, count: snapshot.size };
          });

        const results = await Promise.all(promises);
        const counts = {};
        results.forEach(({ userId, count }) => {
          if (count > 0) counts[userId] = count;
        });
        setUnreadCounts(counts);
      } catch (err) {
        console.error("Error fetching unread counts: ", err);
      }
    };

    fetchUnreadCounts();
  }, [users, currentUser]); */

  useEffect(() => {
    if (!currentUser || users.length === 0) return;

    const unsubscribes = [];

    users.forEach((user) => {
      if (user.id === currentUser.id) return;

      const chatId = generateChatId(currentUser.id, user.id);
      const q = query(
        collection(db, "chats", chatId, "messages"),
        where("receiverId", "==", currentUser.id),
        where("read", "==", false)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setUnreadCounts((prev) => ({
          ...prev,
          [user.id]: snapshot.size,
        }));
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [users, currentUser]);

  if (!users.length) {
    return <p>Loading users...</p>; // purely based on actual loading, not currentUser
  }

  return (
    <div>
      <h2>All Users</h2>
      {users.map((user) => {
        if (!user || !user.id || (currentUser && user.id === currentUser.id))
          return null;

        const unread = unreadCounts[user.id] || 0;

        return (
          <div
            key={user.id}
            onClick={() => onSelect(user)}
            style={{ marginBottom: "10px", cursor: "pointer" }}
          >
            <span>
              {user.name} - {user.isOnline ? "🟢 Online" : "⚪ Offline"}
            </span>

            {unread > 0 && (
              <span style={{ marginLeft: "10px", color: "red" }}>
                🔴 {unread}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
