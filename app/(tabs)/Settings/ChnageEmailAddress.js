import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Button,
   Keyboard,
   TouchableWithoutFeedback,
   KeyboardAvoidingView,

  Platform, FlatList, Dimensions, ScrollView, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
import { ViewModeContext } from '@/app/Context/ViewModeContext';


import firestore from '@react-native-firebase/firestore';


import { getFirestore, getDoc, addDoc, collection, doc, onSnapshot } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "@react-native-firebase/auth";



// Replace with your Onfido API Token and Document ID
const apiToken = 'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE3MzcyODU2MzUsInBheWxvYWQiOnsiYXBwIjoiMDBkNjI4ZGMtNmI5Zi00ZWVhLThkNDMtOTZhYzllOTM2YzRlIiwiY2xpZW50X3V1aWQiOiJkOGU2NjI0NC00ODgwLTQyMzktODE1OS03NWIyOTZiYTgwMDgiLCJpc19zYW5kYm94Ijp0cnVlLCJpc19zZWxmX3NlcnZpY2VfdHJpYWwiOmZhbHNlLCJpc190cmlhbCI6ZmFsc2UsInJlZiI6IioiLCJzYXJkaW5lX3Nlc3Npb24iOiI0ZTAwZGZlMy1mNDllLTRjMTgtYWMyMi1kZjY0MDcwOTZiMzIifSwidXVpZCI6InBsYXRmb3JtX3N0YXRpY19hcGlfdG9rZW5fdXVpZCIsInVybHMiOnsiZGV0ZWN0X2RvY3VtZW50X3VybCI6Imh0dHBzOi8vc2RrLnVzLm9uZmlkby5jb20iLCJzeW5jX3VybCI6Imh0dHBzOi8vc3luYy5vbmZpZG8uY29tIiwiaG9zdGVkX3Nka191cmwiOiJodHRwczovL2lkLm9uZmlkby5jb20iLCJhdXRoX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJvbmZpZG9fYXBpX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJ0ZWxlcGhvbnlfdXJsIjoiaHR0cHM6Ly9hcGkudXMub25maWRvLmNvbSJ9fQ.MIGGAkF0rw7l5fuzZZZvfNFiI1BXeS-gVF0JMCzorclBZ_jTz8lY6ZF05I4fTARsq3BpNw8c6yNMiBmQ_LouZAwsPNuO9wJBMAr-yoT3znJetCdJPGhoV3gAd0cz-KAylkAX-HBSyxoafwrwloIqzaA5UzpzlR7KWd3NC4F3TeTDVb2ZU-9qRdo';  // Replace with your Onfido API token
const documentId = 'b7e0f8af-9e06-4751-b502-a7ac44655e86';  // Example document ID








export default function ChnageEmailAddress ()  {


  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser; // Get the currently logged-in user


  const user = getAuth().currentUser;



  const { t } = useTranslation();
  
  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const windowHeight = Dimensions.get('window').height;
  const ChnageEmailAddress_Sheet = useRef(null);
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



     
     


 

 useEffect(() => {
  const userId =  currentUser.uid
    
  console.log("✅ Current User ID:", userId);
  
   const test = async () => {

      try {
          // Reference to the user's document (userId is the document name)
          const userDocRef = doc(firestore, "users", userId);
          const userDocSnap = await getDoc(userDocRef);

      
              console.log("here: ", userDocSnap.data().AlpacaAccountId)

              setAlpacaUserId(userDocSnap.data().AlpacaAccountId)

        
      } catch (error) {
          console.error("❌ Error fetching AlpacaAccountId:", error);
      }
  
    }
    test()

}, [currentUser]);







const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
  }
};



useEffect(() => {
  // Ensure user.uid is available before making the request
  if (!user?.uid) {
    console.log("No user UID available.");
    return;
  }

  console.log("here ", user.uid);

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
   
        setEmail(userData?.newAccountPayload.contact?.email_address)
     
        
        console.log("given_name ", userData?.newAccountPayload?.identity?.given_name);
        console.log("family_name ", userData?.newAccountPayload?.identity?.family_name);
        console.log("AlpacaAccountId: ", userData?.AlpacaAccountId);

   
       
        // Email
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, [user?.uid]); // Make sure the effect runs whenever user.uid changes






  // ✅ Prevent flickering when closing bottom sheet
  const handleOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    setTimeout(() => {
      firstNameInputRef.current?.focus();
    }, 300);
  };













 




return( 


  <>





  <ActionSheet 
  ref={ChnageEmailAddress_Sheet}
  gestureEnabled={true}
  isModal={true}
  backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
  keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
  
  onOpen={handleOpen}
  onClose={() => {
    Keyboard.dismiss(); // Dismiss the keyboard first
    setTimeout(() => {
      SheetManager.hide("ChnageEmailAddress_Sheet"); // Now hide the sheet after a delay
    }, 200); // Small delay to avoid flickering
  }}
  CustomHeaderComponent={



<> 



</>
}

 
 containerStyle={{
  maxHeight: height(92),
  backgroundColor: CurrentViewMode.Mode_bg_Profile,
  height: height(92),
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
        width: "80%",
        marginTop: height(4),
        marginLeft: width(5),
        marginBottom: height(5),
    }}>
    
    {t("ChangeEmailAddressTitleInChangeEmailAddressComponent")}  
    </Text>




    <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={height(9.5)}>
      
          <View style={{
            width: "100%"
          }}>
          
        
          
        <TextInput
            ref={firstNameInputRef}
            onChangeText={(val) => setEmail(val)}
            style={{
              color:CurrentViewMode.Mode_fontColor,
              fontSize: 22,
              marginLeft: 20,
              marginTop: height(5),
              fontWeight: "900",
            }}
            placeholderTextColor={CurrentViewMode.Mode_fontColor}
            placeholder={Email}
            returnKeyType="next"
            onFocus={() => setActiveInput("first")}
            onSubmitEditing={() => firstNameInputRef.current?.focus()} // Move to last name on enter
          
          />r

    
    



<View style={{

marginTop: height(26),
paddingHorizontal: size(20),
flexDirection: 'row',

}}>
          <TouchableOpacity onPress={() => {
             Keyboard.dismiss(); // Dismiss the keyboard first
             setTimeout(() => {
               SheetManager.hide("ChnageEmailAddress_Sheet"); // Now hide the sheet after a delay
             }, 200); // Small delay to avoid flickering
 }}
          style={{
            backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
            height: size(50),
            borderRadius: 10,
            width:  size(50),
            alignItems: 'center',
            justifyContent: 'center',
          }}>

            <MaterialIcons name='keyboard-arrow-left' style={{
              color: CurrentViewMode.Mode_fontColor,
              fontSize: size(25),
            }} />
           
          </TouchableOpacity>





          <TouchableOpacity onPress={async () => {

        //    console.log({FirstName: NewFirstName, LastName: NewLastName})
            //  contact: {email_address: 'dssd', phone_number: 'sdsd'},
        

            console.log(AlpacaUserId)
     
           
            const GetUserData = () => {

              
                const options = {
                  method: 'PATCH',
                  headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
                  },
                  body: JSON.stringify({
                    contact: {email_address: Email},

                    
                  })
                };
                
                fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}`, options)
                
                  .then(res => {

                    console.log(res)
                    setshowChangedEmail(true)

                   // setPhonenumber("")
                    SheetManager.hide("ChnageEmailAddress_Sheet")

                  }) 
                  .catch(err => console.log(err));
          
          
              }
              GetUserData()
            
 


            
         

          }}
          style={{
            backgroundColor:CurrentViewMode.Mode_fontColor,
            height: size(50),
            borderRadius: 10,
            width:  width(35),
            position: 'absolute',
            right: width(5),
            marginLeft: width(5),
            justifyContent: 'center',
          }}>


            <Text style={{
              marginLeft: width(5),
              color: CurrentViewMode.Mode_bg_Profile,
              fontSize: size(16),
              fontWeight: "bold",
            }}>

              {t("NextButtonInChangeEmailAddressComponent")}  
              
            </Text>

            <MaterialIcons name='keyboard-arrow-right' style={{
              color: CurrentViewMode.Mode_bg_Profile,
              position: 'absolute',
              right: width(5),
              fontSize: size(25),
            }} />
           
          </TouchableOpacity>

          </View>
         
        </View>




        
    </KeyboardAvoidingView>









  </ActionSheet>
  </>
)
}
































































