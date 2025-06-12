// app/(auth)/_layout.tsx
import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, ActivityIndicator, StyleSheet, Image, Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {AntDesign, Feather, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons"
import { fontSize, height, size, width } from 'react-native-responsive-sizes';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import axios from 'axios';

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
import Icon from 'react-native-vector-icons/FontAwesome';
import { CoinPageContext } from '@/app/Context/OpenCoinPageContext';
import { CurrentCoinSelectedContext } from '@/app/Context/CurrentCoinSelectedContext';
import { ViewModeContext } from '@/app/Context/ViewModeContext';

const Tab = createMaterialTopTabNavigator();








export default function TopCategoriesData({ SearchIndex }) {

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const { setCoinPageIndex } = useContext(CoinPageContext);
  const { setCurrentCoinSelected } = useContext(CurrentCoinSelectedContext);

  
  const [stableCoinsData, setStableCoinsData] = useState([]); // Store stable coins data
  const [isFetching, setIsFetching] = useState(false); // Flag to check if fetching is in progress
  const [isDataFetched, setIsDataFetched] = useState(false); // Flag to check if data is fetched
  const [page, setPage] = useState(1); // Track the page for pagination


   // Static data for categories
   const categories = [
    {
      id: '1',
      name: 'Crypto & Blockchain',
      description: 'Companies building crypto infrastructure and blockchain platforms.',
      iconName: 'currency-btc', // MaterialCommunityIcons
    },
    {
      id: '2',
      name: 'Fintech & Mobile Money',
      description: 'Digital wallets, mobile payments, and financial platforms.',
      iconName: 'wallet-outline', // Ionicons or MaterialCommunityIcons
    },
    {
      id: '3',
      name: 'Global Tech Giants',
      description: 'Top tech companies shaping the digital world.',
      iconName: 'laptop', // FontAwesome
    },
    {
      id: '4',
      name: 'Clean Energy & Sustainability',
      description: 'Companies driving clean and renewable energy solutions.',
      iconName: 'solar-power', // MaterialCommunityIcons
    },
    {
      id: '5',
      name: 'Consumer Brands',
      description: 'Trusted brands in food, beverages, and everyday goods.',
      iconName: 'shopping-outline', // MaterialCommunityIcons
    },
    {
      id: '6',
      name: 'Healthcare & Pharma',
      description: 'Leaders in healthcare innovation and pharmaceuticals.',
      iconName: 'heart-pulse', // MaterialCommunityIcons
    },
    {
      id: '7',
      name: 'Emerging Markets',
      description: 'ETFs and companies with exposure to fast-growing economies.',
      iconName: 'chart-line', // MaterialCommunityIcons
    },
    {
      id: '8',
      name: 'Infrastructure & Development',
      description: 'Construction, logistics, and real assets.',
      iconName: 'office-building', // MaterialCommunityIcons
    },
    {
      id: '9',
      name: 'Luxury & Lifestyle',
      description: 'Premium brands in fashion, cars, and cosmetics.',
      iconName: 'diamond-stone', // MaterialCommunityIcons
    },
    {
      id: '10',
      name: 'Real Estate & REITs',
      description: 'Invest in U.S. real estate through public REITs.',
      iconName: 'home-city-outline', // MaterialCommunityIcons
    },
  ];
  
  
  // Function to simulate fetching data (for now)
  const fetchData = async () => {
    setIsFetching(true);
    try {
      // Simulate data fetching delay
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
      setIsDataFetched(true); // Set to true when data is ready
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsDataFetched(false);
    } finally {
      setIsFetching(false); // Reset fetching state
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

    






  // Mapping of icon names to image sources
/*const iconMapping = {
  DeFi: require("../../../../assets/Defi.png"),
  Gaming: require("../../../../assets/Gaming.png"),
  Stablecoins: require("../../../../assets/Stablecoins.png"),
  PrivacyCoins: require("../../../../assets/PrivacyCoins.png"),
  Cogs: require("../../../../assets/Cogs.png"),
  Bonds: require("../../../../assets/Bonds.png"),
  Bockchain_Infrastructure: require("../../../../assets/Bockchain_Infrastructure.png"),
  Environment: require("../../../../assets/Environment.png"),
  Metaverse: require("../../../../assets/Metaverse.png"),
  Governance: require("../../../../assets/Governance.png"),
  Cyber_Security: require("../../../../assets/Cyber_Security.png"),
};
*/



  return (
  	<ScrollView style={{
      marginTop: height(1)
  }} horizontal showsHorizontalScrollIndicator={false} directionalLockEnabled={true} alwaysBounceVertical={false}>
    <FlatList
      scrollEnabled={false}
      style={{
        height: "auto",
      }}
      onEndReachedThreshold={0.9}
      snapToAlignment="start"
      decelerationRate={"fast"}
      contentContainerStyle={{ alignSelf: 'flex-start', marginLeft: 20 }}
      numColumns={Math.ceil(categories.length / 2)} // Number of stablecoins per row
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      removeClippedSubviews={true}
      windowSize={10}
  
      data={categories} // Data containing stablecoins
      keyExtractor={(item, index) => index.toString()} // Use id as the key for FlatList
      key={Math.ceil(categories.length / 2)} // Add key to force re-render
      renderItem={({ item }) => {
        const priceChangeColor = item.priceChangePercentage > 0 ? '#00CE39' : '#FF1B1E';
        const priceChangeSymbol = item.priceChangePercentage > 0 ? '▲' : '▼';
      
        return (
        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
          borderRadius: 10,
          width: 'auto',
          backgroundColor: CurrentViewMode.Mode_ButtonBgColor_Search,
          height: height(4.5),
          marginRight: 10,
          marginBottom: 20,
        }}>
          <View style={{
            height: size(25),
            width: size(25),
            borderRadius:10,
            backgroundColor: CurrentViewMode.Mode_TopCategories_Search,
            alignSelf: 'center',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          
        
          <MaterialCommunityIcons
          name={item.iconName}
          size={size(18)}
          color="#000"
        />

          </View>
  
          <Text style={{ color: CurrentViewMode.Mode_fontColor, fontWeight: 'bold', marginLeft: width(3), fontSize: size(15) }}>
            {item.name}
          </Text>
       
       
        </TouchableOpacity>
    );
  }}
    />
  </ScrollView>
  
  );
}