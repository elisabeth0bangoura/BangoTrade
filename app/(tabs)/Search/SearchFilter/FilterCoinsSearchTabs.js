
import React, { useCallback,  createContext, useState, useContext, useMemo, useRef, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import { View, useWindowDimensions, Platform, Text, LongPressGestureHandler, TouchableWithoutFeedback, KeyboardAvoidingView,  Keyboard, ActivityIndicator, Button, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons"

import { BlurView } from 'expo-blur'; // If you're using Expo
import SearchCoinSlideViewData from '../Search_Area/SearchCoinSlideViewData';
import debounce from 'lodash.debounce';
import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '../../../Context/CurrentCoinSelectedContext';



import SearchFilter_All_Page from './SearchFilter_All_Page';
import SearchFilter_TopGainers from './SearchFilter_TopGainers';
import SearchFilter_Losers from './SearchFilter_Losers';
import SearchFilter_NewCoins from './SearchFilter_NewCoins';
import SearchFilter_MostViewed from './SearchFilter_MostViews';
import SearchFilter_HighestVolume from './SearchFilter_HighestVolume';
import SearchFilter_TabToEarn from './SearchFilter_TabToEarn';
import SearchFilter_Meme from './SearchFilter_Meme';
import SearchFilter_PlayToEarn from './SearchFilter_PlayToEarn';
import SearchFilter_SmartContract from './SearchFilter_SmartContract';
import SearchFilter_Gaming from './SearchFilter_Gaming';


import CoinPage from "../../../(coin)/coinPage";




import PagerView from "react-native-pager-view";
import { Search2Context } from '@/app/Context/SearchIndexStateContext';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import { useTranslation } from 'react-i18next';
import SearchFilterStocks from './SearchFilterStocks';
import SearchFilterETFs from './SearchFilterETFs';
import SearchFilterOptions from './SearchFilterOptions';






export default function FilterCoinsSearchTabs({  }) {




  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { SearchIndex2, setSearchIndex2, SearchIndex3, setSearchIndex3 } = useContext(Search2Context);


	const { CoinPageIndex, setCoinPageIndex } = useContext(CoinPageContext);
	const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);
  
  


// Coin Page

  // Coin Page
  const sheetRefCoinPage = useRef(null);

  // variables
  const snapPointsCoinPage = useMemo(() => ["90%"], []);







const handleSheetChangeCoinPage = useCallback((index) => {
setCoinPageIndex(index);
}, []);


  const handleSnapPressCoinPage = useCallback((index) => {
	sheetRefCoinPage.current?.snapToIndex(index);
	setCoinPageIndex(index)
//	setSearchIndex(-1)
	
  }, []);



// Memoize the backdrop component to optimize performance
const renderBackdropSearchCoinPage = useCallback(
(props) => (
  <BottomSheetBackdrop
	{...props}
	disappearsOnIndex={-1}
	appearsOnIndex={1}
	onPress={() => {
		if (CoinPageIndex === 0) {
			setCoinPageIndex(0)
		}
	  }}
  />
),
[CoinPageIndex]
);



const handleClosePressCoinPage = useCallback(() => {
	sheetRefCoinPage.current?.close();
	setCoinPageIndex(-1)
  }, []);






  const tabBarRef = useRef(null);
  const pagerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const tabBarHeight = 50; // Height of the tab bar

  
  // ✅ Define your tabs
  const routes = [
     { key: "1", title: "Aktien", component: <SearchFilterStocks SearchIndex3={SearchIndex3} /> },
   { key: "2", title: "ETFs", component: <SearchFilterETFs SearchIndex3={SearchIndex3} /> },
    { key: "3", title: "Crypto", component: <SearchFilter_HighestVolume SearchIndex3={SearchIndex3} /> },
    { key: "4", title: "Options", component: <SearchFilterOptions SearchIndex3={SearchIndex3} /> },

  /*  { key: "2", title: t("TopGainersTitleInFilterCoinsSearchTabs"), component: <SearchFilter_TopGainers SearchIndex3={SearchIndex3} /> },
    { key: "3", title: t("TopLosersTitleInFilterCoinsSearchTabs"), component: <SearchFilter_Losers SearchIndex3={SearchIndex3} /> },
    { key: "4", title: t("NewAssetsTitleInFilterCoinsSearchTabs"), component: <SearchFilter_NewCoins SearchIndex3={SearchIndex3} /> },
    { key: "5", title: t("MostViewedTitleInFilterCoinsSearchTabs"), component: <SearchFilter_MostViewed SearchIndex3={SearchIndex3} /> },
    { key: "6", title: t("HighestVolumeTitleInFilterCoinsSearchTabs"), component: <SearchFilter_HighestVolume SearchIndex3={SearchIndex3} /> },
    { key: "7", title: t("TapToEarnTitleInFilterCoinsSearchTabs"), component: <SearchFilter_TabToEarn SearchIndex3={SearchIndex3} /> },
    { key: "8", title: t("MemeTitleInFilterCoinsSearchTabs"), component: <SearchFilter_Meme SearchIndex3={SearchIndex3} /> },
    { key: "9", title: t("PlayToEarnTitleInFilterCoinsSearchTabs"), component: <SearchFilter_PlayToEarn SearchIndex3={SearchIndex3} /> },
    { key: "10", title: t("SmartContractsTitleInFilterCoinsSearchTabs"), component: <SearchFilter_SmartContract SearchIndex3={SearchIndex3} /> },
    { key: "11", title: t("GamingTitleInFilterCoinsSearchTabs"), component: <SearchFilter_Gaming SearchIndex3={SearchIndex3} /> }, */
  ];

  // ✅ Scroll the tab bar to center the active tab
  const scrollToTab = (tabIndex) => {
    tabBarRef.current?.scrollToIndex({
      index: tabIndex,
      animated: true,
      viewPosition: 0.5, // Centers the tab
    });
  };

  return (

    <>



    
  
    <View style={{ height: "auto",  backgroundColor:CurrentViewMode.Mode_bg, }}>
      {/* ✅ Tab Bar Stays on Top */}
      <FlatList
        ref={tabBarRef}
        horizontal
        data={routes} style={{
         // paddingBottom: height(1),
        }}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item, index: tabIndex }) => {
          const isActive = index === tabIndex;
          return (
            <TouchableOpacity
              onPress={() => {
                setIndex(tabIndex);
                pagerRef.current?.setPage(tabIndex);
                scrollToTab(tabIndex);
              }}
              style={{
                paddingVertical: 0,
                paddingHorizontal: 10,
      
              }}>
              <Text
                style={{
                  color: isActive ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Sec_fontColor,
                  fontWeight: "bold",
                  fontSize: size(25),
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* ✅ Full-Screen PagerView with Swiping */}
      <PagerView
        ref={pagerRef}
        style={{  height: height(100), width: "100%" ,  }} // ✅ Full height fix
        initialPage={0}
        keyboardDismissMode="on-drag" // ✅ Enables swiping
        scrollEnabled={true} // ✅ Ensures swipe works
        onPageSelected={(e) => {
          const newIndex = e.nativeEvent.position;
          setIndex(newIndex);
          scrollToTab(newIndex);
        }}
      >
        {routes.map((route) => (
          <View key={route.key} style={{ paddingBottom: height(20), height: "100%", width: "100%" }}>
            {route.component}
          </View>
        ))}
      </PagerView>
    </View>




    </>
  );
}

