import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, ActivityIndicator, Easing, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";import { LineChart } from 'react-native-wagmi-charts';
import { CurrentCoinSelectedContext } from '../Context/CurrentCoinSelectedContext';
import debounce from 'lodash.debounce'; // Debounce function from lodash
import { CurrentPriceContext } from '../Context/CurrentCoinPricePageContext';
import * as Haptics from 'expo-haptics';
import { PanGestureHandler } from 'react-native-gesture-handler';
import _ from 'lodash';
import CoinPage from './coinPage';
import { CoinPageContext } from '../Context/OpenCoinPageContext';
import { ViewModeContext } from '../Context/ViewModeContext';
import { useTranslation } from 'react-i18next';
import { StockLineContext } from '../Context/StockLineColor';






const chartIntervals = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '1Y': 365,
    'MAX': 'max',
  };

  const CoinChart = React.memo(({ selectedInterval = '1D', coinId, priceChangeColor }) => {

    const {
      isSystemTheme, 
      setIsSystemTheme,
      isAssetColorTheme, 
      setIsAssetColorTheme,
     } = useContext(StockLineContext);
  
  


    const { t, i18n } = useTranslation(); // Destructure i18n for language changes

    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const generateFallbackData = useCallback(() => {
    const now = Date.now();
    return Array.from({ length: 5 }, (_, i) => ({
      timestamp: now - i * 3600 * 1000, // Create a point every hour
      value: 0,
    })).reverse(); // Ensure the array is in ascending order of timestamps
  }, []);
  

  


    const {CoinPageIndex, setCoinPageIndex, coinData, CurrentBackgroundColorForCoin } = useContext(CoinPageContext);

    const { setCurrentPrice, setPercentageChange } = useContext(CurrentPriceContext);
    const [selectedTimeRange, setSelectedTimeRange] = useState("1D");

    const [chartData, setChartData] = useState(() => generateFallbackData());
    const [loading, setLoading] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentValue, setCurrentValue] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);
    const [FontColorIsDark, setFontColorIsDark] = useState()
  
    const cache = useRef({}); // Cache for fetched data


    
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
    },
  };


  
  

  useEffect(() => {
    console.log("Coin Chart Page Index:", CoinPageIndex);
  
    if (CoinPageIndex === -1) {
      // Clear data for better performance when the sheet closes
      setChartData([]);
      setCurrentDate(null);
      setPercentageChange(null);
      setCurrentPrice(null);
    } else if (CoinPageIndex === 0) {
      // Refetch or reset chart data when the sheet opens
      fetchChartData(selectedInterval);
      fetchRealTimePrice();
    }
  }, [CoinPageIndex, fetchChartData, selectedInterval]);
  



   // Preload data for common intervals on component mount
   useEffect(() => {
    const preloadIntervals = ['1D', '1W', '1M'];
    preloadIntervals.forEach(async (interval) => {
      if (!cache.current[coinId]?.[interval]) {
        const response = await fetch(
          `https://pro-api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${chartIntervals[interval]}`,
          options
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          cache.current[coinId] = { ...cache.current[coinId], [interval]: formatData(data) };
        }
      }
    });
  }, [coinId]);

  const formatData = (data) => data.map(([timestamp, open, high, low, close]) => ({ timestamp, value: close }));

  const fetchChartData = useCallback(async (interval) => {
    if (!coinId || !interval) return;
    setLoading(true);
  
    try {
      const response = await fetch(
        `https://pro-api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${chartIntervals[interval]}`,
        options
      );
      const data = await response.json();  // Parse the response as JSON
  
      if (!Array.isArray(data) || data.length < 3 || data.every(([_, __, ___, ____, close]) => close === 0)) {
        // If data has fewer than 3 points or all points are 0, generate fallback data
        setChartData(generateFallbackData());
      } else {
        // Format the data and reduce it if needed
        const reducedData = (interval === '1Y' || interval === 'MAX')
          ? data.filter((_, index) => index % 10 === 0)  // Reduce data for large intervals
          : data;
        setChartData(formatData(reducedData));
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData(generateFallbackData());  // Fallback in case of an error
    } finally {
      setLoading(false);
    }
  }, [coinId, generateFallbackData]);
  
  
  

  useEffect(() => {
    fetchChartData(selectedInterval);
  }, [selectedInterval, fetchChartData]);
  const invokeHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);



  // X-axis label generation using memoization
  const memoizedXAxisLabels = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
  
    const today = new Date();
    let dateLabels = [];
    const intervalCount = 5; // Always 5 points on the X-axis
    const locale = i18n.language; // Get the current language from i18n
  
    if (selectedInterval === "1D") {
      // 📌 1 Day: 5 time points in the last 24 hours, ending at NOW
      const now = today.getTime();
      const startOfDay = now - 24 * 60 * 60 * 1000; // 24 hours ago
      const stepSize = (now - startOfDay) / (intervalCount - 1);
  
      for (let i = 0; i < intervalCount; i++) {
        let time = new Date(startOfDay + i * stepSize);
        dateLabels.push(time.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }));
      }
    } else if (selectedInterval === "1W") {
      // 📌 1 Week: Show 5 evenly spaced dates within the last 7 days
      for (let i = intervalCount - 1; i >= 0; i--) {
        let date = new Date();
        date.setDate(today.getDate() - i * (7 / (intervalCount - 1)));
        dateLabels.push(date.toLocaleDateString(locale, { day: "2-digit", month: "short" }));
      }
    } else if (selectedInterval === "1M") {
      // 📌 1 Month: Show 5 evenly spaced dates within the last 30 days
      for (let i = intervalCount - 1; i >= 0; i--) {
        let date = new Date();
        date.setDate(today.getDate() - i * (30 / (intervalCount - 1)));
        dateLabels.push(date.toLocaleDateString(locale, { day: "2-digit", month: "short" }));
      }
    } else if (selectedInterval === "1Y") {
      // 📌 1 Year: Show 5 evenly spaced months within the last 12 months
      for (let i = 0; i < intervalCount; i++) {
        let date = new Date();
        date.setMonth(today.getMonth() - (12 * (intervalCount - i - 1)) / (intervalCount - 1));
        dateLabels.push(date.toLocaleDateString(locale, { month: "short", year: "2-digit" }));
      }
    } else if (selectedInterval === "MAX") {
      // 📌 MAX: Distribute 5 labels across all available data
      const firstTimestamp = chartData[0].timestamp;
      const lastTimestamp = chartData[chartData.length - 1].timestamp;
      const stepSize = (lastTimestamp - firstTimestamp) / (intervalCount - 1);
  
      for (let i = 0; i < intervalCount; i++) {
        let date = new Date(firstTimestamp + i * stepSize);
        dateLabels.push(date.toLocaleDateString(locale, { month: "short", year: "2-digit" }));
      }
    }
  
    return dateLabels;
  }, [chartData, selectedInterval, i18n.language]);
  
  



  




  useEffect(() => {
    if (!coinId) return;
  
    const fetchRealTimePrice = async () => {
      try {
        const response = await fetch(
          `https://pro-api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
            },
          }
        );
        const data = await response.json();
        const latestPrice = data[coinId]?.usd;
        const percentageChange = data[coinId]?.usd_24h_change;
  
        if (latestPrice !== undefined && percentageChange !== undefined) {
          setCurrentPrice(latestPrice);
          setPercentageChange(percentageChange);
  
          console.log(`Real-time price: $${latestPrice}, 24h change: ${percentageChange.toFixed(2)}%`);
        } else {
          console.log('Failed to fetch real-time price or percentage change.');
        }
      } catch (error) {
        console.error('Error fetching real-time price:', error);
      }
    };
  
    // Fetch initially and then every 5 seconds
    fetchRealTimePrice();
   // const intervalId = setInterval(fetchRealTimePrice, 5000);
  
  //  return () => clearInterval(intervalId); // Clean up on unmount
  }, [coinId]);
  







  // Fetch real-time price and update state
  const handleFetchRealTimePrice = async () => {
    try {
      const response = await fetch(
        `https://pro-api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
          },
        }
      );
      const data = await response.json();
      const latestPrice = data[coinId]?.usd;
      const percentageChange = data[coinId]?.usd_24h_change;

      if (latestPrice !== undefined && percentageChange !== undefined) {
        setCurrentPrice(latestPrice);
        setPercentageChange(percentageChange);
        console.log(`Real-time price: $${latestPrice}, 24h change: ${percentageChange.toFixed(2)}%`);
      } else {
        console.log('Failed to fetch real-time data.');
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  




  
  



    // ✅ Haptic feedback when the index changes
    const onCurrentIndexChange = useCallback((index) => {
      invokeHaptic();
    }, []);
  
  


const [currentIndex, setCurrentIndex] = useState(null);
let releaseTimeout = null; // Timeout reference to detect interaction end

useEffect(() => {
  if (currentIndex === null || !chartData || currentIndex >= chartData.length) return;

  const selectedData = chartData[currentIndex];
  const selectedPrice = selectedData?.value || 0;
  const startPrice = chartData[0]?.value || 0;

  setCurrentPrice(selectedPrice);

  const percentageChange =
    startPrice !== 0 ? ((selectedPrice - startPrice) / Math.abs(startPrice)) * 100 : 0;
    setPercentageChange(percentageChange);
  setCurrentDate(
    new Date(selectedData?.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  );

  console.log(`Selected Data: ${JSON.stringify(selectedData)}`);

  // Detect when user interaction stops
  if (releaseTimeout) clearTimeout(releaseTimeout);

  releaseTimeout = setTimeout(() => {
    console.log('User interaction stopped. Fetching real-time price...');
    fetchRealTimePrice(); // Call the function to fetch the latest real-time price
  }, 500); // Wait for 1 second of no interaction

  // Cleanup timeout on unmount or index change
  return () => clearTimeout(releaseTimeout);
}, [currentIndex, chartData]);

// Function to fetch the real-time price
const fetchRealTimePrice = async () => {
  try {
    const response = await fetch(
      `https://pro-api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
        },
      }
    );
    const data = await response.json();
    const latestPrice = data[coinId]?.usd;
    const percentageChange = data[coinId]?.usd_24h_change;

    if (latestPrice !== undefined && percentageChange !== undefined) {
      setCurrentPrice(latestPrice);
      setPercentageChange(percentageChange);
      console.log(`Real-time price: $${latestPrice}, 24h change: ${percentageChange.toFixed(2)}%`);
    }
  } catch (error) {
    console.error('Error fetching real-time price:', error);
  }
};






// For Y Axis 

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


// Memoized Y-axis percentage levels to prevent unnecessary recalculations
const memoizedYPercentageLevels = useMemo(() => {
  return calculateYPercentageChange(chartData);
}, [chartData]);











// Function to calculate luminance of a color
function getLuminance(color) {
  let r = 0, g = 0, b = 0;

  if (color[0] === '#') {
    color = color.slice(1);
    if (color.length === 4) {
      color = color.split('').map((char) => char + char).join('');
    }

    r = parseInt(color.substr(0, 2), 16);
    g = parseInt(color.substr(2, 2), 16);
    b = parseInt(color.substr(4, 2), 16);
  } else if (color.startsWith('rgb')) {
    const rgb = color.match(/\d+/g);
    r = parseInt(rgb[0]);
    g = parseInt(rgb[1]);
    b = parseInt(rgb[2]);
  }

  // Normalize RGB values
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // If luminance is NaN, return a fallback value (black)
  if (isNaN(luminance)) {
    console.log("Luminance calculation failed, returning 0 (dark)");
    return 0;  // Dark color if luminance is invalid
  }

  return luminance;
}

// Function to check if the background color is dark
function isBGDark(color) {
  const luminance = getLuminance(color);
  console.log("Luminance of background:", luminance);
  return luminance < 0.5;  // Color is considered dark if luminance is below 0.5
}

// Function to check if a color is dark enough to be considered for fallback
function isColorDark(color) {
  const luminance = getLuminance(color);
  return luminance < 0.2;  // Considered dark if luminance is below 0.2
}



useEffect(() => {
  console.log("Current Background Color: ", CurrentViewMode.Mode_bg);  // Log current background color
  console.log("Is BG Dark?: ", isBGDark(CurrentViewMode.Mode_bg)); // Log if background is dark or light
  console.log("coinData.dominantColor: ", coinData.dominantColor);  // Log dominant color

  if (isBGDark(CurrentViewMode.Mode_bg)) {
    setFontColorIsDark(true); // Set to dark if background is dark
  } else {
    setFontColorIsDark(false); // Otherwise, set to light
  }
}, [CurrentViewMode.Mode_bg, coinData.dominantColor]);  // Trigger when background or dominant color changes







  return (
    <View style={{ padding: 20 }}>
  



  <LineChart.Provider 
data={chartData.length > 0 ? chartData : generateFallbackData()}
  onCurrentIndexChange={(index) => {
    setCurrentIndex(index);
    onCurrentIndexChange(index);
    invokeHaptic(); // ✅ Adds haptic feedback when index changes
    console.log('Current index:', index);


  }}
 
>


  <View style={{
 position: 'absolute',
 right: 10,
 marginTop: height(3),
 height: "80%",
 justifyContent: "space-between",
 alignItems: "flex-start",
}}>
  {memoizedYPercentageLevels.map((level, index) => (
    <Text key={index} style={{ fontSize: 11, color: CurrentViewMode.Mode_Sec_fontColor }}>
      {level > 0 ? `+${level.toFixed(2)}%` : `-${level.toFixed(2)}%`}
    </Text>
  ))}
</View>


 <LineChart height={300} width={width(90)} onActivated={invokeHaptic}>
  <LineChart.Path 
           color={isSystemTheme === true 
            ? priceChangeColor 
            : (isBGDark(CurrentViewMode.Mode_bg) && !isColorDark(coinData.dominantColor) 
                ? coinData.dominantColor  // Use the dominant color for dark backgrounds if it's not too dark
                : (isColorDark(coinData.dominantColor)  // If dominant color is dark, fall back to white
                    ? "#FFFFFF"
                    : coinData.dominantColor))} >
      <LineChart.HorizontalLine at={{ index: 0 }} color={CurrentViewMode.Mode_HorizontalLine} />
             
            </LineChart.Path>

            <LineChart.CursorCrosshair
            color={isSystemTheme == true ? priceChangeColor : coinData.dominantColor}
          >
              <LineChart.Tooltip
                textStyle={{
                  borderRadius: 4,
                  color: '#fff',
                  fontSize: size(13),
                  padding: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: size(14),
                    marginTop: size(19),
                    marginLeft: width(2),
                    color: '#888',
                    fontWeight: 'bold',
                  }}
                >
                  {currentDate}
                </Text>
              </LineChart.Tooltip>
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
 
    </View>
  );
});
export default CoinChart;

