import React from "react";
import useOnlineStatus from "./useOnlineStatus";

export default function MyCustomHook() {
  const isOnline = useOnlineStatus();
  const handleSaveClick = () => {
    console.log("Progress Saved Brother");
  };

  return (
    <div>
      <h1>My Custom Hook to Check whether the app is online or offline</h1>
      <button
        className="border p-3 m-3 bg-blue-500 text-white font-bold hover:bg-blue-800"
        disabled={!isOnline}
        onClick={handleSaveClick}
      >
        {isOnline ? "Save Progress" : "Reconnecting..."}
      </button>
    </div>
  );
}
