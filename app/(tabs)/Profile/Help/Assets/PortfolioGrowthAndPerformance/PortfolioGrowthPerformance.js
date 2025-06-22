import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, Dimensions, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
import { GestureHandlerRootView, FlatList, ScrollView, } from 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';




import * as Haptics from 'expo-haptics';

import { color } from 'd3';

import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { FlashList } from '@shopify/flash-list';
import Collapsible from 'react-native-collapsible';
import CoinPage from '@/app/(coin)/coinPage';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';

import { HomeChartContext } from '../../../../../Context/HomeChartContext';
import { useRouter } from 'expo-router';


import RNPickerSelect from "react-native-picker-select";

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '../../../../../Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from '../../../../../Context/ViewModeContext';

import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc, addDoc, collection, onSnapshot } from "@react-native-firebase/firestore";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";
import { usePostHog } from 'posthog-react-native';

import { ReanimatedScrollView } from 'react-native-reanimated'; // If you want scroll-based animations
import Animated, { Easing, FadeIn, FadeOut, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import SkeletonLoading from 'expo-skeleton-loading'
import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '@/app/Context/CurrentCoinSelectedContext';









export default function PortfolioGrowthPerformanceSheet () {
  

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance





	const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  



  const { t } = useTranslation();


    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

    const {MetricsState, setMetricsState} = useContext(HomeChartContext)
    const {setCurrentChoosedItem} = useContext(HomeContext)
    const windowHeight = Dimensions.get('window').height;
    const Activity_Sheet = useRef(null);
    const calculatedHeight = windowHeight * 0.92;
  
    const [AlpacaUserId, setAlpacaUserId] = useState();

    const [groupedActivities, setGroupedActivities] = useState([]);
  
    const [UserFirstName, setUserFirstName] = useState("")
    const [UserLastName, setUserLastName] = useState("")
    const [tLoaded, setLoaded] = useState(false)
  const [MyInvestments, setMyInvestments] = useState([])

  

  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);


  const { 
    CoinPageIndex, 
    setCoinPageIndex,  
    CurrentBackgroundColorForCoin, 
    setCurrentBackgroundColorForCoin, coinData, setCoinData  } = useContext(CoinPageContext);

  

 useEffect(() => {
    posthog.capture('screen_viewed', {
      screen: 'PortfolioGrowthPerformanceSheet',
      $screen_name: 'PortfolioGrowthPerformanceSheet',
      timestamp: new Date().toISOString(),
    });
  }, []);



      // ✅ Function to get correct headers (This Month / Month Year)
  const getMonthHeader = (dateString) => {
    const date = new Date(dateString);
    const month = t(date.toLocaleString('default', { month: 'long' }));  // Translate month name
    const monthYear = `${month} ${date.getFullYear()}`;
  
    const currentDate = new Date();
    const currentMonth = t(currentDate.toLocaleString('default', { month: 'long' }));  // Translate current month
    const currentMonthYear = `${currentMonth} ${currentDate.getFullYear()}`;
  
    return monthYear === currentMonthYear ? t('ThisMonth') : monthYear;
  };
  


  
  
 
    
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization:
        "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==",
    },
  };
  

  







  
    useEffect(() => {




      const fetchUserData = async () => {
        try {
          // Fetch user document from Firestore
          const userDocument = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();
    
          if (userDocument.exists) {
            // If the document exists, set the data
            const userData = userDocument.data();
    
            setAlpacaUserId(userData?.AlpacaAccountId);
            setUserFirstName(userData?.newAccountPayload?.identity?.given_name);
            setUserLastName(userData?.newAccountPayload?.identity?.family_name);
    
            console.log("given_name ", userData?.newAccountPayload?.identity?.given_name);
            console.log("family_name ", userData?.newAccountPayload?.identity?.family_name);
            console.log("AlpacaAccountId: ", userData?.AlpacaAccountId);
    

      const API_URL =
      `https://broker-api.sandbox.alpaca.markets/v1/accounts/activities?account_id=${userData.AlpacaAccountId}&page_size=100`;
  
      

      const fetchActivities = async () => {
        try {
          const response = await fetch(API_URL, options);
          if (!response.ok) {
            console.error("API Error:", await response.text());
            return;
          }
  
          const data = await response.json();
          console.log("Fetched Activities:", data);
  
          // ✅ Grouping Activities
          const groupedData = {};
          data.forEach((activity) => {
            const header = getMonthHeader(activity.date || activity.transaction_time);
            if (!groupedData[header]) {
              groupedData[header] = [];
            }
            groupedData[header].push(activity);
          });

          
  
          // ✅ Convert to FlatList Format
          const formattedData = [];
          Object.keys(groupedData).forEach((month) => {
            formattedData.push({ type: "header", title: month });
            groupedData[month].forEach((item) => formattedData.push({ type: "item", ...item }));
          });
  
          setGroupedActivities(formattedData);
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };
  
      fetchActivities();


           
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

fetchUserData();
}, [user?.uid]); // Make sure the effect runs whenever user.uid changes























const optionsAlpaca = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
  }
};












  useEffect(() => {
    setLoaded(true);
  
    const polygonApiKey = "O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm";
  
    const fetchUserData = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;
  
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (!userDoc.exists) return;
  
        const alpacaAccountId = userDoc.data().AlpacaAccountId;
        setAlpacaUserId(alpacaAccountId);
  
        firestore()
          .collection('users')
          .doc(user.uid)
          .collection('Transaction_Activities')
          .onSnapshot(async (snapshot) => {
            const activities = snapshot.docs.map(doc => doc.data());
            const validActivities = activities.filter(item => item.symbol && item.qty);
  
            const assetQty = validActivities.reduce((acc, item) => {
              const symbol = item.symbol;
              const qty = parseFloat(item.qty);
              if (symbol && qty) acc[symbol] = (acc[symbol] || 0) + qty;
              return acc;
            }, {});
  
            const res = await fetch(
              `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${alpacaAccountId}/positions`,
              optionsAlpaca
            );
            const alpacaAssets = await res.json();
  
            // Split into crypto and stocks
            const cryptoAssets = alpacaAssets.filter(a => a.asset_class === "crypto");
            const usEquities = alpacaAssets.filter(a => a.asset_class === "us_equity");
  
            let allMarketData = [];
  
            // === Handle Crypto ===
            for (let i = 0; i < cryptoAssets.length; i++) {
              const asset = cryptoAssets[i];
              const symbol = asset.symbol.split('/')[0].slice(0, 3);
              const qty = parseFloat(asset.qty) || 0;
              const avgEntryPrice = parseFloat(asset.avg_entry_price);
              const lastDayPrice = parseFloat(asset.lastday_price || 0);
  
              try {
                const res = await fetch(
                  `https://pro-api.coingecko.com/api/v3/search?query=${symbol}`,
                  {
                    method: 'GET',
                    headers: {
                      accept: 'application/json',
                      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                    },
                  }
                );
                const search = await res.json();
                const coinId = search?.coins?.[0]?.id;
                if (!coinId) continue;
  
                const marketDataRes = await fetch(
                  `https://pro-api.coingecko.com/api/v3/coins/${coinId}`,
                  options
                );
                const market = await marketDataRes.json();
                const currentPrice = market.market_data.current_price.usd;
  
                const previousPrice = market.market_data.price_change_percentage_24h
                  ? currentPrice / (1 + market.market_data.price_change_percentage_24h / 100)
                  : currentPrice;
  
                const marketValue = currentPrice * qty;
                const marketValueBefore = previousPrice * qty;
                const priceChangeInDollars = marketValue - marketValueBefore;
  
                const sinceBroughtInDollars = (currentPrice - avgEntryPrice) * qty;
                const sinceBroughtInPercentage = ((currentPrice - avgEntryPrice) / avgEntryPrice) * 100;
  
                const dailyChangeInDollars = (currentPrice - lastDayPrice) * qty;
                const dailyChangePercentage = ((currentPrice - lastDayPrice) / lastDayPrice) * 100;
  
                allMarketData.push({
                  id: coinId,
                  name: market.name,
                  symbol: market.symbol,
                  asset_class: "crypto",
                  market_cap: market.market_data.market_cap.usd,
                  current_price: currentPrice,
                  price_change_percentage_24h: market.market_data.price_change_percentage_24h,
                  price_change_in_dollars: priceChangeInDollars,
                  image: market.image.large,
                  qty,
                  market_value: marketValue,
                  daily_change_percentage: dailyChangePercentage,
                  daily_change_in_dollars: dailyChangeInDollars,
                  since_brought_in_dollars: sinceBroughtInDollars,
                  since_brought_in_percentage: sinceBroughtInPercentage
                });
              } catch (err) {
                console.error(`❌ Error fetching crypto data for ${symbol}:`, err.message);
              }
            }
  
            // === Handle Stocks ===
            for (let i = 0; i < usEquities.length; i++) {
              const asset = usEquities[i];
              const shortSymbol = asset.symbol.split('/')[0];
              const qty = parseFloat(asset.qty) || 0;
              const avgEntryPrice = parseFloat(asset.avg_entry_price);
              const lastDayPrice = parseFloat(asset.lastday_price || 0);
  
              try {
                const infoRes = await fetch(
                  `https://api.polygon.io/v3/reference/tickers/${shortSymbol}?apiKey=${polygonApiKey}`
                );
                const infoJson = await infoRes.json();
                const polygonInfo = infoJson.results;
  
                const snapRes = await fetch(
                  `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${shortSymbol}?apiKey=${polygonApiKey}`
                );
                const snapJson = await snapRes.json();
                const snap = snapJson?.ticker;
  
                const geckoRes = await fetch(
                  `https://pro-api.coingecko.com/api/v3/search?query=${shortSymbol}`,
                  {
                    method: 'GET',
                    headers: {
                      accept: 'application/json',
                      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                    },
                  }
                );
                const search = await geckoRes.json();
                const coinId = search?.coins?.[0]?.id;
                if (!coinId) continue;
  
                const marketRes = await fetch(
                  `https://pro-api.coingecko.com/api/v3/coins/${coinId}`,
                  options
                );
                const market = await marketRes.json();
                const currentPrice = parseFloat(asset.current_price);
  
                const marketValue = currentPrice * qty;
                const sinceBroughtInDollars = (currentPrice - avgEntryPrice) * qty;
                const sinceBroughtInPercentage = ((currentPrice - avgEntryPrice) / avgEntryPrice) * 100;
  
                const dailyChangeInDollars = snap?.todaysChange ?? 0;
                const dailyChangePercentage = snap?.todaysChangePerc ?? 0;
  
                allMarketData.push({
                  id: shortSymbol.toLowerCase(),
                  name: polygonInfo?.name,
                  symbol: shortSymbol,
                  asset_class: asset.asset_class,
                  qty,
                  avg_entry_price: avgEntryPrice,
                  current_price: currentPrice,
                  market_value: marketValue,
                  market_cap: polygonInfo?.market_cap,
                  price_change_percentage_24h: dailyChangePercentage,
                  price_change_in_dollars: dailyChangeInDollars,
                  daily_change_percentage: dailyChangePercentage,
                  daily_change_in_dollars: dailyChangeInDollars,
                  since_brought_in_dollars: sinceBroughtInDollars,
                  since_brought_in_percentage: sinceBroughtInPercentage,
                  polygon_day_open: snap?.day?.o,
                  polygon_day_high: snap?.day?.h,
                  polygon_day_low: snap?.day?.l,
                  polygon_day_close: snap?.day?.c,
                  polygon_volume: snap?.day?.v,
                  locale: polygonInfo?.locale,
                  market: polygonInfo?.market,
                  description: polygonInfo?.description,
                  logo_url: polygonInfo?.branding?.logo_url + "?apiKey=" + polygonApiKey,
                  icon_url: polygonInfo?.branding?.icon_url + "?apiKey=" + polygonApiKey,
                  image: `https://assets.parqet.com/logos/symbol/${shortSymbol}?format=png&size=100`,
                });
              } catch (err) {
                console.error(`❌ Error processing ${shortSymbol}:`, err.message);
              }
            }
  
            // === Sort by MetricsState ===
            let sorted = allMarketData;
            if (MetricsState === "Since brought dollar") {
              sorted = sorted.sort((a, b) => b.since_brought_in_dollars - a.since_brought_in_dollars);
            } else if (MetricsState === "Since brought percentage") {
              sorted = sorted.sort((a, b) => b.since_brought_in_percentage - a.since_brought_in_percentage);
            } else if (MetricsState === "Daily trend dollar") {
              sorted = sorted.sort((a, b) => b.daily_change_in_dollars - a.daily_change_in_dollars);
            } else if (MetricsState === "Daily trend percentage") {
              sorted = sorted.sort((a, b) => b.daily_change_percentage - a.daily_change_percentage);
            }
  
            setLoaded(false);
            setMyInvestments(sorted);
          });
      } catch (err) {
        console.error("❌ Error in fetchUserData:", err.message);
      }
    };
  
    fetchUserData();
  
  }, [AlpacaUserId, MetricsState]);
  


  
  
  




const categories = [
  {
    name: 'Choose a topic',
    subcategories: [
      { name: 'Calculation of performance', 
        linkName: "CalculationOfPerformance_Sheet",
       },
      { name: 'Portfolio value decreased',
        linkName: "PortfolioValueDecreased_Sheet",
       },
      { name: 'Position is displayed incorrectly or not at all',
        linkName: "PositionIsDisplayedIncorrectlyOrNotAtAll_Sheet",
       },
      { name: 'Difference compared to individual items',
        linkName: "DifferenceComparedToIndividualItems_Sheet",
       },
    ],
  },  
 

];





const [selectedCategory, setSelectedCategory] = useState(null);

// Handle category click (set selected category)
const handleCategoryPress = (categoryName) => {
  setSelectedCategory(categoryName);
};

// Filter categories based on selected category
const filteredCategories = selectedCategory
  ? categories.filter((category) => category.name === selectedCategory)
  : categories;


  // Render each category item
  const renderCategoryItem = ({ item }) => {
      return (

    
        <View style={{
           top: height(-2)
        }}>
          {/* Main category title */}
          <TouchableOpacity
            style={{
            marginTop: height(1),
             marginBottom: height(1),
            paddingVertical: size(15),
            }}
           
          >
            <Text style={{
                  fontSize: size(15),
                  fontWeight: "bold",
                  color: CurrentViewMode.Mode_Sec_fontColor,
                }}>{item.name}</Text>
          </TouchableOpacity>

          {/* Subcategories */}
        
        
          
          {item.subcategories &&
          item.subcategories.map((subcategory, index) => (
                <TouchableOpacity onPress={() => {

                  posthog.capture(`clicked_help_asset_portfolio_growth_performance_${subcategory.linkName}_bottomsheet`, {
                    screen: 'PortfolioGrowthPerformanceSheet',
                    $screen_name: 'PortfolioGrowthPerformanceSheet',
                    timestamp: new Date().toISOString(),
                
                    });

                  SheetManager.show(subcategory.linkName)
                }}
                key={index} style={{
                  width: "100%",
                  paddingVertical: size(14),
                  flexDirection: "row",
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: size(15),
                    fontWeight: "bold",
                    color: CurrentViewMode.Mode_fontColor,
                  }}>{subcategory.name}</Text>

                  <MaterialIcons name='arrow-forward-ios' style={{
                    fontSize: size(18),
                    color: CurrentViewMode.Mode_Sec_fontColor,
                    position: 'absolute',
                    right: width(0)
                  }} />
                </TouchableOpacity>
              ))}
 
 
        </View>
          )
          
      
    

    
};








const formatMoneyMyInvestmnt = useCallback((price) => {
  return new Intl.NumberFormat('us-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}, []);





   // Render List of Alpaca positions with Coingecko data
   const MyInvestmentsrenderItem = ({ item }) => {
    // Determine the value you want to check: daily_change_in_dollars, daily_change_percentage, since_brought_in_dollars, or since_brought_in_percentage
    let changeValue;
    let changeSymbol = '';
    let displayValue = '';
    
    if (MetricsState === "Daily trend dollar") {
      changeValue = item.daily_change_in_dollars;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = formatMoneyMyInvestmnt(item.daily_change_in_dollars);
    } else if (MetricsState === "Daily trend percentage") {
      changeValue = item.daily_change_percentage;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = `${changeValue.toFixed(2)}%`;
    } else if (MetricsState === "Since brought dollar") {
      changeValue = item.since_brought_in_dollars;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = formatMoneyMyInvestmnt(item.since_brought_in_dollars);
    } else if (MetricsState === "Since brought percentage") {
      changeValue = item.since_brought_in_percentage;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = `${changeValue.toFixed(2)}%`;
    }
  
    return (
      <TouchableOpacity
        onPress={() => {
          // Handle item press if needed
  

          if(item.asset_class == "us_equity") {
        

        posthog.capture('open_stock_bottomsheet', {
          screen: 'PortfolioGrowthPerformanceSheet',
          $screen_name: 'PortfolioGrowthPerformanceSheet '+" / "+item.name,
          timestamp: new Date().toISOString(),
      
          });

            setCoinPageIndex(0)
            SheetManager.show('StockPage_Sheet',  {
              payload: { value: item.symbol }, // Passing dynamic data (payload)
            });
            setCurrentCoinSelected({
              id: item.symbol,
              chart: [], 
              CoinChartColor: "", 
              image: item.image,
              name: item.name,
              price: item.current_price,
              symbol: item.symbol,
            });
  
           } 
           if(item.asset_class == "crypto") {



        posthog.capture('open_coin_bottomsheet', {
          screen: 'PortfolioGrowthPerformanceSheet',
          $screen_name: 'PortfolioGrowthPerformanceSheet '+" / "+item.name,
          timestamp: new Date().toISOString(),
      
          });

     
            SheetManager.show('CoinPage_Sheet',  {
              payload: { value: item.symbol }, // Passing dynamic data (payload)
            });


            setCurrentCoinSelected(item);
           } 
  
          

        }}
        style={{
          height: height(8),
          width: size(130),
          paddingRight: width(5),
          alignItems: 'center',
          marginLeft: width(5),
        }}
      >
        <View
          style={{
            height: size(25),
            width: size(25),
            borderRadius: size(25) / 2,
            overflow: 'hidden',
          }}
        >
          {/* Display Coin Image */}
          <Image
            source={{ uri: item.image || '' }}
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        </View>
  
        <View style={{ }}>
          {/* Display Coin Name */}
          <Text numberOfLines={1} style={{ width: width(30), textAlign: 'center', fontSize: size(16), alignSelf: 'center', marginTop: height(1), color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold' }}>
            {item.name}
          </Text>
  
      
            {/* Display Price Change */}
            <Text
              style={{
                fontSize: size(15),
                marginTop: height(1),
                alignSelf: 'center',
                textAlign: 'center',
                color: changeValue >= 0 ? '#00CE39' : '#FF1B1E', // Green for positive, red for negative
                fontWeight: '900',
              }}
            >
              {changeSymbol} {displayValue}
            </Text>
 
  
          {/* Display Quantity and Market Value */}
          <Text style={{ fontSize: size(14), marginTop: height(3), color: CurrentViewMode.Mode_Sec_fontColor, fontWeight: 'bold' }}>
            {formatMoneyMyInvestmnt(item.market_value)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  




















    
    
      return (
  
  
  
        <ActionSheet 
        ref={Activity_Sheet}
        backgroundInteractionEnabled={true}
        gestureEnabled={true}
         
        onOpen={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
        }}
        CustomHeaderComponent={
      
      
      
      <> 
  
  
  
     <View
     style={{
       backgroundColor: '#fff', // Color of the indicator
       height: height(0.6), // Height of the indicator
       width: width(11),
       borderRadius: 50,
       alignSelf: 'center',
       position: 'absolute',
       top: -15, // Moves the indicator down (distance from the top)
     }}
   />
     </>
   }
     
       
       containerStyle={{
         maxHeight: height(92),
         backgroundColor: CurrentViewMode.Mode_bg,
         height: height(92),
         borderTopLeftRadius: 20,
         borderTopRightRadius: 20,
         
       }} 	
       style={{
         height: "100%",
         backgroundColor: CurrentViewMode.Mode_bg,
     }}>
   
  
  
  
        <ScrollView showsVerticalScrollIndicator={false} style={{
        height: "100%",
        width: "90%",
        alignSelf: 'center'
        }}>

  
          <Text style={{
              fontSize: size(25),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "900",
              marginTop: height(4),
              marginLeft: width(5),
          }}>

            Portfolio Growth and Performance
             
          </Text>
  



  

          <Text style={{
              fontSize: size(15),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "900",
              marginTop: height(4),
              marginLeft: width(5),
          }}>
          Select investment
          </Text>




{
  tLoaded == true

  ?


  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{
    marginTop: height(3)
  }}>
{/* Show 3 Skeleton Items */}
{Array.from({ length: 3 }).map((_, index) => (
  <SkeletonLoading key={index} background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
    <View style={{  top: height(3), marginBottom: height(4) }}>
      {/* Left Skeleton Box */}


      <View
        style={{
          backgroundColor:  CurrentViewMode.Mode_BgColorBar_Search,
          height: size(15),
          width: width(15),
          alignSelf: 'center',
          marginBottom: height(1),
          marginLeft: width(5),
          borderRadius: 8, // Optional: Add rounded corners
        }}
      />


      <View
        style={{
          backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
          height: size(15),
          width: width(30),
          alignSelf: 'center',
          marginBottom: height(1),
          marginLeft: width(5),
          borderRadius: 8, // Optional: Add rounded corners
        }}
      />

      {/* Right Skeleton Box */}
      <View
        style={{
          backgroundColor:  CurrentViewMode.Mode_BgColorBar_Search,
          height: size(15),
          width:width(25),
          alignSelf: 'center',
          marginLeft: width(5),
          borderRadius: 8,
        }}
      />
    </View>
  </SkeletonLoading>
))}
</ScrollView>


:

     <FlatList showsHorizontalScrollIndicator={false}  style={{
            marginTop: height(5),
            height: height(10),
          }}
          horizontal
        data={MyInvestments}
        renderItem={MyInvestmentsrenderItem}
        keyExtractor={(item) => item.asset_id}
      />


}

     

      <View style={{ marginTop: height(3), marginLeft: width(5), }}>
       







      <FlatList  scrollEnabled={false}
       contentContainerStyle={{
            paddingBottom: height(10)
          }}
        data={filteredCategories} // Use filteredCategories here
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.name}
      />
         


       
      </View>
  
       
  </ScrollView>




      <View style={{
         width: "100%",
          position: 'absolute',
          bottom: height(8),
          flexDirection: 'row',
        }}>


      <TouchableOpacity onPress={() => {
          
        posthog.capture('close_portfolio_growth_performance_Sheet', {
          screen: 'PortfolioGrowthPerformanceSheet',
          $screen_name: 'PortfolioGrowthPerformanceSheet',
          timestamp: new Date().toISOString(),
          });

        SheetManager.hide("Asset_Sheet"); // Now hide the sheet after a delay
              
      }}
        style={{
          backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
          height: size(50),
          borderRadius: 10,
          width:  size(50),
          marginLeft: width(5),
          alignItems: 'center',
          justifyContent: 'center',
        }}>

          <MaterialIcons name='keyboard-arrow-left' style={{
            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(25),
          }} />
         
        </TouchableOpacity>

        </View> 
        
  
      </ActionSheet>
  
     
     
      );
    };
    






