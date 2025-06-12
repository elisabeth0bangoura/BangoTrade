
import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, FlatList, Dimensions, ScrollView, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '../../../Languages_Translation_Screens/i18n'; 
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';





import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';

import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { FlashList } from '@shopify/flash-list';
import Collapsible from 'react-native-collapsible';
import CoinPage from '@/app/(coin)/coinPage';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';

import { HomeChartContext } from '../../Context/HomeChartContext';

import { AmountContext } from '../../Context/OpenAmountSheetContext';
import { CoinPageContext } from '../../Context/OpenCoinPageContext';
import { SellAmountContext } from '../../Context/SellOpenAmountSheetContext';
import RNPickerSelect from "react-native-picker-select";

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '../../Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from '../../Context/ViewModeContext';




import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc,  addDoc, collection, onSnapshot } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";









export const ActivityReportSheet = () => {
  



	const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  



    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    const [AlpacaUserId, setAlpacaUserId] = useState();

    const windowHeight = Dimensions.get('window').height;
    const ActivityReport_Sheet = useRef(null);
    const calculatedHeight = windowHeight * 0.88;
  
    const [inTotal, setInTotal] = useState("0.00");
    const [growth, setGrowth] = useState("0.00");
    const [growthColor, setGrowthColor] = useState("#0f0"); // Green by default
    const [loss, setLoss] = useState("0.00");
    const [lossColor, setLossColor] = useState("#fff"); // Default white
    const [PortfolioValue, setPortfolioValue] = useState()
    
    const { CurrentChoosedItem,} = useContext(HomeContext)
  
    const [ClearingAccountValue, setClearingAccountValue] = useState()
    const [PortfolioTotal, setPortfolioTotal] = useState()
  

    
  
  
    useEffect(() => {
  
   // Fetch data from the Firestore path
   const fetchUserData = async () => {
    try {
      const userDocument = await firestore()
        .collection('users') // Reference to the 'users' collection
        .doc(user.uid) // The specific document ID
        .get();

      if (userDocument.exists) {
        // If the document exists, set the data

        setAlpacaUserId(userDocument.data().AlpacaAccountId)

        console.log("AlpacaAccountId: ", userDocument.data().AlpacaAccountId)


      } else {
        // Handle the case when the document doesn't exist
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();



      console.log("Item: ", CurrentChoosedItem)
  
        
    const API_URL =  `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account/portfolio/history?intraday_reporting=market_hours&pnl_reset=per_day&date_end=${CurrentChoosedItem}`;
  
    const AUTH_HEADER =
      "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==";
    
  
      
      const fetchPerformanceData = async () => {
        try {
          const response = await fetch(API_URL, {
            method: "GET",
            headers: {
              accept: "application/json",
              authorization: AUTH_HEADER,
            },
          });
  
          if (!response.ok) {
            console.error("API Error:", await response.text());
            return;
          }
  
          const data = await response.json();
       //   console.log("Performance Data:", data);
  
          if (!data || !data.profit_loss || !data.profit_loss_pct) return;
  
          // ✅ Get the last profit/loss value (most recent)
          const lastProfitLoss = data.profit_loss.at(-1) || 0;
          const lastProfitLossPct = data.profit_loss_pct.at(-1) || 0;
  
          // ✅ Convert to string and check for "-" character
          const lastProfitLossString = lastProfitLoss.toFixed(2);
          const lastProfitLossPctString = (lastProfitLossPct * 100).toFixed(2);
  
          // ✅ Loss Calculation: Only sum up negative values
          const totalLoss = data.profit_loss
            .filter((value) => value < 0)
            .reduce((sum, value) => sum + value, 0);
  
          const totalLossString = totalLoss.toFixed(2);
          const isTotalLossNegative = totalLoss < 0;
  
          // ✅ Update states
          setInTotal(lastProfitLossString);
          setGrowth(lastProfitLossPctString);
          setLoss(Math.abs(totalLoss).toFixed(2)); // Always show positive loss
  
          // ✅ Apply colors based on "-" character check
          setGrowthColor(lastProfitLossPct < 0 ? "#f00" : "#0f0"); // Growth in red if negative
          setLossColor(isTotalLossNegative ? "#f00" : "#0f0"); // Loss in red if negative
  
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };
  
      fetchPerformanceData(); 
    }, [user.uid]);
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    useEffect(() => {
  
  
  
      function formatToISO(CurrentChoosedItem) {
        // Check if CurrentChoosedItem already has time and ends with 'Z'
        if (CurrentChoosedItem.includes("T") && CurrentChoosedItem.endsWith("Z")) {
            console.log("✅ Date is already in correct ISO format:", CurrentChoosedItem);
            return CurrentChoosedItem; // Return unchanged
        }
    
        try {
            // Convert YYYY-MM-DD to ISO format with time at midnight UTC
            const date = new Date(`${CurrentChoosedItem}T00:00:00.000Z`);
            const formattedISO = date.toISOString().replace("Z", "000000Z");
            console.log("🔄 Converted date to ISO format:", formattedISO);
            return formattedISO;
        } catch (error) {
            console.error("🚨 Error formatting date:", error);
            return null; // Return null if the conversion fails
        }
    }
    
    // ✅ Example Usage
    const formattedDate = formatToISO(CurrentChoosedItem);
    console.log("Final Formatted Date:", formattedDate);
  
    
  
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
        }
      };
    
   
   
      fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account/portfolio/history?intraday_reporting=market_hours&start=${formattedDate}&pnl_reset=per_day&end=${formattedDate}`, options)
      .then(res => res.json())
        .then(res => {
          console.log("lol ", res)
        
  // Get the last value
  const lastEquityValue = res.equity[res.equity.length - 1];
  
  console.log("Last Equity Value:", lastEquityValue);
  
  setPortfolioValue(lastEquityValue)
        
        })
        .catch(err => console.error(err));
      
    }, []);
  
  
  
  
  
  // Format price with commas and the Euro symbol
  const formatPrice = (price) => {
    return new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  
  
  




















  return (
  
  
  
    <ActionSheet 
    ref={ActivityReport_Sheet}
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
    maxHeight: height(92),
    backgroundColor: CurrentViewMode.Mode_bg,
    height: height(92),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 0, // ✅ Ensure there's no bottom padding here
  }}
  
   style={{
     height: "100%",
     backgroundColor: CurrentViewMode.Mode_bg,
  }}>
  
  
  
  
  
    <ScrollView
      style={{
     
        backgroundColor: CurrentViewMode.Mode_bg,
        width: "100%",
        height: "100%"
      }} contentContainerStyle={{
        paddingBottom: height(5)
      }}>
  
  
  
  
      <Text style={{
              fontSize: size(25),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "900",
              width: "90%",
              marginTop: height(4),
              marginLeft: width(5),
              marginBottom: height(5),
          }}>
            You have received your report for {CurrentChoosedItem}
          </Text>
  
     
       <Text style={{
          marginTop: height(4),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "bold",
          marginLeft: width(5)
        }}>
        Summary
        </Text>
  
  
  
        <View style={{
          width: "90%",
          marginTop: height(4),
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text style={{
          color: CurrentViewMode.Mode_Sec_fontColor,
          fontWeight: "bold",
          marginLeft: width(5)
        }}>
        Portfolio Value
        </Text>
  
  
        <Text style={{
          color: CurrentViewMode.Mode_fontColor,
          position: 'absolute',
          right: 0,
          fontWeight: "bold",
          marginLeft: width(5)
        }}>
        {formatPrice(PortfolioValue)}
        </Text>
        </View>
  
  
  
  
  
  
  
  
        <View style={{
          width: "90%",
          marginTop: height(4),
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text style={{
          color:  CurrentViewMode.Mode_Sec_fontColor,
          fontWeight: "bold",
          marginLeft: width(5)
        }}>
        Clearing account
        </Text>
  
  
        <Text style={{
          color: CurrentViewMode.Mode_fontColor,
          position: 'absolute',
          right: 0,
          fontWeight: "bold",
          marginLeft: width(5)
        }}>
       {formatPrice(ClearingAccountValue)}
        </Text>
        </View>
  
  
  
  
  
  
  
  
        <View style={{
          width: "90%",
          marginTop: height(4),
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text style={{
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "bold",
          marginLeft: width(5)
        }}>
        In total
        </Text>
  
  
        <Text style={{
          color: CurrentViewMode.Mode_fontColor,
          position: 'absolute',
          right: 0,
          fontWeight: "bold",
          marginLeft: width(5)
        }}>
        {formatPrice(PortfolioTotal)}
        </Text>
        </View>
  
  
  
  
  
  
        <Text style={{
            marginTop: height(9),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "bold",
          marginLeft: width(5)
        }}>
        Performance
        </Text>
  
  
  
        <View 
         style={{
          marginTop: height(3),
          flexDirection: 'row',
         // backgroundColor: 'yellow',
          height: height(12),
         
        }}>
  
  
  
          <View style={{
           // backgroundColor: 'blue',
            height: height(8),
            width: width(30),
            marginRight: width(5),
            alignItems: 'center',
          }}>
            <Text style={{
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "bold",
              fontSize: size(14),
              marginBottom: height(1)
            }}>
            In total
            </Text>
            <Text style={{
            color: inTotal.startsWith("-") ? "#f00" : "#0f0",
              fontWeight: "bold",
              fontSize: size(15)
            }}>
             {formatPrice(inTotal)}
            </Text>
          </View>
  
  
          <View style={{
           // backgroundColor: 'blue',
            height: height(8),
            width: width(30),
            marginRight: width(5),
            alignItems: 'center',
          }}>
            <Text style={{
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "bold",
              fontSize: size(14),
              marginBottom: height(1)
            }}>
            Growth
            </Text>
            <Text style={{
              color: growthColor,
              fontWeight: "bold",
              fontSize: size(15)
            }}>
            {growth} %
            </Text>
          </View>
  
  
          <View style={{
          // backgroundColor: 'blue',
            height: height(8),
            width: width(30),
            marginRight: width(5),
            alignItems: 'center',
          }}>
            <Text style={{
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "bold",
              fontSize: size(14),
              marginBottom: height(1)
            }}>
            Loss
            </Text>
            <Text style={{
              color:  loss === "0.00" ? "#0f0" : lossColor, 
              fontWeight: "bold",
              fontSize: size(15)
            }}>
            {loss === "0.00" ? formatPrice(loss) : `-${formatPrice(loss)}`} 
  
            </Text>
          </View>
        </View>
  
  
  
  
  
  
  
  
  
  
        <Text style={{
            marginTop: height(3),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "bold",
          marginLeft: width(5)
        }}>
        Documents
        </Text>
  
  
  
        <View 
         style={{
          marginTop: height(3),
          alignSelf: 'center',
          marginLeft: width(5),
          flexDirection: 'row',
       //  backgroundColor: 'yellow',
          height: height(20),
        }}>
  
  
  
          <View style={{
            backgroundColor: CurrentViewMode.Mode_Sec_fontColor,
            height: height(18),
            width: width(45),
            borderRadius: 15,
         
            marginRight: width(2),
         
          }}>
  
  
            <Feather name='file-text' style={{
              fontSize: size(25),
              color: CurrentViewMode.Mode_fontColor,
              marginTop: height(4),
              marginLeft: width(5),
            }} />
           
           <Text style={{
           color: CurrentViewMode.Mode_fontColor,
            fontSize: size(14),
            marginLeft: width(5),
            position: 'absolute',
            bottom: height(4),
            fontWeight: "bold",
          }}>
           Portfolio statement
           </Text>
        
          </View>
  
  
          <View style={{
            backgroundColor: CurrentViewMode.Mode_bg,
            height: height(18),
            borderRadius: 15,
            width: width(45),
            marginRight: width(5),
  
          }}>
  
  
          <Feather name='file-text' style={{
              fontSize: size(25),
              color: CurrentViewMode.Mode_fontColor,
              marginTop: height(4),
              marginLeft: width(5),
            }} />
           
           <Text style={{
           color:  CurrentViewMode.Mode_fontColor,
            fontSize: size(14),
            marginLeft: width(5),
            position: 'absolute',
            bottom: height(4),
            fontWeight: "bold",
          }}>
           Crypto statement
           </Text>
        
          </View>
  
  
        </View>
       
     
  
  
        </ScrollView>
  
  </ActionSheet>
  
  
  
  );
  };
  
  