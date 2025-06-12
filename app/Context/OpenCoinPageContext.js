// src/context/CoinPageContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const CoinPageContext = createContext();

// Create Context Provider
export const CoinPageContextProvider = ({ children }) => {
  const [CoinPageIndex, setCoinPageIndex] = useState(-1); // Initial state is null
  const [CurrentBackgroundColorForCoin, setCurrentBackgroundColorForCoin] = useState("#0F0F0F")
  const [coinSymbol, setCoinSymbol] = useState("")

 
  const [coinData, setCoinData] = useState({
    price: null,
    name: '',
    symbol: '',
    image: '',
    dominantColor: '#1E1E1F', // Default color
    information: "",
  });


  return (
    <CoinPageContext.Provider value={{ 
      CoinPageIndex, 
      setCoinPageIndex, 
      CurrentBackgroundColorForCoin, 
      setCurrentBackgroundColorForCoin,
      coinData, setCoinData,
      coinSymbol, setCoinSymbol
     }}>
      {children}
    </CoinPageContext.Provider>
  );
};
