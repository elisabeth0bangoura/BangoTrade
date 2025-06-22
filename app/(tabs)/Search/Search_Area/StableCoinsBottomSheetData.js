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
import { usePostHog } from 'posthog-react-native';


const Tab = createMaterialTopTabNavigator();










    const StableCoinBottomSheetData = React.memo(() => {

      const posthog = usePostHog(); // ✅ this gives you access to the actual instance

      const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

      const { SearchIndex, setSearchIndex } = useContext(SearchContext);

    const { setCoinPageIndex } = useContext(CoinPageContext);
    const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [stableCoinsData, setStableCoinsData] = useState([]); // Store stable coins
    const loadedCharts = useRef(new Map());
    const hasFetched = useRef(false); // Prevent infinite fetching

    


    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
      },
    };
  
 
    


  // Fetch stable coins data
  const fetchCoinsData = useCallback(async () => {
    if (isFetching || hasFetched.current) return;
    setIsFetching(true);

    try {
      console.log('🔥 Fetching stable coins...');
      const res = await fetch(
        'https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tether,usd-coin,binance-usd,dai&per_page=5',
        options
      );
      const data = await res.json();

      if (data?.length) {
        setStableCoinsData(
          data.map((coin) => ({
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
      } else {
        console.warn('❌ No stable coins found.');
      }
    } catch (error) {
      console.error('🚨 Error fetching stable coins:', error);
    } finally {
      setIsDataFetched(true);
    }
  }, [options]);

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

              
            posthog.capture('open_coin_bottomsheet', {
              screen: 'Coin_Page',
              $screen_name: 'Coin_Page '+" / "+item.name,
              timestamp: new Date().toISOString(),
      
              });

            setCoinPageIndex(0)
            SheetManager.show('CoinPage_Sheet',  {
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
            <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
          </View>

          <Text
            numberOfLines={1}
            style={{
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
  
  
  export default StableCoinBottomSheetData;
  