// ActionButton.jsx
import React from "react";

export default function ActionButton({ action, onClick, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      data-action={action}
      className={`p-3 text-white font-bold rounded m-3 active:scale-105 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
