import { onDisconnect, ref, set } from "firebase/database";
import { rtdb } from "../firebase";
import { serverTimestamp } from "firebase/firestore";

export function setUserOnlineStatus(user) {
  console.log("Incoming user object:", user); // Add this

  if (!user?.uid) {
    console.error("Missing user UID in setUserOnlineStatus");
    return;
  }
  const userStatusRef = ref(rtdb, `status/${user.uid}`);

  // What to do when user disconnects
  onDisconnect(userStatusRef).set({
    state: "offline",
    username: user.username,
    lastChanged: serverTimestamp(),
  });

  // Set user as online now
  set(userStatusRef, {
    state: "online",
    username: user.username,
    lastChanged: serverTimestamp(),
  });
}
