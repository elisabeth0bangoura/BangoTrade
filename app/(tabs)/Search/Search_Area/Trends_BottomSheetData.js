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
import { SearchContext } from '@/app/Context/MainSearchIndexStateContext';
import { ViewModeContext } from '@/app/Context/ViewModeContext';


import { getFirestore, doc, getDoc, collection, setDoc, addDoc, onSnapshot } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";
import { usePostHog } from 'posthog-react-native';




const Tab = createMaterialTopTabNavigator();








const Trends_BottomSheetData = React.memo(() => {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


	const { SearchIndex, setSearchIndex } = useContext(SearchContext);

  const { setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);

  const [trendingCoinsData, setTrendingCoinsData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const hasFetched = useRef(false); // Prevent multiple fetches

  const loadedCharts = useRef(new Map());

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
    },
  };



  const POLYGON_API_KEY = 'O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm';

    



  
  // ✅ Fetch Trending Coins
  const fetchTrendingCoins = useCallback(async () => {
    if (isFetching || hasFetched.current) return;
    setIsFetching(true);

    try {
      console.log('🔥 Fetching trending coins...');
      const trendingRes = await fetch('https://pro-api.coingecko.com/api/v3/search/trending', options);
      const trendingData = await trendingRes.json();

      if (!trendingData?.coins?.length) {
        console.warn('❌ No trending coins found.');
        setTrendingCoinsData([]);
        setIsDataFetched(false);
        return;
      }

      const trendingCoins = trendingData.coins.slice(0, 5).map((coin) => coin.item.id);

      const coinRes = await fetch(
        `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${trendingCoins.join(',')}`,
        options
      );
      const coinData = await coinRes.json();

      if (!coinData?.length) {
        console.warn('⚠ No market data for trending coins.');
        setTrendingCoinsData([]);
        setIsDataFetched(false);
        return;
      }

      setTrendingCoinsData(
        coinData.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          image: coin.image || '',
          chart: loadedCharts.current.get(coin.id) || [],
          CoinChartColor: coin.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E',
        }))
      );
      setIsDataFetched(true);
      hasFetched.current = true;
    } catch (error) {
      console.error('🚨 Error fetching trending coins:', error);
      setIsDataFetched(false);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]);

  const fetchChartForCoin = useCallback(
    async (coinId) => {
      if (loadedCharts.current.has(coinId)) return;

      try {
        const chartRes = await fetch(
          `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`,
          options
        );
        const chartData = await chartRes.json();

        const chart = chartData?.prices?.map(([timestamp, value]) => ({ timestamp, value })) || [];

        loadedCharts.current.set(coinId, chart);

        setTrendingCoinsData((prevData) =>
          prevData.map((coin) => (coin.id === coinId ? { ...coin, chart } : coin))
        );
      } catch (error) {
        console.warn(`⚠️ Error fetching chart for ${coinId}:`, error);
      }
    },
    []
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    viewableItems.forEach((viewableItem) => {
      fetchChartForCoin(viewableItem.item.id);
    });
  }).current;

  useEffect(() => {
    if (SearchIndex == 0 && !hasFetched.current) {
      fetchTrendingCoins();
    } else if (SearchIndex == -1) {
      setTrendingCoinsData([]);
      //setIsDataFetched(false);
    //  hasFetched.current = false;
    }
  }, []);




  // Memoize the renderItem function to prevent unnecessary re-creations
  const renderItemTrendingCoins = useCallback(({ item }) => {
    const priceChangeColor =
      item.price_change_percentage_24h > 0 ? "#00CE39" : "#FF1B1E";
    const priceChangeSymbol =
      item.price_change_percentage_24h > 0 ? "▲" : "▼";

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
      height: height(19),
      width: width(36),
      marginRight: width(5),
      backgroundColor:  CurrentViewMode.Mode_ButtonBgColor_Search,
      borderRadius: 20,
      marginBottom: 15,
    }} 
    >
    <View
      style={{
      height: size(30),
      width: size(30),
      marginLeft: width(5),
      borderRadius: size(30) / 2,
      marginTop: height(4),
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
  
      marginTop: height(1),
    
      }}
    >
      <Text
      numberOfLines={1}
      style={{
        fontWeight: 'bold',
        fontSize: size(16),
        color: CurrentViewMode.Mode_fontColor,
        width: "80%",
        marginTop: height(1),
        marginLeft: width(5),
      }}
      >
      {item.name}
      </Text>
    </View>

    <View
      style={{
      marginTop: height(2),
      marginLeft: width(5),
      flexDirection: 'row',
      alignItems: 'center',
      }}
    >
      <Text
      style={{
        fontSize: size(15),

        fontWeight: 'bold',
        color: priceChangeColor,
      }}
      >
      {priceChangeSymbol} {parseFloat(item.price_change_percentage_24h).toFixed(2)}%
      </Text>

      {/*item.chart && item.chart.length > 0 ? (
            <View style={{ height: 50, width: 40, position: "absolute", right: width(5) }}>
              <RenderChart chart={item.chart} color={item.CoinChartColor} />
            </View>
          ) : (
            <SkeletonLoading background={"#1E1E1F"} highlight={"#666"}>
              <View style={{ height: 50, width: 40 }} />
            </SkeletonLoading>
          )*/}
    </View>
    </TouchableOpacity>
  );
  }, []);
  


    






  return(


      <>
    {isDataFetched ? (
        <FlashList contentContainerStyle={{
          paddingLeft: width(5),
        }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={trendingCoinsData}
          keyExtractor={(item) => item.id}
          renderItem={renderItemTrendingCoins}
          estimatedItemSize={170}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      ) : (
        <SkeletonLoading background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
          <View style={{ flexDirection: "row" }}>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={{ backgroundColor: CurrentViewMode.Mode_BgColorBar_Search, height: height(19), width: width(36), marginRight: width(5), borderRadius: 20, marginBottom: 15 }} />
            ))}
          </View>
        </SkeletonLoading>
      )}
    </>
 );
});


export default Trends_BottomSheetData;
