// src/context/DataContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const SearchContext = createContext();

// Create Context Provider
export const SearchContextProvider = ({ children }) => {
  const [SearchIndex, setSearchIndex] = useState(-1)
  const [SearchLoading, setSearchLoading] = useState(false)


  return (
    <SearchContext.Provider value={{ SearchIndex, setSearchIndex, SearchLoading, setSearchLoading }}>
      {children}
    </SearchContext.Provider>
  );
};
