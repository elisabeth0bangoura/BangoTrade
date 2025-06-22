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
import { usePostHog } from 'posthog-react-native';





const Tab = createMaterialTopTabNavigator();












































export  function ExcahngeFilterSheet() {
  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { SearchIndex2, setSearchIndex2, SearchIndex3, setSearchIndex3 } = useContext(Search2Context);

  
  const {
    IndexState,
   setIndexState,
   industryState,
   setIndustryState,
   IssuerState,
   setIssuerState,
   trendingCoinsData, 
   setTrendingCoinsData,
   ChoosedIndice, 
   setChoosedIndice,
   etfMatchCount, 
   setEtfMatchCount,
   ChoosedIndustry,
   ChoosedIssuer,

   ChoosedExchange,
   setChoosedExchange,

   ChoosedMarket,
   ChoosedCurrency, setChoosedCurrency,
   ChoosedLocale, setChoosedLocale,

   exchangeOptions, setExchangeOptions,
   currencyOptions, setCurrencyOptions,
   localeOptions, setLocaleOptions,
   marketOptions, setMarketOptions
 } = useContext(IndiceListContext)
 



 const ExcahngeFilter_Sheet = useRef(null);















const renderItem = useCallback(({ item }) => {
  const cleaned = item.toLowerCase().trim();

  const isSelected = ChoosedExchange.includes(cleaned);

  return (
    <TouchableOpacity
      onPress={() => {
        setChoosedExchange((prev) =>
          isSelected
            ? prev.filter((ex) => ex !== cleaned)
            : [...prev, cleaned]
        );
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
          borderWidth: 2,
          borderColor: isSelected
            ? CurrentViewMode.Mode_fontColor
            : CurrentViewMode.Mode_Sec_fontColor,
          borderRadius: size(8),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: size(6),
            fontWeight: "900",
            color: CurrentViewMode.Mode_bg,
          }}
        >
          {item.slice(0, 2)}
        </Text>
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
        {item}
      </Text>
    </TouchableOpacity>
  );
}, [ChoosedExchange]);








  return(

    

<ActionSheet   
 gestureEnabled={false}
 isModal={true}
 backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
 keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
 
ref={ExcahngeFilter_Sheet}

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
   Exchanges
    </Text>


    <Text style={{
      fontSize: size(14),
      fontWeight: "bold",
      color: CurrentViewMode.Mode_Third_fontColor,
      marginLeft: width(5),
      marginTop: height(1),
      marginBottom: height(3),
    }}>
  {etfMatchCount} ETFs shown
    </Text>


   <FlatList 
  data={exchangeOptions}
  keyExtractor={(item, index) => `${item.symbol}-${index}`}
  renderItem={renderItem}
  contentContainerStyle={{
    paddingBottom: height(15)
  }}
/>


   </ScrollView>

          



      
 
</ActionSheet>
  )


}















export  function CurrenciesFilterSheet() {
  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { SearchIndex2, setSearchIndex2, SearchIndex3, setSearchIndex3 } = useContext(Search2Context);

  


  const {
    IndexState,
   setIndexState,
   industryState,
   setIndustryState,
   IssuerState,
   setIssuerState,
   trendingCoinsData, 
   setTrendingCoinsData,
   ChoosedIndice, 
   setChoosedIndice,
   etfMatchCount, 
   setEtfMatchCount,
   ChoosedIndustry,
   ChoosedIssuer,

   ChoosedExchange,
   ChoosedMarket,
   ChoosedCurrency, setChoosedCurrency,
   ChoosedLocale, setChoosedLocale,

   exchangeOptions, setExchangeOptions,
   currencyOptions, setCurrencyOptions,
   localeOptions, setLocaleOptions,
   marketOptions, setMarketOptions
 } = useContext(IndiceListContext)
 



 const CurrenciesFilter_Sheet = useRef(null);
















const renderItem = useCallback(({ item }) => {
  const cleaned = item.toLowerCase().trim();
  const isSelected = ChoosedCurrency.includes(cleaned);

  return (
    <TouchableOpacity
      onPress={() => {
        setChoosedCurrency(prev =>
          isSelected
            ? prev.filter(i => i !== cleaned)
            : [...prev, cleaned]
        );
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
          borderWidth: 2,
          borderColor: isSelected
            ? CurrentViewMode.Mode_fontColor
            : CurrentViewMode.Mode_Sec_fontColor,
          borderRadius: size(8),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: size(6),
            fontWeight: "900",
            color: CurrentViewMode.Mode_bg,
          }}
        >
          {item.slice(0, 2)}
        </Text>
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
        {item}
      </Text>
    </TouchableOpacity>
  );
}, [ChoosedCurrency]);








  return(

    

<ActionSheet   
 gestureEnabled={false}
 isModal={true}
 backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
 keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
 
ref={CurrenciesFilter_Sheet}

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
    Currencies
    </Text>


    <Text style={{
      fontSize: size(14),
      fontWeight: "bold",
      color: CurrentViewMode.Mode_Third_fontColor,
      marginLeft: width(5),
      marginTop: height(1),
      marginBottom: height(3),
    }}>
  {etfMatchCount} ETFs shown
    </Text>


   <FlatList 
  data={currencyOptions}
  keyExtractor={(item, index) => `${item.symbol}-${index}`}
  renderItem={renderItem}
  contentContainerStyle={{
    paddingBottom: height(15)
  }}
/>


   </ScrollView>

          



      
 
</ActionSheet>
  )


}




















































export  function localesFilterSheet() {
  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { SearchIndex2, setSearchIndex2, SearchIndex3, setSearchIndex3 } = useContext(Search2Context);

  
  const {
    IndexState,
   setIndexState,
   industryState,
   setIndustryState,
   IssuerState,
   setIssuerState,
   trendingCoinsData, 
   setTrendingCoinsData,
   ChoosedIndice, 
   setChoosedIndice,
   etfMatchCount, 
   setEtfMatchCount,
   ChoosedIndustry,
   ChoosedIssuer,

   ChoosedExchange,
   ChoosedMarket,
   ChoosedCurrency, setChoosedCurrency,
   ChoosedLocale, setChoosedLocale,

   exchangeOptions, setExchangeOptions,
   currencyOptions, setCurrencyOptions,
   localeOptions, setLocaleOptions,
   marketOptions, setMarketOptions
 } = useContext(IndiceListContext)
 

 


 const localesFilter_Sheet = useRef(null);













 


const renderItem = useCallback(({ item }) => {
  return (
    <TouchableOpacity
    onPress={() => {



      posthog.capture('click_search_locales_filter_etf_button', {
        screen: 'SearchFilterPage_Sheet',
        $screen_name: 'SearchFilterPage_Sheet '+" / "+item.name,
        timestamp: new Date().toISOString(),
    
        });


      setChoosedLocale(prev => {
        const cleaned = item.toLowerCase().trim();
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
          borderColor: ChoosedLocale.includes(item.toLowerCase().trim())
          ? CurrentViewMode.Mode_fontColor
          : CurrentViewMode.Mode_Sec_fontColor,        
          borderRadius: size(8),
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{
          fontSize: size(6),
          fontWeight: "900",
          color: CurrentViewMode.Mode_bg,
        }}>
          {item.slice(0, 2)} {/* First letters as icon */}
        </Text>
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
        {item}
      </Text>
    </TouchableOpacity>
  );
}, [ChoosedLocale, CurrentViewMode]);








  return(

    

<ActionSheet   
 gestureEnabled={false}
 isModal={true}
 backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
 keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
 
ref={localesFilter_Sheet}

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
     Locale
    </Text>


    <Text style={{
      fontSize: size(14),
      fontWeight: "bold",
      color: CurrentViewMode.Mode_Third_fontColor,
      marginLeft: width(5),
      marginTop: height(1),
      marginBottom: height(3),
    }}>
  {etfMatchCount} ETFs shown
    </Text>


   <FlatList 
  data={localeOptions}
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







































export  function MarketFilterSheet() {


  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { SearchIndex2, setSearchIndex2, SearchIndex3, setSearchIndex3 } = useContext(Search2Context);


  const {
    IndexState,
   setIndexState,
   industryState,
   setIndustryState,
   IssuerState,
   setIssuerState,
   trendingCoinsData, 
   setTrendingCoinsData,
   ChoosedIndice, 
   setChoosedIndice,
   etfMatchCount, 
   setEtfMatchCount,
   ChoosedIndustry,
   ChoosedIssuer,

   ChoosedExchange,
   ChoosedMarket,
   setChoosedMarket,
   ChoosedCurrency, setChoosedCurrency,
   ChoosedLocale, setChoosedLocale,

   exchangeOptions, setExchangeOptions,
   currencyOptions, setCurrencyOptions,
   localeOptions, setLocaleOptions,
   marketOptions, setMarketOptions
 } = useContext(IndiceListContext)
 




 const MarketFilter_Sheet = useRef(null);















const renderItem = useCallback(({ item }) => {
  return (
    <TouchableOpacity
    onPress={() => {


      posthog.capture('click_search_filter_market_etf_button', {
        screen: 'SearchFilterPage_Sheet',
        $screen_name: 'SearchFilterPage_Sheet '+" / "+item.name,
        timestamp: new Date().toISOString(),
    
        });


      setChoosedMarket(prev => {
        const cleaned = item.toLowerCase().trim();
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
          borderColor: ChoosedMarket.includes(item.toLowerCase().trim())
          ? CurrentViewMode.Mode_fontColor
          : CurrentViewMode.Mode_Sec_fontColor,        
          borderRadius: size(8),
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{
          fontSize: size(6),
          fontWeight: "900",
          color: CurrentViewMode.Mode_bg,
        }}>
          {item.slice(0, 2)} {/* First letters as icon */}
        </Text>
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
        {item}
      </Text>
    </TouchableOpacity>
  );
}, [ChoosedMarket, CurrentViewMode]);







  return(

    

<ActionSheet   
 gestureEnabled={false}
 isModal={true}
 backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
 keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
 
ref={MarketFilter_Sheet}

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
    ETF Markets
    </Text>


    <Text style={{
      fontSize: size(14),
      fontWeight: "bold",
      color: CurrentViewMode.Mode_Third_fontColor,
      marginLeft: width(5),
      marginTop: height(1),
      marginBottom: height(3),
    }}>
  {etfMatchCount} ETFs shown
    </Text>


   <FlatList 
  data={marketOptions}
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























export default function SearchFilterETFs() {


  const posthog = usePostHog(); // ✅ this gives you access to the actual instance


  const { SearchIndex2, setSearchIndex2, SearchIndex3, setSearchIndex3 } = useContext(Search2Context);

  const { t, i18n } = useTranslation(); // Destructure i18n for language changes


  const {
     IndexState,
    setIndexState,
    industryState,
    setIndustryState,
    IssuerState,
    setIssuerState,
    trendingCoinsData, 
    setTrendingCoinsData,
    ChoosedIndice, 
    setChoosedIndice,
    etfMatchCount, 
    setEtfMatchCount,
    ChoosedIndustry,
    ChoosedIssuer,

    ChoosedExchange,
    ChoosedMarket,
    ChoosedCurrency, setChoosedCurrency,
    ChoosedLocale, setChoosedLocale,

    exchangeOptions, setExchangeOptions,
    currencyOptions, setCurrencyOptions,
    localeOptions, setLocaleOptions,
    marketOptions, setMarketOptions
  } = useContext(IndiceListContext)
  

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const { setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);
  const [etfData, setEtfData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  

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
   






    
  // ✅ Memoize Data
  const trendingCoinsMemoized = useMemo(() => [...trendingCoinsData], [trendingCoinsData]);

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





useEffect(() => {
  const fetchETF = async (symbol) => {
    try {
      const res = await fetch(
        `https://financialmodelingprep.com/api/v4/etf-info?symbol=${symbol}&apikey=${API_KEY}`
      );
      const data = await res.json();
      const etf = data?.[0];
  
      if (!etf) return { symbol };
  
      const industries =
        Array.isArray(etf.sectorsList) && etf.sectorsList.length > 0
          ? etf.sectorsList
              .map((s) => s.industry?.trim())
              .filter(Boolean)
          : [];
  
          const combinedText = ((etf?.description || '') + ' ' + (etf?.name || '')).toLowerCase();

          const matchedIndex = KNOWN_INDEXES.find(({ keywords }) =>
            keywords.some((kw) => combinedText.includes(kw.toLowerCase()))
          )?.name || null;
          
  
      return {
        symbol: etf.symbol,
        name: etf.name,
        index: matchedIndex,
        industries, // ✅ multiple industries here
        issuer: etf.etfCompany,
        url: etf.website,
      };
    } catch (err) {
      console.error(`Error fetching ${symbol}`, err);
      return { symbol };
    }
  };
  


  
  
  const fetchAll = async () => {
    const results = await Promise.all(topETFs.map(fetchETF));
  
    console.log("All ETFs with index info:");
    results.forEach((etf) => {
      console.log(etf.industry);
    });




      // ✅ Clean & deduplicated issuers
  const uniqueIssuers = Array.from(
    new Set(
      results
        .map((r) => (r.issuer || "").toString().trim())
        .filter((issuer) => issuer && issuer.toLowerCase() !== "null")
    )
  ).sort();

  
    const uniqueIndices = Array.from(
      new Set(
        results
          .map((r) => (r.index || "").toString().trim())
          .filter((index) => index && index.toLowerCase() !== "null")
      )
    );
  
 // Flatten all industries from all ETFs and deduplicate
const uniqueIndustries = Array.from(
  new Set(
    results
      .flatMap((etf) => etf.industries || [])
      .map((i) => i.trim())
      .filter((i) => i && i.toLowerCase() !== "null")
  )
).sort();

  
console.log("🎯 ChoosedIndustry:", ChoosedIndustry);

trendingCoinsData.forEach(etf => {
  console.log("🔎 ETF Symbol:", etf.symbol);
  console.log("📦 industries (array):", etf.industries);
  console.log("🏭 Industrien (object):", etf.Industrien);
});

    //setETFs(results);
    setIndexState(uniqueIndices);
  setIndustryState(uniqueIndustries);
  setIssuerState(uniqueIssuers);
    setLoading(false);
  };
  fetchAll()
}, []);




















const ETF_BATCH_SIZE = 50;
const [polygonCursor, setPolygonCursor] = useState(null);
const [polygonHasMore, setPolygonHasMore] = useState(true);
const [isPolygonFetching, setIsPolygonFetching] = useState(false);
const polygonCache = new Map();


const fetchPolygonETFs = async () => {
  if (isPolygonFetching || !polygonHasMore) return;
  setIsPolygonFetching(true);

  try {
    const url = new URL("https://api.polygon.io/v3/reference/tickers");
    url.searchParams.set("type", "ETF");
    url.searchParams.set("market", "stocks");
    url.searchParams.set("active", "true");
    url.searchParams.set("order", "asc");
    url.searchParams.set("limit", ETF_BATCH_SIZE.toString());
    url.searchParams.set("sort", "type");
    url.searchParams.set("apiKey", polygonApiKey);
    if (polygonCursor) url.searchParams.set("cursor", polygonCursor);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`❌ Polygon API error: ${res.status}`);
    const json = await res.json();

    const tickers = json?.results || [];
    const nextCursor = json?.next_url?.split("cursor=")?.[1] || null;

    const cleaned = tickers
      .filter(t => !polygonCache.has(t.ticker))
      .map(t => {
        const data = {
          id: t.ticker,
          symbol: t.ticker,
          name: t.name,
          exchange: t.primary_exchange || "N/A",
          market: t.market || "stocks",
          locale: t.locale || "us",
          currency: t.currency_name || "USD",
          image: `https://assets.parqet.com/logos/symbol/${t.ticker}?format=png&size=100`,
        };
        polygonCache.set(t.ticker, data);
        return data;
      });

    setAllCoinsData(prev => [...prev, ...cleaned]);
    setTrendingCoinsData(prev => [...prev, ...cleaned]);
    setPolygonCursor(nextCursor);
    setPolygonHasMore(Boolean(nextCursor));
    setIsDataFetched(true);
  } catch (err) {
    console.error("🚨 Polygon ETF fetch failed:", err.message);
    setIsDataFetched(false);
  } finally {
    setIsPolygonFetching(false);
  }
};

useEffect(() => {
  fetchPolygonETFs(); // Load first batch on mount
}, []);

const loadMore = useCallback(
  throttle(() => {
    if (!isPolygonFetching && polygonHasMore) {
      fetchPolygonETFs();
    }
  }, 1000),
  [isPolygonFetching, polygonHasMore]
);





const filteredCoins = useMemo(() => {
  const seenSymbols = new Set();
  const normalize = (val) =>
    typeof val === "string" ? val.toLowerCase().trim() : null;

  return trendingCoinsData.filter((etf) => {
    const index = normalize(etf.Indizes);
    const issuer = normalize(etf.Emittenten);
    const exchange = normalize(etf.exchange);
    const market = normalize(etf.market);
    const currency = normalize(etf.currency);
    const locale = normalize(etf.locale); // ✅ NEW

    const normalizedIndustries = Object.entries(etf.Industrien || {}).reduce((acc, [key, value]) => {
      acc[normalize(key)] = value;
      return acc;
    }, {});

    const matchIndex =
      ChoosedIndice.length === 0 ||
      ChoosedIndice.some(sel => {
        const s = normalize(sel);
        return index?.includes(s) || s?.includes(index);
      });

    const matchIndustry =
      ChoosedIndustry.length === 0 ||
      ChoosedIndustry.some(sel => {
        const industryName = normalize(sel);
        const exposure = normalizedIndustries[industryName];
        return exposure && exposure >= 5;
      });

    const matchIssuer =
      ChoosedIssuer.length === 0 ||
      ChoosedIssuer.some(sel => issuer?.includes(normalize(sel)));

    const matchExchange =
      ChoosedExchange.length === 0 ||
      ChoosedExchange.includes(exchange);

    const matchMarket =
      ChoosedMarket.length === 0 ||
      ChoosedMarket.includes(market);

    const matchCurrency =
      ChoosedCurrency.length === 0 ||
      ChoosedCurrency.includes(currency);

    const matchLocale =
      ChoosedLocale.length === 0 ||
      ChoosedLocale.includes(locale); // ✅ NEW

    const isDuplicate = seenSymbols.has(etf.symbol);
    if (
      matchIndex &&
      matchIndustry &&
      matchIssuer &&
      matchExchange &&
      matchMarket &&
      matchCurrency &&
      matchLocale && // ✅ NEW
      !isDuplicate
    ) {
      seenSymbols.add(etf.symbol);
      return true;
    }

    return false;
  });
}, [
  trendingCoinsData,
  ChoosedExchange,
  ChoosedMarket,
  ChoosedCurrency,
  ChoosedLocale, // ✅ NEW
  ChoosedIndice,
  ChoosedIndustry,
  ChoosedIssuer
]);









useEffect(() => {
  setEtfMatchCount(filteredCoins.length);
}, [filteredCoins]);







useEffect(() => {
  if (trendingCoinsData.length === 0) return;

  const seen = (key) => new Set(trendingCoinsData.map(item => item[key]).filter(Boolean));

  setExchangeOptions(Array.from(seen('exchange')).sort());
  setCurrencyOptions(Array.from(seen('currency')).sort());
  setLocaleOptions(Array.from(seen('locale')).sort());
  setMarketOptions(Array.from(seen('market')).sort());
}, [trendingCoinsData]);















// ✅ Lazy-loaded Chart Component
const RenderChart = React.memo(({ chart, color }) => {
  if (!chart || chart.length === 0) return null;
  return (
    <LineChart.Provider data={chart}>
      <LineChart height={50} width={40} color={color}>
        <LineChart.Path width={1.2} color={color} />
      </LineChart>
    </LineChart.Provider>
  );
});



   // 🔹 Detect When Coins Become Visible & Fetch Charts
   const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  
 
 

const renderItem = useCallback(({ item }) => {
    const priceChangeColor = item.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E';
    const priceChangeSymbol = item.price_change_percentage_24h > 0 ? '▲' : '▼';

  return (
    <TouchableOpacity onPress={() => {

      posthog.capture('open_stock_bottomsheet', {
        screen: 'SearchFilterPage_Sheet',
        $screen_name: 'SearchFilterPage_Sheet '+" / "+item.name,
        timestamp: new Date().toISOString(),
    
        });
      setCoinPageIndex(0)
      SheetManager.show('StockPage_Sheet',  {
        payload: { value: item.symbol, category: "ETF", }, // Passing dynamic data (payload)
      });
         setCurrentCoinSelected(item)
        

    
  
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

    <View
      style={{
  
    
      }}
    >
      <Text
      numberOfLines={1}
      style={{
        fontWeight: 'bold',
        fontSize: size(15),
        color: CurrentViewMode.Mode_fontColor,
        marginLeft: width(5),
      }}
      >
      {item.name}
      </Text>
    </View>

 
 
    </TouchableOpacity>

  );
  }, []);
  
  


    






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

posthog.capture('click_search_filter_exchange_filter_etf_button', {
  screen: 'SearchFilterPage_Sheet',
  $screen_name: 'SearchFilterPage_Sheet',
  timestamp: new Date().toISOString(),

  });
    SheetManager.show("ExcahngeFilter_Sheet")
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
            marginRight: width(0.5)
          }}>
          Exchange
          </Text>

          
          <MaterialIcons name={sortOrder == "price_desc" ?  "keyboard-arrow-up" : "keyboard-arrow-down"} 
          style={{

            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(25),
          }} />
        </TouchableOpacity>






        <TouchableOpacity onPress={() => {

        posthog.capture('click_search_filter_currencies_filter_etf_button', {
          screen: 'SearchFilterPage_Sheet',
          $screen_name: 'SearchFilterPage_Sheet',
          timestamp: new Date().toISOString(),

          });
          
         SheetManager.show("CurrenciesFilter_Sheet")
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
          marginLeft: width(5),
           
        }}>
          <Text style={{
            fontSize: size(14),
            color: CurrentViewMode.Mode_fontColor,
            fontWeight: "bold",
            alignSelf: 'center',
            marginRight: width(0.5)
          }}>
          Currency
          </Text>

          <MaterialIcons name={SelectedSort1h === "percent_change_1h_desc" ? "keyboard-arrow-up" : "keyboard-arrow-down"} 

          style={{
            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(25),
          }} />
        </TouchableOpacity>





        <TouchableOpacity onPress={() => {

          posthog.capture('click_search_filter_locales_filter_etf_button', {
            screen: 'SearchFilterPage_Sheet',
            $screen_name: 'SearchFilterPage_Sheet',
            timestamp: new Date().toISOString(),

            });

          SheetManager.show("localesFilter_Sheet")
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
          marginLeft: width(5),
        }}>
          <Text style={{
            fontSize: size(14),
            color: CurrentViewMode.Mode_fontColor,
            fontWeight: "bold",
            alignSelf: 'center',
            marginRight: width(0.5)
          }}>
          Locale
          </Text>

          <MaterialIcons name={SelectedSort24h === "percent_change_24h_desc" ? "keyboard-arrow-up" : "keyboard-arrow-down"} 

          style={{
            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(25),
          }} />
        </TouchableOpacity>






        <TouchableOpacity onPress={() => {

          posthog.capture('click_search_filter_market_filter_etf_button', {
            screen: 'SearchFilterPage_Sheet',
            $screen_name: 'SearchFilterPage_Sheet',
            timestamp: new Date().toISOString(),

            });

          SheetManager.show("MarketFilter_Sheet")
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
          marginLeft: width(5),
        }}>
          <Text style={{
            fontSize: size(14),
            color: CurrentViewMode.Mode_fontColor,
            fontWeight: "bold",
            alignSelf: 'center',
            marginRight: width(0.5)
          }}>
          Market
          </Text>

          <MaterialIcons name={SelectedSort24h === "percent_change_24h_desc" ? "keyboard-arrow-up" : "keyboard-arrow-down"} 

          style={{
            color: CurrentViewMode.Mode_fontColor,
            fontSize: size(25),
          }} />
        </TouchableOpacity>




        



        
 </ScrollView>
  </View>

  {isDataFetched ? (
    <FlashList 
  data={filteredCoins}
  keyExtractor={(item, index) =>
    item?.symbol ? `etf-${item.symbol}` : `etf-${index}-${Date.now()}`
  }
  renderItem={renderItem}
  onEndReached={loadMore}
  estimatedItemSize={30}
  onEndReachedThreshold={0.6}
  initialNumToRender={10}
  contentContainerStyle={{
    paddingBottom: height(15),
  }}
/>


      ) : (
        <SkeletonPlaceholder />
      )}
    </>
  );
}