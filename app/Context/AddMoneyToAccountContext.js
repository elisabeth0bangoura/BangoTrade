// src/context/CoinPageContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const AddMoneyToAccountContext = createContext();

// Create Context Provider
export const AddMoneyToAccountContextProvider = ({ children }) => {
  const [AddMoneyToAccountIndex, setAddMoneyToAccountIndex] = useState(-1); // Initial state is null
  const [AddBankDetailsToAccountIndex, setAddBankDetailsToAccountIndex] = useState(-1); // Initial state is null
  const [BankCodeType, setBankCodeType] = useState("")
 

  return (
    <AddMoneyToAccountContext.Provider value={{
       AddMoneyToAccountIndex, 
       setAddMoneyToAccountIndex ,
       AddBankDetailsToAccountIndex, 
       setAddBankDetailsToAccountIndex,
       BankCodeType, setBankCodeType
       
       }}>
      {children}
    </AddMoneyToAccountContext.Provider>
  );
};
