import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../firebase";

export default function CallUI({ callId, username, onEnd }) {
  useEffect(() => {
    const callRef = doc(db, "calls", callId);

    const unsub = onSnapshot(callRef, (snap) => {
      const data = snap.data();
      if (!data) return;

      if (data.status === "ended" || data.status === "rejected") {
        onEnd();
      }
    });

    return () => unsub();
  }, [callId, onEnd]);

  const endCall = async () => {
    await updateDoc(doc(db, "calls", callId), { status: "ended" });
    onEnd();
  };

  return (
    <div
      style={{
        background: "#111",
        color: "#fff",
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
        textAlign: "center",
      }}
    >
      <h2>Call Active 📞</h2>
      <p>
        Call ID: {callId}: Username: {username}
      </p>
      <button
        onClick={endCall}
        style={{ marginTop: 10, padding: "8px 16px", cursor: "pointer" }}
      >
        End Call ❌
      </button>
    </div>
  );
}
