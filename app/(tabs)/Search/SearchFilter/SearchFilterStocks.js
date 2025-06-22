// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons"
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
//import { getColors } from 'react-native-image-colors'
import { Platform } from 'react-native';
import { Link } from 'expo-router';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'
import ImageColors from 'react-native-image-colors'; // Import the library
import { getColors } from 'react-native-image-colors';
import { FlashList } from "@shopify/flash-list";
import { debounce } from 'lodash';
import SkeletonLoading from 'expo-skeleton-loading'
import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '@/app/Context/CurrentCoinSelectedContext';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import throttle from 'lodash/throttle';
import { usePostHog } from 'posthog-react-native';





const Tab = createMaterialTopTabNavigator();













export default function SearchFilterStocks({ SearchIndex3 }) {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);


    const [SelectedSort1h, setSelectedSort1h] = useState("percent_change_1h_desc");

    const [SelectedSort7d, setSelectedSort7d] = useState("percent_change_7d_desc");





const BATCH_SIZE = 10;
const GROUP_SIZE = 5;

const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
const [isFetching, setIsFetching] = useState(false);
const [isDataFetched, setIsDataFetched] = useState(false);

const [trendingCoinsData, setTrendingCoinsData] = useState([]);
const [SelectedSortPrice, setSelectedSortPrice] = useState('price_desc');

const [SelectedSort24h, setSelectedSort24h] = useState(null);
const [SelectedSort24hVolume, setSelectedSort24hVolume] = useState(null);
const [SelectedSortMarketCap, setSelectedSortMarketCap] = useState(null);


    const [sortBy, setSortBy] = useState()
    const [sortOrder, setSortOrder] = useState()














    const SkeletonPlaceholder = () => {
      return (
        <View>
          {/* Show 3 Skeleton Items */}
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonLoading key={index} background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
              <View style={{ flexDirection: "row", top: height(3), marginBottom: height(4) }}>
                {/* Left Skeleton Box */}
                <View
                  style={{
                    backgroundColor:  CurrentViewMode.Mode_BgColorBar_Search,
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
                    backgroundColor:  CurrentViewMode.Mode_bg_Search,
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
   






    
  // ✅ Memoize Data
  const trendingCoinsMemoized = useMemo(() => [...trendingCoinsData], [trendingCoinsData]);

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-pro-api-key": "CG-9BNXX3AMb2poti6c1BsGi5iG",
      },
    };
  

  const alpacaOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
    }
  };
  
  const polygonApiKey = "O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm";
  

  const topTickers = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "BRK.B", "META", "TSLA", "V", "JPM",
    "LLY", "UNH", "XOM", "MA", "AVGO", "JNJ", "WMT", "PG", "ORCL", "HD",
    "COST", "MRK", "PEP", "CVX", "ABBV", "BAC", "KO", "ADBE", "ASML", "TMO",
    "ACN", "NFLX", "CRM", "INTC", "ABT", "DHR", "NKE", "MCD", "AMD", "LIN",
    "AMAT", "TMUS", "TXN", "UPS", "NEE", "QCOM", "DIS", "PM", "UNP", "HON",
    "BA", "LOW", "IBM", "CAT", "GE", "SBUX", "ISRG", "MDT", "RTX", "NOW",
    "LMT", "SPGI", "AMGN", "INTU", "SYK", "PLD", "CVS", "BLK", "ELV", "T",
    "ADI", "MO", "ZTS", "GILD", "CHTR", "CI", "TGT", "C", "ADP", "CB",
    "REGN", "MU", "MMC", "DE", "VRTX", "FISV", "CL", "PNC", "BDX", "FDX",
    "MS", "EQIX", "AXP", "EW", "AON", "ILMN", "GM", "APD", "ETN", "HCA",
    "SHW", "CDNS", "ROST", "ROK", "BKNG", "BIIB", "IDXX", "WELL", "ORLY", "VLO",
    "EXC", "ITW", "PSX", "MSCI", "SNPS", "WBA", "MNST", "SPG", "AIG", "TFC",
    "AZO", "CTSH", "TT", "ADM", "LRCX", "NSC", "ED", "CMG", "CME", "D",
    "CTAS", "DLR", "DG", "HLT", "HPQ", "VRSK", "PAYX", "KLAC", "TDG", "MCK",
    "EOG", "FTNT", "F", "VICI", "OXY", "DOW", "APH", "ALGN", "PWR", "PRU",
    "MAR", "TSCO", "RMD", "BAX", "TRV", "MTD", "EFX", "DVN", "KMB", "AVB",
    "STZ", "WST", "BKR", "TTWO", "FANG", "ANET", "EXR", "AFL", "CPRT", "CTVA",
    "ECL", "MPWR", "HSY", "PH", "STE", "KEYS", "CEG", "CDW", "GLW", "AEE",
    "OTIS", "WMB", "AWK", "KMI", "FTV", "NEM", "BXP", "TER", "HUBB", "PPL",
    "GWW", "CRL", "XYL", "RHI", "IFF", "NDAQ", "TSN", "VTR", "HES", "EXPD",
    "ZBRA", "SNA", "VMC", "DRI", "ETSY", "CNP", "LUV", "FICO", "ALB", "MAS",
    "INCY", "MLM", "AAP", "CHD", "JBHT", "PEAK", "BALL", "ARE", "TRMB", "BR",
    "LNT", "CF", "BIO", "IRM", "MKTX", "NTAP", "BF.B", "AKAM", "HII", "PKG",
    "NDSN", "LDOS", "TECH", "STLD", "NTRS", "TYL", "PTC", "PNR", "GEN", "WRB",
    "NI", "JNPR", "LW", "ATO", "CINF", "ESS", "UDR", "ZION", "MASI", "SLG",
    "PNW", "AIZ", "BRO", "TYSON", "ALLE", "AKR", "WHR", "BEN", "EVRG", "AES",
    "HAS", "HBAN", "CE", "WRK", "NWL", "SEE", "RE", "L", "DXC", "MRO"
  ];

  

  

  const sortData = (data) => {
    if (SelectedSortPrice) {
      return [...data].sort((a, b) =>
        SelectedSortPrice === "price_desc"
          ? b.current_price - a.current_price
          : a.current_price - b.current_price
      );
    } else if (SelectedSort24h) {
      return [...data].sort((a, b) =>
        SelectedSort24h === "percent_change_24h_desc"
          ? b.price_change_percentage_24h - a.price_change_percentage_24h
          : a.price_change_percentage_24h - b.price_change_percentage_24h
      );
    } else if (SelectedSort24hVolume) {
      return [...data].sort((a, b) =>
        SelectedSort24hVolume === "volume_desc"
          ? b.volume - a.volume
          : a.volume - b.volume
      );
    } else if (SelectedSortMarketCap) {
      return [...data].sort((a, b) =>
        SelectedSortMarketCap === "market_cap_desc"
          ? b.market_cap - a.market_cap
          : a.market_cap - b.market_cap
      );
    }
    return data;
  };

  



  useEffect(() => {
    const fetchBatch = async () => {
      if (isFetching || SearchIndex3 !== 0) return;
      setIsFetching(true);
  
      try {
        const start = currentBatchIndex * BATCH_SIZE;
        const end = start + BATCH_SIZE;
        const batchSymbols = topTickers.slice(start, end);
  
        const enrichedData = [];
  
        for (let i = 0; i < batchSymbols.length; i += GROUP_SIZE) {
          const group = batchSymbols.slice(i, i + GROUP_SIZE);
  
          const results = await Promise.all(
            group.map(async (symbol) => {
              try {
                const [referenceRes, aggRes] = await Promise.all([
                  fetch(`https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${polygonApiKey}`),
                  fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${polygonApiKey}`)
                ]);
  
                const referenceData = await referenceRes.json();
                const aggData = await aggRes.json();
                const agg = aggData?.results?.[0];
  
                return {
                  id: symbol,
                  symbol,
                  name: referenceData?.results?.name || symbol,
                  exchange: referenceData?.results?.primary_exchange || "N/A",
                  current_price: agg?.c || 0,
                  price_change_24h: agg?.c && agg?.o ? (agg.c - agg.o).toFixed(2) : 0,
                  price_change_percentage_24h: agg?.c && agg?.o ? (((agg.c - agg.o) / agg.o) * 100).toFixed(2) : 0,
                  high: agg?.h || 0,
                  low: agg?.l || 0,
                  volume: agg?.v || 0,
                  market_cap: referenceData?.results?.market_cap || 0,
                  image: `https://assets.parqet.com/logos/symbol/${symbol}?format=png&size=100`,
                };
              } catch (err) {
                console.error(`❌ Error fetching ${symbol}`, err);
                return null;
              }
            })
          );
  
          enrichedData.push(...results.filter(r => r !== null));
        }
  
        // ✅ Prevent duplicates
        setTrendingCoinsData(prev => {
          const combined = [...prev, ...enrichedData];
          const seen = new Set();
          return combined.filter(item => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
        });
  
        setIsDataFetched(true);
      } catch (err) {
        console.error("🚨 Error:", err);
        setIsDataFetched(false);
      } finally {
        setIsFetching(false);
      }
    };
  
    fetchBatch();
  }, [currentBatchIndex, SearchIndex3]);
  
  
  

// 🔁 Trigger next 10 when scroll hits end
const loadMore = useCallback(
  throttle(() => {
    if (!isFetching && trendingCoinsData.length < topTickers.length) {
      setCurrentBatchIndex(prev => prev + 1);
    }
  }, 1000), // throttle for 1 second
  [isFetching, trendingCoinsData.length]
);












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



   // 🔹 Detect When Coins Become Visible & Fetch Charts
   const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  
 
 

const renderItem = useCallback(({ item }) => {
    const priceChangeColor = item.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E';
    const priceChangeSymbol = item.price_change_percentage_24h > 0 ? '▲' : '▼';

  return (
    <TouchableOpacity onPress={() => {

      setCurrentCoinSelected(item);
  
  setCoinPageIndex(0)
      SheetManager.show('StockPage_Sheet',  {
        payload: { value: item.symbol, }, // Passing dynamic data (payload)
      });
  
    }}
    style={{
      top: height(0.5),
      height: height(6),
      width: "90%",
      alignSelf: 'center',
      flexDirection: 'row',
     alignItems: 'center',
      marginBottom: size(2),
    }}
    >
    <View
      style={{
      height: size(25),
      width: size(25),
      backgroundColor: '#fff',
     // marginLeft: width(5),
      borderRadius: size(25) / 2,
      overflow: 'hidden',
      }}
    >
      <Image
      source={{ uri: item.image }}
      style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
      />
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
        marginLeft: width(5),
      }}
      >
      {item.name}
      </Text>
    </View>

 
 
    </TouchableOpacity>

  );
  }, []);
  
  


    






  return(


      <>


<View>


<ScrollView horizontal style={{
  flexDirection: 'row',
  marginLeft: width(5),
  marginTop: height(2),
  marginBottom: height(2),
  height: height(5),

}} showsHorizontalScrollIndicator={false}> 



 <TouchableOpacity onPress={() => {

posthog.capture('click_search_filter_price_stocks_button', {
  screen: 'SearchFilterPage_Sheet',
  $screen_name: 'SearchFilterPage_Sheet',
  timestamp: new Date().toISOString(),

  });


    const isCurrentlyDescending = SelectedSortPrice === 'price_desc';
    const sorted = [...trendingCoinsData].sort((a, b) => 
      isCurrentlyDescending 
        ? a.current_price - b.current_price 
        : b.current_price - a.current_price
    );
    setTrendingCoinsData(sorted);
    setSelectedSortPrice(isCurrentlyDescending ? 'price_asc' : 'price_desc');
  }}
     style={{
        backgroundColor: CurrentViewMode.Mode_Secbg_Buttons_Cash,
        height: height(4),
        width: "auto",
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: width(4),
        alignItems: 'center',
        }}>
          <Text style={{
            fontSize: size(14),
            color: CurrentViewMode.Mode_fontColor,
            fontWeight: "bold",
            alignSelf: 'center',
            marginRight: width(0.5)
          }}>
           {t("PriceTitleInSearchFilter_All_Page")} 
          </Text>

          <MaterialIcons
    name={SelectedSortPrice === 'price_desc' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
    style={{
      color: CurrentViewMode.Mode_fontColor,
      fontSize: size(25),
    }}
  />
        </TouchableOpacity>



    
    





        <TouchableOpacity onPress={() => {

          posthog.capture('click_search_filter_24h_stocks_button', {
            screen: 'SearchFilterPage_Sheet',
            $screen_name: 'SearchFilterPage_Sheet',
            timestamp: new Date().toISOString(),

            });

          const isCurrentlyDescending = SelectedSort24h === 'percent_desc';
          const sorted = [...trendingCoinsData].sort((a, b) =>
            isCurrentlyDescending
              ? a.price_change_percentage_24h - b.price_change_percentage_24h
              : b.price_change_percentage_24h - a.price_change_percentage_24h
          );
          setTrendingCoinsData(sorted);
          setSelectedSort24h(isCurrentlyDescending ? 'percent_asc' : 'percent_desc');
          setSelectedSortPrice(null);
          setSelectedSortMarketCap(null);
        }}
        style={{
          backgroundColor: CurrentViewMode.Mode_Secbg_Buttons_Cash,
          height: height(4),
          width: "auto",
          borderRadius: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          paddingHorizontal: width(4),
          alignItems: 'center',
          marginLeft: width(5),
        }}>
          <Text style={{
            fontSize: size(14),
            color: CurrentViewMode.Mode_fontColor,
            fontWeight: "bold",
            alignSelf: 'center',
            marginRight: width(0.5)
          }}>
            {t("twntyFourhTitleInSearchFilter_All_Page")}    
          </Text>

          <MaterialIcons name={SelectedSort24h === "percent_change_24h_desc" ? "keyboard-arrow-up" : "keyboard-arrow-down"} 

          style={{
            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(25),
          }} />
        </TouchableOpacity>






{/* 24H Volume Sort Button */}
<TouchableOpacity 
  onPress={() => {


    posthog.capture('click_search_filter_volume_stocks_button', {
      screen: 'SearchFilterPage_Sheet',
      $screen_name: 'SearchFilterPage_Sheet',
      timestamp: new Date().toISOString(),

      });

    const isDesc = SelectedSort24hVolume === 'volume_desc';
    const sorted = [...trendingCoinsData].sort((a, b) => 
      isDesc 
        ? a.volume - b.volume 
        : b.volume - a.volume
    );
    setTrendingCoinsData(sorted);
    setSelectedSort24hVolume(isDesc ? 'volume_asc' : 'volume_desc');

    // Reset other sort states
    setSelectedSortPrice(null);
    setSelectedSortMarketCap(null);
  }}
  style={{
    backgroundColor: CurrentViewMode.Mode_Secbg_Buttons_Cash,
    height: height(4),
    width: "auto",
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: width(4),
    alignItems: 'center',
    marginLeft: width(5),
  }}
>
  <Text style={{
    fontSize: size(14),
    color: CurrentViewMode.Mode_fontColor,
    fontWeight: "bold",
    alignSelf: 'center',
    marginRight: width(0.5)
  }}>
    {t("TwentyFourHouresVolumeTitleInSearchFilter_All_Page")}    
  </Text>

  <MaterialIcons 
    name={SelectedSort24hVolume === "volume_desc" ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
    style={{
      color: CurrentViewMode.Mode_fontColor,
      fontSize: size(25),
    }} 
  />
</TouchableOpacity>


{/* Market Cap Sort Button */}
<TouchableOpacity 
  onPress={() => {


    posthog.capture('click_search_filter_market_cap_stocks_button', {
      screen: 'SearchFilterPage_Sheet',
      $screen_name: 'SearchFilterPage_Sheet',
      timestamp: new Date().toISOString(),

      });


    const isDesc = SelectedSortMarketCap === 'market_cap_desc';
    const sorted = [...trendingCoinsData].sort((a, b) => 
      isDesc 
        ? a.market_cap - b.market_cap 
        : b.market_cap - a.market_cap
    );
    setTrendingCoinsData(sorted);
    setSelectedSortMarketCap(isDesc ? 'market_cap_asc' : 'market_cap_desc');

    // Reset other sort states
    setSelectedSortPrice(null);
    setSelectedSort24hVolume(null);
  }}
  style={{
    backgroundColor: CurrentViewMode.Mode_Secbg_Buttons_Cash,
    height: height(4),
    width: "auto",
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: width(4),
    alignItems: 'center',
    marginLeft: width(5),
  }}
>
  <Text style={{
    fontSize: size(14),
    color: CurrentViewMode.Mode_fontColor,
    fontWeight: "bold",
    alignSelf: 'center',
    marginRight: width(0.5)
  }}>
    {t("MarketCapTitleInSearchFilter_All_Page")}     
  </Text>

  <MaterialIcons 
    name={SelectedSortMarketCap === "market_cap_desc" ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
    style={{
      color: CurrentViewMode.Mode_fontColor,
      fontSize: size(25),
    }} 
  />
</TouchableOpacity>





        
        </ScrollView>
        </View>

  {isDataFetched ? (

<FlashList 
  data={trendingCoinsData}
  keyExtractor={(item, index) => `${item.symbol}-${index}`}
  renderItem={renderItem}
  estimatedItemSize={30}
  onEndReached={loadMore} // ✅ Trigger loadMore when reaching end
  onEndReachedThreshold={0.6} // ✅ Load earlier (60% scroll position)
  contentContainerStyle={{
    paddingBottom: height(15)
  }}
/>


      ) : (
        <SkeletonPlaceholder />
      )}
    </>
  );
}