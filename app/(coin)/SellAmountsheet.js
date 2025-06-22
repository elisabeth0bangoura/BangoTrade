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

import { SellAmountContext } from '../Context/SellOpenAmountSheetContext';
import { AddMoneyToAccountContext } from '../Context/AddMoneyToAccountContext';
import AddMoneyToAccount from './AddMoneyToAccount';


import { BuyConfirmationSheetContext } from '../Context/BuyConfirmationSheetContext';
import BuyConfirmationSheet from './BuyConfirmationSheet';
import ActionSheet, {useSheetRef, FlatList, ScrollView, SheetManager} from 'react-native-actions-sheet';

import { ToastMessageContext } from '../Context/ToastMessageContext';
import { ViewModeContext } from '../Context/ViewModeContext';
import { usePostHog } from 'posthog-react-native';


import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc, collection, addDoc, onSnapshot } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";






























export const SellAmountTypeSheetPage = () => {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


    const { t } = useTranslation();

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);



  const SellAmountType_Sheet = useRef(null)

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
    const [AvailbeAssetSellAmount, setAvailbeAssetSellAmount] = useState(0)



    const [AlpacaUserId, setAlpacaUserId] = useState(null);










    useEffect(() => {
      posthog.capture('screen_viewed', {
        screen: 'SellAmountType_Sheet',
        $screen_name: 'SellAmountType_Sheet '+" / "+coinData.name,
        timestamp: new Date().toISOString(),
      });
    }, []);
    




    useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const userDocument = await firestore()
              .collection('users')
              .doc(user.uid)
              .get();
    
            if (userDocument.exists) {
              setAlpacaUserId(userDocument.data().AlpacaAccountId);


          const GetAssetAmountIWantToSell = async () => {

          
            console.log("coinData ", coinData.symbol+"USD")
            
            const coinSymbol = coinData.symbol+"USD";
            
            await fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userDocument.data().AlpacaAccountId}/positions`, {
              method: 'GET',
              headers: {
                accept: 'application/json',
                authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
              }
            })
              .then(res => res.json())
              .then(data => {
                const match = data.find(item => item.symbol === coinSymbol);
                
                if (match) {
                  console.log('Found matching position:', match);
            
                  setAvailbeAssetSellAmount(match.market_value)
            
                } else {
                  console.log('No matching symbol found');
                }
              })
              .catch(err => console.error('Error fetching positions:', err));
            
            }
            GetAssetAmountIWantToSell()
            
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      });
    
      return () => unsubscribe(); // Cleanup on unmount
    }, [AvailbeAssetSellAmount]); // ← Run once on mount
    

    




    




const formatCurrency = (value) => {
  if (!value) return '0';
  
  return new Intl.NumberFormat('us-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2, // Ensure two decimal places
  }).format(value);
};



  

  return(


    <ActionSheet ref={SellAmountType_Sheet}
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
         maxHeight: height(45),
         backgroundColor: CurrentViewMode.Mode_bg,
         height: height(45),
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
             marginLeft: width(5),
           //  top: height(-1)
           }}>
            {t("SellButtonTitle")} 
           </Text>
 


           <Text style={{
             fontSize: size(15),
             color: CurrentViewMode.Mode_fontColor,
             fontWeight: "900",
             marginLeft: width(5),
             marginTop: height(2),
            // marginBottom: height(1)
           }}>
             {t("YouHaveAmountButtonTitleInSellAmountTypeSheetPage1")} {formatCurrency(AvailbeAssetSellAmount)} {t("YouHaveAmountButtonTitleInSellAmountTypeSheetPage2")}
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

          posthog.capture('clicked_shares_sellamount_25%_button', {
            screen: 'SellAmountType_Sheet',
            $screen_name: 'SellAmountType_Sheet '+" / "+coinData.name,
            timestamp: new Date().toISOString(),
            });

            setSharesSellAmount("25")
           }}
           style={{
            width: width(43),
            backgroundColor: SharesSellAmount == "25" ?  CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_ButtonColor_Profile,
            height: size(60),
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
           }}>

            <Text style={{
              fontSize: size(16),
              fontWeight: "900",
              alignSelf: 'center',
              color: SharesSellAmount == "25" ? CurrentViewMode.Mode_bg_Home : CurrentViewMode.Mode_fontColor,
            }}>
              25 %
            </Text>

           </TouchableOpacity>


           <TouchableOpacity onPress={() => {


          posthog.capture('clicked_shares_sellamount_50%_button', {
            screen: 'SellAmountType_Sheet',
            $screen_name: 'SellAmountType_Sheet '+" / "+coinData.name,
            timestamp: new Date().toISOString(),
            });


            setSharesSellAmount("50")
           }}
           style={{
            width: width(43),
            backgroundColor: SharesSellAmount == "50" ?  CurrentViewMode.Mode_fontColor  : CurrentViewMode.Mode_ButtonColor_Profile,
            height: size(60),
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
           }}>

            <Text style={{
              fontSize: size(16),
              fontWeight: "900",
              alignSelf: 'center',
              color: SharesSellAmount == "50" ? CurrentViewMode.Mode_bg_Home : CurrentViewMode.Mode_fontColor,
            }}>
              50 %
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

            posthog.capture('clicked_shares_sellamount_100%_button', {
              screen: 'SellAmountType_Sheet',
              $screen_name: 'SellAmountType_Sheet '+" / "+coinData.name,
              timestamp: new Date().toISOString(),
              });

            setSharesSellAmount("100")
           }}
           style={{
            width: width(43),
            backgroundColor: SharesSellAmount == "100" ?  CurrentViewMode.Mode_fontColor  : CurrentViewMode.Mode_ButtonColor_Profile,
            height: size(60),
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
           }}>


            <Text style={{
              fontSize: size(16),
              fontWeight: "900",
              alignSelf: 'center',
              color: SharesSellAmount == "100" ? CurrentViewMode.Mode_bg_Home : CurrentViewMode.Mode_fontColor,
            }}>
              100 %
            </Text>

           </TouchableOpacity>


           <TouchableOpacity onPress={() => {
          


          posthog.capture('open_coin_sellamount_ordertype_bottomsheet', {
            screen: 'SellAmountType_Sheet',
            $screen_name: 'SellAmountType_Sheet '+" / "+coinData.name,
            timestamp: new Date().toISOString(),
            });
            
            SheetManager.show("SellOrderType_Sheet");
           }}
           style={{
            width: width(43),
            backgroundColor: SharesSellAmount == "dots-horizontal" ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_ButtonColor_Profile,
            height: size(60),
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
           }}>

          <MaterialCommunityIcons name='dots-horizontal' style={{
            fontSize: size(25),
            color: SharesSellAmount == "dots-horizontal" ? CurrentViewMode.Mode_bg_Home  : CurrentViewMode.Mode_fontColor,
          }} />

           </TouchableOpacity>

           </View>



           <View style={{
          marginTop: height(12)
        }}>

     
        <TouchableOpacity onPress={() => {

        posthog.capture('open_coin_sellamount_ordertype_bottomsheet', {
          screen: 'SellAmountType_Sheet',
          $screen_name: 'SellAmountType_Sheet '+" / "+coinData.name,
          timestamp: new Date().toISOString(),
          });

          SheetManager.show("SellOrderTypeSheet_Sheet");
        }}

        style={{
          marginTop: 20,
          height: 50,
          position: 'absolute',
          bottom: height(6),
          width: width(35),
          paddingHorizontal: 10,
          left: width(5),
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >

        <Text style={{ fontSize: size(18), marginRight: width(1), color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold',  }}>
         {CurrentBuyType == "Amount" ?  t("AmountButtonText") : t("SharesButtonText")} 
        </Text>

        <MaterialIcons name="keyboard-arrow-down" style={{
          color: CurrentViewMode.Mode_fontColor,
          fontSize: size(25),
        }} />
      </TouchableOpacity>









           {/* Submit Button */}
           
         

   
          <View style={{
            marginTop: height(3),
          }}> 
   

    
            <TouchableOpacity onPress={() => {


              posthog.capture('open_coin_sell_confirmation_bottomsheet', {
                screen: 'SellAmountType_Sheet',
                $screen_name: 'SellAmountType_Sheet '+" / "+coinData.name,
                timestamp: new Date().toISOString(),
                });

                // Show the Sell Confirmation Shares Sheet
                SheetManager.show('SellConfirmationShares_Sheet');

            
              }}
            disabled={SharesSellAmount == "" ? true : false}
            style={{
              marginTop: 20,
              height: 50,
              backgroundColor:CurrentViewMode.Mode_fontColor,
              borderRadius: 10,
              position: 'absolute',
              bottom: height(6),
            //  width: width(35),
              paddingHorizontal: 30,
              right: width(5),
              opacity:  SharesSellAmount == ""  ? 0.3 :  100,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: size(18), color: CurrentViewMode.Mode_bg, fontWeight: 'bold',  }}>
            {t("SellButtonTitle")} 
            </Text>
      
            <AntDesign name="arrowright" style={{
              fontSize: size(20),
              marginLeft: width(1),
              color: CurrentViewMode.Mode_bg,
      
            }} />
          </TouchableOpacity>




   
  
</View>

</View>
 
 
   
   
 

       </ActionSheet>

  )

}

































const SellAmountsheet =  React.memo(({ AssetSupply}) => {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { t } = useTranslation();

  const scrollY = useRef(new Animated.Value(0)).current;

  const currentUser = auth().currentUser;


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

 const [CurrentBanalce, setCurrentBanalce] = useState(0)
 const [AbleToBuy, setAbleToBuy] = useState(false); // Initialize state



  const { AddMoneyToAccountIndex, setAddMoneyToAccountIndex } = useContext(AddMoneyToAccountContext);
  const {BuyConfirmationSheetIndex, setBuyConfirmationSheetIndex} = useContext(BuyConfirmationSheetContext);


    const { 
      CoinPageIndex, 
      setCoinPageIndex,  
      CurrentBackgroundColorForCoin, 
      setCurrentBackgroundColorForCoin, coinData, setCoinData, coinSymbol, setCoinSymbol  } = useContext(CoinPageContext);
  
    const AmountsheetRef = useRef(null);
    // variables




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
  


    const { currentPrice, setCurrentPrice, percentageChange, setPercentageChange, } = useContext(CurrentPriceContext);


    const priceChangeColor = percentageChange > 0 ? '#00CE39' : '#FE1B20';

    const windowHeight = Dimensions.get('window').height;
    const snapPointsAmount = useMemo(() => [windowHeight * 0.91], []);
    
    const [bankDetails, setBankDetails] = useState(null); // Store bank details
    const [Accountbalance, setAccountbalance] = useState(false)
    const [BuyPower, setBuyPower] = useState(false)
    const [AvailbeAssetSellAmount, setAvailbeAssetSellAmount] = useState(0)



    const [AlpacaUserId, setAlpacaUserId] = useState(null);









    useEffect(() => {
      posthog.capture('screen_viewed', {
        screen: 'SellAmounts_Sheet',
        $screen_name: 'SellAmounts_Sheet '+" / "+coinData.name,
        timestamp: new Date().toISOString(),
      });
    }, []);
    
    







    useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const userDocument = await firestore()
              .collection('users')
              .doc(user.uid)
              .get();
    
            if (userDocument.exists) {
              setAlpacaUserId(userDocument.data().AlpacaAccountId);



            const GetAssetAmountIWantToSell = async () => {

            
              console.log("coinData ", coinData.symbol+"USD")
              
              const coinSymbol = coinData.symbol+"USD";
              
              await fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userDocument.data().AlpacaAccountId}/positions`, {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
                }
              })
                .then(res => res.json())
                .then(data => {
                  const match = data.find(item => item.symbol === coinSymbol);
                  
                  if (match) {
                    console.log('Found matching position:', match);
              
                    setAvailbeAssetSellAmount(match.market_value)
              
                  } else {
                    console.log('No matching symbol found');
                  }
                })
                .catch(err => console.error('Error fetching positions:', err));
              
              }
              GetAssetAmountIWantToSell()
              
    
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      });
    
      return () => unsubscribe(); // Cleanup on unmount
    }, [AvailbeAssetSellAmount]); // ← Run once on mount
    


    



    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
      }
    };






   



// Check If bankAccout Is linked










const formatCurrency = (value) => {
  if (!value) return '0';
  
  return new Intl.NumberFormat('us-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2, // Ensure two decimal places
  }).format(value);
};





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

  /*      setAlpacaUserId(userData?.AlpacaAccountId);
        setUserFirstName(userData?.newAccountPayload?.identity?.given_name);
        setUserLastName(userData?.newAccountPayload?.identity?.family_name);
*/
       
  // Real-time listener for the "List" document in the "Bank_Details" subcollection
  const subscriber = firestore()
    .collection('users') // Access the 'users' collection
    .doc(currentUser.uid) // Access the specific user document based on currentUser's UID
    .collection('Bank_Details') // Access the "Bank_Details" subcollection
    .doc('List') // Access the "List" document
    .onSnapshot(documentSnapshot => {
      console.log('User data: ', documentSnapshot.data());
      setBankDetails(documentSnapshot.data())

      fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userData?.AlpacaAccountId}/account`, options)
        .then(res => res.json())
        .then(res => {
          const cashAvailable = parseFloat(res.cash_withdrawable); // Cash available for withdrawal
          const buyingPower = parseFloat(res.buying_power); // Buying power for trades
      
          console.log('Cash available:', cashAvailable);
          console.log('Buying power:', buyingPower);
      

          setCurrentBanalce(parseFloat(res.buying_power))
          // Example: Check if the user can make an order
          const orderAmount = currentPrice; // The amount they want to order
      
          if (cashAvailable >= orderAmount) {
            console.log('User has enough funds to make the order');
            setBuyPower(true)
            // Proceed with order
          } else if (buyingPower >= orderAmount) {
            console.log('User has enough buying power to make the order');
            setBuyPower(true)
            // Proceed with order
          } else {
            console.log(`User does not have sufficient balance to make the order of ${currentPrice}`);
            // Show error message or prevent order
            setAccountbalance(false)
            setBuyPower(false)
          }
        })
        .catch(err => {
          console.error('Error fetching account data:', err);
        });
      

      });
      return () => subscriber();
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
  };
  
  fetchUserData();
   
    }, [currentUser.uid]);
  
  









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
















  useEffect(() => {

    console.log("CurrentBackgroundColorForCoin: ", CurrentBackgroundColorForCoin)
  }, [])




  
      


















// For Buyer Confirmation Sheet


const handleOpenBuyerConfirmation = () => {
  setBuyConfirmationSheetIndex(0); // Open the BottomSheet by setting the index to 0
};










  







  
  
  

  
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
  


  const SellAmounts_Sheet = useRef(null);


  const calculatedHeight = windowHeight * 0.88;


  

return(


  <>
 



    

 <ActionSheet id="SellAmounts_Sheet"
  ref={SellAmounts_Sheet}


  backgroundInteractionEnabled={false}
  gestureEnabled={true}

  onClose={() => {

    posthog.capture('closed_sheet', {
      screen: 'SellAmounts_Sheet',
      $screen_name: 'SellAmounts_Sheet '+" / "+coinData.name,
      timestamp: new Date().toISOString(),
      });

    setValue("0")
    setRawValue("0")
    setValueShares("0")
    setRawValuShares("0")
    setCurrentBuyType("Shares")
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
        backgroundColor: CurrentBackgroundColorForCoin,
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
        height:height(92),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }} 	
      style={{
        height: "100%",
        backgroundColor: CurrentViewMode.Mode_bg,
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
    colors={[CurrentBackgroundColorForCoin, CurrentViewMode.Mode_bg, CurrentViewMode.Mode_bg,]} />



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
      <Text style={{ fontSize: 20, fontWeight: 'bold', width: "90%", 
       color: CurrentViewMode.Mode_fontColor, marginBottom: 20 }}>
         {t("SellButtonTitle")} 
      </Text>

      <Text style={{ fontSize: size(14), fontWeight: 'bold', width: "90%", 
        marginTop: height(4), position: 'absolute',  color:CurrentViewMode.Mode_fontColor, marginBottom: 20 }}>
        {formatCurrency(AvailbeAssetSellAmount)} {t("availableHeader")} 
      </Text>
      </View>


      {/* Displayed Value */}


     {  CurrentBuyType == "Amount"

     ?
     
     <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: height(20), position: 'absolute', marginBottom: 20 }}>
      <View style={{ alignItems: 'center', marginTop: 0 }}>
      <Animated.Text style={[{ fontSize: 45, fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor}, animatedStyle]}>

        <Text style={{ fontSize: size(50), fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor }}>
          {value || '0'} $
        </Text>
        
        </Animated.Text>

        <Text style={{ fontSize: size(14), marginTop: height(1), color: CurrentViewMode.Mode_Sec_fontColor }}>{t("AssetPriceHeader")}: {formatPrice(currentPrice)}</Text>
        </View>
      </View>

      :

      <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: height(20), position: 'absolute', marginBottom: 20 }}>
      <View style={{ alignItems: 'center', marginTop: 0 }}>
      <Animated.Text style={[{ fontSize: 45, fontWeight: 'bold', color:  CurrentViewMode.Mode_fontColor  }, animatedStyleShares]}>

        <Text style={{ fontSize: size(50), fontWeight: 'bold', color:  CurrentViewMode.Mode_fontColor  }}>
          {valueShares || '0'} 
        </Text>
        
        </Animated.Text>

        <Text style={{ fontSize: size(14), marginTop: height(1), color:  CurrentViewMode.Mode_Sec_fontColor  }}>{t("AssetPriceHeader")}: {formatPrice(currentPrice)}</Text>
        </View>
      </View>

     }

      {/* Number Pad */}

      {
        CurrentBuyType == "Amount"

        ?

<View style={{ flexDirection: 'row',  color:  CurrentViewMode.Mode_fontColor , flexWrap: 'wrap', marginTop: height(15), justifyContent: 'space-between' }}>
  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => handlePress(key)}
      style={{
        width: '30%',
        color:  CurrentViewMode.Mode_fontColor ,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      {key === 'backspace' ? (
        <Feather name="delete" size={28} color={CurrentViewMode.Mode_fontColor} />
      ) : (
        <Text style={{ fontSize: 24, fontWeight: '900', color:  CurrentViewMode.Mode_fontColor, }}>{key}</Text>
      )}
    </TouchableOpacity>
  ))}
</View>


   

        :

    
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
            <Text style={{ fontSize: 24, fontWeight: '900', color:  CurrentViewMode.Mode_fontColor, }}>{key}</Text>
          )}
        </TouchableOpacity>
      ))}
      </View>

      }
            



   
       <View style={{
          position: 'absolute',
          bottom: height(-9),
          flexDirection: 'row'
        }}>


        <TouchableOpacity onPress={() => {

        posthog.capture('canceled_checkout_selling_asset', {
          screen: 'SellAmounts_Sheet',
          $screen_name: 'SellAmounts_Sheet '+" / "+coinData.name,
          timestamp: new Date().toISOString(),
          });

          Promise.all([
          SheetManager.hide("SellAmounts_Sheet"),
         SheetManager.hide("OrderType_Sheet"),
          SheetManager.hide("SellAmountType_Sheet")
        ]).then(() => {
          console.log("✅ All sheets closed!");
        }).catch(err => console.error("❌ Error closing sheets:", err));
      

        }}
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





           {/* Submit Button */}
           
         

   
  
   
       

    
            <TouchableOpacity onPress={() => {
             
           
             posthog.capture('open_coin_sell_confirmation_bottomsheet', {
              screen: 'SellAmounts_Sheet',
              $screen_name: 'SellAmounts_Sheet '+" / "+coinData.name,
              timestamp: new Date().toISOString(),
              })

              SheetManager.show("SellConfirmation_Sheet");
         
            }}
            disabled={value == 0 || AbleToBuy == false ? true : false}
            style={{
              height: 50,
              backgroundColor: CurrentViewMode.Mode_fontColor,
              borderRadius: 10,
              position: 'absolute',
            //  width: width(35),
              paddingHorizontal: 30,
              marginLeft: width(64),
              opacity: value == 0 || AbleToBuy == false  ? 0.3 :  100,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: size(18), color:CurrentViewMode.Mode_bg, fontWeight: 'bold',  }}>
            {t("SellButtonTitle")} 
            </Text>
      
            <AntDesign name="arrowright" style={{
              fontSize: size(20),
              marginLeft: width(2),
            //  right: width(5),
              color: CurrentViewMode.Mode_bg, 
             // position: 'absolute',
            }} />
          </TouchableOpacity>


     


   
  
</View>


      </ActionSheet>


      </>
);
});


export default SellAmountsheet;