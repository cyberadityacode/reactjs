// Auth.js
import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("free");

  const register = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Initialize usage doc
      await setDoc(doc(db, "usage", uid), { plan:"free", writeCount: 0, readCount: 0 });

      onAuth(uid);
    } catch (err) {
      alert(err.message);
    }
  };

  const login = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      onAuth(userCred.user.uid);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

      <select value={plan} onChange={e => setPlan(e.target.value)}>
        <option value="free">Free (5/day)</option>
        <option value="pro">Pro (20/day)</option>
      </select>

      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
    </div>
  );
}
