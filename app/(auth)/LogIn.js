import React, {
	useCallback,
	useEffect,
	useState,
	useMemo,
	useRef,
	useContext,
  } from 'react';
  import {
	Text,
	View,
	StyleSheet,
	KeyboardAvoidingView,
	TextInput,
	Image,
	TouchableWithoutFeedback,
	Keyboard,
	Button,
	Animated,
	Dimensions,
	Platform,
	ActivityIndicator,
	Modal,
	TouchableOpacity,
	FlatList,
	ScrollView,
  } from 'react-native';
  import { Link, useRouter } from 'expo-router';
  import Swiper from 'react-native-swiper';
  import { fontSize, height, size, width } from 'react-native-responsive-sizes';
  import * as Haptics from 'expo-haptics';
  import { GestureHandlerRootView } from 'react-native-gesture-handler';
  import Constants from 'expo-constants';
  import LottieView from 'lottie-react-native';
  import uuid from 'react-native-uuid';

  // ---- 1) Imports for BottomSheet + CountryPicker ----
  import {
	BottomSheetModalProvider,
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetFlashList,
	BottomSheetView,
  } from '@gorhom/bottom-sheet';
  import { CountryPicker, CountryButton } from 'react-native-country-codes-picker';
  import CountryFlag from "react-native-country-flag";
  import { AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
  import { BlurView } from 'expo-blur';
  import debounce from 'lodash.debounce';
import axios from 'axios';
import { Easing } from 'react-native-reanimated'; // Use Easing from react-native-reanimated
import { OtpInput } from "react-native-otp-entry";
import { NetworkInfo } from "react-native-network-info";


import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AnimatedHeader from 'react-native-animated-header';


import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc } from '@react-native-firebase/firestore';
import { getDatabase, ref, set, get, serverTimestamp, remove } from '@react-native-firebase/database';



import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Switch } from 'react-native-switch';
import {
	Onfido,
	OnfidoCaptureType,
	OnfidoCountryCode,
	OnfidoDocumentType,
  } from '@onfido/react-native-sdk'; 
import { color, ribbon } from 'd3';

import Pin from "./PinComponents/Pin"
import { LogInContext } from '../Context/LogInContext';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';
import { useTranslation } from 'react-i18next';
import { ViewModeContext } from '../Context/ViewModeContext';















  
  export default function LogIn() {



	const { t, i18n } = useTranslation();

	const currentLanguage = i18n.language;
  
	const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

    

	const LogIn_Sheet = useRef(null);
 
    

	// At the top of your Index component
	const phoneInputRef = useRef(null);
	const phoneInputRefLogIn = useRef(null);
    const otpInputRef = useRef(null); // Ref to the OTP input

	const EmailInputRef = useRef(null)

    
	const [sheetIndex, setSheetIndex] = useState(-1);


	const {CurrentCode, setCurrentCode} = useContext(LogInContext);
	const [keyboardVisible, setKeyboardVisible] = useState(false);
  const {PhonenumberLogIn, setPhonenumberLogIn} = useContext(LogInContext)



 
	  const [code, setCode] = useState();

      
	const [isTextFocused, setIsTextFocused] = useState(false);
	const [isNumberFocused, setisNumberFocused] = useState(false);


    
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [Postal_code, setPostal_code] = useState()

	const [iso, setIso] = useState('')

	const [UserIPAddress, setUserIPAddress] = useState()



	  const [user, setUser] = useState();
	  const [showToast, setShowToast] = React.useState(false);
	  const [currentPage, setCurrentPage] = useState(0); // Track current page
	  const [currentPageLogIn, setcurrentPageLogIn] = useState(0); // Track current page

	  const translateX = useRef(new Animated.Value(0)).current; // Animation value


	  const translateXLogin = useRef(new Animated.Value(0)).current; // Animation value


	  

      



	  // Get user Local Ip address

	  useEffect(()  => {


		NetworkInfo.getIPAddress().then(ipAddress => {
		
			setUserIPAddress(ipAddress)
		  })
		  console.log("Local IP Address:", UserIPAddress);


	  }, [])





      
    


  // Location Verification

  useEffect(() => {
    async function getCurrentLocation() {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);



  


  











	// callbacks
	const handlePresentModalPress = useCallback(() => {
	  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      SheetManager.show("Country_Sheet")
	 // setisSheetOpenPhoneNumber(true);
	//  bottomSheetModalRefPhoneNumber.current?.present();
	 // setsheetIndexPhonenumber(1);
	  // Hide the keyboard when opening the Country Picker modal
	  Keyboard.dismiss();
	}, []);
  

    

	
	// ---- 6) Focus Phone Input when Main Sheet is Opened ----
	useEffect(() => {
	  if (sheetIndex === 1) { // Adjust based on your sheet index logic
		// Delay to ensure the modal is fully presented
		setTimeout(() => {
		  phoneInputRef.current?.focus();
		}, 500); // 500ms delay; adjust as needed
	  }
	}, [sheetIndex]);
  
	// ---- 7) Keyboard Event Handlers ----
	useEffect(() => {
	  const keyboardShowListener = Keyboard.addListener(
		Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
		() => {
		  setKeyboardVisible(true);
		}
	  );
	  const keyboardHideListener = Keyboard.addListener(
		Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
		() => {
		  setKeyboardVisible(false);
		}
	  );
  
	  // Cleanup listeners on unmount
	  return () => {
		keyboardShowListener.remove();
		keyboardHideListener.remove();
	  };
	}, []);

    


          
  
      


      

	  const ToastMessage = ({ message, onClose }) => {
		const translateY = useRef(new Animated.Value(-height(20))).current;
	  
		// Slide-in animation
		const showToast = () => {
		  Animated.timing(translateY, {
			toValue: 0, // Slide down to visible
			duration: 500,
			easing: Easing.out(Easing.ease),
			useNativeDriver: true,
		  }).start(() => {
			// Hide toast after 5 seconds
			setTimeout(() => {
			  Animated.timing(translateY, {
				toValue: -height(20), // Slide back up
				duration: 500,
				easing: Easing.in(Easing.ease),
				useNativeDriver: true,
			  }).start(onClose); // Call onClose callback when animation completes
			}, 5000);
		  });
		};
	  
		React.useEffect(() => {
		  showToast();
		}, []);
	  
		return (
		  <Animated.View
			style={{
			  transform: [{ translateY }],
			  height: height(20),
			  width: "100%",
			  backgroundColor: "#FF006C",
			  position: 'absolute',
			  top: 0,
			  zIndex: 1000,
			}}
		  >
			<View
			  style={{
				marginTop: height(10),
				flexDirection: 'row',
				alignItems: 'center',
			  }}
			>
			  <MaterialIcons
				name="error"
				style={{
				  color: '#000',
				  fontSize: size(25),
				  marginLeft: width(10),
				}}
			  />
			  <Text
				style={{
				  fontSize: size(20),
				  width: "50%",
				  fontWeight: "bold",
				  marginLeft: width(5),
				}}
			  >
				{message}
			  </Text>
			</View>
		  </Animated.View>
		);
	  };







	  useEffect(() => {
		console.log("hello ", currentPageLogIn)
	  }, [])






  	// Next Page LogIn Bottomsheet function
	  const LoginslideToNextPage = () => {
		if (currentPageLogIn < LogIn_slides.length - 1) {
		  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		  Animated.timing(translateXLogin, {
			toValue: -(currentPageLogIn + 1) * Dimensions.get("window").width,
			duration: 300,
			useNativeDriver: true,
		  }).start(() => setcurrentPageLogIn((prev) => prev + 1));
		}
	  };
	  
	  const LoginslideToPreviousPage = () => {
		if (currentPageLogIn > 0) {
		  Animated.timing(translateXLogin, {
			toValue: -(currentPageLogIn - 1) * Dimensions.get("window").width,
			duration: 300,
			useNativeDriver: true,
		  }).start(() => setcurrentPageLogIn((prev) => prev - 1));
		}
	  };




	


		  
		  


		  useEffect(() => {
			const timeout = setTimeout(() => {
				if (currentPage === 1 && otpInputRef.current ) {
					console.log("Focusing OTP  test input");
	
						otpInputRef.current.focus();
				
				}


				else if (currentPageLogIn === 0 && phoneInputRefLogIn.current) {
					console.log("Focusing Email input");
					Keyboard.dismiss();
				  }  
				

				else if (currentPageLogIn === 1 && phoneInputRefLogIn.current) {
					console.log("Focusing Email input");
					Keyboard.dismiss();
				  }  
			
			
			}, 500); // Ensure enough delay for slide rendering
		  
			return () => clearTimeout(timeout);
		  }, [currentPage]);
		  

		  

		  
		  




		  useEffect(() => {
			if (EmailInputRef.current) {
			  console.log("EmailInputRef is attached:", EmailInputRef.current);
			} else {
			  console.log("EmailInputRef is NOT attached!");
			}
		  }, [EmailInputRef.current]);
		  





		  // animted Scroll heder for Just a few more questions

		  const scrollY = useRef(new Animated.Value(0)).current;

		  const HEADER_HEIGHT = 80; // Adjust as needed
		  const TITLE_SWITCH_POINT = 50; // Scroll position where title changes
		
		  const headerHeight = scrollY.interpolate({
			inputRange: [0, HEADER_HEIGHT],
			outputRange: [HEADER_HEIGHT, 50],
			extrapolate: "clamp",
		  });
		
		  const titleOpacity = scrollY.interpolate({
			inputRange: [0, TITLE_SWITCH_POINT],
			outputRange: [1, 0],
			extrapolate: "clamp",
		  });
		
		  const newTitleOpacity = scrollY.interpolate({
			inputRange: [TITLE_SWITCH_POINT, TITLE_SWITCH_POINT + 30],
			outputRange: [0, 1],
			extrapolate: "clamp",
		  });
		

		  






// Use the useEffect to dismiss the keyboard when the second slide is active
useEffect(() => {
	if (currentPageLogIn === 1) {
	  Keyboard.dismiss(); // Dismiss keyboard when second slide (id: 2) is active
	}
  }, [currentPageLogIn]);
  


	  const LogIn_slides  = useMemo(
		() => [
		{

			id: 1,
			content: (
				<View style={{ width: width(100), padding: 16 }}>

				

			<Text style={{
				fontSize: size(25),
				fontWeight: "bold",
				color: CurrentViewMode.Mode_fontColor,
				marginTop: height(5),
				width:  currentLanguage == "fr" ? "80%" : "60%",
				lineHeight: 25,
				marginLeft: width(10),
			}}>
			   {t("HeyPhoneNumberTextLogIn")} 
			</Text>





			<View
			  style={{
				flexDirection: 'row',
				height: 100,
				marginLeft: width(7),
				top: height(2),
			  }}
			>




			  <TouchableOpacity
				onPress={handlePresentModalPress}
				style={{
				  paddingVertical: 14,
				  alignSelf: 'center',
				  paddingHorizontal: 20,
				}}
			  >
				<View style={{ flexDirection: 'row' }}>
				{true && (
					<Text
						style={{
						color: CurrentViewMode.Mode_fontColor,
						fontSize: 20,
						fontWeight: 'bold',
						}}
					>
						{CurrentCode == null ? "+00" : CurrentCode}
					</Text>
					)}

				  <MaterialIcons
					name="keyboard-arrow-down"
					style={{ color: CurrentViewMode.Mode_fontColor, fontSize: size(25) }}
				  />
				</View>
			  </TouchableOpacity>
	

	
		

			  <TextInput
			 onFocus={() => setisNumberFocused(true)} // Set phone input focused
			 onBlur={() => setisNumberFocused(false)} // Reset phone input focus
				//value={code}
				onChangeText={(text) => {
					// Remove spaces and non-numeric characters
					const sanitizedText = text.replace(/[^0-9]/g, '');
					setCode(sanitizedText);
					setPhonenumberLogIn(CurrentCode+sanitizedText)
				  }}
				ref={phoneInputRefLogIn}
				placeholder="1522 81034575"
				placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
				keyboardType="phone-pad"
				style={{
				  marginLeft: -10,
				  fontSize: 20,
				  fontWeight: 'bold',
				  paddingVertical: 14,
				  color: CurrentViewMode.Mode_fontColor,
				  alignSelf: 'center',
				  paddingHorizontal: 20,
				}}
			  />
			</View>



				</View>
		)},





		{

			id: 2,
			content: (

				<>

			

			<Text style={{
				fontSize: size(25),
				fontWeight: "bold",
				color:  CurrentViewMode.Mode_fontColor,
				marginTop: height(5),
				width: "60%",
				lineHeight: 25,
				marginLeft: width(10),
			}}>
			 {t("EnterPINLogIn")} 
			</Text>



	<TouchableOpacity onPress={() => {
        SheetManager.hide("LogIn_Sheet")
    }}
     style={{
        flexDirection: 'row',
        justifyContent: 'center', // ✅ Ensures horizontal centering
        alignItems: 'center', // ✅ Aligns text & arrow vertically
        alignSelf: 'center', // ✅ Centers the container itself
        position: 'absolute', // Keep if necessary
        marginTop: height(28)
    }}> 
    <Text style={{
        color: CurrentViewMode.Mode_Sec_fontColor,
		fontSize: size(14),
		marginRight: width(2)
	}}>
         {t("DonthaveAnAccountYetLogIn")}    
    </Text>
    <MaterialIcons 
        name="arrow-forward-ios"
        style={{
            color: "#555",
			fontWeight: "bold",
            fontSize: size(18),
        }} 
    />
</TouchableOpacity>



			<Pin  />

		  </>
		)}
		 

],
[LoginslideToPreviousPage, LoginslideToPreviousPage]
);

// Additional effect for when navigating to the second slide
useEffect(() => {
if (currentPageLogIn === 1) {
  Keyboard.dismiss(); // Dismiss keyboard when navigating to slide 2
}
}, [currentPageLogIn]);















		  


































  
	return (
	
	




		
		
		 
	   <>
		

{/* Error Toast Message */}

	 
{/*
	currentPage == 0

	?
	showToast && (
        <ToastMessage
          message="Please enter a valid phone numbe"
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}

	 
{
	currentPage == 1

	?
	showToast && (
        <ToastMessage
          message="Wrong Code"
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}



{
	currentPage == 2

	?
	showToast && (
        <ToastMessage
          message="Please enter a valid email address to proceed"
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}


{
	currentPage == 2

	?
	showToast && (
        <ToastMessage
          message="Please enter a valid email address to proceed"
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

*/}





		
		
		
 {/* BottomSheet with LogIn Modal */}
			

 <ActionSheet  
    ref={LogIn_Sheet}
    gestureEnabled={true}
    isModal={false}
    backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
    keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
    
  onOpen={() => {
    setcurrentPageLogIn(0)
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
					





    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={height(16)} // ✅ Moves up more when keyboard opens

      style={{
        height: "100%",
        width: "100%"
      }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{
              height: "100%",
        width: "100%"
        }}>


    {/* Animated View for sliding pages */}
	<Animated.View
          style={{
            flexDirection: 'row',
           width: "100%", height: "100%",
		   transform: [{ translateX: translateXLogin }],

          }}
        >


		

		{LogIn_slides.map((slideLogin) => (
            <View key={slideLogin.id} style={{ width: "100%", height: "100%" }}>
              {slideLogin.content}
            </View>
          ))}




        </Animated.View>






{
		// Buttons UI and UX 

		(isTextFocused || isNumberFocused) && (
	


			<View
		   style={{
            backgroundColor: CurrentViewMode.Mode_bg,
            paddingHorizontal: size(20),
      
            flexDirection: 'row',
		}}>





		
					
		{LogIn_slides?.length > 0 && currentPageLogIn < LogIn_slides.length - 1 && (
			
			<TouchableOpacity
			onPress={() => {
				// Check if phone number has strings in it

                console.log("Phonenumber ", PhonenumberLogIn)

				const isAlpha = (str) => /^[a-zA-Z]+$/.test(str);  // Regular expression to match letters only

				console.log(code)

				if(currentPageLogIn == 0 && CurrentCode == null || code == null || CurrentCode == "" || isAlpha(code) == true) {
					setShowToast(true)
					
				} else {
					
					LoginslideToNextPage();
				}
                
		
			}}
			style={{
				paddingVertical: 12,
				paddingHorizontal: 20,
				marginLeft: width(52),
				
				width: 150,
				borderRadius: 10,
				backgroundColor: CurrentViewMode.Mode_fontColor,
				opacity: !code || !CurrentCode ? 0.4 : 1,
				shadowColor: '#ddd',
				shadowOffset: {
				width: 0,
				height: 4,
				},
				shadowOpacity: 0.3,
				shadowRadius: 4.65,
				elevation: 8,
			}}
			>
			<Text
				style={{
				alignSelf: 'center',
				fontSize: size(18),
                color: CurrentViewMode.Mode_bg,
				fontWeight: 'bold',
				}}>
				{t("NextButtonLogIn")}
			</Text>
			</TouchableOpacity>
		)}





{currentPageLogIn > 0 && (
  <TouchableOpacity
    onPress={LoginslideToPreviousPage}
	style={{
		marginLeft: width(4),
	
        width: 50,
		height: 50,
        borderRadius: 10,
        backgroundColor: '#222',
        opacity: !code || !CurrentCode ? 0.4 : 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	
      }}
    >
   <MaterialIcons name="arrow-back"
        style={{
          alignSelf: 'center',
          fontSize: size(25),
          fontWeight: 'bold',
		  color: '#fff',

        }}
       />
  </TouchableOpacity>
)}



</View>

  )}


	




</View>
</TouchableWithoutFeedback>
</KeyboardAvoidingView>

</ActionSheet>

	
		










    


		
			{/* BottomSheet with CountryPicker */}




			</>
	
		  
	
	);



  }
  
  














  export const ChooseCountry = () => {






	const { t } = useTranslation();
  
	const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);
    const Country_Sheet = useRef(null);
	// At the top of your Index component
	const phoneInputRef = useRef(null);
	const phoneInputRefLogIn = useRef(null);
	const searchInputRef = useRef(null);
    const otpInputRef = useRef(null); // Ref to the OTP input
	const EmailInputRef = useRef(null)


	// ---- 2) Regular states ----
	const [loading, setLoading] = useState(false);
	const [callingCodes, setCallingCodes] = useState([]);

	// ---- 3) BottomSheet states + refs ----
	const sheetRef = useRef(null);
	const [sheetIndex, setSheetIndex] = useState(-1);
	const [sheetIndexPhonenumber, setsheetIndexPhonenumber] = useState(-1);
	const {CurrentCode, setCurrentCode, ISO3Code, setIso3Code} = useContext(LogInContext);
	const [keyboardVisible, setKeyboardVisible] = useState(false);
  
	// 1. Update searchQuery state
	const [searchQuery, setSearchQuery] = useState('');
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [UserIPAddress, setUserIPAddress] = useState()


	const [facing, setFacing] = useState('back'); // 'back' or 'front' camera
	const [permission, requestPermission] = useCameraPermissions();
	  const [currentPage, setCurrentPage] = useState(0); // Track current page
	  const [currentPageLogIn, setcurrentPageLogIn] = useState(0); // Track current page

	  const translateX = useRef(new Animated.Value(0)).current; // Animation value


	  const translateXLogin = useRef(new Animated.Value(0)).current; // Animation value


	  

      



	  // Get user Local Ip address

	  useEffect(()  => {


		NetworkInfo.getIPAddress().then(ipAddress => {
		
			setUserIPAddress(ipAddress)
		  })
		  console.log("Local IP Address:", UserIPAddress);


	  }, [])





      
    


  // Location Verification

  useEffect(() => {
    async function getCurrentLocation() {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);



  


  











	

  
	// ref
	const bottomSheetModalRefPhoneNumber = useRef(null);
  
    
  
	// ---- 5) Fetch Calling Codes ----
    useEffect(() => {
        const fetchCountries = async () => {
          try {
            setLoading(true);
    
            const response = await axios.get(
              'https://restcountries.com/v2/all?fields=name,callingCodes,alpha2Code,alpha3Code',
              {
                headers: {
                  Accept: 'application/json',
                },
              }
            );
    
            const data = response.data;
    
            const codes = data
              .map((country, index) => ({
                name: country.name ?? `Unknown-${index}`,
                code: country.callingCodes?.[0] ?? null,
                iso2: country.alpha2Code ?? null,
                iso3: country.alpha3Code ?? null,
              }))
              .filter((item) => item.code)
              .filter((item, index, self) =>
                index === self.findIndex((t) => t.code === item.code)
              );
    
			
            setCallingCodes(codes);
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error(
                'Axios error:',
                error.response?.status,
                error.response?.data
              );
            } else {
              console.error('Unknown error:', error);
            }
          } finally {
            setLoading(false);
          }
        };
    
        fetchCountries();
      }, []);
    

	
	// ---- 6) Focus Phone Input when Main Sheet is Opened ----
	useEffect(() => {
	  if (sheetIndex === 1) { // Adjust based on your sheet index logic
		// Delay to ensure the modal is fully presented
		setTimeout(() => {
		  phoneInputRef.current?.focus();
		}, 500); // 500ms delay; adjust as needed
	  }
	}, [sheetIndex]);
  
	// ---- 7) Keyboard Event Handlers ----
	useEffect(() => {
	  const keyboardShowListener = Keyboard.addListener(
		Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
		() => {
		  setKeyboardVisible(true);
		}
	  );
	  const keyboardHideListener = Keyboard.addListener(
		Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
		() => {
		  setKeyboardVisible(false);
		}
	  );
  
	  // Cleanup listeners on unmount
	  return () => {
		keyboardShowListener.remove();
		keyboardHideListener.remove();
	  };
	}, []);
  

    


    

	// 2. Define filteredCallingCodes using useMemo
	const filteredCallingCodes = useMemo(() => {
		if (!searchQuery.trim()) {
		  // If searchQuery is empty or just whitespace, return the full list
		  return callingCodes;
		}
	  
		const lowercasedQuery = searchQuery.trim().toLowerCase();
	  
		return callingCodes.filter(country => {
		  const nameMatch = country.name?.toLowerCase().includes(lowercasedQuery);
		  const codeMatch = country.code?.toLowerCase().includes(lowercasedQuery);
		  return nameMatch || codeMatch;
		});
	  }, [searchQuery, callingCodes]);
	  
	  
	  // 3. Define handleSearch without debounce for instant filtering
	  const handleSearch = (query) => {
		setSearchQuery(query);
	  };
	  



      
      
	// Render item function
	const renderItem = useCallback(({ item }) => (
  <TouchableOpacity
    onPress={() => {

		console.log(item.iso3)

		

        console.log('Setting CurrentCode to:', item.code); // Debug log
        setCurrentCode(item.code); // Update state
		setIso3Code(item.iso3)
        SheetManager.hide("Country_Sheet")
       // setsheetIndexPhonenumber(-1); // Close the sheet
       // bottomSheetModalRefPhoneNumber.current?.close(); // Close modal

    }}
    style={{
      width: width(90),
      alignSelf: 'center',
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: CurrentViewMode.Mode_bg,
      borderRadius: 10,
      marginVertical: 4,
    }}
    accessibilityLabel={`Select country ${item.name}`}
  >
    <View
      style={{
        height: 20,
        width: 20,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        backgroundColor: '#ccc',
      }}
    >
      <CountryFlag
        isoCode={item.iso2}
        style={{
          alignSelf: 'center',
          height: '100%',
          width: '100%',
        }}
      />
    </View>
    <View style={{ marginLeft: width(7) }}>
      <Text style={{ color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold', fontSize: size(14) }}>
        {item.name}
      </Text>
      <Text style={{ marginTop: 4, color: "#777", fontSize: size(12) }}>
        {item.code}
      </Text>
    </View>
  </TouchableOpacity>
), [setCurrentCode, setsheetIndexPhonenumber, bottomSheetModalRefPhoneNumber]);

























	  useEffect(() => {
		console.log("hello ", currentPageLogIn)
	  }, [])





      
		  


		  useEffect(() => {
			const timeout = setTimeout(() => {
				if (currentPage === 1 && otpInputRef.current ) {
					console.log("Focusing OTP  test input");
	
						otpInputRef.current.focus();
				
				}


				else if (currentPageLogIn === 0 && phoneInputRefLogIn.current) {
					console.log("Focusing Email input");
					Keyboard.dismiss();
				  }  
				

				else if (currentPageLogIn === 1 && phoneInputRefLogIn.current) {
					console.log("Focusing Email input");
					Keyboard.dismiss();
				  }  
			
			
			}, 500); // Ensure enough delay for slide rendering
		  
			return () => clearTimeout(timeout);
		  }, [currentPage]);
		  

		  

		  
		  




		  useEffect(() => {
			if (EmailInputRef.current) {
			  console.log("EmailInputRef is attached:", EmailInputRef.current);
			} else {
			  console.log("EmailInputRef is NOT attached!");
			}
		  }, [EmailInputRef.current]);
		  





		  // animted Scroll heder for Just a few more questions

		  const scrollY = useRef(new Animated.Value(0)).current;

		  const HEADER_HEIGHT = 80; // Adjust as needed
		  const TITLE_SWITCH_POINT = 50; // Scroll position where title changes
		
		  const headerHeight = scrollY.interpolate({
			inputRange: [0, HEADER_HEIGHT],
			outputRange: [HEADER_HEIGHT, 50],
			extrapolate: "clamp",
		  });
		
		  const titleOpacity = scrollY.interpolate({
			inputRange: [0, TITLE_SWITCH_POINT],
			outputRange: [1, 0],
			extrapolate: "clamp",
		  });
		
		  const newTitleOpacity = scrollY.interpolate({
			inputRange: [TITLE_SWITCH_POINT, TITLE_SWITCH_POINT + 30],
			outputRange: [0, 1],
			extrapolate: "clamp",
		  });
		

		  





          



        




    return(



 <ActionSheet  
 ref={Country_Sheet}
 gestureEnabled={true}
 isModal={true}
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

         
<KeyboardAvoidingView
   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
   keyboardVerticalOffset={height(3)} // ✅ Moves up more when keyboard opens

   style={{
     height: "100%",
     width: "100%",
  
   }}>
   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  
   <View style={{
           height: "100%",
     width: "100%",
 
     }}>

<ScrollView style={{
                height: "100%",
                width: "100%",
                
            }} contentContainerStyle={{
                paddingTop: height(6),
                paddingBottom: height(10)
            }}>


                 <FlatList
                     data={filteredCallingCodes}
                     keyExtractor={(item, index) => index.toString()} // Ensure a unique key for each item
                     renderItem={renderItem}
                     style={{ height: "100%" }} // Allow the content to grow
                     ListEmptyComponent={
                     <Text style={{ color: CurrentViewMode.Mode_fontColor, position: 'absolute', textAlign: 'center', marginTop: 20 }}>
                       {t("NoCountryFoundLogIn")}  
                     </Text>
                     }
                     initialNumToRender={20} // Number of items to render initially
                     //maxToRenderPerBatch={10} // Control how many items are rendered in each batch
                     updateCellsBatchingPeriod={50} // Improve performance during scrolling
                     windowSize={10} // Adjust rendering windows for smoother scrolling
                     />

                </ScrollView>


                   
                <BlurView intensity={90} tint={CurrentViewMode.Mode_Name == "The Baddie Theme" || CurrentViewMode.Mode_Name == "The White Theme" || CurrentViewMode.Mode_Name == "The blue based Color Theme" ? 'light' : 'dark'}  

                       style={{
                        paddingHorizontal: size(20),
                        height: size(130),
                        position: 'absolute',
                        bottom: 0,
                        width: "100%",
                        flexDirection: 'row',
                       // alignItems: 'center'
                       }}>

                         <TextInput 
                          
                          ref={searchInputRef} 
                          
                          placeholder={t("SearchCountryTextLogIn")}
                          placeholderTextColor={CurrentViewMode.Mode_TextColorSearchBar_Search}
                         // value={searchQuer
                          onChangeText={handleSearch}
                          returnKeyType="done"
                          autoFocus={false}
                           style={{
                             height: height(6),
                             width: keyboardVisible ? "60%" : "80%",
                             marginTop: keyboardVisible ? height(1.5) : height(-3),
                             alignSelf: keyboardVisible ? "left" : 'center',
                             marginLeft: keyboardVisible ? width(5) : width(10),
                             color: CurrentViewMode.Mode_fontColor,
                             fontSize: size(18),
                             borderRadius: 10,
                             paddingHorizontal: 20,
                             backgroundColor: CurrentViewMode.Mode_BgColorBar_Search,
                           }} 
                         
                         />

                         {keyboardVisible ? 
                           <TouchableOpacity
                             style={{
                               paddingVertical: 12,
                               marginLeft: width(5),
                               marginTop: height(3),
                               paddingHorizontal: 20,
                             }}
                             onPress={() => {
                               setSearchQuery('');
                               Keyboard.dismiss();
                               // Refocus the TextInput after a short delay
                           
                             }}>
                             <Text style={{
                               color: CurrentViewMode.Mode_fontColor,
                               fontSize: size(14),
                               fontWeight: "bold"
                             }}>
                              {t("CancelButtonLogIn")} 
                             </Text>
                           </TouchableOpacity>
                           : null
                         }


                     </BlurView>
                   </View>
               


     </TouchableWithoutFeedback>
         </KeyboardAvoidingView>

     </ActionSheet>
             
    )
  }