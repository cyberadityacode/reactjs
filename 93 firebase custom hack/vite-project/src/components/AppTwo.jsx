/* import React, { useState, useEffect } from "react";

export default function AppTwo() {
  const [accessToken, setAccessToken] = useState(null);
  const [projects, setProjects] = useState([]);

  // Parse tokens from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokensParam = urlParams.get("tokens");

    if (tokensParam) {
      try {
        const tokens = JSON.parse(decodeURIComponent(tokensParam));
        console.log("Tokens:", tokens);
        setAccessToken(tokens.access_token);

        // Clean URL (remove tokens from query)
        window.history.replaceState({}, document.title, "/");
      } catch (err) {
        console.error("Failed to parse tokens:", err);
      }
    }
  }, []);

  // Function to start login
  const handleLogin = () => {
    window.location.href =
      "https://www.ideawp.com/wpchat/auth.php?frontend_redirect=http://localhost:5173";
  };

  // Example: Fetch Firebase projects after login
  const fetchProjects = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(
        "https://firebase.googleapis.com/v1beta1/projects",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      console.log("Projects:", data);
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!accessToken ? (
        <button onClick={handleLogin}>Login with Google</button>
      ) : (
        <div>
          <h2>Logged in!</h2>
          <button onClick={fetchProjects}>Fetch Firebase Projects</button>
          <ul>
            {projects.map((p) => (
              <li key={p.projectId}>{p.displayName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
 */

import React, { useState, useEffect } from "react";

export default function AppTwo() {
  const [accessToken, setAccessToken] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "google_oauth_tokens") {
        console.log("Tokens received:", event.data.tokens);
        setAccessToken(event.data.tokens.access_token);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Function to start login (in popup)
  const handleLogin = () => {
    const width = 500,
      height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      "https://www.ideawp.com/wpchat/auth.php",
      "GoogleLogin",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  // Example: Fetch Firebase projects after login
  const fetchProjects = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(
        "https://firebase.googleapis.com/v1beta1/projects",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();
      console.log("Projects:", data);
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!accessToken ? (
        <button onClick={handleLogin}>Login with Google</button>
      ) : (
        <div>
          <h2>Logged in!</h2>
          <button onClick={fetchProjects}>Fetch Firebase Projects</button>
          <ul>
            {projects.map((p) => (
              <li key={p.projectId}>{p.displayName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
