
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
import { LogInContext } from '@/app/Context/LogInContext';

import { getAuth, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getFirestore, collection, getDocs } from "@react-native-firebase/firestore";


import PinCodeContainer from './PinCodeContainer';
import PinCodeComponent from './PinCodeComponent';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import { SheetManager } from 'react-native-actions-sheet';
import { usePostHog } from 'posthog-react-native';



export default function Pin() {

    const posthog = usePostHog(); // ✅ Hook must be inside the component


	const { t } = useTranslation();
  
	const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

	

    const {PhonenumberLogIn} = useContext(LogInContext)

    const auth = getAuth();
    const firestore = getFirestore();


    const [dbPin, setDbPin] = useState(null); // Initialize dbPin as null
    const router = useRouter();

    const enteredPinRef = useRef(null);
    const userEmailRef = useRef(null);
    const userPasswordRef = useRef(null);

    const [errorMessage, setErrorMessage] = useState(null); // ✅ Track error messages


    // Fetch the correct PIN from the database when the component mounts
    useEffect(() => {



        console.log("Here: ", "+"+PhonenumberLogIn)
        const fetchPin = async () => {
            try {
                console.log("🔍 Fetching PIN from Firestore...");
    
                const querySnapshot = await getDocs(collection(firestore, "users")); // 🔹 Get all users from Firestore
                let storedPin = null;
    
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    const storedPhone = userData?.newAccountPayload?.contact?.phone_number;
                    
                    console.log("📞 Checking user:", storedPhone);
                    console.log("🔹 Full User Data:", userData);
    
                    // ✅ Check if the phone number matches the format "49+PhonenumberLogIn"
                    if (storedPhone ===  "+"+PhonenumberLogIn) {
                        storedPin = userData?.AppPin;
                    }
                });
    
                if (storedPin) {
                    console.log("✅ PIN found:", storedPin);
                    setDbPin(storedPin.split('')); // ✅ Store the correct PIN as an array of digits
                } else {
                    console.log("❌ Error: User not found.");
                }
            } catch (error) {
                console.error("❌ Error fetching PIN:", error);
                console.log("Error", "Something went wrong.");
            }
        };
    
        fetchPin();
    }, [PhonenumberLogIn]); // ✅ Runs when `PhonenumberLogIn` changes
    

    // Handle successful login
    const normalizePhoneNumber = (phone) => {
        return phone.replace(/\D/g, ""); // 🔹 Removes all non-numeric characters
    };
    
    const handleLogin = async (enteredPin) => {
        console.log("Entered PIN:", enteredPin);
        enteredPinRef.current = enteredPin;
      
        try {
          console.log("🔍 Fetching users from Firestore...");
          const querySnapshot = await getDocs(collection(firestore, "users"));
          
          let userFound = false;
          let matchedUserData = null; // ✅ Save the whole matched user data
      
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const storedPin = userData?.AppPin;
            const storedPhone = normalizePhoneNumber(userData?.newAccountPayload?.contact?.phone_number);
            const email = userData?.newAccountPayload?.contact?.email_address;
            const password = userData?.Password;
      
            if (storedPin === enteredPinRef.current && storedPhone === normalizePhoneNumber(PhonenumberLogIn)) {
              userFound = true;
              userEmailRef.current = email;
              userPasswordRef.current = password;
              matchedUserData = userData; // ✅ Save full data for PostHog
            }
          });
      
          if (userFound && userEmailRef.current && userPasswordRef.current) {
            signInWithEmailAndPassword(auth, userEmailRef.current, userPasswordRef.current)
              .then(() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                SheetManager.hide("LogIn_Sheet");
                console.log("✅ User logged in successfully!");
                setErrorMessage(null);
      
                // ✅ IDENTIFY USER IN POSTHOG
                posthog.identify(userEmailRef.current, {
                  email: userEmailRef.current,
                  phone: PhonenumberLogIn,
                  firstName: matchedUserData?.newAccountPayload?.identity?.given_name,
                  lastName: matchedUserData?.newAccountPayload?.identity?.family_name,
                  isProUser: true,
                  signupMethod: 'PIN',
                });
      
                posthog.capture('login_success', {
                  method: 'PIN',
                  email: userEmailRef.current,
                });
      
                router.replace("/(tabs)/Home/home");
              })
              .catch((error) => {
                console.error("❌ Firebase Auth Error:", error);
                setErrorMessage("Login Error: " + error.message);
              });
          } else {
            setErrorMessage("❌ Error: Invalid phone number or PIN.");
          }
        } catch (error) {
          console.error("❌ Error fetching data:", error);
          setErrorMessage("Error: Something went wrong.");
        }
      };
      
    

    



    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
     
     
     <PinCodeContainer
  pin={dbPin || []}
  title=" "
  repeatTitle=" "
  onSuccess={(pin) => handleLogin(pin.join(''))}
  onFailure={() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    console.log("Failure", "Please try again");
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
        
        {errorMessage && ( // ✅ Show error message if PIN/User is wrong
            <Text style={{ color: "red", marginTop: 20 }}>{errorMessage}</Text>
        )}
    </View>
)
}