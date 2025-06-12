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
import CoinChart from './CoinChart';
import { CurrentPriceContext } from '../Context/CurrentCoinPricePageContext';
import PagerView from 'react-native-pager-view';

import { AmountContext } from '../Context/OpenAmountSheetContext';

import { AddMoneyToAccountContext } from '../Context/AddMoneyToAccountContext';
import AddBankDetailsToAccount from './AddBankDetailsToAccount';
import { BuyConfirmationSheetContext } from '../Context/BuyConfirmationSheetContext';
import ActionSheet, {useSheetRef, FlatList, ScrollView, SheetManager} from 'react-native-actions-sheet';
import { ToastMessageContext } from '../Context/ToastMessageContext';
import { ViewModeContext } from '../Context/ViewModeContext';
























export const BuyOrderTypeSharesSheetPage = () => {


  const { t } = useTranslation();

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
    setOrderTypeIndex, } = useContext(AmountContext);




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






















const BuyConfirmationSheetShares =  React.memo(() => {
  const { t } = useTranslation();

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);



    const { currentPrice, setCurrentPrice, percentageChange, setPercentageChange, } = useContext(CurrentPriceContext);

    const {BuyConfirmationSheetIndex, setBuyConfirmationSheetIndex} = useContext(BuyConfirmationSheetContext);


    const {
      showToast, 
      setShowToast
       } = useContext(ToastMessageContext);




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
      setCurrentBackgroundColorForCoin, coinSymbol, setCoinSymbol, coinData, setCoinData  } = useContext(CoinPageContext);
  
    

    
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
    





 // hooks
 const sheetRefBuyConfirmation = useRef(null);

 // variables
 const snapPointsBuyConfirmation = useMemo(() => ["91%"], []);

 

 const handleSheetChangeBuyConfirmation = useCallback((index) => {
   console.log("Sheet index AddMoneyToAccount changed:", index);
 }, []);



 const CloseAddMoneyToAccountSheet = () => {
  SheetManager.hide("BuyConfirmationShares_Sheet");

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
    if (BuyConfirmationSheetIndex == 0) {
      sheetRefBuyConfirmation.current?.snapToIndex(0);

    } 
  }, [BuyConfirmationSheetIndex]);


  






    // Calculate the number of shares to buy
useEffect(() => {
  if (rawValue && coinData.price > 0) {
    const shares = rawValue / coinData.price;
    setSharesToBuy(shares.toFixed(6)); // Rounded to 2 decimal places
  }
}, [rawValue, coinData.price]);












// Replace with your Alpaca account ID and API key
//const accountId = 'dc053145-9232-4c82-9d13-6e53a104750f';
const apiKey = 'YOUR_API_KEY';











console.log(currentPrice)


  // Function to fetch Alpaca assets and store them in state

  const accountId = 'dc053145-9232-4c82-9d13-6e53a104750f'; // Your Alpaca account ID


  
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
    let isMounted = true; // Prevent updates if the component unmounts
  
    // Debounced function inside useEffect
    const debouncedCalculate = debounce(async () => {
      if (!rawValueShares || !currentPrice) return;
  
      // Alpaca Fee Tiers
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
  
      // Function to determine the fee tier
      const getFeeTier = (volume) => {
        for (let i = 0; i < feeTiers.length; i++) {
          if (volume >= feeTiers[i].volume) {
            return feeTiers[i];
          }
        }
        return feeTiers[feeTiers.length - 1]; // Default to highest fee if no match
      };
  
      // Fetch 30-day trading volume from Alpaca
      const fetchTradingVolume = async () => {
        try {
          const response = await fetch(
            `https://broker-api.sandbox.alpaca.markets/v1/accounts/activities?activity_type=FILL&page_size=100`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
                authorization: "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==",
              },
            }
          );
  
          const data = await response.json();
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
  
      // Fetch the trading volume
      const volume = await fetchTradingVolume();
      const tier = getFeeTier(volume);
      const takerFeeRate = tier.taker / 100;
  
      const investmentAmount = parseFloat(rawValueShares.replace(",", "."));
      if (isNaN(investmentAmount) || investmentAmount <= 0) return;
  
      // Calculate total cost and fee
      const totalCostInUSD = investmentAmount * currentPrice;
      const takerFeeInUSD = totalCostInUSD * takerFeeRate;
      const finalCost = totalCostInUSD + takerFeeInUSD;
  
      // Ensure quantity meets Alpaca's minimum order size
      const minOrderSize = alpacaMinOrderSize || 0.0001;
      const finalShares = investmentAmount >= minOrderSize ? investmentAmount : minOrderSize;
  
      // Update state only if values have changed
      if (isMounted) {
        setTotalCost((prev) => (prev !== finalCost.toFixed(2) ? finalCost.toFixed(2) : prev));
        setFees((prev) => (prev !== takerFeeInUSD.toFixed(6) ? takerFeeInUSD.toFixed(6) : prev));
        setBuyQty((prev) => (prev !== finalShares.toFixed(6) ? finalShares.toFixed(6) : prev));
  
        console.log(`✅ Investment Amount (MKR): ${investmentAmount}`);
        console.log(`💰 Asset Price (USD): ${currentPrice}`);
        console.log(`📉 Taker Fee (USD): ${takerFeeInUSD}`);
        console.log(`📊 Total Cost (USD): ${finalCost}`);
        console.log(`🔢 Quantity (MKR): ${finalShares}`);
      }
    }, 500); // Debounce time: 500ms
  
    // Run the debounced function
    debouncedCalculate();
  
    return () => {
      isMounted = false; // Prevent memory leaks
      debouncedCalculate.cancel(); // Cleanup debounce on unmount
    };
  }, [rawValueShares, currentPrice, alpacaMinOrderSize]); // Dependencies
  



const BuyConfirmationShares_Sheet = useRef(null);










const scrollY = useRef(new Animated.Value(0)).current;


  // Interpolate background color based on scroll position
  const bgColor = scrollY.interpolate({
    inputRange: [0, 204],
    outputRange: [coinData.dominantColor, CurrentViewMode.Mode_bg],
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
			  top: height(-8),
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
  
  








 


return(


  <>
 







 <ActionSheet  
  ref={BuyConfirmationShares_Sheet}

  isModal={false} 

  backgroundInteractionEnabled={false}
  gestureEnabled={true}

    
  CustomHeaderComponent={
<> 



{showToast && (
      <ToastMessage message="Purchase successful!" onClose={() => setShowToast(false)} />
    )}

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
        maxHeight: height(94),
        backgroundColor: CurrentViewMode.Mode_bg,
        height: height(94),
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
    {t("InvestBuyConfirmationSheet")} {formatCurrency(totalCost)}   {/*  {formatQuantity(rawValueShares)} {coinSymbol}*/}
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

      <Text style={{
        color:CurrentViewMode.Mode_fontColor,
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
      {formatQuantity(rawValueShares)}
      </Text>
    </View>


 
 
    <View style={{
      flexDirection: 'row',
      marginTop: height(4),
      width: "85%",
      alignSelf: 'center'
    }}>
      <Text style={{
        color:  CurrentViewMode.Mode_Sec_fontColor,
        fontSize: size(15),
        fontWeight: "bold",
      }}>
       {t("AssetPriceTitleSellConfirmationSheet")}     
      </Text>

      <Text style={{
        color:  CurrentViewMode.Mode_fontColor,
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
        color:  CurrentViewMode.Mode_Sec_fontColor,
        fontSize: size(15),
        fontWeight: "bold",
      }}>
      {t("TotalFeesTitleSellConfirmationSheet")}     
      </Text>

      <Text style={{
        color:CurrentViewMode.Mode_fontColor,
        right: width(0),
        fontWeight: "800",
        fontSize: size(15),
        position: 'absolute',
      }}>
     {formatCurrency(Fees)} $
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
            backgroundColor:CurrentViewMode.Mode_ButtonColor_Profile,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
        }}>
            <MaterialIcons name="arrow-back-ios" style={{
                fontSize: size(18),
                color: CurrentViewMode.Mode_fontColor,

            }} />
        </TouchableOpacity>




  <TouchableOpacity onPress={() => {



setShowToast(true); // ✅ Make sure this updates before sheets close

setTimeout( async() => {


try {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  // ✅ Close BuyConfirmation_Sheet first
  await SheetManager.hide("BuyConfirmation_Sheet");

  // ✅ Small delay before closing next sheets
  setTimeout(() => {
    SheetManager.hide("MoneyAmount_Sheet");
  }, 0.1);

  // ✅ Small delay before closing CoinPage_Sheet (final sheet)
  setTimeout(() => {
    SheetManager.hide("CoinPage_Sheet");
  }, 0.5);

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




 // Function to fetch Alpaca crypto assets dynamically
/* const fetchAlpacaAssets = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==' // Replace with your actual API key
    }
  };

  try {
    const response = await fetch('https://broker-api.sandbox.alpaca.markets/v1/assets?status=all&asset_class=crypto&attributes=', options);
    const data = await response.json();
    setAlpacaAssets(data); // Store Alpaca assets in state
  } catch (err) {
    console.error('Error fetching Alpaca assets:', err);
  }
};

fetchAlpacaAssets()
// Match the Coingecko symbol (e.g., BTC, ETH) to Alpaca's symbol dynamically
const matchAsset = () => {

  // Find Alpaca asset pair that matches the first 3 letters of the Coingecko symbol
  const matchingAsset = alpacaAssets.find(asset =>
    asset.symbol.toLowerCase().startsWith(coinSymbol.toLowerCase())
  );

  if (matchingAsset) {
    console.log(matchingAsset); // Set the selected asset

  
      console.log(matchingAsset); // Log the matching asset
      setAlpacaCoinId(matchingAsset.id); // Store Alpaca coin ID
      setAlpacaSymbol(matchingAsset.symbol); // Store Alpaca coin ID
      setAlpacaMinOrderSize(matchingAsset.min_order_size); // Store the minimum order size
      setAlpacaStatus(matchingAsset.status); // Store asset status




      

      const placeOrder = async () => {
        // Order parameters - Customize these as needed
        const symbol = matchingAsset.symbol; // The symbol for the asset you want to buy
        const qty = sharesToBuy; // The amount you want to buy (could be fractional)
        const side = 'buy'; // We are making a purchase order
        const orderType = 'market'; // Order type: market, limit, or stop_limit
        const timeInForce = 'gtc'; // Time-in-force: day or gtc (good till canceled)
      

        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==' // Replace with your actual API key
          },
          body: JSON.stringify({
            type: orderType,
            time_in_force: timeInForce,
            symbol: `${coinSymbol}/USD`,
            qty: BuyQty, // We need to calcuate correcty qty and not shares
            side: side

          })
        };
      
        try {
          // Send request to Alpaca API to create the order
          const response = await fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/dc053145-9232-4c82-9d13-6e53a104750f/orders`, options);
          const data = await response.json();
          console.log('Order created successfully:', data); // Log the response from the API

          
        } catch (err) {
          console.error('Error creating order:', err);
        } 
      };
      
      // Trigger the placeOrder function when a button is clicked
      const handlePlaceOrder = () => {
        placeOrder();
      };
       
      handlePlaceOrder()

      
  
  } else {
    console.log('No matching asset found!');
  }
};
matchAsset()

/*
[
  {
    "id": "feadb64c-01b0-4308-ac6f-2bdf424b5ea4",
    "account_id": "dc053145-9232-4c82-9d13-6e53a104750f",
    "created_at": "2025-02-13T09:12:38.003797Z",
    "updated_at": "2025-02-13T09:12:43.47918Z",
    "status": "APPROVED",
    "account_owner_name": "Elisabeth Bangoura",
    "bank_account_type": "CHECKING",
    "bank_account_number": "8311113380",
    "bank_routing_number": "026073150",
    "nickname": null,
    "processor_token": null
  }
]
*/




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
      fontSize: size(18),
      color: CurrentViewMode.Mode_bg,
      fontWeight: "bold",
      marginLeft: 20,
     }}>
      {t("BuyTitleSellConfirmationSheet")}
     </Text>

     <MaterialIcons name='check' style={{
      color:CurrentViewMode.Mode_bg,
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


export default BuyConfirmationSheetShares;