
import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, Dimensions, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
  import { GestureHandlerRootView, FlatList, ScrollView} from 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '@/Languages_Translation_Screens/i18n';
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';


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

import { AmountContext } from '@/app/Context/OpenAmountSheetContext';
import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
import { SellAmountContext } from "@/app/Context/SellOpenAmountSheetContext";
import RNPickerSelect from "react-native-picker-select";

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '@/app/Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from "@/app/Context/ViewModeContext"

import firestore from '@react-native-firebase/firestore';


import { getFirestore, getDoc, addDoc, collection, doc, onSnapshot } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "@react-native-firebase/auth";

import { usePostHog } from 'posthog-react-native';












export default function ManagePersonalInformationSheet () {
  
  const posthog = usePostHog(); // ✅ this gives you access to the actual instance



  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();


  const user = getAuth().currentUser;


  const { t } = useTranslation();


    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const {MetricsState, setMetricsState} = useContext(HomeChartContext)
  const windowHeight = Dimensions.get('window').height;
  const ManagePersonalInformation_Sheet = useRef(null);
  const calculatedHeight = windowHeight * 0.92;
  const [Depot_number, setDepot_number] = useState("")
  const [AccountID, setAccountID] = useState("")

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")

  const [AlpacaUserId, setAlpacaUserId] = useState();
const [Phone_number, setPhone_number] = useState("")
 const [Email, setEmail] = useState("")
const [Address, setAddress] = useState("")
const [Nationality, setNationality] = useState("")
const [DateOfBirth, setDateOfBirth] = useState("")
const [PlaceOfBirth, setPlaceOfBirth] = useState("")





  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
    }
  };



  useEffect(() => {
    posthog.capture('screen_viewed', {
      screen: 'ManagePersonalInformation_Sheet',
      $screen_name: 'ManagePersonalInformation_Sheet',
      timestamp: new Date().toISOString(),
    });
  }, []);
  



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
          setUserFirstName(userData?.newAccountPayload?.identity?.given_name);
          setUserLastName(userData?.newAccountPayload?.identity?.family_name);
          setPhone_number(userData?.newAccountPayload?.contact?.phone_number)
          setEmail(userData?.newAccountPayload.contact?.email_address)
          setAddress(userData?.newAccountPayload?.contact?.street_address[0] + ", " + userData?.newAccountPayload?.contact?.city + ", " + userData?.newAccountPayload?.contact?.postal_code + ", " + userData?.newAccountPayload?.contact?.state)
          setNationality(userData?.newAccountPayload?.identity?.country_of_citizenship)
          setDateOfBirth(userData?.newAccountPayload?.identity?.date_of_birth)
          setPlaceOfBirth(userData?.newAccountPayload?.identity?.country_of_birth)
          
          
          console.log("given_name ", userData?.newAccountPayload?.identity?.given_name);
          console.log("family_name ", userData?.newAccountPayload?.identity?.family_name);
          console.log("AlpacaAccountId: ", userData?.AlpacaAccountId);
  
          // Fetch data from Alpaca API
          const response = await fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userData.AlpacaAccountId}/account`, options);
          const responseData = await response.json();
      
          setDepot_number(responseData.account_number)
          setAccountID(responseData.id)

 
         
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
  










    
      return (
  
  
  
        <ActionSheet 
        ref={ManagePersonalInformation_Sheet}
        backgroundInteractionEnabled={false}
        isModal={false}
        onOpen={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
        }}
        gestureEnabled={true}
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
         maxHeight:height(92),
         backgroundColor: CurrentViewMode.Mode_bg,
         height:height(92),
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
              marginBottom: height(5),
          }}>

         Personal information
             
          </Text>
  
      
 
        
        









          <TouchableOpacity onPress={() => {

          }}
          style={{
            flexDirection: 'row',
            marginLeft: width(5),
            alignItems: 'center',
           
          }}>

            <View style={{
            
          }}>

       

            <Text numberOfLines={1} style={{
              fontWeight: "bold",
              color: CurrentViewMode.Mode_Sec_fontColor,
              width: width(75),
              fontSize: size(15),
              marginBottom: height(1)
            }}>
             Name
            </Text>

              <Text style={{
              color: CurrentViewMode.Mode_Sec_fontColor,
              fontSize: size(13),
              fontWeight: "bold",
            }}>

            {UserFirstName} {UserLastName}
              
              </Text>
              </View>

          </TouchableOpacity>













          <TouchableOpacity onPress={() => {
            SheetManager.show("ChnagePhoneNUmber_Sheet")
          }}
          style={{
            flexDirection: 'row',
            marginLeft: width(5),
            alignItems: 'center',
            marginTop: height(5),
          }}>

            <View style={{
            
          }}>

            <Text numberOfLines={1} style={{
              fontWeight: "bold",
              color: CurrentViewMode.Mode_fontColor,
              width: width(75),
              fontSize: size(15),
              marginBottom: height(1)
            }}>
           Phone number
            </Text>

              <Text style={{
              color: CurrentViewMode.Mode_Sec_fontColor,
              fontSize: size(13),
              fontWeight: "bold",
            }}>

            {Phone_number}  
              
              </Text>
              </View>


              <MaterialIcons name='arrow-forward-ios' style={{
                    fontSize: size(18),
                    color: CurrentViewMode.Mode_Sec_fontColor,
                    position: 'absolute',
                    right: width(8)
                  }} />
          </TouchableOpacity>












          <TouchableOpacity onPress={() => {
            SheetManager.show("ChnageEmailAddress_Sheet")
          }}
          style={{
            flexDirection: 'row',
            marginLeft: width(5),
            alignItems: 'center',
            marginTop: height(5),
          }}>

            <View style={{
            
          }}>

            <Text numberOfLines={1} style={{
              fontWeight: "bold",
              color: CurrentViewMode.Mode_fontColor,
              width: width(75),
              fontSize: size(15),
              marginBottom: height(1)
            }}>
          E-Mail
            </Text>

              <Text style={{
              color: CurrentViewMode.Mode_Sec_fontColor,
              fontSize: size(13),
              fontWeight: "bold",
            }}>

            {Email} 
              
              </Text>
              </View>


              <MaterialIcons name='arrow-forward-ios' style={{
                    fontSize: size(18),
                    color: CurrentViewMode.Mode_Sec_fontColor,
                    position: 'absolute',
                    right: width(8)
                  }} />
          </TouchableOpacity>












          <View style={{
            flexDirection: 'row',
            marginLeft: width(5),
            alignItems: 'center',
            marginTop: height(5),
          }}>

            <View style={{
            
          }}>

            <Text numberOfLines={1} style={{
              fontWeight: "bold",
              color: CurrentViewMode.Mode_Sec_fontColor,
              width: width(75),
              fontSize: size(15),
              marginBottom: height(1)
            }}>
          Address
            </Text>

              <Text numberOfLines={1} style={{
              color: CurrentViewMode.Mode_Sec_fontColor,
              fontSize: size(13),
              width: "80%",
              fontWeight: "bold",
            }}>

            {Address} 
              
              </Text>
              </View>


          </View>
















          <View style={{
            flexDirection: 'row',
            marginLeft: width(5),
            alignItems: 'center',
            marginTop: height(5),
          }}>

            <View style={{
            
          }}>

            <Text numberOfLines={1} style={{
              fontWeight: "bold",
              color: CurrentViewMode.Mode_Sec_fontColor,
              width: width(75),
              fontSize: size(15),
              marginBottom: height(1)
            }}>
              Nationality
            </Text>

              <Text style={{
              color: CurrentViewMode.Mode_Sec_fontColor,
              fontSize: size(13),
              fontWeight: "bold",
            }}>

            {Nationality} 
              
              </Text>
              </View>


          </View>












          <View style={{
            flexDirection: 'row',
            marginLeft: width(5),
            alignItems: 'center',
            marginTop: height(5),
          }}>

            <View style={{
            
          }}>

            <Text numberOfLines={1} style={{
              fontWeight: "bold",
              color: CurrentViewMode.Mode_Sec_fontColor,
              width: width(75),
              fontSize: size(15),
              marginBottom: height(1)
            }}>
              Date of birth
            </Text>

              <Text style={{
              color: CurrentViewMode.Mode_Sec_fontColor,
              fontSize: size(13),
              fontWeight: "bold",
            }}>

            {DateOfBirth} 
              
              </Text>
              </View>


          </View>


















          <View style={{
            flexDirection: 'row',
            marginLeft: width(5),
            alignItems: 'center',
            marginTop: height(5),
          }}>

            <View style={{
            
          }}>

            <Text numberOfLines={1} style={{
              fontWeight: "bold",
              color: CurrentViewMode.Mode_Sec_fontColor,
              width: width(75),
              fontSize: size(15),
              marginBottom: height(1)
            }}>
             Place of birth
            </Text>

              <Text style={{
              color: CurrentViewMode.Mode_Sec_fontColor,
              fontSize: size(13),
              fontWeight: "bold",
            }}>

            {PlaceOfBirth} 
              
              </Text>
              </View>


          </View>

      </ActionSheet>
  
     
     
      );
    };
