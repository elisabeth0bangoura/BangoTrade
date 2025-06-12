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

import auth from '@react-native-firebase/auth';


import firestore from '@react-native-firebase/firestore';

import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";


import { getDatabase, update, ref, get, onValue  } from "@react-native-firebase/database";


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
import CountryFlag from "react-native-country-flag";

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















export default function ChangeLanguage() {

  const db = getDatabase();


  const { t } = useTranslation();

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    

    const [isEnabledEmail, setisEnabledEmail] = useState(false);
    const [isEnabledPushNotifications, setisEnabledPushNotifications] = useState(false);

    
    const windowHeight = Dimensions.get('window').height;
    const ChangeLanguage_Sheet = useRef(null);
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
    const [openDoneCHoosedLanguage, setOpenDoneCHoosedLanguage] = useState(false);

      const [onfidoResultData, setOnfidoResultData] = useState(null);
  
    const [NewFirstName, setNewFirstName] = useState("")
    const [NewLastName, setNewLastName] = useState("")
    const [status, setStatus] = useState('');
    const [onfidoToken, setOnfidoToken] = useState(null);
    const [Phonenumber, setPhonenumber] = useState()
    const [AlpacaUserId, setAlpacaUserId] = useState()
    const [Language, setLanguage] = useState("")
    const {
      showToast, 
      setShowToast,
      showChangedPhoneNumber, setshowChangedEmail
  
       } = useContext(ToastMessageContext);
  
  
  
   //  const auth = getAuth();
     const firestore = getFirestore();
   const database = getDatabase();
  
  
   const currentUser = auth().currentUser;

   
  
  

      
   
  
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




  useEffect(() => {
    const GetLanguage = async () => {
      try {
        const langRef = ref(db, `users/${auth().currentUser.uid}/Currentlanguage`);
        
        onValue(langRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            console.log("Lang: ", data.lang);
            setLanguage(data.lang);
          } else {
            console.log("No language data found.");
          }
        });
      } catch (error) {
        console.error("Error fetching language:", error);
      }
    };
  
    GetLanguage();
  }, []);







  
  
  
  
  
    // ✅ Prevent flickering when closing bottom sheet
    const handleOpen = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      setTimeout(() => {
        firstNameInputRef.current?.focus();
      }, 300);
    };
  
  
  
  
  
   
    const handleLanguageChange = async (lang) => {
      try {
        i18n.changeLanguage(lang);
        setLanguage(lang);
    
      
          i18n.changeLanguage(lang); // change immediately
          await update(ref(db, `users/${currentUser.uid}/Currentlanguage`), { lang }); // save in Firebase

        
    
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (err) {
        console.error("Error changing language:", err);
      }
    };
    

  
   
  
  
  
  
  return( 
  
  
    <>
  
  
  
  
  
    <ActionSheet  gestureEnabled
    ref={ChangeLanguage_Sheet}
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
          marginTop: height(5),
          marginLeft: width(5),
          marginBottom: height(1),
      }}>
     
     {t("TitleTextlanguageApp")}
      </Text>
  
  
      <Text style={{
        color:  CurrentViewMode.Mode_Third_fontColor,
        marginLeft: width(5),
        width: width(80),
        lineHeight: height(2.5),
        marginBottom: height(6),

      }}>

      {t("ChooseYourApplanguageText")}
    
      </Text>
  
  





      <TouchableOpacity onPress={() => handleLanguageChange('de')} // Switch language to English

			style={{
				paddingVertical: size(12),
				
				alignContent: 'center',
				paddingHorizontal: size(20),
				marginBottom: height(1),
				

			}}>

				<View style={{
					flexDirection: "row",
				}}>

			
				
				<View style={{
					height: size(32),
					width: size(32),
					borderRadius: size(32)/2,
					backgroundColor: '#fff',
					alignSelf: 'center',
					justifyContent: 'center',
					overflow: 'hidden'

				}}>

				
				<CountryFlag isoCode="de" size={35} />
				</View>

				<Text style={{
					marginLeft: width(6),
					fontSize: size(18),
					color: CurrentViewMode.Mode_fontColor,
					marginTop: height(-0.5),
					
				}}>
					German
				</Text>

				</View>



        {
          Language == "de"

          ?
          <Text style={{
            marginLeft: width(14),
            fontSize: size(13),
            fontWeight: "bold",
            marginTop: height(-1.2),
              color: CurrentViewMode.Mode_Sec_fontColor,
            
          }}>
  
            {t("translationCurrentlanugeuseText")}
            
          </Text>
  

          :

          null

        }

</TouchableOpacity>

       

			


			<TouchableOpacity onPress={() => handleLanguageChange('en')}
			style={{
				paddingVertical: size(12),
				
				alignContent: 'center',
				paddingHorizontal: size(20),
				marginBottom: height(1),
				

			}}>


      
      <View style={{
          flexDirection: 'row'
        }}>
				
				<View style={{
					height: size(32),
					width: size(32),
					borderRadius: size(32)/2,
					backgroundColor: '#fff',
					alignSelf: 'center',
					justifyContent: 'center',
					overflow: 'hidden'

				}}>

				<CountryFlag isoCode="us" size={35} />
				</View>

				<Text style={{
					marginLeft: width(6),
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(18),
					marginTop: height(0.5),
					
				}}>
					English
				</Text>

        </View>


        {
          Language == "en"

          ?
          <Text style={{
            marginLeft: width(14),
            fontSize: size(13),
            fontWeight: "bold",
            marginTop: height(-0.5),
            color: CurrentViewMode.Mode_Sec_fontColor,
            
          }}>
  
            {t("translationCurrentlanugeuseText")}
            
          </Text>
  

          :

          null

        }


			</TouchableOpacity>


    
			


			<TouchableOpacity onPress={() => handleLanguageChange('fr')}
			style={{
				paddingVertical: size(12),
				
				alignContent: 'center',
				paddingHorizontal: size(20),
				marginBottom: height(1),
				

			}}>
				


        <View style={{
          flexDirection: 'row'
        }}>

   

				<View style={{
					height: size(32),
					width: size(32),
					borderRadius: size(32)/2,
					backgroundColor: '#fff',
					alignSelf: 'center',
					justifyContent: 'center',
					overflow: 'hidden'

				}}>


				<CountryFlag style={{alignSelf: 'center'}} isoCode="fr" size={31} />


				</View>

			
        <Text style={{
					marginLeft: width(6),
					fontSize: size(18),
					color: CurrentViewMode.Mode_fontColor,
					
					
				}}>
					French
				</Text>
        </View>




        {
          Language == "fr"

          ?
          <Text style={{
            marginLeft: width(14),
            fontSize: size(13),
            fontWeight: "bold",
            marginTop: height(-1),
            color: CurrentViewMode.Mode_Sec_fontColor,
            
          }}>
  
            {t("translationCurrentlanugeuseText")}
            
          </Text>
  

          :

          null

        }
			</TouchableOpacity>


    

			




  
    </ActionSheet>
    </>
  )
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  