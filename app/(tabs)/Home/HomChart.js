
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, Easing, Button, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {AntDesign, Feather, Ionicons, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
import { Platform } from 'react-native';
import { Link } from 'expo-router';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'


import { FlashList } from "@shopify/flash-list";
import debounce from 'lodash.debounce'; // Debounce to avoid too many API calls

import { HomeChartContext } from '@/app/Context/HomeChartContext';
import _ from 'lodash';
import * as TaskManager from 'expo-task-manager';
import { DateTime } from "luxon"; // Install with `npm install luxon`
import { ViewModeContext } from '@/app/Context/ViewModeContext';


import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";



















      

  




export default function HomeChart() {


  	const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  
  
  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const {StopRealtimeInHomeChart1D, setStopRealtimeInHomeChart1D} = useContext(HomeChartContext)


  const resetTimeoutRef = useRef(null); // ✅ Store reset timer reference

  const invokeHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);


  const [portfolioData, setPortfolioData] = useState([ {
    timestamp: 1625945400000,
    value: 0,
  },
  {
    timestamp: 1625946300000,
    value: 0,
  },
  {
    timestamp: 1625947200000,
     value: 0,
  },
  {
    timestamp: 1625948100000,
    value: 0,
  },]);
  const [selectedPeriod, setSelectedPeriod] = useState('1D');
  const [cachedData, setCachedData] = useState({});
  const { 
    currentPrice, 
    setCurrentPrice, 
    currentDate, 
    setCurrentDate, 
    percentageChange, 
    setPercentageChange, 
    dollarChange, 
    setDollarChange,
    priceChangeColor, 
    setPriceChangeColor,
  } = useContext(HomeChartContext);
  const [currentIndex, setCurrentIndex] = useState(null); // Track current index

 
  const [realTimePrice, setRealTimePrice] = useState(0);


  const [InitalPercentageChnage, setInitalPercentageChnage] = useState(0);
  const [InitalDollarChnage, setInitalDollarChnage] = useState(0);


  const [AlpacaUserId, setAlpacaUserId] = useState();

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")









useEffect(() => {

const fetchUserData = async () => {
  try {
    const userDocument = await firestore()
    .collection('users') // Reference to the 'users' collection
    .doc(user.uid) // The specific document ID
    .get();

    if (userDocument.exists) {
    // If the document exists, set the data

    setAlpacaUserId(userDocument.data().AlpacaAccountId)

    console.log("AlpacaAccountId: ", userDocument.data().AlpacaAccountId)

  } else {
    // Handle the case when the document doesn't exist
    console.log('No such document!');
  }
  } catch (error) {
  console.error('Error fetching user data:', error);
  }
  };
  
  fetchUserData();
  
  
}, [AlpacaUserId])











// Fetch data in chunks
const fetchDataInChunks = async (period, controller, chunkSize = 10000, offset = 0) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==',
    },
    signal: controller.signal,
  };

  let url;
  
  // Get today's date in RFC3339 format
  const todayISO = new Date().toISOString();
  
  if (period === "MAX") {
    try {
      // First, fetch the earliest known timestamp dynamically
      const firstDataResponse = await fetch(
        `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account/portfolio/history?period=1A&timeframe=1D&intraday_reporting=continuous`,
        options
      );
      const firstData = await firstDataResponse.json();

      if (firstData && firstData.timestamp && firstData.timestamp.length > 0) {
        const earliestTimestamp = firstData.timestamp[0] * 1000; // Convert to milliseconds
        const startDateISO = new Date(earliestTimestamp).toISOString();

        console.log(`📆 Dynamically fetched earliest portfolio date: ${startDateISO}`);

        // Construct URL with dynamically computed start date
        url = `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account/portfolio/history?start=${startDateISO}&end=${todayISO}&timeframe=1D&intraday_reporting=continuous&pnl_reset=no_reset`;
      } else {
        console.warn("⚠️ Failed to fetch earliest timestamp, defaulting to 10 years.");
        url = `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account/portfolio/history?period=10A&timeframe=1D&intraday_reporting=continuous`;
      }
    } catch (error) {
      console.error("❌ Error fetching earliest timestamp:", error);
      url = `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account/portfolio/history?period=10A&timeframe=1D&intraday_reporting=continuous`;
    }
  } else {
    // Standard URL for other periods
    url = `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account/portfolio/history?period=${period}&intraday_reporting=continuous`;
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!data || !data.equity || !data.base_value_asof) {
      console.error(`❌ API response invalid for period: ${period}`, data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
fetchDataInChunks()











// Downsample the data to reduce the number of points for larger time periods
const downsampleData = (data, factor = 5) => {
  if (data.length > 1000) {
    factor = 10;
  }
  return data.filter((_, index) => index % factor === 0);
};

// Helper function to format the data for a specific period (e.g., 1W)
const formatWeeklyData = (data) => {
  const baseTimestamp = new Date(data.base_value_asof).getTime();
  return data.equity.map((value, index) => ({
    timestamp: baseTimestamp + index * 86400000, // Add a day (24h in ms)
    value: value,
  }));
};




  

  const staticData = useMemo(() => [
    { timestamp: Date.now() - 3 * 60000, value: 0 },
    { timestamp: Date.now() - 2 * 60000, value: 0 },
    { timestamp: Date.now() - 60000, value: 0 },
    { timestamp: Date.now(), value: 0 },
  ], []);






  useEffect(() => {
    if (StopRealtimeInHomeChart1D === true || selectedPeriod !== "1D") return;
  
    let interval = null;
    let lastKnownPrice = null;
  
    const fetchRealTimePortfolioValue = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization:
            "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==",
        },
      };
  
      try {
        const response = await fetch(
          `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account`,
          options
        );
        const data = await response.json();
  
        const equity = parseFloat(data.equity);
        const lastEquity = parseFloat(data.last_equity) || equity;
  
        if (!equity || isNaN(equity)) {
          console.warn("⚠️ Ungültiger equity-Wert erhalten:", data.equity);
          return;
        }
  
        const percentageChange = lastEquity !== 0 ? ((equity - lastEquity) / lastEquity) * 100 : 0;
        const dollarChange = equity - lastEquity;
  
        const isNegative = percentageChange < 0 || dollarChange < 0;
  
        setDollarChange(isNaN(dollarChange) ? 0 : dollarChange);
        setPercentageChange(isNaN(percentageChange) ? 0 : percentageChange);
        setPriceChangeColor(isNegative ? "#FE1B20" : "#00CE39");
        setCurrentPrice(equity);
  
        // Only push new point if it changed
        if (lastKnownPrice !== equity) {
          lastKnownPrice = equity;
  
          setPortfolioData((prevData) => {
            const newPoint = {
              timestamp: Date.now(), // ✅ Always use current time
              value: equity,
            };
  
            // ✅ Avoid duplicate value if it matches the last one
            if (prevData.length > 0 && prevData[prevData.length - 1].value === equity) {
              return prevData;
            }
  
            return [...prevData, newPoint].slice(-300); // Keep last 300 points max
          });
        }
      } catch (error) {
        console.error("❌ Fehler beim Abrufen der Portfolio-Daten:", error);
      }
    };
  
    interval = setInterval(fetchRealTimePortfolioValue, 6000); // ✅ every 6 seconds
    fetchRealTimePortfolioValue(); // Fetch once immediately
  
    return () => {
      clearInterval(interval);
    };
  }, [AlpacaUserId, selectedPeriod, StopRealtimeInHomeChart1D]);
  







useEffect(() => {
  // Preload 1D data immediately when the app loads
  console.log("⏳ Preloading 1D data...");
  preloadPortfolioHistory('1W');  // Preload 1D data on app start
}, []);  // Empty dependency array ensures this runs only once when the component mounts

useEffect(() => {
  if (!selectedPeriod) return;

  console.log(`⏳ Fetching data for selected period: ${selectedPeriod}`);

  // Immediately fetch new period data without unnecessary delay
  preloadPortfolioHistory(selectedPeriod);

}, [selectedPeriod]);  // This effect runs when the selectedPeriod changes












const preloadPortfolioHistory = useCallback(async (period) => {
  if (!period) return;

  // Check if the data is already cached for the selected period
  if (cachedData[period]) {
    console.log(`✅ Using cached data for ${period}`);
    setPortfolioData(cachedData[period]);
    updateGrowthMetrics(cachedData[period]);
    return;  // Return early if data is cached
  }

  console.log(`📡 Fetching new data for ${period}...`);

  let allData = [];
  let offset = 0;
  const chunkSize = 25000; // Adjust chunk size for large data sets

  try {
    while (true) {
      const data = await fetchDataInChunks(period, new AbortController(), chunkSize, offset);

      if (!data || !data.timestamp || !data.equity) {
        console.warn(`⚠️ No valid data found for ${period}`);
        return;
      }

      const formattedData = data.timestamp.map((timestamp, index) => ({
        timestamp: timestamp * 1000, // Convert timestamp to milliseconds
        value: data.equity[index],
      }));

      allData = [...allData, ...formattedData];

      // Exit loop when we have enough data
      if (data.timestamp.length < chunkSize || period === '1W' || period === '1M') {
        break;
      }

      offset += chunkSize;
    }

    // Handle data downsampling for 1W and 1M periods
    if (period === '1W' || period === '1M') {
      allData = allData.slice(0, 200);  // Keep the first 200 points for both 1W and 1M
      console.log(`📊 Showing ${allData.length} points for ${period}`);
    }

    const downsampledData = downsampleData(allData);  // Downsample if needed
    setCachedData((prevData) => ({ ...prevData, [period]: downsampledData }));

    // Show the chart with new data
    setPortfolioData(downsampledData);
    updateGrowthMetrics(downsampledData);

    console.log(`✅ Data successfully loaded for ${period}`);
  } catch (err) {
    console.error(`❌ Error fetching ${period} data:`, err);
  }
}, [AlpacaUserId, cachedData, selectedPeriod]);












const updateGrowthMetrics = (data) => {
  if (data.length > 1) {
    const firstPoint = data.find(p => p.value !== 0) || data[0];
    const lastPoint = data[data.length - 1];

    if (firstPoint && lastPoint && firstPoint.value !== 0) {
      // Calculate dollar change
      const dollarChange = lastPoint.value - firstPoint.value;

      // Calculate percentage change based on dollar change
      const percentageChange = firstPoint.value !== 0
        ? ((dollarChange) / firstPoint.value) * 100
        : 0;

      // Ensure percentageChange follows the sign of dollarChange
      const isNegative = dollarChange < 0;

      // If dollar change is negative, we make sure percentage change is negative too
      const correctedPercentageChange = isNegative ? -Math.abs(percentageChange) : Math.abs(percentageChange);

      // Update the state with the corrected percentage and dollar change
      setPercentageChange(correctedPercentageChange);
      setDollarChange(dollarChange);

      // Set the color based on whether the change is negative or positive
      setPriceChangeColor(isNegative ? "#FE1B20" : "#00CE39"); // Red for negative, Green for positive

      // Store the initial values for future reference
      setInitalPercentageChnage(correctedPercentageChange);
      setInitalDollarChnage(dollarChange);

      console.log("📊 Growth Metrics Updated:", { firstPoint, lastPoint, correctedPercentageChange, dollarChange });
    }
  }
};














  
  
useEffect(() => {
  if (StopRealtimeInHomeChart1D === true) {
    console.log("⛔ Realtime updates stopped by flag");
    return; // ✅ Exit early — do nothing if flag is set
  }

  let lastKnownPrice = null;

  const fetchRealTimePortfolioValue = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization:
          "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==",
      },
    };

    try {
      const response = await fetch(
        `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account`,
        options
      );
      const data = await response.json();

      if (["1W", "1M", "1A", "MAX"].includes(selectedPeriod)) {
        if (portfolioData.length > 1) {
          const firstPoint = portfolioData.find(p => p.value !== 0) || portfolioData[0];
          const lastPoint = portfolioData[portfolioData.length - 1];

          if (firstPoint && lastPoint && firstPoint.value !== 0) {
            const dollarChange = lastPoint.value - firstPoint.value;
            let percentageChange = (firstPoint.value !== 0)
              ? ((lastPoint.value - firstPoint.value) / firstPoint.value) * 100
              : 0;

            if (dollarChange < 0) percentageChange = -Math.abs(percentageChange);

            const isNegative = dollarChange < 0 || percentageChange < 0;
            setPriceChangeColor(isNegative ? "#FE1B20" : "#00CE39");
            setDollarChange(dollarChange);
            setPercentageChange(percentageChange);
            setInitalPercentageChnage(percentageChange);
            setInitalDollarChnage(dollarChange);

            console.log(`📊 Last Data for ${selectedPeriod}:`, lastPoint);
          }
        }
        return;
      }

      const equity = parseFloat(data.equity) || 0;
      setRealTimePrice(equity);

      const initialEquity = parseFloat(data.last_equity) || 0;
      let percentageChange = initialEquity === 0
        ? 0
        : ((equity - initialEquity) / initialEquity) * 100;

      const dollarChange = equity - initialEquity;

      if (dollarChange < 0) percentageChange = -Math.abs(percentageChange);

      setDollarChange(isNaN(dollarChange) ? 0 : dollarChange);
      setCurrentPrice(equity);

      const isNegative = dollarChange < 0 || percentageChange < 0;
      setPriceChangeColor(isNegative ? "#FE1B20" : "#00CE39");
      setPercentageChange(isNaN(percentageChange) ? 0 : percentageChange);
    } catch (error) {
      console.error("❌ Error fetching real-time portfolio value:", error);
    }
  };

  let interval = null;
  if (selectedPeriod === "1D") {
    interval = setInterval(fetchRealTimePortfolioValue, 3000); // ✅ 6s interval
  } else {
    fetchRealTimePortfolioValue();
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [AlpacaUserId, selectedPeriod, portfolioData, StopRealtimeInHomeChart1D]);










// Function to calculate percentage and dollar change based on the first valid investment point
const calculateChange = (currentPoint) => {
  if (portfolioData.length > 0) {
    // Find the first valid non-zero investment entry
    let firstInvestmentPoint = portfolioData.find((p) => p.value > 0) || portfolioData[0];
    let firstPoint = portfolioData.find((p, i) => p.value !== 0 && i < portfolioData.length - 1) || firstInvestmentPoint;

    // Ensure we don't use a `0` value as the firstPoint reference
    if (!firstPoint || firstPoint.value === 0) {
      firstPoint = firstInvestmentPoint;
    }

    // Safeguard: If firstPoint.value is 0, set percentageChange to 0 to avoid Infinity
    let percentageChange = 0;
    if (firstPoint.value !== 0) {
      percentageChange = ((currentPoint.value - firstPoint.value) / firstPoint.value) * 100;
    }

    // If percentageChange is Infinity or NaN, set it to 0
    if (!isFinite(percentageChange)) {
      percentageChange = 0;
    }

    // Calculate dollar change
    const dollarChange = currentPoint.value - firstPoint.value;

    // Return the calculated changes
    return {
      percentageChange: isNaN(percentageChange) ? 0 : percentageChange, // Default to 0 if NaN
      dollarChange: isNaN(dollarChange) ? 0 : dollarChange, // Default to 0 if NaN
    };
  }

  return { percentageChange: 0, dollarChange: 0 }; // Default if no data
};




  
  // Function to reset color and price after 5 seconds of inactivity
 /* const resetColorAfterInactivity = useCallback(() => {
    // Clear any existing inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

     // Set a new timer to reset after 5 seconds of inactivity
     inactivityTimerRef.current = setTimeout(() => {
      setCurrentPrice(realTimePrice);
      if (portfolioData.length > 0) {
        const firstPoint = portfolioData[0]; // First data point
        const lastPoint = portfolioData[portfolioData.length - 1]; // Last data point

        // Reset the tooltip color based on the overall growth/loss of the period
        if (lastPoint.value > firstPoint.value) {
          setPriceChangeColor('#00CE39'); // Green for overall growth
        } else if (lastPoint.value < firstPoint.value) {
          setPriceChangeColor('#FE1B20'); // Red for overall loss
        } else {
          setPriceChangeColor('#FFFFFF'); // White for no change
        }

        // Reset to the real-time portfolio value (no change here when switching periods)
        setCurrentPrice(realTimePrice); // Reset to the real-time portfolio value
        setCurrentDate(new Date(lastPoint.timestamp).toLocaleString());

        // Calculate the percentage and dollar change from the first point
        const { percentageChange, dollarChange } = calculateChange(lastPoint);
        setPercentageChange(percentageChange); // Set the percentage change
        setDollarChange(dollarChange); // Set the dollar change
      }
    }, 500); // Reset after 5 seconds of inactivity
  }, [portfolioData, realTimePrice]); // Depend on realTimePrice
*/



// Function to update the color when the user interacts with the chart
useEffect(() => {
  if (currentIndex !== null && portfolioData.length > 0) {
    const currentPoint = portfolioData[currentIndex];

    if (currentPoint) {
      setCurrentDate(new Date(currentPoint.timestamp).toLocaleString());
      setCurrentPrice(currentPoint.value);

      // ✅ Calculate the percentage and dollar change
      const { percentageChange, dollarChange } = calculateChange(currentPoint);

      setPercentageChange(isNaN(percentageChange) ? 0 : percentageChange);
      setDollarChange(isNaN(dollarChange) ? 0 : dollarChange);

      // ✅ Dynamically set color based on actual value
      const isNegativePercentage = String(percentageChange).trim().startsWith("-");
      const isNegativeDollar = String(dollarChange).trim().startsWith("-");

      if (isNegativePercentage || isNegativeDollar) {
        setPriceChangeColor("#FE1B20"); // Red for negative change
      } else {
        setPriceChangeColor("#00CE39"); // Green for positive change
      }

      console.log("📊 Tracking Current Price:", {
        value: currentPoint.value,
        timestamp: new Date(currentPoint.timestamp).toLocaleString(),
        percentageChange,
        dollarChange,
      });
    }
  }
}, [AlpacaUserId, currentIndex, portfolioData]); // Runs when `currentIndex` or `portfolioData` changes



















   // Update `currentPrice` when user interacts with the chart
   useEffect(() => {
    if (currentIndex === null || !portfolioData[currentIndex]) return;

   // invokeHaptic();
    const currentPoint = portfolioData[currentIndex];

    // Set current date
    setCurrentDate(new Date(currentPoint.timestamp).toLocaleString());

    let firstInvestmentPoint = portfolioData.find((p) => p.value > 0) || portfolioData[0];
    let firstPoint = portfolioData.find((p, i) => p.value !== 0 && i < currentIndex) || firstInvestmentPoint;

    if (!firstPoint || firstPoint.value === 0) {
        firstPoint = firstInvestmentPoint;
    }

    let percentageChange = 0;
    let dollarChange = 0;

    if (firstPoint && firstPoint.value !== 0) {
        percentageChange = ((currentPoint.value - firstPoint.value) / firstPoint.value) * 100;
        dollarChange = currentPoint.value - firstPoint.value;

        // Apply the same negative logic to percentageChange if dollarChange is negative
        if (dollarChange < 0) {
            percentageChange = -Math.abs(percentageChange); // Make percentageChange negative if dollarChange is negative
        }

        setPercentageChange(percentageChange);
        setDollarChange(dollarChange);
    }

    // Determine color based on the sign of either percentageChange or dollarChange
    const isNegative = percentageChange < 0 || dollarChange < 0;
    setPriceChangeColor(isNegative ? "#FE1B20" : "#00CE39");

    console.log("📍 Selected Point:", {
        value: currentPoint.value,
        timestamp: new Date(currentPoint.timestamp).toLocaleString(),
        firstPoint: firstPoint.value,
        percentageChange: percentageChange || 0,
        dollarChange: dollarChange || 0,
    });

    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

    const lastPoint = cachedData[selectedPeriod]?.[cachedData[selectedPeriod].length - 1] ||
                      portfolioData[portfolioData.length - 1];

    const firstPointForReset = cachedData[selectedPeriod]?.find(p => p.value > 0) || cachedData[selectedPeriod]?.[0];

    let resetPercentageChange = percentageChange;
    let resetDollarChange = dollarChange;
    let resetPrice = currentPoint.value;

    if (firstPointForReset && firstPointForReset.value !== 0 && lastPoint) {
        resetPercentageChange = ((lastPoint.value - firstPointForReset.value) / firstPointForReset.value) * 100;
        resetDollarChange = lastPoint.value - firstPointForReset.value;
        resetPrice = lastPoint.value;
    }

    resetTimeoutRef.current = setTimeout(() => {
        console.log(`⏳ Resetting to last closing price of ${selectedPeriod}...`);

        if (!lastPoint || lastPoint.value === 0 || isNaN(lastPoint.value)) {
            console.warn("⚠️ Skipping reset due to invalid last value");
            return;
        }

        console.log("🔄 Resetting", resetPrice);

        // ✅ Directly restore initial values without flashing `0`
        setPercentageChange(() => resetPercentageChange);
        setDollarChange(() => resetDollarChange);
        setInitalPercentageChnage(() => resetPercentageChange);
        setInitalDollarChnage(() => resetDollarChange);
        setCurrentPrice(() => realTimePrice);

        // Reset price change color based on the final values
        setPriceChangeColor(resetPercentageChange < 0 || resetDollarChange < 0 ? "#FE1B20" : "#00CE39");
    }, 1000);
}, [currentIndex, portfolioData, realTimePrice, selectedPeriod, cachedData]);

  

const handleIndexChange = (index) => {
    console.log(`🎯 Index Changed: ${index}`);
    setCurrentIndex(index); // ✅ Triggers `useEffect`
};




useEffect(() => {
  if (!selectedPeriod || selectedPeriod === "1D") return; // 🛑 Skip fetching for 1D

  console.log(`⏳ Fetching data for selected period: ${selectedPeriod}`);
  preloadPortfolioHistory(selectedPeriod);
}, [AlpacaUserId, selectedPeriod]);




// Fetch data and handle period changes
const handlePeriodChange = (period) => {
  setSelectedPeriod(period);

  // Only preload history if not 1D (which uses real-time updates)
  if (period !== "1D") {
    preloadPortfolioHistory(period);
  }
};










// Calculate Y-axis percentage changes
const calculateYPercentageChange = (filteredData) => {
  if (!filteredData || filteredData.length < 2) return [0, 0, 0, 0]; // Fallback for no or insufficient data

  const firstValue = filteredData[0].value;
  const latestValue = filteredData[filteredData.length - 1].value;

  const totalPercentageChange =
    firstValue !== 0 ? ((latestValue - firstValue) / Math.abs(firstValue)) * 100 : 0;

  return [
    totalPercentageChange * 0.25,
    totalPercentageChange * 0.5,
    totalPercentageChange * 0.75,
    totalPercentageChange
  ];
};

// Memoize Y-axis percentage levels to prevent unnecessary recalculations
const memoizedYPercentageLevels = useMemo(() => {
  return calculateYPercentageChange(portfolioData);
}, [portfolioData]);





// X-axis label generation using memoization
const memoizedXAxisLabels = useMemo(() => {
  if (!portfolioData || portfolioData.length === 0) return [];

  const today = new Date();
  let dateLabels = [];
  const intervalCount = 5; // Always 5 points on the X-axis

  const locale = i18n.language; // Get the current language from i18n

  if (selectedPeriod === "1D") {
    // 📌 1 Day: 5 time points in the last 24 hours, ending at NOW
    const now = today.getTime();
    const startOfDay = now - 24 * 60 * 60 * 1000; // 24 hours ago
    const stepSize = (now - startOfDay) / (intervalCount - 1);

    for (let i = 0; i < intervalCount; i++) {
      let time = new Date(startOfDay + i * stepSize);
      dateLabels.push(time.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }));
    }
  } else if (selectedPeriod === "1W") {
    // 📌 1 Week: Show 5 evenly spaced dates within last 7 days
    for (let i = intervalCount - 1; i >= 0; i--) {
      let date = new Date();
      date.setDate(today.getDate() - i * (7 / (intervalCount - 1)));
      dateLabels.push(date.toLocaleDateString(locale, { day: "2-digit", month: "short" })); // "25 Feb", "27 Feb", "01 Mar"
    }
  } else if (selectedPeriod === "1M") {
    // 📌 1 Month: Show 5 evenly spaced dates within last 30 days
    for (let i = intervalCount - 1; i >= 0; i--) {
      let date = new Date();
      date.setDate(today.getDate() - i * (30 / (intervalCount - 1)));
      dateLabels.push(date.toLocaleDateString(locale, { day: "2-digit", month: "short" })); // "01 Feb", "10 Feb", "20 Feb"
    }
  } else if (selectedPeriod === "1A") {
    // 📌 1 Year: Show 5 evenly spaced months within last 12 months
    for (let i = 0; i < intervalCount; i++) {
      let date = new Date();
      date.setMonth(today.getMonth() - (12 * (intervalCount - i - 1)) / (intervalCount - 1)); 
      dateLabels.push(date.toLocaleDateString(locale, { month: "short", year: "2-digit" })); 
    }
  } else if (selectedPeriod === "MAX") {
    // 📌 MAX: Distribute 5 labels across all available data
    const firstTimestamp = portfolioData[0].timestamp;
    const lastTimestamp = portfolioData[portfolioData.length - 1].timestamp;
    const stepSize = (lastTimestamp - firstTimestamp) / (intervalCount - 1);

    for (let i = 0; i < intervalCount; i++) {
      let date = new Date(firstTimestamp + i * stepSize);
      dateLabels.push(date.toLocaleDateString(locale, { month: "short", year: "2-digit" })); // "Jan 20", "Apr 22", "Aug 23"
    }
  }

  return dateLabels;
}, [portfolioData, selectedPeriod, i18n.language]); // Add i18n.language as a dependency




  return (
    <View style={{marginTop: height(4) }}>
    
      <View style={{marginLeft: width(2), width: width(50), flexDirection: 'row', justifyContent: 'space-evenly', gap: width(4), marginBottom: 20 }}>
        <TouchableOpacity onPress={() => handlePeriodChange('1D')}
          style={{
            height: size(50),
            width: size(50),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{
            color: selectedPeriod == "1D" ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Third_fontColor,
            fontWeight: "bold",
            fontSize: size(16),
          }}>
          {t("HomeChartTimerDay")}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => handlePeriodChange('1W')}
          style={{
            height: size(50),
            width: size(50),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{
             color: selectedPeriod == "1W" ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Third_fontColor,
             fontWeight: "bold",
             fontSize: size(16),
          }}>
          {t("HomeChartTimerWeek")}
          </Text>
        </TouchableOpacity>



        <TouchableOpacity onPress={() => handlePeriodChange('1M')}
          style={{
            height: size(50),
            width: size(50),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{
           color: selectedPeriod == "1M" ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Third_fontColor,
           fontWeight: "bold",
           fontSize: size(16),
          }}>
          {t("HomeChartTimerMonth")}
          </Text>
        </TouchableOpacity>



        <TouchableOpacity onPress={() => handlePeriodChange('1A')} 
          style={{
            height: size(50),
            width: size(50),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{
            color: selectedPeriod == "1A" ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Third_fontColor,
            fontWeight: "bold",
            fontSize: size(16),
          }}>
          {t("HomeChartTimerYear")}
          </Text>
        </TouchableOpacity>


        
        <TouchableOpacity onPress={() => handlePeriodChange('MAX')} 
          style={{
            height: size(50),
            width: size(50),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{
            color: selectedPeriod == "MAX" ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Third_fontColor,
            fontWeight: "bold",
            fontSize: size(16),
          }}>
          {t("HomeChartTimerMax")}
          </Text>
        </TouchableOpacity>


    
    
     
      </View>

 {/*    
      <Text style={{ color: '#fff' }}>Current Price: {currentPrice}</Text>
    <Text style={{ color: '#fff' }}>Selected Date: {currentDate}</Text>
    <Text style={{ color: '#fff' }}>Percentage Change: {percentageChange.toFixed(2)}%</Text>
    <Text style={{ color: '#fff' }}>Dollar Change: ${dollarChange.toFixed(2)}</Text>
*/}

      {portfolioData.length === 0 ? (
       null
      ) : (
        <LineChart.Provider data={portfolioData} onCurrentIndexChange={(index) => {
          invokeHaptic(); 
          handleIndexChange(index)
        //  invokeHaptic(); 
          }}>
        <View style={{
          position: 'absolute',
          right: 10,
          marginTop: height(10),
          height: "60%",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}>
          {memoizedYPercentageLevels.map((level, index) => (
            <Text key={index} style={{ fontSize: 11, color: CurrentViewMode.Mode_Sec_fontColor }}>
              {level > 0 ? `+${level.toFixed(2)}%` : `-${Math.abs(level).toFixed(2)}%`}
            </Text>
          ))}
        </View>

        <LineChart height={300} width={width(90)} onActivated={invokeHaptic}>
          {/* Set Horizontal Line to the middle value */}
          <LineChart.Path  color={CurrentViewMode.Mode_StockLine}>  {/*color={priceChangeColor} >*/}
          <LineChart.HorizontalLine at={{ index: 0 }} color={CurrentViewMode.Mode_HorizontalLine}/>  {/* color="#2E2F30" />*/}
          </LineChart.Path>
          <LineChart.CursorCrosshair  color={CurrentViewMode.Mode_StockLine}>  {/*color={priceChangeColor}>*/}
            <LineChart.HoverTrap />
            <LineChart.Tooltip textStyle={{ color: '#fff', fontSize: 13 }} />
          </LineChart.CursorCrosshair>
        </LineChart>

        <View style={{ flexDirection: "row", width: "90%", alignSelf: 'center', justifyContent: "space-between", marginTop: 5 }}>
          {memoizedXAxisLabels.map((label, index) => (
            <Text key={index} style={{ fontSize: 11, color:CurrentViewMode.Mode_Sec_fontColor /*color: "#565A60"*/ }}>
              {label}
            </Text>
          ))}
        </View>
      </LineChart.Provider>
      )}
    </View>
  );
}

