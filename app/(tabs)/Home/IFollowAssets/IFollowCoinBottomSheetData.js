import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';

import { View, Text, StyleSheet, LayoutAnimation, Dimensions,Animated, UIManager, Platform, TouchableOpacity,   Image } from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, Feather, FontAwesome, FontAwesome6, Foundation, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../Languages_Translation_Screens/i18n'; 
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';
import database from '@react-native-firebase/database';
import auth, {firebase} from '@react-native-firebase/auth';
import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';
import firestore from '@react-native-firebase/firestore';


import { CoinPageContext } from '../../../Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '../../../Context/CurrentCoinSelectedContext';
import {Search2Context} from '../../../Context/SearchIndexStateContext';
import Collapsible from 'react-native-collapsible';

import { IFollowingsCoinsContext } from '../../../Context/OpenIFollowingsCoinsSheetContext';
import { LinearGradient } from 'expo-linear-gradient';
import { OpenAddMoreIFollowCoinsContext } from '../../../Context/OpenAddMoreIFollowCoinsContext';
import  { Keyframe, SlideInDown, SlideOutUp } from 'react-native-reanimated';
import ActionSheet, {ScrollView, BottomSheetBackdrop, FlashList, SheetManager} from "react-native-actions-sheet";

import { SearchContext, SearchContextProvider } from '../../../Context/MainSearchIndexStateContext';
import { ViewModeContext } from '@/app/Context/ViewModeContext';










const IFollowCoinBottomSheetData = () => {



  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const CoinSIFollow_Sheet = useRef(null);
  const windowHeight = Dimensions.get('window').height;


  const currentUser = auth().currentUser;

  const { SearchIndex2 } = useContext(Search2Context);
  const {CoinPageIndex, setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);

  const { SearchIndex, setSearchIndex, SearchLoading, setSearchLoading } = useContext(SearchContext);

  const {IFollowingsCoinsIndex, setIFollowingsCoinsIndex } = useContext(IFollowingsCoinsContext);
  const {
    OpenAddMoreIFollowCoinsIndex, 
    setOpenAddMoreIFollowCoinsIndex, 
    FilterState, 
    setFilterState,
    FilterStateUpDown,
    setFilterStateUpDown,
    combinedPercentage,
    setCombinedPercentage
   } = useContext(OpenAddMoreIFollowCoinsContext);
   
   const [FontColorIsDark, setFontColorIsDark] = useState()
   const [loading, setLoading] = useState(true);

   
  const [filteredCoins, setFilteredCoins] = useState([]);
  
  
  const formatMarketCap = (value) => {
    // Ensure value is a valid number before formatting
    if (typeof value !== 'number' || isNaN(value)) {
      return '-'; // Return '-' if the value is invalid
    }
  
    if (value >= 1e12) {
      return `${(value / 1e12).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} T`; // Trillion
    } else if (value >= 1e9) {
      return `${(value / 1e9).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bio.`; // Billion (Milliarde)
    } else if (value >= 1e6) {
      return `${(value / 1e6).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Mio.`; // Million
    } else if (value >= 1e3) {
      return `${(value / 1e3).toLocaleString('de-DE')} K`; // Thousand
    } else {
      return `${value.toLocaleString('de-DE')} €`; // Less than 1,000
    }
  };
  
  
   



  const { t } = useTranslation();
  const [userLang, setUserLang] = useState();
  const [user, setUser] = useState(null);

  const [activeState, setactiveState] = useState("1D");
  const [wallets, setWallets] = useState([]);
  const memoizedWallets = useMemo(() => wallets, [wallets]);
  const [OpenFollowingCoinList, setOpenFollowingCoinList] = useState(true); // State to track the transition


  const [coinIds, setCoinIds] = useState([]);
  const [coins, setCoins] = useState([]);




  

// Format price with commas and the Euro symbol
const formatPrice = (price) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};





  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG', // Use your actual API key
    },
  }
  


  // Enable LayoutAnimation on Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);


  
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('CoinsIFollow')
      .onSnapshot((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.data().id);
        console.log("Real-time Coin IDs from Firestore:", ids);
        setCoinIds(ids); // Update coin IDs whenever Firestore changes
      });
  
    return () => unsubscribe(); // Clean up on unmount
  }, []);
  
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('CoinsIFollow')
      .onSnapshot((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.data().id);
        console.log("Real-time Coin IDs from Firestore:", ids);
        setCoinIds(ids); // Update coin IDs whenever Firestore changes
      });
  
    return () => unsubscribe(); // Clean up on unmount
  }, []);
  

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('CoinsIFollow')
      .onSnapshot((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.data().id);
        console.log("Real-time Coin IDs from Firestore:", ids);
        setCoinIds(ids); // Update coin IDs whenever Firestore changes
      });
  
    return () => unsubscribe(); // Clean up on unmount
  }, []);
  
  // Fetch user-followed coin data
  useEffect(() => {
    const fetchAndStoreData = async () => {
      try {
        // Fetch user's favorite assets from Firestore
        const userDocRef = firestore().collection('users').doc(currentUser.uid).collection('CoinsIFollow');
        const userDocuments = await userDocRef.get();
  
        if (!userDocuments.empty) {
          const updatedAssets = { stocks: [], crypto: [] }; // Separate state for stocks and crypto
          let totalPercentageChange = 0;
          let fetchedCoins = [];
  
          // Loop through each asset to check the type and fetch corresponding data
          for (const doc of userDocuments.docs) {
            const asset = doc.data();
            const { id, symbol, class: assetClass } = asset;
  
            if (assetClass === 'us_equity') {
              // Fetch stock data from Polygon
              const polygonInfoRes = await fetch(
                `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`
              );

              const polygonInfoJson = await polygonInfoRes.json();
  
              // Extract necessary data for stock
              const price = polygonInfoJson.ticker.lastTrade.p;
              const price_change_percentage_24h = polygonInfoJson.ticker.todaysChangePerc;
              const logo = `https://assets.parqet.com/logos/symbol/${symbol}?format=png&size=100`;


              const polygonMarketCap = await fetch(
                `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`
              );

              const polygonMarketCapInfoJson = await polygonMarketCap.json();
              const Marketcap = polygonMarketCapInfoJson.results.market_cap; 


  
              updatedAssets.stocks.push({
                name: asset.name,
                symbol: symbol,
                price: price,
                price_change_percentage_24h: price_change_percentage_24h,
                image: logo,
                type: 'stock',  // Mark this as stock type
                market_cap: Marketcap,
              });
  
              totalPercentageChange += price_change_percentage_24h; // Add stock percentage change to the total
            }
  
            if (assetClass === 'crypto') {
              try {
                const response = await fetch(
                  `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&per_page=1`,
                  { headers: { 'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG' } }
                );
                const data = await response.json();
  
                // Ensure the data is correctly fetched
                if (data.length > 0) {
                  updatedAssets.crypto.push({
                    name: data[0].name,
                    symbol: data[0].symbol,
                    price: data[0].current_price.toFixed(2),
                    price_change_percentage_24h: data[0].price_change_percentage_24h.toFixed(2),
                    image: data[0].image || '',
                    type: 'crypto',  // Mark this as crypto type
                    market_cap: data[0].market_cap,
                  });
  
                  totalPercentageChange += parseFloat(data[0].price_change_percentage_24h); // Add crypto percentage change to the total
                }
              } catch (error) {
                console.error(`Error fetching data for ${symbol}:`, error);
              }
            }
          }
  
          // Combine stocks and crypto data
          const allAssets = [...updatedAssets.stocks, ...updatedAssets.crypto];
          setFilteredCoins(allAssets); // Update the filtered coins with both stocks and crypto
  
          // Calculate the average percentage change for both stocks and crypto
          const averagePercentageChange = totalPercentageChange / allAssets.length;
          setCombinedPercentage(averagePercentageChange.toFixed(2)); // Set the combined percentage change
        }
  
        setLoading(false); // Set loading to false when the data fetch is done
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false if there's an error
      }
    };
  
    fetchAndStoreData();
  
    let interval;
  
    if (IFollowingsCoinsIndex === 0) {
      fetchAndStoreData(); // Initial fetch
      interval = setInterval(fetchAndStoreData, 45000); // Fetch every 45 seconds
    }
  
    return () => {
      if (interval) clearInterval(interval); // Cleanup interval on unmount or when OpenAddMoreIFollowCoinsIndex changes
    };
  }, [coinIds, OpenAddMoreIFollowCoinsIndex]);
  


  useEffect(() => {
  
    // Apply filter based on the current FilterState
    switch (FilterState) {
      case "Daily Trend":
        // Sorting based on 24h price change for both stocks and crypto
        filteredCoins.sort((a, b) => {
          return FilterStateUpDown === "desc"
            ? b.price_change_percentage_24h - a.price_change_percentage_24h
            : a.price_change_percentage_24h - b.price_change_percentage_24h;
        });
        break;
  

        
        case "Coin Name":
          // Sorting based on the name of the asset (for both crypto and stock)
          filteredCoins.sort((a, b) => {
            const nameA = a.name || ''; // Default to empty string if name is missing
            const nameB = b.name || ''; // Default to empty string if name is missing
    
            // Now, "desc" means ascending (A-Z) and "asc" means descending (Z-A)
            return FilterStateUpDown === "desc"
              ? nameA.localeCompare(nameB)  // Ascending order (A-Z)
              : nameB.localeCompare(nameA);  // Descending order (Z-A)
          });
          break;
    
  
      case "Market Cap":
        // Sorting based on market cap for both stocks and crypto
        filteredCoins.sort((a, b) => {
          return FilterStateUpDown === "desc" 
            ? b.market_cap - a.market_cap 
            : a.market_cap - b.market_cap;
        });
        break;
  
      default:
        break;
    }
  
    // Update the filtered list of coins
    setFilteredCoins(filteredCoins); 
  
  }, [FilterState, FilterStateUpDown, filteredCoins]); // Trigger filter when filter state or filteredCoins change
  
  
  console.log("filteredCoins ", filteredCoins)




  // Animated opacity reference
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  // Effect to animate opacity on SearchLoading change
  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: SearchLoading ? 0.3 : 1, // Adjust opacity values
      duration: 300, // Smooth transition duration (adjust as needed)
      useNativeDriver: true, // Enables GPU acceleration
    }).start();
  }, [SearchLoading]);






  const keyframeAnimation = new Keyframe({
    0: {
      transform: [{ translateY: 20 }],
      opacity: 0,
    },
    100: {
      transform: [{ translateY: 0 }],
      opacity: 1,
    },
  });
  

  

  // Followed Coin 

  const renderItem = ({ item }) => (

    <TouchableOpacity onPress={() => {
      SheetManager.show('CoinPage_Sheet');
        setCurrentCoinSelected(item)
        setCoinPageIndex(0);
      }}>
    <Animated.View
    entering={keyframeAnimation.duration(400)}
    exiting={SlideOutUp.duration(300)}
    style={{
      height: height(8),
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: width(5),
      marginBottom: height(1),
    }}
  >

      <View style={{
        height: size(25),
        width: size(25),
        borderRadius: size(25)/2,
        overflow: 'hidden',
      }}>
        <Image source={{uri: item.image}} style={{
          height: "100%",
          width: "100%"
        }} /> 
      </View>

     <View style={{
      width: "90%",
      marginLeft: width(5),
     }}> 
      <Text style={{ fontSize: size(16), color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold' }}>
        {item.name}
      </Text>

      <View style={{
        flexDirection: 'row',
      }}>
      
      <Text style={{
  fontSize: size(14), 
  right: width(5), 
  position: 'absolute', 
  marginTop: height(0.5), 
  color: FilterState === "Market Cap" ? CurrentViewMode.Mode_fontColor : (item.price_change_percentage_24h >= 0 ? '#00CE39' : '#FF1B1E'), 
  fontWeight: '900'
}}>
  {FilterState === "Market Cap" ? 
    `${formatMarketCap(item.market_cap)}` : 
    `${item.price_change_percentage_24h >= 0 ? '▲ ' : '▼ '}${parseFloat(item.price_change_percentage_24h).toFixed(2)} %`
  }
</Text>


      </View>
      <Text style={{ fontSize: size(14), marginTop: height(0.5), color: CurrentViewMode.Mode_Sec_fontColor, fontWeight: 'bold' }}>
       {formatPrice(item.price)}
      </Text>
      </View>


     
    </Animated.View>
    </TouchableOpacity>
  );

  


  



  const AddMoreIFollowCoinsBottomSheet = () => {
    setOpenAddMoreIFollowCoinsIndex(0); // Set to 0 to trigger the opening
  };











  const OpenMainSearch = () => {
    setSearchIndex(0); // Set to 0 to trigger the opening
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    console.log(SearchIndex)
  };











// Scroll Bottmsheet 
const scrollY = useRef(new Animated.Value(0)).current;






  // Interpolate background color based on scroll position


const bgColor = scrollY.interpolate({
  inputRange: [0, 209],
  outputRange: [combinedPercentage >= 0 ? '#074843' : '#48071B', CurrentViewMode.Mode_bg],  // Start and end colors
  extrapolate: 'clamp',
});

  
  // Scroll handler to update scroll position with useNativeDriver for performance
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false, // We are not animating styles that require native driver (like background color)
    }
  );


  
  const calculatedHeight = windowHeight * 0.91;





const ColorPriceChange = combinedPercentage >= 0 ? '#074843' : '#48071B'







// Function to calculate luminance of a color
function getLuminance(color) {
  // Convert the color to RGB (if it's in hexadecimal format)
  let r = 0, g = 0, b = 0;

  if (color[0] === '#') {
    color = color.slice(1);
    if (color.length === 4) {
      color = color.split('').map((char) => char + char).join('');
    }

    r = parseInt(color.substr(0, 2), 16);
    g = parseInt(color.substr(2, 2), 16);
    b = parseInt(color.substr(4, 2), 16);
  }

  r = r / 255;
  g = g / 255;
  b = b / 255;

  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance;
}

// Function to detect if a color is dark, considering deep dark tones
function isColorDeepDark(color) {
  const luminance = getLuminance(color);

  // Check for very dark colors, i.e., close to black
  const isDark = luminance < 0.2; // You can adjust this threshold based on your needs

  // You can also check if the color is very close to black (e.g., hex codes like #000000 or #010101)
  const isVeryCloseToBlack = color === "#000000" || color === "#010101";

  return isDark || isVeryCloseToBlack;
}

// Example usage
const color = ColorPriceChange; // This is the orange color you mentioned



useEffect(() => {

  if (isColorDeepDark(color)) {
    console.log('The color is dark');
    setFontColorIsDark(true)
  } else {
    console.log('The color is not dark');
    setFontColorIsDark(false)
  }
  

}, [isColorDeepDark])






  return (



      <ActionSheet   
      gestureEnabled={true}
      isModal={false}
      backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
      keyboardHandlerEnabled={true} // ✅ Prevents closing when keyboard opens
      
        ref={CoinSIFollow_Sheet}
        
        onOpen={() => {
         // setSearchIndex(-1)
         setIFollowingsCoinsIndex(0)

        //  setSearchLoading(true)
     //   SheetManager.show("CoinSIFollow_Sheet")
      //  SheetManager.hide("SearchPage_Sheet")
       // setSearchIndex(-1)
        
        }}   // Updates state when the sheet opens
        onClose={() => {
     //    SheetManager.hide("CoinSIFollow_Sheet")
         setIFollowingsCoinsIndex(-1)

        
        }} // Updates state when the sheet closes
      bo


      
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
            backgroundColor: bgColor,
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
            height: height(92),
            backgroundColor: CurrentViewMode.Mode_bg,
        }}>
        


      <View style={{
      //  opacity: CoinPageIndex === 0 || SearchIndex2 === 0 ? 0.1 : 1,

        height: "100%",
        width: "100%"
      }}>





<ScrollView contentContainerStyle={{paddingBottom: height(20)}}  
        onScroll={handleScroll}
        scrollEventThrottle={6} // Increase the frequency of updates

      
      
style={{
  backgroundColor: CurrentViewMode.Mode_bg,
//  opacity: PriceTrackerIndex == 0 || AmountIndex == 0 ? 0 : 100,
  height: "100%",
 // zIndex: PriceTrackerIndex === 0 || AmountIndex === 0 ? -1 :  1,
}}>
   <Animated.View style={{ opacity: animatedOpacity }}> 
<LinearGradient
 style={{
  height: height(60),
  position: 'absolute',
  width: "100%",
  backgroundColor: CurrentViewMode.Mode_bg,
 }}
    locations={[0, 0.4, 1, 1]} 
    colors={[ combinedPercentage >= 0 ? '#074843' : '#48071B', CurrentViewMode.Mode_bg, CurrentViewMode.Mode_bg]} />




    <Text style={{
		fontWeight: "900",
		color: FontColorIsDark == true ? "#fff" : CurrentViewMode.Mode_fontColor,
		fontSize: size(25),
		marginLeft: width(5),
		marginTop: height(3),
	   }}>
		 {t("FollowingHeader")}  
	   </Text>





     <Text style={{
        fontSize: size(18),
        fontWeight: "bold",
        color: combinedPercentage >= 0 ? '#00E040' : '#FF1B1E',
        marginLeft: width(5),
        marginTop: height(2),
        marginBottom: height(4)
        }}>
        {combinedPercentage >= 0 ? '▲' : '▼'} {combinedPercentage} %

        </Text>
    




        <View style={{
            flexDirection: 'row',
            width: "100%"
        }}>

   

        <TouchableOpacity onPress={() => {
           SheetManager.show('SortAfterComponentFollowCoins_Sheet');
             AddMoreIFollowCoinsBottomSheet(0)
        }}
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: height(2),
            marginBottom: height(4),
            marginLeft: width(5),
        }}>

        <Text style={{
            fontSize: size(16),
            fontWeight: "bold",
            color: CurrentViewMode.Mode_fontColor,

         
          
        }}>

        {
            FilterState == "Daily Trend"

            ?

           t("DailyTrendComponentFollowCoins") 

            :

            null

        }

        {
            FilterState == "Asset Name"

            ?

            t("AssetNameComponentFollowCoins") 

            :

            null

        }


        {
            FilterState == "Market Cap"

            ?

            t("MarketCapComponentFollowCoins") 

            :

            null

        }
     
        </Text>


        <MaterialIcons name="keyboard-arrow-down" 
        style={{
            fontSize: size(25),
            color: CurrentViewMode.Mode_fontColor,
            marginLeft: width(1.5),
        }} />


        </TouchableOpacity>






        <TouchableOpacity onPress={() => setFilterStateUpDown((prev) => (prev === "desc" ? "asc" : "desc"))}

        style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: height(2),
            marginBottom: height(4),
            position: 'absolute',
            right: width(10),
        }}>

        <MaterialIcons
        name={FilterStateUpDown === "desc" ? "arrow-upward" : "arrow-downward"}
        style={{
            fontSize: size(22),
            color: CurrentViewMode.Mode_fontColor,
            marginLeft: width(1.5),
        }} />

        </TouchableOpacity>

        </View>







        <Animated.FlatList
            contentContainerStyle={{
                 paddingBottom: height(25),
            }}
            style={{ height: '100%', width: "90%", alignSelf: 'center', }}
           scrollEnabled={false}
            data={filteredCoins}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: height(1), color: CurrentViewMode.Mode_fontColor, }}>
                  {t("NoCoinsFollowedHeader")} 
              </Text>
            }
          />
         

         
         </Animated.View>
    
         </ScrollView>



         <TouchableOpacity
        onPress={() => {
          SheetManager.show('SearchPage_Sheet');
            setSearchIndex(0);  // Open the BottomSheet
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            console.log("Opening Search: ", SearchIndex);
        }}
         style={{
          height: size(55),
          paddingHorizontal: 25,
          borderRadius: 20,
          flexDirection: "row",
          zIndex: 1,
          bottom: height(8),
          right: size(30),
          justifyContent: 'center',
          alignItems: 'center',
          width: "auto",
          position: 'absolute',
          backgroundColor:  CurrentViewMode.Mode_ButtonColor_Profile,
        
		  }}>
		
		  <Text style={{
			color: CurrentViewMode.Mode_fontColor,
            
			fontWeight: 'bold',
			fontSize: size(18)
		  }}>
               {t("AddHeaderIFollowCoinBottomSheetData")}    
            </Text>

            <MaterialIcons 
          name="add" style={{
			fontSize: size(20),
			color: CurrentViewMode.Mode_fontColor,
          marginLeft: width(2)
		  }} />
         </TouchableOpacity>

        </View>



</ActionSheet>
    
  
  );
};

export default IFollowCoinBottomSheetData;
