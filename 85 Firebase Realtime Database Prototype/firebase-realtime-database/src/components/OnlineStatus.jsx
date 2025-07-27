import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { onDisconnect, onValue, ref, set } from "firebase/database";

export default function OnlineStatus({ currentUserid }) {
  const otherUserId = currentUserid === "aditya" ? "pramod" : "aditya";
  const [otherUserStatus, setOtherUserStatus] = useState("offline");

  const prevStatusRef = useRef("offline");
  const originalTitle = useRef(document.title);

  //   sount setup

  const pingAudio = useRef(new Audio("./that-was-quick-606.mp3"));

  useEffect(() => {
    const userStatusRef = ref(db, `/status/${currentUserid}`);
    const connectedRef = ref(db, ".info/connected");

    // Watch connection state

    const unsubscribeConnection = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // Set onDisconnect to mark the user offline when they disconnect
        onDisconnect(userStatusRef).set("offline");

        // Set user as online now (since they are connected)
        set(userStatusRef, "online");
      }
    });

    return () => {};
  }, [currentUserid]);

  useEffect(() => {
    const otherStatusRef = ref(db, `/status/${otherUserId}`);
    const unsubscribe = onValue(otherStatusRef, (snap) => {
      const newStatus = snap.val() || "offline";

      setOtherUserStatus(newStatus);

      // If status changes from offline ➝ online

      if (prevStatusRef.current === "offline" && newStatus === "online") {
        // 1 . play sound
        pingAudio.current.play();

        // 2. Update tab Title
        document.title = `${otherUserId} is online!`;

        // 3. Reset title after 5 seconds

        setTimeout(() => {
          document.title = originalTitle.current;
        }, 5000);
      }

      // Store current status for next comparison

      prevStatusRef.current = newStatus;
    });

    return () => unsubscribe();
  }, [otherUserId]);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>
        {otherUserId} is :{" "}
        <span style={{ color: otherUserStatus === "online" ? "green" : "red" }}>
          {otherUserStatus}
        </span>
      </h3>
    </div>
  );
}
