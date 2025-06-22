// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, Dimensions, Easing, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import {AntDesign, Entypo, Feather, Foundation, MaterialCommunityIcons, MaterialIcons, Octicons} from "@expo/vector-icons"
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
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import { usePostHog } from 'posthog-react-native';




const HEADER_HEIGHT = 300; // The height of the header























const TransactionRecepieDeposit =  React.memo((props) => {


  const posthog = usePostHog(); // ✅ this gives you access to the actual instance

  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


  const { selectedItem } = props.payload;  // Access the passed item data


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


// Format price with commas and the Euro symbol
const formatPrice = (price) => {
  return new Intl.NumberFormat('us-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};



    const currentUser = auth().currentUser;
 
    const windowHeight = Dimensions.get('window').height;
    const snapPointsAmount = useMemo(() => [windowHeight * 0.91], []);
    const TransactionRecepieDeposit_Sheet = useRef(null); // ✅ Correct ref type
    const calculatedHeight = windowHeight * 0.88;
    const [UserFirstname, setUserFirstname] = useState("")
    const [UserLastname, setUserLastname] = useState("")
  
    const {CurrentChoosedAsset, setCurrentChoosedAsset} = useContext(TrasnactionReceipeContext)

    const [DateTracationhappend, setDateTracationhappend] = useState()
  
    const [TransferCompleted, setTransferCompleted] = useState()
    const [TransferFundsAvailable, setTransferFundsAvailable] = useState()
    const [AccountNumber, setAccountNumber] = useState("")



      const [AlpacaUserId, setAlpacaUserId] = useState();


  const [UserLang, setUserLang] = useState()
  const [Depot_number, setDepot_number] = useState("")

  
  const [Sum, setSum] = useState()

  const [equity, setEquity] = useState(null);
  const [error, setError] = useState(null);
  const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")


   
// Regular expression to extract the statement_id
const statementIdMatch = selectedItem.description.match(/statement_id:\s([a-f0-9\-]+)/);

// If a match is found, extract the statement_id
const statementId = statementIdMatch ? statementIdMatch[1] : null;













useEffect(() => {
  posthog.capture('screen_viewed', {
    screen: 'TransactionRecepieDeposit_Sheet',
    $screen_name: 'TransactionRecepieDeposit_Sheet',
    timestamp: new Date().toISOString(),
  });
}, []);










// Log the statement_id
console.log("Statement ID: ", statementId);



    console.log("CurrentChoosedAsset: ", CurrentChoosedAsset)
  
    const getFirstLetter = (str) => {
      if (str && str.length > 0) {
        return str.charAt(0);  // Return the first letter of the string
      }
      return '';  // Return an empty string if the input is empty or undefined
    };
    
    










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
        
     }, [AlpacaUserId]);
  
  













  
  
  
    useEffect(() => {

      console.log("AlpacaUserId ", AlpacaUserId)

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
        }
      };
      
      fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}/ach_relationships`, options)
        .then(res => res.json())
        .then(res => {
          console.log("res: ", res)
        setAccountNumber(res[0].bank_account_number)
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
      
      fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}/transfers`, options)
      .then(res => res.json())
      .then(res => {
        console.log("🔹 Full Transfers Response:", res);
  
        // Find transfer with specific ID
        const transfer = res.find(t => t.id === statementId);
  
        if (transfer) {
          console.log("✅ Transfer Found:", transfer);
  
          // Extract timestamps
          const transferReceived = transfer.created_at;
          const transferCompleted = transfer.updated_at;
          const fundsAvailableAt = transfer.hold_until;
  
          // Get the current language from i18n
          const currentLanguage = i18n.language; // 'en', 'de', 'fr' or any language codes supported
  
          // Format the dates dynamically using Luxon and the current language
          const formattedReceived = DateTime.fromISO(transferReceived)
            .setLocale(currentLanguage) // Use current language dynamically
            .toFormat('d. MMMM yyyy • HH:mm');
  
          const formattedCompleted = DateTime.fromISO(transferCompleted)
            .setLocale(currentLanguage) // Use current language dynamically
            .toFormat('d. MMMM yyyy • HH:mm');
  
          const formattedFundsAvailable = DateTime.fromISO(fundsAvailableAt)
            .setLocale(currentLanguage) // Use current language dynamically
            .toFormat('d. MMMM yyyy • HH:mm');
  
          console.log("📥 Transfer Received:", formattedReceived);
          console.log("✅ Transfer Completed:", formattedCompleted);
          console.log("💰 Funds Available:", formattedFundsAvailable);
  
          // Set the state with the formatted dates
          setDateTracationhappend(formattedReceived);
          setTransferCompleted(formattedCompleted);
          setTransferFundsAvailable(formattedFundsAvailable);
        } else {
          console.warn("❌ Transfer not found for the given ID.");
        }
      })
      .catch(err => console.error("🚨 Error fetching transfers:", err));
  }, [AlpacaUserId]);
    
  
  
  

  
    
    
    


    // Assuming CurrentChoosedAsset.transaction_time is "2025-02-20T08:12:53.753762Z"
    const transactionTime = CurrentChoosedAsset.date;

    const formattedDate = DateTime.fromISO(transactionTime)
      .setLocale('us') // Set the locale to German
      .toFormat('d. MMMM yyyy'); // Format to "23. Juli 2024 • 19:39"
    
    console.log(formattedDate); // This will output something like "20. Februar 2025 • 08:12"
    
    

    const fullName = `${UserFirstname} ${UserLastname}`.toUpperCase();










  
    
  
  return(
  
  
    <>
   
  


 <ActionSheet  
 ref={TransactionRecepieDeposit_Sheet}
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
          backgroundColor: '#0F0F0F'
      }}>
      
      
















      
 <ScrollView style={{
    height: "100%",
    width: "100%"
 }} contentContainerStyle={{
  paddingBottom: height(10)
 }} showsVerticalScrollIndicator={false}>



<View style={{
 height: size(40),
 marginRight: width(2),
 width: size(40),
 marginBottom: height(2),
 borderRadius: size(40)/2,
 marginLeft: width(5),
 backgroundColor: CurrentViewMode.Main_IconButtonBg,
 alignItems: 'center',
 justifyContent: 'center',
      
 }}>

     
<Text style={{
  color: CurrentViewMode.Main_IconButtonText,
  fontSize: size(14),
  fontWeight: "bold"
  }}>
  {getFirstLetter(UserFirstname)}
  </Text>

</View>

<Text style={{
        color: CurrentViewMode.Mode_fontColor,
        fontSize: size(22),
        fontWeight: "900",
        width: "90%",
        marginLeft: width(5)
    }}>
    {t("YouHaveDepositHeaderInTransactionRecepieDepositComponent1")} {formatPrice(CurrentChoosedAsset.net_amount)} {t("YouHaveDepositHeaderInTransactionRecepieDepositComponent2")} {UserFirstname} {UserLastname} {t("YouHaveDepositHeaderInTransactionRecepieDepositComponent3")}
    </Text>

    <Text style={{
       marginLeft: width(5),
      marginTop: height(1),
      color: CurrentViewMode.Mode_Sec_fontColor
    }}>
  {DateTracationhappend}
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
 {t("OverviewHeaderInTransactionRecepieDepositComponent")}  
</Text>





<View style={{
  flexDirection: 'row',
  marginTop: height(3),
}}>

<Text style={{
  color: CurrentViewMode.Mode_Sec_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
 {t("StatusHeaderInTransactionRecepieDepositComponent")}  
</Text>

<Text style={{
  right: width(0),
  position: 'absolute',
  color: '#00CE39',
  fontSize: size(15),
  fontWeight: "bold",
}}>
 {t("CompletedHeaderInTransactionRecepieDepositComponent")}   
</Text>

</View>









<View style={{
  flexDirection: 'row',
  marginTop: height(2),
}}>

<Text style={{
  color:  CurrentViewMode.Mode_Sec_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
 {t("CompletedHeaderInTransactionRecepieDepositComponent")}    
</Text>

<Text style={{
  right: width(0),
  position: 'absolute',
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{fullName}
</Text>

</View>

















<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  marginTop: height(8),
  fontWeight: "bold",
}}>
 {t("StatusHeaderInTransactionRecepieDepositComponent")}  
</Text>






<View style={{
  flexDirection: 'row',
  marginTop: height(3),
}}>

<View style={{
  width: "100%",
//  backgroundColor: 'yellow',
  height: height(23),
}}>

  <View style={{
    backgroundColor: CurrentViewMode.Mode_StatusLine,
    height: "100%",
    marginLeft: 20,
    width: 1,
  }}>

<View style={{
 // backgroundColor: 'green',
  height: 50,
  width: 300,
  flexDirection: 'row',
}}>
<View style={{
  height: size(30),
  width: size(30),
  marginLeft: width(-3),
  backgroundColor: CurrentViewMode.Mode_bg,
  justifyContent: 'center',
  alignItems: 'center',
  }}>

  <Octicons name='check-circle-fill' style={{
    color: CurrentViewMode.Main_StatusBgIcon_TransactionReceipe,
    fontSize: size(20)
  }} />
 </View>

<View style={{
 marginLeft: width(7)
}}>
<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontWeight: "bold",
  marginBottom: height(1),
  fontSize: size(14),
}}>
 {t("TransferReceivedHeaderInTransactionRecepieDepositComponent")}  
  
</Text>

<Text style={{
   fontSize: size(12),
   color:  CurrentViewMode.Mode_Sec_fontColor,
   fontWeight: "bold"
}}>
{DateTracationhappend}
</Text>
</View>

  </View>









  <View style={{
//  backgroundColor: 'green',
  height: 50,
  width: 300,
  marginTop: height(5),
  flexDirection: 'row',
}}>
<View style={{
  height: size(30),
  width: size(30),
  marginLeft: width(-3),
  backgroundColor: CurrentViewMode.Mode_bg,
  justifyContent: 'center',
  alignItems: 'center',
  }}>

  <Octicons name='check-circle-fill' style={{
    color: CurrentViewMode.Main_StatusBgIcon_TransactionReceipe,
    fontSize: size(20)
  }} />
 </View>

<View style={{
 marginLeft: width(7)
}}>
<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontWeight: "bold",
  marginBottom: height(1),
  fontSize: size(14),
}}>
 {t("TransferCompletedReceivedHeaderInTransactionRecepieDepositComponent")}   
</Text>

<Text style={{
   fontSize: size(12),
   color:  CurrentViewMode.Mode_Sec_fontColor,
   fontWeight: "bold"
}}>
{TransferCompleted}
</Text>
</View>

  </View>






  <View style={{
//  backgroundColor: 'green',
  height: 50,
  width: 300,
  marginTop: height(5),
  flexDirection: 'row',
}}>
<View style={{
  height: size(30),
  width: size(30),
  marginLeft: width(-3),
  backgroundColor: CurrentViewMode.Mode_bg,
  justifyContent: 'center',
  alignItems: 'center',
  }}>

  <Octicons name='check-circle-fill' style={{
    color: CurrentViewMode.Main_StatusBgIcon_TransactionReceipe,
    fontSize: size(20)
  }} />
 </View>

<View style={{
  marginLeft: width(7)
}}>
<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontWeight: "bold",
  marginBottom: height(1),
  fontSize: size(14),
}}>
 {t("TransferAddedToYourAccountHeaderInTransactionRecepieDepositComponent")}   

</Text>

<Text style={{
   fontSize: size(12),
   color:  CurrentViewMode.Mode_Sec_fontColor,
   fontWeight: "bold"
}}>
{TransferFundsAvailable}
</Text>
</View>

  </View>

  </View>




</View>

</View>













<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  marginTop: height(10),
  fontWeight: "bold",
}}>
 {t("SenderHeaderInTransactionRecepieDepositComponent")}    
</Text>






<View style={{
  flexDirection: 'row',
  marginTop: height(3),
}}>

<View style={{
 height: size(35),
 marginRight: width(2),
 width: size(35),
 marginBottom: height(2),
 borderRadius: 35/2,
 backgroundColor: CurrentViewMode.Main_IconButtonBg,
 alignItems: 'center',
 justifyContent: 'center',
      
 }}>

     
<Text style={{
  color: CurrentViewMode.Main_IconButtonText,
  fontSize: size(13),
  fontWeight: "bold"
  }}>
  {getFirstLetter(UserFirstname)}
  </Text>

</View>



<View>

<Text style={{
  marginLeft: width(5),
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
  marginBottom: height(1)
}}>
{UserFirstname} {UserLastname}
</Text>

<Text style={{
  marginLeft: width(5),
  color:  CurrentViewMode.Mode_Sec_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
{AccountNumber}
</Text>
</View>




</View>




</View>









<View style={{
  marginTop: height(7),
  marginLeft: width(5),
}}>


<Text style={{
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(15),
  fontWeight: "bold",
}}>
 {t("DocumentHeaderInTransactionRecepieDepositComponent")}     
</Text>


<TouchableOpacity onPress={() => {

posthog.capture('open_transaction_confirmation_bottomsheet', {
  screen: 'TransactionRecepieDeposit_Sheet',
  $screen_name: 'TransactionRecepieDeposit_Sheet',
  timestamp: new Date().toISOString(),

  });

  SheetManager.show("TransactionConfirmation_Sheet")
}}
style={{
  height: height(18),
    marginTop: height(3),
    borderRadius: 15,
    width: width(36),
    backgroundColor: CurrentViewMode.Mode_ButtonColor_TransactionReceipe,
  
}}>



<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginTop: height(5),
    marginRight: width(2), 
  }} />



  <Text numberOfLines={1} 
  style={{
    color: CurrentViewMode.Mode_fontColor,
    fontWeight: "bold",
    position: 'absolute',
    bottom: height(4),
    marginLeft: width(5),
    width: "75%",
  }}>
  {t("TransactionConfirmationHeaderInTransactionRecepieDepositComponent")}   

  </Text>

</TouchableOpacity>


</View>

 </ScrollView>
  
  
  
  
  
         


  
 </ActionSheet>
  
  

  
        </>
  );
  });
  
  
  export default TransactionRecepieDeposit;