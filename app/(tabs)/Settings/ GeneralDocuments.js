import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Button,
   Keyboard,
   TouchableWithoutFeedback,
   KeyboardAvoidingView,
   Switch,
  Platform, FlatList, Dimensions, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
import { GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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

import {
	Onfido,
	OnfidoCaptureType,
	OnfidoCountryCode,
	OnfidoDocumentType,
  } from '@onfido/react-native-sdk'; 
import { ToastMessageContext } from '@/app/Context/ToastMessageContext';
import * as WebBrowser from 'expo-web-browser';
import { ViewModeContext } from '@/app/Context/ViewModeContext';


// Replace with your Onfido API Token and Document ID
const apiToken = 'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE3MzcyODU2MzUsInBheWxvYWQiOnsiYXBwIjoiMDBkNjI4ZGMtNmI5Zi00ZWVhLThkNDMtOTZhYzllOTM2YzRlIiwiY2xpZW50X3V1aWQiOiJkOGU2NjI0NC00ODgwLTQyMzktODE1OS03NWIyOTZiYTgwMDgiLCJpc19zYW5kYm94Ijp0cnVlLCJpc19zZWxmX3NlcnZpY2VfdHJpYWwiOmZhbHNlLCJpc190cmlhbCI6ZmFsc2UsInJlZiI6IioiLCJzYXJkaW5lX3Nlc3Npb24iOiI0ZTAwZGZlMy1mNDllLTRjMTgtYWMyMi1kZjY0MDcwOTZiMzIifSwidXVpZCI6InBsYXRmb3JtX3N0YXRpY19hcGlfdG9rZW5fdXVpZCIsInVybHMiOnsiZGV0ZWN0X2RvY3VtZW50X3VybCI6Imh0dHBzOi8vc2RrLnVzLm9uZmlkby5jb20iLCJzeW5jX3VybCI6Imh0dHBzOi8vc3luYy5vbmZpZG8uY29tIiwiaG9zdGVkX3Nka191cmwiOiJodHRwczovL2lkLm9uZmlkby5jb20iLCJhdXRoX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJvbmZpZG9fYXBpX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJ0ZWxlcGhvbnlfdXJsIjoiaHR0cHM6Ly9hcGkudXMub25maWRvLmNvbSJ9fQ.MIGGAkF0rw7l5fuzZZZvfNFiI1BXeS-gVF0JMCzorclBZ_jTz8lY6ZF05I4fTARsq3BpNw8c6yNMiBmQ_LouZAwsPNuO9wJBMAr-yoT3znJetCdJPGhoV3gAd0cz-KAylkAX-HBSyxoafwrwloIqzaA5UzpzlR7KWd3NC4F3TeTDVb2ZU-9qRdo';  // Replace with your Onfido API token
const documentId = 'b7e0f8af-9e06-4751-b502-a7ac44655e86';  // Example document ID















export default function GeneralDocuments() {

  
  const { t } = useTranslation();

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const [showWebView, setShowWebView] = useState(false);


    const [isEnabledEmail, setisEnabledEmail] = useState(false);
    const [isEnabledPushNotifications, setisEnabledPushNotifications] = useState(false);

    
    const windowHeight = Dimensions.get('window').height;
    const GeneralDocuments_Sheet = useRef(null);
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
    



 
    
 const _AlpacaAccountApplicationandCustomerAgreement = async () => {
    
    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/AcctAppMarginAndCustAgmt.pdf");
   
  };


      
 const _AlpacaTermsConditions = async () => {

    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/TermsAndConditions.pdf");
   
  };


  
  const _AlpacaSecuritiesPrivacyNotice = async () => {

    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/AlpacaSecuritiesPrivacyNotice.pdf");

  };



  const _SIPCandExcessSIPCProtection = async () => {

    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/SIPC%20and%20Excess%20SIPC%20Protection.pdf");

  };



  
  const _FINRACustomerIdentificationProgramNotice = async () => {

    await WebBrowser.openBrowserAsync("https://www.finra.org/investors/customer-identification-program-notice");

  };



  const _AlpacaSecuritiesBrokerageFeeSchedule = async () => {

    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/BrokFeeSched.pdf");

  };


  const _AlpacaUseandRiskDisclosures = async () => {

    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/UseAndRisk.pdf");

  };



  
  const _AAlpacaPFOFDisclosure = async () => {

    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/PFOF.pdf");

  };

  

  const _ResponsibilitiesofIntroducingBrokerandClearingBroker = async () => {

    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/Responsibilities+of+Introducing+Broker+and+Clearing+Broker.pdf");

  };




  const _AlpacaCryptoPrivacyNotice = async () => {

    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/AlpacaCryptoPrivacyNotice.pdf");

  };

  

  
  


  const _AlpacaCryptoRiskDisclosure = async () => {

    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/CryptoRiskDisclosures.pdf");

  };




  const _AlpacaCryptoCustodialAccountDisclosureStatement = async () => {

    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/Alpaca+Crypto+Custodial+Account+Disclosure+Statement.pdf");

  };



  

  const _AlpacaCryptoLLCFeeDisclosure = async () => {

    await WebBrowser.openBrowserAsync("https://files.alpaca.markets/disclosures/library/AlpacaCryptoLLCFeeDisclosure.pdf");

  };







  const _FINRADayTradingRiskDisclosure = async () => {

    await WebBrowser.openBrowserAsync("https://www.finra.org/rules-guidance/rulebooks/finra-rules/2270");

  };





  const _FINRAExtendedHoursTradingRiskDisclosure = async () => {

    await WebBrowser.openBrowserAsync("https://www.finra.org/rules-guidance/rulebooks/finra-rules/2270");

  };



  const _FINRAETFRiskDisclosure = async () => {

    await WebBrowser.openBrowserAsync("https://www.finra.org/investors/investing/investment-products/exchange-traded-funds-and-products");

  };











  return( 
  
  
    <>
  

    <ActionSheet  
    ref={GeneralDocuments_Sheet}
    gestureEnabled={true}
      isModal={true}
      backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
      keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
      
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



    <ScrollView style={{
      height: "100%",
      width: "100%"
    }} contentContainerStyle={{
      paddingBottom: height(10)
    }}>

  <Text style={{
          fontSize: size(25),
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "900",
          marginTop: height(4),
          marginLeft: width(5),
          marginBottom: height(2),
      }}>
       {t("LegalDocumentsTitleInGeneralDocumentsComponent")}  
   
      </Text>
  
 
 


<TouchableOpacity onPress={() => {
_AlpacaAccountApplicationandCustomerAgreement()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: height(5),
  marginBottom: height(4),
}}>



  <Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


    <Text numberOfLines={1} style={{
        fontSize: size(15),
        color: CurrentViewMode.Mode_fontColor,
        width: width(65),
        fontWeight: "900",
        marginLeft: width(5),
    }}>

    {t("AccountApplicationAndCustomerAgreementTitleInGeneralDocumentsComponent")}  
   
    </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color: CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>












<TouchableOpacity onPress={() => {
_AlpacaTermsConditions()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>

<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


    <Text numberOfLines={1} style={{
        fontSize: size(15),
        color:  CurrentViewMode.Mode_fontColor,
        width: width(65),
        fontWeight: "900",
        marginLeft: width(5),
    }}>
    {t("TermsConditionsTitleInGeneralDocumentsComponent")}  
   
    </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color:  CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>






<TouchableOpacity onPress={() => {
_AlpacaSecuritiesPrivacyNotice()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>

<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


    <Text numberOfLines={1} style={{
        fontSize: size(15),
        color: CurrentViewMode.Mode_fontColor,
        width: width(65),
        fontWeight: "900",
        marginLeft: width(5),
    }}>

{t("SecuritiesPrivacyNoticeTitleInGeneralDocumentsComponent")}  
    </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color: CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>














<TouchableOpacity onPress={() => {
_SIPCandExcessSIPCProtection()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>


<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


    <Text numberOfLines={1} style={{
        fontSize: size(15),
        color: CurrentViewMode.Mode_fontColor,
        width: width(65),
        fontWeight: "900",
        marginLeft: width(5),
    }}>

{t("SIPCAndExcessSIPCProtectionTitleInGeneralDocumentsComponent")}  

    </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color: CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>





<TouchableOpacity onPress={() => {
_FINRACustomerIdentificationProgramNotice()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>


<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


    <Text numberOfLines={1} style={{
        fontSize: size(15),
        color: CurrentViewMode.Mode_fontColor,
        width: width(65),
        fontWeight: "900",
        marginLeft: width(5),
    }}>
    {t("SIPCAndExcessSIPCProtectionTitleInGeneralDocumentsComponent")}  
   
    </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color:  CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>








<TouchableOpacity onPress={() => {
_AlpacaSecuritiesBrokerageFeeSchedule()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>

<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


    <Text numberOfLines={1} style={{
        fontSize: size(15),
        color: CurrentViewMode.Mode_fontColor,
        width: width(65),
        fontWeight: "900",
        marginLeft: width(5),
    }}>

{t("SecuritiesBrokerageFeeScheduleTitleInGeneralDocumentsComponent")}  

 </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color: CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>
















<TouchableOpacity onPress={() => {
_AlpacaUseandRiskDisclosures()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>


<Entypo name='news' style={{
    color:  CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


    <Text numberOfLines={1} style={{
        fontSize: size(15),
        color: CurrentViewMode.Mode_fontColor,
        width: width(65),
        fontWeight: "900",
        marginLeft: width(5),
    }}>

{t("UseAndRiskDisclosuresTitleInGeneralDocumentsComponent")}  
 
 </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color: CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>














<TouchableOpacity onPress={() => {
_AAlpacaPFOFDisclosure()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>


<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


 <Text numberOfLines={1} style={{
  fontSize: size(15),
  color:CurrentViewMode.Mode_fontColor,
  width: width(65),
  fontWeight: "900",
  marginLeft: width(5),
 }}>

{t("PFOFDisclosureTitleInGeneralDocumentsComponent")}  

 </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color:CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>

















<TouchableOpacity onPress={() => {
_ResponsibilitiesofIntroducingBrokerandClearingBroker()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>


<Entypo name='news' style={{
    color:  CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


 <Text numberOfLines={1} style={{
  fontSize: size(15),
  color:  CurrentViewMode.Mode_fontColor,
  width: width(65),
  fontWeight: "900",
  marginLeft: width(5),
 }}>

{t("ResponsibilitiesOfIntroducingBrokerAndClearingBrokerTitleInGeneralDocumentsComponent")}  
 </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color:  CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>








<TouchableOpacity onPress={() => {
_AlpacaCryptoPrivacyNotice()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>


<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


 <Text numberOfLines={1} style={{
  fontSize: size(15),
  color: CurrentViewMode.Mode_fontColor,
  width: width(65),
  fontWeight: "900",
  marginLeft: width(5),
 }}>


{t("CryptoPrivacyNoticeTitleInGeneralDocumentsComponent")}  
 </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color: CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>























<TouchableOpacity onPress={() => {
_AlpacaCryptoRiskDisclosure()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>


<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


 <Text numberOfLines={1} style={{
  fontSize: size(15),
  color: CurrentViewMode.Mode_fontColor,
  width: width(65),
  fontWeight: "900",
  marginLeft: width(5),
 }}>
{t("CryptoRiskDisclosureTitleInGeneralDocumentsComponent")}  

 </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color: CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>





















<TouchableOpacity onPress={() => {
_AlpacaCryptoCustodialAccountDisclosureStatement()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>


<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


 <Text numberOfLines={1} style={{
  fontSize: size(15),
  color: CurrentViewMode.Mode_fontColor,
  width: width(65),
  fontWeight: "900",
  marginLeft: width(5),
 }}>
{t("CryptoCustodialAccountDisclosureStatementTitleInGeneralDocumentsComponent")}  

 </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color: CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>




















<TouchableOpacity onPress={() => {
_AlpacaCryptoLLCFeeDisclosure()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>


<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


 <Text numberOfLines={1} style={{
  fontSize: size(15),
  color: CurrentViewMode.Mode_fontColor,
  width: width(65),
  fontWeight: "900",
  marginLeft: width(5),
 }}>
{t("CryptoLLCFeeDisclosureTitleInGeneralDocumentsComponent")}  

 </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color: CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>



















<TouchableOpacity onPress={() => {
_FINRADayTradingRiskDisclosure()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>


<Entypo name='news' style={{
    color:  CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


 <Text numberOfLines={1} style={{
  fontSize: size(15),
  color:  CurrentViewMode.Mode_fontColor,
  width: width(65),
  fontWeight: "900",
  marginLeft: width(5),
 }}>

{t("FINRADayTradingRiskDisclosureTitleInGeneralDocumentsComponent")}  
 </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color:  CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>








<TouchableOpacity onPress={() => {
_FINRAExtendedHoursTradingRiskDisclosure()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: height(4),
}}>


<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


 <Text numberOfLines={1} style={{
  fontSize: size(15),
  color: CurrentViewMode.Mode_fontColor,
  width: width(65),
  fontWeight: "900",
  marginLeft: width(5),
 }}>
{t("FINRAExtendedHoursTradingRiskDisclosureTitleInGeneralDocumentsComponent")}  

 </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color: CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>







<TouchableOpacity onPress={() => {
_FINRAETFRiskDisclosure()
}} style={{
  flexDirection: 'row',
  alignItems: 'center',

}}>


<Entypo name='news' style={{
    color: CurrentViewMode.Mode_fontColor,
    marginLeft: width(5),
    fontSize: size(22),
    marginRight: width(2), 
  }} />


 <Text numberOfLines={1} style={{
  fontSize: size(15),
  color: CurrentViewMode.Mode_fontColor,
  width: width(65),
  fontWeight: "900",
  marginLeft: width(5),
 }}>

{t("FINRAETFRiskDisclosureTitleInGeneralDocumentsComponent")}  

 </Text>

<MaterialIcons name='keyboard-arrow-right' 
style={{
 color: CurrentViewMode.Mode_Sec_fontColor,
 position: 'absolute',
 right: width(5),
 fontSize: size(25),
 }} />

</TouchableOpacity>
      
</ScrollView>
  
  
    </ActionSheet>
    </>
  )
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  










  














































  export  function Inprint() {


    const { t } = useTranslation();

  
    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    const [showWebView, setShowWebView] = useState(false);
  
  
      const [isEnabledEmail, setisEnabledEmail] = useState(false);
      const [isEnabledPushNotifications, setisEnabledPushNotifications] = useState(false);
  
      
      const windowHeight = Dimensions.get('window').height;
      const Inprint_Sheet = useRef(null);
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
      ref={Inprint_Sheet}
    
      isModal={true}
      backgroundInteractionEnabled={true}
      gestureEnabled={true}    
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
  
  
  
      <ScrollView style={{
        height: "100%",
        width: "100%"
      }} contentContainerStyle={{
        paddingBottom: height(10)
      }}>
  

   

   {/* Header */}
   <Text style={{
      fontSize: size(25),
      color: CurrentViewMode.Mode_fontColor,
      fontWeight: "900",
      marginTop: height(4),
      marginBottom: height(4),
      marginLeft: width(5),

    }}>

{t("ImpressumLegalNoticeTitleInInprintComponent")}  
          
            </Text>

            {/* Company Information */}
            <Text style={{ fontSize: 18, width: width(85), marginLeft: width(5), fontWeight: 'bold', color:  CurrentViewMode.Mode_fontColor, marginBottom: height(2) }}>
                Company Information
                {t("ImpressumLegalNoticeTitleInInprintComponent")}  
            </Text>
            <Text style={{ width: width(85), marginLeft: width(5), color: CurrentViewMode.Mode_fontColor, marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>
                  {t("CompanyNameTitleInInprintComponent")}  
                </Text> Bantico LLC
            </Text>
            <Text style={{width: width(85), marginLeft: width(5), width: width(85), marginLeft: width(5), color: CurrentViewMode.Mode_fontColor, marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>
                {t("FounderCEOTitleInInprintComponent")}</Text> Elisabeth Bangoura
            </Text>
            <Text style={{width: width(85), marginLeft: width(5), color: CurrentViewMode.Mode_fontColor, marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>{t("RegisteredAddressTitleInInprintComponent")}</Text> [Your Business Address]
            </Text>
            <Text style={{width: width(85), marginLeft: width(5), color: CurrentViewMode.Mode_fontColor, marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>{t("EmailTitleInInprintComponent")}</Text> [Your Business Email]
            </Text>
            <Text style={{width: width(85), marginLeft: width(5), color: CurrentViewMode.Mode_fontColor, marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>{t("WebsiteTitleInInprintComponent")}</Text> https://bangofinancials.com
            </Text>

            {/* Business Registration & Licensing */}
            <Text style={{ width: width(85), marginLeft: width(5), fontSize: 18, fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor, marginBottom: 10 }}>
            {t("BusinessRegistrationLicensingTitleInInprintComponent")}  
               
            </Text>
            <Text style={{ width: width(85), marginLeft: width(5), color: CurrentViewMode.Mode_fontColor, marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>{t("LegalFormTitleInInprintComponent")} </Text>{t("LimitedLiabilityCompanyLLCTitleInInprintComponent")}
            </Text>
            <Text style={{ width: width(85), marginLeft: width(5), color: CurrentViewMode.Mode_fontColor, marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>{t("RegisteredInTitleInInprintComponent")} </Text> {t("UnitedStatesTitleInInprintComponent")} 
            </Text>
            <Text style={{ width: width(85), marginLeft: width(5), color: CurrentViewMode.Mode_fontColor, marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>{t("CompanyRegistrationNumberTitleInInprintComponent")} </Text> [Your LLC Registration Number]
            </Text>
            <Text style={{  width: width(85), marginLeft: width(5), color: CurrentViewMode.Mode_fontColor, marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>{t("RegulatoryAuthorityTitleInInprintComponent")} </Text> [Your Financial Regulator]
            </Text>
            <Text style={{ width: width(85), marginLeft: width(5), color: CurrentViewMode.Mode_fontColor, marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>{t("TaxIDEINTitleInInprintComponent")} </Text> [Your EIN Number]
            </Text>

            {/* Dispute Resolution */}
            <Text style={{  marginLeft: width(5), width: width(70), marginLeft: width(5), fontSize: 18, fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor, marginBottom: 10 }}>
            {t("DisputeResolutionTitleInInprintComponent")} 
            </Text>
            <Text style={{   marginLeft: width(5), width: width(85), color: CurrentViewMode.Mode_fontColor, marginBottom: 20 }}>
            {t("DisputeResolutionSubTextInInprintComponent")} 
            </Text>

            {/* Liability for Content */}
            <Text style={{  marginLeft: width(5), width: width(70), fontSize: 18, fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor, marginBottom: 10 }}>
            {t("LiabilityForContentTextInInprintComponent")}  
            </Text>
            <Text style={{  marginLeft: width(5), width: width(85), color: CurrentViewMode.Mode_fontColor, marginBottom: 20 }}>
            {t("LiabilityForContentSubTextInInprintComponent")}
            </Text>

            {/* Liability for Links */}
            <Text style={{  marginLeft: width(5), width: width(70), fontSize: 18, fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor, marginBottom: 10 }}>
            {t("LiabilityForLinksTitleInInprintComponent")}  
            </Text>
            <Text style={{  marginLeft: width(5), width: width(85), color: CurrentViewMode.Mode_fontColor, marginBottom: 20 }}>
            {t("LiabilityForLinksSubTextInInprintComponent")}
            </Text>

            {/* Copyright Notice */}
            <Text style={{  marginLeft: width(5), width: width(85), fontSize: 18, fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor, marginBottom: 10 }}>
            {t("CopyrightNoticeTitleInInprintComponent")} 
            </Text>
            <Text style={{  marginLeft: width(5), width: width(85), color: CurrentViewMode.Mode_fontColor, marginBottom: 20 }}>
            {t("CopyrightNoticeSubTextInInprintComponent")} 
            </Text>

            {/* Privacy Policy */}
            <Text style={{  marginLeft: width(5), width: width(85), fontSize: 18, fontWeight: 'bold', color: CurrentViewMode.Mode_fontColor, marginBottom: 10 }}>
            {t("PrivacyPolicyGDPRCCPAComplianceTitleInInprintComponent")}   
            </Text>
            <Text style={{ marginLeft: width(5), width: width(85), color: CurrentViewMode.Mode_fontColor, marginBottom: 20 }}>
            {t("PrivacyPolicyGDPRCCPAComplianceSubTextInInprintComponent")} <Text style={{ fontWeight: 'bold' }}> {t("PrivacyPolicyTitleTextInInprintComponent")} </Text>.
            </Text>
   
  
  
        
  </ScrollView>
    
    
      </ActionSheet>
      </>
    )
    }
    
    