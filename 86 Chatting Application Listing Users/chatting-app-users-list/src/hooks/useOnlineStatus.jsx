import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../firebase";

export default function useOnlineStatus(userId) {
  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);

    const setOnline = async () => {
      await updateDoc(userRef, { isOnline: true });
    };

    const setOffline = async () => {
      await updateDoc(userRef, {
        isOnline: false,
        lastSeen: serverTimestamp(),
      });
    };

    setOnline();
    window.addEventListener("beforeunload", setOffline);

    return () => {
      setOffline();
      window.addEventListener("beforeunload", setOffline);
    };
  }, [userId]);
  return <div>useOnlineStatus</div>;
}
