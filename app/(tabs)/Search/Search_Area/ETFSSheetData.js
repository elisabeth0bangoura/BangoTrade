// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import Page from "../../Home/home"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import axios from 'axios';
import Profile from "../../Profile/profile"
import CountryFlag from "react-native-country-flag";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../../../Languages_Translation_Screens/i18n';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Cash from "../../Cash/cash"
import { BlurView } from 'expo-blur'; // If you're using Expo
import { LineChart } from 'react-native-wagmi-charts';
import { Platform } from 'react-native';
import { Link } from 'expo-router';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'

import { FlashList } from "@shopify/flash-list";
import { debounce } from 'lodash';
import SkeletonLoading from 'expo-skeleton-loading'
import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '@/app/Context/CurrentCoinSelectedContext';
import { SheetManager } from 'react-native-actions-sheet';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import { usePostHog } from 'posthog-react-native';


import { getFirestore, doc, getDoc, collection, setDoc, addDoc, onSnapshot } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";







const Tab = createMaterialTopTabNavigator();





const SkeletonPlaceholder = () => {
  return (
    <View>
      {/* Show 3 Skeleton Items */}
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonLoading key={index} background={"#1E1E1F"} highlight={"#666"}>
          <View style={{ flexDirection: "row", top: height(3), marginBottom: height(4) }}>
            {/* Left Skeleton Box */}
            <View
              style={{
                backgroundColor: "#1E1E1F",
                height: size(25),
                width: size(25),
                marginRight: 20,
                marginLeft: width(5),
                borderRadius: 8, // Optional: Add rounded corners
              }}
            />

            {/* Right Skeleton Box */}
            <View
              style={{
                backgroundColor: "#1E1E1F",
                height: size(25),
                width: width(80),
                marginRight: width(5),
                borderRadius: 8,
              }}
            />
          </View>
        </SkeletonLoading>
      ))}
    </View>
  );
};



export default function ETFSSheetData({ SearchIndex }) {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const { setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);




  const [coinsData, setCoinsData] = useState([]); // Stores the coin data
  const [isFetching, setIsFetching] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const coinsMemoized = useMemo(() => coinsData, [coinsData]);
  const loadedCharts = useRef(new Map()); // ✅ Persistent cache for chart data



  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG', // Use your actual API key
    },
  }

  const POLYGON_API_KEY = 'O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm';

 

  const topETFs = [
    // 🔥 S&P 500 ETFs
    {
      name: 'SPDR S&P 500 ETF Trust (S&P 500)',
      ticker: 'SPY',
      subtitle: 'State Street Global Advisors',
    },
    {
      name: 'Vanguard S&P 500 ETF (S&P 500)',
      ticker: 'VOO',
      subtitle: 'Vanguard',
    },
    {
      name: 'iShares MSCI ACWI ETF (MSCI Global)',
      ticker: 'MSCI',
      subtitle: 'BlackRock / iShares',
    },
    {
      name: 'iShares Core S&P 500 ETF (S&P 500)',
      ticker: 'IVV',
      subtitle: 'BlackRock / iShares',
    },
  
    // 💻 Tech + Innovation
    {
      name: 'Invesco QQQ Trust (NASDAQ 100)',
      ticker: 'QQQ',
      subtitle: 'Invesco',
    },
    {
      name: 'ARK Innovation ETF (Innovation)',
      ticker: 'ARKK',
      subtitle: 'ARK Invest',
    },
  
    // 🌎 MSCI ETFs
    {
      name: 'iShares MSCI ACWI ETF (MSCI Global)',
      ticker: 'MSCI',
      subtitle: 'BlackRock / iShares',
    },
    {
      name: 'iShares MSCI Emerging Markets ETF (MSCI EM)',
      ticker: 'EEM',
      subtitle: 'BlackRock / iShares',
    },
    {
      name: 'iShares MSCI EAFE ETF (MSCI EAFE)',
      ticker: 'EFA',
      subtitle: 'BlackRock / iShares',
    },
  
    // 🇺🇸 Full USA Stock Market
    {
      name: 'Vanguard Total Stock Market ETF (USA)',
      ticker: 'VTI',
      subtitle: 'Vanguard',
    },
  
    // 🏦 Sectors
    {
      name: 'Financial Select Sector SPDR Fund (Financials)',
      ticker: 'XLF',
      subtitle: 'State Street Global Advisors',
    },
    {
      name: 'Energy Select Sector SPDR Fund (Energy)',
      ticker: 'XLE',
      subtitle: 'State Street Global Advisors',
    },
  
    // 🏠 Real Estate
    {
      name: 'Vanguard Real Estate ETF (Real Estate)',
      ticker: 'VNQ',
      subtitle: 'Vanguard',
    },
  
    // 💰 Bonds for safety
    {
      name: 'iShares 20+ Year Treasury Bond ETF (Bonds)',
      ticker: 'TLT',
      subtitle: 'BlackRock / iShares',
    },
  ];
  
  
  




  
    // ✅ Fetch Coins Data (Initial List Without Charts)
    const fetchCoinsData = useCallback(async () => {
      if (isFetching) return;
      setIsFetching(true);
    
      try {
        console.log('🔥 Fetching trendy companies...');
    
        const top10Tickers = topETFs.slice(0, 3); // ✅ Pick first 10 manually
    
        const detailedData = await Promise.all(
          top10Tickers.map(async (item) => {
            try {
              const tickerSymbol = item.ticker;
    
              // Fetch company details
              const detailsResponse = await fetch(`https://api.polygon.io/v3/reference/tickers/${tickerSymbol}?apiKey=${POLYGON_API_KEY}`);
              const detailsData = await detailsResponse.json();
              const result = detailsData.results || {};
    
              // Fetch price snapshot (day price, today's change)
              const priceResponse = await fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${tickerSymbol}?apiKey=${POLYGON_API_KEY}`);
              const priceData = await priceResponse.json();
              const priceResults = priceData.ticker || {};
    
              return {
                id: tickerSymbol,
                name: result.name || '',
                symbol: tickerSymbol,
                subtitle: item.subtitle,
                price: priceResults?.day?.c || 0, // 🟰 closing price today
                price_change_percentage_24h: priceResults?.todaysChangePerc || 0, // 🟰 today's % change
                image: `https://assets.parqet.com/logos/symbol/${tickerSymbol}?format=png&size=100`, // ✅ Parqet logo
                chart: [],
                CoinChartColor: (priceResults?.todaysChangePerc || 0) > 0 ? '#00CE39' : '#FF1B1E',
              };
            } catch (error) {
              console.error('❌ Error fetching details for:', item.ticker, error);
              return null;
            }
          })
        );
    
        const cleanData = detailedData.filter(item => item !== null);
    
        setCoinsData(cleanData); // ✅ Set your state
 
    
      } catch (error) {
        console.error('🚨 Error fetching stocks:', error);
      } finally {
        setIsFetching(false);
        setIsDataFetched(true);
      }
    }, [isFetching]);
    
  

    
    // ✅ Fetch Chart Data Only If Not Already Cached
    const fetchChartForCoin = async (coinId) => {
      if (loadedCharts.current.has(coinId)) return; // ✅ Prevent duplicate fetches
  
      try {
        const chartRes = await fetch(
          `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`,
          options
        );
        const chartData = await chartRes.json();
  
        const chart =
          chartData?.prices?.map(([timestamp, value]) => ({
            timestamp,
            value,
          })) || [];
  
        loadedCharts.current.set(coinId, chart); // ✅ Store chart persistently
        setCoinsData((prevData) =>
          prevData.map((coin) =>
            coin.id === coinId ? { ...coin, chart } : coin
          )
        );
      } catch (error) {
        console.warn(`⚠️ Error fetching chart for ${coinId}:`, error);
      }
    };
  
    // 🔹 Detect When Coins Become Visible & Fetch Charts
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
      viewableItems.forEach((viewableItem) => {
        fetchChartForCoin(viewableItem.item.id);
      });
    }).current;
  
   

useEffect(() => {

  if(SearchIndex == 0) {
    fetchCoinsData();
  } else if (SearchIndex == -1) {
    setCoinsData([]);
  }
}, [])

  
    // ✅ Lazy-loaded Chart Component
    const RenderChart = React.memo(({ chart, color }) => {
      if (!chart || chart.length === 0) return null;
      return (
        <LineChart.Provider data={chart}>
          <LineChart height={50} width={40} color={color}>
            <LineChart.Path width={1.2} color={color} />
          </LineChart>
        </LineChart.Provider>
      );
    });
  



  // ✅ Render Item Function (Optimized)
  const renderItem = useCallback(({ item }) => {
    const priceChangeColor = item.price_change_percentage_24h > 0 ? "#00CE39" : "#FF1B1E";
    const priceChangeSymbol = item.price_change_percentage_24h > 0 ? "▲" : "▼";
  

  return (
   <TouchableOpacity onPress={() => {



    posthog.capture('open_stock_bottomsheet', {
      screen: 'Stock_Page',
      $screen_name: 'Stock_Page '+" / "+item.name,
      timestamp: new Date().toISOString(),
  
      });

   

    const handleItemClick = async (item) => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;
    
        const db = getFirestore();
    
        const ref = doc(db, 'users', user.uid, 'ClickedAssets', item.name); // use name as document ID
    
        await setDoc(ref, {
          ...item,
          clickedAt: new Date().toISOString(), // optional timestamp
          category: "ETFs"
        });
    
        console.log('Asset saved (no duplicates):', item.name);
      } catch (error) {
        console.error('Error saving asset:', error);
      }
    };
    handleItemClick(item)



    setCoinPageIndex(0)
    SheetManager.show('StockPage_Sheet',  {
      payload: { value: item.symbol, category: "ETF", }, // Passing dynamic data (payload)
    });
       setCurrentCoinSelected(item)
      

      }}
    style={{
      height: height(8),
      width: "100%",
      marginBottom: 10,
      top: height(3),
      alignSelf: 'center',
     
      //justifyContent: 'center'
    }}
    >

    
<View style={{
      marginLeft: width(0),
       alignSelf: 'center',
       width: "90%",
       flexDirection: 'row',
   
}}>

    <View
      style={{
      
      height: size(25),
      width: size(25),
      backgroundColor: CurrentViewMode.Mode_fontColor,
     // marginLeft: width(5),
      borderRadius: size(8),
      overflow: 'hidden',
      }}
    >
   
<Text style={{
  fontSize: size(6),
  fontWeight: "900",
  marginLeft: width(1),
  marginTop: height(0.2),
  color: CurrentViewMode.Mode_bg,
}}>
  {item.symbol}
</Text>
    </View>

    <View
      style={{
        
 
      }}
    >


      <Text
      numberOfLines={1}
      style={{
        fontWeight: 'bold',
        fontSize: size(15),
        color: CurrentViewMode.Mode_fontColor,
        width: width(55),
        marginLeft: width(5),
      }}
      >
      {item.name}
      </Text>
    </View>

 
 
      <Text
      style={{
        fontSize: size(15),
        position: 'absolute',
        right: width(0),
        fontWeight: 'bold',
        color: priceChangeColor,
      }}
      >
      {priceChangeSymbol} {parseFloat(item.price_change_percentage_24h).toFixed(2)}%
      </Text>
      </View>
      
      <Text numberOfLines={1} style={{
        width: width(55),
        marginLeft: width(16),
        fontSize: size(14),
        color: CurrentViewMode.Mode_TextColorSearchBar_Search,
      //  width: "70%",

      }}>
        {item.subtitle}
      </Text>

    </TouchableOpacity>

  );
  }, []);
  


    






  return(


      <>
{isDataFetched ? (
        <FlashList
          data={coinsMemoized}
          keyExtractor={(item) => `${item.id}-${item.symbol}`}
          renderItem={renderItem}
          estimatedItemSize={170}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      ) : (
        
        <SkeletonPlaceholder />
      )}

    </>
  );
}