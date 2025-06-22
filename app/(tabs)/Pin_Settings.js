
import React, { useState, useRef, useEffect, useMemo, useCallback, useContext } from 'react';

import { View, Text,Animated, FlatList, TouchableOpacity, ScrollView } from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LineChart } from 'react-native-wagmi-charts';
import { useTranslation } from 'react-i18next';
import i18n from '../../Languages_Translation_Screens/i18n'; 
import { width, height, size } from "react-native-responsive-sizes"; 
import axios from 'axios';
import database from '@react-native-firebase/database';
import auth, { firebase } from '@react-native-firebase/auth';
import * as Haptics from 'expo-haptics';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from 'd3';

import SimplePin from 'react-native-simple-pin'
import { FontWeight, FontWidth } from '@shopify/react-native-skia';
import { useRouter } from 'expo-router';
import { LogInContext } from '../Context/LogInContext';

import { getAuth, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getFirestore, collection, getDocs } from "@react-native-firebase/firestore";
import { ViewModeContext } from '../Context/ViewModeContext';






export default function Pin_Settings() {


    const { t } = useTranslation();

    
    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

    const { PhonenumberLogIn } = useContext(LogInContext);
    const auth = getAuth();
    const firestore = getFirestore();
    const currentUser = auth.currentUser; // Get the currently logged-in user
    const router = useRouter();
    const enteredPinRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [dbPin, setDbPin] = useState(["0","0","1","1"]); // Start as null until user sets a PIN

    const userId = currentUser ? currentUser.uid : null;











    const handleSetPin = async (enteredPin) => {
        try {
            if (!userId) {
                console.log("❌ User not logged in.");
                setErrorMessage("User not logged in.");
                return;
            }

            console.log("🔹 Storing new PIN in Firestore...", enteredPin);
            await setDoc(doc(firestore, `users/${userId}`), { AppPin: enteredPin }, { merge: true });

            console.log("✅ PIN successfully updated!", enteredPin);
            setDbPin(enteredPin.split("")); // Update UI immediately
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.log("❌ Error storing PIN:", error);
            setErrorMessage("Error: Something went wrong.");
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <SimplePin
                 pin={dbPin || []}  // Show empty placeholders if no PIN is set yet
                title="Set Your PIN"
                repeatTitle="Confirm Your PIN"
                onFailure={(enteredPinArray) => {
                    //const enteredPin = enteredPinArray.join(""); // Convert array to string
                    const enteredPin = enteredPinArray.join(""); // Convert array to string
                    if (enteredPin.length === 4) { // Make sure it's a full pin
                       console.log(enteredPin)
                    } else {
                        console.log("PIN is incomplete");
                    }
            
                }}
               // onFailure={() => console.log("Failure", "Please, try again")}
                titleStyle={{ fontSize: 23, color: "#fff" }}
                numpadTextStyle={{ fontSize: 27, color: "#fff", marginTop: -10 }}
                bulletStyle={{
                    fontSize: 20,
                    color: "red",
                    marginTop: -17,
                    borderRadius: 50,
                    height: 20,
                    width: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 20,
                }}
            />
            {errorMessage && <Text style={{ color: "red", marginTop: 20 }}>{errorMessage}</Text>}
        </View>
    );
}
