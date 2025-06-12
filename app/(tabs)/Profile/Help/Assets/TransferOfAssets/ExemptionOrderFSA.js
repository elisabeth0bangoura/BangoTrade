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









export default function ExemptionOrderFSASheet () {
  


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












useEffect(() => {
  setLoaded(true);

  const fetchUserData = async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const userDocument = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();

        if (userDocument.exists) {
          setAlpacaUserId(userDocument.data().AlpacaAccountId);

          // Firestore real-time listener for the Transaction_Activities collection
          firestore()
            .collection('users')
            .doc(user.uid)
            .collection('Transaction_Activities')
            .onSnapshot(async (snapshot) => {
              const activities = snapshot.docs.map(doc => doc.data());
            //  console.log("📥 Activities fetched from Firestore:", activities);

              if (!Array.isArray(activities) || activities.length === 0) {
                return;
              }

              // Filter out activities that don't have symbol or qty
              const validActivities = activities.filter(item => item.symbol && item.qty);
            //  console.log("Filtered valid activities:", validActivities);

              // Reduce valid activities to get quantity per symbol
              const assetQty = validActivities.reduce((acc, item) => {
                const symbol = item.symbol;
                const qty = parseFloat(item.qty);
                if (symbol && qty) {
                  acc[symbol] = (acc[symbol] || 0) + qty;
                }
                return acc;
              }, {});
              //console.log("📊 Asset Quantities from Firestore: ", assetQty);

              // Fetch Alpaca positions data
              const response = await fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userDocument.data().AlpacaAccountId}/positions`, optionsAlpaca);
              const Alpaca = await response.json();

             // console.log('Total assets:', Alpaca.length);  // Logs the number of assets
              if (Array.isArray(Alpaca) && Alpaca.length > 0) {
                let allMarketData = [];  // Accumulate market data here

                // Loop through each asset in the Alpaca array
                for (let i = 0; i < Alpaca.length; i++) {
                  const AlpacaData = Alpaca[i];
                 // console.log(`AlpacaData [${i}]`, AlpacaData);

                  const symbol = AlpacaData.symbol.split('/')[0].slice(0, 3);  // Get shortened symbol
                //  console.log("shortenedSymbol: ", symbol);

                  // Fetch CoinGecko data for each shortened symbol
                  await fetch(
                    `https://pro-api.coingecko.com/api/v3/search?query=${symbol}`,
                    {
                      method: 'GET',
                      headers: {
                        accept: 'application/json',
                        'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                      },
                    }
                  )
                    .then(async (res) => {
                      const data = await res.json(); // Parsing the JSON response

                      // Ensure that the data contains a valid 'coins' array
                      if (data && data.coins && data.coins.length > 0) {
                        const coinId = data.coins[0].id;
                        //console.log(`Coin ID for ${symbol}:`, coinId);

                        // Fetch market data for the coin
                        const marketDataRes = await fetch(
                          `https://pro-api.coingecko.com/api/v3/coins/${coinId}`,
                          {
                            method: 'GET',
                            headers: {
                              accept: 'application/json',
                              'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                            },
                          }
                        );
                        const marketDataResJson = await marketDataRes.json();

                        const currentPricehere = marketDataResJson.market_data.current_price.usd;
                        const fullSymbol = `${symbol}USD`; 
                        const qty = parseFloat(AlpacaData.qty) || 0;

                        const previousPrice = marketDataResJson.market_data.price_change_percentage_24h 
                          ? currentPricehere / (1 + marketDataResJson.market_data.price_change_percentage_24h / 100) 
                          : currentPricehere;

                        const marketValue = currentPricehere * qty;
                        const marketValueBefore = previousPrice * qty;
                        const priceChangeInDollars = marketValue - marketValueBefore;

                        // Fetch the average entry price from Firestore data
                        const avgEntryPrice = parseFloat(AlpacaData.avg_entry_price);
                        const sinceBroughtInDollars = (currentPricehere - avgEntryPrice) * qty;
                        const sinceBroughtInPercentage = ((currentPricehere - avgEntryPrice) / avgEntryPrice) * 100;

                        const lastDayPrice = parseFloat(AlpacaData.lastday_price || currentPricehere);
                        const dailyChangeInDollars = (currentPricehere - lastDayPrice) * qty;
                        const dailyChangePercentage = ((currentPricehere - lastDayPrice) / lastDayPrice) * 100;

                        // Push market data to the accumulated array
                        allMarketData.push({
                          id: coinId,
                          name: marketDataResJson.name,
                          symbol: marketDataResJson.symbol,
                          market_cap: marketDataResJson.market_data.market_cap.usd,
                          current_price: currentPricehere,
                          price_change_percentage_24h: marketDataResJson.market_data.price_change_percentage_24h,
                          price_change_in_dollars: priceChangeInDollars,
                          image: marketDataResJson.image.large,
                          qty: qty,
                          market_value: marketValue,
                          daily_change_percentage: marketDataResJson.market_data.price_change_percentage_24h,
                          daily_change_in_dollars: dailyChangeInDollars,
                          since_brought_in_dollars: sinceBroughtInDollars,
                          since_brought_in_percentage: sinceBroughtInPercentage
                        });

                      //  console.log("allMarketData: ", allMarketData);
                      }
                    })
                    .catch((error) => {
                      console.error('Error fetching CoinGecko data for', symbol, error);
                    });
                }

                // Once all market data is collected, sort and set the state
                let filteredData = allMarketData;

                if (MetricsState === "Since brought dollar") {
                  filteredData = allMarketData.sort((a, b) => b.since_brought_in_dollars - a.since_brought_in_dollars);
                } else if (MetricsState === "Since brought percentage") {
                  filteredData = allMarketData.sort((a, b) => b.since_brought_in_percentage - a.since_brought_in_percentage);
                } else if (MetricsState === "Daily trend dollar") {
                  filteredData = allMarketData.sort((a, b) => b.daily_change_in_dollars - a.daily_change_in_dollars);
                } else if (MetricsState === "Daily trend percentage") {
                  filteredData = allMarketData.sort((a, b) => b.daily_change_percentage - a.daily_change_percentage);
                }

                // Update the state with the accumulated and filtered data
                setLoaded(false);
                setMyInvestments(filteredData);

                console.log("filteredData ", filteredData);
              }
            });
          }

        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();


  }, [AlpacaUserId, MetricsState]); // Runs when MetricsState changes


  
  
  




const categories = [
  {
    name: 'Choose a topic',
    subcategories: [
      { name: 'Calculation of performance', 
        linkName: "CalculationOfPerformance_Sheet",
       },
      { name: 'Portfolio value decreased',
        linkName: "PortfolioGrowthPerformance_Sheet",
       },
      { name: 'Position is displayed incorrectly or not at all',
        linkName: "PortfolioGrowthPerformance_Sheet",
       },
      { name: 'Difference compared to individual items',
        linkName: "PortfolioGrowthPerformance_Sheet",
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
                <TouchableOpacity key={index} style={{
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
        }} contentContainerStyle={{
          paddingBottom: height(15)
        }}> 

  
          <Text style={{
              fontSize: size(25),
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "900",
              marginTop: height(4),
              marginLeft: width(5),
          }}>

          Exemption order (FSA)
             
          </Text>
  



  
  <Text style={{
    fontSize: size(14),
    marginLeft: width(5),
    marginTop: height(5),
    color: CurrentViewMode.Mode_fontColor,
    lineHeight: height(2.7),
    fontWeight: "bold"
  }}>
An exemption order allows you to exempt income of up to €1,000 per year from tax. 
A fully utilized exemption order saves you up to €250 in capital gains tax, solidarity surcharge, 
and church tax. You can manage your exemption order in your<Text 
  style={{
     fontSize: size(14),
      color: CurrentViewMode.Mode_CashChart_Cash,
  }}>
 tax overview
  </Text>.
  </Text>








<Text style={{
    fontSize: size(14),
    marginLeft: width(5),
    marginTop: height(3),
    fontWeight: "900",
    color: CurrentViewMode.Mode_fontColor,
    lineHeight: height(2.7)
  }}>
Conditions of use:
</Text>


<Text style={{
    fontSize: size(14),
    marginLeft: width(5),
    marginTop: height(2),
    fontWeight: "600",
    color: CurrentViewMode.Mode_fontColor,
    lineHeight: height(2.7)
  }}>
  <Text  style={{
    fontSize: size(14),
    fontWeight: "900",
    color: CurrentViewMode.Mode_fontColor,
    lineHeight: height(2.7)
  }}>• </Text> You can set up an <Text style={{fontWeight: "bold", 
   color: CurrentViewMode.Mode_CashChart_Cash}}>exemption order (FSA)</Text> for the current year in the app at any time. 
    Exemption orders do not apply retroactively to previous years. 
    You can process previous years via a tax return.
</Text>





<Text style={{
    fontSize: size(14),
    marginLeft: width(5),
    marginTop: height(2),
    fontWeight: "600",
    color: CurrentViewMode.Mode_fontColor,
    lineHeight: height(2.7)
  }}>
  <Text  style={{
    fontSize: size(14),
    fontWeight: "900",
    color: CurrentViewMode.Mode_fontColor,
    lineHeight: height(2.7)
  }}>• </Text> If an exemption order is set up during the year, 
  it also applies to taxes already paid for that year. 
  These taxes will be refunded within 1-2 business days. 
  For more information, see <Text style={{fontWeight: "bold", 
   color: CurrentViewMode.Mode_CashChart_Cash}}>Tax Adjustments</Text> and <Text style={{fontWeight: "bold", 
   color: CurrentViewMode.Mode_CashChart_Cash}}>Refunds</Text>.

</Text>



<Text style={{
    fontSize: size(14),
    marginLeft: width(5),
    marginTop: height(2),
    fontWeight: "600",
    color: CurrentViewMode.Mode_fontColor,
    lineHeight: height(2.7)
  }}>
  <Text  style={{
    fontSize: size(14),
    fontWeight: "900",
    color: CurrentViewMode.Mode_fontColor,
    lineHeight: height(2.7)
  }}>• </Text> Withholding tax on foreign dividends is not covered by the exemption order.
</Text>










<Text style={{
    fontSize: size(14),
    marginLeft: width(5),
    marginTop: height(2),
    color: CurrentViewMode.Mode_fontColor,
    lineHeight: height(2.7),
   fontWeight: "700"
  }}>  
Bantico does not currently offer joint exemption orders. 
You will be notified in the app as soon as this feature is available.
We're working on it!
  </Text>






       
  </ScrollView>




  <View style={{
    width: "100%",
    position: 'absolute',
    bottom: height(5),
    flexDirection: 'row',
}}>



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



      <TouchableOpacity onPress={() => {
          
      
      SheetManager.hide("PortfolioGrowthPerformance_Sheet"); // Now hide the sheet after a delay
              
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

        </View> 
        
  
      </ActionSheet>
  
     
     
      );
    };
    






