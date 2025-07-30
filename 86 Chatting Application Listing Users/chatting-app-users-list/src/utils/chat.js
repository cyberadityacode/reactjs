// Sorting ensures that the same two users always get the same chat ID.

import {
  collection,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

export async function markMessagesAsRead(chatId, userId) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    where("receiverId", "==", userId),
    where("read", "==", false)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.forEach((doc) => {
    batch.update(doc.ref, { read: true });
  });

  await batch.commit();

  /*  This ensures: As soon as you open a chat, unread messages for you in that thread are marked as read. */
}

export function generateChatId(uid1, uid2) {
  return [uid1, uid2].sort().join("_");
}
