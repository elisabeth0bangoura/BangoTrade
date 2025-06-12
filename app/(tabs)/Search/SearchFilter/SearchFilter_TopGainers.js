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




const Tab = createMaterialTopTabNavigator();













export default function SearchFilter_TopGainers({ SearchIndex3 }) {



  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const { setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);


  
  const [trendingCoinsData, setTrendingCoinsData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);


  const [SelectedSortPrice, setSelectedSortPrice] = useState("price_desc"); // ✅ Default: High to Low
  const [SelectedSort24h, setSelectedSort24h] = useState("percent_change_24h_desc"); // ✅ Default: 24h High to Low




  const trendingCoinsMemoized = useMemo(() => [...trendingCoinsData], [trendingCoinsData]);












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
                  backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
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
                  backgroundColor: CurrentViewMode.Mode_bg_Search,
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





    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-pro-api-key": "CG-9BNXX3AMb2poti6c1BsGi5iG",
      },
    };
  
    const fetchTrendingCoins = useCallback(
      debounce(async (sortOrder, sortBy) => {
        if (isFetching) return;
        setIsFetching(true);
    
        try {
          console.log(`🔥 Fetching top gainers... Sorting: ${sortBy} (${sortOrder})`);
    
          const response = await fetch(
            "https://pro-api.coingecko.com/api/v3/coins/top_gainers_losers?vs_currency=usd&duration=24h&top_coins=300",
            options
          );
          const data = await response.json();
    
          if (!data?.top_gainers || !Array.isArray(data.top_gainers) || data.top_gainers.length === 0) {
            console.warn("❌ No top gainers found.");
            setTrendingCoinsData([]);
            setIsDataFetched(false);
            return;
          }
    
          let sortedData = data.top_gainers.map((coin) => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            price: coin.usd,
            price_change_percentage_1h: coin.usd_1h_change ?? 0,
            price_change_percentage_24h: coin.usd_24h_change ?? 0,
            price_change_percentage_7d: coin.usd_7d_change ?? 0,
            volume: coin.total_volume ?? 0,
            market_cap: coin.market_cap ?? 0,
            image: coin.image || "",
            CoinChartColor: coin.usd_24h_change > 0 ? "#00CE39" : "#FF1B1E",
          }));
    
          console.log("📊 Sample Coin Data:", sortedData[0]); // ✅ Log one coin's data for debugging
    
          // ✅ Apply Sorting Correctly
          switch (sortBy) {
            case "price":
              sortedData.sort((a, b) => (sortOrder === "price_desc" ? b.price - a.price : a.price - b.price));
              break;
            case "24h":
              sortedData.sort((a, b) => (sortOrder === "percent_change_24h_desc" ? b.price_change_percentage_24h - a.price_change_percentage_24h : a.price_change_percentage_24h - b.price_change_percentage_24h));
              break;
           

          }
    
          console.table(sortedData.slice(0, 5)); // ✅ Log first 5 coins after sorting
    
          // ✅ Update State & Refresh UI
          setTrendingCoinsData([...sortedData]);
          setIsDataFetched(true);
        } catch (error) {
          console.error("🚨 Error fetching top gainers:", error);
          setIsDataFetched(false);
        } finally {
          setIsFetching(false);
        }
      }, 500),
      []
    );
    
    

  // ✅ Efficient useEffect Hook
  useEffect(() => {
    console.log("🔍 SearchIndex3 Changed:", SearchIndex3);
    if (SearchIndex3 === 0) {
      fetchTrendingCoins(SelectedSortPrice, "price");
    } else if (SearchIndex3 === -1) {
      setTrendingCoinsData([]);
      setIsDataFetched(false);
    }
  }, [SearchIndex3, SelectedSortPrice]); 
  

  
  // 🔹 Detect When Coins Become Visible & Fetch Charts
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };





 
 

const renderItem = useCallback(({ item }) => {
    const priceChangeColor = item.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E';
    const priceChangeSymbol = item.price_change_percentage_24h > 0 ? '▲' : '▼';

  return (

  
    <TouchableOpacity onPress={() => {
      setCurrentCoinSelected(item)
      setCoinPageIndex(0);
      SheetManager.show('CoinPage_Sheet');

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


  // 🔄 Toggle between "price_desc" and "price_asc"
  const newSortOrder = SelectedSortPrice === "price_desc" ? "price_asc" : "price_desc";
  setSelectedSortPrice(newSortOrder);

  // ✅ Manually Trigger Fetch (Important)
  fetchTrendingCoins(newSortOrder);


     }}
     style={{
        backgroundColor: CurrentViewMode.Mode_Secbg_Buttons_Cash,
        paddingVertical:  height(1) ,
        height: height(5),
        width: "auto",
        borderRadius: 10,
      
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: width(4)
        }}>
          <Text style={{
            fontSize: size(16),
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
        const newSortOrder = SelectedSort24h === "percent_change_24h_desc" ? "percent_change_24h_asc" : "percent_change_24h_desc";
        setSelectedSort24h(newSortOrder);
        fetchTrendingCoins(newSortOrder, "24h");
        }}
        style={{
             backgroundColor:  CurrentViewMode.Mode_Secbg_Buttons_Cash,
             paddingVertical:  height(1) ,
             marginLeft: width(5),
             width: "auto",
             height: height(5),
             borderRadius: 10,
             flexDirection: 'row',
             justifyContent: 'center',
             paddingHorizontal: width(4)
        }}>
          <Text style={{
            fontSize: size(16),
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


        </ScrollView>
        </View>







  {isDataFetched ? (
        <FlashList
          data={trendingCoinsMemoized}
          keyExtractor={(item) => `${item.id}-${item.symbol}`}
          renderItem={renderItem}
          estimatedItemSize={170}
          contentContainerStyle={{
            paddingBottom: height(15),
          }}
        />
      ) : (
        <SkeletonPlaceholder />
      )}
    </>
  );
}