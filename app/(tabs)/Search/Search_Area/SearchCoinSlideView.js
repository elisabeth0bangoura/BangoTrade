import React, { useCallback,  createContext, useState, useContext, useMemo, useRef, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import { View, Platform, Text, TouchableWithoutFeedback, KeyboardAvoidingView,  Keyboard, ActivityIndicator, Button, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons"

import { BlurView } from 'expo-blur'; // If you're using Expo
import SearchCoinSlideViewData from './SearchCoinSlideViewData';
import debounce from 'lodash.debounce';

import { Search2Context } from '../../../Context/SearchIndexStateContext';
import FilterCoinsSearchTabs from '../SearchFilter/FilterCoinsSearchTabs';
import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '../../../Context/CurrentCoinSelectedContext';

import CoinPage from '../../../(coin)/coinPage';
import { ViewModeContext } from '@/app/Context/ViewModeContext';






export default function SlideUpView ()  {


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const {CoinPageIndex, setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);


  const inputRef = useRef(null)
  const [SearchIndex, setSearchIndex] = useState(-1)

  const { SearchIndex2, setSearchIndex2 } = useContext(Search2Context);
  const [searchQuery, setSearchQuery] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
  const [SearchIndex3, setSearchIndex3] = useState(-1);

  const [searchQuery3, setSearchQuery3] = useState('');
  const [isKeyboardVisible3, setKeyboardVisible3] = useState(false);
  

  const sheetRef3 = useRef(null);

  const sheetRef2 = useRef(null);
  const inputRef3 = useRef(null);

  const snapPoints3 = useMemo(() => ["91%"], []);
  

  

  // Memoized snap points
  const snapPoints = useMemo(() => ["90%"], []);

  // **Keyboard Visibility Listener**
  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleSearchChange = (text) => {
    setSearchQuery(text); // ✅ Instant UI update
  };

  // **Auto-focus input when BottomSheet opens**
  useEffect(() => {
    if (SearchIndex2 === 0) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [SearchIndex2]);

  // **BottomSheet Handlers**
  const handleSheetChange = useCallback((index) => setSearchIndex2(index), [setSearchIndex2]);

  const handleSnapPress = useCallback(() => {
    if (SearchIndex2 !== 0) {
      setKeyboardVisible(true);
      sheetRef2.current?.snapToIndex(0);
      setSearchIndex2(0);
    }
  }, [SearchIndex2]);

  const handleClosePress = useCallback(() => {
    setSearchQuery('');
    setKeyboardVisible(false);
    sheetRef2.current?.close();
    Keyboard.dismiss();
    setSearchIndex2(-1);
  }, []);




























  // callbacks
  // **Auto-focus input when BottomSheet opens**
  useEffect(() => {
    if (SearchIndex3 === 0) {
      setTimeout(() => inputRef3.current?.focus(), 50);
    }
  }, [SearchIndex3]);

  // **BottomSheet Handlers**
  const handleSheetChange3 = useCallback((index) => setSearchIndex3(index), [setSearchIndex3]);

  
  const handleSnapPress3 = useCallback(() => {
    if (SearchIndex3 !== 0) {
     // setKeyboardVisible(true);
      sheetRef3.current?.snapToIndex(0);
      setSearchIndex3(0);
    }
  }, [SearchIndex3]);


  const handleClosePress3 = useCallback(() => {
    sheetRef3.current?.close();
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






  return (




   

 <>











<BottomSheet
        ref={sheetRef3}
        index={SearchIndex3}
        enablePanDownToClose={true}
        snapPoints={snapPoints3}
        enableDynamicSizing={false}
        onChange={handleSheetChange3}

        style={{
          backgroundColor: 'transparent',
          shadowColor: '#000',
          zIndex: 10000,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          elevation: 20,
          }}
          handleIndicatorStyle={{
          backgroundColor: "transparent", 
          height: size(4), 
          width: size(40), 
          marginTop: -15,
          alignSelf: 'center',
          borderRadius: 20,  // Add borderRadius here to make the handle rounded
          }}
        
          handleStyle={{
          backgroundColor: 'transparent', // Set handle background to transparent
        
          height: 0, // Remove the handle height
          borderTopLeftRadius: 60,  // Rounded top-left corner of the handle
          borderTopRightRadius: 60, // Rounded top-right corner of the handle
          }}
          backgroundStyle={{
          backgroundColor: '#0F0F0F',
          }}>
             <FilterCoinsSearchTabs SearchIndex3={SearchIndex3} />
      </BottomSheet>




        <BottomSheet
        ref={sheetRef2}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        onChange={handleSheetChange}
      
        style={{
          backgroundColor: 'transparent',
          shadowColor: '#000',
          zIndex: 10000,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          elevation: 20,
          }}
          handleIndicatorStyle={{
          backgroundColor: "transparent", 
          height: size(4), 
          width: size(40), 
          marginTop: -15,
          alignSelf: 'center',
          borderRadius: 20,  // Add borderRadius here to make the handle rounded
          }}
        
          handleStyle={{
          backgroundColor: 'transparent', // Set handle background to transparent
        
          height: 0, // Remove the handle height
          borderTopLeftRadius: 60,  // Rounded top-left corner of the handle
          borderTopRightRadius: 60, // Rounded top-right corner of the handle
          }}
          backgroundStyle={{
          backgroundColor: '#0F0F0F',
          }} >



          <>
          
     

      	<ScrollView contentContainerStyle={{
          paddingBottom: height(18),
          paddingTop: height(4),
        }} showsVerticalScrollIndicator={false}>  

          <SearchCoinSlideViewData searchQuery={searchQuery} SearchIndex2={SearchIndex2} />

        </ScrollView>

        </>
      </BottomSheet>









      {/*<BottomSheet
	        ref={sheetRefCoinPage}
			index={CoinPageIndex}
			snapPoints={snapPointsCoinPage}
			enableDynamicSizing={false}
			enablePanDownToClose={true}
			onChange={handleSheetChangeCoinPage}
		//	backdropComponent={renderBackdropSearchCoinPage}

		/*	
        ref={sheetRefCoinPageTest}
        snapPoints={snapPointsCoinPageTest}
		index={-1}
		enablePanDownToClose={true}
        enableDynamicSizing={false}
        onChange={handleSheetChangeCoinPageTest} */
    /*  > 
        <BottomSheetView style={{

		}}>
        	<CoinPage /> 
        </BottomSheetView>
		</BottomSheet>

*/}






{ // if Coin Page opens hide the searchbar
      CoinPageIndex == 0

      ?

      null

      :
<> 



{
  SearchIndex3 == 0 


  ?

  <BlurView
    tint="dark"
    intensity={95}
    style={{
      position: 'absolute',
      bottom: isKeyboardVisible  ? height(37) : height(0),

    
      height: height(13),
      width: "100%",
      zIndex: 1000, // Ensure it's on top
    }}
  >
    {SearchIndex2 == 0 ? (
      <>

      <View style={{
        flexDirection: 'row',
        width: "100%",
        position: "absolute",
        alignItems: 'center',
        bottom: height(5),
      }}>
      <MaterialIcons name='search' style={{
         color: CurrentViewMode.Mode_fontColor,
         position: 'absolute',
         marginLeft: width(10),
         zIndex: 10,
         fontSize: size(25),
      }} />

          <TextInput
          ref={inputRef}
          value={searchQuery} // ✅ Instant Update
          onChangeText={handleSearchChange} 
          placeholder="Search for DeFi, Stable coins, Cryptocurrencies"
          placeholderTextColor={"#fff"}
          style={{
            paddingVertical: height(2),
            marginLeft: width(7),
            width: width(65),
            borderRadius: 15,
            paddingLeft: width(12), 
             paddingRight: width(5),
            backgroundColor: "#272729",
            color: CurrentViewMode.Mode_fontColor,
            fontWeight: 'bold',
            fontSize: size(15),
          
          }}
        />

        <TouchableOpacity 
          style={{
            paddingVertical: height(2),
            position: "absolute",
            right: width(2),
            width: width(25),
            borderRadius: 15,
            paddingHorizontal: width(5),
            zIndex: 1002, // Ensure it's clickable
          }}
          onPress={handleClosePress} // Close when clicked
        >
          <Text
            style={{
              alignSelf: 'center',
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "bold",
              fontSize: size(15)
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        </View>
      </>
    ) : (
      <>

        <TouchableOpacity
         onPress={handleSnapPress}

          style={{
            paddingVertical: height(2),
            position: "absolute",
            bottom: height(5),
            alignSelf: 'center',  
            width: "85%",
            borderRadius: 15,
            backgroundColor: "#272729",
            paddingHorizontal: width(5),
            zIndex: 1001, // Ensure it's clickable
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: CurrentViewMode.Mode_fontColor,
              width: "90%",
              fontWeight: 'bold',
              fontSize: size(15),
            }}
          >
            Search DeFi, Stable coins, Cryptocurrencies
          </Text>
        </TouchableOpacity>




      
      
      </>
    )}
  </BlurView>



  :


  <BlurView
    tint="dark"
    intensity={95}
    style={{
      position: 'absolute',
      bottom: isKeyboardVisible  ? height(37) : height(0),

      alignItems: 'center',
      height: height(13),
      flexDirection: 'row',
      width: "100%",
      zIndex: 1000, // Ensure it's on top
    }}
  >
    {SearchIndex2 == 0 ? (
      <>

      <View style={{
        flexDirection: 'row',
        width: "100%",
        position: "absolute",
        alignItems: 'center',
        bottom: height(5),
      }}>
      <MaterialIcons name='search' style={{
         color: CurrentViewMode.Mode_fontColor,
         position: 'absolute',
         marginLeft: width(10),
         zIndex: 10,
         fontSize: size(25),
      }} />

          <TextInput
          ref={inputRef}
          value={searchQuery} // ✅ Instant Update
          onChangeText={handleSearchChange} 
          placeholder="Search for DeFi, Stable coins, Cryptocurrencies"
          placeholderTextColor={"#fff"}
          style={{
            paddingVertical: height(2),
            marginLeft: width(7),
            width: width(65),
            borderRadius: 15,
            paddingLeft: width(12), 
             paddingRight: width(5),
            backgroundColor: "#272729",
            color: CurrentViewMode.Mode_fontColor,
            fontWeight: 'bold',
            fontSize: size(15),
          
          }}
        />

        <TouchableOpacity 
          style={{
            paddingVertical: height(2),
            position: "absolute",
            right: width(2),
            width: width(25),
            borderRadius: 15,
            paddingHorizontal: width(5),
            zIndex: 1002, // Ensure it's clickable
          }}
          onPress={handleClosePress} // Close when clicked
        >
          <Text
            style={{
              alignSelf: 'center',
              color: CurrentViewMode.Mode_fontColor,
              fontWeight: "bold",
              fontSize: size(15)
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        </View>
      </>
    ) : (
      <>

        <TouchableOpacity
         onPress={handleSnapPress}

          style={{
            paddingVertical: height(2),
            position: "absolute",
            bottom: height(5),
            marginLeft: width(7),
            width: "65%",
            borderRadius: 15,
            backgroundColor: "#272729",
            paddingLeft: width(5),
            zIndex: 1001, // Ensure it's clickable
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: CurrentViewMode.Mode_fontColor,
              width: "90%",
              fontWeight: 'bold',
              fontSize: size(15),
            }}
          >
            Search DeFi, Stable coins, Cryptocurrencies
          </Text>
        </TouchableOpacity>




        <TouchableOpacity onPress={() => handleSnapPress3(0)} 
          style={{
            height: height(6),
            bottom: height(5),
            marginLeft: width(5),
            width: width(15),
            borderRadius: 15,
            position: 'absolute',
            right: width(7),
            alignItems: 'center',
            backgroundColor: "#272729",
            justifyContent: 'center',
            zIndex: 1001, // Ensure it's clickable
          }}
        >
          <MaterialIcons
            name="filter-list"
            style={{
              color: CurrentViewMode.Mode_fontColor,
              fontSize: size(25),
            }}
          />
        </TouchableOpacity>


      
      
      </>
    )}
  </BlurView>


  
}


</>
}






   </>


   
   
  );
};


