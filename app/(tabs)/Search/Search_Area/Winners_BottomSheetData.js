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
import SvgFromUri from './SvgFromUri';

import { getFirestore, doc, getDoc, collection, setDoc, addDoc, onSnapshot } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";





const Tab = createMaterialTopTabNavigator();







const Winners_BottomSheetData = React.memo(() => {


  const [recentAssets, setRecentAssets] = useState([]);


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { SearchIndex, setSearchIndex } = useContext(SearchContext);

  const { setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);

  const [StableCoinsData, setStableCoinsData] = useState([])
  const [winnersData, setWinnersData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const hasFetched = useRef(false); // To prevent multiple fetches



  const POLYGON_API_KEY = 'O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm';


  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
    },
  };

  const fetchWinnersData = useCallback(async () => {
    if (isFetching || hasFetched.current) return; // Prevent duplicate requests
    setIsFetching(true);
    setIsDataFetched(false);

    try {
      console.log('🔥 Fetching winners (top gainers)...');
      const res = await fetch(
        'https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=10&page=1',
        options
      );
      const data = await res.json();

      if (data?.length) {
        const formattedData = data.map((coin) => ({
          id: coin.id,
          name: coin.name || 'Unknown',
          symbol: coin.symbol || 'N/A',
          priceChangePercentage: coin.price_change_percentage_24h || 0,
          image: coin.image || '',
        }));
        setWinnersData(formattedData);
        setIsDataFetched(true);
        hasFetched.current = true; // Mark as fetched
      } else {
        console.warn('❌ No gainers found.');
        setWinnersData([]);
        setIsDataFetched(false);
      }
    } catch (error) {
      console.error('🚨 Error fetching winners:', error);
      setIsDataFetched(false);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]);
















  // Fetch stable coins data
 /* const fetchCoinsData = useCallback(async () => {
    if (isFetching || hasFetched.current) return;
    setIsFetching(true);
  
    try {
      console.log('🔥 Fetching top gainers...');
  
      const res = await fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=${POLYGON_API_KEY}`);
      const data = await res.json();
  
      if (data?.tickers?.length) {
        const top10Tickers = data.tickers.slice(0, 10); // ✅ limit to only 10 stocks
  
        const detailedData = await Promise.all(
          top10Tickers.map(async (item) => {
            try {
              const tickerSymbol = item.ticker;
  
              const detailsResponse = await fetch(`https://api.polygon.io/v3/reference/tickers/${tickerSymbol}?apiKey=${POLYGON_API_KEY}`);
              const detailsData = await detailsResponse.json();
  
              const result = detailsData.results || {};
  

              console.log(result)
              return {
                id: tickerSymbol,
                name: result.name || '',
                symbol: tickerSymbol,
                price: item.day?.c || 0,
                priceChangePercentage: item.todaysChangePerc || 0,
                image: result.branding?.icon_url || result.branding?.logo_url,
                chart: [], // fill later
                CoinChartColor: (item.todaysChangePerc || 0) > 0 ? '#00CE39' : '#FF1B1E',
              };
            } catch (error) {
              console.error('❌ Error fetching details for:', item.ticker, error);
              return null;
            }
          })
        );
  
        const cleanData = detailedData.filter(item => item !== null);
  
        setWinnersData(cleanData); // ✅ Set your state
        hasFetched.current = true;
      } else {
        console.warn('❌ No gainers found.');
      }
  
    } catch (error) {
      console.error('🚨 Error fetching stocks:', error);
    } finally {
      setIsFetching(false);
      setIsDataFetched(true);
    }
  }, [isFetching]);
  
*/



  
  useEffect(() => {
    if (SearchIndex == 0 && !hasFetched.current) {
      fetchWinnersData();
    } else if (SearchIndex == -1) {
      setWinnersData([]);
   //   setIsDataFetched(false);
   //   hasFetched.current = false; // Reset when the index changes
    }
  }, []);





  


 //  Memoized Render Item
 const renderItem = useCallback(({ item }) => {
  const priceChangeColor = item.priceChangePercentage > 0 ? "#00CE39" : "#FF1B1E";
  const priceChangeSymbol = item.priceChangePercentage > 0 ? "▲" : "▼";

  return (
    <View
    style={{
      height: height(20),
      width: width(42),
      marginRight: width(5),
      backgroundColor: CurrentViewMode.Mode_fontColor,
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

<SvgFromUri uri={item.image+"?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm"} width={size(30)} height={size(30)} />

{   /*   <Image
      source={{ uri: item.image }}
      style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
      />*/}
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
        color:  CurrentViewMode.Mode_fontColor,
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
      {priceChangeSymbol} {parseFloat(item.priceChangePercentage).toFixed(2)}%
      </Text>

  
    </View>
    </View>
  );
  }, []);
  


    






  return(


      <>




{isDataFetched ? (
	<ScrollView style={{
    marginTop: height(1)
}} horizontal showsHorizontalScrollIndicator={false} directionalLockEnabled={true} alwaysBounceVertical={false}>
  <FlatList
    scrollEnabled={false}
    style={{
      height: "auto",
    }}
    onEndReachedThreshold={0.1}
    getItemLayout={(data, index) => ({
      length:  height(4.5),
      offset:  height(4.5) * index,
      index,
    })} 
    contentContainerStyle={{ alignSelf: 'flex-start',  paddingLeft: width(5),  }}
    numColumns={Math.ceil(winnersData.length / 2)} // Number of stablecoins per row
   
    estimatedItemSize={50}
    decelerationRate="fast"
    showsVerticalScrollIndicator={false}
    initialNumToRender={5} // ✅ Render fewer items initially
    maxToRenderPerBatch={5} // ✅ Optimize rendering per batch
    updateCellsBatchingPeriod={50} // ✅ Reduce frequent updates
    windowSize={5} // ✅ Reduce memory usage
    removeClippedSubviews={true}

    data={winnersData} // Data containing stablecoins
    keyExtractor={(item, index) => index.toString()} // Use id as the key for FlatList
    key={Math.ceil(winnersData.length / 2)} // Add key to force re-render
    renderItem={({ item }) => {
      const priceChangeColor = item.priceChangePercentage > 0 ? '#00CE39' : '#FF1B1E';
      const priceChangeSymbol = item.priceChangePercentage > 0 ? '▲' : '▼';
    
      return (
        <TouchableOpacity onPress={() => {

      
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderRadius: 10,
        width: 'auto',
        backgroundColor: CurrentViewMode.Mode_ButtonBgColor_Search,
        height: height(4.5),
        marginRight: 10,
        marginBottom: 20,
      }}>
        <View style={{
          height: 25,
          width: 25,
          borderRadius: 25 / 2,
          backgroundColor: CurrentViewMode.Mode_ButtonBgColor_Search,
          alignSelf: 'center',
          overflow: 'hidden',
        }}>
          <Image
           source={{ uri: item.image+"?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm" }}
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
        </View>

        <Text style={{ color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold', marginLeft: 20, fontSize: 16 }}>
          {item.name}
        </Text>
        <Text
      style={{
        fontSize: size(15),
        marginLeft: width(5),
        fontWeight: 'bold',
        color: priceChangeColor,
      }}
      >
      {priceChangeSymbol} {parseFloat(item.priceChangePercentage).toFixed(2)}%
      </Text>
      </TouchableOpacity>
  );
}}

/>
</ScrollView>

) : (

  <SkeletonLoading background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
 


 <View style={{ flex:1, marginLeft: 10 }}>
  <View style={{ backgroundColor: CurrentViewMode.Mode_BgColorBar_Search, borderRadius: 10 , width: "50%", height: height(4.5),  marginRight: 10,
  marginBottom: 10,}} />
  <View style={{ backgroundColor: CurrentViewMode.Mode_BgColorBar_Search, width: '60%',  height: height(4.5),  borderRadius: 10  }} />
  
 
  <View style={{ backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,  marginLeft: 200, width: '60%', position: 'absolute',  height: height(4.5),  borderRadius: 10 }} />
  <View style={{ backgroundColor: CurrentViewMode.Mode_BgColorBar_Search, marginTop: 48, marginLeft: 240, width: '60%', position: 'absolute',  height: height(4.5), borderRadius: 10 }} />
  
  </View>

 </SkeletonLoading>
      )}
</>
 );
});


export default Winners_BottomSheetData;
