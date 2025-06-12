// src/context/CoinPageContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const TrasnactionReceipeContext = createContext();

// Create Context Provider
export const TrasnactionReceipeProvider = ({ children }) => {
  const [CurrentChoosedAsset, setCurrentChoosedAsset] = useState(); // Initial state is null
  const [Investment, setInvestment] = useState(0)
  const [BankAccountNumber, setBankAccountNumber] = useState()
  const [PricePerShare, setPricePerShare] = useState("")

  
  return (
    <TrasnactionReceipeContext.Provider value={{ 
      CurrentChoosedAsset, 
      setCurrentChoosedAsset,
      Investment, setInvestment,
      BankAccountNumber, setBankAccountNumber,
      PricePerShare, setPricePerShare,
      }}>
      {children}
    </TrasnactionReceipeContext.Provider>
  );
};
