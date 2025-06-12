// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, Easing, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {AntDesign, Feather, Ionicons, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import Page from "./Home/home"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import axios from 'axios';
import Profile from "./Profile/profile"
import CountryFlag from "react-native-country-flag";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../Languages_Translation_Screens/i18n';
import { getDatabase, ref, update } from "@react-native-firebase/database";
import auth from '@react-native-firebase/auth';
import Cash from "./Cash/cash"
import { BlurView } from 'expo-blur'; // If you're using Expo
import { LineChart } from 'react-native-wagmi-charts';
import { Platform } from 'react-native';
import { Link } from 'expo-router';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'

import { FlashList } from "@shopify/flash-list";
import StableCoinBottomSheetData from './Search/Search_Area/StableCoinsBottomSheetData';
import Winners_BottomSheetData from './Search/Search_Area/Winners_BottomSheetData';
import Trends_BottomSheetData from './Search/Search_Area/Trends_BottomSheetData';

import TopCategoriesData from './Search/Search_Area/TopCategoriesData';
import {Search2Context} from '../Context/SearchIndexStateContext';

import SlideUpView from './Search/Search_Area/SearchCoinSlideView';
import GovernanceData from './Search/Search_Area/GovernanceData';
import DeFiData from './Search/Search_Area/DeFiData';
import PaymentCoins from './Search/Search_Area/PaymentCoins';
import MYieldFarmingStakingData from './Search/Search_Area/MYieldFarmingStakingData';
import CoinPage from '../(coin)/coinPage';

import { CoinPageContext } from '../Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '../Context/CurrentCoinSelectedContext';
import { IFollowingsCoinsContext } from '../Context/OpenIFollowingsCoinsSheetContext';
import IFollowCoinBottomSheetData, { SortAfterComponentFollowCoins } from './Home/IFollowAssets/IFollowCoinBottomSheetData';

import { OpenAddMoreIFollowCoinsContext, OpenAddMoreIFollowCoinsIndex } from "../Context/OpenAddMoreIFollowCoinsContext"
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';

import { SearchContext, SearchContextProvider } from '../Context/MainSearchIndexStateContext';
import firestore from '@react-native-firebase/firestore';

import { BuyConfirmationSheetContext } from '../Context/BuyConfirmationSheetContext';
import debounce from 'lodash.debounce';
import AnalyticsAssetBottomSheet from './Home/Insights/Analytics';
import { ToastMessageContext } from '../Context/ToastMessageContext';
import { ViewModeContext } from '../Context/ViewModeContext';



import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "@react-native-firebase/auth";
import { CashContext } from '../Context/CashContext';


const Tab = createMaterialTopTabNavigator();














// Tab Navigation Component
const Layout = React.memo (() => {



	const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  

	const {
		UserExpoPushTokenNew, 
		setUserExpoPushTokenNew,
		UserAlpacaAccountId, 
		setUserAlpacaAccountId,
		userId, 
		setuserId,
		PaymentReceivedText1,
		setPaymentReceivedText1,
		PaymentReceivedText2,
		setPaymentReceivedText2,
		PaymentReceivedText3,
		setPaymentReceivedText3,
	  
	   } = useContext(CashContext)
	
	  


	const {
		BuyConfirmationSheetIndex, 
		setBuyConfirmationSheetIndex,
		showToast, 
		setShowToast
	   } = useContext(BuyConfirmationSheetContext);


	const { CoinPageIndex, setCoinPageIndex } = useContext(CoinPageContext);
	const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);
  
	const { SearchIndex, setSearchIndex } = useContext(SearchContext);


	const { SearchIndex2 } = useContext(Search2Context);

	const translateY = useRef(new Animated.Value(height(8))).current;  // Starting position
	const scale = useRef(new Animated.Value(0)).current;  // For scaling effect

	const [opacity] = useState(new Animated.Value(1)); // Initialize opacity value


	  

	const [BankRelationshipStatus, setBankRelationshipStatus] = useState(false)
	const [ACHBankRelationshipStatus, setACHBankRelationshipStatus] = useState(false)
	

	const [isOpenTransfer, setisOpenTransfer] = useState(false); // State to toggle between open and close

 const { t } = useTranslation();

 const [isDataFetched, setIsDataFetched] = useState(false);

 const [GainerData, setGainerData] = useState([])
 const [isSheetOpenLangouage, setisSheetOpenLangouage] = useState(false);  // Track if BottomSheet is open
 const [sheetIndexLanguage, setSheetIndexLanguage] = useState(-1);
 const [openDoneCHoosedLanguage, setOpenDoneCHoosedLanguage] = useState(false);
 const [UserLang, setUserLang] = useState()
 const [coins, setCoins] = useState([]); // State for the list of coins
 const [loading, setLoading] = useState(false); // State for loading spinner
 const [chartData, setChartData] = useState({}); // Store chart data for each coin
 const [coinsData, setCoinsData] = useState([]);
 const [chartDataLoaded, setChartDataLoaded] = useState(false);
 const [CoinBottomSheet, setCoinBottomSheet] = useState(false)
 const [trendingCoinsData, setTrendingCoinsData] = useState([]); // Store the trending coins
 const [topCoinsData, setTopCoinsData] = useState([]);
 const [stableCoinsData, setStableCoinsData] = useState([]);
 const [prevPricesStableCoins, setPrevPricesStableCoins] = useState({}); // To track previous prices of each stablecoin
const [OpenSearchView, setOpenSearchView] = useState(false)
 const [isSheetOpenNew, setisSheetOpenNew] = useState(false);  // Track if BottomSheet is open

 const [IndexsheetRefCoinPage, setIndexsheetRefCoinPage] = useState(-1)
 const [AvailbleCashTransferBalance, setAvailbleCashTransferBalance] = useState()
  

 const [CoinPageTestIndex, setCoinPageTestIndex] = useState(-1)
 

 const bounceValue = useState(new Animated.Value(0))[0]; // Initialize animation value
const [CloseBottomSearchSheet, setCloseBottomSearchSheet] = useState(0)
 

const {showToastSell, setShowToastSell, setShowTrasnferBtn, showTransferBtn, ShowNoMoneyToWidthraw, setShowNoMoneyToWidthraw} = useContext(ToastMessageContext);

const { IFollowingsCoinsIndex, setIFollowingsCoinsIndex } = useContext(IFollowingsCoinsContext);
const { OpenAddMoreIFollowCoinsIndex,  combinedPercentage, setOpenAddMoreIFollowCoinsIndex } = useContext(OpenAddMoreIFollowCoinsContext);

const [UserFirstName, setUserFirstName] = useState("")
const [UserLastName, setUserLastName] = useState("")
const [AlpacaUserId, setAlpacaUserId] = useState(null);


const sheetRefOpenFollowingsBottomSheet = useRef(null);


const handleSheetChangeFollowingsBottomSheet = useCallback((index) => {
  setIFollowingsCoinsIndex(index);
}, []);


const snapPointsFollowingsBottomSheet = useMemo(() => ["90%"], []);
const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

useEffect(() => {
  if (IFollowingsCoinsIndex === 0) {
    // Open the sheet when the index is 0
    sheetRefOpenFollowingsBottomSheet.current?.snapToIndex(0);
  } else if (IFollowingsCoinsIndex === -1) {
    // Close the sheet when the index is -1
    sheetRefOpenFollowingsBottomSheet.current?.close();
  }
}, [IFollowingsCoinsIndex]);























  












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
  
  
          console.log("here ", userDocument.data().AlpacaAccountId);
          console.log("given_name ", userDocument.data().newAccountPayload?.identity?.given_name);
          console.log("family_name ", userDocument.data().newAccountPayload?.identity?.family_name);
  
          setAlpacaUserId(userDocument.data().AlpacaAccountId);
          setUserFirstName(userDocument.data().newAccountPayload?.identity?.given_name);
          setUserLastName(userDocument.data().newAccountPayload?.identity?.family_name);
  
        }

	} catch (error) {
	console.error("Fetch user data error:", error);
	}
	};

	fetchUserData()

	}, [UserFirstName, UserLastName, AlpacaUserId]);
	

	
	const getFirstLetter = (str) => {
		console.log("🔤 Input to getFirstLetter:", str);
		
		if (typeof str === 'string' && str.trim().length > 0) {
		  return str.trim().charAt(0).toUpperCase();  // Return first uppercase letter
		}
	  
		return '';  // If input is empty, null, or not a string
	  };
	  
	  
	  
		  
	const firstInitial = getFirstLetter(UserFirstName);
	console.log("✅ First initial:", firstInitial);
	
	  



/*

    // hooks
    const sheetRefAddMoreIFollowCoins = useRef(null);

    // variables
    const snapPointsAddMoreIFollowCoins = useMemo(() => ["100%"], []);
  
    // callbacks
    const handleSheetChangeAddMoreIFollowCoins = useCallback((index) => {
      console.log("handleSheetChange", index);
    }, []);
    const handleSnapPressAddMoreIFollowCoins = useCallback((index) => {
        sheetRefAddMoreIFollowCoins.current?.snapToIndex(index);
    }, []);
    const handleClosePressAddMoreIFollowCoins = useCallback(() => {
        sheetRefAddMoreIFollowCoins.current?.close();
    }, []);


*/










  
       
useEffect(() => {
    





	// Fetch data from the Firestore path
	const fetchUserData = async () => {
	  try {
		const userDocument = await firestore()
		  .collection('users') // Reference to the 'users' collection
		  .doc(user.uid) // The specific document ID
		  .get();
  
		if (userDocument.exists) {
		  // If the document exists, set the data
  
		  setAlpacaUserId(userDocument.data().AlpacaAccountId)
  
	
		   // Check bank relationShip
		
		const CheckbankRelationship = async () => {
	  
			  const options = {
				  method: 'GET',
				  headers: {
					accept: 'application/json',
					authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
				  }
				};
				
			   await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${userDocument.data().AlpacaAccountId}/recipient_banks`, options)
				  .then(res => res.json())
				  .then(async (res) => {
					  console.log("Bank Relationship: " , res[0]?.status)
					  setBankRelationshipStatus(res[0]?.status == "APPROVED" ? true : false)
				  
						  // Bank Realtionship Id
						  if(res == null) {
							setBankRelationshipStatus("No recipient_banks")
						  } else {
  
							
						  console.log("Bank Relationships id : " , res[0]?.id)
						}
  
	  
				  /*    await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaAccountId}/ach_relationships`, options)
						  .then(res => res.json())
						  .then(res => {
							   console.log("ACH Relationship: " , res[0].status)
							   setACHBankRelationshipStatus(res[0].status == "APPROVED" ? true : false)
	  
							   // Bank Realtionship Id
							   console.log("ach_relationship : " , res[0].id)
  
							   setBankNumber(res[0].bank_account_number.slice(0, 4));
	  
						  })
						  .catch(err => console.error(err));
						  */
				  })
				  .catch(err => console.error(err));
	  
	  
		  }
	  
		 CheckbankRelationship()




		 console.log("AlpacaAccountId: ", userDocument.data().AlpacaAccountId)
  


		 // Get Balance 

		 const GetBalance = async () => {
  
			const options = {
			  method: 'GET',
			  headers: {
				accept: 'application/json',
				authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
			  }
			}
			
		   await fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userDocument.data().AlpacaAccountId}/account`, options)
			  .then(res => res.json())
			  .then(res => {
			
				console.log("cash_withdrawable: ", res.cash_withdrawable)
				setAvailbleCashTransferBalance(res.cash_withdrawable)
			  
			  })
			  .catch(err => console.error(err))
	
			
	
		  
		}
	
		  GetBalance()
  
		} else {
		  // Handle the case when the document doesn't exist
		  console.log('No such document!');
		}
	  } catch (error) {
		console.error('Error fetching user data:', error);
	  }
	};
  
	fetchUserData();




	
		
	 
	  }, [AlpacaUserId, AvailbleCashTransferBalance])
	  
  
  
  
  
	  







const sheetRefAddMoreIFollowCoins = useRef(null);

const handleSheetChangeAddMoreIFollowCoins = useCallback((index) => {
	console.log("handleSheetChange", index);
  }, []);


const snapPointsAddMoreIFollowCoins = useMemo(() => ["40%"], []);

useEffect(() => {
  if (OpenAddMoreIFollowCoinsIndex === 0) {
    // Open the sheet when the index is 0
    sheetRefAddMoreIFollowCoins.current?.snapToIndex(0);
  } else if (OpenAddMoreIFollowCoinsIndex === -1) {
    // Close the sheet when the index is -1
    sheetRefAddMoreIFollowCoins.current?.close();
  }
}, [OpenAddMoreIFollowCoinsIndex]);






	// Open and Close Bottomsheet for Language Category 
	
	const sheetRefLangouage = useRef(null);
	const snapPointsLangouage = useMemo(() => ["92%"], []);
  
	
	



	useEffect(() => {

		console.log("Current State of SearchIndex1 " , SearchIndex)
	}, [])

	// Handle the sheet open state
	const handleOpenSheetLanguage = () => {
		setisSheetOpenLangouage(true);  // Set the state to true to open the bottom sheet
	sheetRefLangouage.current?.snapToIndex(1);  // Open the sheet to the desired snap point
	};

	const handleSheetChangeLangouage = useCallback((index) => {
		setSheetIndexLanguage(1)
		setCoinBottomSheet(false)
		if(index == -1) {
			setisSheetOpenLangouage(false);  // Set state to false when the sheet is closed
			setSheetIndexLanguage(-1)
			setCoinBottomSheet(false)
		}
	  console.log("tLanguage Sheet snapped to:", index); // Debug to check index
	}, []);




	

	  // hooks
	  const sheetRef = useRef(null);

	  // variables
	  const snapPoints = useMemo(() => ["90%"], []);
	
	  // callbacks
	  const handleSheetChange = useCallback((index) => {
		console.log("handleSheetChange", index);
		setSearchIndex(index)
		
	
	  }, []);
	  const handleSnapPress = useCallback((index) => {
		sheetRef.current?.snapToIndex(index);
		setSearchIndex(index)
	  }, []);
	  const handleClosePress = useCallback(() => {
		sheetRef.current?.close();
		setSearchIndex(-1)
	  }, []);
	







		



   // Memoize the backdrop component to optimize performance
  const renderBackdropSearch = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
		onPress={() => {
			if (SearchIndex === 0) {
				setSearchIndex(0)
			}
		  }}
      />
    ),
    [SearchIndex]
  );



   const IFollowBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
		onPress={() => {
			if (IFollowingsCoinsIndex === 0) {
				setIFollowingsCoinsIndex(0)
			}
		  }}
      />
    ),
    [IFollowingsCoinsIndex]
  );


  


	const renderBackdropLanguage = useCallback(
		(props) => (
		  <BottomSheetBackdrop
			{...props}
			disappearsOnIndex={-1}
			appearsOnIndex={1}
			onPress={() => {
			  if (sheetIndexLanguage === 1) {
				setSheetIndexLanguage(-1);  // Close the language sheet when backdrop is pressed
			  }
			}}
		  />
		),
		[sheetIndexLanguage]
	  );
  

  
	  useEffect(() => {
		if (!showTransferBtn) {
		  // Start bounce animation when the button is shown
		  Animated.spring(bounceValue, {
			toValue: 1,
			friction: 3, // Set friction for bounce effect
			tension: 100, // Set tension for bounce effect
			useNativeDriver: true, // Use native driver for performance
		  }).start();
		} else {
		  // Reset the bounce animation when button is hidden
		  bounceValue.setValue(0);
		}
	  }, [showTransferBtn]);
	 
	 







const HomeTab = useMemo(() => () => <Page />, []);
const TabOne = useMemo(() => () => <Cash />, []);
const ProfileTab = useMemo(() => () => <Profile/>, []);


  


  

  const handlePress = () => {
	// Only reset translateY when opening the button
	if (!isOpenTransfer) {
	  translateY.setValue(0); // Reset position when opening
  
	  // Opening: Apply animations in sequence with bounce
	  Animated.spring(translateY, {
		toValue: -height(12), // Move the parent view upwards by 12% of the screen height
		friction: 1,           // Very low friction for a quick upward movement
		tension: 250,          // High tension for fast upward movement
		velocity: 12,          // High velocity for fast initial movement
		useNativeDriver: true, // Native driver for performance
	  }).start();
  
	  // After the fast upward movement, apply the "liquid bounce" effect
	  Animated.spring(translateY, {
		toValue: -height(6),   // Increased bounce (less than half of the first move)
		friction: 4,           // Moderate friction for smoother control
		tension: 180,          // Slightly higher tension for a more pronounced bounce
		velocity: 8,           // Lower velocity for a slower, more controlled bounce
		useNativeDriver: true, // Native driver for performance
	  }).start();
  
	  // Show the buttons after the animation starts
	  setTimeout(() => {
		setShowTrasnferBtn(true); // Delay buttons' visibility until after animation starts
	  }, 300); // Adjust this timeout based on your animation timing
  
	} else {
	  // Closing: Apply animations without bounce
	  // Fast floating-up animation (for closing) combined with fade-out
	  Animated.spring(translateY, {
		toValue: -height(4),    // Move the button up slightly to make it "disappear"
		friction: 1,            // Very low friction for a quick upward movement
		tension: 250,           // High tension for fast upward movement
		velocity: 12,           // High velocity for fast initial movement
		useNativeDriver: true,  // Native driver for performance
	  }).start();
  
	  // Fade out the button as it moves upwards
	  Animated.timing(opacity, {
		toValue: 0,             // Set opacity to 0 (fully invisible)
		duration: 200,          // Duration of the fade-out
		useNativeDriver: true,  // Native driver for performance
	  }).start();
  
	  // After the fast upward movement, move it out of view smoothly without bounce
	  Animated.spring(translateY, {
		toValue: -height(6),    // Move the button further up out of view (no bounce)
		friction: 4,            // Moderate friction for smoother movement
		tension: 180,           // Moderate tension for a smooth effect
		velocity: 8,            // Slower velocity for smoother motion
		useNativeDriver: true,  // Native driver for performance
	  }).start();
  
	  // Hide the buttons after the animation ends
	  setTimeout(() => {
		setShowTrasnferBtn(false); // Delay buttons' disappearance after animation
	  }, 300); // Adjust this timeout based on your animation timing
	}
  
	// Toggle the state for the next press
	setisOpenTransfer(prevState => !prevState);
  
	// Haptic feedback on press
	Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);


	
  };
  
  

  const Tab = createMaterialTopTabNavigator();



  


  



  











  const sheetRefCoinPageTest = useRef(null);

  // variables
  const snapPointsCoinPageTest = useMemo(() => ["90%"], []);


  const handleSnapPressCoinPageTest = useCallback((index) => {
    sheetRefCoinPageTest.current?.snapToIndex(index);
  }, []);



/*
  useEffect(() => {
	if (CoinPageTestIndex === 0) {
	  sheetRefCoinPageTest.current?.snapToIndex(0);
	} 
  }, [CoinPageTestIndex]);
*/

  // callbacks
  const handleSheetChangeCoinPageTest = useCallback((index) => {
	console.log("handleSheetChange", index);
		if(CoinPageTestIndex == 0) {

	sheetRefCoinPageTest.current?.snapToIndex(0);
} else {
  setCoinPageTestIndex(-1)
}

  }, []);




  const handleClosePressCoinPageTest = useCallback(() => {
    sheetRefCoinPageTest.current?.close();
  }, []);















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




// Memoize the backdrop component to optimize performance
const renderBackdropOpenAddMoreIFollowCoins = useCallback(
	(props) => (
	  <BottomSheetBackdrop
		{...props}
		disappearsOnIndex={-1}
		appearsOnIndex={0}
		onPress={() => {
			if (OpenAddMoreIFollowCoinsIndex === 0) {
				setOpenAddMoreIFollowCoinsIndex(0)
			}
		  }}
	  />
	),
	[CoinPageIndex]
	);














	useEffect(() => {

		console.log("Search Index from Layout ", SearchIndex)
	}, [])
  







	


  return (

	<>




	<GestureHandlerRootView>
		
		<BottomSheetModalProvider>

	



	{
		// If a Sheet is Open hide the Buttons. If a sheet is closed show buttons again.

		SearchIndex == 0 || sheetIndexLanguage == 1 || IFollowingsCoinsIndex == 0 || CoinPageIndex == 0

		?

		null

		:

		<>





		{
		 showTransferBtn == true

		 ?


	<> 
     <Animated.View
          style={{
            transform: [{ translateY: translateY }],  // Apply the animated translateY for the vertical movement
            position: 'absolute',
			zIndex: 100,
            bottom: height(6),  // Initially positioned at the bottom
            right: 30,
            alignItems: 'center',  // Center the buttons inside the parent view
          }}
        >
        {showTransferBtn && (
          <>
            {/* First Button: Einzahlen */}
          
			


		  {
			CurrentViewMode.Mode_Name !== "The White Theme"

				?


				<>

			<TouchableOpacity onPress={() => {


				
			



					// Fetch data from the Firestore path
					const fetchUserData = async () => {
					try {
						const userDocument = await firestore()
						.collection('users') // Reference to the 'users' collection
						.doc(user.uid) // The specific document ID
						.get();
				
						if (userDocument.exists) {
						// If the document exists, set the data
				
						setAlpacaUserId(userDocument.data().AlpacaAccountId)
				
					
						
						
						const CheckbankRelationship = async () => {
					
							const options = {
								method: 'GET',
								headers: {
									accept: 'application/json',
									authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
								}
								};
								
							await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${userDocument.data().AlpacaAccountId}/recipient_banks`, options)
								.then(res => res.json())
								.then(async (res) => {
									console.log("Bank Relationship: " , res[0]?.status)
									setBankRelationshipStatus(res[0]?.status == "APPROVED" ? true : false)
								
										// Bank Realtionship Id
										if(res == null) {
											setBankRelationshipStatus("No recipient_banks")
										} else {
				
											SheetManager.show("ChooseDepositWay_Sheet")
										console.log("Bank Relationships id : " , res[0]?.id)
										}
				
					
								/*    await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaAccountId}/ach_relationships`, options)
										.then(res => res.json())
										.then(res => {
											console.log("ACH Relationship: " , res[0].status)
											setACHBankRelationshipStatus(res[0].status == "APPROVED" ? true : false)
					
											// Bank Realtionship Id
											console.log("ach_relationship : " , res[0].id)
				
											setBankNumber(res[0].bank_account_number.slice(0, 4));
					
										})
										.catch(err => console.error(err));
										*/
								})
								.catch(err => console.error(err));
					
					
						}
					
						CheckbankRelationship()




						console.log("AlpacaAccountId: ", userDocument.data().AlpacaAccountId)
				

						const GetBalance = async () => {
				
							const options = {
							method: 'GET',
							headers: {
								accept: 'application/json',
								authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
							}
							}
							
						await fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userDocument.data().AlpacaAccountId}/account`, options)
							.then(res => res.json())
							.then(res => {
							
								console.log("cash_withdrawable: ", res.cash_withdrawable)
								setAvailbleCashTransferBalance(res.cash_withdrawable)
							
							})
							.catch(err => console.error(err))
					
							
					
						
						}
					
						GetBalance()
				
						} else {
						// Handle the case when the document doesn't exist
						console.log('No such document!');
						}
					} catch (error) {
						console.error('Error fetching user data:', error);
					}
					};
				
					fetchUserData();
			
						
					
					
  

				
				//setShowTrasnferBtn(false)
				// CheckBankingConnection_Sheet
			  }}
              activeOpacity={0.8}
              style={{
                paddingVertical: 14,
                justifyContent: 'center',
                borderRadius: 10,
                zIndex: 100,
                bottom: height(6),
                paddingHorizontal: 15,
                width: width(40),
                flexDirection: 'row',
                backgroundColor: CurrentViewMode.Mode_Main_ButtonColor,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.30,
                shadowRadius: 4.65,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  alignSelf: 'center',
                  color: CurrentViewMode.Mode_Main_ButtonTextColor,
                  fontWeight: 'bold',
                  fontSize: 17,
                }}
              >
                Einzahlen
              </Text>
            </TouchableOpacity>

			<TouchableOpacity
              onPress={() => {
				//setShowTrasnferBtn(false)
				if(AvailbleCashTransferBalance == 0 || AvailbleCashTransferBalance == undefined) {	
					setShowNoMoneyToWidthraw(true)
				} else {
					SheetManager.show("ChooseWidthrawWay_Sheet")
				}
				// here
			
			  }}
              activeOpacity={0.8}
              style={{
                paddingVertical: 14,
                justifyContent: 'center',
                borderRadius: 10,
                zIndex: 100,
                bottom: height(4),
                paddingHorizontal: 15,
                width: width(40),
                flexDirection: 'row',
                backgroundColor: CurrentViewMode.Mode_Main_ButtonColor,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.30,
                shadowRadius: 4.65,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  alignSelf: 'center',
                  color:  CurrentViewMode.Mode_Main_ButtonTextColor,
                  fontWeight: 'bold',
                  fontSize: 17,
                }}
              >
                Senden
              </Text>
            </TouchableOpacity>

			</>


			:

			null

		  }



		  { 


			CurrentViewMode.Mode_Name == "The White Theme"

		    ?


			<>


			<TouchableOpacity
              onPress={() => {


					// Fetch data from the Firestore path
					const fetchUserData = async () => {
						try {
							const userDocument = await firestore()
							.collection('users') // Reference to the 'users' collection
							.doc(user.uid) // The specific document ID
							.get();
					
							if (userDocument.exists) {
							// If the document exists, set the data
					
							setAlpacaUserId(userDocument.data().AlpacaAccountId)
					
						
							
							
							const CheckbankRelationship = async () => {
						
								const options = {
									method: 'GET',
									headers: {
										accept: 'application/json',
										authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
									}
									};
									
								await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${userDocument.data().AlpacaAccountId}/recipient_banks`, options)
									.then(res => res.json())
									.then(async (res) => {
										console.log("Bank Relationship: " , res[0]?.status)
										setBankRelationshipStatus(res[0]?.status == "APPROVED" ? true : false)
									
											// Bank Realtionship Id
											if(res == null) {
												setBankRelationshipStatus("No recipient_banks")
											} else {
					
												SheetManager.show("ChooseDepositWay_Sheet")
											console.log("Bank Relationships id : " , res[0]?.id)
											}
					
						
									/*    await fetch(`https://broker-api.sandbox.alpaca.markets/v1/accounts/${AlpacaAccountId}/ach_relationships`, options)
											.then(res => res.json())
											.then(res => {
												console.log("ACH Relationship: " , res[0].status)
												setACHBankRelationshipStatus(res[0].status == "APPROVED" ? true : false)
						
												// Bank Realtionship Id
												console.log("ach_relationship : " , res[0].id)
					
												setBankNumber(res[0].bank_account_number.slice(0, 4));
						
											})
											.catch(err => console.error(err));
											*/
									})
									.catch(err => console.error(err));
						
						
							}
						
							CheckbankRelationship()
	
	
	
	
							console.log("AlpacaAccountId: ", userDocument.data().AlpacaAccountId)
					
	
							const GetBalance = async () => {
					
								const options = {
								method: 'GET',
								headers: {
									accept: 'application/json',
									authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
								}
								}
								
							await fetch(`https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${userDocument.data().AlpacaAccountId}/account`, options)
								.then(res => res.json())
								.then(res => {
								
									console.log("cash_withdrawable: ", res.cash_withdrawable)
									setAvailbleCashTransferBalance(res.cash_withdrawable)
								
								})
								.catch(err => console.error(err))
						
								
						
							
							}
						
							GetBalance()
					
							} else {
							// Handle the case when the document doesn't exist
							console.log('No such document!');
							}
						} catch (error) {
							console.error('Error fetching user data:', error);
						}
						};
					
						fetchUserData();
					
							
						
			  
		  
			  }}
              activeOpacity={0.8}
              style={{
                paddingVertical: 14,
                justifyContent: 'center',
                borderRadius: 10,
                zIndex: 100,
                bottom: height(6),
                paddingHorizontal: 15,
                width: width(40),
                flexDirection: 'row',
                backgroundColor: CurrentViewMode.Mode_fontColor,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.30,
                shadowRadius: 4.65,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  alignSelf: 'center',
                  color: CurrentViewMode.Mode_Main_ButtonTextColor,
                  fontWeight: 'bold',
                  fontSize: 17,
                }}
              >
                Einzahlen
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
				//setShowTrasnferBtn(false)

				if(AvailbleCashTransferBalance == 0 || AvailbleCashTransferBalance == undefined) {	
					setShowNoMoneyToWidthraw(true)
				} else {
					SheetManager.show("ChooseWidthrawWay_Sheet")
				}
				
			  }}
              activeOpacity={0.8}
              style={{
                paddingVertical: 14,
                justifyContent: 'center',
                borderRadius: 10,
                zIndex: 100,
                bottom: height(4),
                paddingHorizontal: 15,
                width: width(40),
                flexDirection: 'row',
				backgroundColor: CurrentViewMode.Mode_fontColor,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.30,
                shadowRadius: 4.65,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  alignSelf: 'center',
                  color:  CurrentViewMode.Mode_Main_ButtonTextColor,
                  fontWeight: 'bold',
                  fontSize: 17,
                }}
              >
                Senden
              </Text>
            </TouchableOpacity>


				</>


				:

				null


			}

	
	
		   
		  
          </>
        )}
      </Animated.View>

      {/* Main Button to trigger the parent view's bounce effect */}


	  {
		 showTransferBtn == true

		 ?

		 
		<>















{
         CurrentViewMode.Mode_Name !== "The White Theme" || CurrentViewMode.Mode_Name !== "Black Theme"
 

			?

		
			<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.8}
			style={{
			
			  alignItems: 'center',
			   justifyContent: 'center',
			  borderRadius: 10,
			 
			  zIndex: 1,
			  bottom: height(8),
			  right: 30,
			  height: size(55),
			  width: size(55),
			  position: 'absolute',
			  backgroundColor: CurrentViewMode.Mode_Main_ButtonColor,
		   
			}}
		  >
	   
		   <MaterialIcons name='close' style={{
			   color: CurrentViewMode.Mode_Main_ButtonTextColor,
			   alignSelf: 'center',
			   fontSize: size(24)
		   }} />
   
		   
		   
		   
		  </TouchableOpacity>
   



		:


		null


		 }







{
			CurrentViewMode.Mode_Name == "Black Theme"

			?

		<TouchableOpacity
		 onPress={handlePress}
		 activeOpacity={0.8}
		 style={{
		 
		   alignItems: 'center',
			justifyContent: 'center',
		   borderRadius: 10,
		  
		   zIndex: 1,
		   bottom: height(8),
		   right: 30,
		   height: size(55),
		   width: size(55),
		   position: 'absolute',
		   backgroundColor: "#121213" //CurrentViewMode.Mode_HorizontalLine,
		
		 }}
	   >
		

		<MaterialIcons name='close' style={{
			color: CurrentViewMode.Mode_fontColor,
			alignSelf: 'center',
			fontSize: size(24)
		}} />
	
		
		
		
	   </TouchableOpacity>



		:


		null


		 }






{
			CurrentViewMode.Mode_Name == "The White Theme"

			?

			<TouchableOpacity
		 onPress={handlePress}
		 activeOpacity={0.8}
		 style={{
		 
		   alignItems: 'center',
			justifyContent: 'center',
		   borderRadius: 10,
		  
		   zIndex: 1,
		   bottom: height(8),
		   right: 30,
		   height: size(55),
		   width: size(55),
		   position: 'absolute',
		   backgroundColor: "#F1F3F7" //CurrentViewMode.Mode_HorizontalLine,
		
		 }}
	   >
		

		<MaterialIcons name='close' style={{
			color: CurrentViewMode.Mode_fontColor,
			alignSelf: 'center',
			fontSize: size(24)
		}} />
	
		
		
		
	   </TouchableOpacity>



		:


		null


		 }
		 
		
		


		</>

		   :


      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={{
          height: 55,
          alignItems: 'center',
          paddingHorizontal: 15,
          borderRadius: 20,
          flexDirection: 'row',
          zIndex: 1,
          bottom: height(8),
          right: 30,
          width: width(41),
          position: 'absolute',
          backgroundColor: '#fff',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.30,
          shadowRadius: 4.65,
          elevation: 8,
        }}
      >
        <Feather name="arrow-up" style={{ fontSize: 20, color: "#000" }} />
        <Text
          style={{
            alignSelf: 'center',
            color:CurrentViewMode.Mode_Main_ButtonColor,
            fontWeight: 'bold',
            fontSize: 18,
          }}
        >
          Überweisen
        </Text>
      </TouchableOpacity>

	  }
		</>

		 :


	  		
		 <TouchableOpacity
		 onPress={handlePress}
		 activeOpacity={0.8}
		 style={{
			alignItems: 'center',
		   height: size(55),
		   justifyContent: 'center',
		   borderRadius: 20,
		   zIndex: 1,
		   bottom: height(8),
		   paddingHorizontal: 15,
		   right: size(30),
		   width: width(42),
		   flexDirection: 'row',
		   position: 'absolute',
		   backgroundColor: CurrentViewMode.Mode_Main_ButtonColor,
		   shadowColor: '#000',
		   shadowOffset: { width: 0, height: 4 },
		   shadowOpacity: 0.30,
		   shadowRadius: 4.65,
		   elevation: 8,
		 }}
	   >
		 <Animated.View
		   style={{
			 transform: [
			   {
				 translateX: bounceValue.interpolate({
				   inputRange: [0, 1],
				   outputRange: [width(2), 0], // Move from right to left
				 }),
			   },
			 ],
		   }}
		 >
		   <Text
			 style={{
			   
			   color: CurrentViewMode.Mode_Main_ButtonTextColor,
			   fontWeight: 'bold',
			   fontSize: size(18),
			 }}
		   >
			 {t('TransferBtnText')}
		   </Text>
		 </Animated.View>
		 
   
		 <MaterialIcons
		   name="arrow-forward-ios"
		   style={{
			 fontSize: size(20),
			 left: width(2),
			 color: CurrentViewMode.Mode_Main_ButtonTextColor,
		   }}
		 />
	   </TouchableOpacity>
		
		}


		




	
	

  {
IFollowingsCoinsIndex == 0 || CoinPageIndex == 0 || SearchIndex == 0

	?

	null


	:




		<TouchableOpacity
	 onPress={() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
		//handleSnapPress(0)

		SheetManager.show('SearchPage_Sheet');
		setSearchIndex(0); 
		
	}} 
		  style={{
			height: size(55),
			alignItems: 'center',
			justifyContent: 'center',
			paddingHorizontal: 15,
			borderRadius: 20,
			flexDirection: "row",
			zIndex: 1,
			bottom: height(8),
			left: size(30),
			width: width(41),
			position: 'absolute',
			backgroundColor: CurrentViewMode.Mode_Main_ButtonColor,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.30,
			shadowRadius: 4.65,
			elevation: 8,
		  }}>
		 
		  <Text style={{
			
			color: CurrentViewMode.Mode_Main_ButtonTextColor,
			fontWeight: 'bold',
			fontSize: size(18)
		  }}>
		    {t('SearchBtnText')} 
		  </Text>

		  <Feather name="search" style={{
			fontSize: size(20),
			marginLeft: width(2),
			color: CurrentViewMode.Mode_Main_ButtonTextColor,
			//left: size(115),
		  }} />
		</TouchableOpacity>

 }
	  </>

	}

		
		


     

{/*
	
 showTransferBtn == true

 ?

	 <TouchableOpacity style={{
		height: "100%",
		width: "100%",
		backgroundColor: 'transparent',
		position: 'absolute',
	 }}  activeOpacity={0.8}>

	 </TouchableOpacity>

	:

	null


*/}




	
	<Tab.Navigator
	style={{ 
		backgroundColor: CurrentViewMode.Mode_bg,
	}}
	screenOptions={{
		tabBarStyle: {
			marginTop: height(5),
			backgroundColor: CurrentViewMode.Mode_bg,
			paddingHorizontal: 0, // Remove extra padding on the sides
			height: size(50), // Adjust height of the tab bar if needed

			  // 🚫 Remove shadow/elevation (Android + iOS)
			  elevation: 0, // Android
			  shadowOpacity: 0, // iOS
			  shadowOffset: { width: 0, height: 0 }, // iOS
			  shadowColor: 'transparent', // iOS
			  borderTopWidth: 0, // Optional: Remove top border
		  },
		  tabBarActiveTintColor: CurrentViewMode.Mode_fontColor,
		  tabBarInactiveTintColor: CurrentViewMode.Mode_Name == "Black Theme" ? "#3E3F40" : CurrentViewMode.Mode_Sec_fontColor,
		tabBarLabelStyle: { fontSize: size(20), fontWeight: "bold" },
		tabBarItemStyle: { width: "auto" },
		tabBarIndicatorStyle: {
			display: 'none', 
		  },
		
	  }}>
	
	
      <Tab.Screen name="Home" component={HomeTab} />
      <Tab.Screen name="Cash" component={TabOne} />









	
	




	  {
		CurrentViewMode.Mode_Name == "The White Theme"

		?


		<Tab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{
          tabBarLabel: ({ focused }) => (
			<Link
			href="/ProfileTab" // Link directly to the profile tab
			style={{
				marginLeft: width(43), // Keep the same marginLeft
				zIndex: 1000,
				backgroundColor: focused ? '#691AF5' : CurrentViewMode.Mode_Sec_fontColor, // Change background color based on focus state
				borderRadius: 30, // Make it round
				height: 35,
				width: 35,
				alignItems: 'center', // Ensures center alignment for children horizontally
				justifyContent: 'center', // Ensures center alignment for children vertically
				display: 'flex', // Ensure this is set to flex to enable flexbox properties
			}}
			>

				<View style={{ 
				borderRadius: 30, // Make it round
				height: 35,
				width: 35,
				alignItems: 'center', // Ensures center alignment for children horizontally
				justifyContent: 'center', // Ensures center alignment for children vertically
				display: 'flex', // Ensure this is set to flex to enable flexbox properties
			}}
			>




<Text
				style={{
				color: focused ? '#fff' : '#D3DAE0',
				fontSize: size(16),
				fontWeight: "bold",
				textAlign: 'center', // Center text horizontally
				alignSelf: 'center', // Center text vertically
				}}
			>
			 {firstInitial}
			</Text>
			
      	</View>
		  </Link>
		),
	  }}
	/>



	:


	<Tab.Screen
	name="ProfileTab"
	component={ProfileTab}
	options={{
	  tabBarLabel: ({ focused }) => (
		<Link
		href="/ProfileTab" // Link directly to the profile tab
		style={{
			marginLeft: width(43), // Keep the same marginLeft
			zIndex: 1000,
			backgroundColor: focused ? '#fff' : CurrentViewMode.Mode_Name == "Black Theme" ? "#3E3F40" : CurrentViewMode.Mode_Sec_fontColor, // Change background color based on focus state
			borderRadius: 30, // Make it round
			height: 35,
			width: 35,
			alignItems: 'center', // Ensures center alignment for children horizontally
			justifyContent: 'center', // Ensures center alignment for children vertically
			display: 'flex', // Ensure this is set to flex to enable flexbox properties
		}}
		>

			<View style={{ 
			borderRadius: 30, // Make it round
			height: 35,
			width: 35,
			alignItems: 'center', // Ensures center alignment for children horizontally
			justifyContent: 'center', // Ensures center alignment for children vertically
			display: 'flex', // Ensure this is set to flex to enable flexbox properties
		}}
		>






		{
			CurrentViewMode.Mode_Name == "Gray Theme" ||  CurrentViewMode.Mode_Name == "The Green Theme"  ||  CurrentViewMode.Mode_Name == "Honey Theme" || CurrentViewMode.Mode_Name == "The blue based Color Theme"  


			?


			<Text
			style={{
			color: focused ? '#000' : '#ccc',
			fontSize: size(16),
			fontWeight: "bold",
			textAlign: 'center', // Center text horizontally
			alignSelf: 'center', // Center text vertically
			}}
		>
		 {firstInitial}
		</Text>


			:


			null


		}




		{

		CurrentViewMode.Mode_Name == "The Baddie Theme" || CurrentViewMode.Mode_Name == "Black Theme"

		?

		<Text
		style={{
		color: focused ? '#000' : '#999',
		fontSize: size(16),
		fontWeight: "bold",
		textAlign: 'center', // Center text horizontally
		alignSelf: 'center', // Center text vertically
		}}
		>
		 {firstInitial}
		</Text>

		:

		null
		}

				

		{
			CurrentViewMode.Mode_Name == "Purple Rain Theme"  

			?

			<Text
			style={{
			color: focused ? '#000' : '#72598b',
			fontSize: size(16),
			fontWeight: "bold",
			textAlign: 'center', // Center text horizontally
			alignSelf: 'center', // Center text vertically
			}}
		>
			 {firstInitial}
		</Text>

		:


		null


		}
		
		</View>
		</Link>
	  ),
	}}
  />

	}

	  











    </Tab.Navigator>










 
















	


	{/*
		SearchIndex == -1 
		?
		null
		:
		<SlideUpView SearchIndex={SearchIndex}  />

	*/}
	












	<AnalyticsAssetBottomSheet />


		</BottomSheetModalProvider>
		</GestureHandlerRootView>
	</>



);
});

export default Layout;





