// src/context/CoinPageContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const HomeChartContext = createContext();

// Create Context Provider
export const HomeChartContextProvider = ({ children }) => {


  const [ShowHomeChart, setShowHomeChart] = useState(true); // Store current price

  const [currentPrice, setCurrentPrice] = useState(0); // Store current price
  const [currentDate, setCurrentDate] = useState(null); // Store current date
  const [percentageChange, setPercentageChange] = useState(0); // Store percentage change
  const [dollarChange, setDollarChange] = useState(0); // Store dollar change
  const [priceChangeColor, setPriceChangeColor] = useState('#00CE39'); 
  const [MetricsState, setMetricsState] = useState('Since brought percentage'); 
  const [percentageChangeColor, setPercentageChangeColor] = useState("#00CE39");  // Default to green
  const [dollarChangeColor, setDollarChangeColor] = useState("#00CE39");  // Default to green
  const [StopRealtimeInHomeChart1D, setStopRealtimeInHomeChart1D] = useState(false)
  
  

  
  return (
    <HomeChartContext.Provider value={{ 
      currentPrice, 
      setCurrentPrice,
      currentDate, 
      setCurrentDate,
      percentageChange, 
      setPercentageChange,
      dollarChange, 
      setDollarChange,
      priceChangeColor, 
      setPriceChangeColor,
      percentageChangeColor, setPercentageChangeColor,
      dollarChangeColor, setDollarChangeColor,
      MetricsState, 
      setMetricsState,
      StopRealtimeInHomeChart1D, 
      setStopRealtimeInHomeChart1D,
      ShowHomeChart, setShowHomeChart,
      }}>
      {children}
    </HomeChartContext.Provider>
  );
};
