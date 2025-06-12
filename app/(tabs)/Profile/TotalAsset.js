import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, Dimensions, ScrollView, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
import { GestureHandlerRootView, FlatList } from 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '../../../Languages_Translation_Screens/i18n'; 
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';





import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';

import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { FlashList } from '@shopify/flash-list';
import Collapsible from 'react-native-collapsible';
import CoinPage from '@/app/(coin)/coinPage';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';

import { HomeChartContext } from '../../Context/HomeChartContext';
import { useRouter } from 'expo-router';

import { AmountContext } from '../../Context/OpenAmountSheetContext';
import { CoinPageContext } from '../../Context/OpenCoinPageContext';
import { SellAmountContext } from '../../Context/SellOpenAmountSheetContext';
import RNPickerSelect from "react-native-picker-select";

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '../../Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from '../../Context/ViewModeContext';


import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc, addDoc, collection, onSnapshot } from "@react-native-firebase/firestore";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";










export default function TotalAssetSheet () {
  

	const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  



  const { t } = useTranslation();

    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

      
    const [UserFirstName, setUserFirstName] = useState("")
    const [UserLastName, setUserLastName] = useState("")
  
    const [AlpacaUserId, setAlpacaUserId] = useState();


    const {MetricsState, setMetricsState} = useContext(HomeChartContext)
    const windowHeight = Dimensions.get('window').height;
    const TotalAsset_Sheet = useRef(null);
  const calculatedHeight = windowHeight * 0.92;
    const [Sum, setSum] = useState()
  

// Format price with commas and the Euro symbol
const formatPrice = (price) => {
  return new Intl.NumberFormat('us-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};



  const [equity, setEquity] = useState(null);
  const [error, setError] = useState(null);
  const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)









  useEffect(() => {



    const fetchUserData = async () => {
      try {
        // Fetch user document from Firestore
        const userDocument = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
  
        if (userDocument.exists) {
          // If the document exists, set the data
          const userData = userDocument.data();
  
          setAlpacaUserId(userData?.AlpacaAccountId);
          setUserFirstName(userData?.newAccountPayload?.identity?.given_name);
          setUserLastName(userData?.newAccountPayload?.identity?.family_name);
  
          console.log("given_name ", userData?.newAccountPayload?.identity?.given_name);
          console.log("family_name ", userData?.newAccountPayload?.identity?.family_name);
          console.log("AlpacaAccountId: ", userData?.AlpacaAccountId);
  


    const GetAccountValues = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization:
              "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==",
          },
        };

        const response = await fetch(
          `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userData.AlpacaAccountId}/account`,
          options
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to fetch account equity.");
        }

        console.log(data); // ✅ Log equity for debugging
        setEquity(data.position_market_value); // ✅ Store equity in state
        setSetcash_withdrawable(data.cash)
        setSum(data.equity)
      } catch (err) {
        setError(err.message);
        console.error("❌ Error fetching trading account equity:", err);
      }
    };

    GetAccountValues();

           
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

fetchUserData();
}, [user?.uid]); // Make sure the effect runs whenever user.uid changes


  
    
      return (
  
  
  
        <ActionSheet 
        ref={TotalAsset_Sheet}
        gestureEnabled={true}
        isModal={false}
        backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
        keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
             
        onOpen={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
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
   
  
        <View>
          <Text style={{
              fontSize: size(25),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "900",
              marginTop: height(4),
              marginLeft: width(5),
          }}>
             {t("TotalAssetHeader")}   
          </Text>



          <View style={{
            flexDirection: 'row',
            width: "90%",
            marginTop: height(5),

          }}>

            <Text style={{
               fontSize: size(15),
              marginLeft: width(5),
              color: CurrentViewMode.Mode_Sec_fontColor,
              fontWeight: "bold",
            }}>
              {t("PortfolioHeader")}     
            </Text>



            <Text style={{
               fontSize: size(15),
              right: width(0),
              color: CurrentViewMode.Mode_fontColor,
              position: 'absolute',
              fontWeight: "bold",
            }}>
           {formatPrice(equity)}
            </Text>


          </View>









          <View style={{
            flexDirection: 'row',
            width: "90%",
            marginTop: height(5),

          }}>

            <Text style={{
               fontSize: size(15),
              marginLeft: width(5),
              color: CurrentViewMode.Mode_Sec_fontColor,
              fontWeight: "bold",
            }}>
             {t("CashBalanceHeader")}   
            </Text>



            <Text style={{
               fontSize: size(15),
              right: width(0),
              color:  CurrentViewMode.Mode_fontColor,
              position: 'absolute',
              fontWeight: "bold",
            }}>
            {formatPrice(setcash_withdrawable)}
            </Text>


          </View>








          <View style={{
            flexDirection: 'row',
            width: "90%",
            marginTop: height(5),

          }}>

            <Text style={{
               fontSize: size(15),
              marginLeft: width(5),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "bold",
            }}>
              {t("SumHeader")}     
            </Text>



            <Text style={{
               fontSize: size(15),
              right: width(0),
              color: CurrentViewMode.Mode_fontColor,
              position: 'absolute',
              fontWeight: "bold",
            }}>
            {formatPrice(Sum)}
            </Text>


          </View>
  
      </View>




      <Text style={{
          color:  CurrentViewMode.Mode_Third_fontColor,
          fontSize: size(12),
          position: 'absolute',
          width: "90%",
          marginLeft: width(5),
          lineHeight: height(2.1),
         top: height(77),
         fontWeight: "bold",
       
        }}>

        {t("depositprotectionHeader1")} <Text style={{color: "#691AF5", fontSize: size(12),}}>{t("depositprotectionhereHeader1")}</Text>. 
        {t("depositprotectionHeader2")}
        {t("depositprotectionHeader3")} <Text style={{color: "#691AF5", fontSize: size(12),}}>{t("depositprotectionhereHeader2")}</Text>.
        </Text>

      </ActionSheet>
  
     
     
      );
    };
    