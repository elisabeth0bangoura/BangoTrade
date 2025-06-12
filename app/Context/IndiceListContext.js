
import React, { createContext, useState, useEffect } from 'react';

// Create Context
export const IndiceListContext = createContext();

// Create Context Provider
export const IndiceListContextProvider = ({ children }) => {
    const [IndexState, setIndexState] = useState([]);
    const [industryState, setIndustryState] = useState([]);
    const [IssuerState, setIssuerState] = useState([]);
    const [trendingCoinsData, setTrendingCoinsData] = useState([]);
    const [ChoosedIndice, setChoosedIndice] = useState([]); // ← Array of selected indices
    const [ChoosedIndustry, setChoosedIndustry] = useState([]); // ← Array of selected indices
    const [ChoosedIssuer, setChoosedIssuer] = useState([]);
    const [etfMatchCount, setEtfMatchCount] = useState(0);




    const [ChoosedExchange, setChoosedExchange] = useState([])
    const [ChoosedMarket, setChoosedMarket] = useState([])
    const [ChoosedCurrency, setChoosedCurrency] = useState([])
    const [ChoosedLocale, setChoosedLocale] = useState([])

    



const [exchangeOptions, setExchangeOptions] = useState([]);
const [currencyOptions, setCurrencyOptions] = useState([]);
const [localeOptions, setLocaleOptions] = useState([]);
const [marketOptions, setMarketOptions] = useState([]);




    // ✅ NEW: full fetched data (not batched)
    const [fullEtfList, setFullEtfList] = useState([]);

    useEffect(() => {
        console.log('🔄 IndicesList updated:', IndexState);
    }, [IndexState]);

    return (
        <IndiceListContext.Provider value={{
            IndexState,
            setIndexState,
            industryState,
            setIndustryState,
            IssuerState,
            setIssuerState,
            trendingCoinsData, 
            setTrendingCoinsData,
            ChoosedIndice, 
            setChoosedIndice,
            etfMatchCount, 
            setEtfMatchCount,
            ChoosedIndustry, 
            setChoosedIndustry,  
            ChoosedIssuer, 
            setChoosedIssuer,
            ChoosedMarket, 
            setChoosedMarket,

            ChoosedCurrency, setChoosedCurrency,
            ChoosedLocale, setChoosedLocale,

            ChoosedExchange, setChoosedExchange,
            exchangeOptions, setExchangeOptions,
            currencyOptions, setCurrencyOptions,
            localeOptions, setLocaleOptions,
            marketOptions, setMarketOptions
            
        }}>
            {children}
        </IndiceListContext.Provider>
    );
};
