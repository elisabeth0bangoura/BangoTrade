import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text, StyleSheet, useWindowDimensions, FlatList, PanResponder, LayoutAnimation, Dimensions,Animated, UIManager, Platform, TouchableOpacity,   Image } from 'react-native'; 
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, FontAwesome6, Foundation, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';
import database from '@react-native-firebase/database';
import auth, {firebase} from '@react-native-firebase/auth';
import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';


import Collapsible from 'react-native-collapsible';

import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLoading from 'expo-skeleton-loading'

import ActionSheet, { BottomSheetBackdrop, FlashList, ScrollView, SheetManager, useScrollHandlers} from 'react-native-actions-sheet';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import  { Keyframe, SlideInDown, SlideOutUp } from 'react-native-reanimated';


import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

import TabbedControl from 'react-native-tabbed-control';  // Import the tabbed control library

import PagerView from 'react-native-pager-view';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { TabView, SceneMap } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import * as ImageManipulator from 'expo-image-manipulator';
import { decode as atob } from 'base-64';

import { AnalyticsContext } from '@/app/Context/AnalyticsContext';
import { ViewModeContext } from '@/app/Context/ViewModeContext';


import firestore from '@react-native-firebase/firestore';


import { getFirestore, addDoc,getDoc, collection, doc, onSnapshot } from "@react-native-firebase/firestore";

import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";











export const OverallPosition_Component = () => {
  
  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

    const windowHeight = Dimensions.get('window').height;
  
    const {FilterState, setFilterState} = useContext(AnalyticsContext)
  
    
  
    const OverallPosition_Sheet = useRef(null);
  
  

    

    
  

  
    
      return (
  
  
  
        <ActionSheet 
        ref={OverallPosition_Sheet}
        backgroundInteractionEnabled={false}
        isModal={false}
        gestureEnabled={true}
  
  
        onOpen={() => { 
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

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
  
   
  
       <Animated.View
       style={{
         height: 40, // Height of the header
         backgroundColor: CurrentViewMode.Mode_bg,
         borderTopLeftRadius: 20, // Rounded top corners
         borderTopRightRadius: 20, // Rounded top corners
         width: '100%', // Full width
         alignSelf: 'center', // Center the header
       }}
  
     />
  
     
     </>
   }
     
       
       containerStyle={{
         maxHeight: height(40),
         backgroundColor: CurrentViewMode.Mode_bg,
         height: height(40),
         borderTopLeftRadius: 20,
         borderTopRightRadius: 20,
         
       }} 	
       style={{
         height: "100%",
         backgroundColor: CurrentViewMode.Mode_bg,
     }}>
   
  
        <View>
          <Text style={{
              fontSize: size(25),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "900",
              marginTop: height(0),
              marginLeft: width(5),
          }}>
           {t("BreakdownHeader")}    hello
          </Text>
  
          <TouchableOpacity onPress={() => {
             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                SheetManager.hide('OverallPosition_Sheet');
              setFilterState("Overall position")

          }}
          style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: height(3),
              width: "90%",
              paddingVertical: 12,
              paddingHorizontal: 0,
              alignSelf: 'center'
          }}>
  
               <MaterialCommunityIcons name='trending-up'
               style={{
                  fontSize: size(25),
                  color: CurrentViewMode.Mode_fontColor,
               }} />
              <Text style={{
                  marginLeft: width(10),
                  fontSize: size(15),
                  color: CurrentViewMode.Mode_fontColor,
                  fontWeight: "bold",
              }}>
                {t("OverallPositionHeader")}
              </Text>


              {
                FilterState == "Overall position"

                ?

                <MaterialIcons name='check' style={{
                    fontSize: size(25),
                    color: CurrentViewMode.Mode_fontColor,
                    position: 'absolute',
                    right: width(5),
                }} />

                :

                null
              }

          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => {
             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                SheetManager.hide('OverallPosition_Sheet');
              setFilterState("Since purchase in %")
          }}
          style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: height(1),
              paddingVertical: 12,
              paddingHorizontal: 0,
              width: "90%",
              alignSelf: 'center'
          }}>
  
               <MaterialIcons name='percent'
               style={{
                  fontSize: size(24),
                  color: CurrentViewMode.Mode_fontColor,
               }} />
              <Text style={{
                  marginLeft: width(10),
                  fontSize: size(15),
                  color: CurrentViewMode.Mode_fontColor,
                  fontWeight: "bold",
              }}>
                {t("SinceBroughtHeader")}   
              </Text>

              {
                FilterState == "Since purchase in %"

                ?

                <MaterialIcons name='check' style={{
                    fontSize: size(25),
                    color: CurrentViewMode.Mode_fontColor,
                    position: 'absolute',
                    right: width(5),
                }} />

                :

                null
              }
          </TouchableOpacity>
  
  
          <TouchableOpacity onPress={() => {
             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                SheetManager.hide('OverallPosition_Sheet');
                setFilterState("Since purchase in $")
            
          }}
          style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: height(1),
              paddingVertical: 12,
              paddingHorizontal: 0,
              width: "90%",
              alignSelf: 'center'
          }}>
  
             <FontAwesome name='dollar'
               style={{
                fontSize: size(20),
                  color: CurrentViewMode.Mode_fontColor,
                  marginLeft: width(1.5)
                  
               }} />
              <Text style={{
                  marginLeft: width(11),
                  fontSize: size(15),
                  color: CurrentViewMode.Mode_fontColor,
                  fontWeight: "bold",
              }}>
               {t("SinceBroughtHeader")}   
              </Text>


              {
                FilterState == "Since purchase in $"

                ?

                <MaterialIcons name='check' style={{
                    fontSize: size(25),
                    color: CurrentViewMode.Mode_fontColor,
                    position: 'absolute',
                    right: width(5),
                }} />

                :

                null
              }
          </TouchableOpacity>
  
  
      </View>
      </ActionSheet>
  
     
     
      );
    };
    
  
    
  
  




















    const SkeletonPlaceholder = () => {
        return (
        <>
          
            {Array.from({ length: 1 }).map((_, index) => (
              <SkeletonLoading  background={"#1E1E1F"} highlight={"#666"}>
                <View style={{  left: width(35), position: 'absolute',  }}>
                  {/* Left Skeleton Box */}
                 
                  {/* Right Skeleton Box */}
                  <View
                    style={{
                      backgroundColor: "#1E1E1F",
                      height: size(25),
                      width: width(20),
                    
                 
                      borderRadius: 8,
                    }}
                  />
                </View>
              </SkeletonLoading>
            ))}
        </>
        );
      };
      




      const colorCache = {};

      const fetchDominantColor = async (imageUri) => {
        if (colorCache[imageUri]) {
          return colorCache[imageUri];
        }
      
        try {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [{ resize: { width: 1, height: 1 } }],
            { base64: true }
          );
      
          const base64 = manipulatedImage.base64;
      
          // Parse first pixel's RGB values from base64 image
          const rgb = extractRGBFromBase64(base64);
      
          const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
          colorCache[imageUri] = hexColor;
          return hexColor;
        } catch (error) {
          console.error('Error fetching dominant color:', error);
          return '#1E1E1F';
        }
      };
      
      // Helper: Convert RGB to HEX
      const rgbToHex = (r, g, b) =>
        '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
      
      // NOTE: This is a lightweight approximation.
      // Proper pixel decoding from base64 requires full decoding logic or a native module.
      const extractRGBFromBase64 = (base64) => {
        const binary = atob(base64.slice(0, 16)); // Just sample the first chunk
        return {
          r: binary.charCodeAt(0),
          g: binary.charCodeAt(1),
          b: binary.charCodeAt(2),
        };
      };
      
















const AllAssets_Overview = () => {

  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  
  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true); // Tracks if this is the initial load

    const {
      FilterState, 
      setFilterState,
      hasCrypto, setHasCrypto,
      hasStocks, setHasStocks,
      hasEtfs, setHasEtfs,
      hasOptions, setHasOptions,
    } = useContext(AnalyticsContext)

    const [AssetFocused, setAssetFocused] = useState("")

    const [loading, setloading] = useState(null)
    const [pieData, setPieData] = useState([]);
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0); // State to store the total portfolio value


    const [AlpacaUserId, setAlpacaUserId] = useState();

    const [UserFirstName, setUserFirstName] = useState("")
    const [UserLastName, setUserLastName] = useState("")
    const [assetClassPieData, setAssetClassPieData] = useState([]);




// Format price with commas and the Euro symbol
const formatPrice = (price) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  // Remove currency symbol and append it after the number
  const numberOnly = formatted.replace(/[^0-9.,]/g, '').trim();
  return `${numberOnly} $`;
};

















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
            console.log("AlpacaAccountId: ", userDocument.data().AlpacaAccountId);

          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    
    fetchUserData();
  }, [AlpacaUserId]);  // Empty array ensures effect runs only once on component mount
  







  
  
    

    const AlpacaOptions = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==' // Replace with your actual API key
        }
      };
      
      const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG' },
      };
      





useEffect(() => {
  const sincePurchaseInUSD = t("SincePurchaseInFiatHeader");
  const sincePurchaseInPercent = t("SincePurchaseInPercentHeader");
  const overallPosition = t("OverallPositionHeader");

  const fetchAlpacaPositions = async () => {
    try {
      if (isInitialLoad) setIsLoading(true);
      console.log("🔥 Current FilterState:", FilterState);

      const res = await fetch(
        `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/positions`,
        AlpacaOptions
      );
      const data = await res.json();

      const grouped = {
        crypto: [],
        us_equity: [],
        options: [],
        etfs: [],
      };

      let foundCrypto = false;
      let foundStocks = false;
      let foundOptions = false;
      let foundEtfs = false;

      const polygonApiKey = 'O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm';
      const etfResponse = await fetch(
        `https://api.polygon.io/v3/reference/tickers?type=ETF&market=stocks&active=true&order=asc&limit=1000&sort=ticker&apiKey=${polygonApiKey}`
      );
      const etfData = await etfResponse.json();
      const knownETFs = etfData.results.map(t => t.ticker.toUpperCase());

      const checkAssetType = async (symbol) => {
        try {
          const res = await fetch(
            `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${polygonApiKey}`
          );
          const json = await res.json();
          return json?.results?.type;
        } catch (e) {
          console.warn('Polygon fetch failed for', symbol, e);
          return null;
        }
      };

      for (const asset of data) {
        const { symbol, asset_class, contract_type } = asset;

        if (asset_class === "crypto") {
          grouped.crypto.push(asset);
          foundCrypto = true;
        } else if (contract_type === "call" || contract_type === "put") {
          grouped.options.push(asset);
          foundOptions = true;
        } else {
          const polygonType = await checkAssetType(symbol);
          if (polygonType === "ETF" || knownETFs.includes(symbol.toUpperCase())) {
            grouped.etfs.push(asset);
            foundEtfs = true;
          } else {
            grouped.us_equity.push(asset);
            foundStocks = true;
          }
        }
      }

      setHasCrypto(foundCrypto);
      setHasStocks(foundStocks);
      setHasEtfs(foundEtfs);
      setHasOptions(foundOptions);

      let totalPortfolioValue = 0;
      const assetClassPieData = [];

      for (const [asset_class, assets] of Object.entries(grouped)) {
        let totalInvested = 0;
        let totalCurrent = 0;

        assets.forEach((asset) => {
          const entryPrice = parseFloat(asset.avg_entry_price || 0);
          const currentPrice = parseFloat(asset.current_price || 0);
          const quantity = parseFloat(asset.qty || 0);

          const invested = entryPrice * quantity;
          const current = currentPrice * quantity;
          totalInvested += invested;
          totalCurrent += current;
        });

        const gainUSD = totalCurrent - totalInvested;
        const gainPercent = totalInvested > 0 ? (gainUSD / totalInvested) * 100 : 0;
        totalPortfolioValue += totalCurrent;

        const displayName =
          asset_class === "us_equity" ? "Stocks" :
          asset_class === "etfs" ? "ETFs" :
          asset_class === "options" ? "Options" :
          asset_class === "crypto" ? "Crypto" :
          asset_class;

        assetClassPieData.push({
          name: displayName,
          totalInvested,
          totalCurrent,
          FilteredValue:
            FilterState === sincePurchaseInUSD
              ? parseFloat(gainUSD.toFixed(2))
              : FilterState === sincePurchaseInPercent
              ? parseFloat(gainPercent.toFixed(2))
              : null,
          rawValue: totalCurrent,
        });
      }

      ["ETFs", "Options"].forEach((label) => {
        if (!assetClassPieData.find((a) => a.name === label)) {
          assetClassPieData.push({
            name: label,
            totalInvested: 0,
            totalCurrent: 0,
            FilteredValue: 0,
            rawValue: 0,
            value: 0,
          });
        }
      });

      assetClassPieData.forEach((item) => {
        item.value =
          FilterState === overallPosition
            ? totalPortfolioValue > 0
              ? parseFloat(((item.rawValue / totalPortfolioValue) * 100).toFixed(2))
              : 0
            : item.FilteredValue ?? 0;
      });

      assetClassPieData.sort((a, b) => b.value - a.value);
      setAssetClassPieData(assetClassPieData);
      setTotalPortfolioValue(totalPortfolioValue);

      const pieDataArray = [];

      const processAssets = async (assets, totalValue) => {
        const promises = assets.map(async (asset) => {
          const symbol = asset.symbol;
          const price = parseFloat(asset.current_price || 0);
          const entry = parseFloat(asset.avg_entry_price || 0);
          const quantity = parseFloat(asset.qty || 0);
          const asset_class = asset.asset_class;

          const assetValueUSD = price * quantity;
          const percentage = totalValue > 0 ? (assetValueUSD / totalValue) * 100 : 0;

          let FilteredValue = 0;
          if (!isNaN(price) && !isNaN(entry) && !isNaN(quantity) && entry !== 0) {
            if (FilterState === sincePurchaseInPercent) {
              FilteredValue = (((price - entry) / entry) * 100).toFixed(2);
            } else if (FilterState === sincePurchaseInUSD) {
              FilteredValue = ((price - entry) * quantity).toFixed(2);
            }
          } else {
            FilteredValue = "0.00";
          }

          if (asset_class !== "crypto") {
            pieDataArray.push({
              name: symbol,
              value: parseFloat(percentage.toFixed(2)),
              amount: assetValueUSD,
              logo: null,
              color: CurrentViewMode.Mode_fontColor,
              FilteredValue,
            });
            return;
          }

          const baseSymbol = symbol.split("/")[0].slice(0, 3).toUpperCase();
          const searchRes = await fetch(
            `https://pro-api.coingecko.com/api/v3/search?query=${baseSymbol}`,
            options
          );
          const searchData = await searchRes.json();

          if (searchData.coins?.length > 0) {
            const coin = searchData.coins[0];
            const coinGeckoRes = await fetch(
              `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin.id}`,
              options
            );
            const coinGeckoData = await coinGeckoRes.json();

            if (coinGeckoData?.length > 0) {
              const currentCoin = coinGeckoData[0];
              pieDataArray.push({
                name: currentCoin.name,
                value: parseFloat(percentage.toFixed(2)),
                amount: assetValueUSD,
                logo: currentCoin.image,
                color: CurrentViewMode.Mode_fontColor,
                FilteredValue,
              });
            }
          }
        });

        await Promise.all(promises);
      };

      await processAssets(grouped.crypto, assetClassPieData.find(i => i.name === "Crypto")?.rawValue || 0);
      await processAssets(grouped.us_equity, assetClassPieData.find(i => i.name === "Stocks")?.rawValue || 0);
      await processAssets(grouped.options, assetClassPieData.find(i => i.name === "Options")?.rawValue || 0);
      await processAssets(grouped.etfs, assetClassPieData.find(i => i.name === "ETFs")?.rawValue || 0);

      pieDataArray.sort((a, b) => b.value - a.value);
      const totalPercentage = pieDataArray.reduce((acc, asset) => acc + asset.value, 0);
      const adjustment = 100 - totalPercentage;
      if (pieDataArray.length > 0) pieDataArray[0].value += adjustment;

      setPieData(pieDataArray);
      setIsLoading(false);
      setIsInitialLoad(false);
    } catch (err) {
      console.error("❌ Error fetching Alpaca positions or market data:", err);
      setIsLoading(false);
    }
  };

  if (AlpacaUserId) fetchAlpacaPositions();
}, [AlpacaUserId, FilterState]);

      
      


/*

 useEffect(() => {
  const sincePurchaseInUSD = t("SincePurchaseInFiatHeader");
  const sincePurchaseInPercent = t("SincePurchaseInPercentHeader");
  const overallPosition = t("OverallPositionHeader");

  const fetchAlpacaPositions = async () => {




    try {
      if (isInitialLoad) setIsLoading(true);
      console.log("🔥 Current FilterState:", FilterState);

      const res = await fetch(
        `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/positions`,
        AlpacaOptions
      );
      const data = await res.json();

      const grouped = {
        crypto: [],
        us_equity: [],
        options: [],
        etfs: [],
      };

      let foundCrypto = false;
      let foundStocks = false;
      let foundOptions = false;
      let foundEtfs = false;

      const polygonApiKey = 'O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm	';


      
      const knownETFs = [
        "SPY", "VOO", "IVV", "QQQ", "VTI", "MSCI", "EFA", "IEMG", "AGG",
        "LQD", "XLK", "XLF", "XLY", "XLE", "XLV", "XLP", "XLI", "XLU", "XLB", "VNQ",
        
      ];

      const checkAssetType = async (symbol) => {
        try {
          const res = await fetch(
            `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${polygonApiKey}`
          );
          const json = await res.json();
          return json?.results?.type;
        } catch (e) {
          console.warn('Polygon fetch failed for', symbol, e);
          return null;
        }
      };

      for (const asset of data) {
        const { symbol, asset_class, contract_type } = asset;

        if (asset_class === "crypto") {
          grouped.crypto.push(asset);
          foundCrypto = true;
        } else if (contract_type === "call" || contract_type === "put") {
          grouped.options.push(asset);
          foundOptions = true;
        } else {
          const polygonType = await checkAssetType(symbol);

          if (polygonType === "ETF" || knownETFs.includes(symbol.toUpperCase())) {
            grouped.etfs.push(asset);
            foundEtfs = true;
          } else {
            grouped.us_equity.push(asset);
            foundStocks = true;
          }
        }
      }

      setHasCrypto(foundCrypto);
      setHasStocks(foundStocks);
      setHasEtfs(foundEtfs);
      setHasOptions(foundOptions);

      let totalPortfolioValue = 0;
      const assetClassPieData = [];

      for (const [asset_class, assets] of Object.entries(grouped)) {
        let totalInvested = 0;
        let totalCurrent = 0;

        assets.forEach((asset) => {
          const invested = parseFloat(asset.avg_entry_price) * parseFloat(asset.qty);
          const current = parseFloat(asset.current_price) * parseFloat(asset.qty);
          totalInvested += invested;
          totalCurrent += current;
        });

        const gainUSD = totalCurrent - totalInvested;
        const gainPercent = totalInvested > 0 ? (gainUSD / totalInvested) * 100 : 0;
        totalPortfolioValue += totalCurrent;

        const displayName = asset_class === "us_equity"
          ? "Stocks"
          : asset_class.charAt(0).toUpperCase() + asset_class.slice(1);

        assetClassPieData.push({
          name: displayName,
          totalInvested,
          totalCurrent,
          FilteredValue:
            FilterState === sincePurchaseInUSD
              ? parseFloat(gainUSD.toFixed(2))
              : FilterState === sincePurchaseInPercent
              ? parseFloat(gainPercent.toFixed(2))
              : null,
          rawValue: totalCurrent,
        });
      }

      // Always include ETFs and Options for consistency
      ["ETFs", "Options"].forEach((label) => {
        if (!assetClassPieData.find((a) => a.name === label)) {
          assetClassPieData.push({
            name: label,
            totalInvested: 0,
            totalCurrent: 0,
            FilteredValue: 0,
            rawValue: 0,
            value: 0,
          });
        }
      });

      assetClassPieData.forEach((item) => {
        item.value =
          FilterState === overallPosition
            ? totalPortfolioValue > 0
              ? parseFloat(((item.rawValue / totalPortfolioValue) * 100).toFixed(2))
              : 0
            : item.FilteredValue;
      });

      assetClassPieData.sort((a, b) => b.value - a.value);
      setAssetClassPieData(assetClassPieData);
      setTotalPortfolioValue(totalPortfolioValue);

      const pieDataArray = [];

      const processAssets = async (assets, totalValue) => {
        const promises = assets.map(async (asset) => {
          const { symbol, qty, avg_entry_price, current_price, asset_class } = asset;
          const assetValueUSD = qty * current_price;
          const percentage = totalValue > 0 ? (assetValueUSD / totalValue) * 100 : 0;

          let FilteredValue = 0;
          if (FilterState === sincePurchaseInPercent) {
            FilteredValue = (((current_price - avg_entry_price) / avg_entry_price) * 100).toFixed(2);
          } else if (FilterState === sincePurchaseInUSD) {
            FilteredValue = ((current_price - avg_entry_price) * qty).toFixed(2);
          }

          if (asset_class !== "crypto") {
            pieDataArray.push({
              name: symbol,
              value: parseFloat(percentage.toFixed(2)),
              amount: assetValueUSD,
              logo: null,
              color: CurrentViewMode.Mode_fontColor,
              FilteredValue,
            });
            return;
          }

          // Crypto: fetch logo
          const baseSymbol = symbol.split("/")[0].slice(0, 3).toUpperCase();
          const searchRes = await fetch(
            `https://pro-api.coingecko.com/api/v3/search?query=${baseSymbol}`,
            options
          );
          const searchData = await searchRes.json();

          if (searchData.coins?.length > 0) {
            const coin = searchData.coins[0];
            const coinGeckoRes = await fetch(
              `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin.id}`,
              options
            );
            const coinGeckoData = await coinGeckoRes.json();

            if (coinGeckoData?.length > 0) {
              const currentCoin = coinGeckoData[0];
              pieDataArray.push({
                name: currentCoin.name,
                value: parseFloat(percentage.toFixed(2)),
                amount: assetValueUSD,
                logo: currentCoin.image,
                color: CurrentViewMode.Mode_fontColor,
                FilteredValue,
              });
            }
          }
        });

        await Promise.all(promises);
      };

      await processAssets(grouped.crypto, assetClassPieData.find(i => i.name === "Crypto")?.rawValue || 0);
      await processAssets(grouped.us_equity, assetClassPieData.find(i => i.name === "Stocks")?.rawValue || 0);
      await processAssets(grouped.options, assetClassPieData.find(i => i.name === "Options")?.rawValue || 0);
      await processAssets(grouped.etfs, assetClassPieData.find(i => i.name === "ETFs")?.rawValue || 0);

      pieDataArray.sort((a, b) => b.value - a.value);
      const totalPercentage = pieDataArray.reduce((acc, asset) => acc + asset.value, 0);
      const adjustment = 100 - totalPercentage;
      if (pieDataArray.length > 0) pieDataArray[0].value += adjustment;

      setPieData(pieDataArray);
      setIsLoading(false);
      setIsInitialLoad(false);
    } catch (err) {
      console.error("❌ Error fetching Alpaca positions or market data:", err);
      setIsLoading(false);
    }
  };

  if (AlpacaUserId) fetchAlpacaPositions();
}, [AlpacaUserId, FilterState]);


*/

      

  
  








      const CategoryItem = ({ iconName, iconLib, label, color, bgColor, value, FilteredValue, FilterState }) => {
        const Icon = iconLib;
      
        return (
          <TouchableOpacity
            style={{
              marginLeft: width(5),
              width: '90%',
              flexDirection: 'row',
              alignItems: 'center',
              height: size(50),
              marginTop: height(2),
            }}
          >
            <View
              style={{
                height: 25,
                width: 25,
                marginRight: width(5),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  borderRadius: size(20) / 2,
                  height: size(20),
                  width: size(20),
                  borderColor: color,
                  borderWidth:  label == "ETFs" ? 1.5 : bgColor ? 0 : 1.5,
                  backgroundColor: label == "ETFs" ? "transparent" : bgColor || 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {
                  label == "ETFs" 
                  ?
                  <Text style={{color: color, fontSize: size(5), fontWeight: "900"}}>ETFs</Text>

                  :
                  <Icon name={iconName} style={{ color: bgColor ? CurrentViewMode.Mode_bg : color }} />
                }

              </View>
            </View>
      
            <Text
              style={{
                color: color,
                fontWeight: 'bold',
                fontSize: size(15),
              }}
            >
              {label}
            </Text>
      
            <Text
              style={{
                color: FilterState === t("OverallPositionHeader") || FilteredValue === undefined
                  ? color
                  : FilteredValue >= 0
                    ? '#00CE39'
                    : '#FF1B1E',
                fontSize: size(13),
                marginLeft: 'auto',
                marginRight: width(3),
                fontWeight: '600',
              }}
            >
              {FilterState === t("SincePurchaseInFiatHeader") && FilteredValue !== undefined
                ? `${FilteredValue >= 0 ? '▲' : '▼'} ${formatPrice(FilteredValue)}`
                : FilterState === t("SincePurchaseInPercentHeader") && FilteredValue !== undefined
                  ? `${FilteredValue >= 0 ? '▲' : '▼'} ${FilteredValue}%`
                  : value !== undefined
                    ? `${parseFloat(value).toFixed(2)}%`
                    : ''}
            </Text>
          </TouchableOpacity>
        );
      };
      


const sortedAssetClasses = [...assetClassPieData].sort((a, b) => b.value - a.value);


const iconMap = {
  Stocks: { iconName: 'chart-arc', iconLib: MaterialCommunityIcons, color: CurrentViewMode.Mode_fontColor },
  Crypto: { iconName: 'currency-btc', iconLib: MaterialCommunityIcons, color: CurrentViewMode.Mode_fontColor },
  ETFs: { iconName: 'plus', iconLib: FontAwesome5, color: CurrentViewMode.Mode_Third_fontColor, bgColor: CurrentViewMode.Mode_Third_fontColor },
  Options: { iconName: 'plus', iconLib: FontAwesome5, color: CurrentViewMode.Mode_Third_fontColor, bgColor: CurrentViewMode.Mode_Third_fontColor }
};

{sortedAssetClasses.map((item) => {
  const icon = iconMap[item.name] || iconMap["Stocks"]; // Fallback
  return (
    <CategoryItem
      key={item.name}
      iconName={icon.iconName}
      iconLib={icon.iconLib}
      label={item.name}
      color={icon.color}
      bgColor={icon.bgColor}
      value={item.value}
    />
  );
})}






return (
  <View
    style={{
      paddingVertical: 0,
     height: "100%",
     width: "100%"
    }}>



    <View
      style={{
      }}>

   
      <View style={{ alignItems: 'center',  marginBottom: height(5),}}>
        


        {
          isLoading == true
          ?

           <View style={{
            height: size(300),
            width: size(300),
            marginTop: height(2),
            borderWidth: 40,
            borderColor: CurrentViewMode.Mode_BgColorBar_Search,
            borderRadius: size(300)/2,
            backgroundColor: CurrentViewMode.Mode_bg_Search,
            justifyContent: 'center',
            alignItems: 'center'
           }}>

        
          <View style={{
            marginBottom: height(2)
          }}>

<SkeletonLoading background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
            <View style={{ alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: 50, height: 15,  backgroundColor: CurrentViewMode.Mode_BgColorBar_Search, borderRadius: 10 }} />
            </View>
        </SkeletonLoading>
        </View>

        <SkeletonLoading background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
            <View style={{ alignSelf: 'center',  flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: 100, height: 15, backgroundColor: CurrentViewMode.Mode_BgColorBar_Search, borderRadius: 10 }} />
            </View>
        </SkeletonLoading>
           </View>

          :
   
        <PieChart
          data={pieData}
          donut
        //  showGradient
         // sectionAutoFocus
         radius={height(16)}
        //  focusOnPress
          showValuesAsLabels
          showTextBackground
          textBackgroundRadius={20}
          innerRadius={height(10.5)}
          innerCircleColor={CurrentViewMode.Mode_bg}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
               
                <Text style={{fontSize: size(14), marginTop: height(-1), fontWeight: 'bold', color: CurrentViewMode.Mode_Sec_fontColor}}> {t("TotalHeader")}</Text>
                <Text
                  style={{fontSize: size(20), marginTop: height(2), color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold'}}>
                 {formatPrice(totalPortfolioValue)} 
                </Text>
              </View>
            );
          }}
        />

      }
      </View>



          <View style={{
            flexDirection: 'row',
            width: "90%",
            alignSelf: 'center',
            marginBottom: height(5),
            alignItems: 'center',
            
          }}>
        
            <Text style={{
                color: CurrentViewMode.Mode_fontColor,
                fontSize: size(25),
                fontWeight: "bold",
                
            }}>
            {t("BreakdownHeader")}    
            </Text>
       


          <TouchableOpacity onPress={() => {

            console.log("hello")
            SheetManager.show("OverallPosition_Sheet")
          }}
          style={{
              position: 'absolute',
              alignItems: 'center',
              flexDirection: 'row',
              right: width(0),
          }}>
            <Text style={{
                color: CurrentViewMode.Mode_Sec_fontColor,
                fontSize: size(16),
                fontWeight: "bold",
            }}>
           {FilterState}
            </Text>

            <MaterialIcons name="keyboard-arrow-down"
            style={{
                fontSize: size(25),
                color: CurrentViewMode.Mode_Sec_fontColor,
            }} />
         </TouchableOpacity>
          </View>






          <CategoryItem
            iconName="currency-btc"
            iconLib={MaterialCommunityIcons}
            label="Crypto"
            color={hasCrypto == true ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Third_fontColor}
            value={assetClassPieData.find(item => item.name === 'Crypto')?.value}
            FilteredValue={assetClassPieData.find(item => item.name === 'Crypto')?.FilteredValue}
            FilterState={FilterState}
          />

          <CategoryItem
            iconName="chart-arc"
            iconLib={MaterialCommunityIcons}
            label="Stocks"
            color={hasStocks == true ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Third_fontColor}
            value={assetClassPieData.find(item => item.name === 'Stocks')?.value}
            FilteredValue={assetClassPieData.find(item => item.name === 'Stocks')?.FilteredValue}
            FilterState={FilterState}
          />


          <CategoryItem
            iconName="plus"
            iconLib={FontAwesome5}
            label="ETFs"
            color={hasEtfs == true ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Third_fontColor}
            bgColor={hasEtfs == true ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Third_fontColor}
            value={assetClassPieData.find(item => item.name === 'ETFs')?.value}
            FilteredValue={assetClassPieData.find(item => item.name === 'ETFs')?.FilteredValue}
            FilterState={FilterState}
          />




          <CategoryItem
            iconName="plus"
            iconLib={FontAwesome5}
            label="Options"
            color={hasOptions == true ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Third_fontColor}
            bgColor={hasOptions == true ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Third_fontColor}
            value={assetClassPieData.find(item => item.name === 'Options')?.value}
            FilteredValue={assetClassPieData.find(item => item.name === 'Options')?.FilteredValue}
            FilterState={FilterState}
          />

      
    </View>
  </View>);
}


export default AllAssets_Overview



const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    itemContainer: {
      width: '80%',
      padding: 15,
      marginVertical: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    valueText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    colorText: {
      fontSize: 14,
      color: '#333',
    },
    focusText: {
      fontSize: 14,
      color: '#333',
      marginTop: 5,
    },
  });