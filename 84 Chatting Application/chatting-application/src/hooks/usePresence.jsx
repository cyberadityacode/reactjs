// hooks/usePresence.js
import { useEffect } from "react";
import {
  rtdb,
  ref,
  set,
  onDisconnect,
  rtdbServerTimestamp,
  db,
  serverTimestamp,
} from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const usePresence = (userId) => {
  useEffect(() => {
    if (!userId) return;

    const userStatusRef = ref(rtdb, `status/${userId}`);

    const onlineStatus = {
      state: "online",
      lastChanged: rtdbServerTimestamp(),
    };

    const offlineStatus = {
      state: "offline",
      lastChanged: rtdbServerTimestamp(),
    };

    // Write online now
    set(userStatusRef, onlineStatus);

    // Set disconnect
    onDisconnect(userStatusRef).set(offlineStatus);

    // Also update Firestore lastSeen timestamp for fallback
    const userDocRef = doc(db, "users", userId);
    setDoc(userDocRef, { lastSeen: serverTimestamp() }, { merge: true });
  }, [userId]);
};

export default usePresence;
