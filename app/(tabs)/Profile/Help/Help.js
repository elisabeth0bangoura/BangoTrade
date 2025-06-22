import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, FlatList, Dimensions, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';


import { usePostHog } from 'posthog-react-native';


import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';

import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { FlashList } from '@shopify/flash-list';
import Collapsible from 'react-native-collapsible';
import CoinPage from '@/app/(coin)/coinPage';
import ActionSheet, {useSheetRef, ScrollView, SheetManager} from 'react-native-actions-sheet';

import { HomeChartContext } from '../../../Context/HomeChartContext';
import { useRouter } from 'expo-router';


import RNPickerSelect from "react-native-picker-select";

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '../../../Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from '../../../Context/ViewModeContext';

import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc, addDoc, collection, onSnapshot } from "@react-native-firebase/firestore";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";

import CrispChat, {
  configure,
  setUserEmail,
  setUserNickname,
  setUserPhone,
  resetSession,
} from 'react-native-crisp-chat-sdk';












export default function HelpSheet () {
  
  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


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
  


  
  
 
    
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization:
        "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==",
    },
  };











  useEffect(() => {
    posthog.capture('screen_viewed', {
      screen: 'Help_Sheet',
      $screen_name: 'Help_Sheet',
      timestamp: new Date().toISOString(),
    });
  }, []);
  



  

  
  
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
    
    



    
    const [isChatVisible, setChatVisible] = useState(false);
    const [crispKey, setCrispKey] = useState(0);
    
    const toggleChat = () => {

      posthog.capture('open_help_chat_bottomsheet', {
        screen: 'Help_Sheet',
        $screen_name: 'Help_Sheet',
        timestamp: new Date().toISOString(),

        });

      setChatVisible(false); // force unmount first
      setTimeout(() => {
        setCrispKey(prev => prev + 1); // force fresh mount
        setChatVisible(true);          // show Crisp again
      }, 100); // short delay ensures clean cycle
    };
    
    





  
    
    
    
      return (
  
  
  
        <ActionSheet 
        ref={Activity_Sheet}
        gestureEnabled={true}
        isModal={false}
        backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
        keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
        
      //  keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens     
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

           How can we help you?
             
          </Text>
  





          <Text style={{
              fontSize: size(16),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "800",
              marginTop: height(4),
              marginLeft: width(5),
          }}>

          Topics
             
          </Text>



          <TouchableOpacity onPress={() => {


              posthog.capture('open_help_asset_bottomsheet', {
                screen: 'Help_Sheet',
                $screen_name: 'Help_Sheet',
                timestamp: new Date().toISOString(),

                });

            SheetManager.show("Asset_Sheet")
          }}
          style={{
            marginLeft: width(5),
            marginTop: height(5)
            }}>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>

            <MaterialCommunityIcons name='chart-donut' style={{
              fontSize: size(22),
              color: CurrentViewMode.Mode_fontColor,
            }} />

            <Text style={{
              marginLeft: width(2),
              fontWeight: "bold",
              fontSize: size(15),
              color: CurrentViewMode.Mode_fontColor,
            }}>
            Assets
            </Text>
            </View>


            <Text style={{
              marginLeft: width(7),
              marginTop: height(1),
              fontWeight: "bold",
              width: "90%",
              fontSize: size(14),
              color: CurrentViewMode.Mode_Sec_fontColor,
            }}>
            Investments, buying and selling, savings plans, securities transfers, gifts
            </Text>
          </TouchableOpacity>
  













     <TouchableOpacity onPress={() => {



        posthog.capture('open_help_profile_bottomsheet', {
          screen: 'Help_Sheet',
          $screen_name: 'Help_Sheet',
          timestamp: new Date().toISOString(),

          });
        SheetManager.show("ProfileHelp_Sheet")
     }}
     style={{
            marginLeft: width(5),
            marginTop: height(5)
            }}>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>


          <AntDesign name='user' style={{
              color: CurrentViewMode.Mode_fontColor,
              fontSize: size(22),

            }} />

            <Text style={{
              marginLeft: width(2),
              fontWeight: "bold",
              fontSize: size(15),
              color: CurrentViewMode.Mode_fontColor,
            }}>
            Profile
            </Text>
            </View>


            <Text style={{
              marginLeft: width(7),
              marginTop: height(1),
              fontWeight: "bold",
              width: "90%",
              fontSize: size(14),
              color: CurrentViewMode.Mode_Sec_fontColor,
            }}>
            Investments, buying and selling, savings plans, securities transfers, gifts
            </Text>
          </TouchableOpacity>
  













           <TouchableOpacity onPress={toggleChat}
          style={{
            marginLeft: width(5),
            marginTop: height(5)
            }}>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>

            <Octicons name='comment' style={{
              fontSize: size(20),
              color: CurrentViewMode.Mode_fontColor,
            }} />

            <Text style={{
              marginLeft: width(2),
              fontWeight: "bold",
              fontSize: size(15),
              color: CurrentViewMode.Mode_fontColor,
            }}>
             Chat with us
            </Text>
            </View>


            <Text style={{
              marginLeft: width(7),
              marginTop: height(1),
              fontWeight: "bold",
              width: "90%",
              fontSize: size(14),
              color: CurrentViewMode.Mode_Sec_fontColor,
            }}>
             Choose from the topics listed above. You will then be redirected to the chat or an appropriate solution.
            </Text>
          </TouchableOpacity>
  
  
  
       
       
  </ScrollView>
        



{isChatVisible && <CrispChat key={crispKey} />}


  
      </ActionSheet>
  
     
     
      );
    };
    