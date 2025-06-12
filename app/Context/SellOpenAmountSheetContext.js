// src/context/CoinPageContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const SellAmountContext = createContext();

// Create Context Provider
export const SellAmountSheetContextProvider = ({ children }) => {
  const [AmountIndex, setAmountIndex] = useState(-1); // Initial state is null
  const [value, setValue] = useState('0');
  const [valueShares, setValueShares] = useState('0'); // Formatted value for display
  const [CurrentBuyType, setCurrentBuyType] = useState("Shares")
  const [rawValueShares, setRawValuShares] = useState('0'); // Unformatted raw value (actual share count)
  const [rawValue, setRawValue] = useState('0'); // Store unformatted raw value
  const [OrderTypeIndex, setOrderTypeIndex] = useState(-1);
  const [SharesSellAmount, setSharesSellAmount] = useState("")
  const [AssetQty_available, setAssetQty_available] = useState()

  


  return (
    <SellAmountContext.Provider value={{ 
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
      SharesSellAmount, 
      setSharesSellAmount,
      setAssetQty_available,
      AssetQty_available,
      }}>
      {children}
    </SellAmountContext.Provider>
  );
};
