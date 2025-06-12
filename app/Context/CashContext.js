// src/context/AnalyticsContext.js
import React, { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Create Context
export const CashContext = createContext();

// Create Context Provider
export const CashContextProvider = ({ children }) => {


    

  const { t, i18n } = useTranslation(); // Destructure i18n for language changes

  //   const [FilterState, setUserExpoPushToken] = useState(t("OverallPositionHeader"))

  const [UserExpoPushTokenNew, setUserExpoPushTokenNew] = useState(null);  // Initialize the context value
  const [UserAlpacaAccountId, setUserAlpacaAccountId] = useState(null)
  const [userId, setuserId] = useState(null)
  
  const [PaymentReceivedText1, setPaymentReceivedText1] = useState(t("PaymentReceivedText1"))
  const [PaymentReceivedText2, setPaymentReceivedText2] = useState(t("PaymentReceivedText2"))
  const [PaymentReceivedText3, setPaymentReceivedText3] = useState(t("PaymentReceivedText3"))

  const [Jan, setJan] = useState(t("Jan"))
  const [Feb, setFeb] = useState(t("Feb"))
  const [Mar, setMar] = useState(t("Mar"))
  const [Apr, setApr] = useState(t("Apr"))
  const [May, setMay] = useState(t("May"))
  const [Jun, setJun] = useState(t("Jun"))
  const [Jul, setJul] = useState(t("Jul"))
  const [Aug, setAug] = useState(t("Aug"))
  const [Sep, setSep] = useState(t("Sep"))
  const [Oct, setOct] = useState(t("Oct"))
  const [Nov, setNov] = useState(t("Nov"))
  const [Dec, setDec] = useState(t("Dec"))




     // Function to register for push notifications
     const registerForPushNotificationsAsync = async () => {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
    
        // Get the notification permission
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
    
        // Request permission if not granted already
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
    
        // If permission is granted, get the push token
        if (finalStatus !== 'granted') {
          Alert.alert('Permission not granted', 'Push notifications are not enabled.');
          return;
        }
    
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);
        setUserExpoPushTokenNew(token); // Store token
      };
    
      // Call the register function when the component mounts
      useEffect(() => {
        registerForPushNotificationsAsync();
      }, []);
    

      
    // Use useEffect to update FilterState when the language changes
    useEffect(() => {
        setPaymentReceivedText1(t("PaymentReceivedText1"));
        setPaymentReceivedText2(t("PaymentReceivedText2"));
        setPaymentReceivedText3(t("PaymentReceivedText3"));
        setJan(t("Jan"))
        setFeb(t("Feb"))
        setMar(t("Mar"))
        setApr(t("Apr"))
        setMay(t("May"))
        setJun(t("Jun"))
        setJul(t("Jul"))
        setAug(t("Aug"))
        setSep(t("Sep"))
        setOct(t("Oct"))
        setNov(t("Nov"))
        setDec(t("Dec"))

    }, [i18n.language, t]);  // Trigger this effect whenever the language changes

    




  return (
    <CashContext.Provider value={{ 
        UserExpoPushTokenNew, setUserExpoPushTokenNew,
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
        Jan, setJan,
        Feb, setFeb,
        Mar, setMar,
        Apr, setApr,
        May, setMay,
        Jun, setJun,
        Jul, setJul,
        Aug, setAug,
        Sep, setSep,
        Oct, setOct,
        Nov, setNov,
        Dec, setDec,

        
     }}>
      {children}
    </CashContext.Provider>
  );
};
