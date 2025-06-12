import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, Dimensions, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
import { GestureHandlerRootView,ScrollView, FlatList } from 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
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










export default function ActivitySheet () {
  


	const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  



  const { t } = useTranslation();


    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

    const {MetricsState, setMetricsState} = useContext(HomeChartContext)
    const {setCurrentChoosedItem} = useContext(HomeContext)
    const windowHeight = Dimensions.get('window').height;
    const Activity_Sheet = useRef(null);
    const calculatedHeight = windowHeight * 0.92;
  
    const [AlpacaUserId, setAlpacaUserId] = useState();

    const [groupedActivities, setGroupedActivities] = useState([]);
  
    const [UserFirstName, setUserFirstName] = useState("")
    const [UserLastName, setUserLastName] = useState("")
  
  
  
  
  
  
 
    
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization:
        "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==",
    },
  };
  

  // ✅ Function to get correct headers (This Month / Month Year)
  const getMonthHeader = (dateString) => {
    const date = new Date(dateString);
    const month = t(date.toLocaleString('default', { month: 'long' }));  // Translate month name
    const monthYear = `${month} ${date.getFullYear()}`;
  
    const currentDate = new Date();
    const currentMonth = t(currentDate.toLocaleString('default', { month: 'long' }));  // Translate current month
    const currentMonthYear = `${currentMonth} ${currentDate.getFullYear()}`;
  
    return monthYear === currentMonthYear ? t('ThisMonth') : monthYear;
  };
  




  
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
    

      const API_URL =
      `https://broker-api.sandbox.alpaca.markets/v1/accounts/activities?account_id=${userData.AlpacaAccountId}&page_size=100`;
  
      

      const fetchActivities = async () => {
        try {
          const response = await fetch(API_URL, options);
          if (!response.ok) {
            console.error("API Error:", await response.text());
            return;
          }
  
          const data = await response.json();
          console.log("Fetched Activities:", data);
  
          // ✅ Grouping Activities
          const groupedData = {};
          data.forEach((activity) => {
            const header = getMonthHeader(activity.date || activity.transaction_time);
            if (!groupedData[header]) {
              groupedData[header] = [];
            }
            groupedData[header].push(activity);
          });

          
  
          // ✅ Convert to FlatList Format
          const formattedData = [];
          Object.keys(groupedData).forEach((month) => {
            formattedData.push({ type: "header", title: month });
            groupedData[month].forEach((item) => formattedData.push({ type: "item", ...item }));
          });
  
          setGroupedActivities(formattedData);
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };
  
      fetchActivities();


           
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

fetchUserData();
}, [user?.uid]); // Make sure the effect runs whenever user.uid changes



  
  
  
 
  
  
  
    
    const formatDate = (isoString) => {

      if (!isoString) return "";
    
      const date = new Date(isoString);
      const day = date.getDate();
      const month = t(date.toLocaleString('default', { month: 'long' }));  // Translate month name
    
      return `${day}. ${month}`;
    };
    
    
  
    
    
    
      return (
  
  
  
        <ActionSheet 
        ref={Activity_Sheet}
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
   
  
  
  
        <ScrollView showsVerticalScrollIndicator={false} style={{
        height: "100%",
        width: "90%",
        alignSelf: 'center'
        }}>
  
  
          <Text style={{
              fontSize: size(25),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "900",
              marginTop: height(4),
              marginLeft: width(5),
          }}>

          {t("ActivityHeader")}  
             
          </Text>
  
  
  
  
          <FlatList style={{
            height: "100%",
            width: "90%",
            alignSelf: 'center',
          }} contentContainerStyle={{
            paddingBottom: height(10),
            paddingTop: height(2)
          }}
        data={groupedActivities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          item.type === "header" ? (
            <Text
              style={{
                fontSize: size(15),
                fontWeight: "bold",
                color: CurrentViewMode.Mode_Sec_fontColor,
              //  marginBottom: height(5),
                marginTop: height(2),
                
              }}
            >
              {item.title}
            </Text>
          ) : (
            <View  
            style={{ 
              marginTop: height(2), 
              flexDirection: 'row', 
              alignItems: 'center',  
              marginBottom: height(2),
            }}>
             
  
              
             <View style={{  
               alignItems: 'center', 
               height: 50, 
               width: 50, 
              justifyContent: 'center',
             
               
               }}>
             
  
  
            {
            item.activity_type == "CSW" 
            
            ?
  
             <MaterialCommunityIcons name='bank-transfer-in' style={{
              color: CurrentViewMode.Mode_fontColor,
              alignSelf: 'center',
              fontSize: size(30),
                }} />
  
            :
  
            null
  
            }
  
  
  
            {
            item.activity_type == "CSD" 
            
            ?
  
             <MaterialCommunityIcons name='bank-transfer-out' style={{
                color: CurrentViewMode.Mode_fontColor,
                alignSelf: 'center',
                fontSize: size(30),
     
                }} />
  
            :
  
            null
  
            }
  
  
  
  
  
  {
           item.side == "buy"  ||   item.side == "sell" 
            
            ?
  
             <MaterialCommunityIcons name='chart-donut' style={{
              color: CurrentViewMode.Mode_fontColor,
              alignSelf: 'center',
              fontSize: size(30),
                }} />
  
            :
  
            null
  
            }
  
  
  
  
  
  
  
           
  
           
  
  
  
              </View>
  
  
  
  
  
  
  
  
              <View style={{
                marginLeft: width(10), 
              }}>
        
             {item.activity_type == "CSD" 
             ?
  
  
            
              
          
             <Text style={{ color: CurrentViewMode.Mode_fontColor, fontSize: size(13), fontWeight: 'bold' }}>
              {t("DepositHeader")}   
             </Text>
      
              : 
              
              null
              
              }
  
  
             {item.activity_type == "CSW" 
             ?
  
             <Text style={{ color: CurrentViewMode.Mode_fontColor, fontSize: size(13), fontWeight: 'bold' }}>
              {t("WithdrawHeader")}     
             </Text>
              
              : 
              
              null
              
              }
  
              {item.side == "buy" 
             ?
  
             <Text style={{ color: CurrentViewMode.Mode_fontColor,  fontSize: size(13), fontWeight: 'bold' }}>
               {t("BroughtHeader")}  {item.symbol}
             </Text>
              
              : 
              
              null
              
              }
  
  
  
            {item.side == "sell" 
             ?
  
             <Text style={{ color: CurrentViewMode.Mode_fontColor, fontSize: size(13), fontWeight: 'bold' }}>
              {t("SoldHeader")}  {item.symbol}
             </Text>
              
              : 
              
              null
              
              }
  
              <Text style={{ color: CurrentViewMode.Mode_Sec_fontColor, fontSize: size(13), }}>
              {formatDate(item.date || item.transaction_time)}
              </Text>
  
  
              </View>
  
            </View>
          )
        }
      />
  </ScrollView>
        
  
      </ActionSheet>
  
     
     
      );
    };
    