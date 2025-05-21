import React from "react";
import { ThemeProvider } from "../components/ToggleLightDark";
import Home from "../components/Home";

export default function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}
