import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // 1. Check if username is already taken
      const userRef = doc(collection(db, "usernames"), username);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setError("Username Already Taken");
        return;
      }

      // 2. Create user in Firebase Auth

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // 3. Store username mapping to UID
      console.log("User UID:", uid);
      console.log("Auth:", auth.currentUser);
      console.log("Writing to Firestore...");
      await setDoc(userRef, {
        email: user.email
      });

      setSuccess("Signup Successfull!");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>

      <input
        type="text"
        placeholder="Enter username"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        value={password}
        placeholder="Enter Password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button type="submit">Sign Up</button>

      <p style={{ color: "red" }}>{error}</p>
      <p style={{ color: "green" }}>{success}</p>
    </form>
  );
}
