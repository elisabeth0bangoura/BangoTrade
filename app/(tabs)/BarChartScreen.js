import React, { useEffect, useRef, useContext, useState } from 'react';
import { GestureResponderEvent, View, StyleSheet, useWindowDimensions, ScrollView, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Canvas, Group } from '@shopify/react-native-skia';
import * as d3 from 'd3';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import BarPath from './allBar_src/components/BarPath'; // Ensure this component handles the placeholder
import XAxisText from './allBar_src/components/XAxisText';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedText from './allBar_src/components/AnimatedText';
import { height, width, size } from 'react-native-responsive-sizes';
import { DateTime } from 'luxon';
import { ViewModeContext } from '../Context/ViewModeContext';
import { useTranslation } from 'react-i18next';


import firestore from '@react-native-firebase/firestore';

import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getDatabase, ref, get } from "@react-native-firebase/database";
import { CashContext } from '../Context/CashContext';










const BarChartScreen = () => {


  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  const scrollViewRef = useRef(null); // Ref for ScrollView

  const [availableCash, setAvailableCash] = useState(0); // Example value for available cash

  const [selectedValue] = useState(useSharedValue(0)); // Shared value for selected value


	const router = useRouter();
	const auth = getAuth();
	const db = getFirestore();
  
  
	const user = getAuth().currentUser;
  


    const database = getDatabase();

    const [AlpacaUserId, setAlpacaUserId] = useState();

 
    const [UserLang, setUserLang] = useState()
    const [Depot_number, setDepot_number] = useState("")
 
    
    
    const [Sum, setSum] = useState()

    const [equity, setEquity] = useState(null);
    const [error, setError] = useState(null);
    const [setcash_withdrawable, setSetcash_withdrawable] = useState(null)
  
    const [UserFirstName, setUserFirstName] = useState("")
    const [UserLastName, setUserLastName] = useState("")
  


    const [PushToken, setPushToken] = useState()

    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const [data, setData] = useState([]); // Access the context data

  const [loading, setLoading] = useState(true); // Loading state to track the fetch status

  const barWidth = width(10);
  const gap = width(8);
  const canvasHeight = size(220);
  const graphMargin = size(30);
  const graphHeight = canvasHeight - graphMargin;
  
  // Add more padding to the canvas width
  const canvasWidth = data.length * (barWidth + gap) + width(100); // Increased padding for labels
  
  const [selectedDay, setSelectedDay] = useState('Total');
  const selectedBar = useSharedValue(null);
  
  const progress = useSharedValue(0);
  
  const xDomain = data.map((dataPoint) => dataPoint.label);
  const xRange = [0, canvasWidth];
  
  // Increase the padding on the x-scale to prevent labels from being cut off
  const x = d3.scalePoint().domain(xDomain).range([0, canvasWidth]).padding(0.5); // Adjust padding here
  
  const yDomain = [0, d3.max(data, (yDataPoint) => yDataPoint.value)];
  const yRange = [0, graphHeight];
  const y = d3.scaleLinear().domain(yDomain).range(yRange);


  
  const {
    UserExpoPushTokenNew, 
    setUserExpoPushTokenNew,
    UserAlpacaAccountId, 
    setUserAlpacaAccountId,
    userId, 
    setuserId,
    PaymentReceivedText1,
    setPaymentReceivedText1,
    PaymentReceivedText2,
    setPaymentReceivedText2,
    PaymentReceivedText3,
    setPaymentReceivedText3,
    Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec,
  
   } = useContext(CashContext)

  








   



   useEffect(() => {
  if (!user?.uid) {
    console.log("No user UID available.");
    return;
  }

  console.log("Listening to Firestore real-time data for UID:", user.uid);

  let userCash = 0;

  const sendUserDataToBackend = async () => {
    try {
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const userData = userDoc.data();

      const pushToken = userData?.expoPushToken;

      setUserExpoPushTokenNew(userData?.expoPushToken);
      setUserAlpacaAccountId(userData.AlpacaAccountId);
      setuserId(user.uid);

      setPaymentReceivedText1(t("PaymentReceivedText1"));
      setPaymentReceivedText2(t("PaymentReceivedText2"));
      setPaymentReceivedText3(t("PaymentReceivedText3"));

      if (!userData?.AlpacaAccountId || !pushToken) {
        console.log("🚫 Missing AlpacaAccountId or pushToken");
        return;
      }

      await fetch("https://getaccountcashandchartdata-jcraafcjna-uc.a.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          accountId: userData.AlpacaAccountId,
          pushToken: pushToken,
          PaymentReceivedText1: t("PaymentReceivedText1"),
          PaymentReceivedText2: t("PaymentReceivedText2"),
          PaymentReceivedText3: t("PaymentReceivedText3"),
        }),
      });

      console.log("✅ Sent user data to backend");
    } catch (err) {
      console.error("❌ Error sending user data to backend:", err.message);
    }
  };

  sendUserDataToBackend();

  const unsubscribeCash = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('AccountInfo')
    .doc('AvilableCash')
    .onSnapshot((doc) => {
      if (doc.exists) {
        const availableCash = parseFloat(doc.data().cash);
        userCash = availableCash;

        setAvailableCash(availableCash);
        selectedValue.value = withTiming(availableCash, { duration: 1000 });
        console.log("📈 Real-time AvailableCash updated:", availableCash);
      }
    });

  const unsubscribeChart = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('ChartActivities')
    .onSnapshot((querySnapshot) => {
      const transferData = querySnapshot.docs.map(doc => doc.data());
      const monthNames = [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec];
      const monthlySums = {};
      const allMonthsSet = new Set();

      transferData
        .filter(t => t.activity_type === "CSD" || t.activity_type === "CSW")
        .forEach((transfer) => {
          const transferDate = transfer.date || transfer.transaction_time;
          const parsedDate = new Date(transferDate);
          const month = parsedDate.getMonth();
          const year = parsedDate.getFullYear();
          const label = `${monthNames[month]} ${year}`;
          const amount = parseFloat(transfer.net_amount) || 0;

          if (!monthlySums[label]) {
            monthlySums[label] = 0;
          }
          monthlySums[label] += amount;

          allMonthsSet.add(label); // track all months with activity
        });

      // Now also collect months without activity for current and next year
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      [currentYear, nextYear].forEach(year => {
        months.forEach(month => {
          allMonthsSet.add(`${month} ${year}`);
        });
      });

      const chartData = Array.from(allMonthsSet).sort((a, b) => {
        // Sort by year and month index
        const [aMonth, aYear] = a.split(" ");
        const [bMonth, bYear] = b.split(" ");
        const aIndex = months.indexOf(aMonth);
        const bIndex = months.indexOf(bMonth);
        return Number(aYear) - Number(bYear) || aIndex - bIndex;
      }).map(label => ({
        label,
        value: monthlySums[label] !== undefined ? monthlySums[label] : 50,
        isEmpty: monthlySums[label] === undefined,
        transactions: [],
      }));

      const canvasWidth = chartData.length * (barWidth + gap) + 250;
      const x = d3.scalePoint()
        .domain(chartData.map((d) => d.label))
        .range([0, canvasWidth])
        .padding(0.5);

      setData(chartData);
      console.log("📊 Real-time ChartActivities updated (collection)");
    });

  return () => {
    unsubscribeCash();
    unsubscribeChart();
  };
}, [user?.uid, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]);












  useEffect(() => {
    progress.value = withTiming(1, { duration: 1000 });
    selectedValue.value = withTiming(availableCash, { duration: 1000 }); // Set selected value to available cash initially
  }, [progress, selectedValue, availableCash, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec,]);

  

   // Static months array for 12 months
   const months = [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec];

 // Get current date and current month index
 const currentDate = new Date();
 const currentMonthIndex = currentDate.getMonth(); // 0 to 11


 useEffect(() => {
  const chartData = months.map((month, index) => ({
    label: `${month} ${currentDate.getFullYear()}`,
    value: Math.random() * 100, // Replace with real data
  }));

  setData(chartData); // Set chart data
}, [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec,]); // Run once when the component mounts

useEffect(() => {
  // Ensure the scroll happens after data is set
  if (data.length === 0) return; // Don't do anything if data is empty

  // Calculate the X offset to scroll to the current month and next 3 months
  const scrollToX = (barWidth + gap) * 3.5;

  setTimeout(() => {
    if (scrollViewRef.current) {
      // Scroll to the X offset after the data is set
      scrollViewRef.current.scrollTo({
        x: scrollToX,
        animated: true,
      });
    }
  }, 100); // Ensure that data is set before scrolling
}, [data, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec,]);








  const getMonthHeader = (dateString) => {
    const date = new Date(dateString);
    const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
    
    const currentMonthYear = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    return monthYear === currentMonthYear ? t('ThisMonth') : monthYear;
  };

  

  const formatDate = (dateStr) => {
    if (!dateStr) {
      console.warn('Invalid date string:', dateStr); 
      return '';
    }
  
    let date;
  
    // If the date is in the format "transaction_time"
    if (dateStr.includes("T")) {
      date = new Date(dateStr);  // Parse the ISO string (e.g., "2025-02-20T08:12:53.753762Z")
    } else {
      // If the date is just a date string "2025-02-24"
      date = new Date(dateStr + 'T00:00:00');  // Append time to make it valid for Date parsing
    }
  
    // Get the translated month using the months array
    const month = months[date.getMonth()];
    const day = date.getDate();
  
    return `${month}. ${day}`;  // Format as "Feb. 12" or "Dec. 2"
  };
  


  
  const styles = StyleSheet.create({
    container: {
      marginTop: 0,
      height: 380,
      width: '90%',
      backgroundColor: CurrentViewMode.Mode_bg,
    },
    textContainer: {
      flex: 1,
      fontSize: 20,
      justifyContent: 'center',
      marginHorizontal: 30,
      marginBottom: 50,
    },
  });
  
  






  




  const touchHandler = (e) => {
    const touchX = e.nativeEvent.locationX;
    const touchY = e.nativeEvent.locationY;
  
    let foundValidBar = false;
  
    for (let index = 0; index < data.length; index++) {
      const { label, value } = data[index];
  
      const barX = x(label) - barWidth / 2;
      const barWidthAdjusted = barWidth;
  
      if (
        touchX >= barX &&
        touchX <= barX + barWidthAdjusted &&
        touchY >= graphHeight - y(value) &&
        touchY <= graphHeight
      ) {
        selectedBar.value = label;
        setSelectedDay(label);
  
        // If value is 50 and marked as no transaction, still show 50
        selectedValue.value = withTiming(value);
  
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  
        foundValidBar = true;
        break;
      }
    }
  
    if (!foundValidBar) {
      selectedBar.value = null;
      setSelectedDay('Total');
      selectedValue.value = withTiming(availableCash);
  
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.textContainer}>
      <Text
        style={{
          fontSize: size(15),
          color: CurrentViewMode.Mode_Sec_fontColor,
          marginTop: height(-1),
          height: size(18),
          fontWeight: 'bold',
        }}
      >
        {t("AvailableHeaderTitleIBarChartScreen")}
      </Text>

      <AnimatedText selectedValue={selectedValue} />
    </View>

    <ScrollView style={{
      width: "100%"
    }}
      ref={scrollViewRef} 
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={barWidth + 20} // Snap to each bar with added space
      decelerationRate="fast"
      contentContainerStyle={{ paddingLeft: 20 }}
      onScrollEndDrag={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <Canvas onTouchStart={touchHandler} style={{ width: canvasWidth, height: canvasHeight }}>
        {data.map((dataPoint, index) => (
          <Group key={index}>
            <BarPath
              progress={progress}
              data={data}
              x={x(dataPoint.label)}
              y={y(dataPoint.value)}
              barWidth={barWidth}
              graphHeight={graphHeight}
              label={dataPoint.label}
              selectedBar={selectedBar}
              isEmpty={dataPoint.isEmpty}
              CurrentViewMode={CurrentViewMode.Mode_CashChart_Cash}
              Mode_CashChartColor2={CurrentViewMode.Mode_CashChartColor2_Cash}
            />
            <XAxisText
              data={data}
              x={x(dataPoint.label)}
              y={canvasHeight}
              text={dataPoint.label}
              selectedBar={selectedBar}
              Mode_SecNumberText={CurrentViewMode.Mode_Sec_fontColor}
            />
          </Group>
        ))}
      </Canvas>
    </ScrollView>
  </SafeAreaView>
  );
};

export default BarChartScreen;

