// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, Dimensions, Easing, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import {AntDesign, Feather, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons"
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

import { AmountContext } from '../Context/OpenAmountSheetContext';

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
















export const StockBuyOrderTypeSheetPage = () => {


  const { t } = useTranslation();

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const StockBuyOrderType_Sheet = useRef(null)

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
    setOrderTypeIndex, } = useContext(AmountContext);




  useEffect(() => {


    console.log("CurrentBuyType: ", CurrentBuyType)

  }, [])






  return(


    <ActionSheet ref={StockBuyOrderType_Sheet}
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
         backgroundColor: "#0F0F0F",
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
         backgroundColor: "#0F0F0F",
         height: "45%",
         borderTopLeftRadius: 20,
         borderTopRightRadius: 20,
         
       }} 	
       style={{
         height: "100%",
         backgroundColor: '#0F0F0F'
     }}>
   
         <ScrollView style={{
           backgroundColor: "#0F0F0F"
         }}>
           <Text style={{
             fontSize: size(25),
             color: '#fff',
             fontWeight: "900",
             marginLeft: width(5),
             marginTop: height(3)
           }}>
            {t("OrdertypeTitleSellConfirmationSheet")}      
           </Text>
 
 
 
 
           <TouchableOpacity onPress={() => {
             setCurrentBuyType("Amount")
             setValueShares("0")
             setRawValuShares("0")
             SheetManager.hide("StockOrderType_Sheet");

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
                {t("AmountButtonText")}  
             </Text>
 
             <Text style={{
              fontSize: size(14),
              color: '#656A71',
              fontWeight: "bold",
              width: "80%",
               lineHeight: height(2.2),
              marginTop: height(0.5)
             }}>
             {t("AmountButtonTextBuyOrderTypeSheetPage")}   
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
             SheetManager.hide("StockOrderType_Sheet");
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
              {t("SharesTitleSellConfirmationSheet")}
             </Text>
 
             <Text style={{
              fontSize: size(14),
              color: '#656A71',
              fontWeight: "bold",
              width: "80%",
               lineHeight: height(2.2),
              marginTop: height(0.5)
             }}>
              {t("BuyAnyNumberTextBuyOrderTypeSheetPage")}
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





















const StockBuyConfirmationSheet =  React.memo(() => {


  const { t } = useTranslation();

  const currentUser = auth().currentUser;

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

	const {
		BuyConfirmationSheetIndex, 
		setBuyConfirmationSheetIndex,
	   } = useContext(BuyConfirmationSheetContext);

 
     
       const {
        showToast, 
        setShowToast,
        setPlacedOrder,
        PlacedOrder,
         } = useContext(ToastMessageContext);
  


      const [BuyOrder, setBuyOrder] = useState(false)
      const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);

    const { currentPrice, setCurrentPrice, percentageChange, setPercentageChange, } = useContext(CurrentPriceContext);

    const {IFollowingsCoinsIndex, setIFollowingsCoinsIndex } = useContext(IFollowingsCoinsContext);

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
      setOrderTypeIndex, } = useContext(AmountContext);



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
    



    const [AlpacaUserId, setAlpacaUserId] = useState();


  const [UserLang, setUserLang] = useState()
  const [Depot_number, setDepot_number] = useState("")

  
  const [Sum, setSum] = useState()

  const [equity, setEquity] = useState(null);
  const [error, setError] = useState(null);
  const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")






 // hooks
 const sheetRefBuyConfirmation = useRef(null);

 // variables
 const snapPointsBuyConfirmation = useMemo(() => ["91%"], []);

 

 const handleSheetChangeBuyConfirmation = useCallback((index) => {
   console.log("Sheet index AddMoneyToAccount changed:", index);
 }, []);



 const CloseAddMoneyToAccountSheet = () => {
  SheetManager.hide("StockBuyConfirmation_Sheet");

  setBuyConfirmationSheetIndex(-1)
  sheetRefBuyConfirmation.current?.close();
 }


/*
 useEffect(() => {
    if (BuyConfirmationSheetIndex == -1) {
      sheetRefBuyConfirmation.current?.close();
    } 
  }, [BuyConfirmationSheetIndex]);

  */







useEffect(() => {

  const fetchUserData = async () => {
    try {
      // Fetch user document from Firestore
      const userDocument = await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
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
    
 }, [AlpacaUserId, currentUser.uid]);












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
    if (BuyConfirmationSheetIndex == 0) {
      sheetRefBuyConfirmation.current?.snapToIndex(0);

    } 
  }, [AlpacaUserId, BuyConfirmationSheetIndex]);


  






    // Calculate the number of shares to buy
useEffect(() => {
  if (rawValue && coinData.price > 0) {
    const shares = rawValue / coinData.price;
    setSharesToBuy(shares.toFixed(6)); // Rounded to 2 decimal places
  }
}, [AlpacaUserId, rawValue, coinData.price]);













  // Function to fetch Alpaca assets and store them in state

  const accountId = 'dc053145-9232-4c82-9d13-6e53a104750f'; // Your Alpaca account ID


  const formatCurrency = (value) => {
    if (!value) return '0';
  
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };
  
  const formatQuantity = (value) => {
    if (!value) return "0";
  
    const num = parseFloat(value);
    
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: num % 1 === 0 ? 0 : 6,  // Show 6 decimals only if needed
      maximumFractionDigits: 6,                      // Keep up to 6 decimal places
      useGrouping: true,                             // Add thousand separator
    }).format(num);
  };
  
  useEffect(() => {
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
  
    const getFeeTier = (volume) => {
      for (let i = 0; i < feeTiers.length; i++) {
        if (volume >= feeTiers[i].volume) {
          return feeTiers[i];
        }
      }
      return feeTiers[feeTiers.length - 1];
    };
  
    const fetchTradingVolume = async () => {
      try {
        const response = await fetch(
          `https://broker-api.sandbox.alpaca.markets/v1/accounts/activities?account_id=${AlpacaUserId}&activity_type=FILL&page_size=100`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==',
            },
          }
        );
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          return 0;
        }
        return data.reduce((total, activity) => {
          if (activity.activity_type === "FILL" && activity.side === "buy") {
            return total + parseFloat(activity.price) * parseFloat(activity.qty);
          }
          return total;
        }, 0);
      } catch (error) {
        console.error("Error fetching 30-day trading volume:", error);
        return 0;
      }
    };
  
    const calculateCost = async () => {
      const volume = await fetchTradingVolume();
      const tier = getFeeTier(volume);
      const takerFeeRate = tier.taker / 100;
    
      const investmentAmount = parseFloat(rawValue);
      if (isNaN(investmentAmount) || investmentAmount <= 0) return;
    
      const takerFeeInUSD = investmentAmount * takerFeeRate;
      const netInvestmentAmount = investmentAmount - takerFeeInUSD;
    
      // ✅ Correct Quantity Calculation (Handles BTC & Expensive Assets)
      let quantity = netInvestmentAmount / currentPrice;
      quantity = parseFloat(quantity.toFixed(8)); // ✅ Keeps up to 8 decimals (for BTC)
    
      const totalCostInUSD = investmentAmount + takerFeeInUSD + 1;
    
      setTotalCost(totalCostInUSD.toFixed(2));
      setFees(takerFeeInUSD.toFixed(2));
      setBuyQty(quantity); // ✅ Displays correct fractional BTC amount
    
      console.log(`✅ Investment Amount: ${investmentAmount}`);
      console.log(`💸 Taker Fee: ${takerFeeInUSD}`);
      console.log(`📊 Total Cost: ${totalCostInUSD}`);
      console.log(`🔢 Quantity (Fixed for ${coinSymbol}): ${quantity}`);
    };
    
  
    if (rawValue && currentPrice) {
      calculateCost();
    }
  }, [AlpacaUserId, rawValue, currentPrice]);
  


const StockBuyConfirmation_Sheet = useRef(null);










const scrollY = useRef(new Animated.Value(0)).current;


  // Interpolate background color based on scroll position
  const bgColor = scrollY.interpolate({
    inputRange: [0, 204],
    outputRange: [coinData.dominantColor, CurrentViewMode.Mode_bg_Profile],
    extrapolate: 'clamp',
  });
  
  
  // Scroll handler to update scroll position with useNativeDriver for performance
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false, // We are not animating styles that require native driver (like background color)
    }
  );

  const calculatedHeight = windowHeight * 0.88;








	const ToastMessage = ({ message, onClose, visible, onAnimationEnd }) => {
		const translateY = useRef(new Animated.Value(-100)).current; // Start off-screen
	  
		useEffect(() => {
		  if (visible) {
			console.log("🔥 Toast is visible, starting animation...");
			Animated.timing(translateY, {
			  toValue: 0, // Slide down to visible
			  duration: 500,
			  easing: Easing.out(Easing.ease),
			  useNativeDriver: true,
			}).start(() => {
			  setTimeout(() => {
				Animated.timing(translateY, {
				  toValue: -100, // Slide back up
				  duration: 500,
				  easing: Easing.in(Easing.ease),
				  useNativeDriver: true,
				}).start(() => {
				  console.log("🔥 Hiding Toast...");
				  onClose(); // Hide the toast after animation
				  if (onAnimationEnd) onAnimationEnd(); // Call callback when toast fully hides
				});
			  }, 5000); // Display for 5 seconds
			});
		  }
		}, [visible]);
	  
		return visible ? (
		  <Animated.View
				style={{
				  transform: [{ translateY }],
				  height: height(20),
				  width: "100%",
				  backgroundColor: "#44D700",
				  position: 'absolute',
				  top: 0,
				  zIndex: 1000,
				}}
			  >
				<View
				  style={{
					marginTop: height(10),
					flexDirection: 'row',
					alignItems: 'center',
				  }}
				>
				  <MaterialIcons
					name="error"
					style={{
					  color: '#000',
					  fontSize: size(25),
					  marginLeft: width(10),
					}}
				  />
				  <Text
					style={{
					  fontSize: size(18),
					  width: "50%",
					  fontWeight: "bold",
					  marginLeft: width(5),
					}}
				  >
					{message}
				  </Text>
				</View>
			  </Animated.View>
		) : null;
	  };
	  
	  
	  const memoizedToastMessage = useMemo(() => {
		return showToast ? (
		  <ToastMessage 
			message="Purchase successful!" 
			visible={showToast} 
			onClose={() => {
			  console.log("🔥 Closing Toast...");
			  setShowToast(false);
			}}
		  />
		) : null;
	  }, [showToast]); // ✅ Only re-renders when `showToast` changes
	  

  



    

  

return(


  <>
 


 <ActionSheet  
  ref={StockBuyConfirmation_Sheet}
 backgroundInteractionEnabled={false}
  gestureEnabled={true}
  isModal={false} 
  onClose={() => {
    toastTriggered.current = false;
    setShowToast(false); // ✅ hide toast
  }}
  CustomHeaderComponent={
<> 



  

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
      {t("InvestBuyConfirmationSheet")} {formatCurrency(rawValue)} 
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
      {t("BuyTitleSellConfirmationSheet")}        
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

      <Text numberOfLines={1} style={{
        color: CurrentViewMode.Mode_fontColor,
        right: width(0),
        fontWeight: "800",
        width: width(55),
        textAlign: 'right',
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
      {formatQuantity(BuyQty)}
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
     {formatCurrency(Fees)} 
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
       {t("InTotalTitleSellConfirmationSheet")}    
      </Text>

      <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        right: width(0),
        fontWeight: "800",
        fontSize: size(15),
        position: 'absolute',
      }}>
      {formatCurrency(totalCost)} 
      </Text>
    </View>




    <Text style={{
      width: "85%",
      fontSize: size(13),
     marginLeft: width(8),
     lineHeight: height(2.5),
     fontWeight: "bold",
      marginTop: height(5),
      color: CurrentViewMode.Mode_Sec_fontColor,
    }}>
      {t("SmallTextAlpacaBuyConfirmationSheet1")} <Text style={{color: "#691AF5",  fontWeight: "bold", fontSize: size(13),}}>{t("SmallTextAlpacaBuyConfirmationSheet2")}</Text>
    </Text>

        </ScrollView>





        <View style={{
               position: 'absolute',
               bottom: height(7),
               flexDirection: 'row'
        }}>
        <TouchableOpacity onPress={() => CloseAddMoneyToAccountSheet()}
        style={{
            height: size(55),
            width: size(55),
            marginLeft: width(5),
            backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
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


      
const BuyCrypto = async () => {
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
      symbol:coinSymbol,
      notional: parseFloat(coinData.price).toFixed(2),
      side: 'buy',
    })
  };


      await fetch(
      `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/orders`, options)

      .then(res => res.json())
      .then(res => {



  
      
        console.log(res)
 
        setPlacedOrder(true); // ✅ Step 1: trigger toast

         // ✅ Mark that an order was placed
         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // ✅ Step 2: wait for toast to show (you can adjust 600ms to match your animation)
        setTimeout(() => {
          Promise.all([
            SheetManager.hide("StockBuyConfirmation_Sheet"),
            SheetManager.hide("StockMoneyAmount_Sheet"),
            SheetManager.hide("StockPage_Sheet"),
            SheetManager.hide("SearchPage_Sheet"),
          ])
            .then(() => {
              console.log("✅ All sheets closed!");
            })
            .catch(err => console.error("❌ Error closing sheets:", err));
        }, 600); // ⏳ delay to let the toast appear first
                
          console.log("🚀 Triggered Transaction Check in Foreground");
        }) .catch((err) => {
          console.error("❌ Error Transaction Check in Foreground", err);
        });
  //    }
    //  Test()
      

      
    //  })

  } 



  BuyCrypto()




  }}
  style={{
      height: size(55),
      width: width(35),
      marginLeft: width(60),
      position: 'absolute',
      backgroundColor: CurrentViewMode.Mode_fontColor,
      alignItems: 'center',

      borderRadius: 10,
      flexDirection: 'row',
  }}>
     <Text style={{
      color: CurrentViewMode.Mode_bg,
      fontSize: size(18),
      fontWeight: "bold",
      marginLeft: 20,
     }}>
     {t("BuyTitleSellConfirmationSheet")}
     </Text>

     <MaterialIcons name='check' style={{
      color: CurrentViewMode.Mode_bg,
      position: 'absolute',
        right: width(5),
      fontSize: size(25)

     }} />
  </TouchableOpacity>

</View>


      </ActionSheet>






<AddBankDetailsToAccount />
   


      </>
);
});


export default StockBuyConfirmationSheet;