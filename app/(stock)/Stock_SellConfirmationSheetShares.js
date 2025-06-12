// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, Dimensions, Easing, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import {AntDesign, Feather, Foundation, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons"
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
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from 'expo-linear-gradient';
import debounce from 'lodash.debounce';

import { CoinPageContext } from '../Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '../Context/CurrentCoinSelectedContext';
import CoinChart from './StockChart';
import { CurrentPriceContext } from '../Context/CurrentCoinPricePageContext';
import PagerView from 'react-native-pager-view';

import { SellAmountContext } from '../Context/SellOpenAmountSheetContext';

import { AddMoneyToAccountContext } from '../Context/AddMoneyToAccountContext';
import AddBankDetailsToAccount from './AddBankDetailsToAccount';
import { BuyConfirmationSheetContext } from '../Context/BuyConfirmationSheetContext';
import ActionSheet, {useSheetRef, FlatList, ScrollView, SheetManager} from 'react-native-actions-sheet';
import { IFollowingsCoinsContext } from '../Context/OpenIFollowingsCoinsSheetContext';

import { SearchContext } from '../Context/MainSearchIndexStateContext';
import { ToastMessageContext } from '../Context/ToastMessageContext';
import { ViewModeContext } from '../Context/ViewModeContext';


import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";
import { CashContext } from '../Context/CashContext';


















export const SellOrderTypeSharesSheetPage = () => {

  const { t } = useTranslation();


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const OrderType_Sheet = useRef(null)

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
      setSharesSellAmount, } = useContext(SellAmountContext);




  useEffect(() => {


    console.log("CurrentBuyType: ", CurrentBuyType)

  }, [])






  return(


    <ActionSheet ref={OrderType_Sheet}
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
   
         <ScrollView style={{
           backgroundColor: CurrentViewMode.Mode_bg,
         }}>
           <Text style={{
             fontSize: size(25),
             color: '#fff',
             fontWeight: "900",
             marginLeft: width(5),
             marginTop: height(3)
           }}>
             Trade Type
           </Text>
 
 
 
 
           <TouchableOpacity onPress={() => {
             setCurrentBuyType("Amount")
             setValueShares("0")
             setRawValuShares("0")
             SheetManager.hide("OrderType_Sheet");

           }}
           style={{
             marginTop: height(5),
             width: "90%",
             alignSelf: 'center',
             flexDirection: 'row',
             alignItems: 'center',
           }}>
 
             <View style={{
               height: 50,
               width: 50,
               marginRight: width(4),
              // marginLeft: width(2),
             }}> 
 
               <Foundation name='dollar' style={{
               color: '#fff',
               fontSize: size(42),
                 alignSelf: 'center',
          
             }} />
           </View>
 
             <View style={{       
               width: "85%",       
             }}> 
 
 
 
             <Text style={{
               fontSize: size(18),
               color: '#fff',
               fontWeight: "bold"
             }}>
               Amount
             </Text>
 
             <Text style={{
              fontSize: size(14),
              color: '#656A71',
              fontWeight: "bold",
              width: "80%",
               lineHeight: height(2.2),
              marginTop: height(0.5)
             }}>
             Purchase for any Fiat amount at the current coin exchange rate
             </Text>
             </View>
 
             {
               CurrentBuyType == "Amount"
 
               ?
 
               <MaterialIcons name='check' style={{
                 color: '#fff',
                 fontSize: size(25),
                 right: width(10),
               }} />
 
               :
 
               null
             }
 
         
 
 
           </TouchableOpacity>
 
 
 
           <TouchableOpacity onPress={() => {
             setCurrentBuyType("Shares")
             setValue("0")
             setRawValue("0")
             SheetManager.hide("OrderType_Sheet");
           }}
           style={{
             marginTop: height(5),
             width: "90%",
             alignSelf: 'center',
             flexDirection: 'row',
             alignItems: 'center'
           }}>
 
             <View style={{
               height: 50,
               width: 50,
               marginRight: width(4),
              // marginLeft: width(2),
             }}> 
               <MaterialCommunityIcons
 
               name='chart-donut-variant' style={{
               color: '#fff',
               alignSelf: 'center',
               fontSize: size(30),
              
          
             }} />
 
           </View>
 
             <View style={{       
               width: "85%",       
             }}> 
 
 
 
             <Text style={{
               fontSize: size(18),
               color: '#fff',
               fontWeight: "bold"
             }}>
               Shares
             </Text>
 
             <Text style={{
              fontSize: size(14),
              color: '#656A71',
              fontWeight: "bold",
              width: "80%",
               lineHeight: height(2.2),
              marginTop: height(0.5)
             }}>
             Buy any number of assets at the current coin price
             </Text>
             </View>
 
 
 
 
             {
               CurrentBuyType == "Shares"
 
               ?
 
               <MaterialIcons name='check' style={{
                 color: '#fff',
                 fontSize: size(25),
                 right: width(10),
               }} />
 
               :
 
               null
             }
 
           </TouchableOpacity>
 
 
 
 
         </ScrollView>
       </ActionSheet>

  )

}






















const StockSellConfirmationShares_Sheet =  React.memo(() => {


  const { t } = useTranslation();


  const Stock_SellConfirmationShares_Sheet = useRef(null);

     

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const currentUser = auth().currentUser;

  const {
    UserExpoPushTokenNew, 
    setUserExpoPushTokenNew,
    UserAlpacaAccountId, 
    setUserAlpacaAccountId,
    userId, 
    setuserId,
    PaymentReceivedText1,
    setPaymentReceivedText1,
    PaymentReceivedText2,
    setPaymentReceivedText2,
    PaymentReceivedText3,
    setPaymentReceivedText3,
  
   } = useContext(CashContext)

  




  const {
    showToastSell, 
    setShowToastSell,
    setSellPlacedOrder,
    SellPlacedOrder
     } = useContext(ToastMessageContext);



     


    const { currentPrice, setCurrentPrice, percentageChange, setPercentageChange, } = useContext(CurrentPriceContext);


    const { 
        AddMoneyToAccountIndex, 
        setAddMoneyToAccountIndex, 
        AddBankDetailsToAccountIndex, 
        setAddBankDetailsToAccountIndex 

    } = useContext(AddMoneyToAccountContext);




    
      const { 
        CoinPageIndex, 
        setCoinPageIndex,  
        CurrentBackgroundColorForCoin, 
        setCurrentBackgroundColorForCoin, coinData, setCoinData, coinSymbol, setCoinSymbol  } = useContext(CoinPageContext);
    
        const {IFollowingsCoinsIndex, setIFollowingsCoinsIndex } = useContext(IFollowingsCoinsContext);

        const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);

    const AmountsheetRef = useRef(null);
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
      setAssetQty_available,
      AssetQty_available,
      setSharesSellAmount, } = useContext(SellAmountContext);



    const windowHeight = Dimensions.get('window').height;
    const snapPointsAmount = useMemo(() => [windowHeight * 0.91], []);
    const [sharesToBuy, setSharesToBuy] = useState(null); // The calculated number of shares
    const [totalCost, setTotalCost] = useState(null);
    const [Fees, setFees] = useState(null);
    const [alpacaAssets, setAlpacaAssets] = useState([]);

    const [BuyQty, setBuyQty] = useState()
    const [alpacaCoinId, setAlpacaCoinId] = useState(null);
    const [alpacaMinOrderSize, setAlpacaMinOrderSize] = useState(null);
    const [alpacaStatus, setAlpacaStatus] = useState(null);
    const [AlpacaSymbol, setAlpacaSymbol] = useState()
    
    const [assetData, setAssetData] = useState(null);
    const [remainingQty, setRemainingQty] = useState(0);
    const [remainingUsdValue, setRemainingUsdValue] = useState(0);
    const [sellQty, setSellQty] = useState(0);
    const [sellUsdValue, setSellUsdValue] = useState(0);
    const [TotalProceeds, setTotalProceeds] = useState(0)
    const [TotalAmountToPay, setTotalAmountToPay] = useState(0)
    const [YouReceive, setYouReceive] = useState(0)


    const [isSellPlaced, setIsSellPlaced] = useState(false);

  

  const [UserLang, setUserLang] = useState()
  const [Depot_number, setDepot_number] = useState("")

  
  const [Sum, setSum] = useState()

  const [equity, setEquity] = useState(null);
  const [error, setError] = useState(null);
  const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)

  const [AlpacaUserId, setAlpacaUserId] = useState();

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")








  






    // Calculate the number of shares to buy
useEffect(() => {
  if (rawValue && coinData.price > 0) {
    const shares = rawValue / coinData.price;
    setSharesToBuy(shares.toFixed(6)); // Rounded to 2 decimal places
  }
}, [rawValue, coinData.price, sharesToBuy]);














const processedDocIds = useRef(new Set()).current;
const toastTriggered = useRef(false);

useEffect(() => {
  console.log("✅ Firestore listener initialized for Transaction_Activities");

  const unsubscribe = firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .collection('Transaction_Activities')
    .onSnapshot(snapshot => {
      console.log("📥 Snapshot triggered");

      snapshot.docChanges().forEach(change => {
        const docId = change.doc.id;
        const changeType = change.type;
        const docData = change.doc.data();

        console.log(`🔄 Document change detected: ${changeType}`, docId);

        // Skip if we've already processed this document unless it's modified
        if (processedDocIds.has(docId) && changeType !== 'modified') {
          console.log(`⏩ Skipping already processed doc: ${docId}`);
          return;
        }

        processedDocIds.add(docId);

        if (toastTriggered.current) {
          console.log("🚫 Toast already triggered. Skipping fetch.");
          return;
        }

 
        console.log("🚀 Triggering notification fetch...");

       // 👇 Immediately trigger push after placing the order
         const notifyImmediately = async () => {
           try {
              await axios.post("https://checkandnotify-jcraafcjna-uc.a.run.app/");
             console.log("🚀 Triggered notification loop");

             const res = await fetch("https://getaccountcashandchartdata-jcraafcjna-uc.a.run.app", {
               method: "POST",
               headers: {
                 "Content-Type": "application/json",
               },
               body: JSON.stringify({
                 userId: auth().currentUser.uid,
                 accountId: UserAlpacaAccountId,
                 pushToken: UserExpoPushTokenNew,
                 PaymentReceivedText1,
                 PaymentReceivedText2,
                 PaymentReceivedText3,
               }),
             });

             if (res.ok) {
               console.log("✅ Immediate notification pushed");
              // setShowToast(true); // ✅ show toast if needed
             } else {
               const errText = await res.text();
               console.error("❌ Immediate push API failed:", errText);
             }
           } catch (err) {
             console.error("❌ Error in manual push after order:", err);
           }
         };

         notifyImmediately();

      });

      const currentDocs = snapshot.docs.map(doc => doc.data());
      console.log("📊 Current Transaction_Activities:", currentDocs);
    });

  return () => {
    unsubscribe();
    console.log("🧹 Firestore listener cleaned up");
  };
}, []);











useEffect(() => {



  const fetchUserData = async () => {
    try {
      // Fetch user document from Firestore
      const userDocument = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();

      if (userDocument.exists) {
        // If the document exists, set the data
        const userData = userDocument.data();

        setAlpacaUserId(userData?.AlpacaAccountId);
        setUserFirstName(userData?.newAccountPayload?.identity?.given_name);
        setUserLastName(userData?.newAccountPayload?.identity?.family_name);

      }

            
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    };

    fetchUserData();
    
 }, [currentUser.uid]);




  
  const formatCurrency = (value) => {
    if (!value) return '0';
    
    return new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2, // Ensure two decimal places
    }).format(value);
  };
  

  const formatQuantity = (value) => {

      if (!value) return "0";
    
      const num = parseFloat(value);
      
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: num % 1 === 0 ? 0 : 6,  // 6 decimals for fractional shares
        maximumFractionDigits: 6,                      // Limit to 6 decimal places
        useGrouping: true,                             // Add thousand separator
      }).format(num);
    };
    


  
    useEffect(() => {
      let isMounted = true; // Prevent memory leaks
    
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==",
        },
      };
    
      // ✅ Fetch user's available crypto balance and price
      const fetchAssetData = async () => {
        try {
          const res = await fetch(
            `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/positions/${coinSymbol}`,
            options
          );
    
          if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
          }
    
          const data = await res.json();
          console.log("📊 Asset Data:", data);
    
          if (!data.qty_available || !data.current_price) {
            console.warn("⚠️ Missing qty_available or current_price in API response.");
            return null;
          }
    
          return data;
        } catch (error) {
          console.error("❌ Error fetching asset data:", error);
          return null;
        }
      };
    
      // ✅ Fetch 30-day trading volume to determine fee tier
      const fetchTradingVolume = async () => {
        try {
          const res = await fetch(
            `https://broker-api.sandbox.alpaca.markets/v1/accounts/activities?activity_type=FILL&page_size=100`,
            options
          );
    
          const data = await res.json();
          if (!Array.isArray(data) || data.length === 0) return 0;
    
          return data.reduce((total, activity) => {
            if (activity.activity_type === "FILL" && activity.side === "buy") {
              return total + parseFloat(activity.price) * parseFloat(activity.qty);
            }
            return total;
          }, 0);
        } catch (error) {
          console.error("❌ Error fetching 30-day trading volume:", error);
          return 0;
        }
      };
    
      // ✅ Main function to calculate fees and proceeds
      const calculateFeesAndProceeds = async () => {
        const assetData = await fetchAssetData();
        if (!assetData) return;


        console.log("Here  ", assetData)
    
        const { qty_available, current_price } = assetData;
        const totalQty = parseFloat(qty_available);
        const pricePerUnit = parseFloat(current_price);
        
        const sellQty = (SharesSellAmount / 100) * totalQty; // Amount being sold
        const sellUsdValue = sellQty * pricePerUnit; // Amount in USD
    
        // ✅ Fetch trading volume and determine fee tier
        const volume = await fetchTradingVolume();
    
        const feeTiers = [
          { volume: 100000000, taker: 0.10 },
          { volume: 50000000, taker: 0.12 },
          { volume: 25000000, taker: 0.13 },
          { volume: 10000000, taker: 0.15 },
          { volume: 5000000, taker: 0.18 },
          { volume: 1000000, taker: 0.20 },
          { volume: 500000, taker: 0.22 },
          { volume: 100000, taker: 0.25 },
          { volume: 0, taker: 0.25 },
        ];
    
        const tier = feeTiers.find((t) => volume >= t.volume) || feeTiers[feeTiers.length - 1];
        const takerFeeRate = tier.taker / 100;
    
        // ✅ Calculate total fees
        const takerFeeInUSD = sellUsdValue * takerFeeRate;
        const platformFee = 1.0; // Fixed $1 fee
        const Fees = takerFeeInUSD; // **Total Fees user has to pay**
        const totalFees = takerFeeInUSD + platformFee; // **Total Fees user has to pay**
        const finalProceeds = sellUsdValue - totalFees; // **What the user actually receives**
    
        if (isMounted) {
          setAssetData(assetData);
          setSellQty(sellQty.toFixed(6)); // 🔥 Amount of asset being sold
          setSellUsdValue(sellUsdValue.toFixed(2)); // 🔥 USD value of the sold amount
          setFees(Fees.toFixed(6)); // 🔥 **Total fees** (taker fee + $1)
          setTotalAmountToPay(totalFees.toFixed(2))
          setTotalAmountToPay(totalFees.toFixed(2)); // 🔥 **Total Fees**
          setTotalProceeds(finalProceeds.toFixed(2)); // 🔥 **User's actual final money received**
          setYouReceive(finalProceeds.toFixed(2))
        }
    
        console.log(`💰 Selling: ${sellQty.toFixed(6)} ${coinSymbol}`);
        console.log(`📉 Taker Fee (USD): ${takerFeeInUSD.toFixed(6)}`);
        console.log(`🏦 Platform Fee (USD): ${platformFee}`);
        console.log(`💸 Total Fees (USD): ${totalFees.toFixed(2)}`);
        console.log(`💵 Final Proceeds (USD): ${finalProceeds.toFixed(2)}`);
      };
    
      calculateFeesAndProceeds();
    
      return () => {
        isMounted = false; // Prevent memory leaks
      };
    }, [AlpacaUserId, coinSymbol, rawValue]); // ✅ Critical dependencies
    

    





const scrollY = useRef(new Animated.Value(0)).current;


  // Interpolate background color based on scroll position
  const bgColor = scrollY.interpolate({
    inputRange: [0, 204],
    outputRange: [coinData.dominantColor, '#0F0F0F'],
    extrapolate: 'clamp',
  });
  
  
  // Scroll handler to update scroll position with useNativeDriver for performance
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false, // We are not animating styles that require native driver (like background color)
    }
  );


  








 

 


return(


  <>
 







 <ActionSheet  id="Stock_SellConfirmationShares_Sheet"
  ref={Stock_SellConfirmationShares_Sheet}

  isModal={false} 

  backgroundInteractionEnabled={false}
  gestureEnabled={true}
  onClose={() => {
    toastTriggered.current = false;
    setShowToastSell(false); // ✅ hide toast

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
        backgroundColor: bgColor,
        borderTopLeftRadius: 20, // Rounded top corners
        borderTopRightRadius: 20, // Rounded top corners
        width: '100%', // Full width
        alignSelf: 'center', // Center the header
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
    
    


<ScrollView contentContainerStyle={{paddingBottom: height(20)}}  
        onScroll={handleScroll}
        scrollEventThrottle={6} // Increase the frequency of updates

      
      
style={{
  backgroundColor: CurrentViewMode.Mode_bg,
//  opacity: PriceTrackerIndex == 0 || AmountIndex == 0 ? 0 : 100,
  height: "100%",
 // zIndex: PriceTrackerIndex === 0 || AmountIndex === 0 ? -1 :  1,
}}>


      
<LinearGradient
 style={{
  height: height(50),
  width: "100%",
  top: 0,
  backgroundColor: CurrentViewMode.Mode_bg,
  position: 'absolute'
 }}
    locations={[0, 0.4, 1, 1]} 
    colors={[coinData.dominantColor, CurrentViewMode.Mode_bg, CurrentViewMode.Mode_bg]} />



<View style={{
    height: size(40),
    width: size(40),

    marginLeft: width(5),
    borderRadius: size(40)/2,
    overflow: 'hidden',
    backgroundColor: "#fff",


  }}>
    <Image source={{uri: coinData.image}} style={{
      height: "100%",
      width: "100%"
    }} />
  </View>
    




    <Text style={{
      fontSize: size(20),
      fontWeight: "900",
      marginTop: height(5),
      marginLeft: width(5),
      color: CurrentViewMode.Mode_fontColor,
    }}>


{t("SellButtonTitleSellConfirmationSheet")}  {SharesSellAmount} % {t("OfYourPositionTextSellConfirmationSheet")} 
    </Text>








    <View style={{
      flexDirection: 'row',
      marginTop: height(8),
      width: "85%",
      alignSelf: 'center'
    }}>
      <Text style={{
        color: CurrentViewMode.Mode_Sec_fontColor,
        fontSize: size(15),
        fontWeight: "bold",
      }}>
     {t("PaymentTitleSellConfirmationSheet")}  
      </Text>

      <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        right: width(0),
        fontWeight: "800",
        fontSize: size(15),
        position: 'absolute',
      }}>
     {t("CashTitleSellConfirmationSheet")}    
      </Text>
    </View>














    <View style={{
      flexDirection: 'row',
      marginTop: height(4),
      width: "85%",
      alignSelf: 'center'
    }}>
      <Text style={{
        color: CurrentViewMode.Mode_Sec_fontColor,
        fontSize: size(15),
        fontWeight: "bold",
      }}>
       {t("OrdertypeTitleSellConfirmationSheet")}      
      </Text>

      <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        right: width(0),
        fontWeight: "800",
        fontSize: size(15),
        position: 'absolute',
      }}>
     {t("SellTitleSellConfirmationSheet")}        
      </Text>
    </View>







    <View style={{
      flexDirection: 'row',
      marginTop: height(4),
      width: "85%",
      alignSelf: 'center'
    }}>
      <Text style={{
        color: CurrentViewMode.Mode_Sec_fontColor,
        fontSize: size(15),
        fontWeight: "bold",
      }}>
      {t("AssetTitleSellConfirmationSheet")}         
      </Text>

      <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        right: width(0),
        fontWeight: "800",
        fontSize: size(15),
        position: 'absolute',
      }}>
      {coinData.name}
      </Text>
    </View>





    <View style={{
      flexDirection: 'row',
      marginTop: height(4),
      width: "85%",
      alignSelf: 'center'
    }}>
      <Text style={{
        color: CurrentViewMode.Mode_Sec_fontColor,
        fontSize: size(15),
        fontWeight: "bold",
      }}>
      {t("SharesTitleSellConfirmationSheet")}       
      </Text>

      <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        right: width(0),
        fontWeight: "800",
        fontSize: size(15),
        position: 'absolute',
      }}>
      {formatQuantity(sellQty)}
      </Text>
    </View>


 
 
    <View style={{
      flexDirection: 'row',
      marginTop: height(4),
      width: "85%",
      alignSelf: 'center'
    }}>
      <Text style={{
        color: CurrentViewMode.Mode_Sec_fontColor,
        fontSize: size(15),
        fontWeight: "bold",
      }}>
       {t("AssetPriceTitleSellConfirmationSheet")}     
      </Text>

      <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        right: width(0),
        fontWeight: "800",
        fontSize: size(15),
        position: 'absolute',
      }}>
      {formatCurrency(coinData.price)} 
      </Text>
    </View>



    <View style={{
      flexDirection: 'row',
      marginTop: height(4),
      width: "85%",
      alignSelf: 'center'
    }}>
      <Text style={{
        color: CurrentViewMode.Mode_Sec_fontColor,
        fontSize: size(15),
        fontWeight: "bold",
      }}>
       {t("TotalFeesTitleSellConfirmationSheet")}     
      </Text>

      <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        right: width(0),
        fontWeight: "800",
        fontSize: size(15),
        position: 'absolute',
      }}>
     {formatCurrency(TotalAmountToPay)} 
      </Text>
    </View>




    <View style={{
      flexDirection: 'row',
      marginTop: height(4),
      width: "85%",
      alignSelf: 'center'
    }}>
      <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        fontSize: size(15),
        fontWeight: "bold",
      }}>
      {t("YouReceiveTitleSellConfirmationSheet")}   
      </Text>

      <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        right: width(0),
        fontWeight: "800",
        fontSize: size(15),
        position: 'absolute',
      }}>
      {formatCurrency(YouReceive)} 
      </Text>
    </View>




    <Text style={{
      width: "90%",
      fontSize: size(13),
     marginLeft: width(8),
     lineHeight: height(2.5),
     fontWeight: "bold",
      marginTop: height(5),
      color: CurrentViewMode.Mode_Third_fontColor,
    }}>
     {t("SmallTextAlpacaSellConfirmationSheet1")} <Text style={{color: "#691AF5",  fontWeight: "bold", fontSize: size(13),}}>{t("SmallTextAlpacaSellConfirmationSheet2")} </Text> {t("SmallTextAlpacaSellConfirmationSheet3")}
    </Text>
        </ScrollView>





        <View style={{
               position: 'absolute',
               bottom: height(6),
               flexDirection: 'row'
        }}>
        <TouchableOpacity onPress={() => CloseAddMoneyToAccountSheet()}
        style={{
            height: size(55),
            width: size(55),
            marginLeft: width(5),
            backgroundColor:  CurrentViewMode.Mode_ButtonColor_Profile,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
        }}>
            <MaterialIcons name="arrow-back-ios" style={{
                fontSize: size(18),
                color: CurrentViewMode.Mode_fontColor,

            }} />
        </TouchableOpacity>




 <TouchableOpacity onPress={async () => {



const sellCrypto = async () => {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
    },

    body: JSON.stringify({
      type: 'market',
      time_in_force: 'day',
      side: 'sell',
      symbol: coinSymbol,
      qty: sellQty,
  })
};



      await fetch(
      `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/orders`, options)

      .then(res => res.json())
      .then(res => {
        console.log(res)


        const Test = async () => {
          await fetch("https://getaccountcashandchartdata-jcraafcjna-uc.a.run.app", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId:  auth().currentUser.uid,
              accountId: UserAlpacaAccountId,
              pushToken: UserExpoPushTokenNew,
              PaymentReceivedText1: PaymentReceivedText1,
              PaymentReceivedText2: PaymentReceivedText2,
              PaymentReceivedText3: PaymentReceivedText3,
            })
            
          }).then(() => {


        setSellPlacedOrder(true); // ✅ Only now mark it as placed

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);



            Promise.all([
              SheetManager.hide("Stock_SellConfirmationShares_Sheet"),
              SheetManager.hide("Stock_SellAmounts_Sheet"),
              SheetManager.hide("Stock_SellAmountType_Sheet"),
              SheetManager.hide("StockPage_Sheet"),
              SheetManager.hide("SearchPage_Sheet"),
           
            ]).then(() => {
              console.log("✅ All sheets closed!");
            }).catch(err => console.error("❌ Error closing sheets:", err));
          
          console.log("🚀 Triggered Transaction Check in Foreground");
        }) .catch((err) => {
          console.error("❌ Error Transaction Check in Foreground", err);
        });
      }
      Test()
      
     
      })

  } 



sellCrypto()



  }}
  style={{
    height: size(55),
    // width: width(35),
    marginLeft: width(47),
    paddingHorizontal: size(20),
    backgroundColor: CurrentViewMode.Mode_fontColor,
    alignItems: 'center',

    borderRadius: 10,
    flexDirection: 'row',
  }}>
     <Text style={{
      fontSize: size(18),
      fontWeight: "bold", 
      color: CurrentViewMode.Mode_bg,
      marginLeft: 20,
     }}>
     {t("SellButtonTitle")} 
     </Text>

     <MaterialIcons name='check' style={{
      color: CurrentViewMode.Mode_bg,
    
      marginLeft: width(2),
      fontSize: size(25)

     }} />
  </TouchableOpacity>

</View>


      </ActionSheet>





<AddBankDetailsToAccount />

      </>
);
});


export default StockSellConfirmationShares_Sheet;