// src/context/AnalyticsContext.js
import React, { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Create Context
export const AnalyticsContext = createContext();

// Create Context Provider
export const AnalyticsContextProvider = ({ children }) => {

  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


  const [FilterState, setFilterState] = useState(t("OverallPositionHeader"))

  const [hasCrypto, setHasCrypto] = useState(false);
  const [hasStocks, setHasStocks] = useState(false);
  const [hasEtfs, setHasEtfs] = useState(false);
  const [hasOptions, setHasOptions] = useState(false);

  

    // Use useEffect to update FilterState when the language changes
    useEffect(() => {
      setFilterState(t("OverallPositionHeader"));
    }, [i18n.language, t]);  // Trigger this effect whenever the language changes

    


  return (
    <AnalyticsContext.Provider value={{ 
      FilterState, 
      setFilterState,
      hasCrypto, setHasCrypto,
      hasStocks, setHasStocks,
      hasEtfs, setHasEtfs,
      hasOptions, setHasOptions,
     }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
