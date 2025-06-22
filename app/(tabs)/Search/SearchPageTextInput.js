// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, Button, ActivityIndicator, Dimensions, Easing, StyleSheet, Image, Animated, FlatList, TouchableOpacity, 
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,


 } from 'react-native';
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import axios from 'axios';
import CountryFlag from "react-native-country-flag";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { BlurView } from 'expo-blur'; // If you're using Expo
import { LineChart } from 'react-native-wagmi-charts';
import { Platform } from 'react-native';
import { Link } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'

import { LinearGradient } from 'expo-linear-gradient';
import debounce from 'lodash.debounce';

import PagerView from 'react-native-pager-view';
import { formatDistanceToNow, parseISO } from 'date-fns'; // Ensure you have date-fns installed: npm install date-fns
import firestore from '@react-native-firebase/firestore';
import Collapsible from 'react-native-collapsible';
import * as WebBrowser from 'expo-web-browser';
import ActionSheet, {ScrollView, useScrollHandlers, FlashList, SheetManager} from "react-native-actions-sheet";
import StableCoinBottomSheetData from './Search_Area/StableCoinsBottomSheetData';
import Winners_BottomSheetData from './Search_Area/Winners_BottomSheetData';
import Trends_BottomSheetData from './Search_Area/Trends_BottomSheetData';
import MYieldFarmingStakingData from './Search_Area/MYieldFarmingStakingData';
import PaymentCoins from './Search_Area/PaymentCoins';
import DeFiData from './Search_Area/DeFiData';
import GovernanceData from './Search_Area/GovernanceData';
import TopCategoriesData from './Search_Area/TopCategoriesData';
import { SearchContext } from '@/app/Context/MainSearchIndexStateContext';
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated'; // Using Reanimated for smoother animations
import { IFollowingsCoinsContext } from '@/app/Context/OpenIFollowingsCoinsSheetContext';
//import { TextInput } from 'react-native-gesture-handler';

import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';

import { TextInput, NativeViewGestureHandler } from 'react-native-gesture-handler';
import SearchCoinSlideViewData from './Search_Area/SearchCoinSlideViewData';
import { Search2Context } from '@/app/Context/SearchIndexStateContext';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import SearchAssetsSlideViewData from './Search_Area/SearchAssetsSlideViewData';
import { usePostHog } from 'posthog-react-native';





















const SearchPageTextInput =  React.memo(() => {
  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);



    const handlers = useScrollHandlers();


    const { SearchIndex2, setSearchIndex2 } = useContext(Search2Context);
    const [searchQuery, setSearchQuery] = useState('');
  const { 
    CoinPageIndex, 
    setCoinPageIndex,  
    CurrentBackgroundColorForCoin, 
    setCurrentBackgroundColorForCoin, coinData, setCoinData  } = useContext(CoinPageContext);

    const [isTyping, setIsTyping] = useState(false);

  const calculatedHeight = windowHeight * 0.50;

    const SearchPageTextInput_Sheet = useRef(null);
    const windowHeight = Dimensions.get('window').height;

    const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);
    const {IFollowingsCoinsIndex, setIFollowingsCoinsIndex } = useContext(IFollowingsCoinsContext);

    const [isDataFetched, setIsDataFetched] = useState(false);
    const [itemOpacityRefs, setItemOpacityRefs] = useState([]);
    const [itemTranslateYRefs, setItemTranslateYRefs] = useState([]);

   


    

    useEffect(() => {
      posthog.capture('screen_viewed', {
        screen: 'Search_Input_Page',
        $screen_name: 'Search_Input_Page',
        timestamp: new Date().toISOString(),
      });
    }, []);
    

    
    

  
  useEffect(() => {

    console.log("SearchIndex in search page", SearchIndex)
  

  }, [SearchIndex, setSearchIndex, SearchLoading, setSearchLoading ])





  // Animated opacity reference
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  // Effect to animate opacity on SearchLoading change
  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: SearchLoading ? 0.3 : 1, // Adjust opacity values
      duration: 300, // Smooth transition duration (adjust as needed)
      useNativeDriver: true, // Enables GPU acceleration
    }).start();
  }, [SearchLoading]);







  

  const handleSearchChange = (text) => {
    setSearchQuery(text); // ✅ Update the UI instantly

  };
  
  
  return (



<ActionSheet   
  isModal={false} 
  backgroundInteractionEnabled={false}
  gestureEnabled={true}
ref={SearchPageTextInput_Sheet}



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

        maxHeight:  height(92),
        backgroundColor:  CurrentViewMode.Mode_bg,
        height:  height(92),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        
      }} 	
      style={{
        height: "100%",
        backgroundColor: CurrentViewMode.Mode_ButtonBgColor_Search,
    }}>
    

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={height(5)} // ✅ Moves up more when keyboard opens

      style={{
        height: "100%",
        width: "100%"
      }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{
              height: "100%",
        width: "100%"
        }}>


            <ScrollView style={{
                height: "100%",
                width: "100%",
                
            }} contentContainerStyle={{
                paddingTop: height(6),
                paddingBottom: height(10)
            }}>



          {/*  <SearchCoinSlideViewData SearchIndex2={true} searchQuery={searchQuery} />*/}

            <SearchAssetsSlideViewData SearchIndex2={true} searchQuery={searchQuery} />
            

            </ScrollView>
        
         






         
          <View style={{
             backgroundColor: CurrentViewMode.Mode_bg,
             paddingHorizontal: size(20),
             height: size(90),
             flexDirection: 'row',
             
          }}>


            <View style={{
               height: size(60),
               marginLeft: width(5),
               position: 'absolute',
               paddingHorizontal: size(20),
              backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
              width:  searchQuery == "" ? "79%" : "76%",
              flexDirection: "row",
              alignItems: 'center',
              borderRadius: 15,

              
            }}>

          

          <MaterialIcons name='search' 
            style={{
              fontSize: size(22),
             color: CurrentViewMode.Mode_TextColorSearchBar_Search,
       
            }}/>


          <TextInput   value={searchQuery} // ✅ Instant Update
          onChangeText={handleSearchChange} 
          placeholderTextColor={CurrentViewMode.Mode_TextColorSearchBar_Search}
          placeholder={t("SearchTitleInTextInputSearchPage") + "..."} style={{
              height: size(60),
              
              color: CurrentViewMode.Mode_fontColor,
              paddingHorizontal: size(20),
              backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
              width:  searchQuery == "" ? "79%" : "76%",
              fontSize: size(16),
              marginBottom: 0,
          }} />

</View>

        {
            searchQuery == ""

            ?

          <TouchableOpacity onPress={() => {
            posthog.capture('open_search_filter_page_Sheet', {
              screen: 'SearchPageTextInput_Sheet',
              $screen_name: 'SearchPageTextInput_Sheet',
              timestamp: new Date().toISOString(),
            
              });


              SheetManager.show("SearchFilterPage_Sheet")
          }}
          style={{
              height: size(60),
              borderRadius: 15,
              width: size(60),
              position: 'absolute',
              right: width(5),
              backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
              justifyContent: 'center',
              alignItems: 'center',
          }}>


            <MaterialIcons name='filter-list' style={{
                color: CurrentViewMode.Mode_TextColorSearchBar_Search,
                fontSize: size(25),

            }} />
          </TouchableOpacity>

          :

          null

        }



          {
            searchQuery == ""

            ?

            null

            :


    

           <TouchableOpacity onPress={() => {

              posthog.capture('calcel_search_input_text_bottomsheet', {
                screen: 'SearchPageTextInput_Sheet',
                $screen_name: 'SearchPageTextInput_Sheet',
                timestamp: new Date().toISOString(),
              
                });

            setSearchQuery("")
           }}
           style={{
              height: size(60),
              width: size(100),
              position: 'absolute',
              right: width(1),
           //   backgroundColor: 'yellow',
              justifyContent: 'center',
           }}>
            <Text style={{
                fontSize: size(16),
                fontWeight: "bold",
                alignSelf: 'center',
                color: CurrentViewMode.Mode_fontColor,
            }}>
                Cancel
            </Text>
           </TouchableOpacity>

            }
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

</ActionSheet>



);
});
export default SearchPageTextInput;
