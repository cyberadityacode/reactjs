import { createContext, useContext } from "react";

// Step 1 - create a context - it will return Context Component -Follow Pascal convention
export const BioContext = createContext();

// Step 2 - create a context provider - your delivery agent to deal with data parcel.

export const BioProvider = ({ children }) => {
  const secretData = "esoteric secret recipe";
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


// Custom Hooks

export const useBioContext =()=>{
    const context = useContext(BioContext);
    if(context ===undefined){
        throw new Error("Bro...Component must be wrapped with BioProvider")
    }

    return context;
}