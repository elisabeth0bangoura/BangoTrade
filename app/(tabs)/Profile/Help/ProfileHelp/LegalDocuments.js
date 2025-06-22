

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
  import i18n from '@/Languages_Translation_Screens/i18n';
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
  
  import { HomeChartContext } from '@/app/Context/HomeChartContext';
  import { useRouter } from 'expo-router';
  
  import { AmountContext } from '@/app/Context/OpenAmountSheetContext';
  import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
  import { SellAmountContext } from '@/app/Context/SellOpenAmountSheetContext';
  import RNPickerSelect from "react-native-picker-select";
  
  import { LinearGradient } from 'expo-linear-gradient';
  import { HomeContext } from '@/app/Context/HomeContext';
  import * as FileSystem from 'expo-file-system';
  import * as Sharing from 'expo-sharing';
  
  import { TextInput } from 'react-native-gesture-handler';
  
  import {
    Onfido,
    OnfidoCaptureType,
    OnfidoCountryCode,
    OnfidoDocumentType,
    } from '@onfido/react-native-sdk'; 
  import { ToastMessageContext } from '@/app/Context/ToastMessageContext';
  import { ViewModeContext } from '@/app/Context/ViewModeContext';
  import { usePostHog } from 'posthog-react-native';

  // Replace with your Onfido API Token and Document ID
  const apiToken = 'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE3MzcyODU2MzUsInBheWxvYWQiOnsiYXBwIjoiMDBkNjI4ZGMtNmI5Zi00ZWVhLThkNDMtOTZhYzllOTM2YzRlIiwiY2xpZW50X3V1aWQiOiJkOGU2NjI0NC00ODgwLTQyMzktODE1OS03NWIyOTZiYTgwMDgiLCJpc19zYW5kYm94Ijp0cnVlLCJpc19zZWxmX3NlcnZpY2VfdHJpYWwiOmZhbHNlLCJpc190cmlhbCI6ZmFsc2UsInJlZiI6IioiLCJzYXJkaW5lX3Nlc3Npb24iOiI0ZTAwZGZlMy1mNDllLTRjMTgtYWMyMi1kZjY0MDcwOTZiMzIifSwidXVpZCI6InBsYXRmb3JtX3N0YXRpY19hcGlfdG9rZW5fdXVpZCIsInVybHMiOnsiZGV0ZWN0X2RvY3VtZW50X3VybCI6Imh0dHBzOi8vc2RrLnVzLm9uZmlkby5jb20iLCJzeW5jX3VybCI6Imh0dHBzOi8vc3luYy5vbmZpZG8uY29tIiwiaG9zdGVkX3Nka191cmwiOiJodHRwczovL2lkLm9uZmlkby5jb20iLCJhdXRoX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJvbmZpZG9fYXBpX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJ0ZWxlcGhvbnlfdXJsIjoiaHR0cHM6Ly9hcGkudXMub25maWRvLmNvbSJ9fQ.MIGGAkF0rw7l5fuzZZZvfNFiI1BXeS-gVF0JMCzorclBZ_jTz8lY6ZF05I4fTARsq3BpNw8c6yNMiBmQ_LouZAwsPNuO9wJBMAr-yoT3znJetCdJPGhoV3gAd0cz-KAylkAX-HBSyxoafwrwloIqzaA5UzpzlR7KWd3NC4F3TeTDVb2ZU-9qRdo';  // Replace with your Onfido API token
  const documentId = 'b7e0f8af-9e06-4751-b502-a7ac44655e86';  // Example document ID
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  export default function LegalDocumentsHelpSheet () {
  

    const posthog = usePostHog(); // ✅ this gives you access to the actual instance


    const { t } = useTranslation();
  
    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);
  
  
      
  
      const [isEnabledEmail, setisEnabledEmail] = useState(false);
      const [isEnabledPushNotifications, setisEnabledPushNotifications] = useState(false);
  
      
      const windowHeight = Dimensions.get('window').height;
      const LegalDocumentsHelp_Sheet = useRef(null);
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
      screen: 'LegalDocumentsHelp_Sheet',
      $screen_name: 'LegalDocumentsHelp_Sheet',
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
    
    
    
    
    
      <ActionSheet  gestureEnabled
      ref={LegalDocumentsHelp_Sheet}
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
    
    
    <Text style={{
            fontSize: size(25),
            color: CurrentViewMode.Mode_fontColor,
            fontWeight: "900",
            marginTop: height(4),
            marginLeft: width(5),
            marginBottom: height(2),
        }}>
  
      {t("LegalDocumentsTitleInLegalDocumentsComponent")}  
      
        </Text>
    
   
   
  
  
  <TouchableOpacity onPress={() => {
  
  SheetManager.show("GeneralDocuments_Sheet")
  }} style={{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height(5),
    marginBottom: height(4),
  }}>
  
  <View> 
      <Text style={{
          fontSize: size(15),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "900",
          marginLeft: width(5),
      }}>
  
    {t("GeneralDocumentsTitleInLegalDocumentsComponent")}  
         
      </Text>
      <Text style={{
          fontSize: size(14),
          color: CurrentViewMode.Mode_Sec_fontColor,
          marginTop: height(1),
          marginLeft: width(5),
      }}>
  
  {t("GeneralDocumentsSubTextInLegalDocumentsComponent")}  
   
  
       </Text>
        </View>
  
  <MaterialIcons name='keyboard-arrow-right' 
  style={{
   color: CurrentViewMode.Mode_Sec_fontColor,
   position: 'absolute',
   right: width(5),
   fontSize: size(25),
   }} />
  
  </TouchableOpacity>
  
  
  
  
  
  
  
  
  
  
  
  <TouchableOpacity onPress={() => {
  
  SheetManager.show("Inprint_Sheet")
  }} style={{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height(4),
  }}>
  
  <View> 
      <Text style={{
          fontSize: size(15),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "900",
          marginLeft: width(5),
      }}>
  
  {t("LegalNoticeTextInLegalDocumentsComponent")}  
  
      </Text>
      <Text style={{
          fontSize: size(14),
          color: CurrentViewMode.Mode_Sec_fontColor,
          marginTop: height(1),
          marginLeft: width(5),
      }}>
     {t("InformationAboutBanticoSubTextInLegalDocumentsComponent")}  
  
       </Text>
        </View>
  
  <MaterialIcons name='keyboard-arrow-right' 
  style={{
   color:  CurrentViewMode.Mode_Sec_fontColor,
   position: 'absolute',
   right: width(5),
   fontSize: size(25),
   }} />
  
  </TouchableOpacity>
   
  
    
    
      </ActionSheet>
      </>
    )
    }
    
    
    
    
    
    
    
    
    
    