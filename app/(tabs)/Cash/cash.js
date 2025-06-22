import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';
import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, FlatList, SectionList, TouchableOpacity, ScrollView, Image } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import BarChartScreen from "../BarChartScreen";
import { FontAwesome5 } from 'react-native-vector-icons'; // Importing FontAwesome icons
import { height, width, size, fontSize } from 'react-native-responsive-sizes';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../../Languages_Translation_Screens/i18n';
import { Link } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';
import SkeletonLoading from 'expo-skeleton-loading'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrasnactionReceipeContext } from '@/app/Context/TrasnactionReceipeContext';
import { ViewModeContext } from '@/app/Context/ViewModeContext';

import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";
import { HomeChartContext } from '@/app/Context/HomeChartContext';
import { SearchContext } from '@/app/Context/MainSearchIndexStateContext';
import { usePostHog } from 'posthog-react-native';




const HEADER_HEIGHT = 300; // The height of the header







export const TransactionSheetPage = () => {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance

	const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  


    const { t } = useTranslation();

    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    const {
      ShowHomeChart, setShowHomeChart,
      MetricsState, setMetricsState,
    } = useContext(HomeChartContext)
  
  


    const database = getDatabase();

  
 
    const [UserLang, setUserLang] = useState()
    const [Depot_number, setDepot_number] = useState("")

    
    const [Sum, setSum] = useState()

    const [equity, setEquity] = useState(null);
    const [error, setError] = useState(null);
    const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)
    const [AlpacaUserId, setAlpacaUserId] = useState();

    const [UserFirstName, setUserFirstName] = useState("")
    const [UserLastName, setUserLastName] = useState("")
  


  const Transaction_Sheet = useRef(null);

  const [Filter, setFilter] = useState("")
  const [data, setData] = useState([]); // Store transaction data

  const [groupedActivities, setGroupedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [UserFirstname, setUserFirstname] = useState("")
  const [UserLastname, setUserLastname] = useState("")
  const {CurrentChoosedAsset, setCurrentChoosedAsset} = useContext(TrasnactionReceipeContext)
  


  





  useEffect(() => {
    posthog.capture('screen_viewed', {
      screen: 'Transaction_Sheet',
      $screen_name: 'Transaction_Sheet',
      timestamp: new Date().toISOString(),
    });
  }, []);
  





const SkeletonPlaceholder = () => {
  return (
    <View>
      {/* Show 3 Skeleton Items */}
      {Array.from({ length: 10 }).map((_, index) => (
        <SkeletonLoading key={index} background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
          <View style={{ flexDirection: "row", top: height(8), marginBottom: height(4) }}>
            {/* Left Skeleton Box */}
            <View
              style={{
                backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
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
                backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
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














const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
  }
};

/*
useEffect(() => {
  // Ensure user.uid is available before making the request
  if (!user?.uid) {
    console.log("No user UID available.");
    return;
  }

  console.log("here ", user.uid);

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

        // Fetch data from Alpaca API
        const response = await fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userData.AlpacaAccountId}/account`, options);
        const responseData = await response.json();
        setDepot_number(responseData?.account_number);
        
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, [user?.uid]); // Make sure the effect runs whenever user.uid changes

*/













  const API_URL =
  `https://broker-api.sandbox.alpaca.markets/v1/accounts/activities?account_id=${AlpacaUserId}&page_size=100`;

  




  // Manually translate the months
  const months = [
    t("Jan"), t("Feb"), t("Mar"), t("Apr"), t("May"), t("Jun"),
    t("Jul"), t("Aug"), t("Sep"), t("Oct"), t("Nov"), t("Dec")
  ];


  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed (Jan = 0, Dec = 11)
  const currentMonthName = months[currentMonth]; // Convert index to month name

  // Function to get the correct headers (This Month / Month Year)
  const getMonthHeader = (dateString) => {
    const date = new Date(dateString);
    const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;

    const currentMonthYear = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    return monthYear === currentMonthYear ? t('ThisMonth') : monthYear;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) {
      console.warn('Invalid date string:', dateStr); 
      return '';
    }

    let date;

    // If the date is in the format "transaction_time"
    if (dateStr.includes("T")) {
      date = new Date(dateStr);  // Parse the ISO string (e.g., "2025-02-20T08:12:53.753762Z")
    } else {
      // If the date is just a date string "2025-02-24"
      date = new Date(dateStr + 'T00:00:00');  // Append time to make it valid for Date parsing
    }

    // Use the manually translated month names
    const month = months[date.getMonth()]; // Use the translated month from the array
    const day = date.getDate();

    return `${month}. ${day}`;  // Format as "Feb. 12" or "Dec. 2"
  };





const handleFilterChange = (filter) => {
  setFilter(filter);  // Update the filter
};





useEffect(() => {
  if (!user?.uid) {
    console.log("No user UID available.");
    return;
  }

  const fetchUserData = async () => {
    try {
      // Fetch user data from Firestore
      const userDocument = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();

      if (userDocument.exists) {
        // Fetch user data from Firestore and set it to the state
        const userData = userDocument.data();
        setAlpacaUserId(userData?.AlpacaAccountId);
        setUserFirstName(userData?.newAccountPayload?.identity?.given_name);
        setUserLastName(userData?.newAccountPayload?.identity?.family_name);

        // Fetch transaction activities from Firestore
        await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('Transaction_Activities')
          .orderBy('updatedAt', 'asc')
          .get()
          .then(async (snapshot) => {
            const activities = snapshot.docs.map(doc => doc.data());

            if (!Array.isArray(activities) || activities.length === 0) {
              console.warn("No recent activities found.");
              return;
            }

            console.log("Activities fetched:", activities);

            // Sort the activities by 'savedAt' or 'transaction_time'
            const sortedActivities = activities.sort((a, b) => {
              const dateA = a.savedAt || a.transaction_time;
              const dateB = b.savedAt || b.transaction_time;
              return new Date(dateA) - new Date(dateB);  // Ascending order
            });

            console.log("Sorted activities:", sortedActivities);

            // Apply the filter and group the activities
            const groupedData = {};
            const promises = sortedActivities.map(async (activity) => {
              console.log('Filtering activity: ', activity);

              // Apply the filter based on selected activity type
              if (
                (Filter === t("DepositsHeaderInCashComponent") && activity.activity_type !== "CSD") ||
                (Filter === t("WithdrawsHeaderInCashComponent") && activity.activity_type !== "CSW") ||
                (Filter === t("InvestmentHeaderInCashComponent") && activity.activity_type !== "FILL")
              ) {
                console.log('Filtered out activity: ', activity);
                return; // Skip if the activity doesn't match the filter
              }

              console.log('Activity passes the filter: ', activity);

              // Apply other logic (e.g., filtering for 'Buy' or 'Sell' in 'Investments')
              if (activity.activity_type === "FILL" && activity.side) {
                if (Filter === "Buy" && activity.side !== "buy") return;
                if (Filter === "Sell" && activity.side !== "sell") return;
              }

              const header = getMonthHeader(activity.date || activity.transaction_time);
              if (!groupedData[header]) {
                groupedData[header] = [];
              }

              // Add CoinGecko data based on the symbol if needed
              if (activity.symbol) {
                const isCrypto = activity.symbol.includes('/');
                const baseSymbol = isCrypto
                  ? activity.symbol.split('/')[0].toUpperCase()
                  : activity.symbol.toUpperCase();

                try {
                  if (isCrypto) {
                    const searchRes = await fetch(
                      `https://pro-api.coingecko.com/api/v3/search?query=${baseSymbol}`,
                      {
                        method: 'GET',
                        headers: {
                          accept: 'application/json',
                          'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                        },
                      }
                    );
                    const searchData = await searchRes.json();

                    if (searchData?.coins?.length > 0) {
                      const coin = searchData.coins[0];
                      activity.coinName = coin.name || 'Unknown';
                      activity.logo = coin.large || '';

                      const coinDetailRes = await fetch(
                        `https://pro-api.coingecko.com/api/v3/coins/${coin.id}`,
                        {
                          method: 'GET',
                          headers: {
                            accept: 'application/json',
                            'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                          },
                        }
                      );
                      const coinDetail = await coinDetailRes.json();

                      if (coinDetail) {
                        activity.current_price = coinDetail.market_data.current_price.usd || 0;
                        activity.market_cap = coinDetail.market_data.market_cap.usd || 0;
                      }
                    }

                    activity.type = 'crypto'; // ✅ Set type to crypto
                  } else {
                    activity.coinName = baseSymbol;
                    activity.logo = `https://assets.parqet.com/logos/symbol/${baseSymbol}?format=png&size=100`;
                    activity.type = 'stock'; // ✅ Set type to stock
                  }
                } catch (err) {
                  console.error("Error fetching CoinGecko data:", err);
                }
              }

              groupedData[header].push(activity);
            });

            // Wait for all promises to resolve (fetch CoinGecko data)
            const filteredPromises = await Promise.all(promises);
            const filteredData = filteredPromises.filter((item) => item !== null);

            // Format the grouped data into an array
            const formattedData = [];
            Object.keys(groupedData).forEach((month) => {
              groupedData[month].forEach((item) =>
                formattedData.push({ type: "item", ...item })
              );
            });

            // Reverse the data so the latest transactions are at the top
            const reversedData = [...formattedData].reverse();

            const groupedResult = groupByMonth(reversedData, t);
         
            // Update the grouped activities state
            setGroupedActivities(groupedResult);
          });
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, [user?.uid, Filter]);









  




const getFirstLetter = (str) => {
  console.log("🔤 Input to getFirstLetter:", str);
  
  if (typeof str === 'string' && str.trim().length > 0) {
    return str.trim().charAt(0).toUpperCase();  // Return first uppercase letter
  }

  return '';  // If input is empty, null, or not a string
};



    
const firstInitial = getFirstLetter(UserFirstName);
console.log("✅ First initial:", firstInitial);





  const formatMoneyMyInvestment = useCallback((price) => {
    return new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }, []);
  
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  







  const groupByMonth = (orders, t) => {
    const grouped = {};
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();
  
    orders.forEach((item) => {
      const rawDate = item.transaction_time || item.date;
      const date = rawDate ? new Date(rawDate) : null;
  
      if (!date || isNaN(date)) return; // Skip invalid dates
  
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
  
      const monthNames = {
        0: t('January'),
        1: t('February'),
        2: t('March'),
        3: t('April'),
        4: t('May'),
        5: t('June'),
        6: t('July'),
        7: t('August'),
        8: t('September'),
        9: t('October'),
        10: t('November'),
        11: t('December'),
      };
  
      let key = `${monthNames[monthIndex]} ${year}`;
      if (monthIndex === thisMonth && year === thisYear) {
        key = t('This month');
      }
  
      if (!grouped[key]) {
        grouped[key] = { title: key, data: [] };
      }
  
      grouped[key].data.push(item);
    });
  
    return Object.values(grouped).flatMap((group) => [
      { type: 'header', title: group.title },
      ...group.data.map((item) => ({ type: 'item', ...item }))
    ]);
  };
  
  
  const renderItem = ({ item }) => {
    const date = new Date(item.transaction_time);
    const formattedDate = date.toLocaleString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  
    if (item.activity_type === "FEE") return null;
  
    if (item.type === 'header') {
      return (
        <View style={{ marginTop: height(5), marginBottom: height(2), marginLeft: width(5) }}>
          <Text style={{
            fontSize: size(15),
            fontWeight: "bold",
            color: CurrentViewMode.Mode_Sec_fontColor
          }}>
            {item.title}
          </Text>
        </View>
      );
    }
  
    // The rest of your renderItem follows here...
    
  
    return (
      <TouchableOpacity onPress={() => {
        if(item.activity_type === "CSW") {

          posthog.capture('open_transaction_recepie_widthraw_bottomsheet', {
            screen: 'Transaction_Sheet',
            $screen_name: 'Transaction_Sheet',
            timestamp: new Date().toISOString(),
          
            });
            
          setCurrentChoosedAsset(item);
          SheetManager.show("TransactionRecepieWidthraw_Sheet", {
            payload: { selectedItem: item },
          });
        }
  
        if(item.activity_type === "CSD") {

          posthog.capture('open_transaction_recepie_deposit_bottomsheet', {
            screen: 'Transaction_Sheet',
            $screen_name: 'Transaction_Sheet',
            timestamp: new Date().toISOString(),
          
            });

          setCurrentChoosedAsset(item);
          SheetManager.show("TransactionRecepieDeposit_Sheet", {
            payload: { selectedItem: item },
          });
        }
  
        if(item.side === "sell") {

          posthog.capture('open_transaction_sold_assets_bottomsheet', {
            screen: 'Transaction_Sheet',
            $screen_name: 'Transaction_Sheet',
            timestamp: new Date().toISOString(),
          
            });

          setCurrentChoosedAsset(item);
          SheetManager.show("TransactionRecepieSoldAssets_Sheet", {
            payload: { selectedItem: item },
          });
        }
  
        if(item.side === "buy") {


          posthog.capture('open_transaction_brought_assets_bottomsheet', {
            screen: 'Transaction_Sheet',
            $screen_name: 'Transaction_Sheet',
            timestamp: new Date().toISOString(),
          
            });


          setCurrentChoosedAsset(item);
          SheetManager.show("TransactionRecepieBroughtAssets_Sheet", {
            payload: { selectedItem: item },
          });
        }
      }}
      style={{
        width: "90%",
        alignSelf: 'center',
        marginTop: height(4),
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <View>
          {item.logo == null ? (
            <View style={{
              height: 30,
              width: 30,
              borderRadius: 30/2,
              marginRight: width(2),
              justifyContent: 'center',
            }}>
              {item.activity_type === "CSW" ? (
                <View style={{
                  height: 35,
                  marginRight: width(2),
                  width: 35,
                  borderRadius: 35/2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <MaterialCommunityIcons name='bank-transfer-out'
                    style={{
                      color: '#691AF5',
                      fontSize: size(25)
                    }} />
                </View>
              ) : (
                <View style={{
                  height: size(30),
                  width: size(30),
                  borderRadius: size(30)/2,
                  marginRight: width(2),
                  backgroundColor: CurrentViewMode.Main_IconButtonBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: CurrentViewMode.Main_IconButtonText,
                    fontSize: size(15),
                    fontWeight: "bold"
                  }}>
                    {getFirstLetter(UserFirstName)}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={{
              height: size(30),
              width: size(30),
              borderRadius: size(30)/2,
              marginRight: width(2),
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <Image
                source={{ uri: item.logo }}
                style={{ height: "100%", width: "100%" }}
              />
            </View>
          )}
        </View>
  
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ marginLeft: width(5) }}>
            <Text style={{
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: 'bold',
              fontSize: size(16),
            }}>
              {item.activity_type === "CSW" ? t("WithdrawHeader") : null}
              {item.activity_type === "CSD" ? t("DepositHeader") : null}
              {item.coinName !== null ? item.coinName : null}
            </Text>
  
            <Text style={{
              color: CurrentViewMode.Mode_Sec_fontColor,
              fontSize: size(12),
              marginTop: height(1),
            }}>
              {item.date == null ? formatDate(item.transaction_time) : formatDate(item.date)} • 
              {item.activity_type === "CSW" ? ` ${t("DoneHeader")}` : null}
              {item.activity_type === "CSD" ? ` ${t("AddedHeader")}` : null}
              {item.side === "sell" ? ` ${t("SoldHeader")}` : null}
              {item.side === "buy" ? ` ${t("BroughtHeader")}` : null}
            </Text>
          </View>
        </View>
  
        <Text style={{
          color: CurrentViewMode.Mode_fontColor,
          fontSize: size(16),
          fontWeight: 'bold',
          position: 'absolute',
          right: width(0)
        }}>
          {item.activity_type === "CSW" ? `${formatMoneyMyInvestment(item.net_amount)}` : null}
          {item.activity_type === "CSD" ? `+${formatMoneyMyInvestment(item.net_amount)}` : null}
          {item.side === "sell" ? `+${parseFloat(item.qty).toFixed(6)}` : null}
          {item.side === "buy" ? `-${parseFloat(item.qty).toFixed(6)}` : null}
        </Text>
      </TouchableOpacity>
    );
  };
  
  

















  

  const renderHeader = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' }); // Get current month
    const currentYear = currentDate.getFullYear(); // Get current year
  
    // Check if the first transaction has a valid date
    const firstTransaction = data[0]; // Assuming data is an array of transactions
  
    if (firstTransaction) {
      const formattedDate = formatTransactionDate(firstTransaction.date);
      
      // Try to parse the date of the first transaction, ensure it's in a format we can use
      const transactionDate = new Date(formattedDate); // Now using the formatted date string
      
      // Check if transactionDate is valid
      if (transactionDate.toString() === 'Invalid Date') {
        console.error('Invalid date format:', firstTransaction.date);
        return <Text style={styles.header}>Invalid Date Format</Text>; // Return an error message if the date is invalid
      }
  
      const transactionMonth = transactionDate.toLocaleString('default', { month: 'long' });
      const transactionYear = transactionDate.getFullYear();
  
      // Check if the transaction's month and year match the current month and year
      const isCurrentMonth = currentMonth === transactionMonth && currentYear === transactionYear;
  
      // Return appropriate header based on whether it's the current month or not
      return (
        <Text style={{
          color: '#fff',
          marginTop: height(5),
          marginBottom: height(4),
          marginLeft: width(5),
          fontSize: size(20),
          fontWeight: "bold"

        }}>
          {isCurrentMonth ? 'This Month' : `${transactionMonth} ${transactionYear}`}
        </Text>
      );
    }
  
    return null; // Fallback if no transactions are available
  };
  
  // Helper function to convert "20.Feb" to a valid date format
  const formatTransactionDate = (dateStr) => {
    const [day, month] = dateStr.split('.');
    const months = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };
    
    const monthNumber = months[month]; // Convert month to number
    return `${new Date().getFullYear()}-${monthNumber}-${day.padStart(2, '0')}`; // Format date to YYYY-MM-DD
  };
  

  
  

  return (
    <ActionSheet
      ref={Transaction_Sheet}
      isModal={false}
      gestureEnabled={true}
       backgroundInteractionEnabled={false}     
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
        height: size(40), // Height of the header
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
          maxHeight: height(92),
          backgroundColor: CurrentViewMode.Mode_bg,
          height: height(92),
           borderTopLeftRadius: 20,
           borderTopRightRadius: 20,
           
         }} 	
         style={{
           height: "100%",
           backgroundColor:CurrentViewMode.Mode_bg,
       }}>
       


     



      <ScrollView style={{ 
        height: "100%",
        width: '100%',
        backgroundColor: CurrentViewMode.Mode_bg,
        zIndex: 5,
      }} 
      contentContainerStyle={{
        paddingBottom: height(5)
      }}>



      <Text style={{
          fontSize: size(28),
          fontWeight: "bold",
          marginBottom: height(3),
          marginTop: height(2),
          color: CurrentViewMode.Mode_fontColor,
          marginLeft: width(5),
        }}>
         {t("TransactionsHeaderInCashComponent")}     
        </Text>

      <ScrollView horizontal={true}  
      showsHorizontalScrollIndicator={false}
      style={{
        width: "100%",
        height: height(4.5),
      
      }} contentContainerStyle={{
        paddingLeft: width(5),
      }}>






{
  CurrentViewMode.Mode_Name == "The White Theme"

  ?



<>


{
  Filter == "" 

  ?

  null

  :

<TouchableOpacity onPress={() => {

posthog.capture('open_transaction_no_filter_bottomsheet', {
  screen: 'Transaction_Sheet',
  $screen_name: 'Transaction_Sheet',
  timestamp: new Date().toISOString(),

  });


  handleFilterChange("")
}}
style={{
  paddingVertical: size(5),
  paddingHorizontal: 15,
 // position: 'absolute',
  backgroundColor:  CurrentViewMode.Mode_Secbg_Buttons_Cash,
  alignItems: 'center',
  justifyContent: 'center',
  //marginRight: width(3),
  borderRadius: 15,
}}>
 
 <MaterialIcons name='close' style={{
  color: CurrentViewMode.Mode_fontColor,
  fontSize: size(20),
 }} />
</TouchableOpacity>

}





<TouchableOpacity onPress={() => {

          
posthog.capture('open_transaction_investment_filter_bottomsheet', {
  screen: 'Transaction_Sheet',
  $screen_name: 'Transaction_Sheet',
  timestamp: new Date().toISOString(),

  });
  handleFilterChange(t("InvestmentHeaderInCashComponent"))

}}
style={{
  paddingVertical: size(5),
  paddingHorizontal: 20,
  backgroundColor: Filter == t("InvestmentHeaderInCashComponent") ? CurrentViewMode.Mode_fontColor :  CurrentViewMode.Mode_Secbg_Buttons_Cash,
  marginRight: width(3),
  marginLeft: width(3),
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 15,
}}>
  <Text style={{
    fontWeight: "bold",
    fontSize: size(14),
    color: Filter == t("InvestmentHeaderInCashComponent") ? CurrentViewMode.Mode_bg_Home : CurrentViewMode.Mode_fontColor,
  }}>
    {t("InvestmentHeaderInCashComponent")}  
  </Text>
</TouchableOpacity>



<TouchableOpacity onPress={() => {

posthog.capture('open_transaction_deposits_filter_bottomsheet', {
  screen: 'Transaction_Sheet',
  $screen_name: 'Transaction_Sheet',
  timestamp: new Date().toISOString(),

  });

  handleFilterChange(t("DepositsHeaderInCashComponent"))
}}
style={{
  paddingVertical: size(5),
  paddingHorizontal: 20,
  backgroundColor: Filter == t("DepositsHeaderInCashComponent") ? CurrentViewMode.Mode_fontColor :  CurrentViewMode.Mode_Secbg_Buttons_Cash,
  marginRight: width(3),
  borderRadius: 15,
  alignItems: 'center',
  justifyContent: 'center',
}}>
  <Text style={{
    fontWeight: "bold",
    fontSize: size(14),
    color: Filter == t("DepositsHeaderInCashComponent") ? CurrentViewMode.Mode_bg_Home : CurrentViewMode.Mode_fontColor,
  }}>
    {t("DepositsHeaderInCashComponent")}   
  </Text>
</TouchableOpacity>




<TouchableOpacity onPress={() => {

posthog.capture('open_transaction_withdraws_filter_bottomsheet', {
  screen: 'Transaction_Sheet',
  $screen_name: 'Transaction_Sheet',
  timestamp: new Date().toISOString(),

  });

  handleFilterChange(t("WithdrawsHeaderInCashComponent"))
}}
style={{
  paddingVertical: size(5),
  paddingHorizontal: 20,
  backgroundColor: Filter == t("WithdrawsHeaderInCashComponent") ? CurrentViewMode.Mode_fontColor :  CurrentViewMode.Mode_Secbg_Buttons_Cash,
  marginRight: width(2),
  borderRadius: 15,
  alignItems: 'center',
  justifyContent: 'center',
}}>
  <Text style={{
    fontWeight: "bold",
     fontSize: size(14),
    color: Filter == t("WithdrawsHeaderInCashComponent") ?  CurrentViewMode.Mode_bg_Home : CurrentViewMode.Mode_fontColor,
  }}>
     {t("WithdrawsHeaderInCashComponent")}   
  </Text>
</TouchableOpacity>
</>
  :



  <>


{
  Filter == "" 

  ?

  null

  :

<TouchableOpacity onPress={() => {


posthog.capture('open_transaction_no_filter_bottomsheet', {
  screen: 'Transaction_Sheet',
  $screen_name: 'Transaction_Sheet',
  timestamp: new Date().toISOString(),

  });


  handleFilterChange("")
}}
style={{
  paddingVertical: size(5),
  paddingHorizontal: 15,
 // position: 'absolute',
  backgroundColor:  CurrentViewMode.Mode_Secbg_Buttons_Cash,
  alignItems: 'center',
  justifyContent: 'center',
  //marginRight: width(3),
  borderRadius: 15,
}}>
 
 <MaterialIcons name='close' style={{
  color: '#fff',
  fontSize: size(20),
 }} />
</TouchableOpacity>

}



<TouchableOpacity onPress={() => {
        
posthog.capture('open_transaction_investment_filter_bottomsheet', {
  screen: 'Transaction_Sheet',
  $screen_name: 'Transaction_Sheet',
  timestamp: new Date().toISOString(),

  });

  handleFilterChange(t("InvestmentHeaderInCashComponent"))
}}
style={{
  paddingVertical: size(5),
  paddingHorizontal: 20,
  backgroundColor: Filter == t("InvestmentHeaderInCashComponent") ? "#fff" :  CurrentViewMode.Mode_Secbg_Buttons_Cash,
  marginRight: width(3),
  marginLeft: width(3),
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 15,
}}>
  <Text style={{
    fontWeight: "bold",
    fontSize: size(14),
    color: Filter == t("InvestmentHeaderInCashComponent") ? CurrentViewMode.Main_bg : '#fff',
  }}>
   {t("InvestmentHeaderInCashComponent")}  
  </Text>
</TouchableOpacity>



<TouchableOpacity onPress={() => {
         
posthog.capture('open_transaction_deposits_filter_bottomsheet', {
  screen: 'Transaction_Sheet',
  $screen_name: 'Transaction_Sheet',
  timestamp: new Date().toISOString(),

  });

  handleFilterChange(t("DepositsHeaderInCashComponent"))
}}
style={{
  paddingVertical: size(5),
  paddingHorizontal: 20,
  backgroundColor: Filter == t("DepositsHeaderInCashComponent") ? "#fff" :  CurrentViewMode.Mode_Secbg_Buttons_Cash,
  marginRight: width(3),
  borderRadius: 15,
  alignItems: 'center',
  justifyContent: 'center',
}}>
  <Text style={{
    fontWeight: "bold",
    fontSize: size(14),
    color: Filter == t("DepositsHeaderInCashComponent") ? CurrentViewMode.Main_bg : '#fff',
  }}>
   {t("DepositsHeaderInCashComponent")}   
  </Text>
</TouchableOpacity>




<TouchableOpacity onPress={() => {

posthog.capture('open_transaction_withdraws_filter_bottomsheet', {
  screen: 'Transaction_Sheet',
  $screen_name: 'Transaction_Sheet',
  timestamp: new Date().toISOString(),

  });

  handleFilterChange(t("WithdrawsHeaderInCashComponent"))
}}
style={{
  paddingVertical: size(5),
  paddingHorizontal: 20,
  backgroundColor: Filter == t("WithdrawsHeaderInCashComponent") ? "#fff" :  CurrentViewMode.Mode_Secbg_Buttons_Cash,
  marginRight: width(2),
  borderRadius: 15,
  alignItems: 'center',
  justifyContent: 'center',
}}>
  <Text style={{
    fontWeight: "bold",
     fontSize: size(14),
    color: Filter == t("WithdrawsHeaderInCashComponent") ? CurrentViewMode.Main_bg : '#fff',
  }}>
   {t("WithdrawsHeaderInCashComponent")}   
  </Text>
</TouchableOpacity>

</>

}



      </ScrollView>


 {isLoading && !hasFetched ? (

  <SkeletonPlaceholder/>

) : (
  <>
    {renderHeader()}
        <FlatList 
          data={groupedActivities}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: height(3) }}
          ListEmptyComponent={
            <View style={{ marginTop: height(10), alignItems: 'center' }}>
              <Text style={{ color: CurrentViewMode.Mode_Sec_fontColor, fontSize: 16 }}>
              No transactions made.
              </Text>
            </View>
          }
        />
  </>

)}

    
      </ScrollView>
    </ActionSheet>
  );
};


























const AnimatedHeader = ({ animatedValue }) => {

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);



  const headerTranslateY = animatedValue.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT], // Move the header off-screen as you scroll
    extrapolate: 'clamp',
  });

  const headerOpacity = animatedValue.interpolate({
    inputRange: [0, 700 / 2],
    outputRange: [1, 0], // Fade the header out as you scroll
    extrapolate: 'clamp',
  });

  return (


    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        marginTop: height(2),
        zIndex: 100,
        height: HEADER_HEIGHT,
        backgroundColor: CurrentViewMode.Mode_bg,
        transform: [{ translateY: headerTranslateY }],
        opacity: headerOpacity,
      }}
    >
      <BarChartScreen />



    </Animated.View>
  );
};















const Cash = () => {


    
  const posthog = usePostHog(); // ✅ this gives you access to the actual instance

	const user = getAuth().currentUser;
  


  const {
    ShowHomeChart, setShowHomeChart,
    MetricsState, setMetricsState,
  } = useContext(HomeChartContext)

  const { t } = useTranslation();

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);
  const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);



  const database = getDatabase();

  const [AlpacaUserId, setAlpacaUserId] = useState();


  const [UserLang, setUserLang] = useState()
  const [Depot_number, setDepot_number] = useState("")

  
  const [Sum, setSum] = useState()

  const [equity, setEquity] = useState(null);
  const [error, setError] = useState(null);
  const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")




  const [Filter, setFilter] = useState("")
  const [data, setData] = useState([]); // Store transaction data

  const [groupedActivities, setGroupedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [UserFirstname, setUserFirstname] = useState("")
  const [UserLastname, setUserLastname] = useState("")

  const {CurrentChoosedAsset, setCurrentChoosedAsset} = useContext(TrasnactionReceipeContext)
  




  



  

  useEffect(() => {
    posthog.capture('screen_viewed', {
      screen: 'Cash',
      $screen_name: 'Cash',
      timestamp: new Date().toISOString(),
    });
  }, []);
  
  







  // Manually translate the months
  const months = [
    t("Jan"), t("Feb"), t("Mar"), t("Apr"), t("May"), t("Jun"),
    t("Jul"), t("Aug"), t("Sep"), t("Oct"), t("Nov"), t("Dec")
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed (Jan = 0, Dec = 11)
  const currentMonthName = months[currentMonth]; // Convert index to month name

  // Function to get the correct headers (This Month / Month Year)
  const getMonthHeader = (dateString) => {
    const date = new Date(dateString);
    const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;

    const currentMonthYear = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    return monthYear === currentMonthYear ? t('ThisMonth') : monthYear;
  };

 
  const formatDate = (dateStr) => {
    if (!dateStr) {
      console.warn('Invalid date string:', dateStr); 
      return '';
    }

    let date;

    // If the date is in the format "transaction_time"
    if (dateStr.includes("T")) {
      date = new Date(dateStr);  // Parse the ISO string (e.g., "2025-02-20T08:12:53.753762Z")
    } else {
      // If the date is just a date string "2025-02-24"
      date = new Date(dateStr + 'T00:00:00');  // Append time to make it valid for Date parsing
    }

    // Use the manually translated month names
    const month = months[date.getMonth()]; // Use the translated month from the array
    const day = date.getDate();

    return `${month}. ${day}`;  // Format as "Feb. 12" or "Dec. 2"
  };
  
  


const SkeletonPlaceholder = () => {
  return (
    <View>
      {/* Show 3 Skeleton Items */}
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonLoading key={index} background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
          <View style={{ flexDirection: "row", top: height(3), marginBottom: height(4) }}>
            {/* Left Skeleton Box */}
            <View
              style={{
                backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
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
                backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
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












const handleFilterChange = (filter) => {
  setFilter(filter);  // Update the filter
};

  const router = useRouter();


  const offset = useRef(new Animated.Value(0)).current;


  
    

  const getFirstLetter = (str) => {
    console.log("🔤 Input to getFirstLetter:", str);
    
    if (typeof str === 'string' && str.trim().length > 0) {
      return str.trim().charAt(0).toUpperCase();  // Return first uppercase letter
    }
  
    return '';  // If input is empty, null, or not a string
  };
  
  
  
      
const firstInitial = getFirstLetter(UserFirstName);
console.log("✅ First initial:", firstInitial);

  



  
  
  const formatMoneyMyInvestment = useCallback((price) => {
    return new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }, []);
  
  
  

    
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
    }
  };





  useEffect(() => {
  if (!user?.uid) {
    console.log("No user UID available.");
    return;
  }

  console.log("here ", user.uid);

  const fetchUserData = async () => {
    try {
      const userDocument = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();

      if (userDocument.exists) {
        const userData = userDocument.data();
        setAlpacaUserId(userData?.AlpacaAccountId);
        setUserFirstName(userData?.newAccountPayload?.identity?.given_name);
        setUserLastName(userData?.newAccountPayload?.identity?.family_name);

        await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('Transaction_Activities')
          .limitToLast(5)
          .orderBy('updatedAt', 'asc')
          .onSnapshot(async (snapshot) => {
            let activities = snapshot.docs.map(doc => doc.data());

            // ✅ Correctly skip partial_fill buy transactions BEFORE processing
            activities = activities.filter(
              (a) => !(a.activity_type === "FILL" && a.type === "partial_fill" && a.side === "buy")
            );

            if (!Array.isArray(activities) || activities.length === 0) {
              console.warn("📭 No recent activities found.");
              return;
            }

            console.log("📥 Activities fetched from Firestore:", activities);

            const sortedActivities = activities.sort((a, b) => {
              const dateA = a.savedAt || a.transaction_time;
              const dateB = b.savedAt || b.transaction_time;
              return new Date(dateA) - new Date(dateB);
            });

            console.log("📥 Sorted activities:", sortedActivities);

            const groupedData = {};

            const promises = sortedActivities.map(async (activity) => {
              if (Filter === "Deposits" && activity.activity_type !== "CSD") return null;
              if (Filter === "Withdraws" && activity.activity_type !== "CSW") return null;
              if (Filter === "Investments" && activity.activity_type !== "FILL") return null;

              if (activity.activity_type === "FILL" && activity.side) {
                if (Filter === "Buy" && activity.side !== "buy") return null;
                if (Filter === "Sell" && activity.side !== "sell") return null;
              }

              const header = getMonthHeader(activity.date || activity.transaction_time);
              if (!groupedData[header]) {
                groupedData[header] = [];
              }

              if (activity.symbol) {
                const isCrypto = activity.symbol.includes('/');
                const baseSymbol = isCrypto
                  ? activity.symbol.split('/')[0].toUpperCase()
                  : activity.symbol.toUpperCase();

                try {
                  if (isCrypto) {
                    const searchRes = await fetch(
                      `https://pro-api.coingecko.com/api/v3/search?query=${baseSymbol}`,
                      {
                        method: 'GET',
                        headers: {
                          accept: 'application/json',
                          'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                        },
                      }
                    );
                    const searchData = await searchRes.json();

                    if (searchData?.coins?.length > 0) {
                      const coin = searchData.coins[0];
                      activity.coinName = coin.name || 'Unknown';
                      activity.logo = coin.large || '';

                      const coinDetailRes = await fetch(
                        `https://pro-api.coingecko.com/api/v3/coins/${coin.id}`,
                        {
                          method: 'GET',
                          headers: {
                            accept: 'application/json',
                            'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                          },
                        }
                      );
                      const coinDetail = await coinDetailRes.json();

                      if (coinDetail) {
                        activity.current_price = coinDetail.market_data.current_price.usd || 0;
                        activity.market_cap = coinDetail.market_data.market_cap.usd || 0;
                      }
                    }

                    activity.type = 'crypto';
                  } else {
                    activity.coinName = baseSymbol;
                    activity.logo = `https://assets.parqet.com/logos/symbol/${baseSymbol}?format=png&size=100`;
                    activity.type = 'stock';
                  }
                } catch (err) {
                  console.error("Error fetching CoinGecko data:", err);
                }
              }

              groupedData[header].push(activity);
            });

            const filteredPromises = await Promise.all(promises);
            const filteredData = filteredPromises.filter((item) => item !== null);

            const formattedData = [];
            Object.keys(groupedData).forEach((month) => {
              groupedData[month].forEach((item) =>
                formattedData.push({ type: "item", ...item })
              );
            });

            const reversedData = [...formattedData].reverse();
            setGroupedActivities(reversedData);
          });

        const response = await fetch(
          `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account`,
          options
        );
        const responseData = await response.json();
        setDepot_number(responseData.account_number);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, [AlpacaUserId, user]);

  



    
   /*
    useEffect(() => {
      const fetchActivities = async () => {
        setIsLoading(true);  // Start loading
    
        try {
          const response = await fetch(API_URL, options);
          if (!response.ok) {
            console.error("API Error:", await response.text());
            setIsLoading(false); // End loading on error
            return;
          }
    
          const data = await response.json();
          console.log("Fetched Activities:", data);
    
          // Grouping Activities
          const groupedData = {};
    
          const promises = data.map(async (activity) => {
            // Apply filter based on activity type
            if (Filter === "Deposits" && activity.activity_type !== "CSD") return null;
            if (Filter === "Withdraws" && activity.activity_type !== "CSW") return null;
            if (Filter === "Investments" && activity.activity_type !== "FILL") return null;
    
            if (activity.activity_type === "FILL" && activity.side) {
              if (Filter === "Buy" && activity.side !== "buy") return null;
              if (Filter === "Sell" && activity.side !== "sell") return null;
            }
    
            const header = getMonthHeader(activity.date || activity.transaction_time);
            if (!groupedData[header]) {
              groupedData[header] = [];
            }
    
            // Adding CoinGecko data based on symbol
            if (activity.symbol) {
              const symbol = activity.symbol.split('/')[0].toUpperCase(); // For example: BTC/USD -> BTC
              try {
                const searchRes = await fetch(
                  `https://pro-api.coingecko.com/api/v3/search?query=${symbol}`,
                  {
                    method: 'GET',
                    headers: {
                      accept: 'application/json',
                      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                    },
                  }
                );
                const searchData = await searchRes.json();
    
                if (searchData && searchData.coins && searchData.coins.length > 0) {
                  const coin = searchData.coins[0]; // Get first coin result
    
                  // Add the CoinGecko details to the activity
                  activity.coinName = coin.name || 'Unknown';
                  activity.logo = coin.large || ''; // Image URL from CoinGecko
    
                  // Fetch additional coin details such as current price
                  const coinDetailRes = await fetch(
                    `https://pro-api.coingecko.com/api/v3/coins/${coin.id}`,
                    {
                      method: 'GET',
                      headers: {
                        accept: 'application/json',
                        'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
                      },
                    }
                  );
                  const coinDetail = await coinDetailRes.json();
    
                  // Add more coin details if available
                  if (coinDetail) {
                    activity.current_price = coinDetail.market_data.current_price.usd || 0;
                    activity.market_cap = coinDetail.market_data.market_cap.usd || 0;
                  }
                }
              } catch (err) {
                console.error("Error fetching CoinGecko data:", err);
              }
            }
    
            // Push activity into the grouped data
            groupedData[header].push(activity);
          });
    
          const filteredPromises = await Promise.all(promises);
          const filteredData = filteredPromises.filter((item) => item !== null);
    
          // Convert to FlatList Format
          const formattedData = [];
          Object.keys(groupedData).forEach((month) => {
            groupedData[month].forEach((item) => formattedData.push({ type: "item", ...item }));
          });
    
          setGroupedActivities(formattedData);
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setIsLoading(false); // End loading once fetch is complete
        }
      };
    
      fetchActivities();
    }, [Filter]);  // Trigger fetching whenever the filter changes
    */





    











  // Render each item in FlatList
  const renderItem = ({ item }) => {
    // ❌ Skip items that are partial fills and don't carry useful display info
   
    
  
    return (
      isLoading ? (
        <SkeletonPlaceholder />


      ) : (

        item.activity_type == "FEE" 
        ?

        null

        :


        <TouchableOpacity
          onPress={() => {



            if (item.activity_type === "CSW") {
                
              posthog.capture('open_transaction_recepie_widthraw_bottomsheet', {
                screen: 'Cash',
                $screen_name: 'Cash',
                timestamp: new Date().toISOString(),
              
                });

              setCurrentChoosedAsset(item);
              SheetManager.show("TransactionRecepieWidthraw_Sheet", {
                payload: { selectedItem: item },
              });
            }
  
            if (item.activity_type === "CSD") {

                    
              posthog.capture('open_transaction_recepie_deposit_bottomsheet', {
                screen: 'Cash',
                $screen_name: 'Cash',
                timestamp: new Date().toISOString(),
              
                });

              setCurrentChoosedAsset(item);
              SheetManager.show("TransactionRecepieDeposit_Sheet", {
                payload: { selectedItem: item },
              });
            }
  
            if (item.side === "sell") {

                        
              posthog.capture('open_transaction_recepie_sold_assets_bottomsheet', {
                screen: 'Cash',
                $screen_name: 'Cash',
                timestamp: new Date().toISOString(),
              
                });

              setCurrentChoosedAsset(item);
              SheetManager.show("TransactionRecepieSoldAssets_Sheet", {
                payload: { selectedItem: item },
              });
            }
  
            if (item.side === "buy") {

                           
              posthog.capture('open_transaction_recepie_brought_assets_bottomsheet', {
                screen: 'Cash',
                $screen_name: 'Cash',
                timestamp: new Date().toISOString(),
              
                });

              setCurrentChoosedAsset(item);
              SheetManager.show("TransactionRecepieBroughtAssets_Sheet", {
                payload: { selectedItem: item },
              });
            }
          }}
          style={{
            width: "90%",
            alignSelf: 'center',
            marginTop: height(4),
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
  

         
          <View>
            {item.logo == null ? (
              <View style={{
                height: 30,
                width: 30,
                borderRadius: 30 / 2,
                marginRight: width(2),
                justifyContent: 'center',
              }}>
                {item.activity_type === "CSW" ? (
                  <View style={{
                    height: 35,
                    marginRight: width(2),
                    width: 35,
                    borderRadius: 35 / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <MaterialCommunityIcons
                      name='bank-transfer-out'
                      style={{
                        color: '#691AF5',
                        fontSize: size(25)
                      }}
                    />
                  </View>
                ) : (
                  <View style={{
                    height: 35,
                    marginRight: width(2),
                    width: 35,
                    borderRadius: 35 / 2,
                    backgroundColor: CurrentViewMode.Main_IconButtonBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{
                      color: CurrentViewMode.Main_IconButtonText,
                      fontSize: size(15),
                      fontWeight: "bold"
                    }}>
                      {firstInitial}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={{
                height: size(25),
                width: size(25),
                borderRadius: size(25) / 2,
                overflow: 'hidden',
                marginRight: width(2),
                justifyContent: 'center',
              }}>
                <Image
                  source={{ uri: item.logo }}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                />
              </View>
            )}
          </View>

      
  
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginLeft: width(5) }}>
              <Text style={{
                color: CurrentViewMode.Mode_fontColor,
                fontWeight: 'bold',
                fontSize: size(16)
              }}>
                {item.activity_type === "CSW" ? t("WithdrawHeader") : null}
                {item.activity_type === "CSD" ? t("DepositHeader") : null}
                {item.coinName !== null ? item.coinName : null}
              </Text>
  
              <Text style={{
                color: CurrentViewMode.Mode_Sec_fontColor,
                fontSize: size(12),
                marginTop: height(1),
              }}>
                {item.date == null ? formatDate(item.transaction_time) : formatDate(item.date)} •
                {item.activity_type === "CSW" ? ` ${t("DoneHeader")}` : null}
                {item.activity_type === "CSD" ? ` ${t("AddedHeader")}` : null}
                {item.side === "sell" ? ` ${t("SoldHeader")}` : null}
                {item.side === "buy" ? ` ${t("BroughtHeader")}` : null}
              </Text>
            </View>
          </View>
  
          <Text style={{
            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(16),
            fontWeight: 'bold',
            position: 'absolute',
            right: width(0)
          }}>
            {item.activity_type === "CSW" ? `${formatMoneyMyInvestment(item.net_amount)}` : null}
            {item.activity_type === "CSD" ? `+${formatMoneyMyInvestment(item.net_amount)}` : null}
            {item.side === "sell" ? `+${parseFloat(item.qty).toFixed(6)}` : null}
            {item.side === "buy" ? `-${parseFloat(item.qty).toFixed(6)}` : null}
          </Text>
  
        </TouchableOpacity>
      )
    );
  };
  

















  

  return (
   <> 
      {/* Animated Header */}

      <View style={{
      //  opacity: CoinPageIndex === 0 || SearchIndex2 === 0 ? 0.1 : 1,
        backgroundColor:CurrentViewMode.Mode_bg,
        height: "100%",
        width: "100%"
      }}>



      {
         SearchIndex == -1 

        ?

        <AnimatedHeader animatedValue={offset} />

        :

        null
      }

     

      {/* ScrollView to show list */}
      <ScrollView
        style={{ 
          height: "100%",
          width: "100%"
         }}
        contentContainerStyle={{
         
          backgroundColor: CurrentViewMode.Mode_bg,
          paddingTop: HEADER_HEIGHT, // Ensure content starts below the header
          paddingHorizontal: 20,
          paddingBottom: height(20)
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: offset } } }],
          { useNativeDriver: false }
        )}
      >

{/*

<TouchableOpacity 
onPress={() => {
  router.push('/learn/');
}}
style={{
          height: height(20),
          width: width(85),
          marginTop: height(2),
          marginLeft: width(0),
          borderRadius: 20,
          backgroundColor: "#000",
        }}>

<Text style={{
            fontSize: size(16),
            fontWeight: "bold",
            width: "80%",
            marginTop: height(4),
            color: '#fff',
           
             marginLeft: 30,
          }}>
               {t("HowToInvestBtnText1")}
          </Text>


          <Text style={{
            fontSize: size(14),
            marginTop: height(1.8),
            color: '#fff',
            width: "60%",
            lineHeight: 20,
            marginLeft: 30,
          }}>
            {t("HowToInvestBtnText2")}
          </Text>

          <View style={{
            height: height(9),
            width:  height(9),
            marginTop: height(10),
            right: width(4),
            position: 'absolute',
          //  backgroundColor: 'yellow'
          }}>

          <Image source={require("../../assets/images/How_To_Invest.png")}
            style={{
              height: "100%",
              width: "100%",
             
            }}
           />

</View>
      
        </TouchableOpacity>

*/}

    <TouchableOpacity onPress={() => {

        posthog.capture('open_transaction_bottomsheet', {
          screen: 'Cash',
          $screen_name: 'Cash',
          timestamp: new Date().toISOString(),

          });

      SheetManager.show("Transaction_Sheet")
    }} style={{
      marginTop: height(11),
      marginBottom: height(4),
      flexDirection: 'row',
      alignItems: 'center',

    }}>

      <Text style={{
          fontSize: size(22),
          fontWeight: "bold",
          color: CurrentViewMode.Mode_fontColor,
        }}>
          {t("TransactionsHeaderInCashComponent")}
        </Text>

        <MaterialIcons name="arrow-forward-ios" style={{
          color: CurrentViewMode.Mode_Sec_fontColor,
          fontSize: size(16),
          marginLeft: width(3),
          marginTop: height(0.2)
        }} />
        </TouchableOpacity>
       



        {
          groupedActivities == null || groupedActivities == ""

          ?

          <Text style={{
            fontSize: size(14),
            width: "80%",
            alignSelf: 'center',
            textAlign: 'center',
            color: CurrentViewMode.Mode_Third_fontColor
          }}>
            {t("OnceYouStartMakingTransactionsText")}
          </Text>


          :


        <FlatList style={{

          height: "100%",
          width: "100%"
        }}
        data={groupedActivities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        />

  
        }

       



    <Text style={{
      fontSize: size(13),
      color: CurrentViewMode.Mode_Third_fontColor,
      lineHeight: height(2.5),
      marginTop: height(4),
    }}>
    {t("BalanceShowsCashComponent1")}
    {t("BalanceShowsCashComponent2")} <Text style={{color: "#691AF5", fontSize: size(13),}}>{t("BalanceShowsCashComponent3")}</Text>.
    </Text>


      </ScrollView>
      </View>
    </>
  );
};

export default Cash;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#333',
  },
});