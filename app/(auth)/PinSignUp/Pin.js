
import React, { useState, useRef, useEffect, useMemo, useCallback, useContext } from 'react';

import { View, Text,Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '../../../Languages_Translation_Screens/i18n'; 
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';
import database from '@react-native-firebase/database';
import auth, { firebase } from '@react-native-firebase/auth';
import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';

import SimplePin from 'react-native-simple-pin'
import { FontWeight, FontWidth } from '@shopify/react-native-skia';
import { useRouter } from 'expo-router';
import { LogInContext } from '../../Context/LogInContext';

import { getAuth, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getFirestore, collection, getDocs } from "@react-native-firebase/firestore";


import PinCodeContainer from './PinCodeContainer';
import PinCodeComponent from './PinCodeComponent';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import { SheetManager } from 'react-native-actions-sheet';



export default function SignUpPin() {


  const otpInputRef = useRef(null); // Ref to the OTP input
	const { t } = useTranslation();
  
	const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

	

    
    const auth = getAuth();
    const firestore = getFirestore();


    const [dbPin, setDbPin] = useState(null); // Initialize dbPin as null
    const router = useRouter();

    const enteredPinRef = useRef(null);
    const userEmailRef = useRef(null);
    const userPasswordRef = useRef(null);

    const [errorMessage, setErrorMessage] = useState(null); // ✅ Track error messages



    
    
    



    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
     
     
     <PinCodeContainer
   onFocus={() => setisNumberFocused(true)} // Set OTP input focused
   onBlur={() => setisNumberFocused(false)} // Reset OTP input focus
   ref={otpInputRef}
  pin={dbPin || []}
  title=" "
  repeatTitle=" "
  onTextChange={(text) => {

    const database = getDatabase();

    console.log(text)
    //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)

    const fetchToken = async () => {
        try {
          const snapshot = await get(ref(getDatabase(), `/tokens/${CurrentCode}${code}/`));
      
          if (snapshot.exists()) {
            console.log('User data:', snapshot.val().token);
            setTokenFromDB(snapshot.val().token);
          } else {
            console.log('No token found.');
          }
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      };
      
      // Call this function wherever you need to fetch the token
      fetchToken();
}}
onFilled={(text) => {

    // 853321
    setCurrentTypedInVerificationCode(text)
    if(text == TokenFromDB) {
        console.log(`OTP is is corret`) 
         slideToNextPage(); 
    }
    
    

}}
textInputProps={{
    accessibilityLabel: "One-Time Password",
}}
  titleStyle={{ fontSize: 23, color: CurrentViewMode.Mode_fontColor }}
  numpadTextStyle={{ fontSize: 27, color:  CurrentViewMode.Mode_fontColor, marginTop: -10 }}
  bulletStyle={{
    fontSize: 20,
    color: 'red',
    marginTop: height(-17),
    borderRadius: 50,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  }}
/>
     
       {/* <SimplePin
            pin={dbPin || []} // ✅ Ensures `SimplePin` is always shown
            title=" "
            repeatTitle=" "
            onSuccess={(enteredPinArray) => {
                const enteredPin = enteredPinArray.join(""); // Convert array to string
                if (enteredPin.length === 4) { // Make sure it's a full pin
                    handleLogin(enteredPin);
                } else {
                    console.log("PIN is incomplete");
                }
            }}
            onFailure={() => {

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                console.log("Failure", "Please, try again")
            }}
            titleStyle={{ fontSize: 23, color: "#fff", }}
            numpadTextStyle={{ fontSize: 27, color: "#fff", marginTop: -10 }}
            bulletStyle={{
                fontSize: 20,
                color: 'red',
                marginTop: height(-17),
                borderRadius: 50,
                height: 20,
                width: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20,
            }}
           
        />*/}
        
      
    </View>
)
}