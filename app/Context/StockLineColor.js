// src/context/AnalyticsContext.js
import React, { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Create Context
export const StockLineContext = createContext();

// Create Context Provider
export const StockLineContextProvider = ({ children }) => {

  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  const [isSystemTheme, setIsSystemTheme] = useState(true); // Default state for system theme
  const [isAssetColorTheme, setIsAssetColorTheme] = useState(false); // Default state for asset color theme

    // Use useEffect to update FilterState when the language changes
  /*  useEffect(() => {
      setFilterState(t("OverallPositionHeader"));
    }, [i18n.language, t]);  // Trigger this effect whenever the language changes

    */


  return (
    <StockLineContext.Provider value={{ 
      isSystemTheme, 
      setIsSystemTheme,
      isAssetColorTheme, 
      setIsAssetColorTheme
     }}>
      {children}
    </StockLineContext.Provider>
  );
};
