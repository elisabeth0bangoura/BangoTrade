// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, ActivityIndicator, Dimensions, Easing, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {AntDesign, Feather, Foundation, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetTextInput, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import axios from 'axios';
import CountryFlag from "react-native-country-flag";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { BlurView } from 'expo-blur'; // If you're using Expo
import { LineChart } from 'react-native-wagmi-charts';
import * as ImageManipulator from 'expo-image-manipulator';
import { decode as atob } from 'base-64';

import { Platform } from 'react-native';
import { Link } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'

import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from 'expo-linear-gradient';
import debounce from 'lodash.debounce';

import { CoinPageContext } from '../Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '../Context/CurrentCoinSelectedContext';
import CoinChart from './CoinChart';
import { CurrentPriceContext } from '../Context/CurrentCoinPricePageContext';
import PagerView from 'react-native-pager-view';

import { AmountContext } from '../Context/OpenAmountSheetContext';

import { AddMoneyToAccountContext } from '../Context/AddMoneyToAccountContext';
import firestore from '@react-native-firebase/firestore';










const AddBankDetailsToAccount =  React.memo(() => {
  const currentUser = auth().currentUser;

    const { currentPrice, setCurrentPrice, percentageChange, setPercentageChange, } = useContext(CurrentPriceContext);


    const { 
      CoinPageIndex, 
      setCoinPageIndex,  
      CurrentBackgroundColorForCoin, 
      setCurrentBackgroundColorForCoin, coinData, setCoinData  } = useContext(CoinPageContext);
  
 
    const { 
      AddMoneyToAccountIndex, 
      setAddMoneyToAccountIndex, 
      AddBankDetailsToAccountIndex, 
      setAddBankDetailsToAccountIndex 

  } = useContext(AddMoneyToAccountContext);

    
    const AmountsheetRef = useRef(null);
    const { AmountIndex, setAmountIndex } = useContext(AmountContext);
    const windowHeight = Dimensions.get('window').height;
    const snapPointsAmount = useMemo(() => [windowHeight * 0.91], []);
    const [BankName, setBankName] = useState("")
    const [BICOrABA, setBICOrABA] = useState("")
    const [BankCodeType, setBankCodeType] = useState("")
    const [AccountNumber, setAccountNumber] = useState("")
    const [Country, setCountry] = useState("")
    const [PostalCode, setPostalCode] = useState("")
    const [StreetAddress, setStreetAddress] = useState("")
    const [ StateProvince, setStateProvince] = useState("")
    const [ City, setCity] = useState("")
    const [ChooseBankCodeTypeIndex, setChooseBankCodeTypeIndex] = useState(-1)
    const [bankRelationshipStatus, setBankRelationshipStatus] = useState(null); // Store status
    const [showToast, setShowToast] = React.useState(false);


   


// User Alpaca Infos

useEffect(() => {



}, [])



















 // hooks
 const sheetRefAddBankDetails = useRef(null);

 // variables
 const snapPointsAddBankDetails = useMemo(() => ["91%"], []);

 

 const handleSheetChangeAddBankDetails = useCallback((index) => {
   console.log("Sheet index Add Bank Details changed:", index);
 }, []);



 const CloseAddBankDetailsSheet = () => {
  setAddBankDetailsToAccountIndex(-1)
  sheetRefAddBankDetails.current?.close();
 }








 // Bank Code type


// Bank Code type
const sheetRefBankCodeType = useRef(null);
const snapBankCodeType = useMemo(() => ["30%"], []);

const handleSheetChangeBankCodeType = useCallback((index) => {
  console.log("handleSheetChange", index);

  if(index == 0) {
    setChooseBankCodeTypeIndex(0)
  } else {
    setChooseBankCodeTypeIndex(-1)
  }

}, []);

const handleSnapPressBankCodeType = useCallback((index) => {
  sheetRefBankCodeType.current?.snapToIndex(index);  // Snap to the given index
}, []);

const handleClosePressBankCodeType = useCallback(() => {
  sheetRefBankCodeType.current?.close();
  setChooseBankCodeTypeIndex(-1)
}, []);

const renderBackdropBankCodeType = useCallback(
  (props) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      onPress={() => {
        if (ChooseBankCodeTypeIndex === 0) {
          setChooseBankCodeTypeIndex(0);
        }
      }}
    />
  ),
  [ChooseBankCodeTypeIndex]
);

    

const CloseAddMoneyToAccountSheet = () => {
  setAddMoneyToAccountIndex(-1)

}

























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
      backgroundColor: "#44D700",
      position: 'absolute',
      top: 0,
      zIndex: 1000,
    }}
    >
    <View
      style={{
      marginTop: height(12),
      flexDirection: 'row',
      alignItems: 'center',
      }}
    >
      <MaterialIcons
      name="check-circle"
      style={{
        color: '#000',
        fontSize: size(20),
        marginLeft: width(10),
      }}
      />
      <Text
      style={{
        fontSize: size(18),
        width: "50%",
        fontWeight: "bold",
        marginLeft: width(3),
      }}
      >
      {message}
      </Text>
    </View>
    </Animated.View>
  );
  };







return(


  <>
 
 {

	
	showToast && (
        <ToastMessage
          message="Bank Account added"
          onClose={() => setShowToast(false)}
        />
      )


}

      <BottomSheet
       ref={sheetRefAddBankDetails}
       snapPoints={snapPointsAddBankDetails}
       enableDynamicSizing={false}
       index={AddBankDetailsToAccountIndex} // Use the context value for index
     //  enablePanDownToClose={true}
       onChange={handleSheetChangeAddBankDetails}
       keyboardBehavior="fillParent"
       keyboardBlurBehavior="restore"
       android_keyboardInputMode="adjustPan"
      
       style={{
      
        shadowColor: '#000',
    
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
       
      }}
      handleIndicatorStyle={{
    //	backgroundColor: CoinPageIndex == 0 ? "#fff" : "transparent", 
        height: size(4), 
        width: size(40), 
        marginTop: -15,
        alignSelf: 'center',
        borderRadius: 20,  // Add borderRadius here to make the handle rounded
      }}
    
      handleStyle={{
       // backgroundColor: "#0F0F0F", // Set handle background to transparent
        height: 20, // Remove the handle height
        padding: 0, // Remove any padding if necessary
        borderTopLeftRadius: 60,  // Rounded top-left corner of the handle
        borderTopRightRadius: 60, // Rounded top-right corner of the handle
      }}
      backgroundStyle={{
       backgroundColor: "#0F0F0F", 

      }} >



<BottomSheetScrollView
          style={{
            backgroundColor: "#0F0F0F",
          }}
          contentContainerStyle={{
            paddingBottom: height(20), // Add extra padding to ensure content doesn't get covered by the keyboard
          }}
        >

       <Text style={{
        fontSize: size(25),
        width: "80%",
        fontWeight: "bold",
        marginTop: height(3),
        color: '#fff',
        marginLeft: width(5),
       }}>
       Transfer money to Bango Bank
       </Text>


      




        <BottomSheetTextInput placeholder='Elisabeth Bangoura'
        placeholderTextColor={"#fff"}
        style={{
          fontSize: size(25),
          color: '#fff',
          fontWeight: "bold",
          marginTop: height(5),
          marginLeft: width(5),
        }} />





<View style={{
  flexDirection: 'row',
  marginTop: height(2),
  marginBottom: height(3),
}}>




<BottomSheetTextInput placeholder='Bank Name'
	onChangeText={(text) => {
    setBankName(text); // Update email state
    }}
        placeholderTextColor={"#2E2F30"}
        style={{
          fontSize: size(22),
          color: '#fff',
          fontWeight: "bold",
          marginTop: height(5),
          marginLeft: width(5),
        }} />





</View>












<View style={{
 backgroundColor: "#1E1E1F",
 height: "auto",
 paddingVertical: height(4),
 paddingHorizontal: width(2),
 width: "85%",
 marginLeft: width(5),
 borderRadius: 15,

       }}>

<Text style={{
    fontSize: size(14),
    color: '#fff',
    marginLeft: width(5),
    fontWeight: "bold",
    marginBottom: height(1)
}}>Bank Code</Text>


<Text style={{
    fontSize: size(13),
    color: '#fff',
    marginLeft: width(5),
    fontWeight: "bold",
    lineHeight: height(2.5),
    width: "90%",
}}>For international banks, choose BIC. For U.S. banks, choose ABA Routing Number.</Text>

</View>



<View style={{

  marginBottom: height(1),
  marginLeft: width(5),
}}>  




<TouchableOpacity onPress={() => handleSnapPressBankCodeType(0)}
  style={{
paddingVertical: 12,
flexDirection: 'row',
marginLeft: -20,
marginTop: height(2),
paddingHorizontal: 20,
}}>
  <Text style={{
      fontSize: size(22),
      fontWeight: "bold",
      color: BankCodeType == "" ?  '#2E2F30' : "#fff",
      marginRight: width(1),
  }}>
   {BankCodeType == "" ? "Choose Bank Code" : BankCodeType}
  </Text>

  <MaterialIcons name="keyboard-arrow-down" style={{
    color: BankCodeType == "" ? '#2E2F30' : "#fff",
    fontSize: size(30),
  }} />
</TouchableOpacity>


</View>














<View style={{
 backgroundColor: "#1E1E1F",
 height: "auto",
 paddingVertical: height(4),
 paddingHorizontal: width(2),
 width: "85%",
 marginLeft: width(5),
 borderRadius: 15,


       }}>

<Text style={{
    fontSize: size(14),
    color: '#fff',
    marginLeft: width(5),
    fontWeight: "bold",
    marginBottom: height(1)
}}>Account Number or IBAN</Text>


<Text style={{
    fontSize: size(13),
    color: '#fff',
    marginLeft: width(5),
    fontWeight: "bold",
    lineHeight: height(2.5),
    width: "90%",
}}>
  For international banks, enter the IBAN. For U.S. banks, enter the account number.
</Text>

</View>



<View style={{
  flexDirection: 'row',
 marginTop: height(4),
  marginLeft: width(5),
}}>







<BottomSheetTextInput placeholder='Account number' numberOfLines={1}
        placeholderTextColor={"#2E2F30"}
        onChangeText={(text) => {
          setAccountNumber(text); // Update email state
          }}
        style={{
          fontSize: size(22),
          color: '#fff',
          width: width(45),
          fontWeight: "bold",
  
       
        }} />




<BottomSheetTextInput placeholder='BIC/ABA' numberOfLines={1}
        placeholderTextColor={"#2E2F30"}
        onChangeText={(text) => {
          setBICOrABA(text); // Update email state
          }}
        style={{
          fontSize: size(22),
          color: '#fff',
          fontWeight: "bold",
          position: 'absolute',
          right: width(5),
         
        }} />






</View>















<View style={{
  flexDirection: 'row',
  marginTop: height(5),
  marginLeft: width(5),
}}>






</View>












<View style={{
  flexDirection: 'row',
  marginTop: height(5),
  marginLeft: width(5),
}}>



<Text style={{
  color: "#691AF5",
  position: 'absolute',
  marginTop: height(-3),
  fontWeight: "bold"
}}> 
  (ISO-3 Name)
</Text>
<BottomSheetTextInput placeholder='USA' numberOfLines={1}
        placeholderTextColor={"#2E2F30"}
        onChangeText={(text) => {
          setCountry(text); // Update email state
          }}
        style={{
          fontSize: size(22),
          color: '#fff',
          width: width(45),
          fontWeight: "bold",
        }} />





<BottomSheetTextInput placeholder='State province' numberOfLines={1}
        placeholderTextColor={"#2E2F30"}
        onChangeText={(text) => {
          setStateProvince(text); // Update email state
      }}
        style={{
          fontSize: size(22),
          color: '#fff',
          fontWeight: "bold",
          position: 'absolute',
          right: width(5),
        }} />
</View>














<View style={{
  flexDirection: 'row',
  marginTop: height(5),
  marginLeft: width(5),
}}>





<BottomSheetTextInput placeholder='Postal code'
        placeholderTextColor={"#2E2F30"}
        onChangeText={(text) => {
          setPostalCode(text); // Update email state
      }}
        style={{
          fontSize: size(22),
          color: '#fff',
          fontWeight: "bold",
        }} />




<BottomSheetTextInput placeholder='City'
        placeholderTextColor={"#2E2F30"}
        onChangeText={(text) => {
          setCity(text); // Update email state
      }}
        style={{
          fontSize: size(22),
          color: '#fff',
          fontWeight: "bold",
          position: 'absolute',
          right: width(5),
        }} />
</View>















<View style={{
  flexDirection: 'row',
  marginTop: height(5),
  marginLeft: width(5),
}}>





<BottomSheetTextInput placeholder='Street address'
        placeholderTextColor={"#2E2F30"}
        onChangeText={(text) => {
          setStreetAddress(text); // Update email state
      }}
        style={{
          fontSize: size(22),
          color: '#fff',
          fontWeight: "bold",
        }} />


</View>















        </BottomSheetScrollView>
     
     


        <View style={{
               position: 'absolute',
               top: height(75),
        }}>
        <TouchableOpacity onPress={() => CloseAddBankDetailsSheet()}
        style={{
            height: size(55),
            width: size(55),
            marginLeft: width(5),
            backgroundColor: "#272726",
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
        }}>
            <MaterialIcons name="arrow-back-ios" style={{
                fontSize: size(18),
                color: '#fff',

            }} />
        </TouchableOpacity>





{
/*
    const [BankName, setBankName] = useState("")
    const [BICOrABA, setBICOrABA] = useState("")
    const [AccountNumber, setAccountNumber] = useState("")
    const [Country, setCountry] = useState("")
    const [PostalCode, setPostalCode] = useState("")
    const [StreetAddress, setStreetAddress] = useState("")
    const [ StateProvince, setStateProvince] = useState("")
    const [ City, setCity] = useState("")

*/
}




{
  BankName == "" //|| BICOrABA == "" || BankCodeType == "" || AccountNumber == "" || Country == "" || PostalCode == "" || StreetAddress == "" || StateProvince == "" || City == ""


  ?


  <TouchableOpacity disabled={true}
  style={{
      height: size(55),
      width: width(30),
      marginLeft: width(65),
      position: 'absolute',
      backgroundColor: "#444",
      alignItems: 'center',

      borderRadius: 10,
      flexDirection: 'row',
  }}>
     <Text style={{
      fontSize: size(18),
      fontWeight: "bold",
      marginLeft: 20,
     }}>
      Next
     </Text>

     <MaterialIcons name='arrow-forward' style={{
      color: '#000',
      position: 'absolute',
        right: width(5),
      fontSize: size(25)

     }} />
  </TouchableOpacity>


  :




  <TouchableOpacity onPress={() => {


  

    const handleSubmit = () => {

    
     /* const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==',
        },
        body: JSON.stringify({
          bank_code_type: BankCodeType,
          account_number: AccountNumber,
          bank_code: BICOrABA,
          name: BankName,
          country: Country,
          postal_code: PostalCode,
          state_province: StateProvince,
          city: City,
          street_address: StreetAddress,
        }),
      };
  
  */

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
        }
      };
      
      // Make the POST request
   /*   fetch('https://broker-api.sandbox.alpaca.markets/v1/accounts/dc053145-9232-4c82-9d13-6e53a104750f/recipient_banks', options)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);*/
          // After POST request is successful, check the bank relationship status
         /* return*/ fetch('https://broker-api.sandbox.alpaca.markets/v1/accounts/dc053145-9232-4c82-9d13-6e53a104750f/recipient_banks',
            options
          )
      //</View>  })
        .then((res) => res.json()) // Process the response of the GET request
        .then((res) => {
          console.log(res);
          const status = res[0]?.status; // Assuming the response is an array and status is in the first item
          setBankRelationshipStatus(status); // Set the status in the state

          firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection("Bank_Details")
          .doc("List")
          .set(res[0])
          .then(() => {
            console.log('User added!');
          });

          if(res[0]?.status == "APPROVED") {
            CloseAddBankDetailsSheet()
            CloseAddMoneyToAccountSheet()
            setShowToast(true)
           
          }
          
        
        })
        .catch((err) => {
          console.error(err);
          setIsSubmitting(false); // Reset submission state on error
        });
    
  
      }

      handleSubmit()



  }}
  style={{
    height: size(55),
    width: width(30),
    marginLeft: width(65),
    position: 'absolute',
    backgroundColor: "#fff",
    alignItems: 'center',

    borderRadius: 10,
    flexDirection: 'row',
}}>
   <Text style={{
    fontSize: size(18),
    fontWeight: "bold",
    marginLeft: 20,
   }}>
    Next
   </Text>

   <MaterialIcons name='arrow-forward' style={{
    color: '#000',
    position: 'absolute',
      right: width(5),
    fontSize: size(25)

   }} />
  </TouchableOpacity>

}

     



        </View>
      

    
      </BottomSheet>






      <BottomSheet
      ref={sheetRefBankCodeType}
      index={ChooseBankCodeTypeIndex}
      snapPoints={snapBankCodeType}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
     backdropComponent={renderBackdropBankCodeType}
      onChange={handleSheetChangeBankCodeType}
      style={{
    
        // backgroundColor: '#0F0F0F',
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 10 },
         shadowOpacity: 0.5,
         shadowRadius: 20,
         elevation: 20,
       }}
       handleIndicatorStyle={{
        backgroundColor: ChooseBankCodeTypeIndex == 0 ? "#fff" : "transparent", // Ensure correct condition
        height: size(4),
        width: size(40),
        marginTop: -15,
        alignSelf: 'center',
        borderRadius: 20,  // Add borderRadius here to make the handle rounded
      }}
     
       handleStyle={{
        // backgroundColor: "#0F0F0F", // Set handle background to transparent
         height: 20, // Remove the handle height
         padding: 0, // Remove any padding if necessary
         borderTopLeftRadius: 60,  // Rounded top-left corner of the handle
         borderTopRightRadius: 60, // Rounded top-right corner of the handle
       }}
       backgroundStyle={{
        backgroundColor: "#0F0F0F", 
     
       }}>


        <BottomSheetView style={{
          width: "90%",
          alignSelf: 'center'
        }}>

         
    <Text style={{
		fontWeight: "900",
		color: '#fff',
		fontSize: size(25),
		marginLeft: width(5),
		marginTop: height(2),
	   }}>
		Bank Code type
	   </Text>


         <TouchableOpacity onPress={() => {
          setBankCodeType("ABA")
          handleClosePressBankCodeType()
         }}
         style={{
          marginTop: height(3),
          paddingVertical: 12,
          paddingHorizontal: 20,
          flexDirection: 'row',
          marginBottom: height(2),
          alignItems: 'center',
         }}>
          <Text style={{
            fontSize: size(20),
            color: '#fff',
            fontWeight: "bold",
          }}>
          ABA
          </Text>


          {
            BankCodeType == "ABA"
            ?


          <MaterialIcons name='check' style={{
            color: '#fff',
            fontSize: size(25),
            position: 'absolute',
            right: width(5)
          }} />

          :

          null

          }

         </TouchableOpacity>

         <TouchableOpacity  onPress={() => {
          setBankCodeType("BIC")
          handleClosePressBankCodeType()
         }}
         style={{
          paddingVertical: 12,
          paddingHorizontal: 20,
         }}>
          <Text style={{
            fontSize: size(20),
            color: '#fff',
            fontWeight: "bold",
          }}>
          BIC
          </Text>


          {
            BankCodeType == "BIC"
            ?


          <MaterialIcons name='check' style={{
            color: '#fff',
            fontSize: size(25),
            position: 'absolute',
            right: width(5)
          }} />

          :

          null

          }

         </TouchableOpacity>



        </BottomSheetView>
      </BottomSheet>

</>
);
});


export default AddBankDetailsToAccount;