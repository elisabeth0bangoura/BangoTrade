

import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text,Animated,  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform, FlatList, Dimensions, ScrollView, TouchableOpacity, Image, 
  ActivityIndicator} from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../Languages_Translation_Screens/i18n'; 
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';




import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';

import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { FlashList } from '@shopify/flash-list';
import Collapsible from 'react-native-collapsible';
import CoinPage from '@/app/(coin)/coinPage';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';

import { HomeChartContext } from '../../../Context/HomeChartContext';

import { AmountContext } from '../../../Context/OpenAmountSheetContext';
import { CoinPageContext } from '../../../Context/OpenCoinPageContext';
import { SellAmountContext } from '../../../Context/SellOpenAmountSheetContext';
import RNPickerSelect from "react-native-picker-select";

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '../../../Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from '../../../Context/ViewModeContext';



import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc, addDoc, collection, onSnapshot  } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";






















const ITEM_HEIGHT = 50; // Height of each row

const MonthYearPicker = ({ selectedDate, onValueChange, scrollRef }) => {

  const { t } = useTranslation();


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);
  const localRef = useRef(null);
  const listRef = scrollRef || localRef; // Use external ref if provided

  const {
    AlpacaDateFormatStart,
    setAlpacaDateFormatStart,
    AlpacaDateFormatEnd,
    setAlpacaDateFormatEnd,
    selectedIndex,
    setSelectedIndex,
    combinedData,
    formatMonthYearToAPI,
  } = useContext(HomeContext);





const styles = StyleSheet.create({
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  fullRowTouchable: {
    width: "100%",
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedItemContainer: {
   // backgroundColor: "#222",
  },
  itemText: {
    fontSize: 20,
    fontWeight: "400",
    color: CurrentViewMode.Mode_Sec_fontColor,
  },
  selectedText: {
    fontSize: 24,
    fontWeight: "bold",
    color: CurrentViewMode.Mode_fontColor,
  },
});


  useEffect(() => {
    if (listRef.current && selectedIndex !== -1) {
      listRef.current.scrollToOffset({
        offset: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, []);

  // ✅ Optimized `renderItem` with `useCallback`
  const renderItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          selectedIndex === index ? styles.selectedItemContainer : {},
        ]}
        activeOpacity={1}
        hitSlop={{ top: 15, bottom: 15, left: 30, right: 30 }} // ✅ Makes scrolling easier
        onPress={() => {
          setSelectedIndex(index);
          onValueChange(combinedData[index]);

          // ✅ Update Alpaca API format states when clicking
          const { start, end } = formatMonthYearToAPI(combinedData[index]);
          setAlpacaDateFormatStart(start);
          setAlpacaDateFormatEnd(end);
        }}
      >
        <View style={styles.fullRowTouchable}>
          <Text
            style={[
              styles.itemText,
              selectedIndex === index ? styles.selectedText : {},
            ]}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [selectedIndex, combinedData]
  );

  return (
    <View style={{ height: 200, width: "100%", alignItems: "center" }}>
      <FlatList
        ref={listRef}
        data={combinedData}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={ITEM_HEIGHT}
        bounces={false}
        decelerationRate="normal"
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialScrollIndex={selectedIndex}
        initialNumToRender={10} // ✅ Renders only 10 items first
        maxToRenderPerBatch={10} // ✅ Renders in batches of 10
        windowSize={5} // ✅ Keeps only 5 items in memory
        renderItem={renderItem}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
          if (selectedIndex !== index) {
            setSelectedIndex(index);
            onValueChange(combinedData[index]);

            // ✅ Update Alpaca API format when scrolling stops
            const { start, end } = formatMonthYearToAPI(combinedData[index]);
            setAlpacaDateFormatStart(start);
            setAlpacaDateFormatEnd(end);
          }
        }}
      />
   
   
    </View>
  );
};

















export default function StatementsDatePickerCrypto () {



  const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  

  const [AlpacaUserId, setAlpacaUserId] = useState();

  const [UserFirstName, setUserFirstName] = useState("")
  const [UserLastName, setUserLastName] = useState("")

  const [Depot_number, setDepot_number] = useState("")


   
  const [Sum, setSum] = useState()

  const [equity, setEquity] = useState(null);
  const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)



  const { t } = useTranslation();

    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


    const [documents, setDocuments] = useState([]); // Stores fetched documents
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
      const [localSelectedIndex, setLocalSelectedIndex] = useState(0);

    const StatementsDatePickerCrypto_Sheet = useRef(null)
  
   
    const { 
      AmountIndex, 
      setAmountIndex, 
      value, 
      setValue,
      valueShares, 
      setValueShares,
      CurrentBuyType, 
      setCurrentBuyType,
      rawValueShares, 
      setRawValuShares,
      rawValue, 
      setRawValue,
      OrderTypeIndex, 
      setOrderTypeIndex,
      SharesSellAmount, 
      setSharesSellAmount,
  
    } = useContext(SellAmountContext);
  
  
    const { 
      CoinPageIndex, 
      setCoinPageIndex,  
      CurrentBackgroundColorForCoin, 
      setCurrentBackgroundColorForCoin, coinData, setCoinData, coinSymbol, setCoinSymbol  } = useContext(CoinPageContext);
  
  
      const {
        AlpacaDateFormatStart, 
        setAlpacaDateFormatStart,
        AlpacaDateFormatEnd, 
        setAlpacaDateFormatEnd,
        startDate, 
        setStartDate,
        endDate, 
        setEndDate,
        combinedData // ✅ Now correctly imported from HomeContext
      } = useContext(HomeContext);
  
      
        // ✅ Define `useRef` for both FlatLists
    const startListRef = useRef(null);
    const endListRef = useRef(null);
  
    const syncScroll = (date) => {
      setStartDate(date);
      setEndDate(date); // Sync both pickers
  
      const index = combinedData.indexOf(date);
      if (startListRef.current && endListRef.current && index !== -1) {
        startListRef.current.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
        endListRef.current.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
      }
    };
      
      
    
    const styles = StyleSheet.create({
      itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      },
      fullRowTouchable: {
        width: "100%",
        height: ITEM_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
      },
      selectedItemContainer: {
       // backgroundColor: "#222",
      },
      itemText: {
        fontSize: 20,
        fontWeight: "400",
        color:  CurrentViewMode.Mode_Sec_fontColor,
      },
      selectedText: {
        fontSize: 24,
        fontWeight: "bold",
        color: CurrentViewMode.Mode_fontColor,
      },
    });
    








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
    
    
    
      const GetAccountValues = async () => {
        try {
          const options = {
            method: "GET",
            headers: {
              accept: "application/json",
              authorization:
                "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==",
            },
          };
    
          const response = await fetch(
            `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userData.AlpacaAccountId}/account`,
            options
          );
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data?.message || "Failed to fetch account equity.");
          }
    
          console.log(data); // ✅ Log equity for debugging
          setEquity(data.position_market_value); // ✅ Store equity in state
          setSetcash_withdrawable(data.cash)
          setSum(data.equity)
        } catch (err) {
          setError(err.message);
          console.error("❌ Error fetching trading account equity:", err);
        }
      };
    
      GetAccountValues();
    
             
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    };
    
    fetchUserData();
    }, [user?.uid]); // Make sure the effect runs whenever user.uid changes
    







  
      
    return(
  
  
      <ActionSheet ref={StatementsDatePickerCrypto_Sheet}
       //backgroundInteractionEnabled={false}
       isModal={false}
       gestureEnabled={true}
    
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
            maxHeight: height(50),
            height: height(50),
            backgroundColor: CurrentViewMode.Mode_bg,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            
          }} 	
          style={{
            height: "100%",
            backgroundColor: CurrentViewMode.Mode_bg,
        }}>
      
        
        
              <Text style={{
                fontSize: size(25),
                color: CurrentViewMode.Mode_fontColor,
                width:"85%",
                fontWeight: "900",
                marginLeft: width(5),
              //  top: height(-1)
              }}>
                {t("StatementsDateTypeCryptoPickerTitle")}      
              </Text>
    
  
    
  
  
            
            
  
   
       
   
   
   
   
              <View style={{
             marginTop: height(12)
           }}>
   
        
    
   
   
   <View style={{
     flexDirection: "row",
      marginLeft: width(-3),
     width: "50%",
     top: height(-10),
     height: "70%", // Fixed height for smooth scrolling
   }}>
     {/* Start Date Picker */}
     <MonthYearPicker
        selectedDate={startDate}
        onValueChange={syncScroll}
        scrollRef={startListRef}
      />

  
        <Text style={{ fontSize: 24, color :CurrentViewMode.Mode_fontColor, marginVertical: 10 }}> - </Text>
  
        <MonthYearPicker
        selectedDate={endDate}
        onValueChange={syncScroll}
        scrollRef={endListRef}
      />

      </View>
   
   
   
              {/* Submit Button */}
              
            
   
      
              <View style={{
               bottom: height(1),
               backgroundColor: CurrentViewMode.Mode_bg_Home,
               width: "100%",
               position: 'absolute',
               height: height(8)
             }}> 
      
      
     
       
               <TouchableOpacity onPress={() => {
   
                const account_id =AlpacaUserId; // Replace with actual account ID
                const authHeader =
                  "Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=="; // Replace with actual token
  
                // ✅ Function to fetch the latest document & download it
                const fetchAndDownloadDocument = async () => {
                  setLoading(true);
                  try {
                    // ✅ Step 1: Fetch list of documents with type `crypto_account_statement`
                    const response = await fetch(
                      `https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}/documents?type=crypto_account_statement`,
                      {
                        method: "GET",
                        headers: {
                          accept: "application/json",
                          authorization: authHeader,
                        },
                      }
                    );
  
                    const data = await response.json();
                    if (!response.ok || !data.length) {
                      Alert.alert("Error", "No crypto account statements found.");
                      setLoading(false);
                      return;
                    }
  
                    // ✅ Step 2: Get latest document ID
                    const latestDocumentId = data[0].id; // Pick the first document (latest)
  
                    // ✅ Step 3: Fetch download link
                    const downloadResponse = await fetch(
                      `https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaUserId}/documents/${latestDocumentId}/download`,
                      {
                        method: "GET",
                        headers: {
                          accept: "application/json",
                          authorization: authHeader,
                        },
                      }
                    );
  
                    const downloadData = await downloadResponse.json();
                    if (!downloadResponse.ok || !downloadData.url) {
                    console.log("Error", "Download link not found.");
                      setLoading(false);
                      return;
                    }
  
                    // ✅ Step 4: Download and Save PDF
                    const fileUri = `${FileSystem.documentDirectory}crypto_statement.pdf`;
                    const { uri } = await FileSystem.downloadAsync(downloadData.url, fileUri);
  
                    console.log("Downloaded to:", uri);
  
                    // ✅ Step 5: Open PDF using the share menu
                    if (await Sharing.isAvailableAsync()) {
                      await Sharing.shareAsync(uri);
                    } else {
                      console.log("Download Complete", "File saved successfully.");
                    }
                  } catch (err) {
                    console.log("Error", "Failed to fetch or download the document.");
                    console.error(err);
                  } finally {
                    setLoading(false);
                  }
                };
                fetchAndDownloadDocument()
               
                 }}
               disabled={startDate == "" ? true : false}
               style={{
                 marginTop: 20,
                 height: 50,
                 backgroundColor: startDate == ""  ? "#ccc" :  CurrentViewMode.Mode_fontColor,
                 borderRadius: 10,
                 position: 'absolute',
                 bottom: height(2),
                 width: width(35),
                 paddingHorizontal: 30,
                 right: width(5),
                 opacity:  startDate == ""  ? 0.3 :  100,
                 flexDirection: 'row',
                 alignItems: 'center',
               }}
             >
               <Text style={{ fontSize: size(18), color: CurrentViewMode.Mode_bg, fontWeight: 'bold',  }}>
               {t("AccountStatementNextButtonTitle")}      
               </Text>
         
               <AntDesign name="arrowright" style={{
                color: CurrentViewMode.Mode_bg,
                 fontSize: size(20),
                 right: width(5),
                 position: 'absolute',
               }} />
             </TouchableOpacity>
   
   
   
   
      
     
   </View>
   
   </View>
    
    
         </ActionSheet>
  
    )
  
  }