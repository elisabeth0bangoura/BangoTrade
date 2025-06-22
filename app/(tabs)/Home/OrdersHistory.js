import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions, FlatList, PanResponder, LayoutAnimation, Dimensions,Animated, UIManager, Platform, TouchableOpacity,   Image } from 'react-native'; 
import { AntDesign, Feather, FontAwesome, FontAwesome6, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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

import ActionSheet, { BottomSheetBackdrop, FlashList, ScrollView, SheetManager, useScrollHandlers} from 'react-native-actions-sheet';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import  { Keyframe, SlideInDown, SlideOutUp } from 'react-native-reanimated';


import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

import TabbedControl from 'react-native-tabbed-control';  // Import the tabbed control library

import PagerView from 'react-native-pager-view';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { TabView, SceneMap } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native';
import SkeletonLoading from 'expo-skeleton-loading'
import { ViewModeContext } from '@/app/Context/ViewModeContext';



import firestore from '@react-native-firebase/firestore';


import { getFirestore, addDoc,getDoc, collection, doc, onSnapshot } from "@react-native-firebase/firestore";

import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";
import { usePostHog } from 'posthog-react-native';























// Component for Sort Following coins
export default OrdersHistory = () => {
  

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance

  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);



    const windowHeight = Dimensions.get('window').height;


  

    const SellHistory_Sheet = useRef(null);
  
  
  
    
  
  const calculatedHeight = windowHeight * 0.92;
  
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const [AlpacaUserId, setAlpacaUserId] = useState();

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")

  




  useEffect(() => {
    posthog.capture('screen_viewed', {
      screen: 'OrdersHistory',
      $screen_name: 'OrdersHistory',
      timestamp: new Date().toISOString(),
    });
  }, []);
  




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
  





  
  const formatQuantity = (value) => {
      if (!value) return "0";
    
      const num = parseFloat(value);
      
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: num % 1 === 0 ? 0 : 6,  // Show 6 decimals only if needed
        maximumFractionDigits: 6,                      // Keep up to 6 decimal places
        useGrouping: true,                             // Add thousand separator
      }).format(num);
    };
    
  
  
    // Format price with commas and the Euro symbol
  const formatPrice = (price) => {
      return new Intl.NumberFormat('us-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
    };
    
    

    




    useEffect(() => {
      const fetchActivities = async () => {
        const AlpacaOptions = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
          }
        };
    
        const CoinGeckoOptions = {
          method: 'GET',
          headers: { accept: 'application/json', 'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG' }
        };
    
        try {
          // Fetch Alpaca transactions
          const response = await fetch(
            `https://broker-api.sandbox.alpaca.markets/v1/accounts/activities?account_id=${AlpacaUserId}&activity_types=FILL&page_size=100`,
            AlpacaOptions
          );
          const result = await response.json();
    
          // Filter out "Sell" activities, only keep "Buy" transactions
          const mergedData = await Promise.all(result.map(async (item) => {
            if (item.side === "sell") return null; // Skip "Sell" activities
    
            const isCrypto = item.symbol.includes('/');
            const baseSymbol = isCrypto ? item.symbol.split('/')[0].toLowerCase() : item.symbol.toLowerCase();
    
            try {
              if (isCrypto) {
                // Fetch CoinGecko search results
                const searchRes = await fetch(`https://pro-api.coingecko.com/api/v3/search?query=${baseSymbol}`, CoinGeckoOptions);
                const searchData = await searchRes.json();
    
                if (searchData.coins && searchData.coins.length > 0) {
                  const coin = searchData.coins.find((c) => c.symbol.toLowerCase() === baseSymbol) || searchData.coins[0];
    
                  // Fetch market data for the matched coin
                  const coinGeckoRes = await fetch(`https://pro-api.coingecko.com/api/v3/coins/${coin.id}`, CoinGeckoOptions);
                  const coinGeckoData = await coinGeckoRes.json();
    
                  if (coinGeckoData) {
                    return {
                      ...item,
                      type: 'crypto',
                      coinName: coinGeckoData.name,  // Adding name for crypto
                      logo: coinGeckoData.image.small || `https://assets.parqet.com/logos/symbol/${item.symbol}?format=png&size=100`  // Use logo from CoinGecko or fallback
                    };
                  }
                }
              } else {
                // If it's a stock (non-crypto), use a fallback logo
                return {
                  ...item,
                  type: 'stock',
                  coinName: item.symbol,  // Just use symbol as coinName for stocks
                  logo: `https://assets.parqet.com/logos/symbol/${item.symbol}?format=png&size=100`  // Default logo
                };
              }
            } catch (error) {
              console.error("CoinGecko Fetch Error:", error);
            }
    
            return {
              ...item,
              type: isCrypto ? 'crypto' : 'stock',
              coinName: item.symbol,  // Fallback to symbol for both crypto and stock
              logo: `https://assets.parqet.com/logos/symbol/${item.symbol}?format=png&size=100`  // Default logo
            };
          }));
    
          // Remove null values from mergedData (i.e., remove "sell" transactions)
          const filteredData = mergedData.filter(item => item !== null);
    
          // ✅ Now apply `groupByMonth()` AFTER fetching CoinGecko data
          const groupedData = groupByMonth(filteredData, t);
    
          // Add header if there is data for "This month"
          const finalGroupedData = groupedData.map(group => {
            if (group.title === "This month") {
              // Check if group.data exists and has items
              if (group.data && group.data.length > 0) {
                return {
                  title: group.title,
                  type: "header",
                  coinName: group.data[0]?.coinName || "No Coin",
                  logo: group.data[0]?.logo || "https://example.com/default-logo.png",
                  transaction_time: group.data[0]?.transaction_time || new Date().toISOString(),
                  ...group
                };
              } else {
                // If "This month" has no data, still include a header but with default values
                return {
                  title: group.title,
                  type: "header",
                  coinName: "No Coin", // Default value for coinName
                  logo: "https://example.com/default-logo.png", // Default logo
                  transaction_time: new Date().toISOString(), // Default timestamp
                  ...group
                };
              }
            }
            return group;
          }).filter(item => item !== null); // Remove null entries
    
          console.log("finalGroupedData ", finalGroupedData);
          setData(finalGroupedData);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };
    
      fetchActivities();
    }, [AlpacaUserId]);
    





const groupByMonth = (orders, t) => {
  const grouped = {};
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();

  orders.forEach((item) => {
    const rawDate = item.transaction_time || item.date;
    const date = rawDate ? new Date(rawDate) : null;

    if (!date || isNaN(date)) return; // Skip invalid dates

    const year = date.getFullYear();
    const monthIndex = date.getMonth();

    const monthNames = {
      0: t('January'),
      1: t('February'),
      2: t('March'),
      3: t('April'),
      4: t('May'),
      5: t('June'),
      6: t('July'),
      7: t('August'),
      8: t('September'),
      9: t('October'),
      10: t('November'),
      11: t('December'),
    };

    let key = `${monthNames[monthIndex]} ${year}`;
    if (monthIndex === thisMonth && year === thisYear) {
      key = t('This month');
    }

    if (!grouped[key]) {
      grouped[key] = { title: key, data: [] };
    }

    grouped[key].data.push(item);
  });

  return Object.values(grouped).flatMap((group) => [
    { type: 'header', title: group.title },
    ...group.data.map((item) => ({ type: 'item', ...item }))
  ]);
};


const renderItem = ({ item }) => {
  const date = new Date(item.transaction_time);
  const formattedDate = date.toLocaleString(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (item.activity_type === "FEE") return null;

  if (item.type === 'header') {
    return (
      <View style={{ marginTop: height(5), marginBottom: height(2), marginLeft: width(5) }}>
        <Text style={{
          fontSize: size(15),
          fontWeight: "bold",
          color: CurrentViewMode.Mode_Sec_fontColor
        }}>
          {item.title}
        </Text>
      </View>
    );
  }
      



    
    
      
      return (
          item.side === "sell" ? null : (
              <View style={{
                  marginTop: height(2), 
                  flexDirection: 'row', 
                  alignItems: 'center',  
                  marginLeft: width(6),
                  marginBottom: height(2),
               }}>
                  <View style={{
                       height: size(25),
                       width: size(25),
                     //  backgroundColor: '#fff',
                       borderRadius:  size(25)/2,
                       marginRight: width(8),
                       overflow: 'hidden'
                  }}>
                      {item.logo ? (
                          <Image source={{ uri: item.logo }} style={{ height: "100%", width: "100%" }} />
                      ) : (
                          <View style={{ height: "100%", width: "100%", backgroundColor: CurrentViewMode.Mode_Sec_fontColor }} />
                      )}
                  </View>
                  <View>
                      <Text style={{ color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold', marginBottom: height(1) }}>{item.coinName} </Text>
  
  
                      <View style={{
                          flexDirection: "row",
                          gap: width(4),
                          marginBottom: height(1) 
                      }}> 
                      <Text style={{ color: CurrentViewMode.Mode_fontColor, }}>{formatQuantity(item.qty)}</Text>
                      </View>
  
                      <Text style={{ color: CurrentViewMode.Mode_Sec_fontColor, fontSize: 12 }}>
                      {formattedDate}
                      </Text>
                  </View>
              </View>
          )
      );
  };
  
  
  
  
  
  
  
  


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
                  backgroundColor:  CurrentViewMode.Mode_BgColorBar_Search,
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

  
  
    
      return (
  
  
  
   <ActionSheet 
        ref={SellHistory_Sheet}
        backgroundInteractionEnabled={false}
        isModal={false}
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
         maxHeight:calculatedHeight,
         backgroundColor: CurrentViewMode.Mode_bg,
         height:calculatedHeight,
         borderTopLeftRadius: 20,
         borderTopRightRadius: 20,
         
       }} 	
       style={{
         height: "100%",
         backgroundColor: CurrentViewMode.Mode_bg,
     }}>
   
   <ScrollView showsVerticalScrollIndicator={false} 
   contentContainerStyle={{
    paddingBottom: height(5)
   }}>


  
        <View style={{
            marginTop: height(5)
        }}>
          <Text style={{
              fontSize: size(25),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "900",
              marginTop: height(2),
              marginLeft: width(5),
          }}>
            {t("BuyHeader")}    
          </Text>
  
         
          {loading == true ? (
                 <SkeletonPlaceholder />
              ) : (
                  <FlatList
                      data={data}
                      keyExtractor={(item, index) => item.id || `header-${index}`}
                      renderItem={renderItem}
                  />
              )}
  
      </View>

      </ScrollView>
      </ActionSheet>
  
     
     
      );
    };
    
  
  




  
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 16,
  },
  button: {
    flex: 1,
    height: 48,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
  },
});