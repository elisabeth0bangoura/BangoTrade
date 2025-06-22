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
import { usePostHog } from 'posthog-react-native';

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















export default function CloseDepot() {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { t } = useTranslation();

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);



    const [isEnabledEmail, setisEnabledEmail] = useState(false);
    const [isEnabledPushNotifications, setisEnabledPushNotifications] = useState(false);

    
    const windowHeight = Dimensions.get('window').height;
    const CloseDepot_Sheet = useRef(null);
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
    posthog.capture('screen_viewed', {
      screen: 'CloseDepot_Sheet',
      $screen_name: 'CloseDepot_Sheet',
      timestamp: new Date().toISOString(),
    });
  }, []);
  
   

      
   
  
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
  
  
  
  
  
    <ActionSheet  
    ref={CloseDepot_Sheet}
    gestureEnabled={true}
    isModal={true}
    backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
    keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
    
    onOpen={handleOpen}
   
    CustomHeaderComponent={
  
  
  
  <> 
  
  

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
  }}>


  
  <Text style={{
          fontSize: size(25),
          color:  CurrentViewMode.Mode_fontColor,
          fontWeight: "900",
          marginTop: height(4),
          marginLeft: width(5),
          marginBottom: height(2),
      }}>

     {t("CloseAccountTitleInCloseAccountComponent")}  

      </Text>



  
      <Text style={{
        color: CurrentViewMode.Mode_Sec_fontColor,
        marginLeft: width(5),
        width: width(70),
        lineHeight: height(2.5),
        marginBottom: height(6),

      }}>
      {t("CloseAccountSubTextInCloseAccountComponent")}  

      </Text>
  
  

     
 


      <View style={{
        height: 250,
        width: "90%",
        marginLeft: width(5),
       // backgroundColor: 'yellow',
      }}>


        <View style={{
          height: "100%",
          width: 1,
          alignItems: 'center',
          backgroundColor:  CurrentViewMode.Mode_StatusLine,
          position: 'absolute',
          marginLeft: width(6)
        }}>


        </View>
        <View style={{
          //  backgroundColor: 'green',
            height: height(18),
            width:  width(90),
            position: 'absolute',
            marginTop: height(-2),
           flexDirection: 'row',
      
          }}>
     
     <View style={{
           backgroundColor:  CurrentViewMode.Mode_bg,
           height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
     
          <Entypo name='news' style={{
            color:  CurrentViewMode.Mode_fontColor,
            fontSize: size(22)
          }} />
                 
          </View>
            
            <View style={{
               width: "80%",
               marginLeft: width(5)
            }}>
            <Text style={{
              marginBottom: height(1),
              fontWeight: "900",
              fontSize: size(14),
              color:  CurrentViewMode.Mode_fontColor,
            }}>

          {t("CloseAccountText1InCloseAccountComponent")}   
          
            </Text>

            <Text style={{
            marginBottom: height(1),
            fontSize: size(13),
            color:  CurrentViewMode.Mode_Sec_fontColor,
            }}>

            {t("CloseAccountSubText1InCloseAccountComponent")}  
          
            </Text>
            </View>


          </View>























          <View style={{
          //  backgroundColor: 'green',
            height: height(18),
            width:  width(90),
            position: 'absolute',
            marginTop: height(12),
           flexDirection: 'row',
      
          }}>
     
     <View style={{
          backgroundColor: CurrentViewMode.Mode_bg,
           height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
     
          <MaterialCommunityIcons name='bank-transfer' style={{
            color:  CurrentViewMode.Mode_fontColor,
            fontSize: size(30)
          }} />
                 
          </View>
            
            <View style={{
               width: "80%",
               marginLeft: width(5)
            }}>
            <Text style={{
              marginBottom: height(1),
              fontWeight: "900",
              fontSize: size(14),
              color: CurrentViewMode.Mode_fontColor,
            }}>

            {t("CloseAccountWithdrawText1InCloseAccountComponent")}  
            </Text>

            <Text style={{
            marginBottom: height(1),
            fontSize: size(13),
            color: CurrentViewMode.Mode_Sec_fontColor,
            }}>
            {t("CloseAccountWithdrawSubText1InCloseAccountComponent")}  
           
            </Text>
            </View>


          </View>






















          <View style={{
          //  backgroundColor: 'green',
            height: height(18),
            width:  width(90),
            position: 'absolute',
            marginTop: height(26),
           flexDirection: 'row',
      
          }}>
     
     <View style={{
           backgroundColor: CurrentViewMode.Mode_bg,
           height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
     
          <Ionicons name='checkmark-done-sharp' style={{
            color:  CurrentViewMode.Mode_fontColor,
            fontSize: size(25)
          }} />
                 
          </View>
            
            <View style={{
               width: "80%",
               marginLeft: width(5)
            }}>
            <Text style={{
              marginBottom: height(1),
              fontWeight: "900",
              fontSize: size(14),
              color: CurrentViewMode.Mode_fontColor,
            }}>
            {t("CloseAccountDeleteTitlebText1InCloseAccountComponent")}  
           
            </Text>

            <Text style={{
            marginBottom: height(1),
            fontSize: size(13),
            color: CurrentViewMode.Mode_Sec_fontColor,
            }}>
            
            {t("CloseAccountDeleteSubText1InCloseAccountComponent")}  
            
            </Text>
            </View>


          </View>




      </View>




        


    
<View style={{
  width: "100%",
  position: 'absolute',
    bottom: height(8),
     flexDirection: 'row',
}}>
          <TouchableOpacity onPress={() => {

            posthog.capture('close_settings_close_depot_bottomsheet', {
              screen: 'CloseDepot_Sheet',
              $screen_name: 'CloseDepot_Sheet',
              timestamp: new Date().toISOString(),

              });

             Keyboard.dismiss(); // Dismiss the keyboard first
             setTimeout(() => {
               SheetManager.hide("CloseDepot_Sheet"); // Now hide the sheet after a delay
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





          <TouchableOpacity onPress={async () => {



            posthog.capture('open_settings_close_depot_part2_bottomsheet', {
              screen: 'CloseDepot_Sheet',
              $screen_name: 'CloseDepot_Sheet',
              timestamp: new Date().toISOString(),

              });

        //    console.log({FirstName: NewFirstName, LastName: NewLastName})
            //  contact: {email_address: 'dssd', phone_number: 'sdsd'},
        
            SheetManager.show("CloseDepotPart2_Sheet")
            
         

          }}
          style={{
            backgroundColor: CurrentViewMode.Mode_fontColor,
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
              fontSize: size(16),
              fontWeight: "bold",
              color: CurrentViewMode.Mode_bg,
            }}>

            {t("NextText1InCloseAccountComponent")}  
              
            </Text>

            <MaterialIcons name='keyboard-arrow-right' style={{
              color: CurrentViewMode.Mode_bg,
              position: 'absolute',
              right: width(5),
              fontSize: size(25),
            }} />
           
          </TouchableOpacity>

          </View>
         
  
          </View>
  
    </ActionSheet>
    </>
  )
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  