// app/(auth)/_layout.tsx
import React, { useCallback, useContext,  useState, useMemo, useRef, useEffect } from 'react';
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
import * as ImageManipulator from 'expo-image-manipulator';
import { decode as atob } from 'base-64';


import { FlashList } from "@shopify/flash-list";
import { debounce } from 'lodash';
import {Search2Context} from '../../../Context/SearchIndexStateContext';
import SkeletonLoading from 'expo-skeleton-loading'
import { CurrentCoinSelectedContext } from '@/app/Context/CurrentCoinSelectedContext';
import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import { usePostHog } from 'posthog-react-native';





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




export default function SearchCoinSlideViewData ({SearchIndex2, searchQuery})  {


  const posthog = usePostHog(); // ✅ this gives you access to the actual instance

  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  
  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const [categoryData, setCategoryData] = useState({});
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const searchController = useRef(null);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);
  const {CoinPageIndex, setCoinPageIndex } = useContext(CoinPageContext);

  const animation = useRef(null);




  







  


  // 🔹 Define API Headers
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
    },
  };

  

  


  const categories = {
    cryptocurrencies: [],
    defi: [],
    payment: [],
    yield_farming: [],
    governance_tokens: [],
  };

  const getFriendlyTitle = (key) => {
    const categoryTitles = {
      cryptocurrencies: 'Cryptocurrencies',
      defi: 'DeFi',
      payment: 'Payment',
      yield_farming: 'Yield Farming & Staking',
      governance_tokens: 'Governance Tokens',
    };
    return categoryTitles[key] || 'Other';
  };


  const categorizeCoins = async (coins) => {
    let categorizedData = {
      cryptocurrencies: [],
      defi: [],
      payment: [],
      yield_farming: [],
      governance_tokens: [],
      stablecoins: [],
    };
  
    const assignedCoins = new Set();
  
    // ✅ Fetch full details for each coin
    const fetchCoinDetails = coins.map(async (coin) => {
      try {
        const res = await fetch(`https://pro-api.coingecko.com/api/v3/coins/${coin.id}`, options);
        const coinDetails = await res.json();
        return coinDetails;
      } catch (error) {
        console.warn(`⚠️ Error fetching details for ${coin.id}:`, error);
        return null;
      }
    });
  
    let fullCoinData = (await Promise.all(fetchCoinDetails)).filter(Boolean);
  
    // ✅ Fetch chart data **only for the top 25 coins**
    const fetchChartData = fullCoinData.slice(0, 25).map(async (coin) => {
      try {
        const chartRes = await fetch(
          `https://pro-api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=1`,
          options
        );
        const chartData = await chartRes.json();
  
        return {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.market_data?.current_price?.usd || 0,
          price_change_percentage_24h: coin.market_data?.price_change_percentage_24h || 0,
          image: coin.image?.large || '',
          chart: chartData?.prices?.map(([timestamp, value]) => ({ timestamp, value })) || [],
          CoinChartColor: coin.market_data?.price_change_percentage_24h > 0 ? "#00CE39" : "#FF1B1E",
          categories: coin.categories || [],
        };
      } catch (error) {
        return {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: 0,
          price_change_percentage_24h: 0,
          image: '',
          chart: [],
          CoinChartColor: "#fff",
          categories: [],
        };
      }
    });
  
    fullCoinData = (await Promise.all(fetchChartData)).filter(Boolean);
  
    // ✅ Categorize Coins Dynamically
  fullCoinData.forEach((coin) => {
  const lowerTags = coin.categories?.map(tag => tag.toLowerCase()) || [];
  let added = false;

 // console.log(`📌 Checking categories for ${coin.name}: `, lowerTags);

  if (["btc", "eth"].includes(coin.symbol.toLowerCase()) || ["bitcoin", "ethereum"].includes(coin.id)) {
    // ✅ Always classify Bitcoin & Ethereum as Cryptocurrencies
    categorizedData.cryptocurrencies.push(coin);
    added = true;
  } else if (lowerTags.includes("stablecoin")) {
    categorizedData.stablecoins.push(coin);
    added = true;
  } else if (lowerTags.some(tag => tag.includes("staking") || tag.includes("yield-farming"))) {
    categorizedData.yield_farming.push(coin);
    added = true;
  } else if (lowerTags.some(tag => tag.includes("governance") || tag.includes("dao") || tag.includes("governance-token"))) {
    categorizedData.governance_tokens.push(coin);
    added = true;
  } else if (lowerTags.some(tag => tag.includes("defi") || tag.includes("dex") || tag.includes("lending"))) {
    // ❌ Exclude Ethereum from DeFi
    if (coin.symbol.toLowerCase() !== "eth" && coin.id !== "ethereum") {
      categorizedData.defi.push(coin);
      added = true;
    }
  } else if (lowerTags.some(tag => tag.includes("privacy")) || ["xmr", "dash", "zec"].includes(coin.symbol.toLowerCase())) {
    categorizedData.payment.push(coin);
    added = true;
  }

  // ✅ If no category matched, default to Cryptocurrencies
  if (!added) {
    categorizedData.cryptocurrencies.push(coin);
  }

  assignedCoins.add(coin.id);
});

  
    // ✅ Ensure at least 5 items per category
    Object.keys(categorizedData).forEach((key) => {
      if (categorizedData[key].length < 4) {
        // Find extra coins that haven’t been assigned
        const extraCoins = fullCoinData.filter((coin) => !assignedCoins.has(coin.id)).slice(0, 4 - categorizedData[key].length);
  
        // Fill category to exactly 5 items
        categorizedData[key] = [...categorizedData[key], ...extraCoins].slice(0, 4);
  
        // Mark added coins as assigned
        extraCoins.forEach(coin => assignedCoins.add(coin.id));
      } else {
        // Ensure no category has more than 5
        categorizedData[key] = categorizedData[key].slice(0, 4);
      }
    });
  
    console.log("📌 Final Categorized Data: ", categorizedData);
    return categorizedData;
  };


  const fetchTrendingCoins = async () => {
    setIsFetching(true);
    try {
      console.log("🔥 Fetching trending coins...");
      const res = await fetch(`https://pro-api.coingecko.com/api/v3/search/trending`, options);
      const data = await res.json();
      if (!data?.coins?.length) return;
  
      const trendingCoinIds = data.coins.slice(0, 4).map((coin) => coin.item.id);
  
      // Fetch market data for trending coins
      const marketRes = await fetch(
        `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${trendingCoinIds.join(',')}`,
        options
      );
      let marketData = await marketRes.json();
  
      // ✅ Fetch chart data for each trending coin
      const fetchChartData = marketData.map(async (coin) => {
        try {
          const chartRes = await fetch(
            `https://pro-api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=1`,
            options
          );
          const chartData = await chartRes.json();
  
          return {
            ...coin,
            chart: chartData?.prices?.map(([timestamp, value]) => ({ timestamp, value })) || [],
            CoinChartColor: coin.price_change_percentage_24h > 0 ? "#00CE39" : "#FF1B1E",
          };
        } catch (error) {
          console.warn(`⚠️ Error fetching chart for ${coin.id}:`, error);
          return { ...coin, chart: [], CoinChartColor: "#fff" };
        }
      });
  
      // ✅ Wait for all chart data to load before setting state
      const finalTrendingCoins = await Promise.all(fetchChartData);
      setTrendingCoins(finalTrendingCoins);
    } catch (err) {
      console.error("🚨 Error fetching trending coins:", err);
    } finally {
      setIsFetching(false);
    }
  };

  




  const fetchSearchResults = async (query) => {
    if (!query) {
      fetchTrendingCoins();
      return;
    }
  
    if (searchController.current) {
      searchController.current.abort();
    }
    searchController.current = new AbortController();
    const signal = searchController.current.signal;
  
    setIsFetching(true);
    try {
      console.log("🔎 Fetching search results for:", query);
  
      // ✅ Fetch more coins to avoid missing results
      const marketRes = await fetch(`https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=300`, { ...options, signal });
      let marketData = await marketRes.json();
  
      if (!marketData?.length) {
        console.log("❌ No results found.");
        setCategoryData({});
        setIsFetching(false);
        return;
      }
  
      // ✅ Filter locally by name or symbol
      let filteredCoins = marketData.filter(coin =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
  
      // ✅ Categorize filtered results
      const categorizedData = await categorizeCoins(filteredCoins.slice(0, 50)); // Increase results
      setCategoryData(categorizedData);
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('🚨 Error fetching search data:', err);
      }
    } finally {
      setIsFetching(false);
    }
  };
  

  useEffect(() => {
    const debounceSearch = debounce((query) => {
      fetchSearchResults(query);
    }, 200);
    debounceSearch(searchQuery);
    return () => debounceSearch.cancel();
  }, [searchQuery]);

  useEffect(() => {
    if (SearchIndex2 === 0) {
      fetchTrendingCoins();
    } else if (SearchIndex2 === -1) {
      setCategoryData({});
    }
  }, [SearchIndex2]);





  

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


  const renderItem = useCallback(({ item }) => {
    const priceChangeColor = item.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E';
    const priceChangeSymbol = item.price_change_percentage_24h > 0 ? '▲' : '▼';

  return (

    <Animated.View entering={FadeIn} exiting={FadeOut}>


    <TouchableOpacity onPress={() => {

      posthog.capture('open_coin_bottomsheet', {
        screen: 'Coin_Page',
        $screen_name: 'Coin_Page '+" / "+item.name,
        timestamp: new Date().toISOString(),

        });
        // Handle item press if needed
        setCoinPageIndex(0);
        SheetManager.show('CoinPage_Sheet');
        setCurrentCoinSelected(item);

    }}
    style={{
      height: height(8),
      zIndex: 1000,
      width: "90%",
      alignSelf: 'center',
      flexDirection: 'row',
      paddingVertical: size(12),
     alignItems: 'center',
      marginBottom: 10,
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
      justifyContent: 'center',
      alignItems: 'center',
      }}
    >
      <Image
      source={{ uri: item.image }}
      style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
      />
    </View>

  
  
      <Text
      numberOfLines={1}
      style={{
        width: "60%",
        fontWeight: 'bold',
        fontSize: size(15),
        color: CurrentViewMode.Mode_fontColor,
        marginLeft: width(5),
      }}
      >
      {item.name}
      </Text>
  

 
 
      
      {/*item.chart && item.chart.length > 0 ? (
          <View style={{ height: 50, width: 40, marginLeft: width(10) }}>
            <RenderChart chart={item.chart} color={item.CoinChartColor} />
          </View>
        ) : (
          <SkeletonLoading background={"#1E1E1F"} highlight={"#666"}>
            <View style={{ height: 50, width: 40 }} />
          </SkeletonLoading>
        )*/}



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
      </TouchableOpacity>
      </Animated.View>
);
}, []);





  const renderCategory = (key, coins) => coins.length > 0 && (
    <View key={key}>
      <Text style={{ color: CurrentViewMode.Mode_fontColor, fontSize: size(20), marginTop: height(3), marginBottom: height(2), marginLeft: width(5), fontWeight: 'bold' }}>{getFriendlyTitle(key)}</Text>
      <FlatList data={coins} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );


 

  return (
    <View>
      {searchQuery === '' ? (
        <>   
        <Text style={{ color: CurrentViewMode.Mode_fontColor, fontSize: size(20),  marginBottom: height(2), marginLeft: width(5), fontWeight: 'bold' }}>
        {t("SearchTitleInTextInputSearchPage")}
        </Text>
        <FlatList data={trendingCoins} keyExtractor={(item) => item.id} renderItem={renderItem} />

        </>
      ) : Object.keys(categoryData).length > 0 ? (
        Object.entries(categoryData).map(([key, coins]) => renderCategory(key, coins))
      ) : isFetching && (
        <LottieView
        autoPlay
        ref={animation}
        style={{
          width: size(50),
          alignSelf: 'center',
          marginTop:  size(50),
          height: 100,
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require("../../../../assets/loadibg.json")}
      />
      )}
    </View>
  );
}