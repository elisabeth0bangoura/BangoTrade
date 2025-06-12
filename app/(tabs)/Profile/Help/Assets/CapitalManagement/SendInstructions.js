import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, Dimensions, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
  import { GestureHandlerRootView, ScrollView, FlatList} from 'react-native-gesture-handler';

import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';




import * as Haptics from 'expo-haptics';

import { color } from 'd3';

import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { FlashList } from '@shopify/flash-list';
import Collapsible from 'react-native-collapsible';
import CoinPage from '@/app/(coin)/coinPage';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';

import { HomeChartContext } from '../../../../../Context/HomeChartContext';
import { useRouter } from 'expo-router';


import RNPickerSelect from "react-native-picker-select";

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '../../../../../Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from '../../../../../Context/ViewModeContext';

import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc, addDoc, collection, onSnapshot } from "@react-native-firebase/firestore";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";

import { ReanimatedScrollView } from 'react-native-reanimated'; // If you want scroll-based animations
import Animated, { Easing, FadeIn, FadeOut, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import SkeletonLoading from 'expo-skeleton-loading'









export default function SendInstructionsSheet () {
  


	const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  



  const { t } = useTranslation();


    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

    const {MetricsState, setMetricsState} = useContext(HomeChartContext)
    const {setCurrentChoosedItem} = useContext(HomeContext)
    const windowHeight = Dimensions.get('window').height;
    const Activity_Sheet = useRef(null);
    const calculatedHeight = windowHeight * 0.92;
  
    const [AlpacaUserId, setAlpacaUserId] = useState();

    const [groupedActivities, setGroupedActivities] = useState([]);
  
    const [UserFirstName, setUserFirstName] = useState("")
    const [UserLastName, setUserLastName] = useState("")
    const [tLoaded, setLoaded] = useState(false)
  const [MyInvestments, setMyInvestments] = useState([])

  
  
  





      // ✅ Function to get correct headers (This Month / Month Year)
  const getMonthHeader = (dateString) => {
    const date = new Date(dateString);
    const month = t(date.toLocaleString('default', { month: 'long' }));  // Translate month name
    const monthYear = `${month} ${date.getFullYear()}`;
  
    const currentDate = new Date();
    const currentMonth = t(currentDate.toLocaleString('default', { month: 'long' }));  // Translate current month
    const currentMonthYear = `${currentMonth} ${currentDate.getFullYear()}`;
  
    return monthYear === currentMonthYear ? t('ThisMonth') : monthYear;
  };
  


  
  
 
    
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization:
        "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==",
    },
  };
  

  







  
    useEffect(() => {




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
    
            console.log("given_name ", userData?.newAccountPayload?.identity?.given_name);
            console.log("family_name ", userData?.newAccountPayload?.identity?.family_name);
            console.log("AlpacaAccountId: ", userData?.AlpacaAccountId);
    

      const API_URL =
      `https://broker-api.sandbox.alpaca.markets/v1/accounts/activities?account_id=${userData.AlpacaAccountId}&page_size=100`;
  
      

      const fetchActivities = async () => {
        try {
          const response = await fetch(API_URL, options);
          if (!response.ok) {
            console.error("API Error:", await response.text());
            return;
          }
  
          const data = await response.json();
          console.log("Fetched Activities:", data);
  
          // ✅ Grouping Activities
          const groupedData = {};
          data.forEach((activity) => {
            const header = getMonthHeader(activity.date || activity.transaction_time);
            if (!groupedData[header]) {
              groupedData[header] = [];
            }
            groupedData[header].push(activity);
          });

          
  
          // ✅ Convert to FlatList Format
          const formattedData = [];
          Object.keys(groupedData).forEach((month) => {
            formattedData.push({ type: "header", title: month });
            groupedData[month].forEach((item) => formattedData.push({ type: "item", ...item }));
          });
  
          setGroupedActivities(formattedData);
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };
  
      fetchActivities();


           
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

fetchUserData();
}, [user?.uid]); // Make sure the effect runs whenever user.uid changes























const optionsAlpaca = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
  }
};











  




const categories = [
  {
    name: 'Choose a topic',
    subcategories: [
      { name: 'Send instructions', 
        linkName: "CalculationOfPerformance_Sheet",
       },
      { name: 'Upcoming capital measures',
        linkName: "PortfolioValueDecreased_Sheet",
       },
      { name: 'ISIN change after corporate action',
        linkName: "PositionIsDisplayedIncorrectlyOrNotAtAll_Sheet",
       },
      { name: 'Effects of a stock merger',
        linkName: "DifferenceComparedToIndividualItems_Sheet",
       },
    ],
  },  
 

];





const [selectedCategory, setSelectedCategory] = useState(null);

// Handle category click (set selected category)
const handleCategoryPress = (categoryName) => {
  setSelectedCategory(categoryName);
};

// Filter categories based on selected category
const filteredCategories = selectedCategory
  ? categories.filter((category) => category.name === selectedCategory)
  : categories;


  // Render each category item
  const renderCategoryItem = ({ item }) => {
      return (

    
        <View style={{
           top: height(-2)
        }}>
          {/* Main category title */}
          <TouchableOpacity
            style={{
            marginTop: height(1),
            paddingVertical: size(15),
            }}>
            <Text style={{
                  fontSize: size(15),
                  fontWeight: "bold",
                  color: CurrentViewMode.Mode_Sec_fontColor,
                }}>{item.name}</Text>
          </TouchableOpacity>

          {/* Subcategories */}
        
        
          
          {item.subcategories &&
          item.subcategories.map((subcategory, index) => (
                <TouchableOpacity onPress={() => {
                  SheetManager.show(subcategory.linkName)
                }}
                key={index} style={{
                  width: "100%",
                  paddingVertical: size(14),
                  flexDirection: "row",
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: size(15),
                    fontWeight: "bold",
                    color: CurrentViewMode.Mode_fontColor,
                  }}>{subcategory.name}</Text>

                  <MaterialIcons name='arrow-forward-ios' style={{
                    fontSize: size(18),
                    color: CurrentViewMode.Mode_Sec_fontColor,
                    position: 'absolute',
                    right: width(0)
                  }} />
                </TouchableOpacity>
              ))}
 
 
        </View>
          )
          
      
    

    
};








const formatMoneyMyInvestmnt = useCallback((price) => {
  return new Intl.NumberFormat('us-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}, []);





   // Render List of Alpaca positions with Coingecko data
   const MyInvestmentsrenderItem = ({ item }) => {
    // Determine the value you want to check: daily_change_in_dollars, daily_change_percentage, since_brought_in_dollars, or since_brought_in_percentage
    let changeValue;
    let changeSymbol = '';
    let displayValue = '';
    
    if (MetricsState === "Daily trend dollar") {
      changeValue = item.daily_change_in_dollars;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = formatMoneyMyInvestmnt(item.daily_change_in_dollars);
    } else if (MetricsState === "Daily trend percentage") {
      changeValue = item.daily_change_percentage;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = `${changeValue.toFixed(2)}%`;
    } else if (MetricsState === "Since brought dollar") {
      changeValue = item.since_brought_in_dollars;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = formatMoneyMyInvestmnt(item.since_brought_in_dollars);
    } else if (MetricsState === "Since brought percentage") {
      changeValue = item.since_brought_in_percentage;
      changeSymbol = changeValue >= 0 ? '▲' : '▼';
      displayValue = `${changeValue.toFixed(2)}%`;
    }
  
    return (
      <TouchableOpacity
        onPress={() => {
          // Handle item press if needed
          setCoinPageIndex(0);
          SheetManager.show('CoinPage_Sheet');
          setCurrentCoinSelected(item);
        }}
        style={{
          height: height(8),
          width: "auto",
          paddingRight: width(5),
          alignItems: 'center',
          marginLeft: width(5),
        }}
      >
        <View
          style={{
            height: size(25),
            width: size(25),
            borderRadius: size(25) / 2,
            overflow: 'hidden',
          }}
        >
          {/* Display Coin Image */}
          <Image
            source={{ uri: item.image || '' }}
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        </View>
  
        <View style={{ }}>
          {/* Display Coin Name */}
          <Text style={{ fontSize: size(16), alignSelf: 'center', marginTop: height(1), color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold' }}>
            {item.name}
          </Text>
  
          <View style={{ flexDirection: 'row', }}>
            {/* Display Price Change */}
            <Text
              style={{
                fontSize: size(15),
                marginTop: height(1),
                alignSelf: 'center',
              
                color: changeValue >= 0 ? '#00CE39' : '#FF1B1E', // Green for positive, red for negative
                fontWeight: '900',
              }}
            >
              {changeSymbol} {displayValue}
            </Text>
          </View>
  
          {/* Display Quantity and Market Value */}
          <Text style={{ fontSize: size(14), marginTop: height(3), color: CurrentViewMode.Mode_Sec_fontColor, fontWeight: 'bold' }}>
            {formatMoneyMyInvestmnt(item.market_value)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  




















    
    
      return (
  
  
  
        <ActionSheet 
        ref={Activity_Sheet}
        gestureEnabled={true}
        isModal={true}
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
         backgroundColor: CurrentViewMode.Mode_bg,
         height: height(92),
         borderTopLeftRadius: 20,
         borderTopRightRadius: 20,
         
       }} 	
       style={{
         height: "100%",
         backgroundColor: CurrentViewMode.Mode_bg,
     }}>
   
  
  
  
        <ScrollView showsVerticalScrollIndicator={false} style={{
        height: "100%",
        width: "90%",
        alignSelf: 'center'
        }}>

  
          <Text style={{
              fontSize: size(25),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "900",
              marginTop: height(4),
              width: "75%",
              marginLeft: width(5),
          }}>

          Send instructions
             
          </Text>
  

        
  

      
          <Text  style={{
              fontSize: size(16),
              color: CurrentViewMode.Mode_fontColor,
              marginTop: height(2.8),
              marginLeft: width(5),
              fontWeight: "bold",
              lineHeight: height(2.8)
          }}>
         For certain corporate actions, you can choose between different payouts, 
         such as a dividend payment in shares or cash.
         For most corporate actions, instructions can be selected directly in the app. For others, 
         we provide you with a PDF document that you can complete and return to us.
         {`\n`} {`\n`}
         If we don't receive instructions, we will execute the default option for you, 
         which is the option chosen by most customers. 
         Upcoming corporate actions can be found in <Text style={{
          fontSize: size(16),
          fontWeight: "bold",
          color: CurrentViewMode.Mode_CashChart_Cash,
         }}>Activity Log</Text>.

          </Text>

      



       
  </ScrollView>




 <View style={{
    width: "100%",
    position: 'absolute',
    bottom: height(5),
    flexDirection: 'row',
}}>







<TouchableOpacity onPress={() => {
          
      
      SheetManager.hide("Asset_Sheet"); // Now hide the sheet after a delay
              
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














<TouchableOpacity onPress={() => {
          
      
          SheetManager.hide(""); // Now hide the sheet after a delay
                  
          }}
            style={{
              backgroundColor: CurrentViewMode.Mode_fontColor,
              height: size(50),
              borderRadius: 10,
              paddingHorizontal: width(13),
              width:  size(150),
              right: width(5),
              alignItems: 'center',
              position: 'absolute',
              flexDirection: 'row',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.36,
              shadowRadius: 6.68,
              elevation: 11,
            }}>

              <Text style={{
                fontSize: size(15),
                fontWeight: "bold",
                 position: 'absolute',
                 marginLeft: width(5),
                color: CurrentViewMode.Mode_bg
              }}>
                Chat
              </Text>
    
              <MaterialIcons name='keyboard-arrow-right' style={{
                color: CurrentViewMode.Mode_bg,
                fontSize: size(25),
                position: 'absolute',
                right: width(3),
              }} />
             
 </TouchableOpacity>

        </View> 
        
  
      </ActionSheet>
  
     
     
      );
    };
    






