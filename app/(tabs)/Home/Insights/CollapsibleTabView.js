import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { height, size, width } from 'react-native-responsive-sizes';
import {TabView, TabBar} from 'react-native-tab-view';

import { VictoryPie, VictoryTheme } from 'victory-native';
import StocksPieChart from './StocksPieChart';
import CryptoDonutChart from './CryptoPieChart';
import { useTranslation } from 'react-i18next';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import AllAssets_Overview from './AllAssets_Overview';
import { AnalyticsContext } from '@/app/Context/AnalyticsContext';
import ETFsPieChart from './ETFsPieChart';
import OptionsPieChart from './OptionsPieChart';
import { usePostHog } from 'posthog-react-native';










const SCREEN_WIDTH = Dimensions.get('window').width;
const TabBarHeight = 48;
const HeaderHeight = 0;





const CollapsibleTabView = () => {

  const posthog = usePostHog(); // ✅ this gives you access to the actual instance

  const {
    FilterState, 
    setFilterState,
    hasCrypto, setHasCrypto,
    hasStocks, setHasStocks,
    hasEtfs, setHasEtfs,
    hasOptions, setHasOptions,
  } = useContext(AnalyticsContext)

  const { CurrentViewMode } = useContext(ViewModeContext);
  const { t } = useTranslation();

  const scrollRef = useRef();
  const [tabIndex, setTabIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  const routes = [
    { key: 'tab1', title: 'Assets' },
    ...(hasStocks ? [{ key: 'tab2', title: 'Stocks' }] : []),
    ...(hasCrypto ? [{ key: 'tab3', title: 'Crypto' }] : []),
    ...(hasEtfs ? [{ key: 'tab4', title: 'ETFs' }] : []),
    ...(hasOptions ? [{ key: 'tab5', title: 'Options' }] : []),
  ];
  
  const onHorizontalScroll = (e) => {
    const pageIndex = Math.round(
      e.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );
    if (pageIndex !== tabIndex) setTabIndex(pageIndex);
  };

  const scrollToTab = (index) => {
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setTabIndex(index);
  };

  const labelOpacity = scrollY.interpolate({
    inputRange: [0, HeaderHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const renderTabBar = () => (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabBarContainer}
    >
      {routes.map((route, i) => (
        <TouchableOpacity
          key={route.key}
          style={[styles.tabItem, tabIndex === i && styles.tabItemActive]}
          onPress={() => scrollToTab(i)}
        >
          <Text
            style={{
              color: tabIndex === i ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Sec_fontColor,
              fontWeight: '600',
              fontSize: 16,
              paddingHorizontal: 16,
            }}
          >
            {route.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  
  const tabComponents = {
    tab1: AllAssets_Overview,
    tab2: StocksPieChart,
    tab3: CryptoDonutChart,
    tab4: ETFsPieChart,
    tab5: OptionsPieChart,
  };
  


  const renderTabContent = () => (
    <ScrollView
      horizontal
      pagingEnabled
      ref={scrollRef}
      onScroll={onHorizontalScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {routes.map((route) => {
        const TabComponent = tabComponents[route.key];
        return (
          <View
            key={route.key}
            style={{ width: SCREEN_WIDTH, paddingHorizontal: 16 }}
          >
            <TabComponent tabKey={route.key} />
            <Text style={styles.breakdownTitle}>
              {route.title === 'Assets' ? 'Breakdown' : 'Positions Detail'}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );

  


  return (
    <Animated.ScrollView
    showsVerticalScrollIndicator={false}
    style={styles.container}
    scrollEventThrottle={16}
    onScroll={Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: true }
    )}
    contentContainerStyle={{  }}
  >
  

  <Text
      style={{
        color: CurrentViewMode.Mode_fontColor,
        fontSize: size(28),
        fontWeight: "bold",
        marginTop: height(5),
        marginLeft: width(5),
        marginBottom: height(5),
      }}
    >
      Analytics
    </Text>




   <ScrollView style={{
    marginBottom: height(7)
   }}
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {routes.map((route, i) => (

        
        <TouchableOpacity
          key={route.key}
          style={[styles.tabItem, tabIndex === i && styles.tabItemActive]}
          onPress={() => {
            scrollToTab(i)
          console.log("hello ", i)
          }}
        >

         
          <Text
            style={{
              color: tabIndex === i ? CurrentViewMode.Mode_fontColor : CurrentViewMode.Mode_Sec_fontColor,
              fontWeight: '600',
              fontSize: 16,
              height: height(4),
              paddingHorizontal: 16,
            }}
          >
            {route.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {renderTabContent()}
  </Animated.ScrollView>
  );
};

 


  


  


const styles = StyleSheet.create({
  header: {
    top: 0,
    marginTop: height(0),
    height: 10,
    position: 'absolute',
    width: '100%',
  //  backgroundColor: 'yellow',


  },


 
  tab: {elevation: 0, marginTop: height(-4),  shadowOpacity: 0, backgroundColor: '#0F0F0F'},
  indicator: {backgroundColor: 'transparent'},
});

export default CollapsibleTabView;