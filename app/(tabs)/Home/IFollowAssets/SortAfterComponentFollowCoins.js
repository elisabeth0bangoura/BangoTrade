import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text, StyleSheet, LayoutAnimation, Dimensions,Animated, UIManager, Platform, TouchableOpacity,   Image } from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, Feather, FontAwesome, FontAwesome6, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../Languages_Translation_Screens/i18n'; 
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';
import database from '@react-native-firebase/database';
import auth, {firebase} from '@react-native-firebase/auth';
import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';
import firestore from '@react-native-firebase/firestore';


import { CoinPageContext } from '../../../Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '../../../Context/CurrentCoinSelectedContext';
import {Search2Context} from '../../../Context/SearchIndexStateContext';
import Collapsible from 'react-native-collapsible';

import { IFollowingsCoinsContext } from '../../../Context/OpenIFollowingsCoinsSheetContext';
import { LinearGradient } from 'expo-linear-gradient';
import { OpenAddMoreIFollowCoinsContext } from '../../../Context/OpenAddMoreIFollowCoinsContext';
import  { Keyframe, SlideInDown, SlideOutUp } from 'react-native-reanimated';
import ActionSheet, {ScrollView, BottomSheetBackdrop, FlashList, SheetManager} from "react-native-actions-sheet";

import { SearchContext, SearchContextProvider } from '../../../Context/MainSearchIndexStateContext';
import { ViewModeContext } from '@/app/Context/ViewModeContext';










// Component for Sort Following coins
export default SortAfterComponentFollowCoins = () => {
  
  const { t } = useTranslation();

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  
  const windowHeight = Dimensions.get('window').height;


  

  const SortAfterComponentFollowCoins_Sheet = useRef(null);



const {
 OpenAddMoreIFollowCoinsIndex, 
 setOpenAddMoreIFollowCoinsIndex, 
 FilterState, 
 setFilterState ,
 FilterStateUpDown,
 setFilterStateUpDown
} = useContext(OpenAddMoreIFollowCoinsContext);




const calculatedHeight = windowHeight * 0.43;




const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);

  
    return (



 <ActionSheet 
      ref={SortAfterComponentFollowCoins_Sheet}
      gestureEnabled={true}
      isModal={true}
      backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
      keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
      
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

 

     <Animated.View
     style={{
       height: 40, // Height of the header
       backgroundColor: CurrentViewMode.Mode_bg,
       borderTopLeftRadius: 20, // Rounded top corners
       borderTopRightRadius: 20, // Rounded top corners
       width: '100%', // Full width
       alignSelf: 'center', // Center the header
     }}

   />

   
   </>
 }
   
     
     containerStyle={{
       maxHeight:calculatedHeight,
       backgroundColor:  CurrentViewMode.Mode_bg,
       height:calculatedHeight,
       borderTopLeftRadius: 20,
       borderTopRightRadius: 20,
       
     }} 	
     style={{
       height: "100%",
       backgroundColor: CurrentViewMode.Mode_bg,
   }}>
 

      <View>
        <Text style={{
            fontSize: size(25),
            color: CurrentViewMode.Mode_fontColor,
            fontWeight: "900",
            marginTop: height(2),
            marginLeft: width(5),
        }}>
          {t("FilterByHeaderSortAfterComponentFollowCoins")}   
        </Text>

        <TouchableOpacity onPress={() => {
          	SheetManager.hide('SortAfterComponentFollowCoins_Sheet');
            setFilterState("Daily Trend")
            setOpenAddMoreIFollowCoinsIndex(-1)
        }}
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: height(4),
            width: "90%",
            paddingVertical: 12,
            paddingHorizontal: 0,
            alignSelf: 'center'
        }}>

             <MaterialCommunityIcons name='trending-up'
             style={{
                fontSize: size(25),
                color: CurrentViewMode.Mode_fontColor,
             }} />
            <Text style={{
                marginLeft: width(10),
                fontSize: size(18),
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: "bold",
            }}>
             {t("DailyTrendComponentFollowCoins")} 
            
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          	SheetManager.hide('SortAfterComponentFollowCoins_Sheet');
            setFilterState("Asset Name")
            setOpenAddMoreIFollowCoinsIndex(-1)
        }}
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: height(2),
            paddingVertical: 12,
            paddingHorizontal: 0,
            width: "90%",
            alignSelf: 'center'
        }}>

             <MaterialCommunityIcons name='text'
             style={{
                fontSize: size(25),
                color: CurrentViewMode.Mode_fontColor,
             }} />
            <Text style={{
                marginLeft: width(10),
                fontSize: size(18),
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: "bold",
            }}>
             {t("AssetNameComponentFollowCoins")}  
            </Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => {
          	SheetManager.hide('SortAfterComponentFollowCoins_Sheet');
            setFilterState("Market Cap")
            setOpenAddMoreIFollowCoinsIndex(-1)
        }}
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: height(2),
            paddingVertical: 12,
            paddingHorizontal: 0,
            width: "90%",
            alignSelf: 'center'
        }}>

             <MaterialCommunityIcons name='chart-timeline-variant-shimmer'
             style={{
                fontSize: size(25),
                color: CurrentViewMode.Mode_fontColor,
             }} />
            <Text style={{
                marginLeft: width(10),
                fontSize: size(18),
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: "bold",
            }}>
               {t("MarketCapComponentFollowCoins")}  
            
            </Text>
        </TouchableOpacity>


    </View>
    </ActionSheet>

   
   
    );
  };





  
