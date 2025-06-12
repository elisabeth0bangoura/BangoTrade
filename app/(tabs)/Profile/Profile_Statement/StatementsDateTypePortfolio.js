
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
import i18n from '../../../../Languages_Translation_Screens/i18n'; 
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

import { HomeChartContext } from '../../../Context/HomeChartContext';

import { AmountContext } from '../../../Context/OpenAmountSheetContext';
import { CoinPageContext } from '../../../Context/OpenCoinPageContext';
import { SellAmountContext } from '../../../Context/SellOpenAmountSheetContext';
import RNPickerSelect from "react-native-picker-select";

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '../../../Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from '../../../Context/ViewModeContext';


import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc, addDoc, collection, onSnapshot  } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";










export default function StatementsDateTypePortfolio () {

  const { t } = useTranslation();

  const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  

  const [AlpacaUserId, setAlpacaUserId] = useState();

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")

  const [Depot_number, setDepot_number] = useState("")


   
  const [Sum, setSum] = useState()

  const [equity, setEquity] = useState(null);
  const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)



    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);



    const StatementsDateTypePortfolio_Sheet = useRef(null)
  
   
    const { 
      AmountIndex, 
      setAmountIndex, 
      value, 
      setValue,
      valueShares, 
      setValueShares,
      CurrentBuyType, 
      setCurrentBuyType,
      rawValueShares, 
      setRawValuShares,
      rawValue, 
      setRawValue,
      OrderTypeIndex, 
      setOrderTypeIndex,
      SharesSellAmount, 
      setSharesSellAmount,
  
    } = useContext(SellAmountContext);
  
  
    const { 
      CoinPageIndex, 
      setCoinPageIndex,  
      CurrentBackgroundColorForCoin, 
      setCurrentBackgroundColorForCoin, coinData, setCoinData, coinSymbol, setCoinSymbol  } = useContext(CoinPageContext);
  














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
    
    
    
      const GetAccountValues = async () => {
        try {
          const options = {
            method: "GET",
            headers: {
              accept: "application/json",
              authorization:
                "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==",
            },
          };
    
          const response = await fetch(
            `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userData.AlpacaAccountId}/account`,
            options
          );
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data?.message || "Failed to fetch account equity.");
          }
    
          console.log(data); // ✅ Log equity for debugging
          setEquity(data.position_market_value); // ✅ Store equity in state
          setSetcash_withdrawable(data.cash)
          setSum(data.equity)
        } catch (err) {
          setError(err.message);
          console.error("❌ Error fetching trading account equity:", err);
        }
      };
    
      GetAccountValues();
    
             
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    };
    
    fetchUserData();
    }, [user?.uid]); // Make sure the effect runs whenever user.uid changes
    

  
  
  
  
    useEffect(() => {
  
  
      console.log("CurrentBuyType: ", CurrentBuyType)
  
    }, [])
  
  
  
  
    
  
    return(
  
  
      <ActionSheet ref={StatementsDateTypePortfolio_Sheet}
      //backgroundInteractionEnabled={false}
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
           maxHeight: "45%",
           backgroundColor: CurrentViewMode.Mode_bg,
           height: "45%",
           borderTopLeftRadius: 20,
           borderTopRightRadius: 20,
           
         }} 	
         style={{
           height: "100%",
           backgroundColor: CurrentViewMode.Mode_bg,
       }}>
     
        
        
             <Text numberOfLines={2} style={{
               fontSize: size(25),
               color: CurrentViewMode.Mode_fontColor,
               fontWeight: "900",
               width: "85%",
               marginLeft: width(5),
             //  top: height(-1)
             }}>
            {t("AccountStatementHeader")}     
           
             </Text>
   
  
  
  
             <View style={{
              alignItems: 'center',
              marginTop: height(3),
              alignSelf: 'center',
              width: width(90),
              flexDirection: 'row',
              gap: width(4),
             }}>
  
             <TouchableOpacity onPress={() => {
              setSharesSellAmount(t("AccountStatement1MonthTitle"))
             }}
             style={{
              width: width(43),
              backgroundColor: SharesSellAmount == t("AccountStatement1MonthTitle") ?  '#fff' :  CurrentViewMode.Mode_ButtonColor_Profile,
              height: size(60),
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
             }}>
  
              <Text style={{
                fontSize: size(16),
                fontWeight: "900",
                alignSelf: 'center',
                color: SharesSellAmount == t("AccountStatement1MonthTitle") ? "#000" :  CurrentViewMode.Mode_fontColor,
              }}>
              {t("AccountStatement1MonthTitle")}       
              </Text>
  
             </TouchableOpacity>
  
  
             <TouchableOpacity onPress={() => {
              setSharesSellAmount(t("AccountStatement3MonthTitle"))
             }}
             style={{
              width: width(43),
              backgroundColor: SharesSellAmount == t("AccountStatement3MonthTitle") ?  '#fff' :  CurrentViewMode.Mode_ButtonColor_Profile,
              height: size(60),
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
             }}>
  
              <Text style={{
                fontSize: size(16),
                fontWeight: "900",
                alignSelf: 'center',
                color: SharesSellAmount == t("AccountStatement3MonthTitle") ? "#000" :  CurrentViewMode.Mode_fontColor,
              }}>
              {t("AccountStatement3MonthTitle")}       
              </Text>
   
  
             </TouchableOpacity>
  
             </View>
  
  
             <View style={{
              alignItems: 'center',
              marginTop: height(2),
              alignSelf: 'center',
              flexDirection: 'row',
              gap: width(4),
              alignItems: 'center',
              justifyContent: 'center',
              
             }}>
  
             <TouchableOpacity onPress={() => {
              setSharesSellAmount(t("AccountStatement6MonthTitle"))
             }}
             style={{
              width: width(43),
              backgroundColor: SharesSellAmount == t("AccountStatement6MonthTitle") ?  '#fff' :  CurrentViewMode.Mode_ButtonColor_Profile,
              height: size(60),
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
             }}>
  
  
              <Text style={{
                fontSize: size(16),
                fontWeight: "900",
                alignSelf: 'center',
                color: SharesSellAmount == t("AccountStatement6MonthTitle") ? "#000" :  CurrentViewMode.Mode_fontColor,
              }}>
               {t("AccountStatement6MonthTitle")}        
              </Text>
  
             </TouchableOpacity>
  
  
             <TouchableOpacity onPress={() => {
            
              
              SheetManager.show("StatementsDatePickerAccount_Sheet");
             }}
             style={{
              width: width(43),
              backgroundColor: SharesSellAmount == "dots-horizontal" ?  '#fff' :  CurrentViewMode.Mode_ButtonColor_Profile,
              height: size(60),
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
             }}>
  
            <MaterialCommunityIcons name='dots-horizontal' style={{
              fontSize: size(25),
              color: SharesSellAmount == "dots-horizontal" ? "#000" : CurrentViewMode.Mode_fontColor,
            }} />
  
             </TouchableOpacity>
  
             </View>
  
  
  
             <View style={{
            marginTop: height(12)
          }}>
  
  
             {/* Submit Button */}
             
           
  
             <View style={{
               bottom: height(4),
               backgroundColor:CurrentViewMode.Mode_bg,
               width: "100%",
               position: 'absolute',
               height: height(8)
             }}> 
      
     
  
      
              <TouchableOpacity onPress={() => {
                  // Show the Sell Confirmation Shares Sheet
                  SheetManager.show('StatementsDatePickerAccount_Sheet');
  
              
                }}
              disabled={SharesSellAmount == "" ? true : false}
              style={{
                marginTop: 20,
                height: 50,
                backgroundColor: SharesSellAmount == ""  ? "#ccc" :  CurrentViewMode.Mode_fontColor,
                borderRadius: 10,
                position: 'absolute',
                bottom: height(0),
                width: width(35),
                paddingHorizontal: 30,
                right: width(5),
                opacity:  SharesSellAmount == ""  ? 0.3 :  100,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: size(18), color: CurrentViewMode.Mode_bg, fontWeight: 'bold',  }}>
              {t("AccountStatementNextButton")}         
              </Text>
        
              <AntDesign name="arrowright" style={{
                color: CurrentViewMode.Mode_bg,
                fontSize: size(20),
                right: width(5),
                position: 'absolute',
              }} />
            </TouchableOpacity>
  
  
  
  
     
    
  </View>
  
  </View>
   
   
   
   
       
         </ActionSheet>
  
    )
  
  }