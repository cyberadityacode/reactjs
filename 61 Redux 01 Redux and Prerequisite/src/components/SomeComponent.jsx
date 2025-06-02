import React, { useContext } from "react";
import { BioContext, useBioContext } from "./useContext/UseContextFirst";

export default function SomeComponent() {
  const { secretData } = useBioContext(); // ✅ destructure safely through hook
  return <div>SomeComponent {secretData}</div>;
}
