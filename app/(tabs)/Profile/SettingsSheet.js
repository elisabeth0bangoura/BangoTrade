
import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, FlatList, Dimensions, ScrollView, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '../../../Languages_Translation_Screens/i18n'; 
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';

import { getFirestore, addDoc, collection, doc, onSnapshot } from "@react-native-firebase/firestore";

import { getAuth, signOut, onAuthStateChanged } from "@react-native-firebase/auth";
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
import { usePostHog } from 'posthog-react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '../../Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from '../../Context/ViewModeContext';











export default function SettingsSheet () {
  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { t } = useTranslation();

    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

    const {MetricsState, setMetricsState} = useContext(HomeChartContext)
    const windowHeight = Dimensions.get('window').height;
    const Settings_Sheet = useRef(null);
    const calculatedHeight = windowHeight * 0.92;
    const [Depot_number, setDepot_number] = useState("")
    const [AccountID, setAccountID] = useState("")
    const [UserFirstname, setUserFirstname] = useState("")
    const [UserLastname, setUserLastname] = useState("")
    
    






    useEffect(() => {
      posthog.capture('screen_viewed', {
        screen: 'Settings_Sheet',
        $screen_name: 'Settings_Sheet',
        timestamp: new Date().toISOString(),
      });
    }, []);
    
  





    useEffect(() => {

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
        }
      };
      
      fetch('https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/dc053145-9232-4c82-9d13-6e53a104750f/account', options)
        .then(res => res.json())
        .then(res =>{
       //   console.log("here: ", res)
          setDepot_number(res.account_number)
          setAccountID(res.id)

        })
        .catch(err => console.error(err));

    }, [])



    useEffect(() => {

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
        }
      };
      
      fetch('https://broker-api.sandbox.alpaca.markets/v1/accounts/dc053145-9232-4c82-9d13-6e53a104750f', options)
        .then(res => res.json())
        .then(res => {
       //   console.log(res)
        setUserFirstname(res.identity.given_name)
        setUserLastname(res.identity.family_name)
        })
        .catch(err => console.error(err));

    }, [])




      
        return (
    
    
    
          <ActionSheet 
          ref={Settings_Sheet}
          gestureEnabled={true}
          isModal={false}
          backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
          keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
          
          onOpen={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
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
                marginTop: height(4),
                marginLeft: width(5),
                marginBottom: height(5),
            }}>
                {t("SettingsTitleText")}  
            </Text>
    



            <TouchableOpacity onPress={() => {

              posthog.capture('open_personal_data_bottomsheet', {
                screen: 'Settings_Sheet',
                $screen_name: 'Settings_Sheet',
                timestamp: new Date().toISOString(),

                });
              SheetManager.show("PersonalData_Sheet")
            }}
            style={{
              flexDirection: 'row',
              marginLeft: width(5),
              alignItems: 'center',

            }}>
              <View style={{
                height: size(50),
                width: size(50),
               // backgroundColor: 'yellow',
                marginRight: width(5),
                alignSelf: 'center',
                justifyContent: 'center'
              }}>
                  
            <AntDesign name='user' style={{
              color: CurrentViewMode.Mode_fontColor,
              fontSize: size(22),
              alignSelf: 'center',

            }} />

              </View>
              <Text style={{
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: 'bold',
              }}>
              
               {t("PersonalDataTitleText")}  
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

            posthog.capture('open_settings_security_data_protection_bottomsheet', {
              screen: 'Settings_Sheet',
              $screen_name: 'Settings_Sheet',
              timestamp: new Date().toISOString(),

              });

              SheetManager.show("SettingsSecurityDataProtection_Sheet")
            }}
            style={{
              flexDirection: 'row',
              marginLeft: width(5),
              marginTop: height(1),
              alignItems: 'center',

            }}>
              <View style={{
                height: size(50),
                width: size(50),
               // backgroundColor: 'yellow',
                marginRight: width(5),
                alignSelf: 'center',
                justifyContent: 'center'
              }}>
                  
            <AntDesign name='lock' style={{
              color: CurrentViewMode.Mode_fontColor,
              fontSize: size(22),
              alignSelf: 'center',

            }} />

              </View>
              <Text style={{
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: 'bold',
              }}>
                {t("SecurityDataProtectionText")}  
            
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

              posthog.capture('open_settings_viewmode_bottomsheet', {
                screen: 'Settings_Sheet',
                $screen_name: 'Settings_Sheet',
                timestamp: new Date().toISOString(),

                });
                
              SheetManager.show("ViewMode_Sheet")
            }}
            style={{
              flexDirection: 'row',
              marginLeft: width(5),
              marginTop: height(1),
              alignItems: 'center',

            }}>
              <View style={{
                height: size(50),
                width: size(50),
               // backgroundColor: 'yellow',
                marginRight: width(5),
                alignSelf: 'center',
                justifyContent: 'center'
              }}>
                  
            <AntDesign name='eyeo' style={{
              color: CurrentViewMode.Mode_fontColor,
              fontSize: size(22),
              alignSelf: 'center',

            }} />

              </View>
              <Text style={{
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: 'bold',
              }}>
               {t("ViewModeText")}  
            
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

              posthog.capture('open_settings_notification_bottomsheet', {
                screen: 'Settings_Sheet',
                $screen_name: 'Settings_Sheet',
                timestamp: new Date().toISOString(),

                });
  
              SheetManager.show("SettingsNotification_Sheet")
            }}
            style={{
              flexDirection: 'row',
              marginLeft: width(5),
              marginTop: height(1),
              alignItems: 'center',

            }}>
              <View style={{
                height: size(50),
                width: size(50),
               // backgroundColor: 'yellow',
                marginRight: width(5),
                alignSelf: 'center',
                justifyContent: 'center'
              }}>
                  
            <AntDesign name='bells' style={{
              color: CurrentViewMode.Mode_fontColor,
              fontSize: size(22),
              alignSelf: 'center',

            }} />

              </View>
              <Text style={{
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: 'bold',
              }}>
               {t("NotificationsSettingsTitleText")}  
            
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

              posthog.capture('open_settings_change_language_bottomsheet', {
                screen: 'Settings_Sheet',
                $screen_name: 'Settings_Sheet',
                timestamp: new Date().toISOString(),

                });

              SheetManager.show("ChangeLanguage_Sheet")
            }}
            style={{
              flexDirection: 'row',
              marginLeft: width(5),
              marginTop: height(1),
              alignItems: 'center',

            }}>
              <View style={{
                height: size(50),
                width: size(50),
               // backgroundColor: 'yellow',
                marginRight: width(5),
                alignSelf: 'center',
                justifyContent: 'center'
              }}>
                  
            <Entypo name='language' style={{
              color: CurrentViewMode.Mode_fontColor,
              fontSize: size(22),
              alignSelf: 'center',

            }} />

              </View>
              <Text style={{
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: 'bold',
              }}>
              {t("LanguageSettingsTitleText")}  
            
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

              posthog.capture('open_settings_other_services_bottomsheet', {
                screen: 'Settings_Sheet',
                $screen_name: 'Settings_Sheet',
                timestamp: new Date().toISOString(),

                });

              SheetManager.show("OtherServices_Sheet")
            }}
            style={{
              flexDirection: 'row',
              marginLeft: width(5),
              marginTop: height(1),
              alignItems: 'center',

            }}>
              <View style={{
                height: size(50),
                width: size(50),
               // backgroundColor: 'yellow',
                marginRight: width(5),
                alignSelf: 'center',
                justifyContent: 'center'
              }}>
                  
            <Entypo name='dots-three-horizontal' style={{
              color:  CurrentViewMode.Mode_fontColor,
              fontSize: size(22),
              alignSelf: 'center',

            }} />

              </View>
              <Text style={{
                color:  CurrentViewMode.Mode_fontColor,
                fontWeight: 'bold',
              }}>
               {t("OtherSettingsText")}  
             
              </Text>

              <MaterialIcons name='keyboard-arrow-right' 
              style={{
                color:  CurrentViewMode.Mode_Sec_fontColor,
                position: 'absolute',
                right: width(5),
                fontSize: size(25),
              }} />
            </TouchableOpacity>







      <View style={{
        width: "100%",
        position: 'absolute',
        bottom: height(8),
        flexDirection: 'row',
      }}>


        <TouchableOpacity onPress={() => {

          posthog.capture('close_settings_bottomsheet', {
            screen: 'Settings_Sheet',
            $screen_name: 'Settings_Sheet',
            timestamp: new Date().toISOString(),

            });
          
           setTimeout(() => {
             SheetManager.hide("Settings_Sheet"); // Now hide the sheet after a delay
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

        </View> 
        

          </View>
        
        </ActionSheet>
    
       
       
        );
      };
