// src/context/CoinPageContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const IFollowingsCoinsContext = createContext();

// Create Context Provider
export const IFollowingsCoinsSheetContextProvider = ({ children }) => {
  const [IFollowingsCoinsIndex, setIFollowingsCoinsIndex] = useState(-1); // Initial state is null

  return (
    <IFollowingsCoinsContext.Provider value={{ IFollowingsCoinsIndex, setIFollowingsCoinsIndex }}>
      {children}
    </IFollowingsCoinsContext.Provider>
  );
};
