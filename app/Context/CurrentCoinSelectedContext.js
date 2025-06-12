// src/context/CurrentCoinSelectedContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const CurrentCoinSelectedContext = createContext();

// Create Context Provider
export const CurrentCoinSelectedContextProvider = ({ children }) => {
  const [CurrentCoinSelected, setCurrentCoinSelected] = useState(null); // Initial state is null

  return (
    <CurrentCoinSelectedContext.Provider value={{ CurrentCoinSelected, setCurrentCoinSelected }}>
      {children}
    </CurrentCoinSelectedContext.Provider>
  );
};
