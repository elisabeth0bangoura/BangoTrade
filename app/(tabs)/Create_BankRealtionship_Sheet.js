// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, Dimensions, Easing, StyleSheet, Image, Animated, TouchableOpacity, TextInput } from 'react-native';
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
import { CurrentPriceContext } from '../Context/CurrentCoinPricePageContext';
import PagerView from 'react-native-pager-view';

import { AmountContext } from '../Context/OpenAmountSheetContext';
import { AddMoneyToAccountContext } from '../Context/AddMoneyToAccountContext';
import firestore from '@react-native-firebase/firestore';
import {ToastMessageContext} from "../Context/ToastMessageContext"

import { BuyConfirmationSheetContext } from '../Context/BuyConfirmationSheetContext';

import ActionSheet, {useSheetRef, FlatList, ScrollView, SheetManager} from 'react-native-actions-sheet';
import { ViewModeContext } from '@/app/Context/ViewModeContext';

import { getFirestore, doc, getDoc, collection, setDoc   } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "@react-native-firebase/auth";

const HEADER_HEIGHT = 300; // The height of the header























const Create_BankRealtionship =  React.memo(({ AssetSupply}) => {



  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();


  const user = getAuth().currentUser;

  const { t } = useTranslation();



  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


      
    const Create_BankRealtionship_Sheet = useRef(null);

  



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
      const {showToastSell, setShowToastSell, setShowTrasnferBtn, ShowNoMoneyToWidthraw, setShowNoMoneyToWidthraw} = useContext(ToastMessageContext);

  
      const priceChangeColor = percentageChange > 0 ? '#00CE39' : '#FE1B20';
  
      const windowHeight = Dimensions.get('window').height;
      const snapPointsAmount = useMemo(() => [windowHeight * 0.91], []);
      
      const [bankDetails, setBankDetails] = useState(null); // Store bank details
      const [Accountbalance, setAccountbalance] = useState(false)
      const [BuyPower, setBuyPower] = useState(false)
  
  
      const [BankNumber, setBankNumber] = useState("")
  
      const [AvailbleCashTransferBalance, setAvailbleCashTransferBalance] = useState()
  

      const [BankRelationshipStatus, setBankRelationshipStatus] = useState(false)
      const [ACHBankRelationshipStatus, setACHBankRelationshipStatus] = useState(false)

      const [BankName, setBankName] = useState("")
      const [BICOrABA, setBICOrABA] = useState("")
      const [AccountNumber, setAccountNumber] = useState("")
      const [Country, setCountry] = useState("")
      const [PostalCode, setPostalCode] = useState("")
      const [StreetAddress, setStreetAddress] = useState("")
      const [ StateProvince, setStateProvince] = useState("")
      const [ City, setCity] = useState("")
      const [ChooseBankCodeTypeIndex, setChooseBankCodeTypeIndex] = useState(-1)
      const [showToast, setShowToast] = React.useState(false);
      const {BankCodeType, setBankCodeType} = useContext(AddMoneyToAccountContext)
      const [AlpacaUserId, setAlpacaUserId] = useState(null);
    const [UserFullname, setUserFullname] = useState("")
       const [RoutingNumber, setRoutingNumber] = useState("")
      



    
    
    

      


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
      
              setUserFullname(userDocument.data().given_name + " " + userDocument.data().family_name)
              console.log("AlpacaAccountId: ", userDocument.data().AlpacaAccountId)
      

                  
            const CheckbankRelationship = async () => {
          
              const options = {
                  method: 'GET',
                  headers: {
                    accept: 'application/json',
                    authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
                  }
                };
                

             
                
              await  fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${userDocument.data().AlpacaAccountId}/ach_relationships`, options)
                  .then(res => res.json())
                  .then(res => {
                    console.log(res)
                  
                  })
                  .catch(err => console.error(err));

            /*   await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaAccountId}/recipient_banks`, options)
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
                
                  })
                  .catch(err => console.error(err)); */
      
      
          } 
      
         CheckbankRelationship()
     

      
            } else {
              // Handle the case when the document doesn't exist
              console.log('No such document!');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
      
        fetchUserData();
      
            
        
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
              
                  console.log("cash_withdrawable: ", res.cash_withdrawable)
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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // For Buyer Confirmation Sheet
  
  
  const handleOpenBuyerConfirmation = () => {
    setBuyConfirmationSheetIndex(0); // Open the BottomSheet by setting the index to 0
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    const handleOpenBottomSheet = () => {
  
      handleOpenBuyerConfirmation()
  
  
  
    /*  if(Accountbalance == false) {
        // add more funds
        setBuyPower(false)
      } else if (Accountbalance == true){
        // Proceed to buy asset
        setBuyPower(true)
        
  
  
      } else if (bankDetails == null) {
        setAddMoneyToAccountIndex(0); // Open the BottomSheet by setting the index to 0
        setBuyPower(false)
      }
   */
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
    
  

    const calculatedHeight = windowHeight * 0.88;
  


















  
    
  
  return(
  
  
    <>
   
  


   <ActionSheet  
    ref={Create_BankRealtionship_Sheet}
  
  
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
     
          maxHeight: height(92),
          backgroundColor:  CurrentViewMode.Mode_bg,
          height: height(92),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }} 	
        style={{
          height: "100%",
          backgroundColor:  CurrentViewMode.Mode_bg,
      }}>
      
      
 
  
  
            {/* Title */}
  

  <ScrollView style={{
    height: "100%",
    width: "100%"
  }} contentContainerStyle={{
    paddingBottom: height(50)
  }}>

  
        <Text style={{
        fontSize: size(25),
        width: "80%",
        fontWeight: "bold",
        marginTop: height(3),
        color:  CurrentViewMode.Mode_fontColor,
        marginLeft: width(5),
       }}>
       Transfer money to Bantico
       </Text>


      





<Text style={{
      marginTop: height(5),
      marginLeft: width(5),
    color: CurrentViewMode.Mode_Sec_fontColor,
    fontSize: size(14),
    fontWeight: "bold",
}}>
   (Bank Account owner name)
</Text>

        <TextInput  onChangeText={(text) => {
            setUserFullname(text)
        }}
        placeholder='Elisabeth Bangoura'
        placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
        style={{
          fontSize: size(25),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "bold",
          marginTop: height(2),
          marginLeft: width(5),
        }} />





<View style={{
  flexDirection: 'row',
  marginTop: height(2),
  marginBottom: height(3),
}}>




<TextInput placeholder='Bank Name'
	onChangeText={(text) => {
    setBankName(text); // Update email state
    }}
        placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
        style={{
          fontSize: size(22),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "bold",
          marginTop: height(5),
          marginLeft: width(5),
        }} />





</View>












<View style={{
 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
 height: "auto",
 paddingVertical: height(4),
 paddingHorizontal: width(2),
 width: "85%",
 marginLeft: width(5),
 borderRadius: 15,

       }}>

<Text style={{
    fontSize: size(14),
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontWeight: "bold",
    marginBottom: height(1)
}}>Bank Code</Text>


<Text style={{
    fontSize: size(13),
    color:CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontWeight: "bold",
    lineHeight: height(2.5),
    width: "90%",
}}>For international banks, choose BIC. For U.S. banks, choose ABA Routing Number.</Text>

</View>



<View style={{

  marginBottom: height(1),
  marginLeft: width(5),
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: height(2),
}}>  




<TouchableOpacity onPress={() => {
    SheetManager.show("BankTypeCodes_Sheet")
}}
  style={{
paddingVertical: 12,
flexDirection: 'row',
marginLeft: -20,
paddingHorizontal: 20,
alignItems: 'center'
}}>
  <Text style={{
      fontSize: size(22),
      fontWeight: "bold",
      color: BankCodeType == "" ?  CurrentViewMode.Mode_Sec_fontColor : CurrentViewMode.Mode_fontColor,
      marginRight: width(1),
  }}>
   {BankCodeType == "" ? "Bank Code" : BankCodeType}
  </Text>

  <MaterialIcons name="keyboard-arrow-down" style={{
    color: BankCodeType == "" ? CurrentViewMode.Mode_Sec_fontColor : CurrentViewMode.Mode_fontColor,
    fontSize: size(30),
  }} />
</TouchableOpacity>



<TextInput placeholder='Routing Number' numberOfLines={1}
        placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
        onChangeText={(text) => {
          setRoutingNumber(text); // Update email state
          }}
        style={{
            position: 'absolute',
            right: width(5),
            textAlign: 'right',
          fontSize: size(22),
          color: CurrentViewMode.Mode_fontColor,
          width: width(45),
          fontWeight: "bold",
  
       
        }} />

</View>














<View style={{
 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
 height: "auto",
 paddingVertical: height(4),
 paddingHorizontal: width(2),
 width: "85%",
 marginLeft: width(5),
 borderRadius: 15,


       }}>

<Text style={{
    fontSize: size(14),
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontWeight: "bold",
    marginBottom: height(1)
}}>Account Number or IBAN</Text>


<Text style={{
    fontSize: size(13),
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontWeight: "bold",
    lineHeight: height(2.5),
    width: "90%",
}}>
  For international banks, enter the IBAN. For U.S. banks, enter the account number.
</Text>

</View>



<View style={{
  flexDirection: 'row',
 marginTop: height(4),
  marginLeft: width(5),
}}>







<TextInput placeholder='Account number' numberOfLines={1}
        placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
        onChangeText={(text) => {
          setAccountNumber(text); // Update email state
          }}
        style={{
          fontSize: size(22),
          color: CurrentViewMode.Mode_fontColor,
          width: width(45),
          fontWeight: "bold",
  
       
        }} />




<TextInput placeholder='BIC/ABA' numberOfLines={1}
        placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
        onChangeText={(text) => {
          setBICOrABA(text); // Update email state
          }}
        style={{
          fontSize: size(22),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "bold",
          position: 'absolute',
          right: width(5),
         
        }} />






</View>















<View style={{
  flexDirection: 'row',
  marginTop: height(5),
  marginLeft: width(5),
}}>






</View>












<View style={{
  flexDirection: 'row',
  marginTop: height(5),
  marginLeft: width(5),
}}>



<Text style={{
  color: CurrentViewMode.Mode_Sec_fontColor,
  position: 'absolute',
  marginTop: height(-3),
  fontWeight: "bold",
  
}}> 
  (ISO-3 Name)
</Text>
<TextInput placeholder='USA' numberOfLines={1}
        placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
        onChangeText={(text) => {
          setCountry(text); // Update email state
          }}
        style={{
          fontSize: size(22),
          color: CurrentViewMode.Mode_fontColor,
          width: width(45),
          fontWeight: "bold",
        }} />





<TextInput placeholder='State province' numberOfLines={1}
        placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
        onChangeText={(text) => {
          setStateProvince(text); // Update email state
      }}
        style={{
          fontSize: size(22),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "bold",
          position: 'absolute',
          right: width(5),
        }} />
</View>














<View style={{
  flexDirection: 'row',
  marginTop: height(5),
  marginLeft: width(5),
}}>





<TextInput placeholder='Postal code'
        placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
        onChangeText={(text) => {
          setPostalCode(text); // Update email state
      }}
        style={{
          fontSize: size(22),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "bold",
        }} />




<TextInput placeholder='City'
        placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
        onChangeText={(text) => {
          setCity(text); // Update email state
      }}
        style={{
          fontSize: size(22),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "bold",
          position: 'absolute',
          right: width(5),
        }} />
</View>















<View style={{
  flexDirection: 'row',
  marginTop: height(5),
  marginLeft: width(5),
}}>





<TextInput placeholder='Street address'
        placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
        onChangeText={(text) => {
          setStreetAddress(text); // Update email state
      }}
        style={{
          fontSize: size(22),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "bold",
        }} />


</View>











</ScrollView>
  









<View style={{
               position: 'absolute',
               top: height(75),
        }}>
        <TouchableOpacity onPress={() => {
              SheetManager.hide("Create_BankRealtionship_Sheet");
        }}
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





{
/*
    const [BankName, setBankName] = useState("")
    const [BICOrABA, setBICOrABA] = useState("")
    const [AccountNumber, setAccountNumber] = useState("")
    const [Country, setCountry] = useState("")
    const [PostalCode, setPostalCode] = useState("")
    const [StreetAddress, setStreetAddress] = useState("")
    const [ StateProvince, setStateProvince] = useState("")
    const [ City, setCity] = useState("")

*/
}




{
  BankName == "" //|| BICOrABA == "" || BankCodeType == "" || AccountNumber == "" || Country == "" || PostalCode == "" || StreetAddress == "" || StateProvince == "" || City == ""


  ?


  <TouchableOpacity disabled={true}
  style={{
      height: size(55),
      width: width(30),
      marginLeft: width(65),
      position: 'absolute',
      backgroundColor:CurrentViewMode.Mode_ButtonColor_Profile,
      alignItems: 'center',

      borderRadius: 10,
      flexDirection: 'row',
  }}>
     <Text style={{
        color: CurrentViewMode.Mode_fontColor,
      fontSize: size(18),
      fontWeight: "bold",
      marginLeft: 20,
     }}>
      Next
     </Text>

     <MaterialIcons name='arrow-forward' style={{
      color:CurrentViewMode.Mode_fontColor,
      position: 'absolute',
        right: width(5),
      fontSize: size(25)

     }} />
  </TouchableOpacity>


  :




  <TouchableOpacity onPress={() => {


  
    const handleSubmit = async () => {
   
        


    const optionsCreateBankRelationship = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
          },
          body: JSON.stringify({
            bank_code_type: BankCodeType,
            name: BankName,
            bank_code: BICOrABA,
            account_number: AccountNumber,
            country: Country,
            state_province: StateProvince,
            postal_code: PostalCode,
            city: City,
            street_address: StreetAddress
          })
        };
      
        try {
          // Make the POST request to create a bank relationship
         await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}/recipient_banks`, optionsCreateBankRelationship, {

          }).then((res) => {
            console.log('Bank Relationship Created:', res);
    
       
            // Store data in Firestore (using the actual response data)
        


            const userRef = doc(db, `users/${user}/Bank_Details/List`);

            // Set the data in Firestore
            setDoc(userRef, {
                bank_code_type: BankCodeType,
                name: BankName,
                bank_code: BICOrABA,
                account_number: AccountNumber,
                country: Country,
                state_province: StateProvince,
                postal_code: PostalCode,
                city: City,
                street_address: StreetAddress
            })
              .then(() => {
                console.log('Data successfully set in Firestore.');
              })
              .catch((error) => {
                console.error('Error setting data in Firestore:', error);
              });



      
            console.log('User bank details added!');
    

          })
          

       
          


         
            // Make a second API call for ACH relationship if bank relationship is approved
         const optionsCreateAnACHRelationship = {
               method: 'POST',
               headers: {
                 accept: 'application/json',
                 'content-type': 'application/json',
                 authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==',
               },
               body: JSON.stringify({
                 account_owner_name: UserFullname,
                 bank_account_type: 'CHECKING',
                 instant: true,
                 account_owner_name: UserFullname,
                 bank_account_number: AccountNumber,
                 bank_routing_number: RoutingNumber,
               }),
             };
     
            await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}/ach_relationships`, optionsCreateAnACHRelationship, {

             }).then((res) => {

               console.log('ACH Relationship Created:', res);
     
               // Handle success (hide the sheet, show toast)
               SheetManager.hide("Create_BankRealtionship_Sheet");
               setShowToast(true);
             }).catch((err) => {
               console.log(err)
             })
        
         
            } catch (err) {
                console.error('Fetch error:', err);
                setIsSubmitting(false); // Reset submission state on error
              }
        
            } 
        
 

      handleSubmit()

  }}
  style={{
    height: size(55),
    width: width(30),
    marginLeft: width(65),
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
    Next
   </Text>

   <MaterialIcons name='arrow-forward' style={{
    color: CurrentViewMode.Mode_bg,
    position: 'absolute',
      right: width(5),
    fontSize: size(25)

   }} />
  </TouchableOpacity>

}

     



        </View>
      
        </ActionSheet>
  
  

  
        </>
  );
  });
  
  
  export default Create_BankRealtionship;