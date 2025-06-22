
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
import i18n from '../../../../Languages_Translation_Screens/i18n'; 
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

import { HomeChartContext } from '../../../Context/HomeChartContext';
import { useRouter } from 'expo-router';

import { AmountContext } from '../../../Context/OpenAmountSheetContext';
import { CoinPageContext } from '../../../Context/OpenCoinPageContext';
import { SellAmountContext } from '../../../Context/SellOpenAmountSheetContext';
import RNPickerSelect from "react-native-picker-select";

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '../../../Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from '../../../Context/ViewModeContext';
import { usePostHog } from 'posthog-react-native';









export default function PortfolioStatementsSheet () {
  


  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { t } = useTranslation();

    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    const {MetricsState, setMetricsState} = useContext(HomeChartContext)
  
  
    const windowHeight = Dimensions.get('window').height;
  
  
    
  
    const PortfolioStatements_Sheet = useRef(null);
  
  
  
    
  
  
  
  const calculatedHeight = windowHeight * 0.92;
  




  useEffect(() => {
    posthog.capture('screen_viewed', {
      screen: 'PortfolioStatements_Sheet',
      $screen_name: 'PortfolioStatements_Sheet',
      timestamp: new Date().toISOString(),
    });
  }, []);


  
  
  
    
      return (
  
  
  
        <ActionSheet 
        ref={PortfolioStatements_Sheet}
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
         maxHeight:calculatedHeight,
         backgroundColor: CurrentViewMode.Mode_bg,
         height:calculatedHeight,
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

        {t("PortfolioHeader")}     
        
          </Text>
  
        <View style={{
          width: "95%",
          alignSelf: 'center'
        }}>
        
  
      <TouchableOpacity onPress={() => {

        posthog.capture('open_statements_date_type_portfolio_bottomsheet', {
          screen: 'StatementsDateTypePortfolio_Sheet',
          $screen_name: 'StatementsDateTypePortfolio_Sheet',
          timestamp: new Date().toISOString(),
          });

          
        SheetManager.show("StatementsDateTypePortfolio_Sheet")
      }}
      style={{
            paddingVertical: size(12),
            paddingHorizontal: size(20),
            marginBottom: height(1),
            flexDirection: 'row',
            alignItems: 'center',
          }}>



        <View style={{
            height: size(25),
            width: size(25),
            borderRadius: size(25)/2,
           
            marginRight: width(5),
            borderWidth: 2,
            borderColor: CurrentViewMode.Mode_fontColor,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
   
   
         <MaterialIcons name='show-chart' 
          style={{
            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(20),
 
          }}/>

          </View>
          
            <Text style={{
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: "bold",
            }}>
           {t("PortfolioStatementsHeader")} 
            </Text>

            <MaterialIcons name='keyboard-arrow-right' style={{
              color: CurrentViewMode.Mode_Sec_fontColor,
              position: 'absolute',
              right: width(5),
              fontSize: size(25),
            }} />
          </TouchableOpacity>
         
  
          <TouchableOpacity onPress={() => {

        posthog.capture('open_statements_date_type_crypto_bottomsheet', {
          screen: 'StatementsDateTypeCrypto_Sheet',
          $screen_name: 'StatementsDateTypeCrypto_Sheet',
          timestamp: new Date().toISOString(),
          });


            SheetManager.show("StatementsDateTypeCrypto_Sheet")
          }}
          style={{
            paddingVertical: size(12),
            paddingHorizontal: size(20),
            flexDirection: 'row',
            alignItems: 'center',
          }}>

        <View style={{
            height: size(25),
            width: size(25),
            borderRadius: size(25)/2,
           
            marginRight: width(5),
            borderWidth: 2,
            borderColor: CurrentViewMode.Mode_fontColor,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
   

        <MaterialIcons name='currency-bitcoin' 
          style={{
            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(20),
         
          }}/>
                   
         </View>

          <Text style={{
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: "bold",
            }}>
             {t("CryptoStatementsHeader")}   
            </Text>

            <MaterialIcons name='keyboard-arrow-right' style={{
               color: CurrentViewMode.Mode_Sec_fontColor,
               position: 'absolute',
               right: width(5),
               fontSize: size(25),
            }} />
          </TouchableOpacity>
         
         
  
      </View>
      </ActionSheet>
  
     
     
      );
    };

