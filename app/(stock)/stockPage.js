// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, TextStyle, ActivityIndicator, Dimensions, Easing, StyleSheet, Image, Animated, TouchableOpacity,  } from 'react-native';
import {AntDesign, Entypo, Feather, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import { GestureHandlerRootView, FlatList} from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import axios from 'axios';
import CountryFlag from "react-native-country-flag";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { BlurView } from 'expo-blur'; // If you're using Expo
import { LineChart } from 'react-native-wagmi-charts';
import { getColors } from 'react-native-image-colors'
import { Platform } from 'react-native';
import { Link } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'


import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from 'expo-linear-gradient';
import debounce from 'lodash.debounce';

import { CoinPageContext } from '../Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '../Context/CurrentCoinSelectedContext';
import StockChart from './StockChart';
import { CurrentPriceContext } from '../Context/CurrentCoinPricePageContext';
import PagerView from 'react-native-pager-view';
import PriceTraackersheet from './StockPriceTraackersheet';
import { PriceTrackerContext } from '../Context/OpenPriceTrackerSheetContext';
import { AmountContext } from '../Context/OpenAmountSheetContext';
import StockAmountsheet from './StockAmountsheet';
import { formatDistanceToNow, parseISO } from 'date-fns'; // Ensure you have date-fns installed: npm install date-fns
import firestore from '@react-native-firebase/firestore';
import Collapsible from 'react-native-collapsible';
import * as WebBrowser from 'expo-web-browser';
import ActionSheet, {useSheetRef, ScrollView, SheetManager} from 'react-native-actions-sheet';

import { SearchContext } from '../Context/MainSearchIndexStateContext';
import { IFollowingsCoinsContext } from '../Context/OpenIFollowingsCoinsSheetContext';
import { ViewModeContext } from '../Context/ViewModeContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StockLineContext } from '../Context/StockLineColor';
import SvgFromUri from './SvgFromUri';
import RollingNumberStocks from './animatedNumber';
import { HomeChartContext } from '../Context/HomeChartContext';
import { ToastMessageContext } from '../Context/ToastMessageContext';
import { DateTime } from 'luxon';
import { usePostHog } from 'posthog-react-native';







const StockPage = React.memo((props) => {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const {
    isSystemTheme, 
    setIsSystemTheme,
    isAssetColorTheme, 
    setIsAssetColorTheme,
   } = useContext(StockLineContext);


   const [isMarketOpen, setIsMarketOpen] = useState(false);



       const {
        ShowPriceTickerSaved, 
        setShowPriceTickerSaved,
        setShowToast,
        PlacedOrder,
        setPlacedOrder,
        PlacedTracker,
        setPlacedTracker,
        SellPlacedOrder, setSellPlacedOrder,
        showToastSell, 
        setShowToastSell,
         } = useContext(ToastMessageContext);
    
  
         const {StopRealtimeInHomeChart1D, setStopRealtimeInHomeChart1D,
          ShowHomeChart, setShowHomeChart,
          MetricsState, setMetricsState,
      
        } = useContext(HomeChartContext)

  const bounceValue = useState(new Animated.Value(0))[0]; // Initialize animation value
	const translateY = useRef(new Animated.Value(height(8))).current;  // Starting position
	const [opacity] = useState(new Animated.Value(1)); // Initialize opacity value


  const [showTransferBtn, setShowTrasnferBtn] = useState(false);
	const [isOpenTransfer, setisOpenTransfer] = useState(false); // State to toggle between open and close

  const windowHeight = Dimensions.get('window').height;

  //   setSearchIndex(-1); 

	const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);
  const {IFollowingsCoinsIndex, setIFollowingsCoinsIndex } = useContext(IFollowingsCoinsContext);

  const currentUser = auth().currentUser;


  const [userLang, setUserLang] = useState();
  const [user, setUser] = useState(null);
  const { t } = useTranslation();
 // const { PriceTrackerIndex, setPriceTrackerIndex } = useContext(PriceTrackerContext);
//  const { AmountIndex, setAmountIndex } = useContext(AmountContext);
  const [CoinNews, setCoinNews] = useState([])
  const [selectedInterval, setSelectedInterval] = useState('1D');
  const { currentPrice, setCurrentPrice, percentageChange, setPercentageChange, } = useContext(CurrentPriceContext);
  const { currentCoinSelected, setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);
  const { coinDetails, setCoinDetails } = useContext(CurrentPriceContext);

  const [isTradeable, setIsTradeable] = useState(false); // To store if the asset is tradeable
  const [DoesAlpacaAssetExists, setDoesAlpacaAssetExists] = useState(false); // To store if Alpaca asset exists


  

  

  const [AlpacaCheckymbol, setAlpacaCheckymbol] = useState(props.payload?.value.toUpperCase())

  const [pagesData, setPagesData] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
    const [bankDetails, setBankDetails] = useState(null); // Store bank details

  const [dominantColor, setDominantColor] = useState('#000');


  
  const [realTimePrice, setRealTimePrice] = useState(null);
  const { 
    CoinPageIndex, 
    setCoinPageIndex,  
    CurrentBackgroundColorForCoin, 
    setCurrentBackgroundColorForCoin, coinData, setCoinData, coinSymbol, setCoinSymbol  } = useContext(CoinPageContext);

  const [AssetSupply, setAssetSupply] = useState(0)

  const [isFollowing, setIsFollowing] = useState(false);
  
  const { CurrentCoinSelected } = useContext(CurrentCoinSelectedContext);

  const [FontColorIsDark, setFontColorIsDark] = useState()
  const [nyTime, setNyTime] = useState(null);


// Scroll Bottmsheet 
  const scrollY = useRef(new Animated.Value(0)).current;
const HEADER_MAX_HEIGHT = height(60);
const HEADER_MIN_HEIGHT = height(20);
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const headerStyle = {
  height: scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  }),
  backgroundColor: coinData.dominantColor, // Use LinearGradient if needed
};










useEffect(() => {
  posthog.capture('screen_viewed', {
    screen: 'Stock_Page',
    $screen_name: 'Stock_Page '+" / "+coinData.name,
    timestamp: new Date().toISOString(),
  });
}, []);











console.log("AlpacaCheckymbol ", AlpacaCheckymbol)
console.log("AlpacaCheckymbol test",  props.payload?.value.toUpperCase())



/*

const checkAssetAvailability = async (symbol) => {
  try {
    const res = await fetch(`https://broker-api.sandbox.alpaca.markets/v1/assets/${coinSymbol}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==`,
      },
    });

    if (!res.ok) {
      console.warn(`❌ Asset ${coinSymbol} not found or not available.`);
      return null;
    }

    const asset = await res.json();

    if (asset.tradable && asset.status === 'active') {
      console.log(`✅ ${coinSymbol} is available for trading.`);
      return asset;
    } else {
      console.warn(`⚠️ ${coinSymbol} is not tradable or inactive.`);
      return null;
    }
  } catch (err) {
    console.error('🚨 Broker API error:', err);
    return null;
  }
};

checkAssetAvailability()
*/




























 // Function to save the dynamic state to AsyncStorage
 const saveCoinDataToStorage = async (doesAlpacaAssetExist, isTradeable) => {
  try {
    // Save dynamic state values to AsyncStorage
    await AsyncStorage.setItem('@doesAlpacaAssetExist', JSON.stringify(props.payload?.value.toUpperCase()));
    await AsyncStorage.setItem('@isTradeable', JSON.stringify(isTradeable));
  } catch (error) {
    console.error('Error saving data to AsyncStorage:', error);
  }
};

// Function to check if Alpaca data exists
const checkAlpacaData = async () => {
  try {
    const response = await fetch(
      `https://broker-api.sandbox.alpaca.markets/v1/assets/${encodeURIComponent(props.payload?.value.toUpperCase())}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==`,
        },
      }
    );

    const data = await response.json();

    // Check if the Alpaca symbol exists in the data
    const realTimePrice =data.tradable;



    if (realTimePrice) {
      // Set state if data exists
      setDoesAlpacaAssetExists(true);
      setIsTradeable(true);

      // Save the state to AsyncStorage for later
      await saveCoinDataToStorage(true, true); // Save the dynamic state values
    } else {
      setDoesAlpacaAssetExists(false);
      setIsTradeable(false);

      // Save the state to AsyncStorage for later
      await saveCoinDataToStorage(false, false); // Save the dynamic state values
    }
  } catch (error) {
    console.error('Error fetching Alpaca data:', error);
    setDoesAlpacaAssetExists(false);
    setIsTradeable(false);

    // Save the state to AsyncStorage for later
    await saveCoinDataToStorage(false, false); // Save the dynamic state values
  }
};

// useEffect to check the Alpaca data on page load
useEffect(() => {
  // Define an async function inside the useEffect to handle async calls
  const fetchData = async () => {
    await checkAlpacaData();  // Trigger the Alpaca data check when the page loads
  };

  fetchData(); // Run the fetch logic on component mount

}, [AlpacaCheckymbol, DoesAlpacaAssetExists, isTradeable]); // Run once on mount (empty dependency array)

















useEffect(() => {
  // Real-time listener for the "List" document in the "Bank_Details" subcollection
  const subscriber = firestore()
    .collection('users') // Access the 'users' collection
    .doc(currentUser.uid) // Access the specific user document based on currentUser's UID
    .collection('Bank_Details') // Access the "Bank_Details" subcollection
    .doc('List') // Access the "List" document
    .onSnapshot(documentSnapshot => {
    //  console.log('User data: ', documentSnapshot.data());
      setBankDetails(documentSnapshot.data())

    });

    return () => subscriber();
  }, [currentUser.uid]);



/*

    const handleOpenPriceTracker = useCallback(() => {
      setPriceTrackerIndex(0); // This triggers the effect in PriceTraackersheet to open the BottomSheet.
    }, []);
    

   const handleOpenAmount = useCallback(() => {
      setAmountIndex(0); // This triggers the effect in PriceTraackersheet to open the BottomSheet.
    }, []);
    
*/



// Cache for image colors to avoid re-fetching
const colorCache = {};

const fetchDominantColor = async (imageUri) => {
  if (!imageUri) return '#1E1E1F';

  if (colorCache[imageUri]) {
    return colorCache[imageUri];
  }

  try {
    const result = await getColors(imageUri, {
      fallback: '#1E1E1F',
      cache: true,
      key: imageUri,
    });

    let color;

    switch (result.platform) {
      case 'android':
        color = result.dominant;
        break;
      case 'ios':
        color = result.background;
        break;
      case 'web':
        color = result.dominant;
        break;
      default:
        color = '#1E1E1F';
    }

    colorCache[imageUri] = color;
    return color;
  } catch (error) {
    console.error('Error getting dominant color:', error);
    return '#1E1E1F';
  }
};










// Follow Coin Function




const handleFollowCoin = async () => {


  console.log(props.payload?.category)


  
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    if (isFollowing) {

      posthog.capture('click_unfollowing_asset', {
        screen: 'Stock_Page',
        $screen_name: 'Stock_Page '+" / "+coinData.name,
        timestamp: new Date().toISOString(),
      
      }); 
      // Unfollow the coin (delete it from Firestore)
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('CoinsIFollow')
        .doc(coinData.id)
        .delete();

    //  console.log('Coin unfollowed!');
    } else {
      // Follow the coin (add it to Firestore)

      posthog.capture('click_following_asset', {
        screen: 'Stock_Page',
        $screen_name: 'Stock_Page '+" / "+coinData.name,
        timestamp: new Date().toISOString(),
      
      });

      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('CoinsIFollow')
        .doc(coinData.id)
        .set({
          ...coinData,
          category: props.payload?.category == "derivatives" 
         ? "derivatives"
         : props.payload?.category === "ETF"
            ? "ETFs"
            : props.payload?.category === "Bonds"
            ? "Bonds"
            : null
        });
        

     // console.log('Coin followed!');
    }

    setIsFollowing(!isFollowing);  // Toggle the state
  } catch (error) {
    console.error('Error updating follow status:', error);
  } 
};















useEffect(() => {
//  console.log('Current Coin Details:', coinDetails);
  if (coinDetails) {
    // Update UI or perform actions with the received data
  }
}, [coinDetails]);

useEffect(() => {
  if (CoinPageIndex === -1) {
    setCoinData({});
    setPagesData([]);
  }
}, [CoinPageIndex]);

useEffect(() => {
  console.log('Current Coin:', currentCoinSelected);
  if (currentCoinSelected) {
    // Update the UI or perform any action with the new data
  }
}, [currentCoinSelected]);

const formatPrice = useCallback((price) => {
  return new Intl.NumberFormat('us-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}, []);

const formatUnitsNumber = useCallback((number) => {
  return new Intl.NumberFormat('en-US').format(number);
}, []);

const formatRelativeDate = useCallback((dateString) => {
  try {
    const parsedDate = new Date(dateString);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}, []);


const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-pro-api-key": "CG-9BNXX3AMb2poti6c1BsGi5iG",
  },
};

const POLYGON_API_KEY = 'O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm';






//console.log("CoinPageIndex: ", CoinPageIndex)





  // Function to save data in AsyncStorage
  const fetchFullCoinInfo = useCallback(
    debounce(async (tickerSymbol) => {
      if (!tickerSymbol) return;
  
      try {
        console.log("🔥 Fetching Stock Info:", tickerSymbol);
  
        const refRes = await fetch(
          `https://api.polygon.io/v3/reference/tickers/${tickerSymbol}?apiKey=${POLYGON_API_KEY}`
        );
        const refData = await refRes.json();
        const stockInfo = refData.results || {};
        if (!stockInfo?.ticker) return;
  
        const coinSymbol = stockInfo.ticker.toUpperCase();
        setAlpacaCheckymbol(coinSymbol);
  
        const snapRes = await fetch(
          `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${tickerSymbol}?apiKey=${POLYGON_API_KEY}`
        );
        const snapData = await snapRes.json();
        const snapshot = snapData.ticker || {};
  
        const isMarketClosed =
          (snapshot?.day?.c === 0 || snapshot?.day?.c === undefined) &&
          (snapshot?.lastTrade?.p === 0 || snapshot?.lastTrade?.p === undefined);
  
        const realTimePrice = isMarketClosed
          ? snapshot?.prevDay?.c || null
          : snapshot?.lastTrade?.p || snapshot?.day?.c || snapshot?.prevDay?.c || null;
  
        const prevClose = snapshot?.prevDay?.c || null;
  
        const percentageChange =
          prevClose && realTimePrice
            ? ((realTimePrice - prevClose) / prevClose) * 100
            : 0;
  
        const isETFOrBond = props.payload?.category === "ETF" || props.payload?.category === "Bonds";
        const dominantColor = await fetchDominantColor(
          isETFOrBond
            ? CurrentViewMode.Mode_fontColor
            : stockInfo?.branding?.icon_url
            ? `${stockInfo.branding.icon_url}?apiKey=${POLYGON_API_KEY}`
            : `https://assets.parqet.com/logos/symbol/${tickerSymbol}?format=png&size=100`
        );
        setCurrentBackgroundColorForCoin(
          isETFOrBond ? CurrentViewMode.Mode_fontColor : dominantColor
        );
  
        const polygonImage = stockInfo?.branding?.icon_url
          ? `${stockInfo.branding.icon_url}?apiKey=${POLYGON_API_KEY}`
          : null;
        const parqetImage = `https://assets.parqet.com/logos/symbol/${tickerSymbol}?format=png&size=100`;
  
        const polygonImageExists = polygonImage
          ? await fetch(polygonImage, { method: "HEAD" }).then((res) => res.ok).catch(() => false)
          : false;
        const parqetImageExists = !polygonImageExists
          ? await fetch(parqetImage, { method: "HEAD" }).then((res) => res.ok).catch(() => false)
          : false;
  
        const finalImage = polygonImageExists
          ? polygonImage
          : parqetImageExists
          ? parqetImage
          : null;
  
        // 📊 Finnhub financials
        const finnhubQuoteRes = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${coinSymbol}&token=d0ab46hr01qnh1rhd7ogd0ab46hr01qnh1rhd7p0`
        );
        const finnhubQuote = await finnhubQuoteRes.json();
  
        const metricsRes = await fetch(
          `https://finnhub.io/api/v1/stock/metric?symbol=${coinSymbol}&metric=all&token=d0ab46hr01qnh1rhd7ogd0ab46hr01qnh1rhd7p0`
        );
        const metricsData = await metricsRes.json();
  
        const yahooRes = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${coinSymbol}`);
        const yahooData = await yahooRes.json();
        const yahooQuote = yahooData?.quoteResponse?.result?.[0];
  
        const bidPrice = yahooQuote?.bid ?? "N/A";
        const askPrice = yahooQuote?.ask ?? "N/A";
  
        const eps = metricsData?.metric?.epsTTM || "N/A";
        const peRatio = metricsData?.metric?.peTTM || "N/A";
        const openPrice = finnhubQuote?.o || "N/A";
        const highPrice = finnhubQuote?.h || "N/A";
        const lowPrice = finnhubQuote?.l || "N/A";
        const week52High = metricsData?.metric?.["52WeekHigh"] || "N/A";
        const week52Low = metricsData?.metric?.["52WeekLow"] || "N/A";
  
        setCoinData({
          class: "us_equity",
          id: tickerSymbol,
          price: realTimePrice,
          percentageChange,
          image: finalImage,
          name: stockInfo.name || '',
          symbol: coinSymbol,
          dominantColor,
          description: stockInfo.description || "Description not available",
          marketRank: "N/A",
          categories: stockInfo.cik ? [`CIK: ${stockInfo.cik}`] : [],
          homepage: stockInfo.homepage_url || '',
          blockchainSites: [],
          bidPrice,
          askPrice,
          circulatingSupply: "N/A",
          marketAvailability: "N/A",
          marketStatus: isMarketClosed ? "Geschlossen" : "Geöffnet"
        });
  
        setCoinSymbol(coinSymbol);
        setCurrentPrice(realTimePrice);
        setPercentageChange(percentageChange);
        setAssetSupply(null);
  
        setPagesData([
          [
            { id: "1", label: "Kurs", value: realTimePrice ? formatPrice(realTimePrice) : t("CoinPageNAHeader") },
            { id: "2", label: "Unternehmenswert", value: stockInfo.market_cap ? formatPrice(stockInfo.market_cap) : t("CoinPageNAHeader") },
            { id: "3", label: "Kurs-Gewinn-Verhältnis", value: peRatio !== "N/A" ? formatPrice(peRatio) : t("CoinPageNAHeader") },
            { id: "4", label: "Gewinn je Aktie", value: eps !== "N/A" ? formatPrice(eps) : t("CoinPageNAHeader") },
          ],
          [
            { id: "5", label: "Eröffnung", value: openPrice !== "N/A" ? formatPrice(openPrice) : t("CoinPageNAHeader") },
            { id: "6", label: "Vortag", value: prevClose ? formatPrice(prevClose) : t("CoinPageNAHeader") },
            { id: "7", label: "Geld", value: bidPrice !== "N/A" ? formatPrice(bidPrice) : t("CoinPageNAHeader") },
            { id: "8", label: "Brief", value: askPrice !== "N/A" ? formatPrice(askPrice) : t("CoinPageNAHeader") },
          ],
          [
            { id: "9", label: "Tageshoch", value: highPrice !== "N/A" ? formatPrice(highPrice) : t("CoinPageNAHeader") },
            { id: "10", label: "Tagestief", value: lowPrice !== "N/A" ? formatPrice(lowPrice) : t("CoinPageNAHeader") },
            { id: "11", label: "52-Wochen-Hoch", value: week52High !== "N/A" ? formatPrice(week52High) : t("CoinPageNAHeader") },
            { id: "12", label: "52-Wochen-Tief", value: week52Low !== "N/A" ? formatPrice(week52Low) : t("CoinPageNAHeader") },
          ],
          [
            { id: "13", label: "Offizieller Name", value: stockInfo.name || t("CoinPageNAHeader") },
            { id: "14", label: "ISIN", value: stockInfo.composite_figi || t("CoinPageNAHeader") },
            { id: "15", label: "WKN", value: stockInfo.share_class_figi || t("CoinPageNAHeader") },
            { id: "16", label: "Ticker", value: stockInfo.ticker || t("CoinPageNAHeader") },
          ],
        ]);
  
        if (window.realTimePriceInterval) clearInterval(window.realTimePriceInterval);
        if (CoinPageIndex === 0) {
          window.realTimePriceInterval = setInterval(async () => {
            if (CoinPageIndex === -1) {
              clearInterval(window.realTimePriceInterval);
              return;
            }
  
            const updatedSnapRes = await fetch(
              `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${tickerSymbol}?apiKey=${POLYGON_API_KEY}`
            );
            const updatedSnapData = await updatedSnapRes.json();
            const updatedSnapshot = updatedSnapData.ticker || {};
  
            const updatedIsMarketClosed =
              (updatedSnapshot?.day?.c === 0 || updatedSnapshot?.day?.c === undefined) &&
              (updatedSnapshot?.lastTrade?.p === 0 || updatedSnapshot?.lastTrade?.p === undefined);
  
            const updatedPrice = updatedIsMarketClosed
              ? updatedSnapshot?.prevDay?.c || null
              : updatedSnapshot?.lastTrade?.p || updatedSnapshot?.day?.c || null;
  
            const updatedPrevClose = updatedSnapshot?.prevDay?.c || null;
  
            const updatedPercentageChange =
              updatedPrevClose && updatedPrice
                ? ((updatedPrice - updatedPrevClose) / updatedPrevClose) * 100
                : percentageChange;
  
            if (updatedPrice) {
              setCoinData((prev) => ({
                ...prev,
                price: updatedPrice,
                percentageChange: updatedPercentageChange,
                marketStatus: updatedIsMarketClosed ? "Geschlossen" : "Geöffnet"
              }));
              setCurrentPrice(updatedPrice);
              setPercentageChange(updatedPercentageChange);
            }
          }, 6000);
        }
      } catch (error) {
        console.error("🚨 Error fetching full stock data:", error);
      }
    }, 500),
    [formatPrice, formatUnitsNumber]
  );
  
  





  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChart(true);
    }, 3000); // 6 seconds
  
    return () => clearTimeout(timer);
  }, []);



  
  
  








  useEffect(() => {


    const fetchMarketStatus = async () => {
   
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
        }
      };
      
     await fetch('https://broker-api.sandbox.alpaca.markets/v1/clock', options)
        .then(res => res.json())
        .then(res => {
          
          console.log("is it open?  ", res)
  
          setIsMarketOpen(true)
      // setIsMarketOpen(true)
        })
        .catch(err => console.error(err));
  
  
      }
    fetchMarketStatus();
  

    if (CurrentCoinSelected?.id) {
      fetchFullCoinInfo(CurrentCoinSelected.id);
  
      // ✅ Fetch coin news
      const fetchCoinNews = async () => {
        try {
          const res = await fetch(
            `https://api.polygon.io/v2/reference/news?ticker=${CurrentCoinSelected.id.toUpperCase()}&order=desc&limit=10&sort=published_utc&apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`
          );
          const data = await res.json();
          if (Array.isArray(data?.results)) {
            setCoinNews(data.results);
          } else {
            console.warn("⚠️ No news results found.");
            setCoinNews([]);
          }
        } catch (error) {
          console.error("❌ Error fetching coin news:", error);
          setCoinNews([]);
        }
      };
  
      fetchCoinNews();
    }
  
    return () => {
      if (window.realTimePriceInterval) {
        clearInterval(window.realTimePriceInterval); // ✅ Cleanup when switching coins
        console.log("🛑 Clearing interval on coin change");
      }
    };
  }, [CurrentCoinSelected, fetchFullCoinInfo]);
  









useEffect(() => {

  // Check if the user is already following the coin
  const checkIfFollowing = async () => {
    const doc = await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('CoinsIFollow')
      .doc(coinData.id)
      .get();


     // console.log("Do i follow: ", doc.exists)
    setIsFollowing(doc.exists);  // Set state based on whether the document exists
  };

  checkIfFollowing();
}, [coinData.id]);


















console.log(isTradeable)






  const memoizedCoinData = useMemo(() => coinData, [coinData]);

  const priceChangeColor = percentageChange > 0 ? '#00CE39' : '#FE1B20';





	  // Coin Page
	  const sheetRefCoinPage = useRef(null);

	  // variables
	  const snapPointsCoinPage = useMemo(() => ["30%"], []);



 
    
	






    const _handlePressButtonAsync = async () => {
      const whitepaperItem = pagesData.flat().find((item) => item.label === "Whitepaper");
    
      if (whitepaperItem && whitepaperItem.value !== "N/A") {
        let result = await WebBrowser.openBrowserAsync(whitepaperItem.value);
        console.log(result);
      } else {
        console.log("No valid whitepaper link available.");
      }
    };
    
  

  const SCREEN_WIDTH = Dimensions.get('window').width;
  const PAGE_WIDTH = SCREEN_WIDTH * 0.89; // 85% of screen width for partial visibility
  const ITEM_HEIGHT = 55; // Height for each item
  const ITEM_SPACING = 10; // Space between items
 
  
  
  const ItemCard = ({ label, value }) => (
    <View
      style={{
        height: ITEM_HEIGHT,
        marginBottom: ITEM_SPACING,
        borderRadius: 12,
   
        justifyContent: 'center',
      }}
    >

      <View style={{
        flexDirection: 'row',
      }}> 
      <Text style={{ color: CurrentViewMode.Mode_Sec_fontColor, left: 0, position: 'absolute', fontSize: size(15), fontWeight: 'bold' }}>{label}</Text>
      {
  (label === "Whitepaper" && value !== "N/A" && value !== null) ? (
    <TouchableOpacity
      onPress={() => _handlePressButtonAsync(pagesData)}
      style={{
        position: 'absolute',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginTop: -12,
        right: -10,
      }}
    >
      <Text
        style={{
          color: CurrentViewMode.Mode_fontColor,
          fontSize: size(15),
          fontWeight: 'bold',
        }}
      >
        {coinData.name}
      </Text>
    </TouchableOpacity>
  ) : (
    <Text
      style={{
        color: CurrentViewMode.Mode_fontColor,
        position: 'absolute',
        right: 10,
        fontSize: size(15),
        fontWeight: 'bold',
      }}
    >
      {value}
    </Text>
  )
}


      </View>
    </View>
  );

  













  

  
  const StockPage_Sheet = useRef(null);


 




  





  // Interpolate background color based on scroll position


const bgColor = scrollY.interpolate({
  inputRange: [0, 209],
  outputRange: [props.payload?.category == "ETF" ? CurrentViewMode.Mode_fontColor : coinData.dominantColor, CurrentViewMode.Mode_bg],  // Start and end colors
  extrapolate: 'clamp',
});

  
  // Scroll handler to update scroll position with useNativeDriver for performance
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false, // We are not animating styles that require native driver (like background color)
    }
  );


  
  const calculatedHeight = windowHeight * 0.90;














// Function to calculate luminance of a color
function getLuminance(color) {
  if (typeof color !== 'string' || !color.startsWith('#')) {
    console.warn('Invalid color input:', color);
    return 0; // or throw an error, or return a default luminance
  }

  let r = 0, g = 0, b = 0;

  color = color.slice(1);
  if (color.length === 3) {
    color = color.split('').map((char) => char + char).join('');
  }

  r = parseInt(color.substr(0, 2), 16);
  g = parseInt(color.substr(2, 2), 16);
  b = parseInt(color.substr(4, 2), 16);

  r = r / 255;
  g = g / 255;
  b = b / 255;

  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance;
}


// Function to detect if a color is dark, considering deep dark tones
function isColorDeepDark(color) {
  const luminance = getLuminance(color);

  // Check for very dark colors, i.e., close to black
  const isDark = luminance < 0.2; // You can adjust this threshold based on your needs

  // You can also check if the color is very close to black (e.g., hex codes like #000000 or #010101)
  const isVeryCloseToBlack = color === "#000000" || color === "#010101";

  return isDark || isVeryCloseToBlack;
}

// Example usage
const color = coinData.dominantColor; // This is the orange color you mentioned



useEffect(() => {

  if (isColorDeepDark(color)) {
    console.log('The color is dark');
    setFontColorIsDark(true)
  } else {
    console.log('The color is not dark');
    setFontColorIsDark(false)
  }
  

}, [isColorDeepDark])














  const handlePress = () => {



    // Only reset translateY when opening the button
    if (!isOpenTransfer) {


    posthog.capture('open_stock_trade_button', {
      screen: 'Stock_Page',
      $screen_name: 'Stock_Page '+" / "+coinData.name,
      timestamp: new Date().toISOString(),
      });


      translateY.setValue(0); // Reset position when opening
    
      // Opening: Apply animations in sequence with bounce
      Animated.spring(translateY, {
      toValue: -height(12), // Move the parent view upwards by 12% of the screen height
      friction: 1,           // Very low friction for a quick upward movement
      tension: 250,          // High tension for fast upward movement
      velocity: 12,          // High velocity for fast initial movement
      useNativeDriver: true, // Native driver for performance
      }).start();
    
      // After the fast upward movement, apply the "liquid bounce" effect
      Animated.spring(translateY, {
      toValue: -height(6),   // Increased bounce (less than half of the first move)
      friction: 4,           // Moderate friction for smoother control
      tension: 180,          // Slightly higher tension for a more pronounced bounce
      velocity: 8,           // Lower velocity for a slower, more controlled bounce
      useNativeDriver: true, // Native driver for performance
      }).start();
    
      // Show the buttons after the animation starts
      setTimeout(() => {
      setShowTrasnferBtn(true); // Delay buttons' visibility until after animation starts
      }, 300); // Adjust this timeout based on your animation timing
    
    } else {



    posthog.capture('close_stock_trade_button', {
      screen: 'Stock_Page',
      $screen_name: 'Stock_Page '+" / "+coinData.name,
      timestamp: new Date().toISOString(),
      });

      // Closing: Apply animations without bounce
      // Fast floating-up animation (for closing) combined with fade-out
      Animated.spring(translateY, {
      toValue: -height(4),    // Move the button up slightly to make it "disappear"
      friction: 1,            // Very low friction for a quick upward movement
      tension: 250,           // High tension for fast upward movement
      velocity: 12,           // High velocity for fast initial movement
      useNativeDriver: true,  // Native driver for performance
      }).start();
    
      // Fade out the button as it moves upwards
      Animated.timing(opacity, {
      toValue: 0,             // Set opacity to 0 (fully invisible)
      duration: 200,          // Duration of the fade-out
      useNativeDriver: true,  // Native driver for performance
      }).start();
    
      // After the fast upward movement, move it out of view smoothly without bounce
      Animated.spring(translateY, {
      toValue: -height(6),    // Move the button further up out of view (no bounce)
      friction: 4,            // Moderate friction for smoother movement
      tension: 180,           // Moderate tension for a smooth effect
      velocity: 8,            // Slower velocity for smoother motion
      useNativeDriver: true,  // Native driver for performance
      }).start();
    
      // Hide the buttons after the animation ends
      setTimeout(() => {
      setShowTrasnferBtn(false); // Delay buttons' disappearance after animation
      }, 300); // Adjust this timeout based on your animation timing
    }
    
    // Toggle the state for the next press
    setisOpenTransfer(prevState => !prevState);

    // Haptic feedback on press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };
    




  useEffect(() => {
		if (!showTransferBtn) {
		  // Start bounce animation when the button is shown
		  Animated.spring(bounceValue, {
			toValue: 1,
			friction: 3, // Set friction for bounce effect
			tension: 100, // Set tension for bounce effect
			useNativeDriver: true, // Use native driver for performance
		  }).start();
		} else {
		  // Reset the bounce animation when button is hidden
		  bounceValue.setValue(0);
		}
	  }, [showTransferBtn]);
	 
	 

    const toastTriggered = useRef(false);





    const blendWithGray = (hex, intensity = 0.5) => {
      const sanitizedHex = hex.replace('#', '');
      const r = parseInt(sanitizedHex.substring(0, 2), 16);
      const g = parseInt(sanitizedHex.substring(2, 4), 16);
      const b = parseInt(sanitizedHex.substring(4, 6), 16);
    
      // Blend original color with gray (128,128,128)
      const blend = (color, gray) => Math.round(color * (1 - intensity) + gray * intensity);
    
      const newR = blend(r, 158);
      const newG = blend(g, 228);
      const newB = blend(b, 228);
    
      return `rgb(${newR}, ${newG}, ${newB})`;
    };
    
    const originalColor = isSystemTheme ? priceChangeColor : coinData.dominantColor;
    const buttonColor = isMarketOpen ? originalColor : blendWithGray(originalColor, 0.4); // 50% gray tint
    






    const getRelativeTime = (utcDateString) => {
      const publishedTime = DateTime.fromISO(utcDateString, { zone: 'utc' });
      const now = DateTime.now().setZone('utc');
      const diff = now.diff(publishedTime, ['years', 'months', 'days', 'hours', 'minutes']).toObject();
    
      if (diff.years >= 1) return `${Math.floor(diff.years)} year${Math.floor(diff.years) > 1 ? 's' : ''} ago`;
      if (diff.months >= 1) return `${Math.floor(diff.months)} month${Math.floor(diff.months) > 1 ? 's' : ''} ago`;
      if (diff.days >= 1) return `${Math.floor(diff.days)} day${Math.floor(diff.days) > 1 ? 's' : ''} ago`;
      if (diff.hours >= 1) return `${Math.floor(diff.hours)} hour${Math.floor(diff.hours) > 1 ? 's' : ''} ago`;
      if (diff.minutes >= 1) return `${Math.floor(diff.minutes)} minute${Math.floor(diff.minutes) > 1 ? 's' : ''} ago`;
    
      return `just now`;
    };
    







  return (


 
<ActionSheet id="StockPage_Sheet"
  ref={StockPage_Sheet}
  onOpen={() => {
    setShowHomeChart(false)
    setStopRealtimeInHomeChart1D(true)
   // setSearchIndex(-1)
    //setCoinPageIndex(0)
    setIFollowingsCoinsIndex(-1)
    setSearchIndex(-1)
  //  setSearchLoading(true)
   // SheetManager.hide("SearchPage_Sheet")
  
  }}   // Updates state when the sheet opens
  onClose={() => {

    posthog.capture('closed_sheet', {
      screen: 'Stock_Page',
      $screen_name: 'Stock_Page '+" / "+coinData.name,
      timestamp: new Date().toISOString(),
      });
      
    if(SearchIndex == false){
      setShowHomeChart(true)
    }
  

    setShowTrasnferBtn(false)
    setTimeout(() => {
      console.log("🔥 ActionSheet onClose triggered");
      console.log("PlacedOrder:", PlacedOrder);
      console.log("PlacedTracker:", PlacedTracker);
      console.log("SellPlacedOrder:", SellPlacedOrder);
      console.log("toastTriggered.current before check:", toastTriggered.current);
  
      const shouldShowToast = PlacedOrder || PlacedTracker || SellPlacedOrder;
  
      if (!toastTriggered.current && shouldShowToast) {
        toastTriggered.current = true;
        console.log("✅ Showing toast(s)");
  
        if (PlacedOrder) {
          console.log("✅ Showing BUY toast");
          setShowToast(true);
          setPlacedOrder(false);
        }
  
        if (PlacedTracker) {
          console.log("✅ Showing TRACKER toast");
          setShowPriceTickerSaved(true);
          setPlacedTracker(false);
        }
  
        if (SellPlacedOrder) {
          console.log("✅ Showing SELL toast");
          setShowToastSell(true);
          setSellPlacedOrder(false);
        }
      } else {
        console.log("❌ Not showing toast. Reason:");
        if (toastTriggered.current) console.log(" - Already triggered");
        if (!shouldShowToast) console.log(" - All flags are false");
      }
  
      setCoinPageIndex(-1);
      setIFollowingsCoinsIndex(-1);
      setSearchIndex(-1);
    }, 200);
  }}
  
  isModal={false} 
  backgroundInteractionEnabled={false}
  gestureEnabled={true}
 // backgroundInteractionEnabled={false}
 // gestureEnabled={true}

    
  CustomHeaderComponent={
<> 



    <View
    style={{
      backgroundColor: '#fff', // Color of the indicator
      height: height(0.6), // Height of the indicator
      width: width(11),
      borderRadius: 50,
      alignSelf: 'center',
      position: 'absolute',
      top: -15, // Moves the indicator down (distance from the top)
    }}
  />

  

      <Animated.View
      style={{
        height: 40, // Height of the header
        backgroundColor: bgColor,
        borderTopLeftRadius: 20, // Rounded top corners
        borderTopRightRadius: 20, // Rounded top corners
        width: '100%', // Full width
        alignSelf: 'center', // Center the header
      }}

    />

    
    </>
  }
    
      
      containerStyle={{
   
        maxHeight: height(92),
        backgroundColor: CurrentViewMode.Mode_bg,
        height: height(92),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        
      }} 	
      style={{
        height: "100%",
        backgroundColor: CurrentViewMode.Mode_bg,
    }}>
    
    


<ScrollView contentContainerStyle={{paddingBottom: height(20)}}  
        onScroll={handleScroll}
        scrollEventThrottle={6} // Increase the frequency of updates

      
      
style={{
  backgroundColor: CurrentViewMode.Mode_bg,
//  opacity: PriceTrackerIndex == 0 || AmountIndex == 0 ? 0 : 100,
  height: "100%",
 // zIndex: PriceTrackerIndex === 0 || AmountIndex === 0 ? -1 :  1,
}}>


 <LinearGradient
 style={{
  height: height(60),
  backgroundColor: CurrentViewMode.Mode_bg,
 }}
 locations={[0, 0.4, 1]}  
    colors={[  props.payload?.category == "ETF" ? CurrentViewMode.Mode_fontColor : coinData.dominantColor, CurrentViewMode.Mode_bg, CurrentViewMode.Mode_bg,]}>

<View style={{
  flexDirection: 'row',
  alignItems: 'center'
}}>



{
      props.payload?.category == "ETF"

      ?


      <View style={{
        height: size(40),
        width: size(40),
        backgroundColor: '#222',
       // marginLeft: width(5),
        borderRadius: size(8),
        marginTop: height(2),
        marginLeft: width(5),

        overflow: 'hidden',
        backgroundColor: CurrentViewMode.Mode_fontColor
    
    
      }}>
      <Text style={{
          fontSize: size(10),
          fontWeight: "900",
          marginLeft: width(1),
          marginTop: height(0.2),
          color: CurrentViewMode.Mode_bg
      }}>
        {coinData.symbol}
      </Text>

      </View>

      :
      

 null


}





{
  props.payload?.category === "Bonds" &&
  (!coinData.image || coinData.image === "" || coinData.image === "undefined")
    ? (
      <View
        style={{
          height: size(30),
          width: size(30),
          marginLeft: width(5),
          borderRadius: size(30) / 2,
          overflow: 'hidden',
          justifyContent: 'center',
        }}
      >
        <Text style={{
          fontSize: size(10),
          fontWeight: "900",
          alignSelf: 'center',
          color: CurrentViewMode.Mode_fontColor,
        }}>
          {coinData.symbol}
        </Text>
      </View>
    )
    : null
}






{
 
  props.payload?.category !== "ETF" &&
  coinData.image && coinData.image !== "undefined" ? (
    <View style={{
      height: size(40),
      width: size(40),
      marginTop: height(2),
      marginLeft: width(5),
      borderRadius: size(40) / 2,
      overflow: 'hidden',
      backgroundColor: "#fff",
    }}>
      <SvgFromUri
        uri={`https://assets.parqet.com/logos/symbol/${coinData.symbol}?format=svg`}
        width={"100%"}
        height={"100%"}
      />
    </View>
  ) : null
}



{/*

<View style={{
  height: size(40),
  width: size(40),
  marginTop: height(2),
  marginLeft: width(5),
  borderRadius: size(40)/2,
  overflow: 'hidden',
  backgroundColor: "#fff",


}}>


    <SvgFromUri uri={`https://assets.parqet.com/logos/symbol/${coinData.symbol}?format=svg`} 
    width={"100%"} height={"100%"} />
</View>


*/}





  <TouchableOpacity onPress={() => {

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    handleFollowCoin(coinData)

  }}
  style={{
    paddingVertical: 12,
    paddingHorizontal: 20,
    position: 'absolute',
    right: width(5),
    flexDirection: 'row',
  }}>
    {
      isFollowing == false

      ?

      null

      :

      <MaterialIcons name='check' style={{
        color: priceChangeColor,
        fontSize: size(20),
        marginRight: width(0.5),
      }} />

    }
   
    <Text style={{
      fontSize: size(17),
      fontWeight: "bold",
      color: priceChangeColor,

    }}>
       {isFollowing ? t("FollowingHeader") : 'Follow'}
    </Text>
  </TouchableOpacity>
</View>



  <Text numberOfLines={2} style={{
    fontSize: size(30),
    width: "90%",
    color: FontColorIsDark == true ? "#fff" : CurrentViewMode.Mode_fontColor,
    fontWeight: "bold",
    marginLeft: width(5),
    marginTop: height(2),
  }}>
    {coinData.name}
  </Text>



  <View style={{ flexDirection: 'row',  marginLeft: width(5),  marginTop: height(1), alignItems: 'center' }}>


               
  <RollingNumberStocks
            currency="$"
            locale="en-US"
            style={{
              fontSize: size(28),
              marginLeft: width(5),
              color: FontColorIsDark == true ? "#fff" : CurrentViewMode.Mode_fontColor,
              fontWeight: "bold",
              textAlign: "center",
            }}
          />


        {/*    <Text
                style={{
                  fontSize: size(28),
                  marginLeft: width(5),
                  color: FontColorIsDark == true ? "#fff" : CurrentViewMode.Mode_fontColor,
                  fontWeight: "bold",
                }}
              >
              {formatPrice(currentPrice)}
              </Text>
*/}
              <Text
                style={{
                  fontSize: size(16),
                  marginLeft: width(3),
                  marginTop: height(0.6),
                  color:  priceChangeColor,
                  fontWeight: "bold",
                }}
              >
               {percentageChange  > 0 ? "▲ +" : "▼ -"}{" "}
               {Math.abs(percentageChange).toFixed(2)}%   {isMarketOpen === null ? (
        null
      ) : isMarketOpen ? (
        null
      ) : (
      <MaterialCommunityIcons name='power-sleep' style={{ color:  priceChangeColor, fontSize: size(20)}} />
      )}

              </Text>


        </View>





 </LinearGradient>




 <View style={{ flexDirection: 'row', marginLeft: width(3), marginTop: height(-34), marginBottom: height(2) }}>
  {['1D', '1W', '1M', '1Y', 'MAX'].map((interval) => (
    <TouchableOpacity
      key={interval}
      onPress={() => {
        setSelectedInterval(interval);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: width(1),
      }}
    >
      <Text style={{ color: selectedInterval === interval ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Sec_fontColor, fontWeight: "bold", fontSize: size(15), }}>
        {t(`ChartTimer${interval}`)}  {/* Using translation keys for intervals */}
      </Text>
    </TouchableOpacity>
  ))}
</View>

        

          
{showChart ? (
  CurrentCoinSelected && CurrentCoinSelected.id ? (
    <StockChart
      priceChangeColor={priceChangeColor}
      selectedInterval={selectedInterval || '1D'}
      coinId={CurrentCoinSelected.id}
    />
  ) : (
    <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
      {t("CoinPageNoCoinSelectedText")}
    </Text>
  )
) : null}










{!isMarketOpen && (
  <View style={{ marginTop: height(4) }}> 
    <View
      style={{
        height: height(15),
        paddingVertical: size(20),
        paddingHorizontal: size(20),
        borderRadius: size(12),
        width: "90%",
        alignSelf: 'center',
        opacity: 0.2,
        backgroundColor: isSystemTheme ? priceChangeColor : coinData.dominantColor,
      }}
    />

    <Text
      style={{
        width: "80%",
        position: 'absolute',
        marginTop: height(3),
        marginLeft: width(5),
        fontSize: size(13),
        fontWeight: "bold",
        color: CurrentViewMode.Mode_fontColor,
        alignSelf: 'center',
        lineHeight: height(2.5),
      }}
    >
      Aktuell ist die Börse geschlossen.
    </Text>

    <Text
      style={{
        width: "80%",
        position: 'absolute',
        marginTop: height(7),
        marginLeft: width(5),
        fontSize: size(13),
        color: CurrentViewMode.Mode_fontColor,
        alignSelf: 'center',
        lineHeight: height(2.5),
      }}
    >
      Orders können zu den offiziellen Handelszeiten aufgegeben werden.
    </Text>
  </View>
)}









{
  DoesAlpacaAssetExists == true


  ?

null


:



<View style={{
   marginTop: height(4),
}}> 
<View style={{
    height: height(15),
    paddingVertical: size(20),
    paddingHorizontal: size(20),
   
    borderRadius: size(12),
    width: "90%",
    alignSelf: 'center',
    opacity: 0.2,
    backgroundColor: isSystemTheme == true ? priceChangeColor : coinData.dominantColor,
}}> 


</View>

<Text style={{
  width: "80%",
  position: 'absolute',
  marginTop: height(4),
  marginLeft: width(5),
  fontSize: size(13),
  fontWeight: "bold",
  color: CurrentViewMode.Mode_fontColor,
  alignSelf: 'center',
  lineHeight: height(2.5),
}}>

You can view price charts, but buying, selling, or trading this asset is not currently available on Bantico.
</Text>
</View>



}





<Text style={{
  fontSize: size(20),
  fontWeight: "bold",
  color: CurrentViewMode.Mode_fontColor,
  marginLeft: width(5),
  marginTop: height(4),
}}>

{t("InformationText")}  

</Text>








<View style={{
    marginLeft: width(5),
    marginTop: height(3),
    width: "90%",
}}> 




<Text numberOfLines={showFullText ? 0 : 3}  

style={{
  fontSize: size(15),
  color: CurrentViewMode.Mode_fontColor,
  lineHeight: height(2.6),
  fontWeight: "bold",
  width: "88%",

}}>
{coinData.description}
</Text>


<TouchableOpacity onPress={() => {
  setShowFullText(!showFullText)
}}
style={{
position: 'absolute',
right: 10,
bottom: 0,
}}>
<MaterialIcons name={showFullText ==  0 ?  "keyboard-arrow-down" : "keyboard-arrow-up"} 
style={{
  color: CurrentViewMode.Mode_Sec_fontColor,
  fontSize: size(25),


}} />
</TouchableOpacity>
</View>








<FlatList
      data={pagesData}
      keyExtractor={(item, index) => `page-${index}`}
      horizontal
      pagingEnabled
      
      showsHorizontalScrollIndicator={false}
      snapToInterval={PAGE_WIDTH + 10} // Snap to each page with a little margin for partial visibility
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 20 }}
      renderItem={({ item }) => (
        <View style={{ width: PAGE_WIDTH, padding: 10 }}>
          {item.map((dataItem) => (
            <ItemCard key={dataItem.id} label={dataItem.label} value={dataItem.value} />
          ))}
        </View>
      )}
    />
   








<TouchableOpacity onPress={() => {


posthog.capture('open_stock_price_tracker_bottomsheet', {
  screen: 'Stock_Price_Tracker_Page',
  $screen_name: 'Stock_Price_Tracker_Page',
  timestamp: new Date().toISOString(),
  });


  SheetManager.show('StockPriceTracker_Sheet', {
    payload: {
      coinData,
      dominantColor: coinData.dominantColor,
    }
  }); 
}}
style={{
  paddingVertical: 12,
  marginLeft: width(5),
  paddingHorizontal: 10,
  flexDirection: 'row',
  alignItems: 'center',
}}>
  <Text style={{
    color: priceChangeColor,
    fontWeight: "900",
    marginRight: width(2),
    fontSize: size(16)
  }}>
  {t("PriceTrackerText")}  

  </Text>

  <MaterialIcons name="arrow-forward-ios" style={{
    color: priceChangeColor,
    fontSize: size(18),

  }} />
</TouchableOpacity>











<Text style={{
  fontSize: size(20),
  fontWeight: "bold",
  color: CurrentViewMode.Mode_fontColor,
  marginLeft: width(5),
  marginTop: height(4),
}}>

{t("NewsText")}  

</Text>





{
  CoinNews == null || CoinNews == "'Failed to fetch news:', 403" 

  ?


    <Text style={{
      color: CurrentViewMode.Mode_fontColor,
      fontSize: size(15),
      fontWeight: "600",
    }}>
   {t("NoNewsText")}    
    </Text>


 :



<FlatList
  data={CoinNews}
  keyExtractor={(item, index) => `page-${index}`}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  snapToInterval={width(80) + 20}  // Item width + margin for spacing
  decelerationRate="fast"
  contentContainerStyle={{
    paddingHorizontal: 20,  // Optional to add some padding at the start and end
  }}
  style={{
    marginTop: height(3),
  }}
  renderItem={({ item }) => (
    <View
      style={{
        width: width(80),
        marginRight: 30,  // Ensure consistent spacing between items
        borderRadius: 12,
      }}
    >

      <Text 
      style={{ 
        color: CurrentViewMode.Mode_fontColor,
        lineHeight: height(2.5),
        width: "90%",
        fontWeight: "600",
        fontSize: size(15), 
      }}>
        {item.title}
      </Text>



      <Text 
      style={{ 
        color: CurrentViewMode.Mode_Third_fontColor,
        marginTop: height(4),
        width: "90%",
        fontSize: size(15), 
        fontWeight: 'bold' 
      }}>
        {getRelativeTime(item.published_utc)}
      </Text>
   
      </View>

      )}
    />
   

}









<Text style={{
  color: CurrentViewMode.Mode_Third_fontColor,
  fontSize: size(13),
  lineHeight: height(2.5),
  width: "90%",
  marginTop: height(7),
  alignSelf: 'center',

}}>

{t("CryptocurrenciesareahighriskInvestmentText")}  

</Text>
</ScrollView>









    <View style={{
      height: 100,
      width: "100%",
      position: 'absolute',
      bottom: 0,
      alignSelf: 'center',
  //    backgroundColor: 'yellow',
    }}>
{/*
    <TouchableOpacity
    style={{
      height: size(55),
			alignItems: 'center',
			paddingHorizontal: 15,
			borderRadius: 20,
			flexDirection: "row",
			zIndex: 1,
			bottom: height(8),
			left: size(30),
      justifyContent: 'center',
      alignItems: 'center',
			width: width(41),
			position: 'absolute',
		  backgroundColor: isSystemTheme == true ? priceChangeColor : coinData.dominantColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
		 }}>

    <Text  style={{
        fontSize: size(18),
        color: FontColorIsDark == true ? "#fff" :  '#000',
        alignSelf: 'center',
        fontWeight: "bold"
      }}>
       {t("TransferBtnText")}    
      </Text>

    </TouchableOpacity>


*/}

















{isMarketOpen === true ? (
  <>
    {DoesAlpacaAssetExists === false ? null : (
      <>
        {showTransferBtn === true ? (
          <>
            {/* Floating Buttons */}
            <Animated.View
              style={{
                transform: [{ translateY }],
                position: 'absolute',
                zIndex: 100,
                bottom: height(6),
                right: 30,
                alignItems: 'center',
              }}
            >
              {/* Sell Button */}
              <TouchableOpacity
                onPress={() => {

                  posthog.capture('open_stock_sellamount_type_bottomsheet', {
                    screen: 'StockPage_Sheet',
                    $screen_name: 'StockPage_Sheet '+" / "+coinData.name,
                    timestamp: new Date().toISOString(),
                    });
                 
                    setShowTrasnferBtn(false)
                  SheetManager.show("Stock_SellAmountType_Sheet")
                }}
                activeOpacity={0.8}
                style={{
                  height: size(55),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  zIndex: 100,
                  bottom: height(6),
                  paddingHorizontal: 15,
                  width: width(40),
                  flexDirection: 'row',
                  backgroundColor: isSystemTheme === true ? priceChangeColor : coinData.dominantColor,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.30,
                  shadowRadius: 4.65,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    alignSelf: 'center',
                    color: FontColorIsDark === true ? "#fff" : '#000',
                    fontWeight: 'bold',
                    fontSize: 17,
                  }}
                >
                  {t("SellButtonTitle")}
                </Text>
                <Entypo name="minus" style={{
                  color: FontColorIsDark === true ? "#fff" : '#000',
                  fontSize: size(20),
                  marginLeft: width(3)
                }} />
              </TouchableOpacity>

              {/* Buy Button */}
              <TouchableOpacity
                onPress={() => {

                posthog.capture('open_stock_money_amount_bottomsheet', {
                  screen: 'StockPage_Sheet',
                  $screen_name: 'StockPage_Sheet '+" / "+coinData.name,
                  timestamp: new Date().toISOString(),
                  });
                  
                  setShowTrasnferBtn(false)
                  SheetManager.show("StockMoneyAmount_Sheet")
                }}
                activeOpacity={0.8}
                style={{
                  height: size(55),
                  justifyContent: 'center',
                  borderRadius: 20,
                  zIndex: 100,
                  bottom: height(4),
                  alignItems: 'center',
                  paddingHorizontal: 15,
                  width: width(40),
                  flexDirection: 'row',
                  backgroundColor: isSystemTheme === true ? priceChangeColor : coinData.dominantColor,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.30,
                  shadowRadius: 4.65,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    alignSelf: 'center',
                    color: FontColorIsDark === true ? "#fff" : '#000',
                    fontWeight: 'bold',
                    fontSize: 17,
                  }}
                >
                  {t("BuyButtonTitle")}
                </Text>
                <Entypo name="plus" style={{
                  fontSize: size(20),
                  marginLeft: width(3),
                  color: FontColorIsDark === true ? "#fff" : '#000',
                }} />
              </TouchableOpacity>
            </Animated.View>

            {/* Close button */}
            <TouchableOpacity
              onPress={handlePress}
              activeOpacity={0.8}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                zIndex: 1,
                bottom: height(8),
                right: 30,
                height: size(55),
                width: size(55),
                position: 'absolute',
                backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,

              }}
            >
              <MaterialIcons name='close' style={{
                color: CurrentViewMode.Mode_fontColor,
                alignSelf: 'center',
                fontSize: size(24)
              }} />
            </TouchableOpacity>
          </>
        ) : (
          // Transfer Button
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            style={{
            	alignItems: 'center',
              height: size(55),
              justifyContent: 'center',
              borderRadius: 20,
              zIndex: 1,
              bottom: height(8),
              paddingHorizontal: 15,
              alignSelf: 'center',
              // right: size(30),
              width: width(90),
              flexDirection: 'row',
              position: 'absolute',
              backgroundColor: isSystemTheme == true ? priceChangeColor : coinData.dominantColor,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.30,
              shadowRadius: 4.65,
              elevation: 8,
            }}
          >
          
          <Animated.View
            style={{
            transform: [
              {
              translateX: bounceValue.interpolate({
                inputRange: [0, 1],
                outputRange: [width(2), 0], // Move from right to left
              }),
              },
            ],
            }}
          >
            <Text
            style={{
              alignSelf: 'center',
              color: FontColorIsDark == true ? "#fff" :  '#000',
              fontWeight: 'bold',
              fontSize: size(18),
            }}
            >
              {t("TradeButtonTitle")}  	
            </Text>
          </Animated.View>
          
        
          <Entypo
            name="plus"
            style={{
            fontSize: size(20),
            left: size(12),
            color:  FontColorIsDark == true ? "#fff" : '#000',
            }}
          />
          </TouchableOpacity>
        )}
      </>
    )}
  </>
) : (
  // If market is closed
  <TouchableOpacity disabled
    onPress={handlePress}
    activeOpacity={0.8}
    style={{
      alignItems: 'center',
      height: size(55),
      justifyContent: 'center',
      borderRadius: 20,
      zIndex: 1,
      bottom: height(8),
      paddingHorizontal: 15,
      alignSelf: 'center',
      width: width(90),
      flexDirection: 'row',
      position: 'absolute',
      backgroundColor: buttonColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    }}
  >
    <Animated.View
      style={{
        transform: [
          {
            translateX: bounceValue.interpolate({
              inputRange: [0, 1],
              outputRange: [width(2), 0],
            }),
          },
        ],
      }}
    >
      <Text
        style={{
          alignSelf: 'center',
          color: FontColorIsDark === true ? "#fff" : '#000',
          fontWeight: 'bold',
          fontSize: size(18),
        }}
      >
        {t("TradeButtonTitle")}
      </Text>
    </Animated.View>
    <Entypo
      name="plus"
      style={{
        fontSize: size(20),
        left: size(12),
        color: FontColorIsDark === true ? "#fff" : '#000',
      }}
    />
  </TouchableOpacity>
)}




    </View>
    </ActionSheet>





);
});
export default StockPage;