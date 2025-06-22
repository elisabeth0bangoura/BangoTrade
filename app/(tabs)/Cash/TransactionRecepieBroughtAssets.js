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
import { usePostHog } from 'posthog-react-native';


import { ViewModeContext } from '@/app/Context/ViewModeContext';

const HEADER_HEIGHT = 300; // The height of the header


























const TransactionRecepieBroughtAssets =  React.memo((props) => {
  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  const { selectedItem } = props.payload;  // Access the passed item data


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    const currentUser = auth().currentUser;
 
    const windowHeight = Dimensions.get('window').height;
    const snapPointsAmount = useMemo(() => [windowHeight * 0.91], []);
    const TransactionRecepieBroughtAssets_Sheet = useRef(null); // ✅ Correct ref type
    const calculatedHeight = windowHeight * 0.88;
      const TransactionRecepieSoldAssets_Sheet = useRef(null); // ✅ Correct ref type
    const [UserFirstname, setUserFirstname] = useState("")
    const [UserLastname, setUserLastname] = useState("")
 
  
    const {
      CurrentChoosedAsset, 
      setCurrentChoosedAsset,
      Investment, 
      setInvestment,
      BankAccountNumber, setBankAccountNumber,
      PricePerShare, setPricePerShare,
    } = useContext(TrasnactionReceipeContext)
    const [returnPercentage, setReturnPercentage] = useState(null); // State for return percentage
  const [profitInFiat, setProfitInFiat] = useState(null); // State for profit in Fiat
  const [loading, setLoading] = useState(true); // State for loading status
  const [receivedAmount, setReceivedAmount] = useState(null); // State for total amount received with profit
 

  const [Shares, setShares] = useState(0)
  const [SharePrice, setSharePrice] = useState(0)

  
  const [AlpacaUserId, setAlpacaUserId] = useState();


  const [UserLang, setUserLang] = useState()
  const [Depot_number, setDepot_number] = useState("")

  
  const [Sum, setSum] = useState()

  const [equity, setEquity] = useState(null);
  const [error, setError] = useState(null);
  const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")




  console.log("CurrentChoosedAsset: ", CurrentChoosedAsset)

 







useEffect(() => {
  posthog.capture('screen_viewed', {
    screen: 'TransactionRecepieBroughtAssets_Sheet',
    $screen_name: 'TransactionRecepieBroughtAssets_Sheet',
    timestamp: new Date().toISOString(),
  });
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
      
   }, [AlpacaUserId]);












  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==',
    },
  };
  useEffect(() => {
    fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/orders/${CurrentChoosedAsset.order_id}`, options)
      .then((res) => res.json())
      .then((res) => {
        console.log("API Response:", res);
  
        if (!res.filled_avg_price || !res.qty || !CurrentChoosedAsset?.price) {
          console.error("Invalid API response data.");
          setShares(0);
          setSharePrice(0);
          setInvestment(0);
          setLoading(false);
          return;
        }
  
        const buyPrice = Number(CurrentChoosedAsset.price); // Original buy price from your context
        const quantityBought = parseFloat(res.qty); // Quantity bought
  
        console.log("Buy Price (Original Price Paid Per Share):", buyPrice);
        console.log("Quantity Bought:", quantityBought);
  
        // Calculate how much the user **invested (bought the asset for)**
        const investmentAmount = buyPrice * quantityBought;
  
        console.log("Total Investment Amount (Purchase Price):", investmentAmount);
  
        // Ensure valid numbers before setting state
        const validShares = !isNaN(quantityBought) ? quantityBought : 0;
        const validSharePrice = !isNaN(buyPrice) ? buyPrice : 0;
        const validInvestment = !isNaN(investmentAmount) ? investmentAmount : 0;
  
        console.log("Shares Bought:", validShares);
        console.log("Original Buy Price Per Share:", validSharePrice);
        console.log("Total Purchase Price:", validInvestment);
  
        setPricePerShare(validSharePrice)

        setShares(validShares);
        setSharePrice(validSharePrice);
        setInvestment(validInvestment);
  
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setShares(0);
        setSharePrice(0);
        setInvestment(0);
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
      
      fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts${AlpacaUserId}`, options)
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
      
    //  console.log("res: ", res.id)



    
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
 ref={TransactionRecepieBroughtAssets_Sheet}
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
          backgroundColor: CurrentViewMode.Mode_bg_BroughtTransactionReceipe,
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
          backgroundColor:  CurrentViewMode.Mode_bg_BroughtTransactionReceipe,
          height: height(92),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }} 	
        style={{
          height: "100%",
          backgroundColor:  CurrentViewMode.Mode_bg_BroughtTransactionReceipe,
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

      <Image source={{uri: CurrentChoosedAsset.logo}} 
      style={{
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
     {t("SendToBroughtHeaderInTransactionRecepieBroughtAssetsComponent")} {formatPrice(Investment)}
    </Text>

    <Text style={{
       marginLeft: width(5),
      marginTop: height(2),
      color:  CurrentViewMode.Mode_Sec_fontColor,
    }}>
    {formattedDate}
    </Text>





<View style={{
  width: "90%",
  alignSelf: 'center',
  marginTop: height(5),
}}>


<Text style={{
  color: CurrentViewMode.Mode_fontColor,
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
  color:  CurrentViewMode.Mode_fontColor,
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
  color:  CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{t("SentWithHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

<Text style={{
  right: width(0),
  position: 'absolute',
  color: CurrentViewMode.Mode_Sec_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
 {t("CashHeaderInTransactionRecepieBroughtAssetsComponent")}

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
  color:  CurrentViewMode.Mode_fontColor,
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
  color:  CurrentViewMode.Mode_fontColor,
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
 {t("FeeHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

<Text style={{
  right: width(0),
  position: 'absolute',
  color:  CurrentViewMode.Mode_Sec_fontColor,
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
  color:  CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
 {t("SumHeaderInTransactionRecepieBroughtAssetsComponent")}

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
  color:  CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  marginTop: height(7),
  marginLeft: width(5),
  fontWeight: "bold",
}}>
 {t("DocumentHeaderInTransactionRecepieBroughtAssetsComponent")}

</Text>

<View style={{

  marginLeft: width(5),
  flexDirection: "row"
}}>



<TouchableOpacity onPress={() => {

posthog.capture('open_transaction_brought_assets_bottomsheet', {
  screen: 'TransactionRecepieBroughtAssets_Sheet',
  $screen_name: 'TransactionRecepieBroughtAssets_Sheet',
  timestamp: new Date().toISOString(),

  });

}}
style={{
  height: height(18),
    marginTop: height(3),
    borderRadius: 15,
    width: width(36),
    backgroundColor:  CurrentViewMode.Mode_ButtonColor_BroughtTransactionReceipe,
    marginRight: width(5)
}}>



<Entypo name='news' style={{
    color:  CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginTop: height(5),
    marginRight: width(2), 
  }} />



  <Text numberOfLines={1} style={{
    color:  CurrentViewMode.Mode_fontColor,
    fontWeight: "bold",
    position: 'absolute',
    bottom: height(4),
    marginLeft: width(5),
    width: "80%",
  }}>
   {t("CostInformationHeaderInTransactionRecepieBroughtAssetsComponent")}
  
  </Text>

</TouchableOpacity>















<TouchableOpacity onPress={() => {

posthog.capture('open_transaction_billing_bottomsheet', {
  screen: 'TransactionRecepieBroughtAssets_Sheet',
  $screen_name: 'TransactionRecepieBroughtAssets_Sheet',
  timestamp: new Date().toISOString(),

  });

  SheetManager.show("Billing_Sheet")
}}
style={{
  height: height(18),
    marginTop: height(3),
    borderRadius: 15,
    width: width(36),
    backgroundColor:  CurrentViewMode.Mode_ButtonColor_BroughtTransactionReceipe,
  
}}>



<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginTop: height(5),
    marginRight: width(2), 
  }} />



  <Text numberOfLines={1} style={{
    color:  CurrentViewMode.Mode_fontColor,
    fontWeight: "bold",
    position: 'absolute',
    bottom: height(4),
    marginLeft: width(5),
    width: "80%",
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
  
  
  export default TransactionRecepieBroughtAssets;