// src/context/CoinPageContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const AmountContext = createContext();

// Create Context Provider
export const AmountSheetContextProvider = ({ children }) => {
  const [AmountIndex, setAmountIndex] = useState(-1); // Initial state is null
  const [value, setValue] = useState('0');
  const [valueShares, setValueShares] = useState('0'); // Formatted value for display
  const [CurrentBuyType, setCurrentBuyType] = useState("Amount")
  const [rawValueShares, setRawValuShares] = useState('0'); // Unformatted raw value (actual share count)
  const [rawValue, setRawValue] = useState('0'); // Store unformatted raw value
  const [OrderTypeIndex, setOrderTypeIndex] = useState(-1);


  return (
    <AmountContext.Provider value={{ 
      AmountIndex, 
      setAmountIndex, 
      value, 
      setValue,
      valueShares, 
      setValueShares,
      CurrentBuyType, 
      setCurrentBuyType,
      rawValueShares, 
      setRawValuShares,
      rawValue, 
      setRawValue,
      OrderTypeIndex, 
      setOrderTypeIndex,
      }}>
      {children}
    </AmountContext.Provider>
  );
};
