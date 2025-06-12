import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions, FlatList, PanResponder, LayoutAnimation, Dimensions,Animated, UIManager, Platform, TouchableOpacity,   Image } from 'react-native'; 
import { AntDesign, Feather, FontAwesome, FontAwesome6, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';
import database from '@react-native-firebase/database';
import auth, {firebase} from '@react-native-firebase/auth';
import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';
import firestore from '@react-native-firebase/firestore';

import { getDatabase, ref, set } from '@react-native-firebase/database';
import { getAuth, signOut, onAuthStateChanged } from "@react-native-firebase/auth";


import Collapsible from 'react-native-collapsible';

import { LinearGradient } from 'expo-linear-gradient';

import ActionSheet, { BottomSheetBackdrop, FlashList, ScrollView, SheetManager, useScrollHandlers} from 'react-native-actions-sheet';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import  { Keyframe, SlideInDown, SlideOutUp } from 'react-native-reanimated';


import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

import TabbedControl from 'react-native-tabbed-control';  // Import the tabbed control library

import PagerView from 'react-native-pager-view';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { TabView, SceneMap } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native';

import SkeletonLoading from 'expo-skeleton-loading'
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import { StockLineContext } from '@/app/Context/StockLineColor';






















// Component for Sort Following coins
export default ViewMode = () => {

  const { t } = useTranslation();

  const {
    isSystemTheme, 
    setIsSystemTheme,
    isAssetColorTheme, 
    setIsAssetColorTheme,
   } = useContext(StockLineContext);

  
  const windowHeight = Dimensions.get('window').height;

  const auth = getAuth();
  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);
  const [user, setUser] = useState(null);


  const ViewMode_Sheet = useRef(null);

// Get a reference to the database
const db = getDatabase();


  

const calculatedHeight = windowHeight * 30;





   // Listen for authentication state changes
    useEffect(() => {
      const auth = getAuth(); // ✅ Initialize Firebase Auth
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser.uid); // ✅ Set user if logged in
          console.log("✅ User logged in:", currentUser.uid);
        } else {
          setUser(null); // ✅ Clear user if logged out
        }
      });
      return () => unsubscribe(); // ✅ Cleanup on unmount
    }, [user]); // ✅ Runs when user state changes ✅ CORRECTLY CLOSED
  


  
    return (



 <ActionSheet 
      ref={ViewMode_Sheet}
      backgroundInteractionEnabled={false}
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
   </>
 }
   
     
     containerStyle={{
        maxHeight: height(92),
        backgroundColor: CurrentViewMode.Mode_bg_Profile,
        height: height(92),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
       
     }} 	
     style={{
       height: "100%",
       backgroundColor: CurrentViewMode.Mode_bg_Profile,
   }}>
 

 <ScrollView showsVerticalScrollIndicator={false} style={{
            marginTop: height(5)
        }}>
       
       <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        marginLeft: width(5),
        fontWeight: "bold",
        fontSize: size(25),
       }}>
        {t("ViewModeTitleInViewModeComponent")}  
       </Text>




       <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        marginTop: height(5),
        marginLeft: width(5),
        fontWeight: "bold",
        fontSize: size(15),
       }}>

      {t("ViewModeSubTitleInViewModeComponent")}  
       </Text>




  <View>

       

       <View style={{
        flexDirection: "row",
        width: "85%",
        marginTop: height(2),
        alignSelf: 'center',
        gap: width(5),
        height: height(40),
      //  backgroundColor: 'yellow'
       }}>




       {
        CurrentViewMode.Mode_Name == "Purple Rain Theme"

        ?

        

        <TouchableOpacity onPress={() => {
          setIsSystemTheme(false)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            width: width(40),
           // backgroundColor: 'green',
        }}>
            <Image source={require("../../../../assets/PurpleWithColorTheme.png")} style={{
                height: "100%",
                marginTop: size(-20),
                width: "100%"
            }} />
        </TouchableOpacity>

        :


       null


       }





{
        CurrentViewMode.Mode_Name == "Purple Rain Theme"

        ?

        


        <TouchableOpacity onPress={() => {
          setIsSystemTheme(true)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            width: width(40),
        }}>
            <Image source={require("../../../../assets/PurpleWithNoColorTheme.png")} style={{
                marginTop: size(-20),
                height: "100%",
                width: "100%"
            }} />
        </TouchableOpacity>


          :


          null

          }

















{
        CurrentViewMode.Mode_Name == "The Baddie Theme"

        ?

        

        <TouchableOpacity onPress={() => {
          setIsSystemTheme(false)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            width: width(40),
           // backgroundColor: 'green',
        }}>
            <Image source={require("../../../../assets/PinkWithColorTheme.png")} style={{
                height: "100%",
                marginTop: size(-20),
                width: "100%"
            }} />
        </TouchableOpacity>

        :


     
        null


       }





{
        CurrentViewMode.Mode_Name == "The Baddie Theme"

        ?

        


        <TouchableOpacity onPress={() => {
          setIsSystemTheme(true)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            width: width(40),
        }}>
            <Image source={require("../../../../assets/PinkWithNoColorTheme.png")} style={{
                marginTop: size(-20),
                height: "100%",
                width: "100%"
            }} />
        </TouchableOpacity>


          :


          null

          }






        












{
        CurrentViewMode.Mode_Name == "The Green Theme"

        ?

        

        <TouchableOpacity onPress={() => {
          setIsSystemTheme(false)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            width: width(40),
           // backgroundColor: 'green',
        }}>
            <Image source={require("../../../../assets/GreenWithColorTheme.png")} style={{
                height: "100%",
                marginTop: size(-20),
                width: "100%"
            }} />
        </TouchableOpacity>

        :


     
        null


       }





{
        CurrentViewMode.Mode_Name == "The Green Theme"

        ?

        


        <TouchableOpacity onPress={() => {
          setIsSystemTheme(true)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            width: width(40),
        }}>
            <Image source={require("../../../../assets/GreenWithNoColorTheme.png")} style={{
                marginTop: size(-20),
                height: "100%",
                width: "100%"
            }} />
        </TouchableOpacity>


          :


          null

          }



































{
        CurrentViewMode.Mode_Name == "Honey Theme"

        ?

        

        <TouchableOpacity onPress={() => {
          setIsSystemTheme(false)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            width: width(40),
           // backgroundColor: 'green',
        }}>
            <Image source={require("../../../../assets/HoneyWithColorTheme.png")} style={{
                height: "100%",
                marginTop: size(-20),
                width: "100%"
            }} />
        </TouchableOpacity>

        :

        null


       }





{
        CurrentViewMode.Mode_Name == "Honey Theme"

        ?

        


        <TouchableOpacity onPress={() => {
          setIsSystemTheme(true)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            width: width(40),
        }}>
            <Image source={require("../../../../assets/HoneyWithNoColorTheme.png")} style={{
                marginTop: size(-20),
                height: "100%",
                width: "100%"
            }} />
        </TouchableOpacity>


          :


         
          null

          }

























{
        CurrentViewMode.Mode_Name == "The blue based Color Theme"

        ?

        

        <TouchableOpacity onPress={() => {
          setIsSystemTheme(false)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            width: width(40),
           // backgroundColor: 'green',
        }}>
            <Image source={require("../../../../assets/BlueBasedColorThemeWithColorTheme.png")} style={{
                height: "100%",
                marginTop: size(-20),
                width: "100%"
            }} />
        </TouchableOpacity>

        :


        null


       }





{
        CurrentViewMode.Mode_Name == "The blue based Color Theme"

        ?

        


        <TouchableOpacity onPress={() => {
          setIsSystemTheme(true)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            width: width(40),
        }}>
            <Image source={require("../../../../assets/BlueBasedColorThemeWithNoColorTheme.png")} style={{
                marginTop: size(-20),
                height: "100%",
                width: "100%"
            }} />
        </TouchableOpacity>


          :


         
          null

          }



































{
        CurrentViewMode.Mode_Name == "Gray Theme"

        ?

        

        <TouchableOpacity onPress={() => {
          setIsSystemTheme(false)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            width: width(40),
           // backgroundColor: 'green',
        }}>
            <Image source={require("../../../../assets/GreyWithColorTheme.png")} style={{
                height: "100%",
                marginTop: size(-20),
                width: "100%"
            }} />
        </TouchableOpacity>

        :


     
        null


       }





{
        CurrentViewMode.Mode_Name == "Gray Theme"

        ?

        


        <TouchableOpacity onPress={() => {
          setIsSystemTheme(true)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            width: width(40),
        }}>
            <Image source={require("../../../../assets/GreyWithNoColorTheme.png")} style={{
                marginTop: size(-20),
                height: "100%",
                width: "100%"
            }} />
        </TouchableOpacity>


          :


         
          null

          }



































{
        CurrentViewMode.Mode_Name == "Black Theme"

        ?


        <TouchableOpacity onPress={() => {
          setIsSystemTheme(false)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            width: width(40),
           // backgroundColor: 'green',
        }}>
            <Image source={require("../../../../assets/BlackWithColorTheme.png")} style={{
                height: "100%",
                marginTop: size(-20),
                width: "100%"
            }} />
        </TouchableOpacity>


        :


     
        null


       }









{
        CurrentViewMode.Mode_Name == "Black Theme"

        ?

        


        <TouchableOpacity onPress={() => {
          setIsSystemTheme(true)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            width: width(40),
        }}>
            <Image source={require("../../../../assets/BlackWithNoColorTheme.png")} style={{
                marginTop: size(-20),
                height: "100%",
                width: "100%"
            }} />
        </TouchableOpacity>


          :


         
          null

          }































{
        CurrentViewMode.Mode_Name == "The White Theme"

        ?

        

        <TouchableOpacity onPress={() => {
          setIsSystemTheme(false)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            width: width(40),
           // backgroundColor: 'green',
        }}>
            <Image source={require("../../../../assets/WhiteWithColorTheme.png")} style={{
                height: "100%",
                marginTop: size(-20),
                width: "100%"
            }} />
        </TouchableOpacity>

        :


     
        null


       }





{
        CurrentViewMode.Mode_Name == "The White Theme"

        ?

        


        <TouchableOpacity onPress={() => {
          setIsSystemTheme(true)
        }}
        style={{
            height: "90%",
            borderRadius: 15,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            width: width(40),
        }}>
            <Image source={require("../../../../assets/WhiteWithNoColorTheme.png")} style={{
                marginTop: size(-20),
                height: "100%",
                width: "100%"
            }} />
        </TouchableOpacity>


          :


         
          null

          }


       </View>




<View style={{
   marginTop: height(38),
  width: "90%",
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'row',
}}>
 <Text style={{
 color:CurrentViewMode.Mode_fontColor,

 fontWeight: 'bold',
 fontSize: size(16),

 marginLeft: width(22)
 }}>
 Logo
 </Text>

 {
  isSystemTheme == false

  ?
  <MaterialIcons name='check'
  style={{
    color: CurrentViewMode.Mode_fontColor,
    fontSize: size(25),
    marginLeft: width(2)
  }} />

  :

  null
 }



 <Text style={{
 color: CurrentViewMode.Mode_fontColor,
 position: 'absolute',
 fontWeight: 'bold',
 fontSize: size(16),
 right: width(10)
 }}>
 Performance
 </Text>

 {
  isSystemTheme == true

  ?
  <MaterialIcons name='check'
  style={{
    color: CurrentViewMode.Mode_fontColor,
    fontSize: size(25),
    right: width(5),
    position: 'absolute',
  }} />

  :

  null
 }

 </View>



 </View>




       <Text style={{
        color: CurrentViewMode.Mode_fontColor,
        marginTop: height(5),
        marginLeft: width(5),
        fontWeight: "bold",
        fontSize: size(15),
       }}>
       {t("AppearanceTitleInViewModeComponent")}  
       
       </Text>


       <View style={{

        width: "90%",
        marginTop: height(2),
        alignSelf: 'center',
        height: "auto",
      //  backgroundColor: 'yellow'
       }}>
 {/* Theme Selection Buttons */}
 {Object.keys(themes).map((themeKey) => (
            <TouchableOpacity
              key={themeKey}
              onPress={() => {

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
                setCurrentViewMode(themes[themeKey])

        
            }}
              style={{
                flexDirection: "row",
                marginBottom: height(2),
                paddingVertical: size(12),
                alignItems: 'center',
              }}>

              <View style={{
                 backgroundColor: themes[themeKey].Mode_bg,
                 height: 40,
                 width: 40,
                 borderRadius: 15,
                 borderWidth: 1,
                 borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
                 marginRight: width(5),
              }}>

              </View>


              <Text style={{
                fontWeight: "bold",
                fontSize: size(14),
                color: CurrentViewMode.Mode_fontColor
              }}>
                {themes[themeKey].Mode_Name}
              </Text>

            </TouchableOpacity>
          ))}

       </View>


       </ScrollView>
    </ActionSheet>

   
   
    );
  };
  






  