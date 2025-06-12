// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
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
import { Platform } from 'react-native';
import { Link } from 'expo-router';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'

import { FlashList } from "@shopify/flash-list";
import { debounce } from 'lodash';
import SkeletonLoading from 'expo-skeleton-loading'
import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '@/app/Context/CurrentCoinSelectedContext';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import { IndiceListContext } from '@/app/Context/IndiceListContext';
import { Search2Context } from '@/app/Context/SearchIndexStateContext';
import throttle from 'lodash/throttle';
import { OptionsListContext } from '@/app/Context/OptionsListContext';






const Tab = createMaterialTopTabNavigator();













export  function IPOFilterSheet() {

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { SearchIndex2, setSearchIndex2, SearchIndex3, setSearchIndex3 } = useContext(Search2Context);
  const {

    Assets, 
    setAssets,
    ChoosedFilter,
    setChoosedFilter,
    optionsMatchCount, 
    setOptionsMatchCount,
 } = useContext(OptionsListContext)
 

 const Ipo_Sheet = useRef(null);






 

const Filter = [
  

    

  {
    id: "fractional_eh_enabled",
    Name: "Trade from $1 Anytime",
    
  },

  {
    id: "options_late_close",
    Name: "Extended Options Hours",
    
  },

  {
    id: "ptp_no_exception",
    Name: "Tax-Risky Asset",
    
  },

  {
    id: "ptp_with_exception",
    Name: "Tax-Safe Asset",
    
  },
]






const renderItem = useCallback(({ item }) => {
  return (


    <TouchableOpacity
    onPress={() => {
      setChoosedFilter(prev => {
        const cleaned = item.id.toLowerCase().trim(); // ✅ safely extract the id  
        return prev.includes(cleaned)
          ? prev.filter(i => i !== cleaned)
          : [...prev, cleaned];
      });
      
    }}
    
    
      style={{
        top: height(0.5),
        height: height(6),
        width: "90%",
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: size(2),
      }}
    >
      <View
        style={{
          height: size(22),
          width: size(22),
        //  backgroundColor: CurrentViewMode.Mode_fontColor,
          borderWidth: 2,
          borderColor:ChoosedFilter.includes(item.id.toLowerCase().trim())
          ? CurrentViewMode.Mode_fontColor
          : CurrentViewMode.Mode_Sec_fontColor,        
          borderRadius: size(8),
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
       
      </View>

      <Text
        numberOfLines={1}
        style={{
          fontWeight: 'bold',
          fontSize: size(15),
          color: CurrentViewMode.Mode_fontColor,
          marginLeft: width(5),
        }}
      >
        {item.Name}
      </Text>
    </TouchableOpacity>
  );
}, [ChoosedFilter, CurrentViewMode]);









  return(

    

<ActionSheet   
 gestureEnabled={false}
 isModal={true}
 backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
 keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
 
ref={Ipo_Sheet}

onOpen={() => {
  setSearchIndex3(0)
}}
onClose={() => {
  setSearchIndex3(-1)
}}
  CustomHeaderComponent={
<> 

  
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
    

   <ScrollView>


    <Text style={{
      fontSize: size(25),
      fontWeight: "900",
      color: CurrentViewMode.Mode_fontColor,
      marginLeft: width(5),
      marginTop: height(5),
    }}>
    Filter
    </Text>


    <Text style={{
      fontSize: size(14),
      fontWeight: "bold",
      color: CurrentViewMode.Mode_Third_fontColor,
      marginLeft: width(5),
      marginTop: height(1),
      marginBottom: height(3),
    }}>
  {optionsMatchCount} of {Assets.length} ETFs shown
    </Text>


   <FlatList 
  data={Filter}
  keyExtractor={(item, index) => `${item}-${index}`}
  renderItem={renderItem}
  contentContainerStyle={{
    paddingBottom: height(15)
  }}
/>


   </ScrollView>

          



      
 
</ActionSheet>
  )


}





































export default function SearchFilterOptions() {

  const { SearchIndex2, setSearchIndex2, SearchIndex3, setSearchIndex3 } = useContext(Search2Context);

  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


  const {
    Assets, 
    setAssets,
    ChoosedFilter,
    setChoosedFilter,
    optionsMatchCount, 
    setOptionsMatchCount,
 } = useContext(OptionsListContext)





  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);
  const [etfData, setEtfData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);

  

    const [isFetching, setIsFetching] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [SelectedSortPrice, setSelectedSortPrice] = useState("price_desc");
    const [SelectedSort1h, setSelectedSort1h] = useState("percent_change_1h_desc");
    const [SelectedSort24h, setSelectedSort24h] = useState("percent_change_24h_desc");
    const [SelectedSort7d, setSelectedSort7d] = useState("percent_change_7d_desc");
    const [SelectedSort24hVolume, setSelectedSort24hVolume] = useState("volume_desc");
    const [SelectedSortMarketCap, setSelectedSortMarketCap] = useState("market_cap_desc");
    const [forceReload, setForceReload] = useState(false);

const  [sortOrder, setSortOrder] = useState()

  
const  [sortBy, setSortBy] = useState()
const [allCoinsData, setAllCoinsData] = useState([]);











    const SkeletonPlaceholder = () => {
      return (
        <View>
          {/* Show 3 Skeleton Items */}
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonLoading key={index} background={CurrentViewMode.Mode_BgColorBar_Search} highlight={CurrentViewMode.Mode_bg_Search}>
              <View style={{ flexDirection: "row", top: height(3), marginBottom: height(4) }}>
                {/* Left Skeleton Box */}
                <View
                  style={{
                    backgroundColor:  CurrentViewMode.Mode_BgColorBar_Search,
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
                    backgroundColor:  CurrentViewMode.Mode_bg_Search,
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
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-pro-api-key": "CG-9BNXX3AMb2poti6c1BsGi5iG",
      },
    };
  

  const alpacaOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA=='
    }
  };
  
  const polygonApiKey = "O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm";
  
const API_KEY = '4chca2Y9ivZSACoi74WO3mPVvOf33Kwi';

const PAGE_LIMIT = 20;


const [page, setPage] = useState(1);
const [endReached, setEndReached] = useState(false);
const [allAssetsRaw, setAllAssetsRaw] = useState([]);











const fetchAllAssets = async () => {
  setLoading(true);
  const queryAttributes = ['has_options', ...ChoosedFilter].join(',');

  try {
    const res = await fetch(
      `https://broker-api.sandbox.alpaca.markets/v1/assets?status=all&asset_class=us_equity&attributes=${queryAttributes}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization:
            'Basic Q0taUVBHVkg4RllQWDZZNVBXWEU6SDJUVTZJamk5Z2tRVXJuMjRrOUR0WFJoUmFzN2VZSjFzclhCZXZLOA==',
        },
      }
    );
    const data = await res.json();
    console.log('Total assets fetched:', data.length);
    setAllAssetsRaw(data);
    fetchAssetsPage(data, 1); // load first 20
  } catch (err) {
    console.error('Failed to fetch all assets:', err);
  } finally {
    setLoading(false);
  }
};

const fetchAssetsPage = async (data, pageNumber) => {
  const start = (pageNumber - 1) * PAGE_LIMIT;
  const end = start + PAGE_LIMIT;
  const pageSlice = data.slice(start, end);

  const enriched = await Promise.all(
    pageSlice.map(async (asset) => {
      try {
        const logoRes = await fetch(
          `https://api.polygon.io/v3/reference/tickers/${asset.symbol}?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`
        );
        const logoData = await logoRes.json();

        console.log("logoData ", `${logoData.results.branding.icon_url}?apiKey=${polygonApiKey}`)
        return {
          ...asset,
          logo: `${logoData.results.branding.icon_url}?apiKey=${polygonApiKey}`};
      } catch (e) {
        return { ...asset, logo: null };
      }
    })
  );

  setAssets((prev) => {
    const combined = [...prev, ...enriched];
  
    // Filter out duplicates by symbol
    const uniqueMap = new Map();
    for (const asset of combined) {
      uniqueMap.set(asset.symbol, asset); // overrides duplicates
    }
  
    return Array.from(uniqueMap.values());
  });
  
  setPage((prev) => prev + 1);
};

useEffect(() => {
  fetchAllAssets();
}, []);

const handleEndReached = () => {
  if (loading) return;
  fetchAssetsPage(allAssetsRaw, page);
};



const filteredAssets = useMemo(() => {
  if (!ChoosedFilter || ChoosedFilter.length === 0) return Assets;

  return Assets.filter(asset =>
    asset.attributes &&
    ChoosedFilter.every(attr => asset.attributes.includes(attr))
  );
}, [Assets, ChoosedFilter]);

useEffect(() => {
  setOptionsMatchCount(filteredAssets.length);
}, [filteredAssets]);












const renderItem = useCallback(({ item }) => {
    const priceChangeColor = item.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E';
    const priceChangeSymbol = item.price_change_percentage_24h > 0 ? '▲' : '▼';

  return (

    item.name == null ||  item.name == "undefined" ||  item.name == ""

    ?

    null

    :


    <TouchableOpacity onPress={() => {
   /*   setCoinPageIndex(0)
      SheetManager.show('StockPage_Sheet',  {
        payload: { value: item.symbol, category: "Options", }, // Passing dynamic data (payload)
      });
         setCurrentCoinSelected(item)
        */
  



          setCoinPageIndex(0)
          SheetManager.show('StockPage_Sheet',  {
            payload: { value: item.symbol, category: "Options" }, // Passing dynamic data (payload)
          });
          setCurrentCoinSelected({
            id: item.symbol,
            chart: [], 
            CoinChartColor: "", 
            image: item.image,
            name: item.name,
            price: item.current_price,
            symbol: item.symbol,
          });
    
          const handleItemClick = async (item) => {
            try {
              const user = getAuth().currentUser;
              if (!user) return;
          
              const db = getFirestore();
          
              const ref = doc(db, 'users', user.uid, 'ClickedAssets', item.name); // use name as document ID
          
              await setDoc(ref, {
                ...item,
                clickedAt: new Date().toISOString(), // optional timestamp
                  category: "Options"
              });
          
              console.log('Asset saved (no duplicates):', item.name);
            } catch (error) {
              console.error('Error saving asset:', error);
            }
          }; 
         handleItemClick(item)
      
    
         
        

        }}
    style={{
      top: height(0.5),
      height: height(6),
      width: "90%",
      alignSelf: 'center',
      flexDirection: 'row',
     alignItems: 'center',
      marginBottom: size(2),
    }}
    >




{
  item.logo == null  ||   item.logo == "undefined" 

  ?
  
  <View
      style={{
      
      height: size(25),
      width: size(25),
      backgroundColor: CurrentViewMode.Mode_fontColor,
     // marginLeft: width(5),
      borderRadius: size(8),
      overflow: 'hidden',
      }}
    >

   
<Text style={{
  fontSize: size(6),
  fontWeight: "900",
  marginLeft: width(1),
  marginTop: height(0.2),
  color: CurrentViewMode.Mode_bg,
}}>
  {item.symbol}
</Text>

</View>

:

<View
      style={{
      
      height: size(25),
      width: size(25),
      backgroundColor: CurrentViewMode.Mode_fontColor,
     // marginLeft: width(5),
      borderRadius: size(25/2),
      overflow: 'hidden',
      }}
    >

<Image
  source={{uri: `${item.logo}`}}
  style={{
    height: "100%",
    width: "100%",
    resizeMode: "contain", // keeps logos from stretching
  }}
/>
</View>
}





   

    <View
      style={{
  
    
      }}
    >
      <Text
      numberOfLines={1}
      style={{
        fontWeight: 'bold',
        fontSize: size(15),
        width: width(80),
        color: CurrentViewMode.Mode_fontColor,
        marginLeft: width(5),
      }}
      >
       {item.name}
      </Text>

    </View>




 
    </TouchableOpacity>

  );
  }, [Assets]);
  
  


    






  return(


 <>


<View>


<ScrollView horizontal style={{
  flexDirection: 'row',
  marginLeft: width(5),
  marginTop: height(2),
  marginBottom: height(2),
  height: height(5),

}} showsHorizontalScrollIndicator={false}> 



 <TouchableOpacity onPress={() => {
    SheetManager.show("Ipo_Sheet")
  }}

     style={{
        backgroundColor: CurrentViewMode.Mode_Secbg_Buttons_Cash,
        height: height(4),
        width: "auto",
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: width(4),
        alignItems: 'center',
        }}>
          <Text style={{
            fontSize: size(14),
            color: CurrentViewMode.Mode_fontColor,
            fontWeight: "bold",
            alignSelf: 'center',
            marginRight: width(0.5),
          }}>
          Filter
          </Text>

          
          <MaterialIcons name={"filter-list"} 
          style={{

            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(17),
            marginLeft: width(1)
          }} />
        </TouchableOpacity>










        
 </ScrollView>
  </View>


  <FlashList
  contentContainerStyle={{
    paddingBottom: height(15)
  }}
  data={filteredAssets}
  estimatedItemSize={30}
  keyExtractor={(item, index) => `${item.symbol}-${index}`}
  renderItem={renderItem}
  onEndReached={handleEndReached}
  onEndReachedThreshold={0.5}
  ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
/>

    </>
  );
}