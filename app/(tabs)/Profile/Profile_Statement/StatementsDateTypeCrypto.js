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
import { usePostHog } from 'posthog-react-native';











export default function StatementsDateTypeCrypto () {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


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




  const { t } = useTranslation();

    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    const [documents, setDocuments] = useState([]); // Stores fetched documents
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const StatementsDateTypeCrypto_Sheet = useRef(null)
  
   
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
        posthog.capture('screen_viewed', {
          screen: 'StatementsDateTypeCrypto_Sheet',
          $screen_name: 'StatementsDateTypeCrypto_Sheet',
          timestamp: new Date().toISOString(),
        });
      }, []);


  
  
    useEffect(() => {
  
  
      console.log("CurrentBuyType: ", CurrentBuyType)
  
    }, [])
  
  
  













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
    





















  
    
  
    return(
  
  
      <ActionSheet ref={StatementsDateTypeCrypto_Sheet}
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
     
         
        
             <Text style={{
               fontSize: size(25),
               color: CurrentViewMode.Mode_fontColor,
               fontWeight: "900",
               width: "85%",
               marginLeft: width(5),
             //  top: height(-1)
             }}>
              
            {t("StatementsDateTypeCryptoTitle")}     
           
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
              setSharesSellAmount(t("StatementsDateTypeCrypto1MonthTitle"))
             }}
             style={{
              width: width(43),
              backgroundColor: SharesSellAmount == t("StatementsDateTypeCrypto1MonthTitle") ?  '#fff' : CurrentViewMode.Mode_ButtonColor_Profile,
              height: size(60),
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
             }}>
  
              <Text style={{
                fontSize: size(16),
                fontWeight: "900",
                alignSelf: 'center',
                color: SharesSellAmount == t("StatementsDateTypeCrypto1MonthTitle") ? "#000" :  CurrentViewMode.Mode_fontColor,
              }}>
              {t("StatementsDateTypeCrypto1MonthTitle")}       
              </Text>
  
             </TouchableOpacity>
  
  
             <TouchableOpacity onPress={() => {
              setSharesSellAmount(t("StatementsDateTypeCrypto3MonthTitle"))
             }}
             style={{
              width: width(43),
              backgroundColor: SharesSellAmount == t("StatementsDateTypeCrypto3MonthTitle") ?  '#fff' : CurrentViewMode.Mode_ButtonColor_Profile,
              height: size(60),
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
             }}>
  
              <Text style={{
                fontSize: size(16),
                fontWeight: "900",
                alignSelf: 'center',
                color: SharesSellAmount == t("StatementsDateTypeCrypto3MonthTitle") ? "#000" :  CurrentViewMode.Mode_fontColor,
              }}>
              {t("StatementsDateTypeCrypto3MonthTitle")}    
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
              setSharesSellAmount(t("StatementsDateTypeCrypto6MonthTitle"))
             }}
             style={{
              width: width(43),
              backgroundColor: SharesSellAmount == t("StatementsDateTypeCrypto6MonthTitle") ?  '#fff' : CurrentViewMode.Mode_ButtonColor_Profile,
              height: size(60),
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
             }}>
  
  
              <Text style={{
                fontSize: size(16),
                fontWeight: "900",
                alignSelf: 'center',
                color: SharesSellAmount == t("StatementsDateTypeCrypto6MonthTitle") ? "#000" :  CurrentViewMode.Mode_fontColor,
              }}>
              {t("StatementsDateTypeCrypto6MonthTitle")}    
              </Text>
  
             </TouchableOpacity>
  
  
             <TouchableOpacity onPress={() => {
            
              
              SheetManager.show("StatementsDatePickerCrypto_Sheet");
             }}
             style={{
              width: width(43),
              backgroundColor: SharesSellAmount == "dots-horizontal" ?  '#fff' : CurrentViewMode.Mode_ButtonColor_Profile,
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
               backgroundColor: CurrentViewMode.Mode_bg,
               width: "100%",
               position: 'absolute',
               height: height(8)
             }}> 
      
  
      
              <TouchableOpacity onPress={() => {
                  // Show the Sell Confirmation Shares Sheet
                  SheetManager.show('StatementsDatePickerCrypto_Sheet');
  
              
                }}
              disabled={SharesSellAmount == "" ? true : false}
              style={{
                marginTop: 20,
                height: 50,
                backgroundColor: SharesSellAmount == ""  ? "#ccc" :  '#fff',
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
              <Text style={{ fontSize: size(18), fontWeight: 'bold',  }}>
              {t("StatementsDateTypeCryptoButtonNext")}    
              </Text>
        
              <AntDesign name="arrowright" style={{
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
  
  
  
  
  
  
  
  
  
  const ITEM_HEIGHT = 50; // Height of each row
  
  const MonthYearPicker = ({ selectedDate, onValueChange, scrollRef }) => {
    const localRef = useRef(null);
    const listRef = scrollRef || localRef; // Use external ref if provided
  
    const {
      AlpacaDateFormatStart,
      setAlpacaDateFormatStart,
      AlpacaDateFormatEnd,
      setAlpacaDateFormatEnd,
      selectedIndex,
      setSelectedIndex,
      combinedData,
      formatMonthYearToAPI,
    } = useContext(HomeContext);
  
    useEffect(() => {
      if (listRef.current && selectedIndex !== -1) {
        listRef.current.scrollToOffset({
          offset: selectedIndex * ITEM_HEIGHT,
          animated: false,
        });
      }
    }, []);
  
    // ✅ Optimized `renderItem` with `useCallback`
    const renderItem = useCallback(
      ({ item, index }) => (
        <TouchableOpacity
          style={[
            styles.itemContainer,
            selectedIndex === index ? styles.selectedItemContainer : {},
          ]}
          activeOpacity={1}
          hitSlop={{ top: 15, bottom: 15, left: 30, right: 30 }} // ✅ Makes scrolling easier
          onPress={() => {
            setSelectedIndex(index);
            onValueChange(combinedData[index]);
  
            // ✅ Update Alpaca API format states when clicking
            const { start, end } = formatMonthYearToAPI(combinedData[index]);
            setAlpacaDateFormatStart(start);
            setAlpacaDateFormatEnd(end);
          }}
        >
          <View style={styles.fullRowTouchable}>
            <Text
              style={[
                styles.itemText,
                selectedIndex === index ? styles.selectedText : {},
              ]}
            >
              {item}
            </Text>
          </View>
        </TouchableOpacity>
      ),
      [selectedIndex, combinedData]
    );
  
    return (
      <View style={{ height: 200, width: "100%", alignItems: "center" }}>
        <FlatList
          ref={listRef}
          data={combinedData}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          snapToAlignment="center"
          snapToInterval={ITEM_HEIGHT}
          bounces={false}
          decelerationRate="normal"
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          initialScrollIndex={selectedIndex}
          initialNumToRender={10} // ✅ Renders only 10 items first
          maxToRenderPerBatch={10} // ✅ Renders in batches of 10
          windowSize={5} // ✅ Keeps only 5 items in memory
          renderItem={renderItem}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
            if (selectedIndex !== index) {
              setSelectedIndex(index);
              onValueChange(combinedData[index]);
  
              // ✅ Update Alpaca API format when scrolling stops
              const { start, end } = formatMonthYearToAPI(combinedData[index]);
              setAlpacaDateFormatStart(start);
              setAlpacaDateFormatEnd(end);
            }
          }}
        />
     
     
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    itemContainer: {
      height: ITEM_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    fullRowTouchable: {
      width: "100%",
      height: ITEM_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
    },
    selectedItemContainer: {
     // backgroundColor: "#222",
    },
    itemText: {
      fontSize: 20,
      fontWeight: "400",
      color: "#333",
    },
    selectedText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#FFF",
    },
  });
  