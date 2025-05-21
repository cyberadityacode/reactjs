import React, { useContext } from "react";
import { BioContext } from "./ContextAPIComponent";

export default function Home() {
  const value = useContext(BioContext);
  return <div>Home {value.secretData} -{value.personalInfo}</div>;
}
