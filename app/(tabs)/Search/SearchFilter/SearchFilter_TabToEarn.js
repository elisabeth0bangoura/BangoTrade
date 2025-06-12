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











export default function SearchFilter_TabToEarn({ SearchIndex3 }) {


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const { setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);


  const [tapToEarnCoins, setTapToEarnCoins] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const [SelectedSortPrice, setSelectedSortPrice] = useState("price_desc"); // ✅ Default: High to Low
  const [SelectedSort24hVolume, setSelectedSort24hVolume] = useState("volume_desc"); // ✅ Default: High to Low
  const [SelectedSortMarketCap, setSelectedSortMarketCap] = useState("market_cap_desc"); // ✅ Default: High to Low








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
 

  // ✅ Memoize data
    const tapToEarnCoinsMemoized = useMemo(() => [...tapToEarnCoins], [tapToEarnCoins]);







  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-pro-api-key": "CG-9BNXX3AMb2poti6c1BsGi5iG",
    },
  };

  // ✅ Fetch "Tap to Earn" Coins (Filtered from Play-to-Earn)
  const fetchTapToEarnCoins = useCallback(
    debounce(async (sortOrder, sortBy) => {
      if (isFetching) return;
      setIsFetching(true);
  
      try {
        console.log(`🔥 Fetching 'Tap to Earn' coins... Sorting: ${sortBy} (${sortOrder})`);
  
        const response = await fetch(
          "https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=play-to-earn&order=market_cap_desc&per_page=100&page=1",
          options
        );
        const data = await response.json();
  
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("❌ No Tap to Earn coins found.");
          setTapToEarnCoins([]);
          setIsDataFetched(false);
          return;
        }
  
        // ✅ Filter only "Tap to Earn" type coins
        let filteredCoins = data.filter((coin) =>
          ["tap", "click", "earn", "play", "rewards", "mining", "mobile", "cash", "game"].some((keyword) =>
            coin.name.toLowerCase().includes(keyword) || coin.symbol.toLowerCase().includes(keyword)
          )
        );
  
        console.log("✅ Filtered Tap to Earn Coins:", filteredCoins.length);
  
        let sortedData = filteredCoins.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price,
          volume_24h: coin.total_volume, // ✅ Get the 24h trading volume
          market_cap: coin.market_cap, // ✅ Get market cap
          image: coin.image || "",
        }));
  
        // ✅ Apply Sorting (Price, Volume & Market Cap)
        switch (sortBy) {
          case "price":
            sortedData.sort((a, b) => (sortOrder === "price_desc" ? b.price - a.price : a.price - b.price));
            break;
          case "volume":
            sortedData.sort((a, b) => (sortOrder === "volume_desc" ? b.volume_24h - a.volume_24h : a.volume_24h - b.volume_24h));
            break;
          case "market_cap":
            sortedData.sort((a, b) => (sortOrder === "market_cap_desc" ? b.market_cap - a.market_cap : a.market_cap - b.market_cap));
            break;
        }
  
        console.table(sortedData.slice(0, 5)); // ✅ Debugging
  
        setTapToEarnCoins([...sortedData]);
        setIsDataFetched(true);
      } catch (error) {
        console.error("🚨 Error fetching Tap to Earn coins:", error);
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
      fetchTapToEarnCoins();
    } else if (SearchIndex3 === -1) {
      setTapToEarnCoins([]);
      setIsDataFetched(false);
    }
  }, [SearchIndex3, fetchTapToEarnCoins]); // ✅ Depend on `fetchTapToEarnCoins`


 
 

const renderItem = useCallback(({ item }) => {
    const priceChangeColor = item.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E';
    const priceChangeSymbol = item.price_change_percentage_24h > 0 ? '▲' : '▼';

  return (

    item.image == null

    ?


    null

    :


  
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
      backgroundColor: '#ffff',
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
  const newSortOrder = SelectedSortPrice === "price_desc" ? "price_asc" : "price_desc";
  setSelectedSortPrice(newSortOrder);
  fetchTapToEarnCoins(newSortOrder, "price");
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

          <MaterialIcons name={SelectedSortPrice === "price_desc" ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          style={{
            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(25),
          }} />
        </TouchableOpacity>




        <TouchableOpacity 
        onPress={() => {
          const newSortOrder = SelectedSort24hVolume === "volume_desc" ? "volume_asc" : "volume_desc";
          setSelectedSort24hVolume(newSortOrder);
          fetchTapToEarnCoins(newSortOrder, "volume");
      }}
        style={{
         backgroundColor: CurrentViewMode.Mode_Secbg_Buttons_Cash,
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
            const newSortOrder = SelectedSortMarketCap === "market_cap_desc" ? "market_cap_asc" : "market_cap_desc";
            setSelectedSortMarketCap(newSortOrder);
            fetchTapToEarnCoins(newSortOrder, "market_cap");
        }}
        style={{
         backgroundColor: CurrentViewMode.Mode_Secbg_Buttons_Cash,
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
          data={tapToEarnCoinsMemoized}
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
