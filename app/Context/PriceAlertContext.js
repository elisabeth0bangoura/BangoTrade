// context/PriceAlertContext.js
import React, { createContext, useEffect, useState } from 'react';
import { View, Text, AppState, Animated, AppStateStatus, Easing, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import * as Notifications from 'expo-notifications';
import { getFirestore, getDocs, onSnapshot, doc, getDoc, collection, addDoc, setDoc } from '@react-native-firebase/firestore';
import { Platform } from 'react-native';

import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "@react-native-firebase/auth";

import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import messaging from '@react-native-firebase/messaging';

import { getDatabase, ref, get } from "@react-native-firebase/database";

export const PriceAlertContext = createContext();




/*

const BACKGROUND_FETCH_TASK = 'price-alert-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {



  console.log('[📦 BackgroundFetch] Running task...');

  const authInstance = getAuth();


  const currentUser = authInstance.currentUser;


  if (!currentUser) return BackgroundFetch.BackgroundFetchResult.NoData;

  const uid = currentUser.uid;

  try {
    const snapshot = await firestore()
      .collection('PriceTracker')
      .where('uid', '==', uid)
      .get();

    const trackers = snapshot.docs.map(doc => doc.data());
    const testPrice = 6.02;

    for (let tracker of trackers) {
      const storedPrice = parseFloat(tracker.TrackerPrice);

      if (storedPrice === testPrice) {
        console.log(`✅ ${tracker.AssetName} matched test price $${testPrice}`);

        await notifee.displayNotification({
          title: `📈 ${tracker.AssetName} Alert`,
          body: `Price matched your test target: $${testPrice}`,
          android: { channelId: 'alerts' },
        });
      }
    }
  } catch (err) {
    console.error('❌ Background task error:', err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export const PriceAlertProvider = ({ children }) => {
  useEffect(() => {
    const setup = async () => {
      try {
        await notifee.createChannel({
          id: 'alerts',
          name: 'Alerts',
          importance: AndroidImportance.HIGH,
        });

        await notifee.requestPermission();

        const status = await BackgroundFetch.getStatusAsync();
        if (status === 1 || status === 2) {
          console.log('[❌] Background fetch not available');
          return;
        }

        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 60, // 1 minute minimum supported reliably
          stopOnTerminate: false,
          startOnBoot: true,
        });

        console.log('[✅] Background task registered');
      } catch (err) {
        console.error('[❌] Background task setup failed:', err);
      }
    };

    setup();
  }, []);

  return (
    <PriceAlertContext.Provider value={{}}>
      {children}
    </PriceAlertContext.Provider>
  );
};*/