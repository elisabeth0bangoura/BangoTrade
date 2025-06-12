
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, Button, UIManager, AppState, Animated, AppStateStatus, Easing, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { height, size, width } from 'react-native-responsive-sizes';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message'; // Import Toast
import { useRouter } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { getAuth, signOut } from "@react-native-firebase/auth";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";



import { BuyConfirmationSheetContextProvider } from './Context/BuyConfirmationSheetContext';

import * as Device from 'expo-device';


import { Search2ContextProvider } from "./Context/SearchIndexStateContext"
import { CoinPageContext, CoinPageContextProvider } from './Context/OpenCoinPageContext';

import { CurrentCoinSelectedContextProvider } from './Context/CurrentCoinSelectedContext';
import { CurrentPriceProvider } from './Context/CurrentCoinPricePageContext';
import { PriceTrackerSheetContextProvider } from './Context/OpenPriceTrackerSheetContext';

import { AmountSheetContextProvider } from './Context/OpenAmountSheetContext';
import { IFollowingsCoinsSheetContextProvider } from './Context/OpenIFollowingsCoinsSheetContext';
import { OpenAddMoreIFollowCoinsContextProvider } from './Context/OpenAddMoreIFollowCoinsContext';
import { SearchContextProvider } from './Context/MainSearchIndexStateContext';
import { AddMoneyToAccountContextProvider } from './Context/AddMoneyToAccountContext';
import { SellAmountSheetContextProvider } from './Context/SellOpenAmountSheetContext';

import { BuyConfirmationSheetContext } from './Context/BuyConfirmationSheetContext';
import AnalyticsAssetBottomSheet from './(tabs)/Home/Insights/Analytics';
import { AnalyticsContextProvider } from './Context/AnalyticsContext';
import { ToastMessageContextProvider, ToastMessageContext } from './Context/ToastMessageContext';
import { HomeChartContextProvider } from './Context/HomeChartContext';


import { SheetProvider } from 'react-native-actions-sheet';
import "../sheets";  // Import the registered sheets
import { HomeContextProvider } from './Context/HomeContext';
import { LogInContextProvider } from './Context/LogInContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrasnactionReceipeProvider } from './Context/TrasnactionReceipeContext';

import { ViewModeContext, ViewModeProvider } from './Context/ViewModeContext';


import * as Notifications from 'expo-notifications';

import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import Constants from 'expo-constants';

import { Platform, Alert } from 'react-native';
import { CashContext, CashContextProvider } from './Context/CashContext';
import Cash from './(tabs)/Cash/cash';

import { StockLineContext, StockLineContextProvider } from './Context/StockLineColor';
import { IndiceListContextProvider } from './Context/IndiceListContext';
import { OptionsListContextProvider } from './Context/OptionsListContext';

import { getDatabase, update, ref, get, onValue  } from "@react-native-firebase/database";
import i18n from '@/Languages_Translation_Screens/i18n';





// ✅ Required by expo-notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});




let inactivityTimer: NodeJS.Timeout | null = null; // ✅ Declare inactivity timer globally


export default function RootLayout() {


  return (
    <>
    

{/*
<Text style={{marginTop: 100,}}>Push Token: {expoPushToken}</Text>
<Button title="📩 Send Local Notification" onPress={sendRemotePush} />
 */ }
      <GestureHandlerRootView> 
      <ToastMessageContextProvider>
      <OptionsListContextProvider>
        <IndiceListContextProvider> 
        <CashContextProvider>
        <StockLineContextProvider> 
        <ViewModeProvider> 
        <TrasnactionReceipeProvider> 
        <LogInContextProvider> 
          <HomeContextProvider>
            <HomeChartContextProvider>
           
                <AnalyticsContextProvider>
                  <SellAmountSheetContextProvider> 
                    <BuyConfirmationSheetContextProvider> 
                      <AddMoneyToAccountContextProvider>
                        <SearchContextProvider>
                          <OpenAddMoreIFollowCoinsContextProvider> 
                            <IFollowingsCoinsSheetContextProvider>
                              <AmountSheetContextProvider> 
                                <PriceTrackerSheetContextProvider>
                                  <CurrentPriceProvider> 
                                    <CurrentCoinSelectedContextProvider>
                                      <CoinPageContextProvider>
                                        <Search2ContextProvider>  
                                          <SheetProvider> 
                                            <RootApp  />
                                          </SheetProvider>
                                        </Search2ContextProvider>
                                      </CoinPageContextProvider>
                                    </CurrentCoinSelectedContextProvider>
                                  </CurrentPriceProvider>
                                </PriceTrackerSheetContextProvider> 
                              </AmountSheetContextProvider>
                            </IFollowingsCoinsSheetContextProvider>
                          </OpenAddMoreIFollowCoinsContextProvider>
                        </SearchContextProvider>
                      </AddMoneyToAccountContextProvider>
                    </BuyConfirmationSheetContextProvider>
                  </SellAmountSheetContextProvider>
                </AnalyticsContextProvider>
            </HomeChartContextProvider>
          </HomeContextProvider>
        </LogInContextProvider>
      </TrasnactionReceipeProvider>
      </ViewModeProvider>
      </StockLineContextProvider>
      </CashContextProvider>
      </IndiceListContextProvider>
      </OptionsListContextProvider>
      </ToastMessageContextProvider>
      </GestureHandlerRootView>
    </>
  );
}  





function RootApp() {

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(false);
  }

 
  const { 
    showToast, 
    setShowToast, 
    ShowToastDeposit, 
    setShowToastDeposit,
    showToastSell, 
    setShowToastSell,
    showChangedPhoneNumber, setshowChangedPhoneNumber,
    ShowChangedEmail, setshowChangedEmail,
    ShowUpdatedPin, setShowUpdatedPin,
    ShowPriceTickerSaved, 
    setShowPriceTickerSaved,
    ShowNoMoneyToWidthraw, setShowNoMoneyToWidthraw
  } = useContext(ToastMessageContext);





  const { 
    CoinPageIndex, 
    setCoinPageIndex,  
    CurrentBackgroundColorForCoin, 
    setCurrentBackgroundColorForCoin, coinData, setCoinData, coinSymbol, setCoinSymbol  } = useContext(CoinPageContext);


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);









  // Define state for available cash and chart data
interface ChartData {
  label: string;
  value: number;
  isEmpty: boolean;
  transactions?: any[];
}



  
 
   

 
  const router = useRouter();
  const auth = getAuth();
 

  const appState = useRef<AppStateStatus>(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState<AppStateStatus>(appState.current);
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [isEnabledFaceId, setIsEnabledFaceId] = useState<boolean>(false);

  


  
    
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

  







  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();




// 🔔 Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // 👈 shows in foreground
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const [expoPushToken, setExpoPushToken] = useState<string>('');
const notificationListener = useRef<Notifications.Subscription | null>(null);
const responseListener = useRef<Notifications.Subscription | null>(null);






useEffect(() => {
  const loadLanguageFromFirebase = async () => {
    try {
      const storedUID = await AsyncStorage.getItem("userUID");
      if (!storedUID) return;

      const uid = JSON.parse(storedUID);
      const langRef = ref(getDatabase(), `users/${uid}/Currentlanguage`);
      const snapshot = await get(langRef);

      const lang = snapshot.val()?.lang;
      if (lang) {
        console.log("🌐 Sprache aus Firebase geladen:", lang);
        i18n.changeLanguage(lang);
      } else {
        console.log("ℹ️ Keine Sprache in Firebase gefunden");
      }
    } catch (err) {
      console.error("❌ Fehler beim Laden der Sprache aus Firebase:", err);
    }
  };

  loadLanguageFromFirebase();
}, []);




useEffect(() => {

  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    console.log('[📩] Notification received in foreground:', notification);
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('[👆] Notification clicked/opened:', response);
  });

  return () => {
    if (notificationListener.current)
      Notifications.removeNotificationSubscription(notificationListener.current);
    if (responseListener.current)
      Notifications.removeNotificationSubscription(responseListener.current);
  };
}, []);

// ✅ Button click sends a remote push to this device
/*const sendRemotePush = async () => {

  const message = {
    to: "ExponentPushToken[z_LsiRIqQWGRKZOdN5Qy9M]",
    sound: 'default',
    title: '📬 Remote Ping!',
    body: 'Hello from your own frontend 💌',
    data: { customData: 'Optional data here' },
  };

  try {
    const response = await fetch('https://checkandnotify-jcraafcjna-uc.a.run.app/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const resData = await response.json();
    console.log('✅ Expo push response:', resData);
    Alert.alert('✅ Push Sent!', 'Check your device');
  } catch (error) {
    console.error('❌ Push error:', error);
    Alert.alert('❌ Failed to send push');
  }
};
*/




// 🔐 Get permissions + token
async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  if (!Device.isDevice) {
    Alert.alert('Must use physical device');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Push notification permission not granted');
    return;
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })
  ).data;

  console.log('[🎯] Got Expo Push Token:', token);

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}



  
// ✅ Load Face ID preference & user ID on mount


useEffect(() => {
  const loadFaceIdPreference = async () => {
    try {
      const storedFaceId = await AsyncStorage.getItem("faceIdEnabled");
      const storedUID = await AsyncStorage.getItem("userUID");

      setIsEnabledFaceId(storedFaceId === "true");

      if (storedUID) {
        console.log("✅ Found stored UID:", storedUID);
      } else {
        console.log("⚠️ No stored user ID.");
      }
    } catch (error) {
      console.error("❌ Error loading Face ID settings:", error);
    }
  };

  loadFaceIdPreference();
}, []);


// ✅ Fetch User Data from Firestore & Sign in User
const fetchUserData = async (uid: string): Promise<void> => {
  try {
    console.log(`📡 Fetching user data for UID: ${uid}`);
    const userDoc = await firestore().collection("users").doc(uid).get();

    if  (userDoc.exists()) {
      console.log("✅ User found - Signing in...");

      // 🔥 Get user email & password from Firestore
      const userData = userDoc.data();
      const email = userData?.email;
      const password = userData?.password; // ✅ Ensure password is stored securely

      if (email && password) {
        console.log("🔑 Signing in user...");
        await auth.signInWithEmailAndPassword(email, password);
        router.replace("/(tabs)/Home/home"); // ✅ Redirect to Home
      } else {
        console.log("⚠️ No email/password found, redirecting to login.");
        await handleSignOut();
      }
    } else {
      console.log("❌ User not found - Logging out");
      await handleSignOut();
    }
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    await handleSignOut();
  }
};










let inactivityTimer: number | null = null; // ✅ move outside useEffect
let backendTriggered = false; // ✅ already correctly placed outside

useEffect(() => {
  const subscription = AppState.addEventListener("change", async (nextAppState: AppStateStatus) => {
    console.log(`🟡 App State Changed: ${nextAppState}`);

    if (nextAppState.match(/inactive|background/)) {
      if (!backendTriggered) {
        backendTriggered = true;

        const triggerNotificationLoop = async () => {
          try {
            await axios.post("https://checkandnotify-jcraafcjna-uc.a.run.app/");
            console.log("🚀 Triggered notification loop");
          } catch (err) {
            console.error("❌ Error triggering notification loop", err);
          }
        };
        triggerNotificationLoop();

        const triggerTransactionCheck = async () => {
          try {
            await fetch("https://getaccountcashandchartdata-jcraafcjna-uc.a.run.app", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                accountId: UserAlpacaAccountId,
                pushToken: UserExpoPushTokenNew,
                PaymentReceivedText1,
                PaymentReceivedText2,
                PaymentReceivedText3,
              }),
            });
            console.log("🚀 Triggered Transaction Check in Foreground");
          } catch (err) {
            console.error("❌ Error Transaction Check in Foreground", err);
          }
        };
        triggerTransactionCheck();

        // reset trigger
        setTimeout(() => {
          backendTriggered = false;
        }, 15000);
      } else {
        console.log("⏳ Skipping duplicate backend trigger");
      }

      console.log("🔴 App is inactive/background - Starting inactivity timer");
      setShowSplash(true);

      if (inactivityTimer) clearTimeout(inactivityTimer);

      if (typeof isEnabledFaceId === "boolean") {
        inactivityTimer = setTimeout(async () => {
          console.log("⏳ 10 minutes of inactivity reached. Checking Face ID...");

          if (isEnabledFaceId) {
            await checkFaceIdAuthentication();
          } else {
            console.log("🚀 Face ID is disabled. Logging out user.");
            await handleSignOut();
          }
        }, 10 * 60 * 1000);
      } else {
        console.log("⚠️ Face ID setting not yet loaded. Skipping inactivity handler.");
      }
    } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      console.log("🟢 App is active - Cancel inactivity timer & hide splash screen");
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
      }
      setShowSplash(false);
    }

    appState.current = nextAppState;
    setAppStateVisible(nextAppState);
  });

  return () => {
    subscription.remove();
    if (inactivityTimer) clearTimeout(inactivityTimer);
  };
}, [
  UserExpoPushTokenNew,
  isEnabledFaceId,
  UserAlpacaAccountId,
  userId,
  PaymentReceivedText1,
  PaymentReceivedText2,
  PaymentReceivedText3,
]);




// ✅ Face ID Authentication

const checkFaceIdAuthentication = async (): Promise<void> => {
  console.log("🔍 Checking Face ID authentication...");

  try {
    const storedUID = await AsyncStorage.getItem("userUID");

    if (!storedUID) {
      console.log("⚠️ No stored UID - Redirecting to login");
      setShowSplash(false);
      router.replace("/(auth)/signUp");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with Face ID",
      fallbackLabel: "Use Passcode",
    });

    if (!result.success) {
      console.log("❌ Face ID failed - Logging out user");
      setShowSplash(false);
      await handleSignOut();
    } else {
      console.log("✅ Face ID successful - Fetching user data...");
      await fetchUserData(storedUID);
      setShowSplash(false);

      // ✅ Navigate explicitly to home tab regardless of current screen
      router.replace("/(tabs)/Home/home");
    }
  } catch (error) {
    console.error("❌ Error during Face ID authentication:", error);
    await handleSignOut();
  }
};

// ✅ Logout Function
const handleSignOut = async (): Promise<void> => {
  console.log("🚪 Logging out user...");
  await signOut(auth);
  setShowSplash(false);
  router.replace("/(auth)/signUp");
};




  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();




  









  






  interface ToastMessageProps {
    message: string;
    color: string;
    visible: boolean;
    status: string;
    onClose: () => void;
    onAnimationEnd?: () => void;
  }
  
  const ToastMessage: React.FC<ToastMessageProps> = ({
    message,
    visible,
    onClose,
    onAnimationEnd,
    color,
    status,
  }) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    const timeoutRef = useRef<number | null>(null);

    const isAnimatingRef = useRef(false); // ✅ prevents duplicate animations




 useEffect(() => {
    if (visible && !isAnimatingRef.current) {
      isAnimatingRef.current = true;

      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
  
      // Clear previous timeout if exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          isAnimatingRef.current = false; // ✅ reset flag
          onClose();
          if (onAnimationEnd) onAnimationEnd();
        });
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [visible]);
  









  if (!visible) return null; // ✅ Prevent unnecessary renders

  return (




    <Animated.View
			style={{
			  transform: [{ translateY }],
			  height: height(20),
			  width: "100%",
			  backgroundColor: color,
			  position: 'absolute',
			  top: 0,
			  zIndex: 100000,
			  justifyContent: "center",
			  paddingHorizontal: 15,
			}}
		  >
			<View style={{ flexDirection: 'row',   marginTop: height(5), alignItems: 'center' }}>

        {
          status == "Success" 
          ?
          <MaterialIcons
          name="check-circle"
          style={{
            color: '#000',
            fontSize: size(25),
            marginRight: width(5),
          }}
          />
          :
          <AntDesign
           name="closecircle"
          style={{
            color: '#000',
            fontSize: size(25),
            marginRight: width(5),
          }}
          />
        }
			 
			  <Text
				style={{
				  fontSize: size(18),
				  fontWeight: "bold",
				  flex: 1,
				}}
			  >
				{message}
			  </Text>
			</View>
		  </Animated.View>
  );
};



const MemoizedToastMessagePriceTickerSaved = ({
  showToast,
  setShowToast,
  coinData,
}: {
  showToast: boolean;
  setShowToast: (value: boolean) => void;
  coinData: any;
}) => {
  if (!showToast) return null;

  return (
    <ToastMessage
      color="#44D700"
      status="Success"
      message={`Successfully saved Price Tracker for ${coinData.name}`}
      visible={showToast}
      onClose={() => {
        console.log("🔥 Closing Toast...");
        setShowToast(false);
      }}
    />
  );
};








const MemoizedToastMessage = ({
  showToast,
  setShowToast,
  coinData,
}: {
  showToast: boolean;
  setShowToast: (value: boolean) => void;
  coinData: any;
}) => {
  if (!showToast) return null;

  return (
    <ToastMessage
    message="Order placed."
    color='#44D700'
    status="Success"
      visible={showToast}
      onClose={() => {
        console.log("🔥 Closing Toast...");
        setShowToast(false);
      }}
    />
  );
};









const MemoizedToastMessageDeposit = ({
  showToast,
  setShowToast,
  coinData,
}: {
  showToast: boolean;
  setShowToast: (value: boolean) => void;
  coinData: any;
}) => {
  if (!showToast) return null;

  return (
    <ToastMessage
    message="Deposit successful"
         color='#44D700'
          status="Success"
      visible={showToast}
      onClose={() => {
        console.log("🔥 Closing Toast...");
        setShowToast(false);
      }}
    />
  );
};







const MemoizedToastMessageSell = ({
  showToast,
  setShowToast,
  coinData,
}: {
  showToast: boolean;
  setShowToast: (value: boolean) => void;
  coinData: any;
}) => {
  if (!showToast) return null;

  return (
    <ToastMessage
    message="Sell order placed"
    color='#44D700'
    status="Success"
      visible={showToast}
      onClose={() => {
        console.log("🔥 Closing Toast...");
        setShowToast(false);
      }}
    />
  );
};










const MemoizedToastMessageCHnagePhoneNumber = ({
  showToast,
  setShowToast,
  coinData,
}: {
  showToast: boolean;
  setShowToast: (value: boolean) => void;
  coinData: any;
}) => {
  if (!showToast) return null;

  return (
    <ToastMessage
    color='#44D700'
       status="Success"
        message="Successfully updated phone number"
      visible={showToast}
      onClose={() => {
        console.log("🔥 Closing Toast...");
        setShowToast(false);
      }}
    />
  );
};











const MemoizedToastMessageCHnageEmail = ({
  showToast,
  setShowToast,
  coinData,
}: {
  showToast: boolean;
  setShowToast: (value: boolean) => void;
  coinData: any;
}) => {
  if (!showToast) return null;

  return (
    <ToastMessage
    color='#44D700'
       status="Success"
        message="Successfully updated E-mail address"
      visible={showToast}
      onClose={() => {
        console.log("🔥 Closing Toast...");
        setShowToast(false);
      }}
    />
  );
};








const MemoizedToastMessageChangePin = ({
  showToast,
  setShowToast,
  coinData,
}: {
  showToast: boolean;
  setShowToast: (value: boolean) => void;
  coinData: any;
}) => {
  if (!showToast) return null;

  return (
    <ToastMessage
    color='#44D700'
    status="Success"
     message="Successfully updated Pin"
      visible={showToast}
      onClose={() => {
        console.log("🔥 Closing Toast...");
        setShowToast(false);
      }}
    />
  );
};











const NoMoneyToWidthraw = ({
  showToast,
  setShowToast,
  coinData,
}: {
  showToast: boolean;
  setShowToast: (value: boolean) => void;
  coinData: any;
}) => {
  if (!showToast) return null;

  return (
    <ToastMessage
    color='#FE1B20' 
    status="Error"
     message={`It looks like there's no balance available for withdrawal.`}
      visible={showToast}
      onClose={() => {
        console.log("🔥 Closing Toast...");
        setShowToast(false);
      }}
    />
  );
};







  return (
    <>

    

{showSplash && (
      <View style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 9999,
          justifyContent: "center",
          alignItems: "center",
      }}>
        <BlurView intensity={100} style={{
           position: "absolute",
           width: "100%",
           height: "100%",
        }} tint="dark" />
        <Image source={require("../assets/images/icon.png")} style={{
           width: 120,
           height: 120,
           resizeMode: "contain",
        }} />
      </View>
    )}

     
  {/* ✅ Toast Message - Always Visible on Top */}

  <MemoizedToastMessagePriceTickerSaved
        showToast={ShowPriceTickerSaved}
        setShowToast={setShowPriceTickerSaved}
        coinData={{ name: coinData.name }} // optional dummy if needed
      />


<MemoizedToastMessage
        showToast={showToast}
        setShowToast={setShowToast}
        coinData={{ name: coinData.name }} // optional dummy if needed
      />






<MemoizedToastMessageDeposit
        showToast={ShowToastDeposit}
        setShowToast={setShowToastDeposit}
        coinData={{ name: coinData.name }} // optional dummy if needed
      />








<MemoizedToastMessageSell
        showToast={showToastSell}
        setShowToast={setShowToastSell}
        coinData={{ name: coinData.name }} // optional dummy if needed
      />








<MemoizedToastMessageCHnagePhoneNumber
        showToast={showChangedPhoneNumber}
        setShowToast={setshowChangedPhoneNumber}
        coinData={{ name: coinData.name }} // optional dummy if needed
      />








<MemoizedToastMessageCHnageEmail
        showToast={ShowChangedEmail}
        setShowToast={setshowChangedEmail}
        coinData={{ name: coinData.name }} // optional dummy if needed
      
      />








<MemoizedToastMessageChangePin
        showToast={ShowUpdatedPin}
        setShowToast={setShowUpdatedPin}
        coinData={{ name: coinData.name }} // optional dummy if needed
      
      />








<MemoizedToastMessageChangePin
        showToast={ShowNoMoneyToWidthraw}
        setShowToast={setShowNoMoneyToWidthraw}
        coinData={{ name: coinData.name }} // optional dummy if needed
      
      />


{/* Statusbar */}

{
  CurrentViewMode.Mode_Name == "The White Theme"  || CurrentViewMode.Mode_Name == "The blue based Color Theme" || CurrentViewMode.Mode_Name == "The Baddie Theme"

  ?

  <StatusBar style="dark" backgroundColor="#0C1014" />

  :

  null

}


{
  CurrentViewMode.Mode_Name == "Black Theme" ||  CurrentViewMode.Mode_Name == "Honey Theme" ||  CurrentViewMode.Mode_Name == "The Green Theme" ||  CurrentViewMode.Mode_Name == "Gray Theme" || CurrentViewMode.Mode_Name == "Purple Rain Theme" 

  ?

  <StatusBar style="light" backgroundColor="#0C1014" />

  :

  null

}




    

     





<Stack screenOptions={{headerShown: false}} >
  {/* Splash screen (home page) */}
  <Stack.Screen name="index" options={{ headerShown: false }} />
  


  {/* Tabs screen */}
  <Stack.Screen name="tabs" options={{ headerShown: false }} />



  

  {/* Tabs screen */}
  <Stack.Screen name="(learn)/learn" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/coursePageBTC" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/coursePageETH_SmartContracts" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/coursePage_Altcoins" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/coursePage_DeFi" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/coursePage_CryptoWalletSecurity" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/coursePage_NFTsDigitalArt" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/coursePage_CryptoTradingBasic" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/coursePage_BlockchainCryptoRegulation" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/coursePage_FutureCryptocurrencies" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/coursePage_CrytoTaxAccounting" options={{ headerShown: false }} />
  
  
  
  
  
  <Stack.Screen name="(coin)" options={{ headerShown: false }} />


  


  <Stack.Screen name="(learn)/artikelPageBTC" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/artikelUnderstandingAltcoins" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/artikelDeFi" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/artikelCryptoWalletsSecurity" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/artikelNFTsandDigitalArt" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/artikelCryptoTradingBasics" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/artikelBlockchainCryptoRegulation" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/artikelFutureCryptocurrencies" options={{ headerShown: false }} />
  <Stack.Screen name="(learn)/articleCryptoTaxesAccounting" options={{ headerShown: false }} />

  
  
  
  
  {/* Auth-related screens */}
  <Stack.Screen name="auth/signUp" options={{ headerShown: false }} />
  
  {/* Fallback or Not Found */}
  <Stack.Screen name="404" options={{ headerShown: false }} />
</Stack>
    </>

    
  );
}