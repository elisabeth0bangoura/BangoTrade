import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StockLineContext } from './StockLineColor';

// Create Context
export const ViewModeContext = createContext();

// Define your themes
const themes = {
  light: {
    Mode_Name: "The White Theme",
    Mode_bg: "#FFFFFF",
    Mode_bg_Home: "#FFFFFF",
    Mode_fontColor: "#000000",
    Mode_Sec_fontColor: "#BDC3CD",
    Mode_Third_fontColor: "#A5AEB8",
    Mode_secbg_Home: "#F28F0C",
    Mode_StockLine: "#000",
    Mode_HorizontalLine: "#D3DAE0",
    Mode_SecStockLine_Home: "#D3DAE0",
    Mode_StockLine_Text_Home: "#000000",
    Mode_Main_ButtonColor: "#141414",
    Mode_Main_ButtonTextColor: "#FFFFFF",

      // Home
    Mode_InvestInsight_ButtonColor_Home: "#F1F3F9",
    Mode_InvestInsight_IconColor_Home: "#691AF5",
    Mode_InvestInsight_NoData_IconColor_Home: "#A57F4D",

  
    // Cash
    Main_IconButtonBg: "#D3DAE0",
    Main_IconButtonText:  "#88919B",
    Mode_Secbg_Buttons_Cash: "#F1F3F9",
    Mode_SecNumberText_Home: "#A7828B",
    Mode_CashChart_Cash: "#691AF5",
    Mode_CashChartColor2_Cash: "#F1F3F9",

    // Transaction Receipe
    Mode_bg_TransactionReceipe: "#FFFFFF",
    Main_IconButtonBg_TransactionReceipe: "#b07c89",
    Main_StatusBgIcon_TransactionReceipe: "#000000",
    Mode_StatusLine: "#D3DAE0",
    Mode_ButtonColor_TransactionReceipe: "#F1F3F9",

    // Brought Transaction Receipe
    Mode_bg_BroughtTransactionReceipe: "#FFFFFF",
    Main_IconButtonBg_BroughtTransactionReceipe: "#691AF5",
    Main_StatusBgIcon_BroughtTransactionReceipe: "#691AF5",
    Mode_StatusLine: "#D3DAE0",
    Mode_ButtonColor_BroughtTransactionReceipe: "#F1F3F9",

     // Sold Transaction Receipe
     Mode_bg_SoldTransactionReceipe: "#FFFFFF",
     Main_IconButtonBg_SoldTransactionReceipe: "#691AF5",
     Main_StatusBgIcon_SoldTransactionReceipe: "#691AF5",
     Mode_ButtonColor_SoldTransactionReceipe: "#F1F3F9",

    // WIdthraw Transaction Receipe
     Mode_bg_WIdthrawTransactionReceipe: "#FFFFFF",
     Main_IconButtonBg_WIdthrawTransactionReceipe: "#b07c89",
     Main_StatusBgIcon_WIdthrawransactionReceipe: "#691AF5",
     Mode_ButtonColor_WIdthrawTransactionReceipe: "#F1F3F9",
  //  Mode_thirdNumberText: "#A57F4D",

      // Profile
      Mode_bg_Profile: "#FFFFFF",
      Mode_ButtonColor_Profile: "#F1F3F9",

    // Search
    Mode_bg_Search: "#FFFFFF",
    Mode_ButtonBgColor_Search: "#F1F3F9",
    Mode_BgColorBar_Search: "#F1F3F9",
    Mode_TextColorSearchBar_Search: "#88919B",
    Mode_TopCategories_Search: "#feeff3",
  },









  dark: {
    Mode_Name: "Black Theme",
    Mode_bg: "#000",
    Mode_bg_Home: "#000",
    Mode_fontColor: "#fff",
    Mode_Sec_fontColor: "#565A60",
    Mode_Third_fontColor: "#595A61",
    Mode_secbg_Home: "#F28F0C",
    Mode_StockLine: "#fff",
    Mode_HorizontalLine: "#D3DAE0",
    Mode_SecStockLine_Home: "#D3DAE0",
    Mode_StockLine_Text_Home: "#565A60",
    Mode_Main_ButtonColor: "#E9E9E9",
    Mode_Main_ButtonTextColor: "#000",

      // Home
    Mode_InvestInsight_ButtonColor_Home: "#0F0F0F",
    Mode_InvestInsight_IconColor_Home: "#691AF5",
    Mode_InvestInsight_NoData_IconColor_Home: "#A57F4D",

  
    // Cash
    Main_IconButtonBg: "#1E1E1F",
    Main_IconButtonText:  "#88919B",
    Mode_Secbg_Buttons_Cash: "#1E1E1F",
    Mode_SecNumberText_Home: "#A7828B",
    Mode_CashChart_Cash: "#691AF5",
    Mode_CashChartColor2_Cash: "#1E1E1F",

    // Transaction Receipe
    Mode_bg_TransactionReceipe: "#000",
    Main_IconButtonBg_TransactionReceipe: "#b07c89",
    Main_StatusBgIcon_TransactionReceipe: "#691AF5",
    Mode_StatusLine: "#D3DAE0",
    Mode_ButtonColor_TransactionReceipe: "#1E1E1F",

    // Brought Transaction Receipe
    Mode_bg_BroughtTransactionReceipe: "#000",
    Main_IconButtonBg_BroughtTransactionReceipe: "#691AF5",
    Main_StatusBgIcon_BroughtTransactionReceipe: "#691AF5",
    Mode_StatusLine: "#D3DAE0",
    Mode_ButtonColor_BroughtTransactionReceipe: "#1E1E1F",

     // Sold Transaction Receipe
     Mode_bg_SoldTransactionReceipe: "#000",
     Main_IconButtonBg_SoldTransactionReceipe: "#691AF5",
     Main_StatusBgIcon_SoldTransactionReceipe: "#691AF5",
     Mode_ButtonColor_SoldTransactionReceipe: "#1E1E1F",

    // WIdthraw Transaction Receipe
     Mode_bg_WIdthrawTransactionReceipe: "#000",
     Main_IconButtonBg_WIdthrawTransactionReceipe: "#1E1E1F",
     Main_StatusBgIcon_WIdthrawransactionReceipe: "#691AF5",
     Mode_ButtonColor_WIdthrawTransactionReceipe: "#1E1E1F",
  //  Mode_thirdNumberText: "#A57F4D",

      // Profile
      Mode_bg_Profile: "#000",
      Mode_ButtonColor_Profile: "#121213",

    // Search
    Mode_bg_Search: "#000",
    Mode_ButtonBgColor_Search: "#0F0F0F",
    Mode_BgColorBar_Search: "#28292A",
    Mode_TextColorSearchBar_Search: "#565A60",
    Mode_TopCategories_Search: "#ffff",
    
  },






  pink: {
    Mode_Name: "The Baddie Theme",
    Mode_bg: "#fcb2c5",
    Mode_bg_Home: "#fcb2c5",
    Mode_fontColor: "#41272E",
    Mode_Sec_fontColor: "#A27A84",
    Mode_Third_fontColor: "#9B6C77",
    Mode_secbg_Home: "#F28F0C",
    Mode_StockLine: "#6A434D",
    Mode_HorizontalLine: "#c98e9d",
    Mode_SecStockLine_Home: "#5EAEEB",
    Mode_StockLine_Text_Home: "#7e5962",
    Mode_Main_ButtonColor: "#fde0e7",
    Mode_Main_ButtonTextColor: "#4b353b",

      // Home
    Mode_InvestInsight_ButtonColor_Home: "#fcc1d0",
    Mode_InvestInsight_IconColor_Home: "#7e5962",
    Mode_InvestInsight_NoData_IconColor_Home: "#A57F4D",

  
    // Cash
    Main_IconButtonBg: "#C3919D",
    Main_IconButtonText:  "#41272E",
    Mode_Secbg_Buttons_Cash: "#e2a0b1",
    Mode_SecNumberText_Home: "#A7828B",
    Mode_CashChart_Cash: "#FFE6EC",
    Mode_CashChartColor2_Cash: "#FCC8D5",

    // Transaction Receipe
    Mode_bg_TransactionReceipe: "#fcb2c5",
    Main_IconButtonBg_TransactionReceipe: "#b07c89",
    Main_StatusBgIcon_TransactionReceipe: "#6A434D",
    Mode_StatusLine: "#976a76",
    Mode_ButtonColor_TransactionReceipe: "#fcc1d0",

    // Brought Transaction Receipe
    Mode_bg_BroughtTransactionReceipe: "#fcb2c5",
    Main_IconButtonBg_BroughtTransactionReceipe: "#5EAEEB",
    Main_StatusBgIcon_BroughtTransactionReceipe: "#5EAEEB",
    Mode_StatusLine: "#976a76",
    Mode_ButtonColor_BroughtTransactionReceipe: "#fcc1d0",

     // Sold Transaction Receipe
     Mode_bg_SoldTransactionReceipe: "#fcb2c5",
     Main_IconButtonBg_SoldTransactionReceipe: "#5EAEEB",
     Main_StatusBgIcon_SoldTransactionReceipe: "#5EAEEB",
     Mode_ButtonColor_SoldTransactionReceipe: "#fcc1d0",

    // WIdthraw Transaction Receipe
     Mode_bg_WIdthrawTransactionReceipe: "#fcb2c5",
     Main_IconButtonBg_WIdthrawTransactionReceipe: "#b07c89",
     Main_StatusBgIcon_WIdthrawransactionReceipe: "#5EAEEB",
     Mode_ButtonColor_WIdthrawTransactionReceipe: "#fcc1d0",
  //  Mode_thirdNumberText: "#A57F4D",

      // Profile
      Mode_bg_Profile: "#fcb2c5",
      Mode_ButtonColor_Profile: "#fcc1d0",

    // Search
    Mode_bg_Search: "#fcb2c5",
    Mode_ButtonBgColor_Search: "#fcc1d0",
    Mode_BgColorBar_Search: "#fcc1d0",
    Mode_TextColorSearchBar_Search: "#675555",
    Mode_TopCategories_Search: "#feeff3",
  },







  gray: {
    Mode_Name: "Gray Theme",
    Mode_bg: "#1e2124",
    Mode_bg_Home: "#1e2124",
    Mode_fontColor: "#fff",
    Mode_Sec_fontColor: "#616365",
    Mode_Third_fontColor: "#575960",
    Mode_secbg_Home: "#1e2124",
    Mode_StockLine: "#7289da",
    Mode_HorizontalLine: "#36393e",
    Mode_SecStockLine_Home: "#7289da",
    Mode_StockLine_Text_Home: "#00E040",
    Mode_Main_ButtonColor: "#7289da",
    Mode_Main_ButtonTextColor: "#fff",

      // Home
    Mode_InvestInsight_ButtonColor_Home: "#282b30",
    Mode_InvestInsight_IconColor_Home: "#7289da",
    Mode_InvestInsight_NoData_IconColor_Home: "#7289da",

  
    // Cash
    Main_IconButtonBg: "#7289da",
    Main_IconButtonText:  "#fff",
    Mode_Secbg_Buttons_Cash: "#282b30",
    Mode_SecNumberText_Home: "#A7828B",
    Mode_CashChart_Cash: "#7289da",
    Mode_CashChartColor2_Cash: "#282b30",

    // Transaction Receipe
    Mode_bg_TransactionReceipe: "#1e2124",
    Main_IconButtonBg_TransactionReceipe: "#b07c89",
    Main_StatusBgIcon_TransactionReceipe: "#7289da",
    Mode_StatusLine: "#36393e",
    Mode_ButtonColor_TransactionReceipe: "#282b30",

    // Brought Transaction Receipe
    Mode_bg_BroughtTransactionReceipe: "#1e2124",
    Main_IconButtonBg_BroughtTransactionReceipe: "#7289da",
    Main_StatusBgIcon_BroughtTransactionReceipe: "#7289da",
    Mode_StatusLine: "#36393e",
    Mode_ButtonColor_BroughtTransactionReceipe: "#282b30",

     // Sold Transaction Receipe
     Mode_bg_SoldTransactionReceipe: "#1e2124",
     Main_IconButtonBg_SoldTransactionReceipe: "#7289da",
     Main_StatusBgIcon_SoldTransactionReceipe: "#7289da",
     Mode_ButtonColor_SoldTransactionReceipe: "#282b30",

    // WIdthraw Transaction Receipe
     Mode_bg_WIdthrawTransactionReceipe: "#1e2124",
     Main_IconButtonBg_WIdthrawTransactionReceipe: "#7289da",
     Main_StatusBgIcon_WIdthrawransactionReceipe: "#7289da",
     Mode_ButtonColor_WIdthrawTransactionReceipe: "#282b30",
  //  Mode_thirdNumberText: "#A57F4D",

      // Profile
      Mode_bg_Profile: "#1e2124",
      Mode_ButtonColor_Profile: "#282b30",

    // Search
    Mode_bg_Search: "#1e2124",
    Mode_ButtonBgColor_Search: "#282b30",
    Mode_BgColorBar_Search: "#282b30",
    Mode_TextColorSearchBar_Search: "#a0a2a4",
    Mode_TopCategories_Search: "#CAB2FB",

   },




  purple: {
    Mode_Name: "Purple Rain Theme",
    Mode_bg: "#36135a",
    Mode_bg_Home: "#36135a",
    Mode_fontColor: "#fff",
    Mode_Sec_fontColor: "#CAB2FB",
    Mode_Third_fontColor: "#CAB2FB",
    Mode_secbg_Home: "#36135a",
    Mode_StockLine: "#CAB2FB",
    Mode_HorizontalLine: "#CAB2FB",
    Mode_SecStockLine_Home: "#CAB2FB",
    Mode_StockLine_Text_Home: "#CAB2FB",
    Mode_Main_ButtonColor: "#d6cfde",
    Mode_Main_ButtonTextColor: "#000",

      // Home
    Mode_InvestInsight_ButtonColor_Home: "#4a2a6a",
    Mode_InvestInsight_IconColor_Home: "#CAB2FB",
    Mode_InvestInsight_NoData_IconColor_Home: "#A57F4D",

  
    // Cash
    Main_IconButtonBg: "#c2b8cd",
    Main_IconButtonText:  "#fff",
    Mode_Secbg_Buttons_Cash: "#72598b",
    Mode_SecNumberText_Home: "#A7828B",
    Mode_CashChart_Cash: "#7E61AB",
    Mode_CashChartColor2_Cash: "#451972",

    // Transaction Receipe
    Mode_bg_TransactionReceipe: "#36135a",
    Main_IconButtonBg_TransactionReceipe: "#b07c89",
    Main_StatusBgIcon_TransactionReceipe: "#d6cfde",
    Mode_StatusLine: "#9a89ac",
    Mode_ButtonColor_TransactionReceipe: "#4a2a6a",

    // Brought Transaction Receipe
    Mode_bg_BroughtTransactionReceipe: "#36135a",
    Main_IconButtonBg_BroughtTransactionReceipe: "#5EAEEB",
    Main_StatusBgIcon_BroughtTransactionReceipe: "#5EAEEB",
    Mode_StatusLine: "#9a89ac",
    Mode_ButtonColor_BroughtTransactionReceipe: "#4a2a6a",

     // Sold Transaction Receipe
     Mode_bg_SoldTransactionReceipe: "#36135a",
     Main_IconButtonBg_SoldTransactionReceipe: "#5EAEEB",
     Main_StatusBgIcon_SoldTransactionReceipe: "#5EAEEB",
     Mode_ButtonColor_SoldTransactionReceipe: "#4a2a6a",

    // WIdthraw Transaction Receipe
     Mode_bg_WIdthrawTransactionReceipe: "#36135a",
     Main_IconButtonBg_WIdthrawTransactionReceipe: "#fde0e7",
     Main_StatusBgIcon_WIdthrawransactionReceipe: "#5EAEEB",
     Mode_ButtonColor_WIdthrawTransactionReceipe: "#4a2a6a",
  //  Mode_thirdNumberText: "#A57F4D",

      // Profile
      Mode_bg_Profile: "#36135a",
      Mode_ButtonColor_Profile: "#4a2a6a",

    // Profile
    Mode_bg_Search: "#36135a",
    Mode_ButtonBgColor_Search: "#4a2a6a",
    Mode_BgColorBar_Search: "#200b36",
    Mode_TextColorSearchBar_Search: "#aea0bd",
    Mode_TopCategories_Search: "#CAB2FB",
  },



  



  green: {
    Mode_Name: "The Green Theme",
    Mode_bg: "#2f3624",
    Mode_bg_Home: "#2f3624",
    Mode_fontColor: "#fff",
    Mode_Sec_fontColor: "#788777",
    Mode_Third_fontColor: "#788777",
    Mode_secbg_Home: "#2f3624",
    Mode_StockLine: "#9EAC87",
    Mode_HorizontalLine: "#788777",
    Mode_SecStockLine_Home: "#788777",
    Mode_StockLine_Text_Home: "#788777",
    Mode_Main_ButtonColor: "#171D18",
    Mode_Main_ButtonTextColor: "#9EAC87",

      // Home
    Mode_InvestInsight_ButtonColor_Home: "#282E1E",
    Mode_InvestInsight_IconColor_Home: "#788777",
    Mode_InvestInsight_NoData_IconColor_Home: "#A57F4D",

  
    // Cash
    Main_IconButtonBg: "#788777",
    Main_IconButtonText:  "#fff",
    Mode_Secbg_Buttons_Cash: "#414A34",
    Mode_SecNumberText_Home: "#A7828B",
    Mode_CashChart_Cash: "#788777",
    Mode_CashChartColor2_Cash: "#22271A",

    // Transaction Receipe
    Mode_bg_TransactionReceipe: "#2f3624",
    Main_IconButtonBg_TransactionReceipe: "#b07c89",
    Main_StatusBgIcon_TransactionReceipe: "#878e87",
    Mode_StatusLine: "#9a89ac",
    Mode_ButtonColor_TransactionReceipe: "#282E1E",

    // Brought Transaction Receipe
    Mode_bg_BroughtTransactionReceipe: "#2f3624",
    Main_IconButtonBg_BroughtTransactionReceipe: "#5EAEEB",
    Main_StatusBgIcon_BroughtTransactionReceipe: "#5EAEEB",
    Mode_StatusLine: "#9a89ac",
    Mode_ButtonColor_BroughtTransactionReceipe: "#282E1E",

     // Sold Transaction Receipe
     Mode_bg_SoldTransactionReceipe: "#2f3624",
     Main_IconButtonBg_SoldTransactionReceipe: "#5EAEEB",
     Main_StatusBgIcon_SoldTransactionReceipe: "#5EAEEB",
     Mode_ButtonColor_SoldTransactionReceipe: "#282E1E",

    // WIdthraw Transaction Receipe
     Mode_bg_WIdthrawTransactionReceipe: "#2f3624",
     Main_IconButtonBg_WIdthrawTransactionReceipe: "#fde0e7",
     Main_StatusBgIcon_WIdthrawransactionReceipe: "#5EAEEB",
     Mode_ButtonColor_WIdthrawTransactionReceipe: "#282E1E",
  //  Mode_thirdNumberText: "#A57F4D",

      // Profile
      Mode_bg_Profile: "#2f3624",
      Mode_ButtonColor_Profile: "#282E1E",

    // Profile
    Mode_bg_Search: "#2f3624",
    Mode_ButtonBgColor_Search: "#282E1E",
    Mode_BgColorBar_Search: "#171D18",
    Mode_TextColorSearchBar_Search: "#9EA79D",
    Mode_TopCategories_Search: "#788777",
  },








  honey: {
    Mode_Name: "Honey Theme",
    Mode_bg: "#663300",
    Mode_bg_Home: "#663300",
    Mode_fontColor: "#fff",
    Mode_Sec_fontColor: "#B2936A",
    Mode_Third_fontColor: "#A57F4D",
    Mode_secbg_Home: "#F28F0C",
    Mode_StockLine: "#5EAEEB",
    Mode_HorizontalLine: "#864D15",
    Mode_SecStockLine_Home: "#5EAEEB",
    Mode_StockLine_Text_Home: "#5EAEEB",
    Mode_Main_ButtonColor: "#5EAEEB",
    Mode_Main_ButtonTextColor: "#000",

    // Home
    Mode_InvestInsight_ButtonColor_Home: "#7B4612",
    Mode_InvestInsight_IconColor_Home: "#fff",
    Mode_InvestInsight_NoData_IconColor_Home: "#A57F4D",
   
    // Cash
    Main_IconButtonBg: "#5EAEEB",
    Main_IconButtonText:  "#fff",
    Mode_Secbg_Buttons_Cash: "#864D15",
    Mode_SecNumberText_Home: "#B2936A",
    Mode_CashChart_Cash: "#5EAEEB",
    Mode_CashChartColor2_Cash: "#7B4612",

    // Transaction Receipe
    Mode_bg_TransactionReceipe: "#663300",
    Main_IconButtonBg_TransactionReceipe: "#5EAEEB",
    Main_StatusBgIcon_TransactionReceipe: "#5EAEEB",
    Mode_StatusLine: "#864D15",
    Mode_ButtonColor_TransactionReceipe: "#7B4612",

    // Brought Transaction Receipe
    Mode_bg_BroughtTransactionReceipe: "#663300",
    Main_IconButtonBg_BroughtTransactionReceipe: "#5EAEEB",
    Main_StatusBgIcon_BroughtTransactionReceipe: "#5EAEEB",
    Mode_StatusLine: "#864D15",
    Mode_ButtonColor_BroughtTransactionReceipe: "#7B4612",

     // Sold Transaction Receipe
     Mode_bg_SoldTransactionReceipe: "#663300",
     Main_IconButtonBg_SoldTransactionReceipe: "#5EAEEB",
     Main_StatusBgIcon_SoldTransactionReceipe: "#5EAEEB",
     Mode_ButtonColor_SoldTransactionReceipe: "#7B4612",

    // WIdthraw Transaction Receipe
     Mode_bg_WIdthrawTransactionReceipe: "#663300",
     Main_IconButtonBg_WIdthrawTransactionReceipe: "#5EAEEB",
     Main_StatusBgIcon_WIdthrawransactionReceipe: "#5EAEEB",
     Mode_ButtonColor_WIdthrawTransactionReceipe: "#7B4612",
  //  Mode_thirdNumberText: "#A57F4D",

      // Profile
      Mode_bg_Profile: "#663300",
      Mode_ButtonColor_Profile: "#7B4612",

    // Profile
    Mode_bg_Search: "#663300",
    Mode_ButtonBgColor_Search: "#4E2904",
    Mode_BgColorBar_Search: "#311A03",
    Mode_TextColorSearchBar_Search: "#675555",
    Mode_TopCategories_Search: "#B2936A",
  
  },
















  ThebluebasedColor: {
    Mode_Name: "The blue based Color Theme",
    Mode_bg: "#f5efeb",
    Mode_bg_Home: "#f5efeb",
    Mode_fontColor: "#253444",
    Mode_Sec_fontColor: "#828d99",
    Mode_Third_fontColor: "#828d99",
    Mode_secbg_Home: "#F28F0C",
    Mode_StockLine: "#253444",
    Mode_HorizontalLine: "#253444",
    Mode_SecStockLine_Home: "#253444",
    Mode_StockLine_Text_Home: "#253444",
    Mode_Main_ButtonColor: "#253444",
    Mode_Main_ButtonTextColor: "#fff",

    // Home
    Mode_InvestInsight_ButtonColor_Home: "#E6E1DE",
    Mode_InvestInsight_IconColor_Home: "#253444",
    Mode_InvestInsight_NoData_IconColor_Home: "#A57F4D",
   
    // Cash
    Main_IconButtonBg: "#253444",
    Main_IconButtonText:  "#828d99",
    Mode_Secbg_Buttons_Cash: "#C4BDB9",
    Mode_SecNumberText_Home: "#567cbd",
    Mode_CashChart_Cash: "#253444",
    Mode_CashChartColor2_Cash: "#E6E1DE",

    // Transaction f5efeb
    Mode_bg_TransactionReceipe: "#f5efeb",
    Main_IconButtonBg_TransactionReceipe: "#253444",
    Main_StatusBgIcon_TransactionReceipe: "#253444",
    Mode_StatusLine: "#253444",
    Mode_ButtonColor_TransactionReceipe: "#E6E1DE",

    // Brought Transaction Receipe
    Mode_bg_BroughtTransactionReceipe: "#f5efeb",
    Main_IconButtonBg_BroughtTransactionReceipe: "#253444",
    Main_StatusBgIcon_BroughtTransactionReceipe: "#253444",
    Mode_StatusLine: "#253444",
    Mode_ButtonColor_BroughtTransactionReceipe: "#E6E1DE",

     // Sold Transaction Receipe
     Mode_bg_SoldTransactionReceipe: "#f5efeb",
     Main_IconButtonBg_SoldTransactionReceipe: "#253444",
     Main_StatusBgIcon_SoldTransactionReceipe: "#253444",
     Mode_ButtonColor_SoldTransactionReceipe: "#E6E1DE",

    // WIdthraw Transaction Receipe
     Mode_bg_WIdthrawTransactionReceipe: "#f5efeb",
     Main_IconButtonBg_WIdthrawTransactionReceipe: "#253444",
     Main_StatusBgIcon_WIdthrawransactionReceipe: "#253444",
     Mode_ButtonColor_WIdthrawTransactionReceipe: "#E6E1DE",
  //  Mode_thirdNumberText: "#A57F4D",

      // Profile
      Mode_bg_Profile: "#f5efeb",
      Mode_ButtonColor_Profile: "#E6E1DE",

    // Profile
    Mode_bg_Search: "#f5efeb",
    Mode_ButtonBgColor_Search: "#E6E1DE",
    Mode_BgColorBar_Search: "#C4BDB9",
    Mode_TextColorSearchBar_Search: "#FFF8F4",
    Mode_TopCategories_Search: "#f5efeb",
  
  },
};

// Create Context Provider
export const ViewModeProvider = ({ children }) => {
  const [CurrentViewMode, setCurrentViewMode] = useState(themes.ThebluebasedColor); // Default to dark mode
  const {
    isSystemTheme, 
    setIsSystemTheme,
    isAssetColorTheme, 
    setIsAssetColorTheme,
   } = useContext(StockLineContext);



   // Fetch stored theme and isSystemTheme from AsyncStorage when the app loads
   useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Load the stored theme
        const storedTheme = await AsyncStorage.getItem('selectedTheme');
        if (storedTheme) {
          setCurrentViewMode(JSON.parse(storedTheme)); // Use stored theme if available
        } else {
          setCurrentViewMode(themes.ThebluebasedColor); // Fallback to default theme
        }

        // Load the stored system theme preference
        const storedSystemTheme = await AsyncStorage.getItem('isSystemTheme');
        if (storedSystemTheme !== null) {
          setIsSystemTheme(JSON.parse(storedSystemTheme)); // Use stored value if available
        } else {
          setIsSystemTheme(true); // Default to system theme if not found
        }
      } catch (error) {
        console.error("Failed to load preferences", error);
        setCurrentViewMode(themes.ThebluebasedColor); // Fallback to default theme on error
        setIsSystemTheme(true); // Default to system theme on error
      }
    };

    loadPreferences();
  }, []);

  // Store the theme and system theme preference when they change
  const setTheme = async (theme) => {
    try {
      await AsyncStorage.setItem('selectedTheme', JSON.stringify(theme));
      setCurrentViewMode(theme);
    } catch (error) {
      console.error("Failed to save theme", error);
    }
  };

  const setSystemTheme = async (value) => {
    try {
      await AsyncStorage.setItem('isSystemTheme', JSON.stringify(value));
      setIsSystemTheme(value);
    } catch (error) {
      console.error("Failed to save system theme preference", error);
    }
  };

  return (
    <ViewModeContext.Provider value={{ 
      CurrentViewMode, 
      setCurrentViewMode: setTheme, 
      themes, 
      isSystemTheme, 
      setIsSystemTheme: setSystemTheme,
    }}>
      {children}
    </ViewModeContext.Provider>
  );
};
