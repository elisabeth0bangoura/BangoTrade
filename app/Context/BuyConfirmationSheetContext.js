// src/context/CoinPageContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const BuyConfirmationSheetContext = createContext();

// Create Context Provider
export const BuyConfirmationSheetContextProvider = ({ children }) => {
  const [BuyConfirmationSheetIndex, setBuyConfirmationSheetIndex] = useState(-1); // Initial state is null

  const [showToast, setShowToast] = useState(false);


  
  return (
    <BuyConfirmationSheetContext.Provider value={{ 
      BuyConfirmationSheetIndex, 
      setBuyConfirmationSheetIndex,
      showToast, 
      setShowToast
      }}>
      {children}
    </BuyConfirmationSheetContext.Provider>
  );
};
