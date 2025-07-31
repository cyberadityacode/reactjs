import { ref, set, serverTimestamp } from "firebase/database";
import { rtdb } from "../firebase";

export function setUserOfflineStatus(user) {
  const userStatusRef = ref(rtdb, `status/${user.uid}`);
  set(userStatusRef, {
    state: "offline",
    lastChanged: serverTimestamp(),
  });
}
