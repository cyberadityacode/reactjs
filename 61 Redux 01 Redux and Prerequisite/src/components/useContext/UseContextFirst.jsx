import { createContext, useContext } from "react";
// Step 1- Create a context - It will return Context Component

export const BioContext = createContext();

// Step 2- Create a context provider - your delivery agent to deal with data parcel

export const BioProvider = ({ children }) => {
  const secretData = "secret data 1077";
  const personalInfo = "I have the power of universe";

  return (
    <BioContext.Provider value={{ secretData, personalInfo }}>
      {children}
    </BioContext.Provider>
  );
};

/* 
Step 3 - Consume the value using useContext hook

in your GrandGrandChild Component or nested child Component
const value = useContext(BioContext);

*/

// custom Hook to warn a Component that they are not the part of BioContext

export const useBioContext = () => {
  const context = useContext(BioContext);
  if (!context) {
    const errorMsg =
      "❌ Bro, Component must be wrapped with <BioProvider> in App.jsx/main.jsx.";
    console.error(errorMsg); // 👈 This ensures it logs to the console
    throw new Error(errorMsg);
  }
  return context;
};
