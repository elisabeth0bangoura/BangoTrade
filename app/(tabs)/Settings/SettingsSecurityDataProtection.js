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
import { GestureHandlerRootView, Switch } from 'react-native-gesture-handler';
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













export default SettingsSecurityDataProtection = () => {

  const { t } = useTranslation();

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const [isEnabledFaceId, setIsEnabledFaceId] = useState(false);




 const [isEnabledShareUsageData, setIsEnabledShareUsageData] = useState(false);
 const toggleSwitchShareUsageData = () => setIsEnabledShareUsageData(previousState => !previousState);


  
  const windowHeight = Dimensions.get('window').height;
  const SettingsSecurityDataProtection_Sheet = useRef(null);
  const calculatedHeight = windowHeight * 0.88;

  const firstNameInputRef = useRef(null); // Ref for First Name Input
  const lastNameInputRef = useRef(null); // Ref for Last Name Input

  const [PhoneNumber, setPhoneNumber] = useState("")
  const [activeInput, setActiveInput] = useState("first"); // Track which input is active

  const [Phonenumber, setPhonenumber] = useState()
  const [AlpacaUserId, setAlpacaUserId] = useState()
  const {
    showToast, 
    setShowToast,
    showChangedPhoneNumber, setshowChangedPhoneNumber

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















  const toggleSwitchFaceId = async (newValue) => {
    if (newValue) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  
      if (!hasHardware || !isEnrolled) {
        Alert.alert("Face ID Not Available", "Your device does not support Face ID.");
        return;
      }
  
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Enable Face ID",
        fallbackLabel: "Use Passcode",
      });
  
      if (result.success) {
        const user = auth.currentUser;
        if (user) {
          console.log("✅ Storing Face ID settings...");
          await AsyncStorage.setItem("faceIdEnabled", "true"); // ✅ No stringify
          await AsyncStorage.setItem("userUID", JSON.stringify(user.uid));
          setIsEnabledFaceId(true);
          Alert.alert("Face ID Enabled", "You can now use Face ID for login.");
        } else {
          Alert.alert("Error", "No user is logged in.");
        }
      } else {
        Alert.alert("Authentication Failed", "Face ID was not enabled.");
      }
    } else {
      console.log("🚪 Face ID switched off (but not deleted)");
      await AsyncStorage.setItem("faceIdEnabled", "false"); // ✅ Don't delete
      setIsEnabledFaceId(false);
      Alert.alert("Face ID Disabled", "You will no longer use Face ID for login.");
    }
  };
  


  useEffect(() => {
    const checkStoredData = async () => {
      try {
        const storedFaceId = await AsyncStorage.getItem("faceIdEnabled");
        if (storedFaceId !== null) {
          setIsEnabledFaceId(storedFaceId === "true");
        }
        console.log("🔍 Stored Face ID preference:", storedFaceId);
      } catch (error) {
        console.error("❌ Error fetching stored Face ID:", error);
      }
    };
  
    checkStoredData();
  }, []);
  




  










  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inner: {
      padding: 24,
      flex: 1,
      justifyContent: 'space-around',
    },
    header: {
      fontSize: 36,
      marginBottom: 48,
    },
    textInput: {
      height: 40,
      borderColor: '#000000',
      borderBottomWidth: 1,
      marginBottom: 36,
    },
    btnContainer: {
      backgroundColor: 'white',
      marginTop: 12,
    },
  });




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
  ref={SettingsSecurityDataProtection_Sheet}
  gestureEnabled={true}
  isModal={false}
  backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
  keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
  
  onOpen={handleOpen}
  onClose={() => {
    Keyboard.dismiss(); // Dismiss the keyboard first
    setTimeout(() => {
      SheetManager.hide("SettingsSecurityDataProtection_Sheet"); // Now hide the sheet after a delay
    }, 200); // Small delay to avoid flickering
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
   backgroundColor: CurrentViewMode.Mode_bg_Profile,
   height: height(92),
   borderTopLeftRadius: 20,
   borderTopRightRadius: 20,
   
 }} 	
 style={{
   height: "100%",
   backgroundColor: CurrentViewMode.Mode_bg_Profile,
}}>



<View style={{
  height: "100%",
  width: "100%"
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
       {t("SecurityDataProtectionTitleInSecurityDataProtectionComponent")}  
      
    </Text>



<TouchableOpacity onPress={() => {



  SheetManager.show("ChnagePinSettings_Sheet")
}}
style={{
 width: "100%",
 alignSelf: 'center',
 paddingVertical: size(12),
 paddingHorizontal: size(20),
 flexDirection: 'row',
 alignItems: 'center',
}}> 

    <Text style={{
      fontSize: size(14),
      fontWeight: "900",
      color: CurrentViewMode.Mode_fontColor,
    }}>

    {t("ChangePINTextInSecurityDataProtectionComponent")}  
    </Text>


<MaterialIcons name='keyboard-arrow-right' 
  style={{
  color:CurrentViewMode.Mode_Sec_fontColor,
  position: 'absolute',
  right: width(5),
  fontSize: size(25),
  }} />
 </TouchableOpacity>








 <View style={{
 width: "100%",
 marginTop: height(2),
 paddingVertical: size(12),
 paddingHorizontal: size(20),
 flexDirection: 'row',
 alignItems: 'center',
}}> 

    <Text style={{
      fontSize: size(14),
      fontWeight: "900",
      color: CurrentViewMode.Mode_fontColor,
    }}>
     {t("FaceIDTextInSecurityDataProtectionComponent")}  
  
    </Text>

    <Switch
        style={{
          right: width(5),
          position: 'absolute',
        }}
        trackColor={{ false: CurrentViewMode.Mode_fontColor, true: CurrentViewMode.Mode_fontColor }}
        thumbColor={isEnabledFaceId ? CurrentViewMode.Mode_bg : CurrentViewMode.Mode_bg}
        ios_backgroundColor={CurrentViewMode.Mode_fontColor}
        onValueChange={toggleSwitchFaceId}
        value={isEnabledFaceId}
        
      />

 </View>










 <View style={{
 width: "100%",
 marginTop: height(2),
 paddingVertical: size(12),
 paddingHorizontal: size(20),
 flexDirection: 'row',
 alignItems: 'center',
}}> 

<View>


    <Text style={{
      fontSize: size(14),
      fontWeight: "900",
      color: CurrentViewMode.Mode_fontColor
    }}>
   Login Activity
    </Text>



    <Text style={{
      fontSize: size(14),
      color: CurrentViewMode.Mode_Sec_fontColor,
      width: width(65),
      lineHeight: height(2.5),
      marginTop: height(1)
    }}>

Review your login activity and verify the time, location, and device used — directly on an interactive map.

    </Text>
    </View>

   

<MaterialIcons name='keyboard-arrow-right' 
  style={{
  color:CurrentViewMode.Mode_Sec_fontColor,
  position: 'absolute',
  right: width(5),
  fontSize: size(25),
  }} />

 </View>








 <View style={{
 width: "100%",
marginTop: height(2),
 paddingVertical: size(12),
 paddingHorizontal: size(20),
 flexDirection: 'row',
 alignItems: 'center',
}}> 


<View>


    <Text style={{
      fontSize: size(14),
      fontWeight: "900",
      color: CurrentViewMode.Mode_fontColor
    }}>
    {t("ShareUsageDataTextInSecurityDataProtectionComponent")}  
    </Text>



    <Text style={{
      fontSize: size(14),
      color: CurrentViewMode.Mode_Sec_fontColor,
      width: width(65),
      lineHeight: height(2.5),
      marginTop: height(1)
    }}>

    {t("ShareUsageDataSmallTextInSecurityDataProtectionComponent")}  

    </Text>
    </View>





 <Switch style={{
 position: 'absolute',
 right: width(5)
 }}
 trackColor={{ false: CurrentViewMode.Mode_fontColor, true: CurrentViewMode.Mode_fontColor }}
 thumbColor={isEnabledShareUsageData ? CurrentViewMode.Mode_bg : CurrentViewMode.Mode_bg}
 ios_backgroundColor={CurrentViewMode.Mode_fontColor}
 onValueChange={toggleSwitchShareUsageData}
 value={isEnabledShareUsageData}

/>

 </View>


    </View>

  </ActionSheet>
  </>
)
}












































