// src/context/DataContext.js
import React, { createContext, useState } from 'react';

// Create Context
export const Search2Context = createContext();

// Create Context Provider
export const Search2ContextProvider = ({ children }) => {
  const [SearchIndex2, setSearchIndex2] = useState(-1);
  const [SearchIndex3, setSearchIndex3 ] =  useState(-1);

  return (
    <Search2Context.Provider value={{ SearchIndex2, setSearchIndex2, SearchIndex3, setSearchIndex3 }}>
      {children}
    </Search2Context.Provider>
  );
};
