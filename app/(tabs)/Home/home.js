import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, FlatList, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome, FontAwesome5, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '../../../Languages_Translation_Screens/i18n'; 
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';



import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';

import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";


import { CoinPageContext } from '../../Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '../../Context/CurrentCoinSelectedContext';
import {Search2Context} from '../../Context/SearchIndexStateContext';
import { FlashList } from '@shopify/flash-list';
import Collapsible from 'react-native-collapsible';

import { IFollowingsCoinsContext } from '../../Context/OpenIFollowingsCoinsSheetContext';
import CoinPage from '@/app/(coin)/coinPage';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';
import HomeChart from './HomChart';

import { HomeChartContext } from '@/app/Context/HomeChartContext';
import RollingNumber from './animatedNumber';
import { ViewModeContext } from '@/app/Context/ViewModeContext';


import { getAnalytics, setUserId, logEvent, setUserProperties } from '@react-native-firebase/analytics';



import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc, collection, addDoc, onSnapshot } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";
import { SearchContext } from '@/app/Context/MainSearchIndexStateContext';
import { usePostHog } from 'posthog-react-native';


























// Component for Sort Following coins
export const SortMetricsSinceBuy = () => {


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const {
    ShowHomeChart, setShowHomeChart,
    MetricsState, setMetricsState,
  } = useContext(HomeChartContext)


  
  const {CoinPageIndex, setCoinPageIndex, CurrentBackgroundColorForCoin } = useContext(CoinPageContext);




  const windowHeight = Dimensions.get('window').height;


  

  const SortMetricsSinceBuy_Sheet = useRef(null);



  



const calculatedHeight = windowHeight * 0.40;




  
    return (



      <ActionSheet 
      ref={SortMetricsSinceBuy_Sheet}
      backgroundInteractionEnabled={false}
      isModal={false}
      onOpen={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
      }}
      gestureEnabled={true}
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
       maxHeight: height(43),
       backgroundColor: CurrentViewMode.Mode_bg_Home,
       height: height(43),
       borderTopLeftRadius: 20,
       borderTopRightRadius: 20,
       
     }} 	
     style={{
       height: "100%",
       backgroundColor: CurrentViewMode.Mode_bg_Home,
   }}>
 

      <View>
        <Text style={{
            fontSize: size(25),
            color: CurrentViewMode.Mode_fontColor,
            fontWeight: "900",
            marginTop: height(4),
            marginLeft: width(5),
        }}>
         {t("MetricsHeader")}  
        </Text>




        <TouchableOpacity onPress={() => {
          	SheetManager.hide('SortMetricsSinceBuy_Sheet');
            setMetricsState("Since brought dollar")
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
        }}
        style={{
          marginTop: height(4),
          width: "90%",
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}>

          <View style={{
          height: 50,
          width: 50,
          marginRight: width(4),
          marginLeft: width(-2),
          alignItems: 'center',
          justifyContent: 'center',


           // marginLeft: width(2),
          }}> 
             <FontAwesome name='dollar'
               style={{
                  fontSize: size(20),
                  color: CurrentViewMode.Mode_fontColor,
                  marginLeft: width(1.5)
                  
               }} />
            </View>

            <Text style={{
               marginLeft: width(4),
               fontSize: size(15),
               color: CurrentViewMode.Mode_fontColor,
               fontWeight: "bold",
            }}>
              {t("SinceBroughtHeader")}   
            </Text>

            {
              MetricsState == "Since brought dollar"

              ?

              <MaterialIcons name='check' style={{
                color: CurrentViewMode.Mode_fontColor,
                position: 'absolute',
                right: width(5),
                fontSize: size(25),
              }} />

              :


              null

            }

         
        </TouchableOpacity>





        <TouchableOpacity onPress={() => {
          	SheetManager.hide('SortMetricsSinceBuy_Sheet');
            setMetricsState("Since brought percentage")
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
        }}
        style={{
          marginTop: height(1),
          width: "90%",
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          
        }}>

         
     
        <View style={{
          height: 50,
          width: 50,
          marginRight: width(4),
          marginLeft: width(2),
          alignItems: 'center',
          justifyContent: 'center',

           // marginLeft: width(2),
          }}> 
             <FontAwesome name='percent'
             style={{
                fontSize: size(18),
                color: CurrentViewMode.Mode_fontColor,
                marginTop: height(1),
                marginLeft: width(-6)
             }} />
             </View>


            <Text style={{
       
                fontSize: size(15),
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: "bold",
            }}>
            {t("SinceBroughtHeader")}   
         
            </Text>


            {
              MetricsState == "Since brought percentage"

              ?

              <MaterialIcons name='check' style={{
                color: CurrentViewMode.Mode_fontColor,
                position: 'absolute',
                right: width(5),
                fontSize: size(25),
              }} />

              :


              null

            }
        </TouchableOpacity>





        <TouchableOpacity onPress={() => {
          	SheetManager.hide('SortMetricsSinceBuy_Sheet');
            setMetricsState("Daily trend dollar")
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
        }}
        style={{
          marginTop: height(1),
          width: "90%",
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
   
   
   
      <View style={{
          height: 50,
          width: 50,
          marginRight: width(4),
          marginLeft: width(-2),
          alignItems: 'center',
          justifyContent: 'center',
          }}> 
          
          <FontAwesome name='dollar'
               style={{
                fontSize: size(20),
                  color: CurrentViewMode.Mode_fontColor,
                  marginLeft: width(1.5)
                  
               }} />
            </View>

            <Text style={{
                marginLeft: width(4),
                fontSize: size(15),
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: "bold",
            }}>
              {t("DailyTrendHeader")}    
            </Text>



            {
              MetricsState == "Daily trend dollar"

              ?

              <MaterialIcons name='check' style={{
                color: CurrentViewMode.Mode_fontColor,
                position: 'absolute',
                right: width(5),
                fontSize: size(25),
              }} />

              :


              null

            }
        </TouchableOpacity>







        <TouchableOpacity onPress={() => {
          	SheetManager.hide('SortMetricsSinceBuy_Sheet');
            setMetricsState("Daily trend percentage")
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
          
        }}
        style={{
        //  marginTop: height(1),
          width: "90%",
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: height(1),
        }}>

         
        <View style={{
          height: 50,
          width: 50,
          marginRight: width(4),
          marginLeft: width(2),
          alignItems: 'center',
          justifyContent: 'center',

           // marginLeft: width(2),
          }}> 
            <FontAwesome name='percent'
             style={{
                fontSize: size(18),
                color: CurrentViewMode.Mode_fontColor,
                marginTop: height(1),
                marginLeft: width(-6)
             }} />
             </View>


            <Text style={{
      
                fontSize: size(15),
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: "bold",
            }}>
           {t("DailyTrendHeader")}    
            </Text>



            {
              MetricsState == "Daily trend percentage"

              ?

              <MaterialIcons name='check' style={{
                color: CurrentViewMode.Mode_fontColor,
                position: 'absolute',
                right: width(5),
                fontSize: size(25),
              }} />

              :


              null

            }
        </TouchableOpacity>

    </View>
    </ActionSheet>

   
   
    );
  };
  









































const Home = () => {


  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


const analytics = getAnalytics(); // ✅ nicht analytics()

  
  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const {
    ShowHomeChart, setShowHomeChart,
    MetricsState, setMetricsState,
  } = useContext(HomeChartContext)


  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();



  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG', // Use your actual API key
    },
  }


  


  const { SearchIndex2 } = useContext(Search2Context);
  const {CoinPageIndex, setCoinPageIndex, CurrentBackgroundColorForCoin } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);

  const { 
    currentPrice, 
    setCurrentPrice, 
    currentDate, 
    setCurrentDate, 
    percentageChange, 
    setPercentageChange, 
    dollarChange, 
    setDollarChange,
    priceChangeColor, 
    setPriceChangeColor, 
    percentageChangeColor, setPercentageChangeColor,
    dollarChangeColor, setDollarChangeColor,
  } = useContext(HomeChartContext);

  const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);

  const {IFollowingsCoinsIndex, setIFollowingsCoinsIndex } = useContext(IFollowingsCoinsContext);

  const [ChangeGrowthChangePortfolio, setChangeGrowthChangePortfolio] = useState(!true)

  // hooks
  const sheetRefOpenFollowingsBottomSheet = useRef(null);

  // variables
  const snapPointsFollowingsBottomSheet = useMemo(() => ["100%"], []);

 
 



    
    

  






  const [userLang, setUserLang] = useState();
  const [user, setUser] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // State to track the transition
  const [wallets, setWallets] = useState([]);
  const memoizedWallets = useMemo(() => wallets, [wallets]);
  const [OpenFollowingCoinList, setOpenFollowingCoinList] = useState(true); // State to track the transition

  const [isOpen, setIsOpen] = useState(true);
  const [listHeight, setListHeight] = useState(0); // Track list height

  const [alpacaPositions, setAlpacaPositions] = useState([]);
  const [coingeckoData, setCoingeckoData] = useState([]);
  
  const [hasBuys, setHasBuys] = useState(false);
  const [hasSells, setHasSells] = useState(false);


  const [coinIds, setCoinIds] = useState([]);
  const [AlpacaSymbols, setAlpacaSymbols] = useState([])
  const [coins, setCoins] = useState([]);
  const [MyInvestments, setMyInvestments] = useState([])
  const [MyStocksInvestments, setMyStocksInvestments] = useState([])
  const [loading, setLoading] = useState(true);
  const [AlpacaUserId, setAlpacaUserId] = useState(null);

  const [tLoaded, setLoaded] = useState(false)


  const [Depot_number, setDepot_number] = useState("")

  
  const [Sum, setSum] = useState()

  const [equity, setEquity] = useState(null);
  const [error, setError] = useState(null);
  const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")






  const optionsAlpaca = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
    }
  };

  








  useFocusEffect(
    useCallback(() => {
      posthog.capture('screen_viewed', {
        screen: 'Home',
        timestamp: new Date().toISOString(),
      });
    }, [posthog])
  );




  useEffect(() => {


    
    setLoaded(true);




    

    const fetchUserData = async () => {
      try {

        const user = getAuth().currentUser;
        if (user) {
          const userDocument = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();


    
          if (userDocument.exists) {
            setAlpacaUserId(userDocument.data().AlpacaAccountId);
    


const analytics = getAnalytics();
await setUserId(analytics, user.uid);
await setUserProperties(analytics, {
  email: userDocument.data().Email,
}).then((res) => {

  console.log("Analytics ", res)
})



            firestore()
              .collection('users')
              .doc(user.uid)
              .collection('Transaction_Activities')
              .onSnapshot(async (snapshot) => {
                const activities = snapshot.docs.map(doc => doc.data());
                if (!Array.isArray(activities) || activities.length === 0) return;
    
                const validActivities = activities.filter(item => item.symbol && item.qty);
                const assetQty = validActivities.reduce((acc, item) => {
                  const symbol = item.symbol;
                  const qty = parseFloat(item.qty);
                  if (symbol && qty) {
                    acc[symbol] = (acc[symbol] || 0) + qty;
                  }
                  return acc;
                }, {});
    
                const response = await fetch(
                  `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userDocument.data().AlpacaAccountId}/positions`,
                  optionsAlpaca
                );
                const Alpaca = await response.json();
    
                if (Array.isArray(Alpaca) && Alpaca.length > 0) {
                  let allMarketData = [];
    
                  // ✅ Filter for crypto only
                  const cryptoAssets = Alpaca.filter(item => item.asset_class === "crypto");
    
                  for (let i = 0; i < cryptoAssets.length; i++) {
                    const AlpacaData = cryptoAssets[i];
                    const symbol = AlpacaData.symbol.split('/')[0].slice(0, 3);
    
                    await fetch(
                      `https://pro-api.coingecko.com/api/v3/search?query=${symbol}`,
                      {
                        method: 'GET',
                        headers: {
                          accept: 'application/json',
                          'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                        },
                      }
                    )
                      .then(async (res) => {
                        const data = await res.json();
                        if (data && data.coins && data.coins.length > 0) {
                          const coinId = data.coins[0].id;
                          const marketDataRes = await fetch(
                            `https://pro-api.coingecko.com/api/v3/coins/${coinId}`,
                            options
                          );
                          const marketDataResJson = await marketDataRes.json();
    
                          const currentPricehere = marketDataResJson.market_data.current_price.usd;
                          const fullSymbol = `${symbol}USD`;
                          const qty = parseFloat(AlpacaData.qty) || 0;
    
                          const previousPrice = marketDataResJson.market_data.price_change_percentage_24h
                            ? currentPricehere / (1 + marketDataResJson.market_data.price_change_percentage_24h / 100)
                            : currentPricehere;
    
                          const marketValue = currentPricehere * qty;
                          const marketValueBefore = previousPrice * qty;
                          const priceChangeInDollars = marketValue - marketValueBefore;
    
                          const avgEntryPrice = parseFloat(AlpacaData.avg_entry_price);
                          const sinceBroughtInDollars = (currentPricehere - avgEntryPrice) * qty;
                          const sinceBroughtInPercentage = ((currentPricehere - avgEntryPrice) / avgEntryPrice) * 100;
    
                          const lastDayPrice = parseFloat(AlpacaData.lastday_price || currentPricehere);
                          const dailyChangeInDollars = (currentPricehere - lastDayPrice) * qty;
                          const dailyChangePercentage = ((currentPricehere - lastDayPrice) / lastDayPrice) * 100;
    
                          allMarketData.push({
                            id: coinId,
                            name: marketDataResJson.name,
                            symbol: marketDataResJson.symbol,
                            market_cap: marketDataResJson.market_data.market_cap.usd,
                            current_price: currentPricehere,
                            price_change_percentage_24h: marketDataResJson.market_data.price_change_percentage_24h,
                            price_change_in_dollars: priceChangeInDollars,
                            image: marketDataResJson.image.large,
                            qty: qty,
                            market_value: marketValue,
                            daily_change_percentage: marketDataResJson.market_data.price_change_percentage_24h,
                            daily_change_in_dollars: dailyChangeInDollars,
                            since_brought_in_dollars: sinceBroughtInDollars,
                            since_brought_in_percentage: sinceBroughtInPercentage
                          });
                        }
                      })
                      .catch((error) => {
                        console.error('Error fetching CoinGecko data for', symbol, error);
                      });
                  }
    
                  let filteredData = allMarketData;
                  if (MetricsState === "Since brought dollar") {
                    filteredData = allMarketData.sort((a, b) => b.since_brought_in_dollars - a.since_brought_in_dollars);
                  } else if (MetricsState === "Since brought percentage") {
                    filteredData = allMarketData.sort((a, b) => b.since_brought_in_percentage - a.since_brought_in_percentage);
                  } else if (MetricsState === "Daily trend dollar") {
                    filteredData = allMarketData.sort((a, b) => b.daily_change_in_dollars - a.daily_change_in_dollars);
                  } else if (MetricsState === "Daily trend percentage") {
                    filteredData = allMarketData.sort((a, b) => b.daily_change_percentage - a.daily_change_percentage);
                  }
    
                  setLoaded(false);
                  setMyInvestments(filteredData);
                }
              });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
    

     const polygonApiKey = "O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm"






     
     const fetchUserDataStocks = async () => {
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
    
            // ✅ Filter for "us_equity" only
            const usEquities = alpacaAssets.filter(asset => asset.asset_class === 'us_equity');
    
            let allMarketData = [];
    
            for (let i = 0; i < usEquities.length; i++) {
              const asset = usEquities[i];
              const fullSymbol = asset.symbol;
              const shortSymbol = fullSymbol.split('/')[0];
              const qty = parseFloat(asset.qty) || 0;
              const avgEntryPrice = parseFloat(asset.avg_entry_price);
              const lastDayPrice = parseFloat(asset.lastday_price || 0);
    
              try {
                // Polygon Reference Info
                const polygonInfoRes = await fetch(
                  `https://api.polygon.io/v3/reference/tickers/${shortSymbol}?apiKey=${polygonApiKey}`
                );
                const polygonInfoJson = await polygonInfoRes.json();
                const polygonInfo = polygonInfoJson.results;
    
                // Polygon Snapshot
                const polygonSnapRes = await fetch(
                  `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${shortSymbol}?apiKey=${polygonApiKey}`
                );
                const polygonSnapJson = await polygonSnapRes.json();
                const snap = polygonSnapJson?.ticker;
    
                // CoinGecko (optional for extra price/market cap if needed)
                const geckoSearchRes = await fetch(
                  `https://pro-api.coingecko.com/api/v3/search?query=${shortSymbol}`,
                  {
                    method: 'GET',
                    headers: {
                      accept: 'application/json',
                      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                    },
                  }
                );
                const searchData = await geckoSearchRes.json();
                const coinId = searchData?.coins?.[0]?.id;
                if (!coinId) continue;
    
                const marketDataRes = await fetch(
                  `https://pro-api.coingecko.com/api/v3/coins/${coinId}`,
                  options
                );
                const marketData = await marketDataRes.json();
                const currentPrice = parseFloat(asset.current_price);
    
                // Metrics
               
    
    
                  const previousPrice = lastDayPrice; // from Alpaca
                  const marketValueBefore = previousPrice * qty;
                  const priceChangeInDollars = marketValue - marketValueBefore;
                

                    // Fallback in case snapshot missing
                    const dailyChangeInDollars = snap?.todaysChange ?? 0;
                    const dailyChangePercentage = snap?.todaysChangePerc ?? 0;

                    const marketValue = currentPrice * qty;
                    const sinceBroughtInDollars = (currentPrice - avgEntryPrice) * qty;
                    const sinceBroughtInPercentage = ((currentPrice - avgEntryPrice) / avgEntryPrice) * 100;

    
                allMarketData.push({
                  id: shortSymbol.toLowerCase(),
                  name: polygonInfo?.name,
                  symbol: shortSymbol,
                  asset_class: asset.asset_class,
                  qty,
                  avg_entry_price: avgEntryPrice,
                  current_price: currentPrice,
                  market_value: marketValue,
                  market_cap: polygonInfo?.market_cap, // optional, not always available
                  price_change_percentage_24h: dailyChangePercentage,
                  price_change_in_dollars: dailyChangeInDollars,
                  daily_change_percentage: dailyChangePercentage,
                  daily_change_in_dollars: dailyChangeInDollars,
                  since_brought_in_dollars: sinceBroughtInDollars,
                  since_brought_in_percentage: sinceBroughtInPercentage,

                  // Polygon Snapshot fields
                  polygon_day_open: snap?.day?.o,
                  polygon_day_high: snap?.day?.h,
                  polygon_day_low: snap?.day?.l,
                  polygon_day_close: snap?.day?.c,
                  polygon_volume: snap?.day?.v,

                  // Polygon Reference Info
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
    
            // Optional Sorting
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
            setMyStocksInvestments(sorted);
          });
      } catch (error) {
        console.error('❌ Error fetching stock data:', error);
      }
    };
    
      
    
      fetchUserDataStocks();


      // Set interval for fetching prices every 10 seconds
      const intervalId = setInterval(() => {
        fetchUserData();
        fetchUserDataStocks()
      }, 60000); // 10000 ms = 10 seconds
    
      // Cleanup function to clear the interval when the component unmounts or dependencies change
      return () => clearInterval(intervalId);
      


    }, [AlpacaUserId, MetricsState]); // Runs when MetricsState changes
  
  
        
    











  


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const userDocument = await firestore()
            .collection('users')
            .doc(user.uid) // Reference to the 'users' collection
            .get();
  
          if (userDocument.exists) {
            setAlpacaUserId(userDocument.data().AlpacaAccountId);
          //  console.log("AlpacaAccountId: ", userDocument.data().AlpacaAccountId);

          } else {
         //   console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    
    fetchUserData();
  }, []);  // Empty array ensures effect runs only once on component mount
  



  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  

  
  
  
  


  



  useEffect(() => {


      const checkIfSellsOrBuysExist = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
            }
        };

        try {
            const response = await fetch(
                `https://broker-api.sandbox.alpaca.markets/v1/accounts/activities?account_id=${AlpacaUserId}&activity_types=FILL&page_size=100`,
                options
            );
            const result = await response.json();

            if (result.length > 0) {
                // ✅ Check if any transactions are "buy" or "sell"
                setHasBuys(result.some((item) => item.side === "buy"));
                setHasSells(result.some((item) => item.side === "sell"));

                console.log("Has Buys:", result.some((item) => item.side === "buy"));
                console.log("Has Sells:", result.some((item) => item.side === "sell"));
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };



    checkIfSellsOrBuysExist()

  }, [AlpacaUserId])







{/*

  const walletsRef = useRef([]);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;
  
    const userWalletsRef = firestore()
      .collection("users")
      .doc("J3rGaJIXqlabhWX94LFz")
      .collection("wallets")
      .doc("List");
  
    const unsubscribe = userWalletsRef.onSnapshot((doc) => {
      if (doc.exists) {
        const walletData = doc.data()?.wallets;
  
        if (walletData) {
          const walletList = Object.entries(walletData).map(([key, value]) => ({
            id: key,  // BinanceSmartChain, Bitcoin, Ethereum, Polygon
            ...value, // Include address, privateKey, etc.
          }));
  
        //  console.log("🔥 Wallets from Firestore: ", walletList); // ✅ Debugging
  
          if (JSON.stringify(walletsRef.current) !== JSON.stringify(walletList)) {

            walletsRef.current = walletList;
            setWallets(walletList);
          }
        } else {
          console.log("⚠️ No wallet data found.");
        }
      } else {
        console.log("⚠️ Wallet document does not exist.");
      }
    });
  
    return () => unsubscribe();
  }, []);
  
*/}





/*

useEffect(() => {

  const user = getAuth().currentUser;

  const firestoreInstance = getFirestore();

  if (!user) return;

  // Correct reference to the subcollection
  const coinsCollectionRef = collection(firestoreInstance, "users", user.uid, "CoinsIFollow");

  const unsubscribe = onSnapshot(coinsCollectionRef, (snapshot) => {
    if (!snapshot || snapshot.empty) {
      console.log("No documents found in CoinsIFollow collection.");
      setCoinIds([]); // Reset to empty if no data exists
      return;
    }

    const ids = snapshot.docs.map((doc) => doc.data().id);
  //  console.log("Real-time Coin IDs from Firestore:", ids);
    setCoinIds(ids);
  }, (error) => {
    console.error("Error fetching Firestore snapshot:", error);
  });

  return () => unsubscribe(); // Clean up on unmount
}, [user]);
*/


useEffect(() => {
  const user = getAuth().currentUser;
  if (!user) return;

  let intervalId;

  const fetchFavoriteAssets = async () => {
    setLoading(true);

    try {
      const userDocRef = firestore().collection('users').doc(user.uid).collection('CoinsIFollow');
      const userDocuments = await userDocRef.get();

      if (!userDocuments.empty) {
        const updatedAssets = { stocks: [], crypto: [] };

        const fetchTasks = userDocuments.docs.map(async (doc) => {
          const asset = doc.data();
          const { id, symbol, class: assetClass, name, category} = asset;

          if (assetClass === 'us_equity') {
            try {
              const polygonInfoRes = await fetch(
                `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`
              );
              const polygonInfoJson = await polygonInfoRes.json();

              const snap = polygonInfoJson?.ticker;
              const isMarketClosed =
                (snap?.day?.c === 0 || snap?.day?.c === undefined) &&
                (snap?.lastTrade?.p === 0 || snap?.lastTrade?.p === undefined);

              const price = isMarketClosed
                ? snap?.prevDay?.c || 0
                : snap?.lastTrade?.p || snap?.day?.c || snap?.prevDay?.c || 0;

              const price_change_percentage_24h = snap?.todaysChangePerc || 0;

              updatedAssets.stocks.push({
                name: name || symbol,
                symbol: symbol,
                price: price,
                category:category,
                price_change_percentage_24h: price_change_percentage_24h,
                image: `https://assets.parqet.com/logos/symbol/${symbol}?format=png&size=100`,
                type: 'stock'
              });
            } catch (err) {
              console.error(`Error fetching stock data for ${symbol}:`, err);
            }
          }

          if (assetClass === 'crypto') {
            try {
              const response = await fetch(
                `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&per_page=1`,
                {
                  headers: {
                    'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG'
                  }
                }
              );
              const data = await response.json();

              if (data.length > 0) {
                const coin = data[0];
                updatedAssets.crypto.push({
                  name: name || coin.name,
                  symbol: coin.symbol,
                  category: coin.category,
                  price: coin.current_price.toFixed(2),
                  price_change_percentage_24h: coin.price_change_percentage_24h?.toFixed(2),
                  image: coin.image || '',
                  type: 'crypto'
                });
              }
            } catch (error) {
              console.error(`Error fetching crypto data for ${symbol}:`, error);
            }
          }
        });

        await Promise.all(fetchTasks);

        // Set the combined coin data
        setCoins([...updatedAssets.stocks, ...updatedAssets.crypto]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorite assets:', error);
      setLoading(false);
    }
  };

  // Initial fetch
  fetchFavoriteAssets();

  // Firestore real-time listener for followed assets
  const unsubscribe = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('CoinsIFollow')
    .onSnapshot(() => {
      fetchFavoriteAssets(); // Re-fetch when asset list changes
    });

  // Poll for price updates every 15 seconds
  intervalId = setInterval(() => {
    fetchFavoriteAssets();
  }, 15000);

  // Cleanup
  return () => {
    unsubscribe();
    clearInterval(intervalId);
  };
}, [AlpacaUserId]);









useEffect(() => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  setUser(currentUser.uid);

  // Get current selected language
  const getLangofUser = async () => {
    if (user) {
      const userLangRef = ref(database, `/users/${user}/Currentlanguage`);
      const snapshot = await get(userLangRef);
      const lang = snapshot.val()?.lang;
      setUserLang(lang || "en"); // Fallback to English if not found
    }
  };

  if (user) {
    getLangofUser();
  }

  // Check current language
  if (userLang && userLang !== i18n.language) {
    i18n.changeLanguage(userLang);
  }
}, [AlpacaUserId, user, userLang]);










const formatPercentage = (percentage) => {
  return new Intl.NumberFormat('de-DE', { style: 'percent', minimumFractionDigits: 2 }).format(percentage / 100);
};

  
















    

  


    




  const formatMoneyMyInvestmnt = useCallback((price) => {
    return new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }, []);
  
// Function to get and format the quantity (qty) for display
const getQuantity = (qty) => {
  return qty !== undefined && qty !== null ? qty.toFixed(4) : 0;
};







  // Render List of Alpaca positions with Coingecko data
  const MyStocksInvestmentsrenderItem = ({ item }) => {
    let changeValue, changeSymbol = '', displayValue = '';
  
    if (MetricsState === "Daily trend dollar") {
      changeValue = item.daily_change_in_dollars;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = formatMoneyMyInvestmnt(changeValue);
    } else if (MetricsState === "Daily trend percentage") {
      changeValue = item.daily_change_percentage;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = `${changeValue.toFixed(2)}%`;
    } else if (MetricsState === "Since brought dollar") {
      changeValue = item.since_brought_in_dollars;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = formatMoneyMyInvestmnt(changeValue);
    } else if (MetricsState === "Since brought percentage") {
      changeValue = item.since_brought_in_percentage;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = `${changeValue.toFixed(2)}%`;
    }
  
    return (
      <TouchableOpacity
        onPress={() => {

        
          posthog.capture('open_stock_bottomsheet', {
            screen: 'Home',
            $screen_name: 'Home '+" / "+item.name,
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
  

        }}
        style={{
          height: height(8),
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: width(5),
        }}
      >
        {/* Logo */}
    


        {
    item.category == "derivatives" ||   item.category == "ETFs" ||  item.category == "bonds"

    ?

    <View
    style={{
    height: size(25),
    width: size(25),
    backgroundColor: CurrentViewMode.Mode_fontColor,
   // marginLeft: width(5),
    borderRadius: size(7),
    overflow: 'hidden',
    }}
  >
 
<Text style={{
fontSize: size(6),
fontWeight: "900",
marginLeft: width(1),
marginTop: height(0.2),
color: CurrentViewMode.Mode_bg,
}}>
{item.ticker}
</Text>
  </View>

  :



 <View
      style={{
        height: size(23),
        width: size(23),
    //  backgroundColor: '#fff',
     // marginLeft: width(5),
      borderRadius: size(23) / 2,
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

}
  

  
        <View style={{ width: '90%', justifyContent: 'center', marginLeft: width(5) }}>
          {/* Name & Asset Class */}
          <View style={{  flexDirection: 'row', alignItems: 'center' }}>
            <Text numberOfLines={1} 
              style={{
                fontSize: size(16),
                width: width(50),
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: 'bold',
                marginRight: width(2),
              }}
            >
              {item.name}
            </Text>

          
          
          </View>
  
          {/* Change Value */}
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontSize: size(15),
                right: width(5),
                position: 'absolute',
                color: changeValue >= 0 ? '#00CE39' : '#FF1B1E',
                fontWeight: '900',
              }}
            >
              {changeSymbol} {displayValue}
            </Text>
          </View>
  
          {/* Market Value */}
          <Text
            style={{
              fontSize: size(14),
              color: CurrentViewMode.Mode_Sec_fontColor,
              fontWeight: 'bold',
            }}
          >
            {formatMoneyMyInvestmnt(item.market_value)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  













    // Render List of Alpaca positions with Coingecko data
    const MyCryptoInvestmentsrenderItem = ({ item }) => {
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

            posthog.capture('open_coin_bottomsheet', {
              screen: 'Home',
              $screen_name: 'Home '+" / "+item.name,
              timestamp: new Date().toISOString(),
          
              });
        
              
            // Handle item press if needed
            setCoinPageIndex(0);
            SheetManager.show('CoinPage_Sheet',  {
              payload: { value: item.symbol }, // Passing dynamic data (payload)
            });
            setCurrentCoinSelected(item);
          }}
          style={{
            height: height(8),
            flexDirection: 'row',
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
    
          <View style={{ width: '90%', marginLeft: width(5) }}>
            {/* Display Coin Name */}
            <Text numberOfLines={1} style={{width: width(55), fontSize: size(16), color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold' }}>
              {item.name}
            </Text>
    
            <View style={{ flexDirection: 'row' }}>
              {/* Display Price Change */}
              <Text
                style={{
                  fontSize: size(15),
                  right: width(5),
                  position: 'absolute',
                  color: changeValue >= 0 ? '#00CE39' : '#FF1B1E', // Green for positive, red for negative
                  fontWeight: '900',
                }}
              >
                {changeSymbol} {displayValue}
              </Text>
            </View>
    
            {/* Display Quantity and Market Value */}
            <Text style={{ fontSize: size(14),  color: CurrentViewMode.Mode_Sec_fontColor, fontWeight: 'bold' }}>
              {formatMoneyMyInvestmnt(item.market_value)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    





  // Followed Coin 

  const renderItem = ({ item }) => (


    <TouchableOpacity onPress={() => {


      console.log(item)

    if(item.type == "stock") {
      posthog.capture('open_stock_bottomsheet', {
        screen: 'Home',
        $screen_name: 'Home '+" / "+item.name,
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
  


     
    } else if(item.type == "crypto") {
      posthog.capture('open_coin_bottomsheet', {
        screen: 'Home',
        $screen_name: 'Home '+" / "+item.name,
        timestamp: new Date().toISOString(),
    
        });
      setCoinPageIndex(0);
      SheetManager.show('CoinPage_Sheet',  {
        payload: { value: item.symbol }, // Passing dynamic data (payload)
      });
      setCurrentCoinSelected({
        image: item.image,
        name: item.name,
        price: "",
        price_change_percentage_24h: "",
        symbol: item.symbol.toUpperCase(),
        id: item.name.toLowerCase(),
        type: "crypto"
      });
      
    } 


    }}
    style={{ 
      height: height(8),
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: width(5),
     
     }}>


{
    item.category == "derivatives" ||   item.category == "ETFs"

    ?

    <View
    style={{
    height: size(25),
    width: size(25),
    backgroundColor: CurrentViewMode.Mode_fontColor,
   // marginLeft: width(5),
    borderRadius: size(7),
    overflow: 'hidden',
    }}
  >
 
<Text style={{
fontSize: size(6),
fontWeight: "900",
marginLeft: width(1),
marginTop: height(0.2),
color: CurrentViewMode.Mode_bg,
}}>
{item.symbol}
</Text>
  </View>

  :



 <View
      style={{
        height: size(23),
        width: size(23),
    //  backgroundColor: '#fff',
     // marginLeft: width(5),
      borderRadius: size(23) / 2,
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

}
     <View  style={{
      width: "90%",
      marginLeft: width(5),
     }}> 
      <Text numberOfLines={1} style={{fontSize: size(16), width: width(55), color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold' }}>
        {item.name}
      </Text>

      <View style={{
        flexDirection: 'row',
      }}>
      
      <Text style={{ 
      fontSize: size(15), 
      right: width(5), 
      position: 'absolute', 
     
      color: item.price_change_percentage_24h >= 0 ? '#00CE39' : '#FF1B1E', 
      fontWeight: '900' 
    }}>
      {item.price_change_percentage_24h >= 0 ? '▲ ' : '▼ '} {parseFloat(item.price_change_percentage_24h).toFixed(2)} %
    </Text>

      </View>
      <Text style={{ fontSize: size(14), marginTop: height(0.5), color: CurrentViewMode.Mode_Sec_fontColor, fontWeight: 'bold' }}>
       {formatMoneyMyInvestmnt(item.price)}
      </Text>
      </View>



    </TouchableOpacity>
  );

  


  




  const toggleOpen = () => {
    setIsOpen(value => !value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }







  const [animateToNumber, setAnimateToNumber] = React.useState(7979);

  const increase = () => {
    setAnimateToNumber(animateToNumber + 1999);
  };
  

  return (



  

<>


   






      <View style={{
      //  opacity: CoinPageIndex === 0 || SearchIndex2 === 0 ? 0.1 : 1,
        backgroundColor: CurrentViewMode.Mode_bg_Home,
        height: "100%",
        width: "100%"
      }}>



        

        <ScrollView style={{
         //  opacity: CoinPageIndex === 0 || SearchIndex2 === 0 ? 0.1 : 1,
           backgroundColor: CurrentViewMode.Mode_bg_Home,

        }} 
        
        
        contentContainerStyle={{ paddingBottom: height(20) }}>


          
          <View style={{ height: "auto", width: width(100) }}>
            <Text style={{ fontSize: size(15), marginTop: size(20), marginLeft: width(5), color: CurrentViewMode.Mode_Sec_fontColor, fontWeight: "bold" }}>
              {t("InTotal")}
            </Text>

            <View style={{ flexDirection: 'row', marginLeft: width(5),  marginTop: height(2), alignItems: 'center' }}>
         


          {
             SearchIndex == -1 
            ?


            <RollingNumber
            currency="€"
            locale="de-DE"
            style={{
              fontSize: size(28),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "bold",
              textAlign: "center",
            }}
          />
             
          :

          null

          }
           
      

                {
  ChangeGrowthChangePortfolio === true
    ? (
      <TouchableOpacity onPress={() => {
        console.log("dollarChange ", formatPrice(dollarChange));
        setChangeGrowthChangePortfolio(!ChangeGrowthChangePortfolio);
      }}>
        <Text
          style={{
            fontSize: size(16),
            marginLeft: width(3),
            marginTop: height(1),
            color: priceChangeColor, // Use the dollarChangeColor
            fontWeight: "bold",
          }}
        >
          {/* Use condition to show red arrow for negative or green for positive */}
          {percentageChange < 0 ? '▼' : '▲'} 
          {/* If dollarChange is present, format it, otherwise display 0.00 */}
          {dollarChange ? formatPrice(dollarChange) : "0.00"}
        </Text>
      </TouchableOpacity>
    )
    : (
      <TouchableOpacity onPress={() => {
        console.log("percentageChange ", formatPercentage(percentageChange));
        setChangeGrowthChangePortfolio(!ChangeGrowthChangePortfolio);
      }}>
        <Text
          style={{
            fontSize: size(16),
            marginLeft: width(3),
            marginTop: height(1),
            color: priceChangeColor, // Use the percentageChangeColor
            fontWeight: "bold",
          }}
        >
          {/* Show red or green arrow based on the percentage change */}
          {percentageChange < 0 ? '▼' : '▲'}
          {/* Show percentage change with 2 decimal points, fallback to 0.00 */}
          {percentageChange ? formatPercentage(percentageChange) : "0.00"} 
        </Text>
      </TouchableOpacity>
    )
}




        </View>
        </View>






{/*
        <View style={{
                   height: height(25),
                  width: "100%",
            
                }}>

<FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          marginLeft: width(5),
          marginTop: height(3),
        }}
        data={memoizedWallets}  // Using memoized wallets data
        keyExtractor={item => item.id}  // Ensure the key is unique and consistent
        initialNumToRender={5}  // Render 5 items initially
        maxToRenderPerBatch={10}  // Limit how many items to render in each batch
        windowSize={5}  // Render items just outside of the visible area
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: "#1E1E1F",
            height: height(22),
            width: width(40),
            marginRight: width(5),
            borderRadius: 10,
          }}>
            <Text style={{
              fontSize: size(20),
              color: '#fff',
              width: "65%",
              fontWeight: "bold",
              marginTop: height(2),
              marginLeft: width(4)
            }}>
              {item.id}
            </Text>
  
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: width(5),
              marginTop: height(6),
            }}>
              <FontAwesome name='bank' style={{
                color: "#1D51FF",
                marginRight: width(1),
              }} />
              <Text style={{
                color: "#1D51FF"
              }}>
                - 324dsa
              </Text>
            </View>
  
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: width(5),
              marginTop: height(2),
            }}>
              <Text style={{
                color: "#fff",
                marginLeft: width(0),
                fontSize: size(20),
                fontWeight: "bold",
              }}>
                1.200,20 $
              </Text>
            </View>
          </View>
        )}
      />
            

            
                </View>


*/}


   
   




          <View style={{
            width: width(98),
       
          }}> 

        {
          SearchIndex == -1 

          ?
          <HomeChart />

          :

          null
        }

             
                    

          </View>








          <View style={{
            flexDirection: 'row',
            marginBottom: height(3),
            marginTop: height(5), 
            alignItems: 'center',
          }}>

          <Text style={{ 
             fontSize: size(16), 
              color: CurrentViewMode.Mode_fontColor,
             marginLeft: width(5), 
             fontWeight: "bold" ,
          }}>
             {t("MyInvestmentsHeader")}   
          </Text>


          {
          MetricsState == "Since brought dollar"


          ?


          <TouchableOpacity onPress={() => {

            posthog.capture('open_sort_metrics_since_buy_bottomsheet', {
              screen: 'Home',
              $screen_name: 'Home',
              timestamp: new Date().toISOString(),
              
            });
            SheetManager.show("SortMetricsSinceBuy_Sheet")
          }} style={{
            flexDirection: 'row',
            position: 'absolute',
            right: 20,
            alignItems: 'center',

          }}> 
          <Text style={{
            fontSize: size(16), 
            fontWeight: "bold" ,
            color: CurrentViewMode.Mode_Sec_fontColor
          }}>
          {t("SinceBroughtHeader")}   
          </Text>

          <FontAwesome5 name='dollar-sign' style={{
               color: CurrentViewMode.Mode_Sec_fontColor,
               marginLeft: width(2),
               fontSize: size(14),
               marginRight: width(1),
             }} />

          <MaterialIcons name='keyboard-arrow-down' style={{
            color: CurrentViewMode.Mode_Sec_fontColor,
            fontSize: size(30)
          }} />

          </TouchableOpacity>



          :


          null
          
          }












{
          MetricsState == "Since brought percentage"


          ?


          <TouchableOpacity onPress={() => {
            posthog.capture('open_sort_metrics_since_buy_bottomsheet', {
              screen: 'Home',
              $screen_name: 'Home',
              timestamp: new Date().toISOString(),
              
            });
            SheetManager.show("SortMetricsSinceBuy_Sheet")
          }} style={{
            flexDirection: 'row',
            position: 'absolute',
            right: 20,
            alignItems: 'center',

          }}> 
          <Text style={{
            fontSize: size(16), 
            fontWeight: "bold" ,
            color: CurrentViewMode.Mode_Sec_fontColor
          }}>
          {t("SinceBroughtHeader")}   
          </Text>

          <FontAwesome5 name='percentage'
             style={{
              color:CurrentViewMode.Mode_Sec_fontColor,
              marginLeft: width(2),
              fontSize: size(16),
              marginRight: width(1),
             }} />

          <MaterialIcons name='keyboard-arrow-down' style={{
      
            color: CurrentViewMode.Mode_Sec_fontColor,
            fontSize: size(30)
          }} />

          </TouchableOpacity>



          :


          null
          
          }

         















{
          MetricsState == "Daily trend dollar"


          ?


          <TouchableOpacity onPress={() => {

            posthog.capture('open_sort_metrics_since_buy_bottomsheet', {
              screen: 'Home',
              $screen_name: 'Home',
              timestamp: new Date().toISOString(),
              
            });
            SheetManager.show("SortMetricsSinceBuy_Sheet")
          }} style={{
            flexDirection: 'row',
            position: 'absolute',
            right: 20,
            alignItems: 'center',

          }}> 
          <Text style={{
            fontSize: size(16), 
            fontWeight: "bold" ,
            color: CurrentViewMode.Mode_Sec_fontColor,
          }}>
         {t("DailyTrendHeader")}    
          </Text>

          <FontAwesome5 name='dollar-sign' style={{
               color: CurrentViewMode.Mode_Sec_fontColor,
               marginLeft: width(2),
               fontSize: size(14),
               marginRight: width(1),
             }} />

          <MaterialIcons name='keyboard-arrow-down' style={{
            color: CurrentViewMode.Mode_Sec_fontColor,
            fontSize: size(30)
          }} />

          </TouchableOpacity>



          :


          null
          
          }


















{
          MetricsState == "Daily trend percentage"


          ?


          <TouchableOpacity onPress={() => {

            posthog.capture('open_sort_metrics_since_buy_bottomsheet', {
              screen: 'Home',
              $screen_name: 'Home',
              timestamp: new Date().toISOString(),
              
            });
            SheetManager.show("SortMetricsSinceBuy_Sheet")
          }} style={{
            flexDirection: 'row',
            position: 'absolute',
            right: 20,
            alignItems: 'center',

          }}> 
          <Text style={{
            fontSize: size(16), 
            fontWeight: "bold" ,
            color: CurrentViewMode.Mode_Sec_fontColor
          }}>
         {t("DailyTrendHeader")}    
          </Text>

          <FontAwesome5 name='percentage'
             style={{
              color: CurrentViewMode.Mode_Sec_fontColor,
              marginLeft: width(2),
              fontSize: size(16),
              marginRight: width(1),
             }} />

          <MaterialIcons name='keyboard-arrow-down' style={{
            color: CurrentViewMode.Mode_Sec_fontColor,
            fontSize: size(30)
          }} />

          </TouchableOpacity>



          :


          null
          
          }





          </View>





        {
          MyInvestments == "" || MyInvestments == null

          ?

          <Text style={{
            fontSize: size(14),
            alignSelf: 'center',
            marginTop: height(2),
            marginBottom: height(2),
            width: "80%",
            textAlign: 'center',
            color: CurrentViewMode.Mode_Third_fontColor
          }}>
           {t("SobaldToAnfängstZuInvestieren")}
  
          </Text>

          :

        <> 

        <Text style={{
          color: CurrentViewMode.Mode_Third_fontColor,
          marginLeft: width(5),

        }}>
          Stocks
        </Text>
        <FlatList
        data={MyStocksInvestments}
        renderItem={MyStocksInvestmentsrenderItem}
        keyExtractor={(item) => item.asset_id}
        />





          <Text style={{
            color: CurrentViewMode.Mode_Third_fontColor,
            marginLeft: width(5),
            marginTop: height(2)
          }}>
            Crypto
          </Text>
         <FlatList
          data={MyInvestments}
          renderItem={MyCryptoInvestmentsrenderItem}
          keyExtractor={(item) => item.asset_id}
        />

      </>
        }
          
      

      













      <Text style={{ 
          fontSize: size(16), 
         color: CurrentViewMode.Mode_fontColor,
         marginBottom: height(4),
         marginTop: height(5), 
         marginLeft: width(5), 
         fontWeight: "bold" 
        }}>
        {t("InvestmentsInsightsHeader")}         
      </Text>





        <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{
          width: "100%",
          height: height(22),
         // backgroundColor: 'yellow',

        }} contentContainerStyle={{
          paddingLeft: width(5),
        }}>

          <TouchableOpacity onPress={() => {

          posthog.capture('open_analytics_bottomsheet', {
            screen: 'Home',
            $screen_name: 'Home',
            timestamp: new Date().toISOString(),
            
          });

            SheetManager.show("Analytics_Sheet")
          }}
          style={{
            backgroundColor: CurrentViewMode.Mode_InvestInsight_ButtonColor_Home,
            height: height(18),
            width: width(37),
            marginRight: width(4),
            borderRadius: 20,
          }}>


            <MaterialCommunityIcons name='chart-donut-variant' 
            style={{
              color: MyInvestments == null ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_InvestInsight_IconColor_Home,
              fontSize: size(30),
              marginTop: height(3),
              marginLeft: width(5),
            }} />

            <Text style={{
              fontWeight: "bold",
              color:  CurrentViewMode.Mode_fontColor,
              position: 'absolute',
              marginLeft: width(5),
              bottom: height(4),
            }}>
             {t("AnalyticsHeader")}
            
            </Text>

          </TouchableOpacity>

  
     


          <TouchableOpacity onPress={() => {

            posthog.capture('open_orders_history_bottomsheet', {
              screen: 'Home',
              $screen_name: 'Home',
              timestamp: new Date().toISOString(),
              
            });
            SheetManager.show("OrdersHistory_Sheet")
          }}
          style={{
            backgroundColor: CurrentViewMode.Mode_InvestInsight_ButtonColor_Home,
            height: height(18),
            width: width(37),
            marginRight: width(4),
            borderRadius: 20,
          }}>


            <MaterialCommunityIcons name='chart-box-plus-outline' 
            style={{
              color: hasBuys == null ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_InvestInsight_IconColor_Home,
              fontSize: size(30),
              marginTop: height(3),
              marginLeft: width(5),
            }} />

            <Text style={{
              fontWeight: "bold",
              color:  CurrentViewMode.Mode_fontColor,
              position: 'absolute',
              marginLeft: width(5),
              bottom: height(4),
            }}>
              {t("BuyHeader")} 
            </Text>

          </TouchableOpacity>








       
          <TouchableOpacity onPress={() => {
              posthog.capture('open_sell_history_bottomsheet', {
                screen: 'Home',
                $screen_name: 'Home',
                timestamp: new Date().toISOString(),
                
              });
            
            SheetManager.show("SellHistory_Sheet")
          }}
          style={{
            backgroundColor: CurrentViewMode.Mode_InvestInsight_ButtonColor_Home,
            height: height(18),
            width: width(37),
            marginRight: width(4),
            borderRadius: 20,
          }}>


            <MaterialCommunityIcons name='chart-box-outline' 
            style={{
              color: hasSells == null ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_InvestInsight_IconColor_Home,
              fontSize: size(30),
              marginTop: height(3),
              marginLeft: width(5),
            }} />

            <Text style={{
              fontWeight: "bold",
              color: CurrentViewMode.Mode_fontColor,
              position: 'absolute',
              marginLeft: width(5),
              bottom: height(4),
            }}>
             {t("SellsHeader")}  
            </Text>

          </TouchableOpacity>

        </ScrollView>























        
          <View style={{ height: "auto", marginTop: height(2) }}>
            <Text style={{ fontSize: size(16), color: CurrentViewMode.Mode_fontColor, marginLeft: width(5), fontWeight: "bold" }}>
              {t("IFollow")}
            </Text>



            <View style={{ 
                paddingVertical: size(12), 
                marginTop: height(2), 
              //  marginBottom: height(1),
                flexDirection: 'row', 
                alignItems: 'center',
                width: "100%", 
                alignSelf: 'center' ,
                marginLeft: width(10),
             }}>

         
            <TouchableOpacity onPress={() => {

                  posthog.capture('open_coins_i_follow_bottomsheet', {
                    screen: 'Home',
                    $screen_name: 'Home',
                    timestamp: new Date().toISOString(),
                    
                  });
                 SheetManager.show('CoinSIFollow_Sheet');
            }}
            style={{ 
                paddingVertical: size(12), 
               // marginBottom: height(1),
                flexDirection: 'row', 
                alignItems: 'center',

             }}>
              <AntDesign name='star' style={{ fontSize: size(16), color: CurrentViewMode.Mode_fontColor, }} />
              <Text style={{ fontWeight: "bold", fontSize: size(16), marginLeft: width(2), color: CurrentViewMode.Mode_fontColor, }}>
                {t("FavoritesCategory")}
              </Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={toggleOpen} 

            style={{
             
              position: 'absolute',
              height: 50,
              width: 50,
              right: width(5),
              alignItems: 'center',
            //  backgroundColor: "yellow"
            }}>
            <MaterialIcons  activeOpacity={0.6}
            name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            style={{
                fontSize: size(25),
                color: CurrentViewMode.Mode_Sec_fontColor,
                alignSelf: 'center',
                marginTop:height(1.5)
                
            
              }} />
            </TouchableOpacity>
            </View>



            {
              coins == "" || coins == null

              ?


                <Text style={{
                  fontSize: size(14),
                  alignSelf: 'center',
                  marginTop: height(2),
                  marginBottom: height(2),
                  width: "75%",
                  textAlign: 'center',
                  color: CurrentViewMode.Mode_Third_fontColor
                }}>
                 {t("OnceYouStartFollowingAssets")}

             
        
                </Text>


            :
            <>





        {
          !isOpen ?
          null

          :

          <View style={{ paddingVertical: 10 }}>
          <FlatList
            style={{ height: "auto" }}
            scrollEnabled={false}
            data={coins}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', alignSelf: 'center', width: "80%", color: CurrentViewMode.Mode_Third_fontColor,}}>
                 {t("NoCoinsFollowedHeader")} 
              </Text>
            }
          />
        </View>

        
        }
      
</>
            }



         

         





          </View>

          <Text style={{ fontSize: size(12), marginTop: height(4), width: width(90), lineHeight: height(2), marginLeft: width(6),  color: CurrentViewMode.Mode_Third_fontColor, }}>
          {t("QuotedPricesText")} 
          </Text>
          

        </ScrollView>



        </View>


        </>
   
  
  );
};

export default Home;
