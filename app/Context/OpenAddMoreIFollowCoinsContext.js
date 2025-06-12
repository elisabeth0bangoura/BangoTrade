// src/context/CoinPageContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const OpenAddMoreIFollowCoinsContext = createContext();

// Create Context Provider
export const OpenAddMoreIFollowCoinsContextProvider = ({ children }) => {
  const [OpenAddMoreIFollowCoinsIndex, setOpenAddMoreIFollowCoinsIndex] = useState(-1); // Initial state is null
  const [FilterState, setFilterState] = useState("Daily Trend"); // Initial state is null
  const [FilterStateUpDown, setFilterStateUpDown] = useState("desc"); // Initial state is null
  const [combinedPercentage, setCombinedPercentage] = useState(0);  // Add this


  


  
  return (
    <OpenAddMoreIFollowCoinsContext.Provider value={{ 
      OpenAddMoreIFollowCoinsIndex, 
      setOpenAddMoreIFollowCoinsIndex,
      FilterState,
      setFilterState,
      FilterStateUpDown,
      setFilterStateUpDown,
      combinedPercentage,           // Provide combinedPercentage
      setCombinedPercentage,        // Provide function to update it

      }}>
      {children}
    </OpenAddMoreIFollowCoinsContext.Provider>
  );
};
