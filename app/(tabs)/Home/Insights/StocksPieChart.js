import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text, StyleSheet, useWindowDimensions, FlatList, PanResponder, LayoutAnimation, Dimensions,Animated, UIManager, Platform, TouchableOpacity,   Image } from 'react-native'; 
import { AntDesign, Feather, FontAwesome, FontAwesome6, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';
import database from '@react-native-firebase/database';
import auth, {firebase} from '@react-native-firebase/auth';
import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';


import Collapsible from 'react-native-collapsible';

import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLoading from 'expo-skeleton-loading'

import ActionSheet, { BottomSheetBackdrop, FlashList, ScrollView, SheetManager, useScrollHandlers} from 'react-native-actions-sheet';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import  { Keyframe, SlideInDown, SlideOutUp } from 'react-native-reanimated';


import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

import TabbedControl from 'react-native-tabbed-control';  // Import the tabbed control library

import PagerView from 'react-native-pager-view';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { TabView, SceneMap } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { getColors } from 'react-native-image-colors';

import { AnalyticsContext } from '@/app/Context/AnalyticsContext';
import { ViewModeContext } from '@/app/Context/ViewModeContext';


import firestore from '@react-native-firebase/firestore';


import { getFirestore, addDoc,getDoc, collection, doc, onSnapshot } from "@react-native-firebase/firestore";

import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";
import { usePostHog } from 'posthog-react-native';











// Component for Sort Following coins

{/*

export const OverallPosition_Component = () => {
  
  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

    const windowHeight = Dimensions.get('window').height;
  
    const {FilterState, setFilterState} = useContext(AnalyticsContext)
  
    
  
    const OverallPosition_Sheet = useRef(null);
  
  

    

    
  

  
    
      return (
  
  
  
        <ActionSheet 
        ref={OverallPosition_Sheet}
        backgroundInteractionEnabled={false}
        isModal={false}
        gestureEnabled={true}
  
  
        onOpen={() => { 
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

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
         maxHeight: height(40),
         backgroundColor: CurrentViewMode.Mode_bg,
         height: height(40),
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
              marginTop: height(0),
              marginLeft: width(5),
          }}>
           {t("BreakdownHeader")}    hello
          </Text>
  
          <TouchableOpacity onPress={() => {


console.log(FilterState)
             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            //    SheetManager.hide('OverallPosition_Sheet');
              setFilterState(t("OverallPositionHeader"))

          }}
          style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: height(3),
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
                  fontSize: size(15),
                  color: CurrentViewMode.Mode_fontColor,
                  fontWeight: "bold",
              }}>
                {t("OverallPositionHeader")}
              </Text>


              {
                FilterState == t("OverallPositionHeader")

                ?

                <MaterialIcons name='check' style={{
                    fontSize: size(25),
                    color: CurrentViewMode.Mode_fontColor,
                    position: 'absolute',
                    right: width(5),
                }} />

                :

                null
              }

          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => {
             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                SheetManager.hide('OverallPosition_Sheet');
              setFilterState(t("SincePurchaseInPercentHeader"))
          }}
          style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: height(1),
              paddingVertical: 12,
              paddingHorizontal: 0,
              width: "90%",
              alignSelf: 'center'
          }}>
  
               <MaterialIcons name='percent'
               style={{
                  fontSize: size(24),
                  color: CurrentViewMode.Mode_fontColor,
               }} />
              <Text style={{
                  marginLeft: width(10),
                  fontSize: size(15),
                  color: CurrentViewMode.Mode_fontColor,
                  fontWeight: "bold",
              }}>
                {t("SinceBroughtHeader")}   
              </Text>

              {
                FilterState == t("SincePurchaseInPercentHeader")

                ?

                <MaterialIcons name='check' style={{
                    fontSize: size(25),
                    color: CurrentViewMode.Mode_fontColor,
                    position: 'absolute',
                    right: width(5),
                }} />

                :

                null
              }
          </TouchableOpacity>
  
  
          <TouchableOpacity onPress={() => {
             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                SheetManager.hide('OverallPosition_Sheet');
                setFilterState(t("SincePurchaseInFiatHeader"))
            
          }}
          style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: height(1),
              paddingVertical: 12,
              paddingHorizontal: 0,
              width: "90%",
              alignSelf: 'center'
          }}>
  
             <FontAwesome name='dollar'
               style={{
                fontSize: size(20),
                  color: CurrentViewMode.Mode_fontColor,
                  marginLeft: width(1.5)
                  
               }} />
              <Text style={{
                  marginLeft: width(11),
                  fontSize: size(15),
                  color: CurrentViewMode.Mode_fontColor,
                  fontWeight: "bold",
              }}>
               {t("SinceBroughtHeader")}   
              </Text>


              {
                FilterState == t("SinceBroughtHeader")

                ?

                <MaterialIcons name='check' style={{
                    fontSize: size(25),
                    color: CurrentViewMode.Mode_fontColor,
                    position: 'absolute',
                    right: width(5),
                }} />

                :

                null
              }
          </TouchableOpacity>
  
  
      </View>
      </ActionSheet>
  
     
     
      );
    };
    */}
  
  




















    const SkeletonPlaceholder = () => {
        return (
        <>
          
            {Array.from({ length: 1 }).map((_, index) => (
              <SkeletonLoading  background={"#1E1E1F"} highlight={"#666"}>
                <View style={{  left: width(35), position: 'absolute',  }}>
                  {/* Left Skeleton Box */}
                 
                  {/* Right Skeleton Box */}
                  <View
                    style={{
                      backgroundColor: "#1E1E1F",
                      height: size(25),
                      width: width(20),
                    
                 
                      borderRadius: 8,
                    }}
                  />
                </View>
              </SkeletonLoading>
            ))}
        </>
        );
      };
      




      const colorCache = {}; // Cache for storing colors based on image URIs

      // Fetch dominant color from the logo image URI
      const fetchDominantColor = async (imageUri) => {
        if (colorCache[imageUri]) {
          return colorCache[imageUri];
        }
      
        try {
          const colorResult = await ImageColors.getColors(imageUri, {
            fallback: '#1E1E1F', // Fallback color in case of error
            cache: true,
            key: imageUri,
          });
      
          colorCache[imageUri] = colorResult.background;
          return colorResult.background;
        } catch (error) {
          console.error('Error fetching dominant color:', error);
          return '#1E1E1F'; // Fallback color
        }
      };
      
      
      











const StocksPieChart = () => {

  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance

  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  
  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true); // Tracks if this is the initial load

    const {FilterState, setFilterState} = useContext(AnalyticsContext)

    const [AssetFocused, setAssetFocused] = useState("")

    const [loading, setloading] = useState(null)
    const [pieData, setPieData] = useState([]);
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0); // State to store the total portfolio value


    const [AlpacaUserId, setAlpacaUserId] = useState();

    const [UserFirstName, setUserFirstName] = useState("")
    const [UserLastName, setUserLastName] = useState("")
  
 

// Format price with commas and the Euro symbol
const formatPrice = (price) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  // Remove currency symbol and append it after the number
  const numberOnly = formatted.replace(/[^0-9.,]/g, '').trim();
  return `${numberOnly} $`;
};









useEffect(() => {
  posthog.capture('screen_viewed', {
    screen: 'StocksPieChart',
    $screen_name: 'StocksPieChart',
    timestamp: new Date().toISOString(),
  });
}, []);








  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const userDocument = await firestore()
            .collection('users')
            .doc(user.uid) // Reference to the 'users' collection
            .get();
  
          if (userDocument.exists) {
            setAlpacaUserId(userDocument.data().AlpacaAccountId);
            console.log("AlpacaAccountId: ", userDocument.data().AlpacaAccountId);

          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    
    fetchUserData();
  }, [AlpacaUserId]);  // Empty array ensures effect runs only once on component mount
  







  
  
    
  const AlpacaOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==' // Replace with your actual API key
    }
  };
  
  const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG' },
  };
  
  // ✅ Updated dominant color function using `.then()` and caching
  const colorCache = {};
  
  const fetchDominantColor = (imageUri) => {
    return new Promise((resolve) => {
      if (!imageUri || !imageUri.startsWith('http')) {
        return resolve('#1E1E1F');
      }
  
      if (colorCache[imageUri]) {
        return resolve(colorCache[imageUri]);
      }
  
      getColors(imageUri, {
        fallback: '#1E1E1F',
        cache: true,
        key: imageUri,
      })
        .then((result) => {
          const color =
            result.platform === 'android' ? result.dominant : result.background;
          colorCache[imageUri] = color;
          resolve(color);
        })
        .catch((err) => {
          console.error('Error fetching dominant color:', err);
          resolve('#1E1E1F');
        });
    });
  };
  
  useEffect(() => {
    const fetchAlpacaPositions = async () => {
      try {
        if (isInitialLoad) {
          setIsLoading(true);
        }
  
        const res = await fetch(
          `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/positions`,
          AlpacaOptions
        );
        const data = await res.json();
  
        const stocksOnly = data.filter(asset => asset.asset_class === 'us_equity');
  
        let totalValue = 0;
        const pieDataArray = [];
  
        // Step 1: calculate total value
        stocksOnly.forEach((asset) => {
          const { qty, current_price } = asset;
          const assetValueUSD = qty * current_price;
          totalValue += assetValueUSD;
        });
  
        const promises = stocksOnly.map(async (asset) => {
          const { symbol, qty, avg_entry_price, current_price } = asset;
          const shortSymbol = symbol.split('/')[0].toUpperCase();
  
          try {
            // Polygon Reference Info
            const refRes = await fetch(
              `https://api.polygon.io/v3/reference/tickers/${shortSymbol}?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`
            );
            const refData = await refRes.json();
            const company = refData.results;
  
            // Polygon Snapshot for price
            const snapRes = await fetch(
              `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${shortSymbol}?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`
            );
            const snapData = await snapRes.json();
            const snap = snapData?.ticker;
  
            if (company && snap) {
              const polygonPrice = snap?.day?.c || current_price;
              const assetValueUSD = qty * polygonPrice;
  
              let percentage = 0;
              let FilteredValue = 0;
  
              // Percentage of portfolio
              if (totalValue > 0) {
                percentage = (assetValueUSD / totalValue) * 100;
              }
  
              // Filtered Value (based on Alpaca avg_entry_price)
              if (FilterState === "Since purchase in %") {
                const pctChange = ((current_price - avg_entry_price) / avg_entry_price) * 100;
                FilteredValue = pctChange.toFixed(2);
              } else if (FilterState === "Since purchase in $") {
                const dollarChange = (current_price - avg_entry_price) * qty;
                FilteredValue = dollarChange.toFixed(2);
              } else {
                FilteredValue = 0.00;
              }
  
              const imageUrl = company.branding?.icon_url;
  
              let color = '#1E1E1F'; // default fallback
              if (imageUrl) {
                color = await fetchDominantColor(`${imageUrl}?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`);
              } else {
                console.warn(`⚠️ No icon_url for ${shortSymbol}`);
              }
  
              pieDataArray.push({
                name: company.name,
                value: parseFloat(percentage.toFixed(2)),
                amount: assetValueUSD,
                image: `https://assets.parqet.com/logos/symbol/${shortSymbol}?format=png&size=100`,
                color,
                FilteredValue,
              });
            }
          } catch (err) {
            console.error(`❌ Error for ${shortSymbol}:`, err.message);
          }
        });
  
        await Promise.all(promises);
  
        pieDataArray.sort((a, b) => b.value - a.value);
  
        const totalPercentage = pieDataArray.reduce((acc, asset) => acc + asset.value, 0);
        const adjustment = 100 - totalPercentage;
        if (pieDataArray.length > 0) {
          pieDataArray[0].value += adjustment;
        }
  
        setPieData(pieDataArray);
        setTotalPortfolioValue(totalValue);
        setIsLoading(false);
        setIsInitialLoad(false);
  
      } catch (err) {
        setIsLoading(false);
        console.error('❌ Error fetching Alpaca positions or market data:', err);
      }
    };
  
    fetchAlpacaPositions();
  }, [AlpacaUserId, getFirestore, FilterState]); // Depend on FilterState to re-fetch data when the filter changes
  









const SkeletonPlaceholder = () => {
  return (
    <View>
      {/* Show 3 Skeleton Items */}
      {Array.from({ length: 10 }).map((_, index) => (
        <SkeletonLoading key={index} background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
          <View style={{ flexDirection: "row", top: height(3), marginBottom: height(4) }}>
            {/* Left Skeleton Box */}
            <View
              style={{
                backgroundColor:  CurrentViewMode.Mode_BgColorBar_Search,
                height: size(25),
                width: size(25),
                marginRight: 20,
                marginLeft: width(5),
                borderRadius: 8, // Optional: Add rounded corners
              }}
            />

            {/* Right Skeleton Box */}
            <View
              style={{
                backgroundColor:  CurrentViewMode.Mode_BgColorBar_Search,
                height: size(25),
                width: width(80),
                marginRight: width(5),
                borderRadius: 8,
              }}
            />
          </View>
        </SkeletonLoading>
      ))}
    </View>
  );
};


 // Render each item in the FlatList
 const renderItem = ({ item }) => (
   
   
    <View 
    style={{
        width: '90%',
        paddingVertical: 12,
        alignSelf: 'center',
        marginBottom: height(2),
     //  backgroundColor: '#f0f0f0',

    }}>


<View style={{
    flexDirection: 'row',
    alignItems: 'center',
}}>


    <View style={{
        height: size(25),
        width: size(25),
        backgroundColor: CurrentViewMode.Mode_fontColor,
        borderRadius:  size(25)/2,
        marginRight: width(8),
        overflow: 'hidden'
    }}>
        <Image source={{uri: item.logo}} style={{
            height: "100%",
            width: "100%"
        }} />
    </View>

<View> 


<Text style={{
        color: CurrentViewMode.Mode_fontColor,
        fontSize: size(16),
        fontWeight: "bold",
      }}>
       {item.name}
      </Text>

      <Text style={{
        color: CurrentViewMode.Mode_Sec_fontColor,
        fontSize: size(13),
        marginTop: height(1),
      }}>
       {formatPrice(item.amount)} 
      </Text>
    
      </View>


   
      {item.FilteredValue == null  ? (  // Show loader if loading or value is NaN or null
    <View style={{
        position: 'absolute',
        right: width(0),
    }}>
        <SkeletonLoading background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: 80, height: 20, backgroundColor: CurrentViewMode.Mode_BgColorBar_Search, borderRadius: 10 }} />
            </View>
        </SkeletonLoading>
    </View>
) : (
    <Text style={{
        color: FilterState === "Overall position" || FilterState === "" ? CurrentViewMode.Mode_fontColor : item.FilteredValue >= 0 ? '#00CE39' : '#FF1B1E', // White for "Overall position" or no filter, green or red for the other filters
        position: 'absolute',
        right: width(3),
        fontWeight: "bold",
        fontSize: size(16),
    }}>
        {FilterState === "Since purchase in $"
            ? `${item.FilteredValue >= 0 ? '▲ ' : '▼ '}${formatPrice(item.FilteredValue)}`
            : FilterState === "Since purchase in %" 
                ? `${item.FilteredValue >= 0 ? '▲ ' : '▼ '}${item.FilteredValue}%`
                : isNaN(item.value) || item.value === null  // If value is NaN or null, show nothing
                    ? ''
                    : `${parseFloat(item.value).toFixed(2) + "%"}`  // For "Overall position" or no filter, show the value with percentage symbol and make the text white
        }
    </Text>
)}





</View>
</View>
  );



  
const renderLegendComponent = () => {
  return (
    <>
 {

 isLoading == true

?

<SkeletonPlaceholder/>

:
<> 
{pieData.map((item, index) => (
    <View 
    style={{
        width: '90%',
        paddingVertical: 12,
        alignSelf: 'center',
        marginBottom: height(2),
     //  backgroundColor: '#f0f0f0',

    }}>


<View style={{
    flexDirection: 'row',
    alignItems: 'center',
}}>


    <View style={{
        height: size(25),
        width: size(25),
     //   backgroundColor: CurrentViewMode.Mode_fontColor,
        borderRadius:  size(25)/2,
        marginRight: width(8),
        overflow: 'hidden'
    }}>
        <Image source={{uri: item.image}} style={{
            height: "100%",
            width: "100%"
        }} />
    </View>

<View> 


<Text numberOfLines={1} style={{
        color: CurrentViewMode.Mode_fontColor,
        fontSize: size(16),
        width: width(45),
        fontWeight: "bold",
      }}>
       {item.name}
      </Text>

      <Text style={{
        color: CurrentViewMode.Mode_Sec_fontColor,
        fontSize: size(13),
        marginTop: height(1),
      }}>
       {formatPrice(item.amount)} 
      </Text>
    
      </View>


   
      {item.FilteredValue == null  ? (  // Show loader if loading or value is NaN or null
    <View style={{
        position: 'absolute',
        right: width(0),
    }}>
        <SkeletonLoading background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: 80, height: 20, backgroundColor: CurrentViewMode.Mode_BgColorBar_Search, borderRadius: 10 }} />
            </View>
        </SkeletonLoading>
    </View>
) : (
    <Text style={{
        color: FilterState === "Overall position" || FilterState === "" ? CurrentViewMode.Mode_fontColor : item.FilteredValue >= 0 ? '#00CE39' : '#FF1B1E', // White for "Overall position" or no filter, green or red for the other filters
        position: 'absolute',
        right: width(3),
        fontWeight: "bold",
        fontSize: size(16),
    }}>
        {FilterState === "Since purchase in $"
            ? `${item.FilteredValue >= 0 ? '▲ ' : '▼ '}${formatPrice(item.FilteredValue)}`
            : FilterState === "Since purchase in %" 
                ? `${item.FilteredValue >= 0 ? '▲ ' : '▼ '}${item.FilteredValue}%`
                : isNaN(item.value) || item.value === null  // If value is NaN or null, show nothing
                    ? ''
                    : `${parseFloat(item.value).toFixed(2) + "%"}`  // For "Overall position" or no filter, show the value with percentage symbol and make the text white
        }
    </Text>
)}





</View>


    </View>
))}

</>
 }


    </>
  );
};







return (
  <View
    style={{
      paddingVertical: 0,
     height: "100%",
     width: "100%"
    }}>



    <View
      style={{
      }}>

   
      <View style={{ alignItems: 'center',  marginBottom: height(5),}}>
        


        {
          isLoading == true
          ?

           <View style={{
            height: size(300),
            width: size(300),
            marginTop: height(2),
            borderWidth: 40,
            borderColor: CurrentViewMode.Mode_BgColorBar_Search,
            borderRadius: size(300)/2,
            backgroundColor: CurrentViewMode.Mode_bg_Search,
            justifyContent: 'center',
            alignItems: 'center'
           }}>

        
          <View style={{
            marginBottom: height(2)
          }}>

<SkeletonLoading background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
            <View style={{ alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: 50, height: 15,  backgroundColor: CurrentViewMode.Mode_BgColorBar_Search, borderRadius: 10 }} />
            </View>
        </SkeletonLoading>
        </View>

        <SkeletonLoading background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
            <View style={{ alignSelf: 'center',  flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: 100, height: 15, backgroundColor: CurrentViewMode.Mode_BgColorBar_Search, borderRadius: 10 }} />
            </View>
        </SkeletonLoading>
           </View>

          :
   
        <PieChart
          data={pieData}
          donut
        //  showGradient
         // sectionAutoFocus
         radius={height(16)}
         //  focusOnPress
           showValuesAsLabels
           showTextBackground
           textBackgroundRadius={20}
           innerRadius={height(10.5)}
          innerCircleColor={CurrentViewMode.Mode_bg}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
               
                <Text style={{fontSize: size(14), fontWeight: 'bold', color: CurrentViewMode.Mode_Sec_fontColor}}> {t("TotalHeader")}</Text>
                <Text
                  style={{fontSize: size(20), marginTop: height(2), color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold'}}>
                 {formatPrice(totalPortfolioValue)} 
                </Text>
              </View>
            );
          }}
        />

      }
      </View>



          <View style={{
            flexDirection: 'row',
            width: "90%",
            alignSelf: 'center',
            marginBottom: height(5),
            alignItems: 'center',
            
          }}>
        
            <Text style={{
                color: CurrentViewMode.Mode_fontColor,
                fontSize: size(25),
                fontWeight: "bold",
                
            }}>
            {t("BreakdownHeader")}    
            </Text>
       


          <TouchableOpacity onPress={() => {
            SheetManager.show("OverallPosition_Sheet")
          }}
          style={{
              position: 'absolute',
              alignItems: 'center',
              flexDirection: 'row',
              right: width(0),
          }}>
            <Text style={{
                color: CurrentViewMode.Mode_Sec_fontColor,
                fontSize: size(16),
                fontWeight: "bold",
            }}>
           {FilterState}
            </Text>

            <MaterialIcons name="keyboard-arrow-down"
            style={{
                fontSize: size(25),
                color: CurrentViewMode.Mode_Sec_fontColor,
            }} />
         </TouchableOpacity>
          </View>





      {renderLegendComponent()}

      
    </View>
  </View>);
}


export default StocksPieChart



const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    itemContainer: {
      width: '80%',
      padding: 15,
      marginVertical: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    valueText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    colorText: {
      fontSize: 14,
      color: '#333',
    },
    focusText: {
      fontSize: 14,
      color: '#333',
      marginTop: 5,
    },
  });