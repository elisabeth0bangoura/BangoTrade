// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, Platform, Button, ActivityIndicator, Dimensions, Easing, StyleSheet, Image, Animated, TouchableOpacity, 
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,


 } from 'react-native';
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import { GestureHandlerRootView, ScrollView, FlatList } from 'react-native-gesture-handler';
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
import ActionSheet, { FlashList, SheetManager} from "react-native-actions-sheet";
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
import { TextInput } from 'react-native-gesture-handler';

import { CoinPageContext } from '../../Context/OpenCoinPageContext';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import TopMoversStocksSheetData from './Search_Area/TrendyCompanyStocksSheetData';
import ETFSSheetData from './Search_Area/ETFSSheetData';
import DerivatesData from './Search_Area/DerivatesData';
import BondsData from './Search_Area/BondsData';
import { HomeChartContext } from '@/app/Context/HomeChartContext';





const SearchPage =  React.memo(() => {


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  const {StopRealtimeInHomeChart1D, setStopRealtimeInHomeChart1D,
    ShowHomeChart, setShowHomeChart,
    MetricsState, setMetricsState,

  } = useContext(HomeChartContext)

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { 
    CoinPageIndex, 
    setCoinPageIndex,  
    CurrentBackgroundColorForCoin, 
    setCurrentBackgroundColorForCoin, coinData, setCoinData  } = useContext(CoinPageContext);



    

  const calculatedHeight = windowHeight * 0.50;

    const SearchSheetRef = useRef(null);
    const windowHeight = Dimensions.get('window').height;

    const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);
    const {IFollowingsCoinsIndex, setIFollowingsCoinsIndex } = useContext(IFollowingsCoinsContext);

    const [isDataFetched, setIsDataFetched] = useState(false);
    const [itemOpacityRefs, setItemOpacityRefs] = useState([]);
    const [itemTranslateYRefs, setItemTranslateYRefs] = useState([]);
    const [tickerData, setTickerData] = useState(null);



    
/*

    useEffect(() => {
      const fetchTickerData = async () => {
        try {
          const response = await fetch('https://api.polygon.io/v1/reference/company-branding/YXBwbGUuY29t/images/2025-04-04_icon.png?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm', {
            method: 'GET', // We are making a GET request
            headers: {
              'Authorization': 'Bearer O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm', // Authorization header with Bearer token
              'Content-Type': 'application/json', // Optional, but it's always good to specify the content type
            },
          });
  
          const data = await response.json();
  
          console.log("data ", data)
          if (data?.results?.branding?.icon_url) {
            setTickerData(data); // Store the response if the icon_url exists
          } else {
            console.log('Icon URL not found.');
          }
        } catch (error) {
          console.error('Error fetching ticker data:', error);
        }
      };
  
      fetchTickerData(); // Fetch ticker data when the component mounts
    }, []);
  */
    

  
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





  


  
  return (

 <ActionSheet  
 ref={SearchSheetRef}
 gestureEnabled={true}
 isModal={false}
 backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
 keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
 
  onOpen={() => {
    setShowHomeChart(false)
    setStopRealtimeInHomeChart1D(true)

   // setCoinPageIndex(-1)
  //  setSearchIndex(0)
  //  setIFollowingsCoinsIndex(-1)
   
  }}

  onClose={() => {
    setShowHomeChart(true)
    setStopRealtimeInHomeChart1D(false)
   // setCoinPageIndex(-1)
     setSearchIndex(-1)
     setCoinPageIndex(-1)
  //  setIFollowingsCoinsIndex(-1)
   
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
        backgroundColor: CurrentViewMode.Mode_bg,
        height: height(92),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        
      }} 	
      style={{
        height: "100%",
        backgroundColor: CurrentViewMode.Mode_bg,
    }}>
    


    <ScrollView contentContainerStyle={{ paddingBottom: height(16) }} scrollEventThrottle={16}>
    <Animated.View style={{ opacity: animatedOpacity }}>







{
/*
      <View style={{
      backgroundColor: 'pink',
      height: height(20),
      width: "100%"
      }}>

      <View style={{
          height: 25,
          width: 25,
          backgroundColor: 'green',
          borderRadius: 25/2,
          overflow: 'hidden',

      }}>

        <Image style={{
          height: "100%",
          width: "100%",

        }} source={{uri: "https://api.polygon.io/v1/reference/company-branding/YXBwbGUuY29t/images/2025-04-04_icon.png?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm"}} />
</View>
<Text style={styles.description}>{tickerData?.results?.description}</Text>
<Text>Market Cap: {tickerData?.results?.market_cap}</Text>
      </View>
*/
}
      <View>
          <Text style={{ 
            fontWeight: 'bold', 
          
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 

            marginBottom: height(3), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
           Top Stocks
          </Text>
       <TopMoversStocksSheetData setIsDataFetched={setIsDataFetched} SearchIndex={SearchIndex} />
        </View>



{
  /*

  <View>
          <Text style={{ 
            fontWeight: 'bold', 
          
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 

            marginBottom: height(5), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
            {t("StableCoinsInSearchPageComponent")}   
          </Text>
       <TopMoversStocksSheetData setIsDataFetched={setIsDataFetched} SearchIndex={SearchIndex} />
        </View>
  */
}


      <View /*style={animateComponent(1)}*/ >
          <Text  style={{ 
            fontWeight: 'bold', 
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 

            marginBottom: height(2), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
             {t("TopMoversInSearchPageComponent")}  
          </Text>
          <Winners_BottomSheetData setIsDataFetched={setIsDataFetched} SearchIndex={SearchIndex} />
        </View>

    <View /*style={animateComponent(2)}*/>
          <Text  style={{ 
            fontWeight: 'bold', 
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 

            marginBottom: height(5), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
           {t("TrendsInSearchPageComponent")}   
        </Text>
          <Trends_BottomSheetData setIsDataFetched={setIsDataFetched} SearchIndex={SearchIndex} />
        </View>



        <View /*style={animateComponent(3)}*/>
          <Text  style={{ 
            fontWeight: 'bold', 
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 

            marginBottom: height(1), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
           ETF's
        </Text>
          <ETFSSheetData setIsDataFetched={setIsDataFetched} SearchIndex={SearchIndex} />
        </View>


{/*

       <View /*style={animateComponent(3)}>
          <Text  style={{ 
            fontWeight: 'bold', 
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 

            marginBottom: height(2), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
            {t("YieldFarmingStakingInSearchPageComponent")}    
        </Text>
          <MYieldFarmingStakingData setIsDataFetched={setIsDataFetched} SearchIndex={SearchIndex} />
        </View>


*/}

        


<View /*style={animateComponent(5)} */>
          <Text  style={{ 
            fontWeight: 'bold', 
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 

            marginBottom: height(2), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
            {t("DeFiInSearchPageComponent")}      
          </Text>
          <DeFiData setIsDataFetched={setIsDataFetched} SearchIndex={SearchIndex} />
        </View>





        <View /*style={animateComponent(3)}*/>
          <Text  style={{ 
            fontWeight: 'bold', 
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 
            marginBottom: height(1), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
          Derivatives
        </Text>
          <DerivatesData setIsDataFetched={setIsDataFetched} SearchIndex={SearchIndex} />
        </View>




  


    

        

{/*
        <View /*style={animateComponent(4)}  >
          <Text  style={{ 
            fontWeight: 'bold', 
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 

            marginBottom: height(2), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
           {t("PaymentInSearchPageComponent")}     
         </Text>
          <PaymentCoins setIsDataFetched={setIsDataFetched} SearchIndex={SearchIndex} />
        </View>
*/}




<View /*style={animateComponent(3)}*/>
          <Text  style={{ 
            fontWeight: 'bold', 
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 
            marginBottom: height(1), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
          Bonds
        </Text>
          <BondsData setIsDataFetched={setIsDataFetched} SearchIndex={SearchIndex} />
        </View>




       {/* <View /*style={animateComponent(6)/>
          <Text  style={{ 
            fontWeight: 'bold', 
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 

            marginBottom: height(2), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
            {t("GovernanceInSearchPageComponent")}       
          </Text>
          <GovernanceData setIsDataFetched={setIsDataFetched} SearchIndex={SearchIndex} />
        </View>
*/}

{/*

       <View  /*style={animateComponent(7)  >
          <Text  style={{ 
            fontWeight: 'bold', 
            fontSize: 20, 
            marginTop: height(5), 
            marginLeft: width(5), 

            marginBottom: height(2), 
            color: CurrentViewMode.Mode_fontColor,
          }}>
            {t("TopCategoriesInSearchPageComponent")}  
         </Text>
          <TopCategoriesData />
        </View>
*/}

       </Animated.View>
      </ScrollView>










{
  Platform.OS === "ios"

  ?




  <BlurView intensity={90} tint={CurrentViewMode.Mode_Name == "The Baddie Theme" || CurrentViewMode.Mode_Name == "The White Theme" || CurrentViewMode.Mode_Name == "The blue based Color Theme" ? 'light' : 'dark'}  
  style={{
  
   paddingHorizontal: size(20),
   height: size(130),
   position: 'absolute',
   bottom: 0,
   width: "100%",
   flexDirection: 'row',
  // alignItems: 'center'
}}>




  <View style={{
    width: "100%",
    flexDirection: 'row',
    position: 'absolute',
    marginTop: height(3),
    paddingHorizontal: size(20),
  }}>


  <TouchableOpacity onPress={() => {
    SheetManager.show("SearchPageTextInput_Sheet")
  }}
  style={{
    height: size(55),
    backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
    borderRadius: 15,
    width: width(68),
    paddingHorizontal: size(20),
   alignItems: 'center',
    flexDirection: 'row',

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




  <TouchableOpacity onPress={() => {
    SheetManager.show("SearchFilterPage_Sheet")
  }}
  style={{
    height: size(55),
    width: size(55),
    backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
    borderRadius: 15,
   position: 'absolute',
   right: width(0),
   justifyContent: 'center',
   alignItems: 'center',
  }}>

    <MaterialIcons name='filter-list' style={{
      color: CurrentViewMode.Mode_TextColorSearchBar_Search,
      fontSize: size(25)
    }} />

  </TouchableOpacity>


</View>



  </BlurView>



    :

null


}














{
  Platform.OS === "android"

  ?




  <View 
  style={{
    backgroundColor: CurrentViewMode.Mode_bg, //CurrentViewMode.Mode_Name == "The Baddie Theme" || CurrentViewMode.Mode_Name == "The White Theme" || CurrentViewMode.Mode_Name == "The blue based Color Theme" ? 'light' : 'dark',
   paddingHorizontal: size(20),
   height: size(130),
   position: 'absolute',
   bottom: 0,
   width: "100%",
   flexDirection: 'row',
  // alignItems: 'center'
}}>




  <View style={{
    width: "100%",
    flexDirection: 'row',
    position: 'absolute',
    marginTop: height(3),
    paddingHorizontal: size(20),
  }}>


  <TouchableOpacity onPress={() => {
    SheetManager.show("SearchPageTextInput_Sheet")
  }}
  style={{
    height: size(55),
    backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
    borderRadius: 15,
    width: width(68),
    paddingHorizontal: size(20),
   alignItems: 'center',
    flexDirection: 'row',

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




  <TouchableOpacity onPress={() => {
    SheetManager.show("SearchFilterPage_Sheet")
  }}
  style={{
    height: size(55),
    width: size(55),
    backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
    borderRadius: 15,
   position: 'absolute',
   right: width(0),
   justifyContent: 'center',
   alignItems: 'center',
  }}>

    <MaterialIcons name='filter-list' style={{
      color: CurrentViewMode.Mode_TextColorSearchBar_Search,
      fontSize: size(25)
    }} />

  </TouchableOpacity>


</View>



  </View>



    :

null


}







</ActionSheet>















);
});
export default SearchPage;
