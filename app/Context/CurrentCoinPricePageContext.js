import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CurrentPriceContext = createContext();

export const CurrentPriceProvider = ({ children }) => {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [percentageChange, setPercentageChange] = useState(0);
  const [coinDetails, setCoinDetails] = useState({}); // For extended coin data, if needed

  const updateCoinDetails = useCallback((data) => {
    if (data) {
      const { price, timestamp, percentageChange } = data;
      setCurrentPrice(price);
      setCurrentDate(
        new Date(timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      );
      setPercentageChange(percentageChange);
      setCoinDetails({
        price,
        date: new Date(timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        percentageChange,
      });
    }
  }, []);

  useEffect(() => {
    console.log('Updated Coin Details:', coinDetails);
  }, [coinDetails]);

  return (
    <CurrentPriceContext.Provider
      value={{
        currentPrice,
        setCurrentPrice,
        currentDate,
        setCurrentDate,
        percentageChange,
        setPercentageChange,
        coinDetails,
        setCoinDetails,
        updateCoinDetails, // A helper function for updating all values at once
      }}
    >
      {children}
    </CurrentPriceContext.Provider>
  );
};
