// src/context/CoinPageContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const PriceTrackerContext = createContext();

// Create Context Provider
export const PriceTrackerSheetContextProvider = ({ children }) => {
  const [PriceTrackerIndex, setPriceTrackerIndex] = useState(-1); // Initial state is null
  const [CurrentBuyType, setCurrentBuyType] = useState("Amount")
  const [value, setValue] = useState('0');
  const [rawValue, setRawValue] = useState('0'); // Store unformatted raw value
  const [valueShares, setValueShares] = useState('0'); // Formatted value for display
const [rawValueShares, setRawValuShares] = useState('0'); // Unformatted raw value (actual share count)


  return (
    <PriceTrackerContext.Provider value={{ 
      PriceTrackerIndex, 
      setPriceTrackerIndex,
      CurrentBuyType, 
      setCurrentBuyType,
      value, 
      setValue,
      rawValue, 
      setRawValue,
      valueShares, 
      setValueShares,
      rawValueShares, 
      setRawValuShares,

      }}>
      {children}
    </PriceTrackerContext.Provider>
  );
};
