import { createContext, useState } from "react";

//Step 1 - create context
export const ThemeContext = createContext();

//Step 2 - Create a Provider Component

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  const handleToggleTheme = () => { 
    return setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, handleToggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
