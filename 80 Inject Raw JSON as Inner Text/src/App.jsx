import React from "react";

export default function App({ user, settings }) {
  return (
    <div>
      <h1>Welcome to React App</h1>

      <p>Hello, {user}</p>
      <p>Notification : {settings.notifications ? "On" : "Off"}</p>
    </div>
  );
}
