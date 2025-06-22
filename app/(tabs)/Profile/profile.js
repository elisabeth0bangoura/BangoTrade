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
import i18n from '../../../Languages_Translation_Screens/i18n'; 
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

import { HomeChartContext } from '../../Context/HomeChartContext';

import { AmountContext } from '../../Context/OpenAmountSheetContext';
import { CoinPageContext } from '../../Context/OpenCoinPageContext';
import { SellAmountContext } from '../../Context/SellOpenAmountSheetContext';
import RNPickerSelect from "react-native-picker-select";

import { LinearGradient } from 'expo-linear-gradient';
import { HomeContext } from '../../Context/HomeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ViewModeContext } from '../../Context/ViewModeContext';

import firestore from '@react-native-firebase/firestore';
import { usePostHog } from 'posthog-react-native';

import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";








const Profile = ({openSheet}) => {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


	const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  


    const { t } = useTranslation();

    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);



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
  
    
    



    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
      }
    };





  useEffect(() => {
    posthog.capture('screen_viewed', {
      screen: 'Profile',
      $screen_name: 'Profile',
      timestamp: new Date().toISOString(),
    });
  }, []);
  




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
    






    // Listen for authentication state changes
    useEffect(() => {
      const auth = getAuth(); // ✅ Initialize Firebase Auth
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
        
          
          console.log("✅ User logged in:", user.uid);
        } else {
        
          
        }
      });
  
      // Function to fetch user language from Firebase
      const getLangOfUser = async () => {
        if (user) {
          try {
            const db = getDatabase(); // ✅ Initialize Firebase Database
            const langRef = ref(db, `/users/${user}/Currentlanguage`);
            const snapshot = await get(langRef);
  
            const lang = snapshot.exists() ? snapshot.val().lang : null;
            console.log("🌍 User language from Firebase:", lang);
  
            if (lang) {
              setUserLang(lang); // ✅ Set stored language
            } else {
              const deviceLocale = RNLocalize.getLocales()[0]?.languageCode || "en";
              setUserLang(deviceLocale); // ✅ Set to device locale if no Firebase data
            }
          } catch (error) {
            console.error("❌ Error fetching language:", error);
            const deviceLocale = RNLocalize.getLocales()[0]?.languageCode || "en";
            setUserLang(deviceLocale);
          }
        }
      };
  
      if (user) {
        getLangOfUser(); // ✅ Fetch language if user is logged in
      }
  
      return () => unsubscribe(); // ✅ Cleanup on unmount
    }, [user]); // ✅ Runs when user state changes ✅ CORRECTLY CLOSED
  
 


  useEffect(() => {
    // Update the language only if the userLang has been set and it differs from the current language
    if (UserLang && UserLang !== i18n.language) {
        i18n.changeLanguage(UserLang); // Change language in i18n
      console.log('Language set to:', UserLang); // Debugging output
    }


   }, [UserLang]); // Trigger language change when userLang changes
	






// Format price with commas and the Euro symbol
const formatPrice = (price) => {
  return new Intl.NumberFormat('us-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};




  useEffect(() => {
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
          `https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/${AlpacaUserId}/account`,
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
  
  
  }, [Sum, AlpacaUserId]) // ✅ Runs only on mount





	return (
    <GestureHandlerRootView style={{
      backgroundColor: CurrentViewMode.Mode_bg,
   }}>



<BottomSheetModalProvider style={{
   backgroundColor: CurrentViewMode.Mode_bg,
  
}}>





 <ScrollView style={{
    height: "100%",
    width: "100%",
   
  }}
  contentContainerStyle={{
      paddingBottom: height(25),

      backgroundColor: CurrentViewMode.Mode_bg,
    }}>


    <Text style={{
        fontSize: size(16),
        marginTop: height(2),
        fontWeight: "bold",
        marginLeft: width(5),
        color: CurrentViewMode.Mode_Sec_fontColor

    }}>
        {t("PersonalHeader")}
    </Text>


    <Text style={{
        fontSize: size(30),
        marginTop: height(2),
        fontWeight: "bold",
        marginLeft: width(5),
         color: CurrentViewMode.Mode_fontColor

    }}>
       {UserFirstName} {UserLastName}
    </Text>

  
  

{/*
  <TouchableOpacity
        style={{
            marginTop: height(3),
            borderRadius: 10,
            height: height(25),
            overflow: 'hidden',
            alignSelf: 'center',
            backgroundColor: '#fff',
            width: "90%",
        }}>
      
  
   

        </TouchableOpacity>


    
        <Text style={{
            marginTop: height(7),
            fontSize: size(22),
            marginBottom: height(2),
            fontWeight: "bold",
            marginLeft: width(5),
            color: "#F8F9F9",
           
        }}>
            {t("AccountHeader")}
        </Text>

*/}






      
      <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        marginLeft: width(5),
        marginTop: height(3),
        fontWeight: "600",
      }}>

      {t("ProfileHeader")}  
      
      </Text>






      <TouchableOpacity onPress={() => {

        posthog.capture('open_account_details_bottomsheet', {
          screen: 'Profile',
          $screen_name: 'Profile',
          timestamp: new Date().toISOString(),

          });

        SheetManager.show("AccountDetails_Sheet")
      }}
      style={{
        width: "90%",
        marginLeft: width(5),
        marginTop: height(2),
        flexDirection: 'row',
        alignItems: 'center',
      }}>


        <View style={{
       //   backgroundColor: 'yellow',
          height: size(50),
          width: size(50),
          alignItems: 'center',
          justifyContent: 'center'
        }}>

    
  
        <AntDesign name='user' style={{
          color: CurrentViewMode.Mode_fontColor,
          fontSize: size(22),

        }} />

      </View>

      <View >

        <Text style={{
          marginLeft: width(5),
          fontWeight: "bold",
          color: CurrentViewMode.Mode_fontColor,
          marginBottom: height(1)
        }}>
        
       {t("MyAccountHeader")}
        </Text>

        <Text style={{
          marginLeft: width(5),
          fontSize: size(13),
          fontWeight: "bold",
          color: CurrentViewMode.Mode_Sec_fontColor,
        }}>
         {Depot_number}
        </Text>
       
        </View>


        <MaterialIcons name='keyboard-arrow-right' style={{
          color: CurrentViewMode.Mode_Sec_fontColor,
          fontSize: size(30),
          position: 'absolute',
          right: width(0),
        }} />

      
      </TouchableOpacity>






      <TouchableOpacity style={{
        width: "90%",
        marginLeft: width(5),
        marginTop: height(4),
        flexDirection: 'row',
        alignItems: 'center',
      }}>


        <View style={{
       //   backgroundColor: 'yellow',
          height: size(50),
          width: size(50),
          alignItems: 'center',
          justifyContent: 'center'
        }}>

    
  
        <AntDesign name='setting' style={{
          color: CurrentViewMode.Mode_fontColor,
          fontSize: size(22),

        }} />

      </View>

      <TouchableOpacity onPress={() => {
           posthog.capture('open_settings_bottomsheet', {
            screen: 'Profile',
            $screen_name: 'Profile',
            timestamp: new Date().toISOString(),
  
            });
        SheetManager.show("Settings_Sheet")
      }}
      style={{
        
        }}>

        <Text style={{
          marginLeft: width(5),
          fontWeight: "bold",
          color: CurrentViewMode.Mode_fontColor,
          marginBottom: height(1)
        }}>

          {t("SettingsHeader")}
      
        </Text>

        <Text style={{
          width: width(60),
          marginLeft: width(5),
          fontSize: size(13),
          fontWeight: "bold",
          color: CurrentViewMode.Mode_Sec_fontColor,
        }}>

        {t("SettingsSubHeader")}
       
        </Text>
       
        </TouchableOpacity>


        <MaterialIcons name='keyboard-arrow-right' style={{
          color: CurrentViewMode.Mode_Sec_fontColor,
          fontSize: size(30),
          position: 'absolute',
          right: width(0),
        }} />

      
      </TouchableOpacity>


      
      












  <TouchableOpacity onPress={() => {

  posthog.capture('open_help_bottomsheet', {
    screen: 'Profile',
    $screen_name: 'Profile',
    timestamp: new Date().toISOString(),

    });
    
    SheetManager.show("Help_Sheet")
   }}
      style={{
        width: "90%",
        marginLeft: width(5),
        marginTop: height(4),
        flexDirection: 'row',
        alignItems: 'center',
      }}>


        <View style={{
       //   backgroundColor: 'yellow',
          height: size(50),
          width: size(50),
          alignItems: 'center',
          justifyContent: 'center'
        }}>

    
  
        <Feather name='help-circle' style={{
          color: CurrentViewMode.Mode_fontColor,
          fontSize: size(22),

        }} />

      </View>

      <View style={{
        
        }}>

        <Text style={{
          marginLeft: width(5),
          fontWeight: "bold",
          color: CurrentViewMode.Mode_fontColor,
          marginBottom: height(1)
        }}>

        {t("HelpHeader")}

        </Text>

        <Text style={{
          width: width(50),
          marginLeft: width(5),
          fontSize: size(13),
          fontWeight: "bold",
          color: CurrentViewMode.Mode_Sec_fontColor,
        }}>

        {t("CustomerServiceHeader")}
       
        </Text>
       
        </View>


        <MaterialIcons name='keyboard-arrow-right' style={{
          color: CurrentViewMode.Mode_Sec_fontColor,
          fontSize: size(30),
          position: 'absolute',
          right: width(0),
        }} />

      
      </TouchableOpacity>








           
      <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        marginLeft: width(5),
        marginTop: height(5),
        fontWeight: "600",
      }}>

      {t("MoreHeader")}
      </Text>



      <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingLeft: width(5),
        paddingBottom: height(20)
      }}
      style={{
        height: height(20),
        width: "100%",
        marginTop: height(2),
       // backgroundColor: 'orange'
      }}>

        <TouchableOpacity  onPress={() => {

        posthog.capture('open_activity_bottomsheet', {
          screen: 'Profile',
          $screen_name: 'Profile',
          timestamp: new Date().toISOString(),

          });

          SheetManager.show("Activity_Sheet")
        }}
        style={{
          backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
          height: height(18),
          width: width(35),
          borderRadius: size(15),
          marginRight: width(5),
        }}>

<Fontisto name='heartbeat-alt' 
          style={{
            color: CurrentViewMode.Mode_Name == "The White Theme" ?  CurrentViewMode.Mode_InvestInsight_IconColor_Home : CurrentViewMode.Mode_fontColor,
            fontSize: size(28),
            marginTop: height(3),
            marginLeft: width(5),
          }}/>
          

        <Text style={{
          position: 'absolute',
          color: CurrentViewMode.Mode_fontColor,
          marginLeft: width(5),
          fontWeight: "bold",
          width: "70%",
          bottom: height(4)
        }}>

        {t("ActivityHeader")}
          
        </Text>
          
        </TouchableOpacity>





        <TouchableOpacity onPress={() => {


        posthog.capture('open_total_asset_bottomsheet', {
          screen: 'Profile',
          $screen_name: 'Profile',
          timestamp: new Date().toISOString(),

          });


          SheetManager.show("TotalAsset_Sheet")
        }}
        style={{
          backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
          height: height(18),
          width: width(35),
          borderRadius: size(15),
          marginRight: width(5),
        }}>

          <Text style={{
            color: CurrentViewMode.Mode_fontColor,
            marginLeft: width(5),
            marginTop: height(3),
            fontSize: size(18),
            fontWeight: "bold"
          }}>
           {formatPrice(Sum) == "NaN" ? "0.00 $" : formatPrice(Sum)}
          </Text>
          


          <Text numberOfLines={1} style={{
          position: 'absolute',
          color: CurrentViewMode.Mode_fontColor,
          marginLeft: width(5),
          fontWeight: "bold",
          width: "70%",
          bottom: height(4)
        }}>
           {t("TotalAssetsHeader")}
         
        </Text>

        </TouchableOpacity>


        <TouchableOpacity onPress={() => {

        posthog.capture('open_portfolio_statements_bottomsheet', {
          screen: 'Profile',
          $screen_name: 'Profile',
          timestamp: new Date().toISOString(),

          });

          SheetManager.show("PortfolioStatements_Sheet")
        }}
        style={{
          backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
          height: height(18),
          width: width(35),
          borderRadius: size(15),
          marginRight: width(5),
        }}>

          <Foundation name='paperclip' 
          style={{
            color:  CurrentViewMode.Mode_fontColor,
            fontSize: size(25),
            marginTop: height(3),
            marginLeft: width(5),
          }}/>
          

          <Text style={{
          position: 'absolute',
          color: CurrentViewMode.Mode_fontColor,
          marginLeft: width(5),
          fontWeight: "bold",
          width: "70%",
          bottom: height(4)
        }}>

        {t("PortfolioStatementHseader")}

        </Text>

        </TouchableOpacity>


      </ScrollView>
      </View>




      


        <TouchableOpacity onPress={() => {


    posthog.capture('sign_out', {
      screen: 'Profile',
      $screen_name: 'Profile',
      timestamp: new Date().toISOString(),

      });


        const handleSignOut = async () => {
          try {
            console.log("🚪 Logging out user...");

            // Firebase sign out
            await signOut(auth).catch((err) => {
              if (err.code !== "auth/no-current-user") {
                throw err;
              }
              console.log("ℹ️ Already signed out.");
            });

            // Clear local storage
            await AsyncStorage.multiRemove(["userUID", "faceIdEnabled", "lastAuthTime"]);

            // Reset splash
            setShowSplash(false);

            // Navigate to Auth
            router.replace("/(auth)/signUp");
          } catch (e) {
            console.error("❌ Fehler beim Abmelden:", e);
            Alert.alert("Fehler", "Abmeldung fehlgeschlagen.");
          }
        };
        handleSignOut()
        }}
        style={{
        
             paddingVertical: size(12),
             top: height(3),
             paddingHorizontal: size(20),
             flexDirection: "row"
        }}>

            <MaterialCommunityIcons name='door-closed' style={{
                fontSize: size(20),
                color: "#FF0000",
            }} />

            <Text style={{
                fontSize: size(15),
                marginLeft: size(10),
                fontWeight: "bold",
                color: "#FF0000",
            }}>

            {t("LogOutButtonHseader")}

            </Text>
        </TouchableOpacity>


     


    <View style={{
      alignSelf: 'center',
      marginTop: height(8)
    }}> 

    <View style={{
      height: size(25),
      width: size(25),
      alignSelf: 'center',
    }}>



{
        CurrentViewMode.Mode_Name == "The White Theme"

        ?

        <Image source={require("../../../assets/Logo_Icon_grey.png")}
        style={{
          height: "100%",
          width: "100%",
          resizeMode: 'contain'
        }} />

        :

        null
      }




{
        CurrentViewMode.Mode_Name == "Black Theme"

        ?

        <Image source={require("../../../assets/Logo_Icon_black.png")}
        style={{
          height: "100%",
          width: "100%",
          resizeMode: 'contain'
        }} />

        :

        null
      }









{
        CurrentViewMode.Mode_Name == "The Baddie Theme"

        ?

        <Image source={require("../../../assets/Logo_Icon_pink.png")}
        style={{
          height: "100%",
          width: "100%",
          resizeMode: 'contain'
        }} />

        :

        null
      }







{
        CurrentViewMode.Mode_Name == "Gray Theme"

        ?

        <Image source={require("../../../assets/Logo_Icon_grayTheme.png")}
        style={{
          height: "100%",
          width: "100%",
          resizeMode: 'contain'
        }} />

        :

        null
      }
     
     
     





{
        CurrentViewMode.Mode_Name == "Purple Rain Theme"

        ?

        <Image source={require("../../../assets/Logo_Icon_purple.png")}
        style={{
          height: "100%",
          width: "100%",
          resizeMode: 'contain'
        }} />

        :

        null
      }
     












     {
        CurrentViewMode.Mode_Name == "The Green Theme"

        ?

        <Image source={require("../../../assets/Logo_Icon_green.png")}
        style={{
          height: "100%",
          width: "100%",
          resizeMode: 'contain'
        }} />

        :

        null
      }
     










     {
        CurrentViewMode.Mode_Name == "The blue based Color Theme"

        ?

        <Image source={require("../../../assets/Logo_Icon_bluebased.png")}
        style={{
          height: "100%",
          width: "100%",
          resizeMode: 'contain'
        }} />

        :

        null
      }







      {
        CurrentViewMode.Mode_Name == "Honey Theme"

        ?

        <Image source={require("../../../assets/Honey_logo_theme.png")}
        style={{
          height: "100%",
          width: "100%",
          resizeMode: 'contain'
        }} />

        :

        null
      }
     
    </View>
     <Text style={{
      marginTop: height(1),
       color:  CurrentViewMode.Mode_Sec_fontColor,
     }}>
      {t("AppVersionHseader")} 0.000.1
      
     </Text>
     </View>

   </ScrollView>

    </BottomSheetModalProvider>

    </GestureHandlerRootView>
	);
};
export default Profile;