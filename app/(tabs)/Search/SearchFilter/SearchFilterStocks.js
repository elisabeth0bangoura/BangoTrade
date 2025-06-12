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
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import throttle from 'lodash/throttle';





const Tab = createMaterialTopTabNavigator();













export default function SearchFilterStocks({ SearchIndex3 }) {


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);

    const [trendingCoinsData, setTrendingCoinsData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [SelectedSortPrice, setSelectedSortPrice] = useState("price_desc");
    const [SelectedSort1h, setSelectedSort1h] = useState("percent_change_1h_desc");
    const [SelectedSort24h, setSelectedSort24h] = useState("percent_change_24h_desc");
    const [SelectedSort7d, setSelectedSort7d] = useState("percent_change_7d_desc");
    const [SelectedSort24hVolume, setSelectedSort24hVolume] = useState("volume_desc");
    const [SelectedSortMarketCap, setSelectedSortMarketCap] = useState("market_cap_desc");
  

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

  
  const BATCH_SIZE = 10;     // ✅ Fetch 10 at a time
  const GROUP_SIZE = 5;      // ✅ Fetch in groups of 5 in parallel (to avoid overload)
  
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);





// 🔁 Fetch useEffect (triggered when batch index changes)
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
              const [referenceRes, snapshotRes] = await Promise.all([
                fetch(`https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${polygonApiKey}`),
                fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}?apiKey=${polygonApiKey}`)
              ]);
        
              const referenceData = await referenceRes.json();
              const snapshotData = await snapshotRes.json();
              const snap = snapshotData?.ticker;
              const snapResults = snapshotData?.results;
        
              return {
                id: symbol,
                symbol,
                name: referenceData?.results?.name || symbol,
                exchange: referenceData?.results?.primary_exchange || "N/A",
                current_price: snap?.day?.c !== 0 ? snap.day.c : snap?.lastTrade?.p || 0,
                price_change_percentage_24h: snap?.todaysChangePerc || 0,
                price_change_24h: snap?.todaysChange || 0,
                high: snap?.day?.h || 0,
                low: snap?.day?.l || 0,
                volume: snap?.day?.v || 0,
                market_cap: snapResults?.market_cap || 0,
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

      setTrendingCoinsData(prev => [...prev, ...enrichedData]);
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



useEffect(() => {
  if (!isDataFetched || SearchIndex3 !== 0 || trendingCoinsData.length === 0) return;
  console.log("🔥 Sorting by:", sortBy, sortOrder);

  let sorted = [...trendingCoinsData];

  switch (sortBy) {
    case "price":
      sorted.sort((a, b) => sortOrder === "price_desc" ? b.current_price - a.current_price : a.current_price - b.current_price);
      break;
    case "1h":
      sorted.sort((a, b) => sortOrder === "percent_change_1h_desc"
        ? (b.price_change_percentage_1h || 0) - (a.price_change_percentage_1h || 0)
        : (a.price_change_percentage_1h || 0) - (b.price_change_percentage_1h || 0));
      break;
    case "24h":
      sorted.sort((a, b) => sortOrder === "percent_change_24h_desc"
        ? b.price_change_24h - a.price_change_24h
        : a.price_change_24h - b.price_change_24h);
      break;
    case "7d":
      sorted.sort((a, b) => sortOrder === "percent_change_7d_desc"
        ? (b.price_change_percentage_7d || 0) - (a.price_change_percentage_7d || 0)
        : (a.price_change_percentage_7d || 0) - (b.price_change_percentage_7d || 0));
      break;
    case "volume":
      sorted.sort((a, b) => sortOrder === "volume_desc" ? b.volume - a.volume : a.volume - b.volume);
      break;
    case "market_cap":
      sorted.sort((a, b) => sortOrder === "market_cap_desc"
        ? (b.market_cap || 0) - (a.market_cap || 0)
        : (a.market_cap || 0) - (b.market_cap || 0));
      break;
  }

  console.log("✅ Sorted sample:", sorted.slice(0, 2));
  setTrendingCoinsData([...sorted]);
}, [sortBy, sortOrder, isDataFetched, SearchIndex3]);






  /*const trendingCoinsMemoized = useMemo(() => [...trendingCoinsData], [trendingCoinsData]);

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-pro-api-key": "CG-9BNXX3AMb2poti6c1BsGi5iG",
      },
    };
  
 // ✅ Fetch Trending Coins with Sorting & Filtering
 const fetchTrendingCoins = useCallback(
  debounce(async (sortOrder, sortBy) => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      console.log(`🔥 Fetching trending coins... Sorting: ${sortBy} (${sortOrder})`);

      const response = await fetch(
        `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=1h,24h,7d`,
        options
      );
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("❌ No trending coins found.");
        setTrendingCoinsData([]);
        setIsDataFetched(false);
        return;
      }

      let sortedData = [...data];

      // ✅ Apply Sorting (Price, 1h, 24h, 7d, Volume, Market Cap)
      switch (sortBy) {
        case "price":
          sortedData.sort((a, b) =>
            sortOrder === "price_desc" ? b.current_price - a.current_price : a.current_price - b.current_price
          );
          break;
        case "1h":
          sortedData.sort((a, b) =>
            sortOrder === "percent_change_1h_desc"
              ? b.price_change_percentage_1h_in_currency - a.price_change_percentage_1h_in_currency
              : a.price_change_percentage_1h_in_currency - b.price_change_percentage_1h_in_currency
          );
          break;
        case "24h":
          sortedData.sort((a, b) =>
            sortOrder === "percent_change_24h_desc"
              ? b.price_change_percentage_24h - a.price_change_percentage_24h
              : a.price_change_percentage_24h - b.price_change_percentage_24h
          );
          break;
        case "7d":
          sortedData.sort((a, b) =>
            sortOrder === "percent_change_7d_desc"
              ? b.price_change_percentage_7d_in_currency - a.price_change_percentage_7d_in_currency
              : a.price_change_percentage_7d_in_currency - b.price_change_percentage_7d_in_currency
          );
          break;
        case "volume":
          sortedData.sort((a, b) =>
            sortOrder === "volume_desc" ? b.total_volume - a.total_volume : a.total_volume - b.total_volume
          );
          break;
        case "market_cap":
          sortedData.sort((a, b) =>
            sortOrder === "market_cap_desc" ? b.market_cap - a.market_cap : a.market_cap - b.market_cap
          );
          break;
      }

      setTrendingCoinsData(sortedData);
      setIsDataFetched(true);
    } catch (error) {
      console.error("🚨 Error fetching trending coins:", error);
      setIsDataFetched(false);
    } finally {
      setIsFetching(false);
    }
  }, 500),
  []
);

// ✅ useEffect Hook - Triggers Fetching When `SearchIndex3` Changes
useEffect(() => {
  if (SearchIndex3 === 0) {
    fetchTrendingCoins(SelectedSortPrice, "price");
  } else if (SearchIndex3 === -1) {
    setTrendingCoinsData([]);
    setIsDataFetched(false);
  }
}, [SearchIndex3]);
*/






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

 
 
    {/*  <Text
      style={{
        fontSize: size(15),
        position: 'absolute',
        right: width(0),
        fontWeight: 'bold',
        color: priceChangeColor,
      }}
      >
      {priceChangeSymbol} {parseFloat(item.price_change_percentage_24h).toFixed(2)}%
      </Text>}

      {/*item.chart && item.chart.length > 0 ? (
          <View style={{ height: 50, width: 40, marginLeft: width(20) }}>
            <RenderChart chart={item.chart} color={item.CoinChartColor} />
          </View>
        ) : (
          <SkeletonLoading background={"#1E1E1F"} highlight={"#666"}>
            <View style={{ height: 50, width: 40 }} />
          </SkeletonLoading>
        )*/}
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
  const newOrder = sortOrder === "price_desc" ? "price_asc" : "price_desc";
  setSortBy("price");
  setSortOrder(newOrder);

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

          
          <MaterialIcons name={SelectedSortPrice == "price_desc" ?  "keyboard-arrow-up" : "keyboard-arrow-down"} 
          style={{

            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(25),
          }} />
        </TouchableOpacity>



    
    





        <TouchableOpacity onPress={() => {
         const newOrder = sortOrder === "percent_change_24h_desc" ? "percent_change_24h_asc" : "percent_change_24h_desc";
         setSortBy("24h");
         setSortOrder(newOrder);
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







        <TouchableOpacity 
        onPress={() => {
          const newOrder = sortOrder === "volume_desc" ? "volume_asc" : "volume_desc";
          setSortBy("volume");
          setSortOrder(newOrder);
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
            {t("TwentyFourHouresVolumeTitleInSearchFilter_All_Page")}    
          </Text>

          <MaterialIcons name={SelectedSort24hVolume === "volume_desc" ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          style={{
            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(25),
          }} />
        </TouchableOpacity>





        <TouchableOpacity 
          onPress={() => {
            const newOrder = sortOrder === "market_cap_desc" ? "market_cap_asc" : "market_cap_desc";
            setSortBy("market_cap");
            setSortOrder(newOrder);
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
          {t("MarketCapTitleInSearchFilter_All_Page")}     
          </Text>

          <MaterialIcons name={SelectedSortMarketCap === "market_cap_desc" ? "keyboard-arrow-up" : "keyboard-arrow-down"} 

          style={{
            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(25),
          }} />
        </TouchableOpacity>






        
        </ScrollView>
        </View>

  {isDataFetched ? (

<FlashList 
  data={trendingCoinsMemoized}
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