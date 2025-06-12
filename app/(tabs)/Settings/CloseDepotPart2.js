import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Button,
   Keyboard,
   TouchableWithoutFeedback,
   KeyboardAvoidingView,
   Switch,
  Platform, FlatList, Dimensions, ScrollView, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '../../../Languages_Translation_Screens/i18n'; 
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';

import { getFirestore, addDoc, getDoc, setDoc, updateDoc, collection, doc, onSnapshot } from "@react-native-firebase/firestore";




import { getAuth, signOut, onAuthStateChanged } from "@react-native-firebase/auth";

import { getDatabase, ref, get } from "@react-native-firebase/database";


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
import LottieView from 'lottie-react-native';
import { TextInput } from 'react-native-gesture-handler';

import {
	Onfido,
	OnfidoCaptureType,
	OnfidoCountryCode,
	OnfidoDocumentType,
  } from '@onfido/react-native-sdk'; 
import { ToastMessageContext } from '@/app/Context/ToastMessageContext';
import { ViewModeContext } from '@/app/Context/ViewModeContext';

// Replace with your Onfido API Token and Document ID
const apiToken = 'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE3MzcyODU2MzUsInBheWxvYWQiOnsiYXBwIjoiMDBkNjI4ZGMtNmI5Zi00ZWVhLThkNDMtOTZhYzllOTM2YzRlIiwiY2xpZW50X3V1aWQiOiJkOGU2NjI0NC00ODgwLTQyMzktODE1OS03NWIyOTZiYTgwMDgiLCJpc19zYW5kYm94Ijp0cnVlLCJpc19zZWxmX3NlcnZpY2VfdHJpYWwiOmZhbHNlLCJpc190cmlhbCI6ZmFsc2UsInJlZiI6IioiLCJzYXJkaW5lX3Nlc3Npb24iOiI0ZTAwZGZlMy1mNDllLTRjMTgtYWMyMi1kZjY0MDcwOTZiMzIifSwidXVpZCI6InBsYXRmb3JtX3N0YXRpY19hcGlfdG9rZW5fdXVpZCIsInVybHMiOnsiZGV0ZWN0X2RvY3VtZW50X3VybCI6Imh0dHBzOi8vc2RrLnVzLm9uZmlkby5jb20iLCJzeW5jX3VybCI6Imh0dHBzOi8vc3luYy5vbmZpZG8uY29tIiwiaG9zdGVkX3Nka191cmwiOiJodHRwczovL2lkLm9uZmlkby5jb20iLCJhdXRoX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJvbmZpZG9fYXBpX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJ0ZWxlcGhvbnlfdXJsIjoiaHR0cHM6Ly9hcGkudXMub25maWRvLmNvbSJ9fQ.MIGGAkF0rw7l5fuzZZZvfNFiI1BXeS-gVF0JMCzorclBZ_jTz8lY6ZF05I4fTARsq3BpNw8c6yNMiBmQ_LouZAwsPNuO9wJBMAr-yoT3znJetCdJPGhoV3gAd0cz-KAylkAX-HBSyxoafwrwloIqzaA5UzpzlR7KWd3NC4F3TeTDVb2ZU-9qRdo';  // Replace with your Onfido API token
const documentId = 'b7e0f8af-9e06-4751-b502-a7ac44655e86';  // Example document ID















export default function CloseDepotPart2() {



  const { t } = useTranslation();
  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);





  const router = useRouter();

	const animation = useRef(null);
    

    const [isEnabledEmail, setisEnabledEmail] = useState(false);
    const [isEnabledPushNotifications, setisEnabledPushNotifications] = useState(false);

    
    const windowHeight = Dimensions.get('window').height;
    const CloseDepotPart2_Sheet = useRef(null);
    const calculatedHeight = windowHeight * 0.88;
  
    const firstNameInputRef = useRef(null); // Ref for First Name Input
    const lastNameInputRef = useRef(null); // Ref for Last Name Input
  
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [PhoneNumber, setPhoneNumber] = useState("")
    const [Email, setEmail] = useState("")
    const [Address, setAddress] = useState("")
    const [Nationality, setNationality] = useState("")
    const [DateOfBirth, setDateOfBirth] = useState("")
    const [country_of_birth, setcountry_of_birth] = useState("")
    const [activeInput, setActiveInput] = useState("first"); // Track which input is active
  
      const [onfidoResultData, setOnfidoResultData] = useState(null);
  
    const [NewFirstName, setNewFirstName] = useState("")
    const [NewLastName, setNewLastName] = useState("")
    const [status, setStatus] = useState('');
    const [onfidoToken, setOnfidoToken] = useState(null);
    const [Phonenumber, setPhonenumber] = useState()
    const [AlpacaUserId, setAlpacaUserId] = useState()
    const {
      showToast, 
      setShowToast,
      showChangedPhoneNumber, setshowChangedEmail
  
       } = useContext(ToastMessageContext);
  
  
  
     const auth = getAuth();
     const firestore = getFirestore();
     const currentUser = auth.currentUser; // Get the currently logged-in user
   const database = getDatabase();
  
  
   
  
  

      
   
  
 
  
  
  
  
  
  useEffect(() => {
  
    const GetUserData = async () => {
  
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
        }
      };
      
     await  fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}`, options)
        .then(res => res.json())
        .then(res => {
          console.log(res.contact.email_address)
  
          setEmail(res.contact.email_address)
        })
        .catch(err => console.error(err));
  
    }
  
    GetUserData()
  
  }, [AlpacaUserId])
  
  
  
  
  
    // ✅ Prevent flickering when closing bottom sheet
    const handleOpen = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      setTimeout(() => {
        firstNameInputRef.current?.focus();
      }, 300);
    };
  
  
  
  


  
   useEffect(() => {

      setTimeout(() => {
        signOut(auth)
        .then( async () => {

          const options = {
            method: 'POST',
            headers: {
              authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
            }
          };
          
       
          
         await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}/actions/close`, options)
            .then(res => res.json())
            .then(res => {
         
              console.log('User signed out!');
              SheetManager.hide("CloseDepotPart2_Sheet")
              SheetManager.hide("CloseDepot_Sheet")
              SheetManager.hide("OtherServices_Sheet")
              SheetManager.hide("ChnagePhoneNUmber_Sheet")
              SheetManager.hide("Settings_Sheet")
           
              router.replace("/(auth)/signUp");
            })
            .catch(err => console.error(err));

        
        })
        .catch((error) => {
          console.error('Sign out error:', error);
        });
     
      }, 5000);
    
  }, []);


   
  
  
  
    const toggleSwitchEmail = (newValue) => {
        setisEnabledEmail((prev) => {
            console.log("Email Ads: ", !prev); // Logs the new value correctly


        const AddData = async () => {
            try {
                const userRef = doc(firestore, "users", currentUser.uid);
                
                // Set the field without deleting other fields
                await setDoc(userRef, { 
                    Email_Notification: !prev 
                }, { merge: true });
        
                console.log("Push_Notification field set successfully without deleting other fields!");
            } catch (error) {
                console.error("Error setting document:", error);
            }
        };
        
        // Call the function
        AddData();
            return newValue;
        });


    };
    


    const toggleSwitchPushNotifications = (newValue) => {
        setisEnabledPushNotifications((prev) => {
            console.log("Push Notification: ", !prev); // Logs the new value correctly

            const AddData = async () => {
                try {
                    const userRef = doc(firestore, "users", currentUser.uid);
                    
                    // Set the field without deleting other fields
                    await setDoc(userRef, { 
                        Push_Notification: !prev 
                    }, { merge: true });
            
                    console.log("Push_Notification field set successfully without deleting other fields!");
                } catch (error) {
                    console.error("Error setting document:", error);
                }
            };
            
            // Call the function
            AddData();
            return newValue;
        });


      
        
    };
    



  
   
  
  
  
  
  return( 
  
  
    <>
  
  
  
  
  
    <ActionSheet gestureEnabled
    ref={CloseDepotPart2_Sheet}
    backgroundInteractionEnabled={false}
    isModal={false}
    onOpen={handleOpen}
   
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
  


  <View style={{
    width: "100%",
    height: '100%',
  //  backgroundColor: 'yellow'
  alignSelf: 'center',
      
  justifyContent: 'center',
  alignItems: 'center',
  }}>




<View style={{
			alignSelf: 'center',

			justifyContent: 'center',
			alignItems: 'center',
		}}>


	

		<LottieView
        autoPlay
        ref={animation}
        style={{
          width: 45,
          height: 45,
        }}
        source={require("../../../assets/loadibg.json")}
      />



        <Text style={{
          marginTop: height(1),
          width: width(80),
          textAlign: 'center',
          lineHeight: height(2.5),
          color: CurrentViewMode.Mode_Sec_fontColor,
        }}>

          {t("Text1InCloseAccount2Component")}  
       
        </Text>

		</View>

  
  
 </View>
  
    </ActionSheet>
    </>
  )
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  