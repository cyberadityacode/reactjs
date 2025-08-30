import React, { useState } from "react";

const CLIENT_ID =
  "20732608927-qubpa1bde55qjm2mpokmc6r7giuk6ot6.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:5173";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [rulesEditor, setRulesEditor] = useState("");
  const [selectedRTDBProject, setSelectedRTDBProject] = useState(null);
  const [rtdbRulesEditor, setRTDBRulesEditor] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // For service account key
  const [serviceAccountKeys, setServiceAccountKeys] = useState({});
  const [showServiceAccountModal, setShowServiceAccountModal] = useState(false);
  const [selectedProjectForKey, setSelectedProjectForKey] = useState(null);
  const [apiEnabling, setApiEnabling] = useState(false);

  const handleLogin = () => {
    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: "https://www.googleapis.com/auth/cloud-platform",
      ux_mode: "popup",
      redirect_uri: REDIRECT_URI,
      callback: async (response) => {
        try {
          const res = await fetch(
            // "http://localhost/php/firebasecheck/auth.php",
            "https://ideawp.com/wpchat/auth.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: response.code }),
            }
          );
          const tokenData = await res.json();
          console.log("Backend Token Response:", tokenData);

          if (!tokenData.access_token) {
            throw new Error(tokenData.error || "Failed to get access_token");
          }

          setAccessToken(tokenData.access_token);
          await fetchProjects(tokenData.access_token);
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
    });

    client.requestCode();
  };

  const fetchProjects = async (token) => {
    const resp = await fetch(
      // "http://localhost/php/firebasecheck/listProjects.php",
      "https://ideawp.com/wpchat/listProjects.php",

      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }
    );
    const data = await resp.json();
    console.log("Firebase projects:", data);
    setProjects(data.results || []);
  };

  const createProject = async () => {
    if (!accessToken) return alert("Login first");
    const projectId = (newProjectName || `proj-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .slice(0, 30);

    try {
      const res = await fetch(
        // "http://localhost/php/firebasecheck/createProject.php",
        "https://ideawp.com/wpchat/createProject.php",

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: accessToken,
            projectId,
            displayName: newProjectName || "My New Project",
          }),
        }
      );
      const data = await res.json();
      console.log("Created project:", data);

      await fetchProjects(accessToken);
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  const fetchFirestoreRules = async (projectId) => {
    if (!accessToken) return alert("Login first");
    try {
      const res = await fetch(
        // "http://localhost/php/firebasecheck/getFirestoreRules.php",
        "https://ideawp.com/wpchat/getFirestoreRules.php",

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: accessToken, projectId }),
        }
      );
      const data = await res.json();
      console.log("Firestore Rules:", data);

      if (data.source && data.source.files && data.source.files[0]) {
        const rulesText = data.source.files[0].content;
        setSelectedProject(projectId);
        setRulesEditor(rulesText);
      } else {
        alert("No rules found or error fetching rules");
      }
    } catch (err) {
      console.error("Error fetching rules:", err);
      alert("Failed to fetch rules. Check console for details.");
    }
  };

  // Updated function - using PHP proxy to avoid CORS
  const updateFirestoreRules = async (projectId, rulesContent) => {
    if (!accessToken) return alert("Login first");

    setIsUpdating(true);
    try {
      console.log("Sending request to update rules...", {
        projectId,
        rulesContentLength: rulesContent.length,
        tokenLength: accessToken.length,
      });

      const res = await fetch(
        // "http://localhost/php/firebasecheck/updateFirestoreRules.php",
        "https://ideawp.com/wpchat/updateFirestoreRules.php",

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: accessToken,
            projectId: projectId,
            rulesContent: rulesContent,
          }),
        }
      );

      console.log("Response status:", res.status, res.statusText);

      // Get response text first to debug
      const responseText = await res.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error(
          `Server returned invalid JSON. Status: ${
            res.status
          }. Response: ${responseText.substring(0, 200)}...`
        );
      }

      console.log("Parsed response data:", data);

      if (data.success) {
        alert("Firestore rules updated successfully! ");
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (err) {
      console.error("Error updating Firestore rules:", err);
      alert(`Failed to update Firestore rules: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Alternative direct API approach (if you want to handle CORS differently)
  const updateFirestoreRulesDirect = async (projectId, rulesContent) => {
    if (!accessToken) return alert("Login first");

    setIsUpdating(true);
    try {
      // Step 1: Create a new Ruleset
      const rulesetRes = await fetch(
        `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: {
              files: [
                {
                  name: "firestore.rules",
                  content: rulesContent,
                },
              ],
            },
          }),
        }
      );

      const ruleset = await rulesetRes.json();
      console.log("Created ruleset:", ruleset);

      if (ruleset.error) {
        throw new Error(`Ruleset creation failed: ${ruleset.error.message}`);
      }

      if (!ruleset.name) {
        throw new Error("No ruleset name returned from API");
      }

      // Step 2: Update the release to use the new ruleset
      const releaseRes = await fetch(
        `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases/cloud.firestore`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            release: {
              name: `projects/${projectId}/releases/cloud.firestore`,
              rulesetName: ruleset.name,
            },
          }),
        }
      );

      const release = await releaseRes.json();
      console.log("Updated release:", release);

      if (release.error) {
        throw new Error(`Release update failed: ${release.error.message}`);
      }

      alert("Firestore rules updated successfully! ");
    } catch (err) {
      console.error("Error updating Firestore rules:", err);
      alert(`Failed to update Firestore rules: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch Realtime Database Rules
  const fetchRealtimeDatabaseRules = async (projectId) => {
    if (!accessToken) return alert("Login first");

    try {
      const res = await fetch(
        // "http://localhost/php/firebasecheck/getRealtimeDatabaseRules.php",
        "https://ideawp.com/wpchat/getRealtimeDatabaseRules.php",

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: accessToken, projectId }),
        }
      );

      const responseText = await res.text();
      console.log("Raw RTDB rules response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}`
        );
      }

      console.log("RTDB Rules Response:", data);

      if (data.success) {
        setSelectedRTDBProject(projectId);
        setRTDBRulesEditor(JSON.stringify(data.rules, null, 2));
      } else if (data.needsCreation) {
        if (
          confirm(
            "Realtime Database doesn't exist for this project. Would you like to create it?"
          )
        ) {
          await createRealtimeDatabase(projectId);
        }
      } else {
        throw new Error(data.error || "Failed to fetch RTDB rules");
      }
    } catch (err) {
      console.error("Error fetching RTDB rules:", err);
      alert(`Failed to fetch RTDB rules: ${err.message}`);
    }
  };

  // Update Realtime Database Rules
  const updateRealtimeDatabaseRules = async (projectId, rulesContent) => {
    if (!accessToken) return alert("Login first");

    setIsUpdating(true);
    try {
      let parsedRules;
      try {
        parsedRules = JSON.parse(rulesContent);
      } catch (parseError) {
        throw new Error("Rules must be valid JSON format");
      }

      const res = await fetch(
        // "http://localhost/php/firebasecheck/updateRealtimeDatabaseRules.php",
        "https://ideawp.com/wpchat/updateRealtimeDatabaseRules.php",

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: accessToken,
            projectId: projectId,
            rules: parsedRules,
          }),
        }
      );

      const responseText = await res.text();
      console.log("Raw RTDB update response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}`
        );
      }

      console.log("RTDB Update Response:", data);

      if (data.success) {
        alert("Realtime Database rules updated successfully! ");
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (err) {
      console.error("Error updating RTDB rules:", err);
      alert(`Failed to update RTDB rules: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Create Realtime Database instance
  const createRealtimeDatabase = async (projectId) => {
    if (!accessToken) return alert("Login first");

    setIsUpdating(true);
    try {
      console.log("Creating/checking RTDB instance for project:", projectId);

      const res = await fetch(
        // "http://localhost/php/firebasecheck/createRealtimeDatabase.php",
        "https://ideawp.com/wpchat/createRealtimeDatabase.php",

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: accessToken,
            projectId: projectId,
          }),
        }
      );

      const responseText = await res.text();
      console.log("Raw RTDB creation response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}`
        );
      }

      console.log("RTDB Creation Response:", data);

      if (data.success) {
        alert(
          "Realtime Database is ready!  You can now fetch and update rules."
        );
      } else if (data.consoleUrl) {
        // Show detailed instructions for manual creation
        const message = `${data.error}\n\n${
          data.message
        }\n\nSteps:\n${data.instructions.join(
          "\n"
        )}\n\nWould you like to open Firebase Console?`;
        if (confirm(message)) {
          window.open(data.consoleUrl, "_blank");
        }
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (err) {
      console.error("Error with RTDB:", err);
      alert(`RTDB operation failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to enable required APIs
  const enableRequiredAPIs = async (projectId) => {
    if (!accessToken) return alert("Login first");

    setApiEnabling(true);
    try {
      console.log("Enabling required APIs for project:", projectId);

      const res = await fetch(
        // "http://localhost/php/firebasecheck/enableAPIs.php",
        "https://ideawp.com/wpchat/enableAPIs.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: accessToken,
            projectId: projectId,
          }),
        }
      );

      const responseText = await res.text();
      console.log("Raw API enable response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}`
        );
      }

      console.log("API Enable Response:", data);

      if (data.success) {
        alert(`APIs enabled successfully! ${data.waitTime}`);
      } else {
        if (data.manualUrl) {
          const message = `Some APIs could not be enabled automatically.\n\nWould you like to open Google Cloud Console to enable them manually?`;
          if (confirm(message)) {
            window.open(data.manualUrl, "_blank");
          }
        }
        throw new Error(data.message || "Failed to enable APIs");
      }
    } catch (err) {
      console.error("Error enabling APIs:", err);
      alert(`Failed to enable APIs: ${err.message}`);
    } finally {
      setApiEnabling(false);
    }
  };
  // Function to create and get service account key
  const getServiceAccountKey = async (projectId) => {
    if (!accessToken) return alert("Login first");

    setIsUpdating(true);
    try {
      console.log("Creating service account key for project:", projectId);

      const res = await fetch(
        // "http://localhost/php/firebasecheck/getServiceAccountKey.php",
        // "http://localhost/php/firebasecheck/getServiceAccountKey.php",
        "https://ideawp.com/wpchat/getServiceAccountKey.php",

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: accessToken,
            projectId: projectId,
            keyName: `firebase-admin-${Date.now()}`,
          }),
        }
      );

      const responseText = await res.text();
      console.log("Raw service account response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}`
        );
      }

      console.log("Service Account Response:", data);

      if (data.success) {
        // Store the service account key
        setServiceAccountKeys((prev) => ({
          ...prev,
          [projectId]: data.serviceAccountKey,
        }));

        setSelectedProjectForKey(projectId);
        setShowServiceAccountModal(true);

        alert("Service account key created successfully!");
      } else if (data.needsApiEnabled) {
        // API needs to be enabled
        const message = `${data.error}\n\nRequired API: ${data.api}\n\nWould you like to enable it automatically? (This may take 2-3 minutes to propagate)`;
        if (confirm(message)) {
          await enableRequiredAPIs(projectId);
        } else if (data.enableUrl) {
          window.open(data.enableUrl, "_blank");
        }
      } else {
        throw new Error(data.error || "Failed to create service account key");
      }
    } catch (err) {
      console.error("Error creating service account key:", err);
      alert(`Failed to create service account key: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to download service account key as JSON file
  const downloadServiceAccountKey = (projectId) => {
    const keyData = serviceAccountKeys[projectId];
    if (!keyData) {
      alert("No service account key found for this project");
      return;
    }

    const dataStr = JSON.stringify(keyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectId}-firebase-adminsdk.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Function to copy service account key to clipboard
  const copyServiceAccountKey = (projectId) => {
    const keyData = serviceAccountKeys[projectId];
    if (!keyData) {
      alert("No service account key found for this project");
      return;
    }

    navigator.clipboard
      .writeText(JSON.stringify(keyData, null, 2))
      .then(() => alert("Service account key copied to clipboard!"))
      .catch((err) => {
        console.error("Failed to copy to clipboard:", err);
        alert("Failed to copy to clipboard. Check console for details.");
      });
  };

  return (
    <div
      className="App"
      style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}
    >
      <h1>Firebase Projects Manager</h1>

      <button
        onClick={handleLogin}
        style={{
          backgroundColor: "#4285f4",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Login with Google
      </button>

      {accessToken && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#f0f8ff",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>Access Token:</strong> {accessToken.substring(0, 20)}...
          </p>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "3px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={createProject}
              style={{
                backgroundColor: "#34a853",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Create Project
            </button>
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2>Your Firebase Projects:</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {projects.map((proj) => (
              <li
                key={proj.projectId}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  <strong>{proj.displayName}</strong> ({proj.projectId})
                </span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => fetchFirestoreRules(proj.projectId)}
                    style={{
                      backgroundColor: "#ff9800",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    View Firestore Rules
                  </button>
                  <button
                    onClick={() => fetchRealtimeDatabaseRules(proj.projectId)}
                    style={{
                      backgroundColor: "#9c27b0",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    View RTDB Rules
                  </button>
                  <button
                    onClick={() => createRealtimeDatabase(proj.projectId)}
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Create RTDB
                  </button>
                  <button
                    onClick={() => getServiceAccountKey(proj.projectId)}
                    disabled={isUpdating}
                    style={{
                      backgroundColor: isUpdating ? "#ccc" : "#28a745",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: isUpdating ? "not-allowed" : "pointer",
                    }}
                  >
                    {isUpdating ? "Creating..." : "Get Service Key"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedProject && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f5f5f5",
            borderRadius: "5px",
          }}
        >
          <h2>Editing Firestore Rules for: {selectedProject}</h2>
          <textarea
            value={rulesEditor}
            onChange={(e) => setRulesEditor(e.target.value)}
            rows={20}
            cols={100}
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "3px",
              backgroundColor: "#fff",
            }}
            placeholder="Firestore rules will appear here..."
          />
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button
              onClick={() => updateFirestoreRules(selectedProject, rulesEditor)}
              disabled={isUpdating}
              style={{
                backgroundColor: isUpdating ? "#ccc" : "#dc3545",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: isUpdating ? "not-allowed" : "pointer",
              }}
            >
              {isUpdating ? "Updating..." : "Save Rules (via PHP)"}
            </button>

            <button
              onClick={() =>
                updateFirestoreRulesDirect(selectedProject, rulesEditor)
              }
              disabled={isUpdating}
              style={{
                backgroundColor: isUpdating ? "#ccc" : "#17a2b8",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: isUpdating ? "not-allowed" : "pointer",
              }}
            >
              {isUpdating ? "Updating..." : "Save Rules (Direct API)"}
            </button>

            <button
              onClick={() => {
                setSelectedProject(null);
                setRulesEditor("");
              }}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close Editor
            </button>
          </div>

          <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
            <strong>Note:</strong> Use "PHP" method if you have CORS issues, or
            "Direct API" if your browser allows cross-origin requests.
          </p>
        </div>
      )}

      {selectedRTDBProject && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f0f4ff",
            borderRadius: "5px",
          }}
        >
          <h2>Editing RTDB Rules for: {selectedRTDBProject}</h2>
          <textarea
            value={rtdbRulesEditor}
            onChange={(e) => setRTDBRulesEditor(e.target.value)}
            rows={20}
            cols={100}
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "3px",
              backgroundColor: "#fff",
            }}
            placeholder="Realtime Database rules (JSON format) will appear here..."
          />
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button
              onClick={() =>
                updateRealtimeDatabaseRules(
                  selectedRTDBProject,
                  rtdbRulesEditor
                )
              }
              disabled={isUpdating}
              style={{
                backgroundColor: isUpdating ? "#ccc" : "#9c27b0",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: isUpdating ? "not-allowed" : "pointer",
              }}
            >
              {isUpdating ? "Updating..." : "Save RTDB Rules"}
            </button>

            <button
              onClick={() => {
                setSelectedRTDBProject(null);
                setRTDBRulesEditor("");
              }}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close Editor
            </button>
          </div>

          <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
            <strong>Note:</strong> Rules should be in JSON format. The system
            will automatically create RTDB if it doesn't exist.
          </p>
        </div>
      )}

      {/* Service Account Key Modal - Add this after your existing JSX */}
      {showServiceAccountModal &&
        selectedProjectForKey &&
        serviceAccountKeys[selectedProjectForKey] && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                maxWidth: "800px",
                maxHeight: "80vh",
                overflow: "auto",
                position: "relative",
              }}
            >
              <button
                onClick={() => setShowServiceAccountModal(false)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>

              <h2 style={{ marginBottom: "20px" }}>Service Account Key</h2>
              <p style={{ marginBottom: "15px", color: "#666" }}>
                <strong>Project:</strong> {selectedProjectForKey}
              </p>

              <div
                style={{ marginBottom: "20px", display: "flex", gap: "10px" }}
              >
                <button
                  onClick={() =>
                    downloadServiceAccountKey(selectedProjectForKey)
                  }
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Download JSON
                </button>

                <button
                  onClick={() => copyServiceAccountKey(selectedProjectForKey)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Copy to Clipboard
                </button>
              </div>

              <textarea
                value={JSON.stringify(
                  serviceAccountKeys[selectedProjectForKey],
                  null,
                  2
                )}
                readOnly
                rows={20}
                style={{
                  width: "100%",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  backgroundColor: "#f8f9fa",
                  resize: "vertical",
                }}
              />

              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  backgroundColor: "#fff3cd",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              >
                <strong>⚠️ Important:</strong> Keep this service account key
                secure! It provides administrative access to your Firebase
                project. Never commit it to version control or share it
                publicly.
              </div>
            </div>
          </div>
        )}

      {/* Usage example component */}
      {serviceAccountKeys[selectedProjectForKey] && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e8f5e8",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          <h3>Usage Examples:</h3>
          <p>
            <strong>Node.js (Firebase Admin SDK):</strong>
          </p>
          <pre
            style={{
              backgroundColor: "#f1f1f1",
              padding: "10px",
              borderRadius: "3px",
              overflow: "auto",
            }}
          >
            {`const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://${selectedProjectForKey}-default-rtdb.firebaseio.com'
});

const db = admin.firestore();
const auth = admin.auth();`}
          </pre>

          <p>
            <strong>Environment Variables (.env):</strong>
          </p>
          <pre
            style={{
              backgroundColor: "#f1f1f1",
              padding: "10px",
              borderRadius: "3px",
              overflow: "auto",
            }}
          >
            {`FIREBASE_PROJECT_ID="${
              serviceAccountKeys[selectedProjectForKey]?.project_id || ""
            }"
FIREBASE_CLIENT_EMAIL="${
              serviceAccountKeys[selectedProjectForKey]?.client_email || ""
            }"
FIREBASE_PRIVATE_KEY="${
              serviceAccountKeys[selectedProjectForKey]?.private_key || ""
            }"
FIREBASE_PRIVATE_KEY_ID="${
              serviceAccountKeys[selectedProjectForKey]?.private_key_id || ""
            }"`}
          </pre>
        </div>
      )}
    </div>
  );
}
