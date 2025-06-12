import React, { createContext, useState } from "react";

// Create Context
export const LogInContext = createContext();




// ✅ Create Context Provider
export const LogInContextProvider = ({ children }) => {

  
  const [PhonenumberLogIn, setPhonenumberLogIn] = useState("");
	const [CurrentCode, setCurrentCode] = useState();
	const [ISO3Code, setIso3Code] = useState();

  

  return (
    <LogInContext.Provider
      value={{
        PhonenumberLogIn, 
        setPhonenumberLogIn,
       CurrentCode, setCurrentCode,
       ISO3Code, setIso3Code
      }}
    >
      {children}
    </LogInContext.Provider>
  );
};
