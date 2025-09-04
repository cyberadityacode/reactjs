
import React, { useState, useEffect } from "react";

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

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
      setProjects(data.results || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // Fetch details of a specific project
  const fetchProjectDetails = async (projectId) => {
    if (!accessToken) return;
    try {
      const res = await fetch(
        `https://firebase.googleapis.com/v1beta1/projects/${projectId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();
      console.log("Project details:", data);
      setSelectedProject(data);
    } catch (err) {
      console.error("Error fetching project details:", err);
    }
  };

  // Function to check if Firestore exists using backend
  const checkFirestoreStatus = async () => {
    if (!selectedProject || !accessToken) {
      alert("Please select a project and ensure you are logged in");
      return;
    }

    try {
      const res = await fetch("https://ideawp.com/wpchat/check_firestore.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          project_id: selectedProject.projectId
        })
      });
      const data = await res.json();
      console.log("firestore db --", data);
      if (data.has_firestore) {
        if (data.created) {
          alert(`✅ Firestore database CREATED successfully for project: ${selectedProject.projectId}`);
        } else {
          alert(`✅ Firestore is ENABLED for project: ${selectedProject.projectId}`);
        }
      } else {
        alert(`❌ Firestore is NOT enabled for project: ${selectedProject.projectId}. Error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error checking Firestore:", err);
      alert("Error checking Firestore status");
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
          <button onClick={checkFirestoreStatus} style={{ marginLeft: '10px' }}>
            Check Firestore Status
          </button>
          <ul>
            {projects.map((p) => (
              <li
                key={p.projectId}
                onClick={() => fetchProjectDetails(p.projectId)}
                style={{ cursor: 'pointer', color: 'blue' }}
              >
                {p.displayName}
              </li>
            ))}
          </ul>
          {selectedProject && (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
              <h3>Project Details</h3>
              <p><strong>Project ID:</strong> {selectedProject.projectId}</p>
              <p><strong>Display Name:</strong> {selectedProject.displayName}</p>
              <p><strong>Project Number:</strong> {selectedProject.projectNumber}</p>
              <p><strong>State:</strong> {selectedProject.state}</p>

              {/* Database Status */}
              <div style={{ marginTop: '10px' }}>
                <h4>Database Status:</h4>
                <p><strong>Realtime Database:</strong> {
                  selectedProject.resources?.realtimeDatabaseInstance ?
                    `Enabled (${selectedProject.resources.realtimeDatabaseInstance})` :
                    'Not Enabled'
                }</p>
                <p><strong>Firestore:</strong> {
                  selectedProject.resources?.firestoreInstance ?
                    `Enabled (${selectedProject.resources.firestoreInstance})` :
                    'Not Enabled'
                }</p>
              </div>

              {selectedProject.resources && (
                <div>
                  <h4>All Resources:</h4>
                  <ul>
                    {Object.entries(selectedProject.resources).map(([key, value]) => (
                      <li key={key}><strong>{key}:</strong> {JSON.stringify(value)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
