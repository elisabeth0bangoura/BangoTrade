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


import { getFirestore, doc, getDoc, collection, setDoc, addDoc, onSnapshot } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";
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



export default function DeFiData({ SearchIndex }) {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);



  const { setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);



  const [coinsData, setCoinsData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const loadedCharts = useRef(new Map()); // ✅ Persistent cache for chart data
  const coinsMemoized = useMemo(() => coinsData, [coinsData]);

  
  


  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
    },
  };


    // ✅ Fetch DeFi Coins Data (Without Charts)
    const fetchCoinsData = async () => {
      if (isFetching) return;
      setIsFetching(true);
      setIsDataFetched(false);
  
      try {
      //  console.log("🔥 Fetching DeFi Coins...");
        const res = await fetch(
          "https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1",
          options
        );
        const data = await res.json();
  
        if (!data?.length) {
          console.warn("❌ No DeFi Coins found.");
          setCoinsData([]);
          setIsDataFetched(false);
          return;
        }
  
        const filteredCoins = data
          .filter((coin) =>
            ["defi", "dex"].some((keyword) =>
              coin.name.toLowerCase().includes(keyword)
            ) ||
            ["uniswap", "1inch", "aave", "maker", "compound", "curve-dao-token"].includes(
              coin.id.toLowerCase()
            )
          )
          .slice(0, 3); // ✅ Keep only 3 coins
  
        if (!filteredCoins.length) {
          console.warn("⚠ No DeFi Coins found!");
          setCoinsData([]);
          return;
        }
  
     //  console.log("✅ Found DeFi Coins:", filteredCoins);
  
        // ✅ Store Initial Data (Without Charts)
        setCoinsData(
          filteredCoins.map((coin) => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            price: coin.current_price,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            image: coin.image || "",
            chart: loadedCharts.current.get(coin.id) || [], // ✅ Retrieve from cache if available
            CoinChartColor: coin.price_change_percentage_24h > 0 ? "#00CE39" : "#FF1B1E",
          }))
        );
  
        setTimeout(() => setIsDataFetched(true), 500);
      } catch (error) {
        console.error("🚨 Error fetching DeFi Coins:", error);
        setIsDataFetched(false);
      } finally {
        setIsFetching(false);
      }
    };
  
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
      if (SearchIndex == 0) {
        fetchCoinsData();
      } else if (SearchIndex == -1) {
         setCoinsData([]);
      //  setIsDataFetched(false);
      }
    }, []);
  
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




  const renderItem = useCallback(({ item }) => {
    const priceChangeColor = item.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E';
    const priceChangeSymbol = item.price_change_percentage_24h > 0 ? '▲' : '▼';

  return (
    <TouchableOpacity onPress={() => {


      posthog.capture('open_coin_bottomsheet', {
        screen: 'Coin_Page',
        $screen_name: 'Coin_Page '+" / "+item.name,
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
          category: "crypto"
        });
    
        console.log('Asset saved (no duplicates):', item.name);
      } catch (error) {
        console.error('Error saving asset:', error);
      }
    };
    handleItemClick(item)



      setCoinPageIndex(0)
      SheetManager.show('CoinPage_Sheet',  {
        payload: { value: item.symbol }, // Passing dynamic data (payload)
      });
       setCurrentCoinSelected(item)
      

      }}
    style={{
      height: height(8),
      width: "90%",
      alignSelf: 'center',
      flexDirection: 'row',
     alignItems: 'center',
      marginBottom: 10,
    }}
    >
    <View
      style={{
      height: size(25),
      width: size(25),
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
        width: "85%",
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