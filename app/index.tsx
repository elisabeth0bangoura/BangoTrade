import React, { useEffect, useState } from "react";
import { View, Image, Alert, StyleSheet, AppState, AppStateStatus } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import * as SplashScreen from "expo-splash-screen";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth"; // ✅ Import FirebaseAuthTypes
import axios from "axios";
import i18n from "@/Languages_Translation_Screens/i18n";
import { getDatabase, ref, get } from 'firebase/database';


const MAX_FAILED_ATTEMPTS = 3;

const SplashScreenComponent: React.FC = () => {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  const [appState, setAppState] = useState(AppState.currentState);
  const [isEnabledFaceId, setIsEnabledFaceId] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [loadingText, setLoadingText] = useState("Lade...");
  const [hasPromptedFaceId, setHasPromptedFaceId] = useState(false); // ✅ Prevent loop








  

  useEffect(() => {
    const loadInitial = async () => {
      const storedUID = await AsyncStorage.getItem("userUID");
      const storedFaceId = await AsyncStorage.getItem("faceIdEnabled");

      setIsEnabledFaceId(storedFaceId === "true");

      if (!storedUID) {
        console.log("⚠️ Kein gespeicherter Benutzer – redirect");
        await handleSignOut();
        return;
      }

      if (storedFaceId === "true" && !hasPromptedFaceId) {
        console.log("🔐 Face ID aktiviert – prompt sofort");
        setHasPromptedFaceId(true);
        await checkFaceIdAuthentication(JSON.parse(storedUID));
      } else {
        console.log("🔓 Face ID nicht aktiviert – normaler Login");
        await fetchUserData(JSON.parse(storedUID));
      }
    };

    loadInitial();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [failedAttempts, isEnabledFaceId]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") return;

    if (isEnabledFaceId && !hasPromptedFaceId) {
      const storedUID = await AsyncStorage.getItem("userUID");
      if (storedUID) {
        setHasPromptedFaceId(true);
        await checkFaceIdAuthentication(JSON.parse(storedUID));
      }
    } else if (!isEnabledFaceId) {
      await handleSignOut();
    }

    setAppState(nextAppState);
  };

  const checkFaceIdAuthentication = async (uid: string) => {
    setShowSplash(true);
    setLoadingText("Face ID überprüfen...");

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Face ID erforderlich",
      fallbackLabel: "Code verwenden",
    });

    if (!result.success) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      console.log(`❌ Face ID fehlgeschlagen (${newAttempts}/${MAX_FAILED_ATTEMPTS})`);

      if (newAttempts >= MAX_FAILED_ATTEMPTS) {
        Alert.alert("Abmeldung", "Zu viele Fehlversuche. Du wirst abgemeldet.");
        await handleSignOut();
      } else {
        Alert.alert("Fehlgeschlagen", `Versuch ${newAttempts}/${MAX_FAILED_ATTEMPTS}`);
        setShowSplash(false);
        setHasPromptedFaceId(false); // ✅ Allow retry
      }
    } else {
      console.log("✅ Face ID erfolgreich");
      setFailedAttempts(0);
      await fetchUserData(uid);
    }
  };

  const fetchUserData = async (uid: string) => {
    try {
      setLoadingText("Anmeldung läuft...");

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists) {
        console.log("❌ Benutzer nicht gefunden");
        await handleSignOut();
        return;
      }

      const userData = userDoc.data();
      const email = userData?.Email;
      const password = userData?.Password;

      if (!email || !password) {
        console.log("❌ E-Mail oder Passwort fehlen");
        await handleSignOut();
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Anmeldung erfolgreich");

      await AsyncStorage.setItem("lastAuthTime", Date.now().toString());
      await AsyncStorage.setItem("userUID", JSON.stringify(uid));

      setShowSplash(false);
      router.replace("/(tabs)/Home/home");
    } catch (error) {
      console.error("❌ Fehler bei Anmeldung:", error);
      await handleSignOut();
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("🚪 Logging out...");
      await signOut(auth).catch(() => {});
      await AsyncStorage.removeItem("userUID");
      await AsyncStorage.removeItem("lastAuthTime");
    } catch (e) {
      console.error("❌ Fehler beim Abmelden:", e);
    }

    setShowSplash(false);
    router.replace("/(auth)/signUp");
  };

  return (
    <>
      {showSplash && (
        <View style={styles.splashContainer}>
          <Image source={require("../assets/images/icon.png")} style={styles.logo} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
});

export default SplashScreenComponent;
