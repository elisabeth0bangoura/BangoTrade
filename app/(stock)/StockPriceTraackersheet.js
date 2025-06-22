// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, Button, Dimensions, Easing, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import {AntDesign, Feather, Foundation, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import axios from 'axios';
import CountryFlag from "react-native-country-flag";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';


import { BlurView } from 'expo-blur'; // If you're using Expo
import { LineChart } from 'react-native-wagmi-charts';
import { Platform } from 'react-native';
import { Link } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'
import { LinearGradient } from 'expo-linear-gradient';
import debounce from 'lodash.debounce';

import { CoinPageContext } from '../Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '../Context/CurrentCoinSelectedContext';
import CoinChart from './StockChart';
import { CurrentPriceContext } from '../Context/CurrentCoinPricePageContext';
import PagerView from 'react-native-pager-view';

import { PriceTrackerContext } from '../Context/OpenPriceTrackerSheetContext';
import { AmountContext } from '../Context/OpenAmountSheetContext';
import ActionSheet, {ScrollView, SheetManager, FlatList, FlashList} from "react-native-actions-sheet";
import { ViewModeContext } from '../Context/ViewModeContext';

import { getFirestore, doc, getDoc, collection, addDoc, setDoc } from '@react-native-firebase/firestore';

import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "@react-native-firebase/auth";
import { ToastMessageContext } from '../Context/ToastMessageContext';
import { t } from 'i18next';
import { IFollowingsCoinsContext } from '../Context/OpenIFollowingsCoinsSheetContext';
import { SearchContext } from '../Context/MainSearchIndexStateContext';
import { BuyConfirmationSheetContext } from '../Context/BuyConfirmationSheetContext';
import { usePostHog } from 'posthog-react-native';





















const StockPriceTraackersheet =  React.memo(({ sheetId, payload }) => {
  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const [CurrentBanalce, setCurrentBanalce] = useState(0)
  const [AbleToBuy, setAbleToBuy] = useState(false); // Initialize state



	const {
    showToast,
		setShowToast
	   } = useContext(BuyConfirmationSheetContext);


   
  const { 
    CoinPageIndex, 
    setCoinPageIndex,  
    CurrentBackgroundColorForCoin, 
    setCurrentBackgroundColorForCoin, setCoinData, coinSymbol, setCoinSymbol  } = useContext(CoinPageContext);

    const {IFollowingsCoinsIndex, setIFollowingsCoinsIndex } = useContext(IFollowingsCoinsContext);

    const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);


  const {
    ShowPriceTickerSaved, 
    setShowPriceTickerSaved,
     } = useContext(ToastMessageContext);


  const { 
    CurrentBuyType, 
    setCurrentBuyType,
    value, 
    setValue,
    rawValue, 
    setRawValue,
    valueShares, 
    setValueShares,
    rawValueShares, 
    setRawValuShares,


  } = useContext(PriceTrackerContext);

  const auth = getAuth();
  const db = getFirestore();

  const currentUser = auth.currentUser;

  const { coinData, dominantColor } = payload || {}; // Extract coinData properly

    // variables
    const [OrderTypeIndex, setOrderTypeIndex] = useState(-1);


    const { AmountIndex, setAmountIndex } = useContext(AmountContext);
    const { currentCoinSelected, setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);

    const { currentPrice, setCurrentPrice, percentageChange, setPercentageChange, } = useContext(CurrentPriceContext);

    const PriceTraackersheetRef = useRef(null);
    // variables


    const { PriceTrackerIndex, setPriceTrackerIndex } = useContext(PriceTrackerContext);
    const priceChangeColor = percentageChange > 0 ? '#00CE39' : '#FE1B20';

    const windowHeight = Dimensions.get('window').height;
    const snapPointsPriceTracker = useMemo(() => [windowHeight * 0.91], []);
    













    useEffect(() => {
      posthog.capture('screen_viewed', {
        screen: 'Stock_Price_Tracker_Page',
        $screen_name: 'Stock_Price_Tracker_Page '+" / "+coinData.name,
        timestamp: new Date().toISOString(),
      });
    }, []);
    













    const handleOpenPriceTracker = useCallback(() => {
        setPriceTrackerIndex(0); // This triggers the effect in PriceTraackersheet to open the BottomSheet.
      }, []);

    useEffect(() => {
        if (PriceTrackerIndex === 0) {
          PriceTraackersheetRef.current?.snapToIndex(0);
        } 
      }, [PriceTrackerIndex]);
    

      // callbacks
      const handleSheetChangeAmount = useCallback((index) => {
        console.log("handleSheetChange", index);
            if(PriceTrackerIndex == 0) {

        PriceTraackersheetRef.current?.snapToIndex(0);
    } else {
      setPriceTrackerIndex(-1)
    }

      }, []);
    
  


      const sheetRefOrdertype = useRef(null); // ✅ Correct ref type

     // ✅ Adjusted Snap Points - Matches Gorhom Example
  const snapPoints = useMemo(() => ["45%"], []);



  // ✅ Open BottomSheet using Gorhom's method
  const handleOpenOrderType = useCallback(() => {
    console.log("Opening Order Type Sheet");
    sheetRefOrdertype.current?.snapToIndex(1); // Open to 90%
    setOrderTypeIndex(0)
    console.log("OrderTypeIndex ",  OrderTypeIndex)
  }, []);

  // ✅ Handle Close (Like in Gorhom's Example)
  const handleClosePress = useCallback(() => {
    console.log("Closing Order Type Sheet");
    sheetRefOrdertype.current?.close();
  }, []);




  const renderBackdropSearch = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
		onPress={() => {
			if (OrderTypeIndex === 2) {
				setOrderTypeIndex(1)
			}
		  }}
      />
    ),
    [OrderTypeIndex]
  );

// Check if the user can afford the typed quantity
useEffect(() => {
  if (rawValueShares && currentPrice > 0) {
    const totalCost = parseFloat(rawValueShares.replace(/,/g, '')) * currentPrice;

    if (totalCost <= CurrentBanalce) {
      setAbleToBuy(true);
    } else {
      setAbleToBuy(false);
    }
  } else {
    setAbleToBuy(false);
  }
}, [rawValueShares, currentPrice, CurrentBanalce]); // Trigger whenever quantity, asset price, or balance changes














  
  

  

  
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;
  
  

  

  
  const formatNumber = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat('us-US').format(Number(num.replace(/\./g, '')));
  };
  

  
  const handlePress = (key) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  
    let newRawValue = rawValue;
  
    if (key === 'backspace') {
      newRawValue = newRawValue.slice(0, -1) || '0'; // Prevent empty value
    } else if (key === '.' && !newRawValue.includes('.')) {
      newRawValue += '.'; // Add a comma as a decimal separator
    } else if (!isNaN(key) && key !== '.') {
      newRawValue = newRawValue === '0' ? key : newRawValue + key; // Append numbers
    }
  
    // Ensure no invalid characters exist (only digits and one comma allowed)
    newRawValue = newRawValue.replace(/[^0-9.]/g, '');
  
    setRawValue(newRawValue);
  
    setValue(formatNumberForDisplay(newRawValue)); // Format for display (comma for decimals)
  
    checkAbleToBuy(newRawValue); // Check affordability
  
    animateValue();
  };
  
  
  const formatNumberForDisplay = (num) => {
    if (!num) return '0';
    
    const [integer, decimal] = num.split(',');
    
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Thousand separator as '.'
    
    return decimal !== undefined ? `${formattedInteger},${decimal}` : formattedInteger;
  };
  
  
  const checkAbleToBuy = (typedAmount) => {
    const amountToCheck = parseFloat(typedAmount.replace(/\./g, '').replace(/,/g, '.')); // Convert to valid float
    if (!isNaN(amountToCheck) && amountToCheck <= CurrentBanalce) {
      setAbleToBuy(true);
    } else {
      setAbleToBuy(false);
    }
  };
  
  
  const animateValue = () => {
    scaleAnimation.setValue(1.2); // Start at a slightly larger size
  
    Animated.spring(scaleAnimation, {
      toValue: 1,
      friction: 4,   // Less friction for a softer bounce
      tension: 80,   // Adjust tension for a faster effect
      useNativeDriver: true,
    }).start();
  };
  






// Shares
const scaleAnimationShares = useRef(new Animated.Value(1)).current;
const opacityAnimatioShares = useRef(new Animated.Value(1)).current;

const formatNumberShares = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('us-US').format(Number(num.replace(/\./g, '')));
};

const animateValueShares = () => {
  Animated.sequence([
    Animated.timing(scaleAnimationShares, {
      toValue: 1.1,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(scaleAnimationShares, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};

const handlePressShares = (key) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  let newRawValueShares = rawValueShares;

  if (key === 'backspace') {
    newRawValueShares = newRawValueShares.slice(0, -1) || '0';
  } else if (key === '.' && !newRawValueShares.includes('.')) {
    // Allow dot for decimal precision if not already present
    newRawValueShares = newRawValueShares + key;
  } else if (key !== '.') {
    // Prevent commas and only allow numbers or a single dot
    newRawValueShares = newRawValueShares === '0' ? key : newRawValueShares + key;
  }

  setRawValuShares(newRawValueShares);
  setValueShares(newRawValueShares); // Keep as raw value without formatting for better precision with decimals
  animateValueShares();
};




  
const animatedStyleShares = {
  transform: [{ scale: scaleAnimationShares }],
  opacity: opacityAnimatioShares,
};
  
  
  
  const animatedStyle = {
    transform: [{ scale: scaleAnimation }],
    opacity: opacityAnimation,
  };
  
  



  // Format price with commas and the Euro symbol
  const formatPrice = (price) => {
    return new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Format price with commas and the Euro symbol
  const formatUnitsNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };
  



  





    
  const StockPriceTracker_Sheet = useRef(null);


  const OrderType_Sheet = useRef(null)

  const calculatedHeight = windowHeight * 0.88;



  const toastTriggered = useRef(false);




  

  



return(


  

  <>
 

 <ActionSheet  id={sheetId}
  ref={StockPriceTracker_Sheet}

  backgroundInteractionEnabled={false}
  gestureEnabled={true}

  isModal={false} 
   

    
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
        backgroundColor: dominantColor,
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
    
    


<View 

      
      
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
    colors={[dominantColor,  CurrentViewMode.Mode_bg,  CurrentViewMode.Mode_bg]} />



<View style={{
    height: size(40),
    width: size(40),
    marginTop: height(0),
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




          {/* Title */}

        <View style={{
          marginTop: height(3),
        
          width: "90%",
          height: 100,
          marginLeft: width(5),  
        }}> 
 

      <Text style={{ fontSize: 22, fontWeight: 'bold', width: "90%", 
       color: CurrentViewMode.Mode_fontColor, marginBottom: 0 }}>
      {t("NotifyMeThePriceIsReached")}
      </Text>

      </View>


      {/* Displayed Value */}


     {  CurrentBuyType == "Amount"

     ?
     
      <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: height(20), position: 'absolute', marginBottom: 20 }}>
      <View style={{ alignItems: 'center', marginTop: 0 }}>
      <Animated.Text style={[{ fontSize: 45, fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor, }, animatedStyle]}>

        <Text style={{ fontSize: size(50), fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor, }}>
          {value || '0'} $
        </Text>
        
        </Animated.Text>

        <Text style={{ fontSize: size(14), marginTop: height(1), color: CurrentViewMode.Mode_fontColor, }}>Asset-Price: {formatPrice(currentPrice)}</Text>
        </View>
      </View>

      :

      <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: height(20), position: 'absolute', marginBottom: 20 }}>
      <View style={{ alignItems: 'center', marginTop: 0 }}>
      <Animated.Text style={[{ fontSize: 45, fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor }, animatedStyleShares]}>

        <Text style={{ fontSize: size(50), fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor }}>
          {valueShares || '0'} 
        </Text>
        
        </Animated.Text>

        <Text style={{ fontSize: size(14), marginTop: height(1), color:  CurrentViewMode.Mode_Sec_fontColor }}>Per Share: {formatPrice(currentPrice)}</Text>
        </View>
      </View>

     }

      {/* Number Pad */}
      <View style={{ flexDirection: 'row', color: CurrentViewMode.Mode_fontColor, flexWrap: 'wrap', marginTop: height(15), justifyContent: 'space-between' }}>

            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => CurrentBuyType == "Amount" ? handlePress(key) : handlePressShares(key)}
          style={{
            width: '30%',
            height: 70,
            color: CurrentViewMode.Mode_fontColor,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          {key === 'backspace' ? (
            <Feather name="delete" size={28} color={CurrentViewMode.Mode_fontColor} />
          ) : (
            <Text style={{ fontSize: 24, fontWeight: '900', color: CurrentViewMode.Mode_fontColor }}>{key}</Text>
          )}
        </TouchableOpacity>
      ))}
      </View>

   
   </View>








   <View style={{
          marginTop: height(1)
        }}>












           {/* Submit Button */}
           
  
     

           

  <TouchableOpacity onPress={() => {



      posthog.capture('close_stock_price_tracker_bottomsheet', {
        screen: 'Stock_Price_Tracker_Page',
        $screen_name: 'Stock_Price_Tracker_Page',
        timestamp: new Date().toISOString(),
        });



            const SavePriceTracker = async () => {
              try {
                const docRef = doc(db, "users", currentUser.uid, "PriceTracker", coinData.name);
                
                await setDoc(docRef, {
                  AssetName: coinData.name,
                  symbol: coinData.symbol,
                  TrackerPrice: Number(rawValue),
                  notified: false,
                });
               
                setValue("0")
                setRawValue("0")


                const fetchAlpacaAssets = async () => {

      
                  setTimeout( async() => {
              
              
                    try {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              
                  
                    
                      // ✅ Close BuyConfirmation_Sheet first
                      await SheetManager.hide("StockPriceTracker_Sheet");
                    
                      // ✅ Small delay before closing next sheets
                      setTimeout(() => {
                        SheetManager.hide("StockPage_Sheet");
                      }, 0.1);
                    
                      // ✅ Small delay before closing CoinPage_Sheet (final sheet)
                  /*    setTimeout(() => {
                        SheetManager.hide("StockPage_Sheet");
                      }, 0.5); */
                    
                      // ✅ Delay state reset to prevent UI lag
                       setTimeout(() => {
                        setCoinPageIndex(-1);
                        setIFollowingsCoinsIndex(-1);
                        setSearchIndex(-1);
                      }, 150);
                    
                    } catch (error) {
                      console.error("❌ Error closing sheets:", error);
                    }
                    }, 1000);
                  
            
              
                  }
              
              fetchAlpacaAssets()
              
              } catch (e) {
                console.error("Error saving price tracker:", e);
              }
            };

            SavePriceTracker();

            }} 
            disabled={value == 0 ? true : false}
            style={{
              marginTop: 20,
              height: 50,
              backgroundColor: CurrentViewMode.Mode_fontColor,
              borderRadius: 10,
              position: 'absolute',
              bottom: height(6),
             // width: width(35),
              paddingHorizontal: 30,
              right: width(8),
              opacity: value == 0  ? 0.3 :  100,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: size(18), fontWeight: 'bold', color:CurrentViewMode.Mode_bg,  }}>
            Save
            </Text>
      
            <AntDesign name="arrowright" style={{
              fontSize: size(20),
              marginLeft: width(2),
              color:CurrentViewMode.Mode_bg,
           
            }} />
          </TouchableOpacity>




</View>

      </ActionSheet>







      </>
);
});


export default StockPriceTraackersheet;