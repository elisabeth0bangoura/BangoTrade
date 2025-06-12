// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text,Button, ActivityIndicator, Dimensions, Easing, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import {AntDesign, Entypo, Feather, Foundation, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons"
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
import {ToastMessageContext} from "../../Context/ToastMessageContext"

import { BuyConfirmationSheetContext } from '../../Context/BuyConfirmationSheetContext';

import ActionSheet, {useSheetRef, FlatList, ScrollView, SheetManager} from 'react-native-actions-sheet';
import { opacity } from 'react-native-redash';
import { TrasnactionReceipeContext } from '@/app/Context/TrasnactionReceipeContext';
import { DateTime } from 'luxon';
import PdfRendererView from 'react-native-pdf-renderer';  // Ensure this is installed and linked


import { ViewModeContext } from '@/app/Context/ViewModeContext';

const HEADER_HEIGHT = 300; // The height of the header











const TransactionRecepieSoldAssets =  React.memo((props) => {


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  const { selectedItem } = props.payload;  // Access the passed item data

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    const currentUser = auth().currentUser;
 
    const windowHeight = Dimensions.get('window').height;
    const snapPointsAmount = useMemo(() => [windowHeight * 0.91], []);
    const TransactionRecepieSoldAssets_Sheet = useRef(null); // ✅ Correct ref type
    const calculatedHeight = windowHeight * 0.88;
    const [UserFirstname, setUserFirstname] = useState("")
    const [UserLastname, setUserLastname] = useState("")
  
    const {CurrentChoosedAsset, setCurrentChoosedAsset} = useContext(TrasnactionReceipeContext)
    const [returnPercentage, setReturnPercentage] = useState(null); // State for return percentage
  const [profitInFiat, setProfitInFiat] = useState(null); // State for profit in Fiat
  const [loading, setLoading] = useState(true); // State for loading status
  const [receivedAmount, setReceivedAmount] = useState(null); // State for total amount received with profit
  const [BankAccountNumber, setBankAccountNumber] = useState()

  const [Shares, setShares] = useState(0)
  const [SharePrice, setSharePrice] = useState(0)

  const [Investment, setInvestment] = useState(0)


  const [AlpacaUserId, setAlpacaUserId] = useState();


  const [UserLang, setUserLang] = useState()
  const [Depot_number, setDepot_number] = useState("")

  
  const [Sum, setSum] = useState()

  const [equity, setEquity] = useState(null);
  const [error, setError] = useState(null);
  const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")











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
      
   }, [AlpacaUserId]);







  console.log("CurrentChoosedAsset: ", CurrentChoosedAsset)


  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
    },
  };

  useEffect(() => {
    fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/orders/${CurrentChoosedAsset.order_id}`, options)
      .then((res) => res.json())
      .then((res) => {
        console.log("API Response here:", res);
  
        if (!res.filled_avg_price || !res.filled_qty || !CurrentChoosedAsset?.price) {
          console.error("Invalid API response data.");
          setShares(0);
          setSharePrice(0);
          setInvestment(0);
          setReturnPercentage(0);
          setProfitInFiat(0);
          setReceivedAmount(0);
          setLoading(false);
          return;
        }
  
        // ✅ 1. BUY DATA (How much was the asset bought for?)
        const quantityBought = parseFloat(res.filled_qty); // Number of shares bought
        const sharePrice = parseFloat(res.filled_avg_price); // Buy price per share
        const investmentAmount = quantityBought * sharePrice; // Total cost of the shares bought
  
        console.log("✅ Shares Bought:", quantityBought);
        console.log("✅ Share Price per Unit:", sharePrice);
        console.log("✅ Investment Amount ($):", investmentAmount);
  
        // ✅ 2. SELL DATA (How much was the asset sold for?)
        const buyPrice = Number(CurrentChoosedAsset.price); // Price at which the asset was originally bought
        const sellPrice = parseFloat(res.filled_avg_price); // Price per unit when sold
        const quantitySold = parseFloat(res.qty); // Number of shares sold
  
        console.log("here Buy Price:", buyPrice);
        console.log("Sell Price:", sellPrice);
        console.log("Quantity Sold:", quantitySold);
  
        if (isNaN(buyPrice) || isNaN(sellPrice) || isNaN(quantitySold)) {
          console.error("Invalid numbers in calculations.");
          setReturnPercentage(0);
          setProfitInFiat(0);
          setReceivedAmount(0);
          setLoading(false);
          return;
        }
  
        // ✅ 3. RETURN PERCENTAGE (%)
        const calculatedReturnPercentage = ((sellPrice - buyPrice) / buyPrice) * 100;
        const roundedReturnPercentage = isNaN(calculatedReturnPercentage) ? 0 : Number(calculatedReturnPercentage.toFixed(2));
  
        // ✅ 4. PROFIT ($)
        const calculatedProfitInFiat = quantitySold * (sellPrice - buyPrice);
        const roundedProfitInFiat = isNaN(calculatedProfitInFiat) ? 0 : Number(calculatedProfitInFiat.toFixed(2));
  
        // ✅ 5. TOTAL AMOUNT RECEIVED ($)
        const totalReceived = quantitySold * sellPrice;
  
        console.log("✅ Corrected Return %:", roundedReturnPercentage);
        console.log("✅ Corrected Profit $:", roundedProfitInFiat);
        console.log("✅ Total Received:", totalReceived);
  
        // ✅ Update State
        setShares(quantityBought);
        setSharePrice(sharePrice);
        setInvestment(investmentAmount);
        setReturnPercentage(roundedReturnPercentage);
        setProfitInFiat(roundedProfitInFiat);
        setReceivedAmount(totalReceived);
  
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setShares(0);
        setSharePrice(0);
        setInvestment(0);
        setReturnPercentage(0);
        setProfitInFiat(0);
        setReceivedAmount(0);
        setLoading(false);
      });
  }, [AlpacaUserId]);
  
  
  

   // console.log("CurrentChoosedAsset: ", CurrentChoosedAsset)
  
    const getFirstLetter = (str) => {
      if (str && str.length > 0) {
        return str.charAt(0);  // Return the first letter of the string
      }
      return '';  // Return an empty string if the input is empty or undefined
    };
    
    
  
  
  
  
  
  
    useEffect(() => {
    
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
        }
      };
      
      fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}`, options)
        .then(res => res.json())
        .then(res => {
       //   console.log(res)
        setUserFirstname(res.identity.given_name)
        setUserLastname(res.identity.family_name)
        })
        .catch(err => console.error(err));
    
    }, [AlpacaUserId])




  useEffect(() => {


    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
      }
    };

    const Test = async () => {


    
   await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}/ach_relationships`, options)
      .then(res => res.json())
      .then(res => {
      //  console.log(res)
        setBankAccountNumber(res[0].bank_account_number)
      })
      .catch(err => console.error(err));


    }

    Test()
  }, [AlpacaUserId])







useEffect(() => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
    }
  };


const test = async () => {

  
await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}/documents`, options)
    .then(res => res.json())
    .then(res => {
      
      console.log("res: ", res.id)



    
    })
    .catch(err => console.error(err));
  
  }

  test()
}, [AlpacaUserId])






    
  

// Determine the color for text and arrows based on the return percentage and profit
const textColor = (returnPercentage === 0) ? '#00CE39' : (returnPercentage > 0 ? '#00CE39' : '#FF4F4F'); // Green for profit or 0%, Red for loss
const arrowSymbol = returnPercentage > 0 ? '▲' : (returnPercentage < 0 ? '▼' : '▲'); 




   // Assuming CurrentChoosedAsset.transaction_time is "2025-02-20T08:12:53.753762Z"
   const transactionTime = CurrentChoosedAsset.transaction_time;

   // Get the current language from i18next (can be 'en', 'de', 'fr', etc.)
   const currentLanguage = i18n.language; 
   
   // Format the date dynamically using Luxon and the current language
   const formattedDate = DateTime.fromISO(transactionTime)
     .setLocale(currentLanguage) // Use current language dynamically
     .toFormat('d. MMMM yyyy • HH:mm'); // Format to "23. Juli 2024 • 19:39"
   
   console.log(formattedDate); // This will output something like "20. Februar 2025 • 08:12" based on the current language





// Format price with commas and the Euro symbol
const formatPrice = (price) => {
  return new Intl.NumberFormat('us-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};





  
  return(
  
  
    <>
   
  


 <ActionSheet  
 ref={TransactionRecepieSoldAssets_Sheet}
 backgroundInteractionEnabled={false}
 gestureEnabled={true}
 isModal={false} 
 CustomHeaderComponent={
  <> 
  

  
 <Animated.View
        style={{
          height: 40, // Height of the header
          backgroundColor: CurrentViewMode.Mode_bg_SoldTransactionReceipe,
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
          backgroundColor: CurrentViewMode.Mode_bg_SoldTransactionReceipe,
          height: height(92),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }} 	
        style={{
          height: "100%",
          backgroundColor: CurrentViewMode.Mode_bg_SoldTransactionReceipe,
      }}>
      
      











      
 <ScrollView style={{
    height: "100%",
    width: "100%"
 }} contentContainerStyle={{
  paddingBottom: height(10)
 }} showsVerticalScrollIndicator={false}>


    <View style={{
      height: 35,
      marginRight: width(2),
      width: 35,
      marginLeft: width(5),
      marginBottom: height(2),
      borderRadius: 35/2,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      
      }}>

     
     <Image source={{uri: CurrentChoosedAsset.logo}} style={{
      height: "100%",
      width: "100%"
     }} />

      </View>

    <Text style={{
        color:  CurrentViewMode.Mode_fontColor,
        fontSize: size(22),
        fontWeight: "900",
        marginLeft: width(5)
    }}>
      {t("ReceivedHeaderInTransactionRecepieBroughtAssetsComponent")} {formatPrice(Investment)}
    </Text>

    <Text style={{
       marginLeft: width(5),
      marginTop: height(2),
      color: CurrentViewMode.Mode_Sec_fontColor
    }}>
    {formattedDate}
    </Text>





<View style={{
  width: "90%",
  alignSelf: 'center',
  marginTop: height(5),
}}>


<Text style={{
  color:  CurrentViewMode.Mode_fontColor,
  fontSize: size(16),
  fontWeight: "bold",
}}>

{t("OverviewHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>





<View style={{
  flexDirection: 'row',
  marginTop: height(2),
}}>

<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{t("StatusHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

<Text style={{
  right: width(0),
  position: 'absolute',
  color: '#00CE39',
  fontSize: size(15),
  fontWeight: "bold",
}}>
{t("ExecutedHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

</View>









<View style={{
  flexDirection: 'row',
  marginTop: height(2),
}}>

<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{t("OrderTypeHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

<Text style={{
  right: width(0),
  position: 'absolute',
  color: CurrentViewMode.Mode_Sec_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{t("SoldHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

</View>











<View style={{
  flexDirection: 'row',
  marginTop: height(2),
}}>

<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{t("AssetHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

<Text style={{
  right: width(0),
  position: 'absolute',
  color: CurrentViewMode.Mode_Sec_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{CurrentChoosedAsset.coinName}
</Text>

</View>














<View style={{
  marginTop: height(7),
}}>

<Text style={{
  color:   CurrentViewMode.Mode_fontColor,
  marginBottom: height(2),
  fontWeight: "bold"
}}>
{t("PerformanceHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>


<View style={{
  flexDirection: "row",
  width: "100%",
 // backgroundColor: 'yellow',
  height: "auto",
}}>

<View style={{
  height: "auto",
  width: 100,
}}>
  <Text style={{
    fontWeight: "bold",
    color: CurrentViewMode.Mode_fontColor,
    fontSize: size(15),
    marginBottom: height(1),
  }}>
  {t("ReturnHeaderInTransactionRecepieBroughtAssetsComponent")}
  
  </Text>

  <Text style={{
    color: textColor,
    fontWeight: "bold",
    fontSize: size(15),
  }}>
  {arrowSymbol} {returnPercentage !== null ? returnPercentage.toFixed(2) + '%' : 'N/A'}

  </Text>
</View>



<View style={{
  height: "auto",
  width: 100,
}}>
  <Text style={{
    fontWeight: "bold",
    color: CurrentViewMode.Mode_fontColor,
    marginBottom: height(1),
  }}>
{t("ProfitHeaderInTransactionRecepieBroughtAssetsComponent")}

  </Text>

  <Text style={{
    color:  textColor,
    fontWeight: "bold",
    fontSize: size(15),
  }}>
  {arrowSymbol} {profitInFiat !== null ? profitInFiat.toFixed(2) + ' USD' : 'N/A'}

  </Text>
</View>
</View>


  
</View>














<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  marginTop: height(8),
  fontWeight: "bold",
}}>
{t("TransactionHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>



<View style={{
  flexDirection: 'row',
  marginTop: height(2),
}}>

<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{t("SharesHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

<Text style={{
  right: width(0),
  position: 'absolute',
  color: CurrentViewMode.Mode_Sec_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
  {Shares}
</Text>

</View>










<View style={{
  flexDirection: 'row',
  marginTop: height(2),
}}>

<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{t("SharePriceHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

<Text style={{
  right: width(0),
  position: 'absolute',
  color: CurrentViewMode.Mode_Sec_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{formatPrice(SharePrice)}
</Text>

</View>













<View style={{
  flexDirection: 'row',
  marginTop: height(2),
}}>

<Text style={{
  color:  CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{t("FeePriceHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

<Text style={{
  right: width(0),
  position: 'absolute',
  color: CurrentViewMode.Mode_Sec_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
0 $
</Text>

</View>







<View style={{
  flexDirection: 'row',
  marginTop: height(2),
}}>

<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{t("SumPriceHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

<Text style={{
  right: width(0),
  position: 'absolute',
  color: CurrentViewMode.Mode_Sec_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
 {formatPrice(Investment)}
</Text>

</View>


</View>































<Text style={{
    marginTop: height(7),
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
  marginLeft: width(5)
}}>
{t("DocumentHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>


<View style={{
  marginLeft: width(5),
  flexDirection: 'row',
}}>




<TouchableOpacity onPress={() => {
  SheetManager.show("TransactionConfirmation_Sheet")
}}
style={{
  height: height(18),
    marginTop: height(3),
    borderRadius: 15,
    width: width(36),
    backgroundColor: CurrentViewMode.Mode_ButtonColor_SoldTransactionReceipe,
    marginRight: width(5)
  
}}>



<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginTop: height(5),
    marginRight: width(2), 
  }} />



  <Text numberOfLines={1} style={{
    color: CurrentViewMode.Mode_fontColor,
    fontWeight: "bold",
    position: 'absolute',
    bottom: height(4),
    marginLeft: width(5),
    width: "75%",
  }}>
  {t("CostInformationHeaderInTransactionRecepieBroughtAssetsComponent")}
  
  </Text>

</TouchableOpacity>









<TouchableOpacity onPress={() => {
  SheetManager.show("Billing_Sheet")
}}
style={{
  height: height(18),
    marginTop: height(3),
    borderRadius: 15,
    width: width(36),
    backgroundColor: CurrentViewMode.Mode_ButtonColor_SoldTransactionReceipe,
  
  
}}>



<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginTop: height(5),
    marginRight: width(2), 
  }} />



  <Text numberOfLines={1} style={{
    color: CurrentViewMode.Mode_fontColor,
    fontWeight: "bold",
    position: 'absolute',
    bottom: height(4),
    marginLeft: width(5),
    width: "75%",
  }}>
   {t("BillingHeaderInTransactionRecepieBroughtAssetsComponent")}
 
  </Text>

</TouchableOpacity>

</View>

 </ScrollView>
  
  
  
         


  
 </ActionSheet>
  
  

  
        </>
  );
  });
  
  
  export default TransactionRecepieSoldAssets;