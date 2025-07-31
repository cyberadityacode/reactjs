import React, { useEffect, useState } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { setUserOnlineStatus } from "./utils/setUserOnlineStatus";

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);

      if (firebaseUser) {
        setUserOnlineStatus(firebaseUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
      setMode("login"); // Optional: go back to login mode
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  if (!authChecked) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {!user ? (
        <>
          {mode === "login" ? (
            <>
              <Login onLoginSuccess={setUser} />
              <p>
                Don't have an account?{" "}
                <button onClick={() => setMode("signup")}>Sign Up</button>
              </p>
            </>
          ) : (
            <>
              <Signup />
              <p>
                Already have an account?{" "}
                <button onClick={() => setMode("login")}>Login</button>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <ChatRoom currentUser={user} />
        </>
      )}
    </div>
  );
}
