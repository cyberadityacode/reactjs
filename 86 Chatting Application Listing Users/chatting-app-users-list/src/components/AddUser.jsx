import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";

export default function AddUser() {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (name) {
      await addDoc(collection(db, "users"), {
        name,
        isOnline: false,
        lastSeen: null,
      });
      setName("");
    }
  };

  return (
    <div>
      <input
        value={name}
        type="text"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAdd}>Add User</button>
    </div>
  );
}
