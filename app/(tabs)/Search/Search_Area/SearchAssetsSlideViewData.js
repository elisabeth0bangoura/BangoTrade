// app/(auth)/_layout.tsx
import React, { useCallback, useContext,  useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import Page from "../../Home/home"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import axios from 'axios';
import Profile from "../../Profile/profile"
import CountryFlag from "react-native-country-flag";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../../../Languages_Translation_Screens/i18n';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Cash from "../../Cash/cash"
import { BlurView } from 'expo-blur'; // If you're using Expo
import { LineChart } from 'react-native-wagmi-charts';
import { Platform } from 'react-native';
import { Link } from 'expo-router';

import { router } from 'expo-router';
import { Blur } from '@shopify/react-native-skia';
import { MotiView } from 'moti'

import { FlashList } from "@shopify/flash-list";
import { debounce } from 'lodash';
import {Search2Context} from '../../../Context/SearchIndexStateContext';
import SkeletonLoading from 'expo-skeleton-loading'
import { CurrentCoinSelectedContext } from '@/app/Context/CurrentCoinSelectedContext';
import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
import ActionSheet, {useSheetRef, SheetManager} from 'react-native-actions-sheet';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { ViewModeContext } from '@/app/Context/ViewModeContext';


import { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs, setDoc, addDoc, onSnapshot } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";





const Tab = createMaterialTopTabNavigator();









const SkeletonPlaceholder = () => {
  return (
    <View>
      {/* Show 3 Skeleton Items */}
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonLoading key={index} background={"#1E1E1F"} highlight={"#666"}>
          <View style={{ flexDirection: "row", top: height(3), marginBottom: height(4) }}>
            {/* Left Skeleton Box */}
            <View
              style={{
                backgroundColor: "#1E1E1F",
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
                backgroundColor: "#1E1E1F",
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




export default function SearchAssetsSlideViewData ({SearchIndex2, searchQuery})  {


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  
  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

  const [categoryData, setCategoryData] = useState({});
  const [trendingCoins, setTrendingCoins] = useState([]);
  const searchController = useRef(null);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);
  const {CoinPageIndex, setCoinPageIndex } = useContext(CoinPageContext);

  const [CategoryDataETF, setCategoryDataETF] = useState([])
  const animation = useRef(null);

  const [assets, setAssets] = useState([]);


const [CategoryDataCrypto, setCategoryDataCrypto] = useState([])
const [isFetchingCrypto, setIsFetchingCrypto] = useState(false);


  const [isFetchingStocks, setIsFetchingStocks] = useState(false);
  const [isFetchingETFs, setIsFetchingETFs] = useState(false);


  const stockSearchController = useRef(null);
  const etfSearchController = useRef(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-pro-api-key': 'CG-9BNXX3AMb2poti6c1BsGi5iG',
    },
  };







  
  const fetchSearchResults = async (query) => {
    if (stockSearchController.current) {
      stockSearchController.current.abort();
    }
    stockSearchController.current = new AbortController();
    const signal = stockSearchController.current.signal;
  
    setIsFetchingStocks(true);
    try {
      const baseUrl = "https://api.polygon.io";
      const listRes = await fetch(
        `${baseUrl}/v3/reference/tickers?type=CS&market=stocks&search=${query}&active=true&order=asc&limit=4&sort=ticker&apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`,
        { signal }
      );
      const listData = await listRes.json();
      const tickers = listData?.results || [];
  
      const enriched = await Promise.all(
        tickers.map(async (item) => {
          try {
            // Fetch detailed company info
            const [detailsRes, snapshotRes] = await Promise.all([
              fetch(`${baseUrl}/v3/reference/tickers/${item.ticker}?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`, { signal }),
              fetch(`${baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${item.ticker}?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`, { signal })
            ]);
  
            const detailsData = await detailsRes.json();
            const snapshotData = await snapshotRes.json();
  
            const companyInfo = detailsData?.results || {};
            const change24h = snapshotData?.ticker?.day?.change / snapshotData?.ticker?.day?.open * 100;
  
          
            console.log({image:  companyInfo?.branding?.icon_url  })

            return {
              ...item,
              ...companyInfo,
              image: companyInfo?.branding?.icon_url 
              ? `${companyInfo.branding.icon_url}?apiKey=${POLYGON_API_KEY}`
              : undefined,            
              price_change_percentage_24h: snapshotData.ticker.todaysChange ?? 0
            };
          } catch (innerErr) {
            console.error(`🔻 Error enriching ${item.ticker}:`, innerErr);
            return item; // fallback to base data
          }
        })
      );
  
      setCategoryData(enriched);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('🚨 Error fetching stocks:', err);
      }
    } finally {
      setIsFetchingStocks(false);
    }
  };
  




  const fetchSearchResultsETFs = async (query) => {
    if (etfSearchController.current) {
      etfSearchController.current.abort();
    }
    etfSearchController.current = new AbortController();
    const signal = etfSearchController.current.signal;
  
    setIsFetchingETFs(true);
    try {
      const baseUrl = "https://api.polygon.io";
      const listRes = await fetch(
        `${baseUrl}/v3/reference/tickers?type=ETF&market=stocks&search=${query}&active=true&order=asc&limit=4&sort=ticker&apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`,
        { signal }
      );
      const listData = await listRes.json();
      const tickers = listData?.results || [];
  
      const enriched = await Promise.all(
        tickers.map(async (item) => {


          console.log(item.ticker)
          try {
            const [detailsRes, snapshotRes] = await Promise.all([
              fetch(`${baseUrl}/v3/reference/tickers/${item.ticker}?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`, { signal }),
              fetch(`${baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${item.ticker}?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm`, { signal })
            ]);
  
            const detailsData = await detailsRes.json();
            const snapshotData = await snapshotRes.json();
  
            const etfInfo = detailsData?.results || {};
            const change24h = snapshotData?.ticker?.day?.change / snapshotData?.ticker?.day?.open * 100;
  
            return {
              ...item,
              ...etfInfo,
              image: etfInfo?.branding?.icon_url + "?apiKey=O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm",
              price_change_percentage_24h: snapshotData.ticker.todaysChange ?? 0
            };
          } catch (innerErr) {
            console.error(`🔻 Error enriching ETF ${item.ticker}:`, innerErr);
            return item;
          }
        })
      );
  
      setCategoryDataETF(enriched);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('🚨 Error fetching ETFs:', err);
      }
    } finally {
      setIsFetchingETFs(false);
    }
  };
  







  const fetchSearchResultsCrypto = async (query) => {
 
  
    if (searchController.current) {
      searchController.current.abort();
    }
    searchController.current = new AbortController();
    const signal = searchController.current.signal;
  
    setIsFetchingCrypto(true);
    try {
      console.log("🔎 Fetching search results for:", query);
  
      // ✅ Fetch more coins to avoid missing results
      const marketRes = await fetch(`https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=300`, { ...options, signal });
      let marketData = await marketRes.json();
  
      if (!marketData?.length) {
        console.log("❌ No results found.");
        setCategoryDataCrypto({});
        setIsFetchingCrypto(false);
        return;
      }
  
      // ✅ Filter locally by name or symbol
      let filteredCoins = marketData.filter(coin =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
  
      // ✅ Categorize filtered results
      setCategoryDataCrypto(filteredCoins.slice(0, 4));
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('🚨 Error fetching search data:', err);
      }
    } finally {
      setIsFetchingCrypto(false);
    }
  };
  








  const POLYGON_API_KEY = 'O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm';
  const COINGECKO_API_KEY = 'CG-9BNXX3AMb2poti6c1BsGi5iG';
  
  const fetch24hChange = async (item) => {
    try {
      if (item.category === 'crypto') {
        const url = `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${item.coingeckoId}`;
        const res = await fetch(url, {
          headers: {
            accept: 'application/json',
            'x-cg-pro-api-key': COINGECKO_API_KEY,
          },
        });
        const json = await res.json();
        return json[0]?.price_change_percentage_24h ?? null;
      } else {
        const symbol = item.ticker || item.symbol;
        const url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`;
        const res = await fetch(url);
        const json = await res.json();
        return json?.ticker?.todaysChangePerc ?? null;
      }
    } catch (err) {
      console.error(`Error fetching 24h change for ${item.ticker || item.id}`, err);
      return null;
    }
  };
  
  


  const fetchLastFiveAssets = async () => {
    const POLYGON_API_KEY = 'O5SefV4Z4uUMK7_cC7AP9p4Afq7YEEtm';
    const COINGECKO_API_KEY = 'CG-9BNXX3AMb2poti6c1BsGi5iG';
  
    const fetch24hChange = async (item) => {
      try {
        if (item.category === 'crypto') {
          const id = item.id || item.coingeckoId;
          if (!id) return null;
  
          const res = await fetch(`https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}`, {
            headers: {
              accept: 'application/json',
              'x-cg-pro-api-key': COINGECKO_API_KEY,
            },
          });
          const json = await res.json();
          return json?.[0]?.price_change_percentage_24h ?? null;
        } else {
          const ticker = item.ticker || item.symbol;
          if (!ticker) {
            console.warn("❗ Missing ticker/symbol for:", item);
            return null;
          }
  
          const res = await fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apiKey=${POLYGON_API_KEY}`);
          const json = await res.json();
          return json?.ticker?.todaysChangePerc ?? null;
        }
      } catch (err) {
        console.error(`❌ Error fetching 24h change for ${item.ticker || item.id}:`, err.message);
        return null;
      }
    };
  
    try {
      const user = getAuth().currentUser;
      if (!user) return;
  
      const db = getFirestore();
      const assetsRef = collection(db, 'users', user.uid, 'ClickedAssets');
      const q = query(assetsRef, orderBy('clickedAt', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
  
      const rawAssets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const enrichedAssets = await Promise.all(
        rawAssets.map(async (item) => {
          const change = await fetch24hChange(item);
  
          // Fix image if it's "undefined?apiKey..."
          const fixedImage = item.image?.startsWith("undefined") ? null : item.image;
  
          return {
            ...item,
            image: fixedImage,
            price_change_percentage_24h: change,
          };
        })
      );
  
      console.log("✅ Last 5 Enriched Assets:", enrichedAssets);
      setAssets(enrichedAssets);
    } catch (error) {
      console.error('❌ Error fetching last 5 assets:', error);
    }
  };
  
  






  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
  
    const debounceSearch = debounce(async (query) => {
      setIsFetchingStocks(true);
      setIsFetchingETFs(true);
      setIsFetchingCrypto(true);
  
      try {
        await Promise.all([
          fetchSearchResults(query, signal),
          fetchSearchResultsETFs(query, signal),
          fetchSearchResultsCrypto(query, signal),
          fetchLastFiveAssets()
        ]);
      } catch (err) {
        if (err.name !== 'AbortError') console.error("Search error:", err);
      }
    }, 200);
  
    debounceSearch(searchQuery);
  
    return () => {
      debounceSearch.cancel();
      controller.abort();
    };
  }, [searchQuery]);
  

  const isFetching = isFetchingStocks || isFetchingETFs;





  

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




  

  const renderItemStocks = useCallback(({ item }) => {
    const priceChangeColor = item.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E';
    const priceChangeSymbol = item.price_change_percentage_24h > 0 ? '▲' : '▼';

  return (

    <Animated.View entering={FadeIn} exiting={FadeOut}>


    <TouchableOpacity onPress={() => {
   


  setCoinPageIndex(0)
  SheetManager.show('StockPage_Sheet',  {
    payload: { value: item.ticker }, // Passing dynamic data (payload)
  });
  setCurrentCoinSelected({
  id: item.ticker,
  chart: [], 
  CoinChartColor: "", 
  image: item.image,
  name: item.name,
  price: item.current_price,
  symbol: item.ticker,
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
          category: "stocks"
      });
  
      console.log('Asset saved (no duplicates):', item.name);
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  }; 
 handleItemClick(item)


    }}
    style={{
      top: height(1),
   // height: height(8),
    zIndex: 1000,
    width: "90%",
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: size(12),
   alignItems: 'center',
    marginBottom: height(1),
    }}
    >

  {
item.image === "undefined" || !item.image

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
{item.ticker}
</Text>
  </View>

  :



 <View
      style={{
        height: size(23),
        width: size(23),
    //  backgroundColor: '#fff',
     // marginLeft: width(5),
      borderRadius: size(23) / 2,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      }}
    >
      <Image
      source={{ uri: item.image }}
      style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
      />
    </View>

}
  
      <Text
      numberOfLines={1}
      style={{
        width: "60%",
        fontWeight: 'bold',
        fontSize: size(15),
        color: CurrentViewMode.Mode_fontColor,
        marginLeft: width(5),
      }}
      >
     {item.name}
      </Text>
  

 
 
      
      {/*item.chart && item.chart.length > 0 ? (
          <View style={{ height: 50, width: 40, marginLeft: width(10) }}>
            <RenderChart chart={item.chart} color={item.CoinChartColor} />
          </View>
        ) : (
          <SkeletonLoading background={"#1E1E1F"} highlight={"#666"}>
            <View style={{ height: 50, width: 40 }} />
          </SkeletonLoading>
        )*/}



      <Text
      style={{
        fontSize: size(15),
        position: 'absolute',
        right: width(0),
        fontWeight: 'bold',
        color: priceChangeColor,
      }}
      >
      {priceChangeSymbol} {parseFloat(item.price_change_percentage_24h).toFixed(2)}%
      </Text>
      </TouchableOpacity>
      </Animated.View>
);
}, []);














  const renderItem = useCallback(({ item }) => {
    const isUpOrSame = item.price_change_percentage_24h >= 0;
    const priceChangeColor = isUpOrSame ? '#00CE39' : '#FF1B1E';
    const priceChangeSymbol = isUpOrSame ? '▲' : '▼';
    
    
  return (

<Animated.View entering={FadeIn} exiting={FadeOut}>


<TouchableOpacity onPress={() => {



if(item.category == "stocks" || item.category == "derivatives") {

  setCoinPageIndex(0)
  SheetManager.show('StockPage_Sheet',  {
    payload: { value: item.ticker }, // Passing dynamic data (payload)
  });
  setCurrentCoinSelected({
    id: item.ticker,
    chart: [], 
    CoinChartColor: "", 
    image: item.image,
    name: item.name,
    price: item.current_price,
    symbol: item.ticker,
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
          category: "stocks"
      });
  
      console.log('Asset saved (no duplicates):', item.name);
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  }; 
 handleItemClick(item)



 
 } else if(item.category == "crypto") {

  setCoinPageIndex(0);
  SheetManager.show('CoinPage_Sheet',  {
    payload: { value: item.symbol }, // Passing dynamic data (payload)
  });
  setCurrentCoinSelected({
    image: item.image,
    name: item.name,
    price: "",
    price_change_percentage_24h: "",
    symbol: item.symbol.toUpperCase(),
    id: item.name.toLowerCase(),
    type: "crypto"
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
        category: "crypto"
      });
  
      console.log('Asset saved (no duplicates):', item.name);
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };
  handleItemClick(item)

  
} 


else if (item.category == "ETFs") {



  const handleItemClick = async (item) => {
    try {
      const user = getAuth().currentUser;
      if (!user) return;
  
      const db = getFirestore();
  
      const ref = doc(db, 'users', user.uid, 'ClickedAssets', item.name); // use name as document ID
  
      await setDoc(ref, {
        ...item,
        clickedAt: new Date().toISOString(), // optional timestamp
        category: "ETFs"
      });
  
      console.log('Asset saved (no duplicates):', item.name);
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };
  handleItemClick(item)



  setCoinPageIndex(0)
  SheetManager.show('StockPage_Sheet',  {
    payload: { value: item.ticker, category: "ETF", }, // Passing dynamic data (payload)
  });
  setCurrentCoinSelected({
    image: item.image,
    name: item.name,
    price: "",
    price_change_percentage_24h: "",
    symbol: item.ticker,
    id: item.ticker,
    type: "ETF"
  });
    
}



    }}
    style={{
      top: height(1),
   // height: height(8),
    zIndex: 1000,
    width: "90%",
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: size(12),
   alignItems: 'center',
    marginBottom: height(1),
    }}
    >

  {
    item.category == "derivatives" ||   item.category == "ETFs"

    ?

    <View
    style={{
    
    height: size(25),
    width: size(25),
    backgroundColor: CurrentViewMode.Mode_fontColor,
   // marginLeft: width(5),
    borderRadius: size(7),
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
{item.ticker}
</Text>
  </View>

  :



 <View
      style={{
        height: size(23),
        width: size(23),
    //  backgroundColor: '#fff',
     // marginLeft: width(5),
      borderRadius: size(23) / 2,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      }}
    >
      <Image
      source={{ uri: item.image }}
      style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
      />
    </View>

}
  
      <Text
      numberOfLines={1}
      style={{
        width: "60%",
        fontWeight: 'bold',
        fontSize: size(15),
        color: CurrentViewMode.Mode_fontColor,
        marginLeft: width(5),
      }}
      >
      {item.name}
      </Text>
  

      <Text
      style={{
        fontSize: size(15),
        position: 'absolute',
        right: width(0),
        fontWeight: 'bold',
        color: priceChangeColor,
      }}
      >
      {priceChangeSymbol} {parseFloat(item.price_change_percentage_24h).toFixed(2)}%
      </Text>
      </TouchableOpacity>
      </Animated.View>
);
}, []);














const renderItemETF = useCallback(({ item }) => {
  const priceChangeColor = item.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E';
  const priceChangeSymbol = item.price_change_percentage_24h > 0 ? '▲' : '▼';

return (

  <Animated.View entering={FadeIn} exiting={FadeOut}>


  <TouchableOpacity onPress={() => {

const handleItemClick = async (item) => {
  try {
    const user = getAuth().currentUser;
    if (!user) return;

    const db = getFirestore();

    const ref = doc(db, 'users', user.uid, 'ClickedAssets', item.name); // use name as document ID

    await setDoc(ref, {
      ...item,
      clickedAt: new Date().toISOString(), // optional timestamp
      category: "ETFs"
    });

    console.log('Asset saved (no duplicates):', item.name);
  } catch (error) {
    console.error('Error saving asset:', error);
  }
};
handleItemClick(item)



setCoinPageIndex(0)
SheetManager.show('StockPage_Sheet',  {
  payload: { value: item.ticker, category: "ETF", }, // Passing dynamic data (payload)
});

setCurrentCoinSelected({
  id: item.ticker,
  chart: [], 
  CoinChartColor: "", 
  image: item.image,
  name: item.name,
  price: item.current_price,
  symbol: item.ticker,
});
    
  }}
  style={{
    top: height(1),
   // height: height(8),
    zIndex: 1000,
    width: "90%",
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: size(12),
   alignItems: 'center',
    marginBottom: height(1),
  }}
  >
  <View
      style={{
      
      height: size(23),
      width: size(23),
      backgroundColor: CurrentViewMode.Mode_fontColor,
     // marginLeft: width(5),
      borderRadius: size(5),
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
  {item.ticker}
</Text>
    </View>


    <Text
    numberOfLines={1}
    style={{
      width: "60%",
      fontWeight: 'bold',
      fontSize: size(15),
      color: CurrentViewMode.Mode_fontColor,
      marginLeft: width(5),
    }}
    >
    {item.name}
    </Text>




    
    {/*item.chart && item.chart.length > 0 ? (
        <View style={{ height: 50, width: 40, marginLeft: width(10) }}>
          <RenderChart chart={item.chart} color={item.CoinChartColor} />
        </View>
      ) : (
        <SkeletonLoading background={"#1E1E1F"} highlight={"#666"}>
          <View style={{ height: 50, width: 40 }} />
        </SkeletonLoading>
      )*/}



    <Text
    style={{
      fontSize: size(15),
      position: 'absolute',
      right: width(0),
      fontWeight: 'bold',
      color: priceChangeColor,
    }}
    >
    {priceChangeSymbol} {parseFloat(item.price_change_percentage_24h).toFixed(2)}%
    </Text>
    </TouchableOpacity>
    </Animated.View>
);
}, []);













const renderItemCrypto = useCallback(({ item }) => {
  const priceChangeColor = item.price_change_percentage_24h > 0 ? '#00CE39' : '#FF1B1E';
  const priceChangeSymbol = item.price_change_percentage_24h > 0 ? '▲' : '▼';

return (

  <Animated.View entering={FadeIn} exiting={FadeOut}>


  <TouchableOpacity onPress={() => {

      setCoinPageIndex(0);
      SheetManager.show('CoinPage_Sheet',  {
        payload: { value: item.symbol }, // Passing dynamic data (payload)
      });
      setCurrentCoinSelected({
        image: item.image,
        name: item.name,
        price: "",
        price_change_percentage_24h: "",
        symbol: item.symbol.toUpperCase(),
        id: item.name.toLowerCase(),
        type: "crypto"
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
            category: "crypto"
          });
      
          console.log('Asset saved (no duplicates):', item.name);
        } catch (error) {
          console.error('Error saving asset:', error);
        }
      };
      handleItemClick(item)
    
    
  
      
  }}
  style={{
    top: height(4),
   // height: height(8),
    zIndex: 1000,
    width: "90%",
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: size(12),
   alignItems: 'center',
    marginBottom: height(1),
  }}
  >
<View
    style={{
    height: size(25),
    width: size(25),
    backgroundColor: '#fff',
   // marginLeft: width(5),
    borderRadius: size(25) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    }}
  >
    <Image
    source={{ uri: item.image }}
    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
    />
  </View>



    <Text
    numberOfLines={1}
    style={{
      width: "60%",
      fontWeight: 'bold',
      fontSize: size(15),
      color: CurrentViewMode.Mode_fontColor,
      marginLeft: width(5),
    }}
    >
    {item.name}
    </Text>




    
    {/*item.chart && item.chart.length > 0 ? (
        <View style={{ height: 50, width: 40, marginLeft: width(10) }}>
          <RenderChart chart={item.chart} color={item.CoinChartColor} />
        </View>
      ) : (
        <SkeletonLoading background={"#1E1E1F"} highlight={"#666"}>
          <View style={{ height: 50, width: 40 }} />
        </SkeletonLoading>
      )*/}



    <Text
    style={{
      fontSize: size(15),
      position: 'absolute',
      right: width(0),
      fontWeight: 'bold',
      color: priceChangeColor,
    }}
    >
    {priceChangeSymbol} {parseFloat(item.price_change_percentage_24h).toFixed(2)}%
    </Text>
    </TouchableOpacity>
    </Animated.View>
);
}, []);


















  const renderCategory = (key, coins) => coins.length > 0 && (
    <View key={key}>
      <Text style={{ color: CurrentViewMode.Mode_fontColor, fontSize: size(20), marginTop: height(3), marginBottom: height(2), marginLeft: width(5), fontWeight: 'bold' }}>{getFriendlyTitle(key)}</Text>
      <FlatList data={coins} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );


 

  return (
    <View>
      {searchQuery === '' ? (
        <>   
        <Text style={{ color: CurrentViewMode.Mode_fontColor, fontSize: size(20),  marginBottom: height(2), marginLeft: width(5), fontWeight: 'bold' }}>
        {t("SearchTitleInTextInputSearchPage")}
        </Text>
        <FlatList data={assets} keyExtractor={(item) => item.id} renderItem={renderItem} />

        </>
     ) : (categoryData.length > 0 || CategoryDataETF.length > 0) || categoryData.length > 0 || CategoryDataETF.length > 0 || CategoryDataCrypto.length > 0 ? (


        <>
        <Text style={{
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "900",
          fontSize: size(14),
          marginLeft: width(5)
        }}>
          Aktien
        </Text>
        <FlatList scrollEnabled={false} contentContainerStyle={{
          paddingBottom: height(3)
        }}
        data={categoryData}
        keyExtractor={(item) => item.ticker || item.name}
        renderItem={renderItemStocks}
      />



<Text style={{
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "900",
          fontSize: size(14),
          marginLeft: width(5)
        }}>
          ETFs
        </Text>
   <FlatList contentContainerStyle={{
          paddingBottom: height(3)
        }}
        data={CategoryDataETF}
        keyExtractor={(item) => item.ticker || item.name}
        renderItem={renderItemETF}
      />




<Text style={{
          color: CurrentViewMode.Mode_fontColor,
          fontWeight: "900",
          fontSize: size(14),
          marginLeft: width(5),
          top: height(3),
          marginBottom: height(1)
      
        }}>
          Crypto
        </Text>
        <FlatList  scrollEnabled={false}  contentContainerStyle={{
          paddingBottom: height(3)
        }}
        data={CategoryDataCrypto}
        keyExtractor={(item) => item.symbol || item.name}
        renderItem={renderItemCrypto}
      />

       </>
      ) : isFetching && (
        <LottieView
        autoPlay
        ref={animation}
        style={{
          width: size(50),
          alignSelf: 'center',
          marginTop:  size(50),
          height: 100,
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require("../../../../assets/loadibg.json")}
      />
      )}
    </View>
  );
}