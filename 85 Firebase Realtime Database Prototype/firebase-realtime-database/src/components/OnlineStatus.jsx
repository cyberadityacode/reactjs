import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { onDisconnect, onValue, ref, set } from "firebase/database";

export default function OnlineStatus({ currentUserid }) {
  const otherUserId = currentUserid === "aditya" ? "pramod" : "aditya";
  const [otherUserStatus, setOtherUserStatus] = useState("offline");

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

    return () => {
      // set offline on unmount

      set(userStatusRef, "offline");
    };
  }, [currentUserid]);

  useEffect(() => {
    const otherStatusRef = ref(db, `/status/${otherUserId}`);
    const unsubscribe = onValue(otherStatusRef, (snap) => {
      setOtherUserStatus(snap.val() || "offline");
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
