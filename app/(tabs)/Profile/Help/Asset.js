import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, FlatList, Dimensions, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
import ActionSheet, {useSheetRef, ScrollView, SheetManager} from 'react-native-actions-sheet';

import { HomeChartContext } from '../../../Context/HomeChartContext';
import { useRouter } from 'expo-router';


import RNPickerSelect from "react-native-picker-select";

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '../../../Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from '../../../Context/ViewModeContext';

import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc, addDoc, collection, onSnapshot } from "@react-native-firebase/firestore";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";

import { ReanimatedScrollView } from 'react-native-reanimated'; // If you want scroll-based animations
import Animated, { Easing, FadeIn, FadeOut, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';









export default function AssetSheet () {
  


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



  
  
  




const categories = [
  {
    name: 'Investments',
    subcategories: [
      { 
        name: 'Portfolio Growth and Performance' ,
        linkName: "PortfolioGrowthPerformance_Sheet",
      },
      { name: 'Capital Management', 
        linkName: "CapitalManagement_Sheet",
       },
      { name: 'Dividends',
        linkName: "Dividends_Sheet",
       },
    ],
  },  
  { name: 'Buying and selling', 
    subcategories: [
      { name: 'Crypto',
        linkName: "AboutCrypto_Sheet",
      },
      { name: 'Failed and expired orders', 
        linkName: "FailedAndExpiredOrders_Sheet"
       },
    ],
   },
  { name: 'Capital gains tax', 
    subcategories: [
      { name: 'Tax Loss Pools', 
        linkName: "TaxLossPools_Sheet",
       },
      { name: 'Exemption order (FSA)', 
        linkName: "ExemptionOrderFSA_Sheet",
       },
      { name: 'Tax corrections and refunds',
        linkName: "TaxCorrectionsAndRefunds_Sheet",
       },
    ],
   },



   /*{ name: 'Transfer of Assets', 
    subcategories: [
      {/* name: 'Incoming securities transfer',
        linkName: "",
       },
      {/* name: 'Outgoing securities transfer' },
    ],
   },*/

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
             marginBottom: height(1),
            paddingVertical: size(15),
            }}
           
          >
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
                  paddingVertical: size(10),
                  flexDirection: 'row'
                }}>
                  <Text style={{
                    fontSize: size(15),
                    fontWeight: "bold",
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
              marginLeft: width(5),
          }}>

           Assets
             
          </Text>
  



  
      <ScrollView horizontal  
      showsHorizontalScrollIndicator={false}
      style={{marginTop: height(5), flexDirection: "row", paddingLeft: width(5), 

       }}>

       {
        selectedCategory !== null
        ?
      <TouchableOpacity onPress={() => {
        setSelectedCategory(null)
      }}
      style={{
          marginRight: width(5),
           height: size(42),
           width: "auto",
            borderRadius: size(10),
            width: size(50),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
      }}>
        <MaterialIcons name='close' style={{
          fontSize: size(25),
          color: CurrentViewMode.Mode_fontColor,
        }} />
      </TouchableOpacity>

      :

      null

       }
       
       {categories.map((category, index) => (
          <TouchableOpacity key={index} onPress={() => handleCategoryPress(category.name)}
          style={{
            marginRight: width(5),
            paddingHorizontal: size(20),
            height: size(42),
            borderRadius: size(10),
            backgroundColor: selectedCategory === category.name ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_ButtonColor_Profile,
            shadowColor: "#000",
            alignItems: 'center',
            justifyContent: 'center'

          }}>
            <Text style={{
                fontSize: size(16),
                alignSelf: 'center',
                color:  selectedCategory === category.name ? CurrentViewMode.Mode_bg : CurrentViewMode.Mode_fontColor,
    
            }}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>




      <View style={{ marginTop: height(4), marginLeft: width(5), }}>
       


      <FlatList contentContainerStyle={{
            paddingBottom: height(10)
          }}
        data={filteredCategories} // Use filteredCategories here
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.name}
      />
         
       
      </View>
  
       
  </ScrollView>
        
  
      </ActionSheet>
  
     
     
      );
    };
    








const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  categoryButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 18,
  },
  subcategoriesContainer: {
    marginLeft: 20,
    marginTop: 10,
  },
  subcategoryButton: {
    padding: 10,
    backgroundColor: '#d3d3d3',
    marginVertical: 3,
    borderRadius: 5,
  },
});
