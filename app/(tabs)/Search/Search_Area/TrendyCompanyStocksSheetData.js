// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
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
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import SkeletonLoading from 'expo-skeleton-loading'

import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '@/app/Context/CurrentCoinSelectedContext';

import { SheetManager } from 'react-native-actions-sheet';
import { SearchContext } from '@/app/Context/MainSearchIndexStateContext';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import SvgFromUri from './SvgFromUri';

import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc, collection, setDoc, addDoc, onSnapshot } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";
import { usePostHog } from 'posthog-react-native';







const Tab = createMaterialTopTabNavigator();










    const TopMoversStocksSheetData = React.memo(() => {

      const posthog = usePostHog(); // ✅ this gives you access to the actual instance

      const [recentAssets, setRecentAssets] = useState([]);


      const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

      const { SearchIndex, setSearchIndex } = useContext(SearchContext);

    const { setCoinPageIndex } = useContext(CoinPageContext);
    const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [stableCoinsData, setStableCoinsData] = useState([]); // Store stable coins
    const loadedCharts = useRef(new Map());
    const hasFetched = useRef(false); // Prevent infinite fetching

    





    const trendyCompanies = [
      { name: 'Apple', ticker: 'AAPL' },
      { name: 'Nvidia', ticker: 'NVDA' },
      { name: 'Amazon', ticker: 'AMZN' },
      { name: 'Microsoft', ticker: 'MSFT' },
      { name: 'Alphabet (Google)', ticker: 'GOOGL' },
      { name: 'Meta (Facebook)', ticker: 'META' },
      { name: 'Tesla', ticker: 'TSLA' },
      { name: 'Netflix', ticker: 'NFLX' },
      { name: 'Airbnb', ticker: 'ABNB' },
      { name: 'Palantir', ticker: 'PLTR' },
      { name: 'AMD', ticker: 'AMD' },
      { name: 'Spotify', ticker: 'SPOT' },
      { name: 'Uber', ticker: 'UBER' },
      { name: 'Lyft', ticker: 'LYFT' },
      { name: 'Block (Square)', ticker: 'SQ' },
      { name: 'Coinbase', ticker: 'COIN' },
      { name: 'Rivian', ticker: 'RIVN' },
      { name: 'Snowflake', ticker: 'SNOW' },
      { name: 'Zoom', ticker: 'ZM' },
      { name: 'DraftKings', ticker: 'DKNG' },
      { name: 'Roblox', ticker: 'RBLX' },
      { name: 'DoorDash', ticker: 'DASH' },
      { name: 'Shopify', ticker: 'SHOP' },
      { name: 'Twilio', ticker: 'TWLO' },
      { name: 'Snapchat', ticker: 'SNAP' },
      { name: 'Pinterest', ticker: 'PINS' },
      { name: 'Unity Software', ticker: 'U' },
      { name: 'Lucid Motors', ticker: 'LCID' },
      { name: 'Beyond Meat', ticker: 'BYND' },
      { name: 'Affirm', ticker: 'AFRM' },
      { name: 'SoFi', ticker: 'SOFI' },
      { name: 'ChargePoint', ticker: 'CHPT' },
      { name: 'Plug Power', ticker: 'PLUG' },
      { name: 'Virgin Galactic', ticker: 'SPCE' },
      { name: 'Robinhood', ticker: 'HOOD' },
      { name: 'Coupang', ticker: 'CPNG' },
      { name: 'Sea Limited', ticker: 'SE' },
      { name: 'Bumble', ticker: 'BMBL' },
      { name: 'Chewy', ticker: 'CHWY' },
      { name: 'Fiverr', ticker: 'FVRR' },
      { name: 'Upstart', ticker: 'UPST' },
      { name: 'Carvana', ticker: 'CVNA' },
      { name: 'Zillow', ticker: 'Z' },
      { name: 'Redfin', ticker: 'RDFN' },
      { name: 'Peloton', ticker: 'PTON' },
      { name: 'GameStop', ticker: 'GME' },
      { name: 'AMC Entertainment', ticker: 'AMC' },
      { name: 'DraftKings', ticker: 'DKNG' },
      { name: 'Tattooed Chef', ticker: 'TTCF' },
    ];

    





    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
      },
    };
  
    const POLYGON_API_KEY = 'O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm';

    


  // Fetch stable coins data
  const fetchCoinsData = useCallback(async () => {
    if (isFetching || hasFetched.current) return;
    setIsFetching(true);
  
    try {
      console.log('🔥 Fetching trendy companies...');
  
      const top10Tickers = trendyCompanies.slice(0, 10); // ✅ Pick first 10 manually
  
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
  
      setStableCoinsData(cleanData); // ✅ Set your state
      hasFetched.current = true;
  
    } catch (error) {
      console.error('🚨 Error fetching stocks:', error);
    } finally {
      setIsFetching(false);
      setIsDataFetched(true);
    }
  }, [isFetching]);
  





  // Fetch chart data for a specific coin
  const fetchChartForCoin = useCallback(async (coinId) => {
    if (loadedCharts.current.has(coinId)) return;

    try {
      const chartRes = await fetch(
        `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`,
        options
      );
      const chartData = await chartRes.json();

      const chart = chartData?.prices?.map(([timestamp, value]) => ({
        timestamp,
        value,
      })) || [];

      loadedCharts.current.set(coinId, chart);

      setStableCoinsData((prevData) =>
        prevData.map((coin) => (coin.id === coinId ? { ...coin, chart } : coin))
      );
    } catch (error) {
      console.warn(`⚠️ Error fetching chart for ${coinId}:`, error);
    }
  }, []);
/*
  useEffect(() => {
    if (SearchIndex === 0) {
      fetchCoinsData();
    } else if (SearchIndex === -1) {
      setStableCoinsData([]);
      setIsDataFetched(false);
      hasFetched.current = false; // Reset the flag if the index changes
    }
  }, [SearchIndex, fetchCoinsData]);
*/
    /*
  useEffect(() => {
    if (SearchIndex == 0 && !hasFetched.current) {
      fetchCoinsData();
    } else if (SearchIndex == -1) {
      setStableCoinsData([]);
      setIsDataFetched(false);
      hasFetched.current = false;
    }
  }, []);
*/



useEffect(() => {

  if(SearchIndex == 0) {
    fetchCoinsData();
  } else if (SearchIndex == -1) {
     setStableCoinsData([]);
  }
}, [])





const renderItemStableCoins = useCallback(
    ({ item }) => {
      const priceChangeColor = item.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E';
      const priceChangeSymbol = item.price_change_percentage_24h > 0 ? '▲' : '▼';

      return (
        <TouchableOpacity
          onPress={() => {
          
          

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
                    category: "stocks"
                });
            
                console.log('Asset saved (no duplicates):', item.name);
              } catch (error) {
                console.error('Error saving asset:', error);
              }
            };
            handleItemClick(item)
    

            setCoinPageIndex(0)
            SheetManager.show('StockPage_Sheet',  {
              payload: { value: item.symbol }, // Passing dynamic data (payload)
            });
            setCurrentCoinSelected(item);
           
          }}
          style={{
            height: height(19),
            width: width(36),
            marginRight: width(5),
            backgroundColor: CurrentViewMode.Mode_ButtonBgColor_Search,
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
      

          <SvgFromUri uri={`https://assets.parqet.com/logos/symbol/${item.symbol}?format=svg`} width={size(30)} height={size(30)} />

          </View>

          <Text
            numberOfLines={1}
            style={{
              width: "80%",
              fontWeight: 'bold',
              fontSize: size(16),
              color: CurrentViewMode.Mode_fontColor,
              marginTop: height(1),
              marginLeft: width(5),
            }}
          >
            {item.name}
          </Text>

          <View style={{ marginTop: height(2), marginLeft: width(5), flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: size(15), fontWeight: 'bold', color: priceChangeColor }}>
              {priceChangeSymbol} {parseFloat(item.price_change_percentage_24h).toFixed(2)}%
            </Text>

         
          </View>
        </TouchableOpacity>
      );
    },
    [setCurrentCoinSelected, setCoinPageIndex]
  );




  
    return (
      <>
        {isDataFetched ? (
          <FlatList
            contentContainerStyle={{ paddingLeft: width(5) }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={stableCoinsData}
            keyExtractor={(item) => item.id}
            renderItem={renderItemStableCoins}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={3}
            removeClippedSubviews
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
           
          />
        ) : (
          <SkeletonLoading background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
            <View style={{ flexDirection: 'row' }}>
              {[...Array(3)].map((_, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor:  CurrentViewMode.Mode_BgColorBar_Search,
                    height: height(19),
                    width: width(36),
                    marginRight: width(5),
                    borderRadius: 20,
                    marginBottom: 15,
                  }}
                />
              ))}
            </View>
          </SkeletonLoading>
        )}
      </>
   );
  });
  
  
  export default TopMoversStocksSheetData;
  