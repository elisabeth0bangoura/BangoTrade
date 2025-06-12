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

import { CoinPageContext } from '../../Context/OpenCoinPageContext';
import { CurrentPriceContext } from '../../Context/CurrentCoinPricePageContext';
import PagerView from 'react-native-pager-view';

import { AmountContext } from '../../Context/OpenAmountSheetContext';
import { AddMoneyToAccountContext } from '../../Context/AddMoneyToAccountContext';
import firestore from '@react-native-firebase/firestore';
import { ToastMessageContext } from '@/app/Context/ToastMessageContext';

import { BuyConfirmationSheetContext } from '../../Context/BuyConfirmationSheetContext';

import ActionSheet, {useSheetRef, FlatList, ScrollView, SheetManager} from 'react-native-actions-sheet';
import { opacity } from 'react-native-redash';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "@react-native-firebase/auth";

const HEADER_HEIGHT = 300; // The height of the header























const Widthraw =  React.memo(({ AssetSupply}) => {

  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();


  const user = getAuth().currentUser;
  const { t } = useTranslation();

  const [AlpacaUserId, setAlpacaUserId] = useState(null);

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

      
    const Widthraw_Sheet = useRef(null);

    const [AvailbleCashTransferBalance, setAvailbleCashTransferBalance] = useState()
  
    const {showToastSell, setShowToastSell, setShowTrasnferBtn, ShowNoMoneyToWidthraw, setShowNoMoneyToWidthraw} = useContext(ToastMessageContext);



    const scrollY = useRef(new Animated.Value(0)).current;
  
   
    
  
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
      
      } = useContext(AmountContext);


      const {

        ShowToastDeposit,
        setShowToastDeposit,
	   } = useContext(ToastMessageContext);

  
  
      const { currentPrice, setCurrentPrice, percentageChange, setPercentageChange, } = useContext(CurrentPriceContext);
  
  
      const priceChangeColor = percentageChange > 0 ? '#00CE39' : '#FE1B20';
  
      const windowHeight = Dimensions.get('window').height;
      const snapPointsAmount = useMemo(() => [windowHeight * 0.91], []);
      
      const [bankDetails, setBankDetails] = useState(null); // Store bank details
      const [Accountbalance, setAccountbalance] = useState(false)
      const [BuyPower, setBuyPower] = useState(false)
  
  
      const [BankNumber, setBankNumber] = useState("")
  
  

      const [BankRelationshipStatus, setBankRelationshipStatus] = useState(false)
      const [ACHBankRelationshipStatus, setACHBankRelationshipStatus] = useState(false)
      

    
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

      
      
      const CheckbankRelationship = async () => {
    
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
                }
              };
              
             await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaAccountId}/recipient_banks`, options)
                .then(res => res.json())
                .then(async (res) => {
                    console.log("Bank Relationship: " , res[0].status)
                    setBankRelationshipStatus(res[0].status == "APPROVED" ? true : false)
                
                        // Bank Realtionship Id
                        if(res == null) {
                          setBankRelationshipStatus("No recipient_banks")
                        } else {

                
                        console.log("Bank Relationships id : " , res[0].id)
                      }

    
                /*    await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaAccountId}/ach_relationships`, options)
                        .then(res => res.json())
                        .then(res => {
                             console.log("ACH Relationship: " , res[0].status)
                             setACHBankRelationshipStatus(res[0].status == "APPROVED" ? true : false)
    
                             // Bank Realtionship Id
                             console.log("ach_relationship : " , res[0].id)

                             setBankNumber(res[0].bank_account_number.slice(0, 4));
    
                        })
                        .catch(err => console.error(err));
                        */
                })
                .catch(err => console.error(err));
    
    
        }
    
       CheckbankRelationship()
   
    }, [])
    






    useEffect(() => {

      const GetBalance = async () => {

        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
          }
        }
        
       await fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account`, options)
          .then(res => res.json())
          .then(res => {
           // console.log(res)

            setAvailbleCashTransferBalance(res.cash_withdrawable)
          
          })
          .catch(err => console.error(err))

        

      
    }

      GetBalance()

    }, [])
    
  
  
  
  
  
  
  const formatCurrency = (value) => {
    if (!value) return '0';
    
    return new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2, // Ensure two decimal places
    }).format(value);
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
        // callbacks
        const handleSheetChangeAmount = useCallback((index) => {
          console.log("handleSheetChange", index);
              if(AmountIndex == 0) {
  
          AmountsheetRef.current?.snapToIndex(0);
      } else {
        setAmountIndex(-1)
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
    
  

    const calculatedHeight = windowHeight * 0.88;
  


















  
    
  
  return(
  
  
    <>
   
  


   <ActionSheet  
    ref={Widthraw_Sheet}
  
  
 backgroundInteractionEnabled={false}
 gestureEnabled={true}

 isModal={false} 


    onClose={() => {
      setValue("0")
      setRawValue("0")
      setValueShares("0")
      setRawValuShares("0")
    }}
      
    CustomHeaderComponent={
  <> 
  
  
  
  
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
      
      
 
  
  
            {/* Title */}
  
          <View style={{
           marginTop: height(3),
          
           width: "90%",
           height: 100,
           marginLeft: width(5),  
          }}> 
        <Text style={{ fontSize: size(25), fontWeight: 'bold', width: "90%", 
        color: CurrentViewMode.Mode_fontColor, marginBottom: height(2) }}>
          {t("WidthrawSendToTitle1")} Elisabeth {t("WidthrawSendToTitle2")}
        </Text>

 

            <Text style={{
                fontSize: size(15),
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: "bold"
            }}>
            {formatPrice(AvailbleCashTransferBalance)} {t("YouHaveAmountButtonTitleInSellAmountTypeSheetPage2")}
            </Text>
  
  
  
        </View>
  
  
        {/* Displayed Value */}
  
  
       <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: height(15), position: 'absolute', marginBottom: 20 }}>
        <View style={{ alignItems: 'center', marginTop: 0 }}>
        <Animated.Text style={[{ fontSize: 45, fontWeight: 'bold',color: CurrentViewMode.Mode_fontColor}, animatedStyle]}>
  
          <Text style={{ fontSize: size(50), fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor }}>
            {value || '0'} $
          </Text>
          
          </Animated.Text>
  
          </View>
        </View>
  
     
  
  
        {/* Number Pad */}
  
        {
          CurrentBuyType == "Amount"
  
          ?
  
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: height(15), color: CurrentViewMode.Mode_fontColor, justifyContent: 'space-between' }}>
    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handlePress(key)}
        style={{
          width: '30%',
          height: 70,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        {key === 'backspace' ? (
          <Feather name="delete" size={28} color={CurrentViewMode.Mode_fontColor}  />
        ) : (
          <Text style={{ fontSize: 24, fontWeight: '900', color: CurrentViewMode.Mode_fontColor  }}>{key}</Text>
        )}
      </TouchableOpacity>
    ))}
  </View>
  
  
     
  
          :
  
      
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: height(15), justifyContent: 'space-between' }}>
  
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => CurrentBuyType == "Amount" ? handlePress(key) : handlePressShares(key)}
            style={{
              width: '30%',
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
              <Text style={{ fontSize: 24, fontWeight: '900', color: CurrentViewMode.Mode_fontColor}}>{key}</Text>
            )}
          </TouchableOpacity>
        ))}
        </View>
  
        }
              
  
  
  
          <View style={{
            marginTop: height(20)
          }}>
  
       
          <TouchableOpacity onPress={() => {
          SheetManager.hide("Widthraw_Sheet")
          }}
          style={{
            marginTop: 20,
            height: 50,
            backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
            borderRadius: 10,
            position: 'absolute',
            bottom: height(6),
            width: size(55),
            left: width(7),
            alignItems: 'center',
            justifyContent: "center"
          }}>
  
          <MaterialIcons name='arrow-back' style={{
             color: CurrentViewMode.Mode_fontColor,
            fontSize: size(20)
          }} />
        </TouchableOpacity>
  
  
  
  
  
  
  
  
  
             {/* Submit Button */}
             
           
  
     
    
     
              <TouchableOpacity disabled={AvailbleCashTransferBalance == "0" ? true : false}
              onPress={() => {

                setShowTrasnferBtn(false)
            
              const options = {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
                },
                body: JSON.stringify({
                  transfer_type: 'ach',
                  direction: 'OUTGOING',
                  timing: 'immediate',
                  relationship_id: 'feadb64c-01b0-4308-ac6f-2bdf424b5ea4',
                  amount: rawValue
                })
              };
           
              fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}/transfers`, options)
                .then(res => {


                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                    console.log("here ", res)
                    setShowToastSell(true); // ✅ Make sure this updates before sheets close
                    SheetManager.hide("Widthraw_Sheet")
                    SheetManager.hide("ChooseWidthrawWay_Sheet")
               
                
                })
                .catch(err => {
                  console.log("error ", err)
                });

                



     
              }}
        
              style={{
                marginTop: 20,
                height: 50,
                backgroundColor: CurrentViewMode.Mode_fontColor,
                borderRadius: 10,
                position: 'absolute',
                bottom: height(6),
               // width: width(35),
                paddingHorizontal: 30,
                right: width(7),
                opacity: AvailbleCashTransferBalance == "0" ? 0.3 :  100,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: size(18), color:  CurrentViewMode.Mode_bg, fontWeight: 'bold',  }}>
             {t("StatementsDateTypeCryptoButtonNext")}
              </Text>
        
              <AntDesign name="arrowright" style={{
                fontSize: size(20),
                marginLeft: width(2),
                color:  CurrentViewMode.Mode_bg,
              
              }} />
            </TouchableOpacity>
  
  
       
  
    
  </View>
  
  
        </ActionSheet>
  
  

  
        </>
  );
  });
  
  
  export default Widthraw;