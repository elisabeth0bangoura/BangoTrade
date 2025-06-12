import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text, StyleSheet, useWindowDimensions, FlatList, PanResponder, LayoutAnimation, Dimensions,Animated, UIManager, Platform, TouchableOpacity,   Image } from 'react-native'; 
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

import { SearchContext, SearchContextProvider } from '../../../Context/MainSearchIndexStateContext';



import ActionSheet, { BottomSheetBackdrop, FlashList, ScrollView, SheetManager, useScrollHandlers} from 'react-native-actions-sheet';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import  { Keyframe, SlideInDown, SlideOutUp } from 'react-native-reanimated';


import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

import TabbedControl from 'react-native-tabbed-control';  // Import the tabbed control library

import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { TabView, SceneMap } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native';

import CollapsibleTabView from './CollapsibleTabView';
import HeaderScrollableTabView from './HeaderScrollableTabView';
import PullRefreshTabView from "./PullRefreshTabView"
import DonutChart from './CryptoPieChart';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import PagerView from 'react-native-pager-view';














// Component for Sort Following coins
export const SortAfterComponentFollowCoins = () => {
  
  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


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




const calculatedHeight = windowHeight * 0.40;




const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);

  
    return (



      <ActionSheet 
      ref={SortAfterComponentFollowCoins_Sheet}
      gestureEnabled={true}
      isModal={false}
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
       backgroundColor: CurrentViewMode.Mode_bg,
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
           Filter by
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
            Daily Trend
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          	SheetManager.hide('SortAfterComponentFollowCoins_Sheet');
            setFilterState("Coin Name")
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
            Coin Name 
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
            Market Cap 
            </Text>
        </TouchableOpacity>


    </View>
    </ActionSheet>

   
   
    );
  };
  






  const AnalyticsAssetBottomSheet = () => {


    const { t, i18n } = useTranslation(); // Destructure i18n for language changes

    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    const Analytics_Sheet = useRef(null);

    const [activeItemIndex, setActiveItemIndex] = useState(0); // Track active tab index
    const [pageIndex, setPageIndex] = useState(0);





    const {
      OpenAddMoreIFollowCoinsIndex, 
      setOpenAddMoreIFollowCoinsIndex, 
      FilterState, 
      setFilterState,
      FilterStateUpDown,
      setFilterStateUpDown,
      combinedPercentage,
      setCombinedPercentage
     } = useContext(OpenAddMoreIFollowCoinsContext);
     

     const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);

// Scroll Bottmsheet 
const scrollY = useRef(new Animated.Value(0)).current;



 // ref
 

  // hooks
  const sheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["40%", "50%", "90%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);





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






  const keyframeAnimation = new Keyframe({
    0: {
      transform: [{ translateY: 20 }],
      opacity: 0,
    },
    100: {
      transform: [{ translateY: 0 }],
      opacity: 1,
    },
  });
  














const layout = useWindowDimensions();
const [index, setIndex] = React.useState(0);








const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);





const [mode, setMode] = useState('collapsible');

const renderDemo = () => {
  switch (mode) {
    case 'collapsible':
      return <CollapsibleTabView />;
    case 'scrollable':
      return <HeaderScrollableTabView />;
    case 'refresh':
      return <PullRefreshTabView />;
  }
};









  // Interpolate background color based on scroll position


const bgColor = scrollY.interpolate({
  inputRange: [0, 209],
  outputRange: [combinedPercentage >= 0 ? '#074843' : '#48071B', CurrentViewMode.Mode_bg],  // Start and end colors
  extrapolate: 'clamp',
});

  
  // Scroll handler to update scroll position with useNativeDriver for performance
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false, // We are not animating styles that require native driver (like background color)
    }
  );



  return (
  
    

    




<ActionSheet 
ref={Analytics_Sheet}
gestureEnabled={true}
isModal={false}
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
      


    <View style={{
    //  opacity: CoinPageIndex === 0 || SearchIndex2 === 0 ? 0.1 : 1,

      height: "100%",
      width: "100%"
    }}>


 <Animated.View style={{ opacity: animatedOpacity }}> 




<CollapsibleTabView />
      



</Animated.View>
{/*</ScrollView>*/}
      </View>



</ActionSheet>

   
  )
  }


export default AnalyticsAssetBottomSheet;




const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    flex: 1,
    height: 48,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
  },
});


{/*
   <View style={{ height: '100%', width: '100%' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEventThrottle={6} // Increase the frequency of updates
        style={{
          backgroundColor: '#0F0F0F',
          height: '100%',
        }}
      >
        <Animated.View style={{ opacity: animatedOpacity2 }}>
          <LinearGradient
            style={{
              height: height(60),
              position: 'absolute',
              width: "100%",
              backgroundColor: '#0F0F0F',
            }}
            locations={[0, 0.4, 1, 1]}
            colors={['#074843', '#0F0F0F', '#0F0F0F']}
          />

          <Text
            style={{
              fontWeight: '900',
              color: '#fff',
              fontSize: 25,
              marginLeft: 20,
              marginTop: 20,
            }}
          >
            Analytics
          </Text>

          <View style={{ height: '100%', marginTop: 20, width: '100%' }}>
    
            <FlatList
            ref={tabBarRef}
            horizontal
            scrollEnabled={false}
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
                        width: 'auto',
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                      }}
                    >
                      <Text
                        style={{
                          color: isActive ? '#fff' : '#4E4F4F',
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />

  
          
              <PagerView
                ref={pagerRef}
                style={{ height: height(100), width: "100%" ,  }} // ✅ Full height fix
                initialPage={0}
                keyboardDismissMode="on-drag" // ✅ Enables swiping
                scrollEnabled={true} // ✅ Ensures swipe works
                onPageSelected={(e) => {
                  const newIndex = e.nativeEvent.position;
                  setIndex(newIndex);
                  scrollToTab(newIndex);
                }}
              >
              
           
                  <Text style={{ color: '#fff' }}>
                  Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

                  </Text>
      
                <View style={{ height: "100%", width: "100%" }}>
                  <Text style={{ color: '#fff' }}>Positions Content</Text>
                </View>
              </PagerView>
          </View>

*/}