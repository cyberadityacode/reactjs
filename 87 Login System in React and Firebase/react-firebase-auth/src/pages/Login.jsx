import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Use the correct collection: "usernames"
      const userRef = doc(db, "usernames", username);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User not found.");
        return;
      }

      const userData = userSnap.data();
      const email = userData.email;

      // Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      onLoginSuccess({ uid: user.uid, username });
    } catch (err) {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err.code === "auth/user-not-found") {
        setError("No such user exists.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
