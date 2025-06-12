

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
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '../../../Languages_Translation_Screens/i18n'; 
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { getFirestore, addDoc, getDoc, setDoc, getDocs, collection, doc, onSnapshot } from "@react-native-firebase/firestore";


import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
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

import { TextInput } from 'react-native-gesture-handler';

import {
	Onfido,
	OnfidoCaptureType,
	OnfidoCountryCode,
	OnfidoDocumentType,
  } from '@onfido/react-native-sdk'; 
import { ToastMessageContext } from '../../Context/ToastMessageContext';
import Pin_Settings from '../Pin_Settings';
import { ViewModeContext } from '@/app/Context/ViewModeContext';

// Replace with your Onfido API Token and Document ID
const apiToken = 'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE3MzcyODU2MzUsInBheWxvYWQiOnsiYXBwIjoiMDBkNjI4ZGMtNmI5Zi00ZWVhLThkNDMtOTZhYzllOTM2YzRlIiwiY2xpZW50X3V1aWQiOiJkOGU2NjI0NC00ODgwLTQyMzktODE1OS03NWIyOTZiYTgwMDgiLCJpc19zYW5kYm94Ijp0cnVlLCJpc19zZWxmX3NlcnZpY2VfdHJpYWwiOmZhbHNlLCJpc190cmlhbCI6ZmFsc2UsInJlZiI6IioiLCJzYXJkaW5lX3Nlc3Npb24iOiI0ZTAwZGZlMy1mNDllLTRjMTgtYWMyMi1kZjY0MDcwOTZiMzIifSwidXVpZCI6InBsYXRmb3JtX3N0YXRpY19hcGlfdG9rZW5fdXVpZCIsInVybHMiOnsiZGV0ZWN0X2RvY3VtZW50X3VybCI6Imh0dHBzOi8vc2RrLnVzLm9uZmlkby5jb20iLCJzeW5jX3VybCI6Imh0dHBzOi8vc3luYy5vbmZpZG8uY29tIiwiaG9zdGVkX3Nka191cmwiOiJodHRwczovL2lkLm9uZmlkby5jb20iLCJhdXRoX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJvbmZpZG9fYXBpX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJ0ZWxlcGhvbnlfdXJsIjoiaHR0cHM6Ly9hcGkudXMub25maWRvLmNvbSJ9fQ.MIGGAkF0rw7l5fuzZZZvfNFiI1BXeS-gVF0JMCzorclBZ_jTz8lY6ZF05I4fTARsq3BpNw8c6yNMiBmQ_LouZAwsPNuO9wJBMAr-yoT3znJetCdJPGhoV3gAd0cz-KAylkAX-HBSyxoafwrwloIqzaA5UzpzlR7KWd3NC4F3TeTDVb2ZU-9qRdo';  // Replace with your Onfido API token
const documentId = 'b7e0f8af-9e06-4751-b502-a7ac44655e86';  // Example document ID





export default function ChnagePinSettings () {
  
  const { t } = useTranslation();

    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);
  
    const windowHeight = Dimensions.get('window').height;
    const ChnagePinSettings_Sheet = useRef(null);
    const calculatedHeight = windowHeight * 0.88;
  
  
    const [NewPinValue, setNewPinValue] = useState()
  
    const firstNameInputRef = useRef(null); // Ref for First Name Input
    const lastNameInputRef = useRef(null); // Ref for Last Name Input
  
    const [PhoneNumber, setPhoneNumber] = useState("")
    const [activeInput, setActiveInput] = useState("first"); // Track which input is active
  
    const [Phonenumber, setPhonenumber] = useState()
    const [AlpacaUserId, setAlpacaUserId] = useState()
    const {
      showToast, 
      setShowToast,
      showChangedPhoneNumber, setshowChangedPhoneNumber,
      ShowUpdatedPin, setShowUpdatedPin
  
       } = useContext(ToastMessageContext);
  
  
  
       const auth = getAuth();
       const firestore = getFirestore();
       const currentUser = auth.currentUser; // Get the currently logged-in user
     const database = getDatabase();
  
     const userId =  currentUser.uid
        
  
  
  
     
  
     useEffect(() => {
         
      console.log("✅ Current User ID:", userId);
      
       const test = async() => {
  
          try {
              // Reference to the user's document (userId is the document name)
              const userDocRef = doc(firestore, "users", userId);
              const userDocSnap = await getDoc(userDocRef);
  
              
                  const userData = userDocSnap.data();
                 
                  console.log("here: ", userData.AlpacaAccountId)
  
                  setAlpacaUserId(userData.AlpacaAccountId)
  
            
          } catch (error) {
              console.error("❌ Error fetching AlpacaAccountId:", error);
          }
      
        }
        test()
  
  }, [userId, AlpacaUserId]);
  
  
  
  
  
  
  
  
    useEffect(() => {
  
  
  
        const fetchUserPhoneNumber = async () => {
            const currentUser = auth.currentUser; // Get the currently logged-in user
  
            if (currentUser) {
                const userId = currentUser.uid; // Get the userId
              ///  console.log("Current User ID:", userId);
  
                try {
                    // Reference to the path `/users/${userId}/contact`
                    const contactRef = ref(database, `/users/${userId}/contact`);
                    const snapshot = await get(contactRef);
  
                    if (snapshot.exists()) {
                        const contactData = snapshot.val();
                        const phone = contactData.phone_number || 'No phone number found';
                        setPhonenumber(phone);
                      //  console.log("User ID:", snapshot.val().AlpacaAccountId);
                    } else {
                        console.log("No contact information found.");
                    }
                } catch (error) {
                    console.error("Error fetching phone number:", error);
                }
            } else {
                console.log("No user is currently logged in.");
            }
        };
  
        fetchUserPhoneNumber();
  
  
  
    }, [currentUser, userId]);
  
  
  
  
  
  
  
    useEffect(() => {
  
  
  
      const GetUserData = () => {
  
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
          //  console.log(res)
  
            setPhonenumber(res.contact.phone_number)
         
          
          })
          .catch(err => console.error(err));
  
      }
  
      GetUserData()
  
    }, [AlpacaUserId, PhoneNumber])
  
  
  
  
  
  
  
  
  
  
    // When the ActionSheet opens, always focus on the first input
    const handleOpen = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      setTimeout(() => {
        firstNameInputRef.current?.focus();
      }, 300);
    };
  
    // Handle when an input loses focus (re-focus if keyboard is dismissed)
    const handleBlur = () => {
      setTimeout(() => {
        if (!firstNameInputRef.current?.isFocused() && !lastNameInputRef.current?.isFocused()) {
          firstNameInputRef.current?.focus();
        }
      }, 100);
    };
  
  
    
  
  
  
  
  return( 
  
  
    <>
  
  
  
    <ActionSheet 
    ref={ChnagePinSettings_Sheet}
    onOpen={handleOpen}

 gestureEnabled={true}
isModal={true}
backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens


    onClose={() => {
      Keyboard.dismiss(); // Dismiss the keyboard first
      setTimeout(() => {
        SheetManager.hide("ChnagePinSettings_Sheet"); // Now hide the sheet after a delay
      }, 200); // Small delay to avoid flickering
    }}
    CustomHeaderComponent={
  
  
  
  <> 
  
  
  
  
  </>
  }
  
   
   containerStyle={{
     maxHeight: height(92),
     backgroundColor: CurrentViewMode.Mode_bg_Profile,
     height:height(92),
     borderTopLeftRadius: 20,
     borderTopRightRadius: 20,
     
   }} 	
   style={{
     height: "100%",
     backgroundColor: CurrentViewMode.Mode_bg_Profile,
  }}>
  
  
  
  
  
  
  
  <Text style={{
          fontSize: size(25),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "900",
          marginTop: height(5),
          width: width(70),
          marginLeft: width(5),
          marginBottom: height(5),
      }}>
     {t("ChangePinTitleInChangePinComponent")}  
      </Text>
  
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={{
                 
                 height: "100%",
               //  gap: -20,
             
          }}>
          
  
  
      <TextInput  keyboardType="numeric"
       onChangeText={(val) => setNewPinValue(val)}
       ref={firstNameInputRef}
      placeholder={t("NewPinPlaceHolderTextInChangePinComponent")}  
      secureTextEntry
      maxLength={4}
      placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
      style={{
        marginLeft: 20,
        marginTop: height(5),
    
  
        borderWidth: 1,
        paddingHorizontal: width(5),
        borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
        height: size(50),
        width: size(50),
        fontSize: size(14),
        color: CurrentViewMode.Mode_fontColor,
        width: "90%", 
        borderRadius: 15,
        alignSelf: 'center',
      }}
      
      onFocus={() => setActiveInput("first")}
      onSubmitEditing={() => firstNameInputRef.current?.focus()} // Move to last name on enter
    
    />
  
  
  
  
  
  
  
  
  
  
  
  <View style={{
      marginTop: height(22),
       flexDirection: 'row',
  }}>
            <TouchableOpacity onPress={() => {
               Keyboard.dismiss(); // Dismiss the keyboard first
               setTimeout(() => {
                 SheetManager.hide("ChnagePinSettings_Sheet"); // Now hide the sheet after a delay
               }, 200); // Small delay to avoid flickering
   }}
            style={{
              backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
              height: size(50),
              borderRadius: 10,
              width:  size(50),
              marginLeft: width(5),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
  
              <MaterialIcons name='keyboard-arrow-left' style={{
                color: CurrentViewMode.Mode_fontColor,
                fontSize: size(25),
              }} />
             
            </TouchableOpacity>
  
  
  
  
  
            <TouchableOpacity
            onPress={async () => {
              console.log("🔹 Storing new PIN:", NewPinValue);
  
              if (!NewPinValue || NewPinValue.length !== 4) {
                console.log("❌ Error: Invalid PIN value.");
                return;
              }
  
              try {
                await setDoc(doc(firestore, `users/${userId}`), { AppPin: NewPinValue }, { merge: true });
  
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setShowUpdatedPin(true)
                console.log("✅ PIN successfully updated!");
                SheetManager.hide("ChnagePinSettings_Sheet");
              } catch (error) {
                console.error("❌ Error storing PIN:", error);
              }
            }}
            style={{
              backgroundColor:CurrentViewMode.Mode_fontColor,
              height: size(50),
              borderRadius: 10,
              width: width(35),
              position: 'absolute',
              right: width(5),
              marginLeft: width(5),
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                marginLeft: width(5),
                fontSize: size(16),
                fontWeight: "bold",
                color: CurrentViewMode.Mode_bg_Profile,
              }}
            >

          {t("NextButtonInChangePinComponent")}  
              
            </Text>
  
            <MaterialIcons
              name='keyboard-arrow-right'
              style={{
                color: CurrentViewMode.Mode_bg_Profile,
                position: 'absolute',
                right: width(5),
                fontSize: size(25),
              }}
            />
          </TouchableOpacity>
  
  
            </View>
  
  
  </View>
           
           
       </KeyboardAvoidingView>
  
    </ActionSheet>
    </>
  )
  }
  
  