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
import { SearchContext } from "../../Context/MainSearchIndexStateContext"
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated'; // Using Reanimated for smoother animations
import { IFollowingsCoinsContext } from '../../Context/OpenIFollowingsCoinsSheetContext';
//import { TextInput } from 'react-native-gesture-handler';

import { CoinPageContext } from '../../Context/OpenCoinPageContext';

import { TextInput, NativeViewGestureHandler } from 'react-native-gesture-handler';
import SearchCoinSlideViewData from './Search_Area/SearchCoinSlideViewData';
import { Search2Context } from '@/app/Context/SearchIndexStateContext';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import SearchFilter_All_Page from './SearchFilter/SearchFilter_All_Page';
import FilterCoinsSearchTabs from './SearchFilter/FilterCoinsSearchTabs';
import { ViewModeContext } from '@/app/Context/ViewModeContext';




const SearchFilterPage =  React.memo(() => {


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

    const handlers = useScrollHandlers();


    const { SearchIndex2, setSearchIndex2, SearchIndex3, setSearchIndex3 } = useContext(Search2Context);
    const [searchQuery, setSearchQuery] = useState('');
  const { 
    CoinPageIndex, 
    setCoinPageIndex,  
    CurrentBackgroundColorForCoin, 
    setCurrentBackgroundColorForCoin, coinData, setCoinData  } = useContext(CoinPageContext);

    const [isTyping, setIsTyping] = useState(false);

  const calculatedHeight = windowHeight * 0.50;

    const SearchFilterPage_Sheet = useRef(null);
    const windowHeight = Dimensions.get('window').height;

    const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);
    const {IFollowingsCoinsIndex, setIFollowingsCoinsIndex } = useContext(IFollowingsCoinsContext);

    const [isDataFetched, setIsDataFetched] = useState(false);
    const [itemOpacityRefs, setItemOpacityRefs] = useState([]);
    const [itemTranslateYRefs, setItemTranslateYRefs] = useState([]);

   
    

    


    
    

  
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







  const styles = StyleSheet.create({
    container: {
       height: "100%",
        width: "100%"
      },
      inner: {
      
       height: "100%",
        width: "100%",
     
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
  


  const handleSearchChange = (text) => {
    setSearchQuery(text); // ✅ Instant UI update
  };
  
  
  return (



<ActionSheet   
  isModal={false} 
  backgroundInteractionEnabled={false}
  gestureEnabled={true}
ref={SearchFilterPage_Sheet}

onOpen={() => {
  setSearchIndex3(0)
}}
onClose={() => {
  setSearchIndex3(-1)
}}
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
    

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={height(9.5)} // ✅ Moves up more when keyboard opens

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



            <FilterCoinsSearchTabs SearchIndex3={SearchIndex3}  />

            </ScrollView>
        
      
      




            <View 
          style={{
            backgroundColor: CurrentViewMode.Mode_bg,
           paddingHorizontal: size(20),
          // paddingVertical:  size(20),
           height: size(100),
           position: 'absolute',
           paddingTop: size(10),
           //alignItems: 'center',
           bottom: 0,
           width: "100%",
           flexDirection: 'row',
          // alignItems: 'center'
      }}>




          <View style={{
            width: "100%",
            flexDirection: 'row',
           // position: 'absolute',
            marginTop: height(0),
          
          }}>

        
          <TouchableOpacity onPress={() => {
            SheetManager.show("SearchPageTextInput_Sheet")
          }}
          style={{
            height: size(55),
            backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
            borderRadius: 15,
            width: width(90),
            flexDirection: 'row',
            paddingHorizontal: size(20),
            alignItems: 'center',
          
     
          }}>

            <MaterialIcons name='search' 
            style={{
              fontSize: size(22),
             color: CurrentViewMode.Mode_TextColorSearchBar_Search,
             marginRight: width(3),
            }}/>


            <Text style={{
              fontSize: size(18),
              color: CurrentViewMode.Mode_TextColorSearchBar_Search,
            }}>
               {t("SearchTitleInTextInputSearchPage")}...
            </Text>
          </TouchableOpacity>





        
     
          </View>
          </View>




        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

</ActionSheet>



);
});
export default SearchFilterPage;
