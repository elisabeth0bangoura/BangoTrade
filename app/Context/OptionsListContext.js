
import React, { createContext, useState, useEffect } from 'react';

// Create Context
export const OptionsListContext = createContext();

// Create Context Provider
export const OptionsListContextProvider = ({ children }) => {
    const [Assets, setAssets] = useState([])
    const [ChoosedFilter, setChoosedFilter] = useState([])



    const [optionsMatchCount, setOptionsMatchCount] = useState(0);


    
 /*   useEffect(() => {
        console.log('🔄 IndicesList updated:', IndexState);
    }, [IndexState]);
*/
    return (
        <OptionsListContext.Provider value={{
            Assets, 
            setAssets,
            ChoosedFilter,
            setChoosedFilter,
            optionsMatchCount, setOptionsMatchCount
        }}>
            {children}
        </OptionsListContext.Provider>
    );
};
