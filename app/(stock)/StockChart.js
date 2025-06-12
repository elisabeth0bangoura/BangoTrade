import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, ActivityIndicator, Easing, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { LineChart } from 'react-native-wagmi-charts';
import { CurrentCoinSelectedContext } from '../Context/CurrentCoinSelectedContext';
import debounce from 'lodash.debounce'; // Debounce function from lodash
import { CurrentPriceContext } from '../Context/CurrentCoinPricePageContext';
import * as Haptics from 'expo-haptics';
import { PanGestureHandler } from 'react-native-gesture-handler';
import _ from 'lodash';
import StockPage from './stockPage';
import { CoinPageContext } from '../Context/OpenCoinPageContext';
import { ViewModeContext } from '../Context/ViewModeContext';
import { useTranslation } from 'react-i18next';
import { StockLineContext } from '../Context/StockLineColor';
import { DateTime } from 'luxon';




const POLYGON_API_KEY = 'O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm';

const chartIntervals = async (ticker, period) => {
  const now = DateTime.now().setZone('America/New_York');
  const day = now.weekday; // 1 = Monday, ..., 7 = Sunday
  const hour = now.hour;

  let fromDate, toDate;
  let multiplier = 1;
  let timespan = 'day';

  if (period === '1D') {
    multiplier = 5;
    timespan = 'minute';

    const isWeekend = day === 6 || day === 7;
    const isBeforeMarketOpen = hour < 9 || (hour === 9 && now.minute < 30);

    if (isWeekend || isBeforeMarketOpen) {
      // Go back one calendar day and skip weekends
      let previousDay = now.minus({ days: 1 });

      // If yesterday was Saturday or Sunday, keep going back to Friday
      while (previousDay.weekday === 6 || previousDay.weekday === 7) {
        previousDay = previousDay.minus({ days: 1 });
      }

      fromDate = previousDay.startOf('day');
      toDate = previousDay.endOf('day');
    } else {
      // Fetch today's data from 9:30 AM to now
      fromDate = now.set({ hour: 9, minute: 30, second: 0, millisecond: 0 });
      toDate = now;
    }
  } else if (period === '1W') {
    fromDate = now.minus({ days: 7 }).startOf('day');
    toDate = now;
    timespan = 'hour';
  } else if (period === '1M') {
    fromDate = now.minus({ months: 1 }).startOf('day');
    toDate = now;
    timespan = 'day';
  } else if (period === '1Y') {
    fromDate = now.minus({ years: 1 }).startOf('day');
    toDate = now;
    timespan = 'day';
  } else if (period === 'MAX') {
    fromDate = DateTime.fromISO('2016-01-01', { zone: 'America/New_York' });
    toDate = now;
    timespan = 'month';
  } else {
    throw new Error('Invalid period');
  }

  const fromDateString = fromDate.toISODate();
  const toDateString = toDate.toISODate();

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${fromDateString}/${toDateString}?adjusted=true&sort=asc&limit=4000&apiKey=${POLYGON_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) {
      console.warn(`⚠️ No chart data found for ${ticker} @ ${period}`);
      return [];
    }

    const MAX_POINTS = {
      '1D': 500,
      '1W': 500,
      '1M': 500,
      '1Y': 500,
      'MAX': 1000,
    };

    const step = Math.ceil(data.results.length / MAX_POINTS[period]);
    const reduced = data.results.filter((_, i) => i % step === 0);

    return reduced.map((item) => ({
      timestamp: item.t,
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
      volume: item.v,
    }));
  } catch (error) {
    console.error('🚨 Error fetching chart intervals:', error);
    return [];
  }
};












  const StockChart = React.memo(({ selectedInterval = '1D', coinId, priceChangeColor }) => {

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


  



  console.log("coinId ", coinId)
  

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
        try {
          const data = await chartIntervals(coinId, interval); // ✅ Use your new chartIntervals function
          if (Array.isArray(data)) {
            cache.current[coinId] = { 
              ...(cache.current[coinId] || {}), 
              [interval]: data 
            };
          }
        } catch (error) {
          console.error('🚨 Error preloading chart interval:', interval, error);
        }
      }
    });
  }, [coinId]);
  

// ✅ Format Polygon OHLC data for charts
const formatData = (data) =>
  data.map(({ timestamp, close }) => ({
    timestamp,
    value: close,
  }));



// ✅ Fetch chart data
const fetchChartData = useCallback(async (interval) => {
  if (!coinId || !interval) return;
  setLoading(true);

  try {
    const data = await chartIntervals(coinId, interval); // ✅ Now using your own chartIntervals()

    if (!Array.isArray(data) || data.length < 3 || data.every((point) => point.close === 0)) {
      // ❌ If no valid points
      setChartData(generateFallbackData());
    } else {
    // Reduce only in frontend after fetch:
    const reducedData = interval === '1Y'
    ? data.filter((_, index) => index % 5 === 0) // every 5th day (~weekly view but from daily data)
    : data;


      setChartData(formatData(reducedData));
    }
  } catch (error) {
    console.error('🚨 Error fetching chart data:', error);
    setChartData(generateFallbackData());
  } finally {
    setLoading(false);
  }
}, [coinId, generateFallbackData]);

  
  

  useEffect(() => {
    fetchChartData(selectedInterval);
  }, [selectedInterval, fetchChartData]);
  const invokeHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);


  const memoizedXAxisLabels = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
  
    const today = new Date();
    const dateLabels = [];
    const intervalCount = 5; // Always 5 labels
    const locale = i18n.language; // Current user language
  
    if (selectedInterval === "1D") {
      // 1 Day: 5 times in last 24h
      const now = today.getTime();
      const startOfDay = now - 24 * 60 * 60 * 1000;
      const stepSize = (now - startOfDay) / (intervalCount - 1);
  
      for (let i = 0; i < intervalCount; i++) {
        const time = new Date(startOfDay + i * stepSize);
        dateLabels.push(time.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }));
      }
    } else if (selectedInterval === "1W" || selectedInterval === "1M") {
      // 1 Week or 1 Month: Use same logic but different steps
      const days = selectedInterval === "1W" ? 7 : 30;
      for (let i = intervalCount - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i * (days / (intervalCount - 1)));
        dateLabels.push(date.toLocaleDateString(locale, { day: "2-digit", month: "short" }));
      }
    } else if (selectedInterval === "1Y") {
      // 1 Year: 5 months across the past 12 months
      for (let i = intervalCount - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(today.getMonth() - i * (12 / (intervalCount - 1)));
        dateLabels.push(date.toLocaleDateString(locale, { month: "short", year: "2-digit" }));
      }
    } else if (selectedInterval === "MAX") {
      // MAX: based on first and last data points
      const firstTimestamp = chartData[0].timestamp;
      const lastTimestamp = chartData[chartData.length - 1].timestamp;
      const stepSize = (lastTimestamp - firstTimestamp) / (intervalCount - 1);
  
      for (let i = 0; i < intervalCount; i++) {
        const date = new Date(firstTimestamp + i * stepSize);
        dateLabels.push(date.toLocaleDateString(locale, { month: "short", year: "2-digit" }));
      }
    }
  
    return dateLabels;
  }, [chartData, selectedInterval, i18n.language]);
  
  



  



  useEffect(() => {
    if (!coinId) return;
  
    const fetchRealTimePrice = async () => {
      try {
        // 🛠 Fetch snapshot for the specific ticker (coinId = ticker like 'AAPL')
        const response = await fetch(
          `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${coinId}?apiKey=${POLYGON_API_KEY}`
        );
        const data = await response.json();
        const snapshot = data.ticker || {};
  
        const latestPrice = snapshot?.lastTrade?.p ?? snapshot?.day?.c; // Use last price or today's close
        const percentageChange = snapshot?.todaysChangePerc;
  
        if (latestPrice !== undefined && percentageChange !== undefined) {
          setCurrentPrice(latestPrice);
          setPercentageChange(percentageChange);
  
          console.log(`🔥 Real-time price: $${latestPrice}, 24h change: ${percentageChange.toFixed(2)}%`);
        } else {
          console.warn('⚠️ Failed to fetch real-time price or percentage change.');
        }
      } catch (error) {
        console.error('🚨 Error fetching real-time price:', error);
      }
    };
  
    // 🛠 Fetch immediately
    fetchRealTimePrice();
  
    // 🛠 Optionally fetch every 5 seconds (Live updating price)
    // const intervalId = setInterval(fetchRealTimePrice, 5000);
  
    // return () => clearInterval(intervalId); // Clean up on unmount
  }, [coinId]);
  







  // Fetch real-time price and update state
 /* const handleFetchRealTimePrice = async () => {
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

  */




  
  



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
    new Date(selectedData?.timestamp).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  );

  console.log(`📈 Selected Data Point:`, selectedData);

  if (releaseTimeout) clearTimeout(releaseTimeout);

  releaseTimeout = setTimeout(() => {
    console.log('🛑 User interaction stopped, reloading real-time price...');
    fetchRealTimePrice(); // ✅ Now calling your Polygon.io fetcher
  }, 500); // 0.5s after user stops dragging

  return () => clearTimeout(releaseTimeout);
}, [currentIndex, chartData]);






// Function to fetch the real-time price from Polygon.io
const fetchRealTimePrice = async () => {
  if (!coinId) return; // Safety check

  try {
    const response = await fetch(
      `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${coinId}?apiKey=${POLYGON_API_KEY}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      }
    );

    const data = await response.json();
    const snapshot = data?.ticker || {};

    const latestPrice = snapshot?.lastTrade?.p ?? snapshot?.day?.c; // Prefer last trade price, fallback to closing
    const percentageChange = snapshot?.todaysChangePerc;

    if (latestPrice !== undefined && percentageChange !== undefined) {
      setCurrentPrice(latestPrice);
      setPercentageChange(percentageChange);
      console.log(`🔥 Real-time price: $${latestPrice}, 24h change: ${percentageChange.toFixed(2)}%`);
    } else {
      console.warn('⚠️ Real-time price or change percentage missing.');
    }
  } catch (error) {
    console.error('🚨 Error fetching real-time price from Polygon:', error);
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
export default StockChart;

