// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, Dimensions, Easing, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native';
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
import BuyConfirmationSheet from './BuyConfirmationSheet';




const AddMoneyToAccount =  React.memo(({coinData}) => {



    const {BuyConfirmationSheetIndex, setBuyConfirmationSheetIndex} = useContext(BuyConfirmationSheetContext);

    const { currentPrice, setCurrentPrice, percentageChange, setPercentageChange, } = useContext(CurrentPriceContext);

    const { 
        AddMoneyToAccountIndex, 
        setAddMoneyToAccountIndex, 
        AddBankDetailsToAccountIndex, 
        setAddBankDetailsToAccountIndex 

    } = useContext(AddMoneyToAccountContext);


    

    
    const { CoinPageIndex, setCoinPageIndex } = useContext(CoinPageContext);
    const AmountsheetRef = useRef(null);
    const { AmountIndex, setAmountIndex } = useContext(AmountContext);
    const windowHeight = Dimensions.get('window').height;
    const snapPointsAmount = useMemo(() => [windowHeight * 0.91], []);
    


 // hooks
 const sheetRefAddMoneyToAccount = useRef(null);

 // variables
 const snapPointsAddMoneyToAccount = useMemo(() => ["91%"], []);

 

 const handleSheetChangeAddMoneyToAccount = useCallback((index) => {
   console.log("Sheet index AddMoneyToAccount changed:", index);
 }, []);



 const CloseAddMoneyToAccountSheet = () => {
    setAddMoneyToAccountIndex(-1)
    sheetRefAddMoneyToAccount.current?.close();
 }



 useEffect(() => {
    if (AddMoneyToAccountIndex == -1) {
        sheetRefAddMoneyToAccount.current?.close();
    } 
  }, [AddMoneyToAccountIndex]);

  





 useEffect(() => {
    if (BuyConfirmationSheetIndex == 0) {
        setBuyConfirmationSheetIndex(0)
    } 
  }, [BuyConfirmationSheetIndex]);

  






 const handleOpenBottomSheetAddBankDetails = () => {
    setAddBankDetailsToAccountIndex(0); // Open the BottomSheet by setting the index to 0
  };






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

  const calculatedHeight = windowHeight * 0.91;





return(


  <>
 



    
      <BottomSheet
       ref={sheetRefAddMoneyToAccount}
       snapPoints={snapPointsAddMoneyToAccount}
       enableDynamicSizing={false}
       index={AddMoneyToAccountIndex} // Use the context value for index
     //  enablePanDownToClose={true}
       onChange={handleSheetChangeAddMoneyToAccount}
       style={{
    
       // backgroundColor: '#0F0F0F',
        shadowColor: '#000',
    
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
      }}
      handleIndicatorStyle={{
    //	backgroundColor: CoinPageIndex == 0 ? "#fff" : "transparent", 
        height: size(4), 
        width: size(40), 
        marginTop: -15,
        alignSelf: 'center',
        borderRadius: 20,  // Add borderRadius here to make the handle rounded
      }}
    
      handleStyle={{
       // backgroundColor: "#0F0F0F", // Set handle background to transparent
        height: 20, // Remove the handle height
        padding: 0, // Remove any padding if necessary
        borderTopLeftRadius: 60,  // Rounded top-left corner of the handle
        borderTopRightRadius: 60, // Rounded top-right corner of the handle
      }}
      backgroundStyle={{
       backgroundColor: "#0F0F0F", 
    
      }}>
      <BottomSheetView style={{
        backgroundColor: "#0F0F0F"
      }}>



       <Text style={{
        fontSize: size(25),
        width: "80%",
        fontWeight: "bold",
        marginTop: height(3),
        color: '#fff',
        marginLeft: width(5),
       }}>
       Transfer money to Bango Bank
       </Text>


       <View style={{
        backgroundColor: "#1E1E1F",
        height: "auto",
        paddingVertical: height(4),
        paddingHorizontal: width(2),
        width: "90%",
        marginTop: height(5),
        borderRadius: 15,
        alignSelf: 'center',

       }}>
        <Text style={{
        fontSize: size(16),
        width: "80%",
        fontWeight: "bold",
        color: '#fff',
        marginLeft: width(5),
       }}>
        Transfer Funds from Your Account
        </Text>

        <Text style={{
        fontSize: size(13),
        width: "80%",
        marginTop: height(2),
        color: '#fff',
        lineHeight: height(2.5),
        marginLeft: width(5),
       }}>
      We only accept ACH transfers for US accounts and wire transfers for international deposits. 
      Any deposits where the name does not match will be returned.


        </Text>
       </View>




        <TouchableOpacity onPress={() => handleOpenBottomSheetAddBankDetails()}
        style={{
            height: size(50),
            backgroundColor: "#fff",
            width: "90%",
            borderRadius: 10,
            justifyContent: 'center',
            marginTop: height(9),
            alignSelf: 'center',
            shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.30,
			shadowRadius: 4.65,
			elevation: 8,
        }}>
            <Text style={{
                color: '#000',
                fontWeight: "bold",
                fontSize: size(18),
                alignSelf: 'center',
            }}> 
                Transfer Funds
            </Text>
        </TouchableOpacity>



        <Text style={{
            fontSize: size(13),
            color: "#656A71",
            position: 'absolute',
            top: height(60),
            width: "85%",
            fontWeight: "bold",
            lineHeight: height(2.5),
            marginLeft: width(5),
        }}>
        Your funds will be <Text style={{color: "#691AF5",  fontSize: size(13), fontWeight: "bold",}}>held</Text> in a secure escrow account via Alpaca Securities LLC. 
        Please note that transfers may take up to 1-2 business days to process. <Text style={{color: "#691AF5",  fontSize: size(13), fontWeight: "bold",}}>Find out more.</Text>
        </Text>



        <TouchableOpacity onPress={() => CloseAddMoneyToAccountSheet()}
        style={{
            height: size(55),
            width: size(55),
            position: 'absolute',
            top: height(75),
        
            marginLeft: width(5),
            backgroundColor: "#272726",
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
        }}>
            <MaterialIcons name="arrow-back-ios" style={{
                fontSize: size(18),
                color: '#fff',

            }} />
        </TouchableOpacity>


        </BottomSheetView>
      </BottomSheet>





<AddBankDetailsToAccount />



      </>
);
});


export default AddMoneyToAccount;