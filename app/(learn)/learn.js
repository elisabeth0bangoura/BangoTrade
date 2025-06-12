
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text, Dimensions, ScrollView } from 'react-native';
import { height, size, width } from 'react-native-responsive-sizes';
import { TabView } from 'react-native-tab-view';
import Glossary from "./glossary";
import Courses from './courses';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../Languages_Translation_Screens/i18n';












const TABBAR_HEIGHT = 70;
const window = Dimensions.get('window');

function CollapsibleTabViewTestScreen(props) {


  const { t } = useTranslation();
  const [UserLang, setUserLang] = useState()

  const router = useRouter();

    const [headerHeight, setHeaderHeight] = useState(0);
    const [tabRoutes] = useState([
        { key: 'Glossary', title: t("glossary") },
        { key: 'Courses', title: t("courses") }
    ]);
    const [tabIndex, setTabIndex] = useState(0);
    const tabIndexRef = useRef(0);
    const isListGlidingRef = useRef(false);

    const listArrRef = useRef([]);
    const listOffsetRef = useRef({});

    const scrollY = useRef(new Animated.Value(0)).current;
    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -headerHeight],
        extrapolate: 'clamp'
    });

    const tabBarTranslateY = scrollY.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [headerHeight, 0],
        extrapolateRight: 'clamp'
    });

    useEffect(() => {
        scrollY.addListener(({ value }) => {});

        return () => {
            scrollY.removeListener();
        };
    }, []);


    useEffect(() => {
      if (UserLang && UserLang !== i18n.language) {
        i18n.changeLanguage(UserLang); // Set language dynamically based on UserLang
        console.log('Language set to:', UserLang); // Debugging output
      }
    }, [UserLang]);
  
  

    
    

    const headerOnLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height);
    }, []);

    const onTabIndexChange = useCallback((id) => {
        setTabIndex(id);
        tabIndexRef.current = id;
        // Reset scroll position to 0 whenever the tab is changed
        scrollY.setValue(0);
    }, []);

    const renderTabBar = useCallback(
      (props) => {
        const { navigationState } = props;
        const activeTabIndex = navigationState.index;  // Get the active tab index
    
        return (
          <Animated.View
            style={[styles.collapsibleTabBar, { transform: [{ translateY: tabBarTranslateY }] }]}
          >
            {navigationState.routes.map((route, idx) => {
              const isActive = idx === activeTabIndex;  // Check if the current tab is active
    
              return (
                <TouchableOpacity
                  style={styles.collapsibleTabBarButton}
                  key={idx}
                  onPress={() => {
                    onTabIndexChange(idx);
                  }}
                >
                  <View style={styles.collapsibleTabBarLabelContainer}>
                    <Text
                      style={[
                        styles.collapsibleTabBarLabelText,
                        {
                          backgroundColor: isActive ? '#25292F' : "transparent", 
                          borderRadius: 30,
                          width: 100,
                          height: size(50),
                          color: isActive ? '#F8F9F9' : '#A2A9B4',  // Active color: white, Inactive color: gray
                          fontWeight: isActive ? 'bold' : 'normal',  // Make active tab label bold
                          textAlign: 'center', // Center the text horizontally
                          lineHeight: size(50), // Center the text vertically
                        },
                      ]}
                    >
                      {route.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        );
      },
      [tabBarTranslateY]
    );
    

    const renderScene = useCallback(

      
        ({ route }) => {
            // Only render the content for the selected tab
            return (
                <Animated.ScrollView
                    style={styles.scrollViewContainer}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingTop: headerHeight }}
                    bounces={false}
                >
                    {route.key === 'Glossary' && tabIndex === 0 && <Glossary />}
                    {route.key === 'Courses' && tabIndex === 1 && <Courses />}
                </Animated.ScrollView>
            );
        },
        [scrollY, headerHeight, tabIndex]
    );

    return (
        <View style={styles.rootContainer}>
            {headerHeight > 0 ? (
                <TabView
                
                    navigationState={{ index: tabIndex, routes: tabRoutes }}
                    renderScene={renderScene}
                    renderTabBar={renderTabBar}
                    onIndexChange={onTabIndexChange}
                />
            ) : null}
            <Animated.View
                style={{ ...styles.headerContainer, transform: [{ translateY: headerTranslateY }] }}
                onLayout={headerOnLayout}
                pointerEvents="box-none"
            >
                <CollapsibleHeader />
            </Animated.View>
        </View>
    );
}

// Collapsible Header Component
function CollapsibleHeader(props) {

  const { t } = useTranslation();
  const [UserLang, setUserLang] = useState()

  const router = useRouter();


  useEffect(() => {
    if (UserLang && UserLang !== i18n.language) {
      i18n.changeLanguage(UserLang); // Set language dynamically based on UserLang
      console.log('Language set to:', UserLang); // Debugging output
    }
  }, [UserLang]);





    return (
        <View style={styles.headerContainerStyle} pointerEvents="box-none">

            <TouchableOpacity onPress={() => {
              router.back();
            }}
            style={{
              position: 'absolute',
              top: height(8),
              height: size(50),
              width: size(50),
              marginLeft: width(4),
            }}>
              <MaterialIcons name='arrow-back' style={{
                alignSelf: 'center',
                color: "#F8F9F9",
                fontSize: size(25),

              }} />
            </TouchableOpacity>
            <Text style={{
              fontSize: 30,
              fontWeight: "bold",
              marginTop: height(15),
              marginLeft:  width(7),
              color: '#fff',
            }}>{t("learnHeader")}</Text>
            <Text style={{
               marginLeft: width(7),
               marginTop: height(3),
                  fontSize: 15,
                  width: "80%",
                  color: '#A2A9B4',
            }}>
               {t("learnDescription")}
            </Text>

            <TouchableOpacity style={{
              paddingVertical: 12,
              width: width(90),
              borderRadius: 30,
              alignSelf: 'center',
              top: height(5),
              paddingHorizontal: 20,
              backgroundColor: "#25292F",
            }}>
              <Text style={{
                color: "#A2A9B4",
                fontSize: size(14),
              }}>
                {t("searchHeader")}
              </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  rootContainer: {
      flex: 1,
      backgroundColor: '#0C1014',
  },
  collapsibleTabBar: {
      flexDirection: 'row',
      marginTop: height(4), 
      alignItems: 'center',
      paddingTop: 20,  // Adjust padding to ensure labels don't get cut off
      height: TABBAR_HEIGHT,
      backgroundColor: '#0C1014',
      zIndex: 1,
  },

  collapsibleTabBarButton: {
    width: 100,
    marginLeft: width(6)
  },
  collapsibleTabBarLabelContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      paddingBottom: 20,
  },

  collapsibleTabBarLabelText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#F8F9F9',
  },
  
  scrollViewContainer: {
      flex: '100%',
      backgroundColor: '#0C1014',
      
  },
  headerContainer: {
      position: 'absolute',
      width: '100%',
      backgroundColor: '#0C1014',
      
  },
  headerContainerStyle: {
      width: '100%',
      height: 320,
    
    

      backgroundColor: '#0C1014',
  },
  headerText: {
      fontSize: 25,
      color: '#fff',
  },
});

export default CollapsibleTabViewTestScreen;
