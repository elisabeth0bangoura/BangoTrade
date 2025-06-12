// src/context/CoinPageContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const ToastMessageContext = createContext();

// Create Context Provider
export const ToastMessageContextProvider = ({ children }) => {

const [showToast, setShowToast] = useState(false);
const [ShowToastDeposit, setShowToastDeposit] = useState(false);
const [showToastSell, setShowToastSell] = useState(false);
const [showTransferBtn, setShowTrasnferBtn] = useState(false);
const [showChangedPhoneNumber, setshowChangedPhoneNumber] = useState(false);
const [ShowChangedEmail, setshowChangedEmail] = useState(false);
const [ShowUpdatedPin, setShowUpdatedPin] = useState(false);
const [ShowPriceTickerSaved, setShowPriceTickerSaved] = useState(false);
const [ShowNoMoneyToWidthraw, setShowNoMoneyToWidthraw] = useState(false);
const [PlacedOrder, setPlacedOrder] = useState(false)
const [PlacedTracker, setPlacedTracker] = useState(false)
const [SellPlacedOrder, setSellPlacedOrder] = useState(false)

  
  return (
    <ToastMessageContext.Provider value={{ 

      showToast, 
      setShowToast,
      ShowToastDeposit, 
      setShowToastDeposit,
      showToastSell, 
      setShowToastSell,
      showTransferBtn, 
      setShowTrasnferBtn,
      showChangedPhoneNumber, 
      setshowChangedPhoneNumber,
      ShowChangedEmail, setshowChangedEmail,
      ShowUpdatedPin, setShowUpdatedPin,
      ShowPriceTickerSaved, setShowPriceTickerSaved,
      ShowNoMoneyToWidthraw, setShowNoMoneyToWidthraw,
      PlacedOrder, setPlacedOrder,
      PlacedTracker, setPlacedTracker,
      SellPlacedOrder, setSellPlacedOrder
      }}>
      {children}
    </ToastMessageContext.Provider>
  );
};
