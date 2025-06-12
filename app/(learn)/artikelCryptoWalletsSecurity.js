import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-realistic-deck-swiper'
import { fontSize, height, size, width } from 'react-native-responsive-sizes'
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { color } from 'd3';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useRouter from expo-router
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../Languages_Translation_Screens/i18n';



const text = 'Hello, my container is blurring contents underneath!';


const Data = [

  { id: "1", 
    title: "Introduction to Bitcoin: A Beginner's Guide",
    part1: "Bitcoin is a digital currency that operates without a central authority, like a government or bank. It was created in 2009 by an anonymous person or group known as Satoshi Nakamoto. Bitcoin uses blockchain technology, a public ledger that records transactions and ensures transparency and security.",
    image: "BTCArtikelImage.png",

   },
  { id: "2", section: "Question 1 of 2" },
  { id: "3", section: "Question 1 of 2" },
  { id: "4", section: "Question 1 of 2" },
  { id: "5", section: "Question 1 of 2" },
]




const Artikel_Page = () => {
 

  const { t } = useTranslation();


  const [UserLang, setUserLang] = useState()

  const title = useLocalSearchParams();
  const router = useRouter();

  console.log(title.title)
  




  useEffect(() => {
    if (UserLang && UserLang !== i18n.language) {
      i18n.changeLanguage(UserLang); // Set language dynamically based on UserLang
      console.log('Language set to:', UserLang); // Debugging output
    }
  }, [UserLang]);







    return (

      <View style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#0C1014",
        position: 'relative', // Ensure the parent view can hold positioned elements
      }}>




      
        {/* Fixed BlurView at the top */}
        {Platform.OS === 'ios' ? (
          <TouchableOpacity 
            onPress={() => {
              router.back(); // Navigate back when the button is pressed
            }}
            style={{
              position: 'absolute',
              top: height(8),
              left: width(5),
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50} // Lower intensity for better rendering on Android
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: 10,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="arrow-back-sharp"
                style={{
                  fontSize: size(18),
                  color: '#fff',
                }}
              />
            </BlurView>
          </TouchableOpacity>
        ) : (
          // For Android, use a regular background with slight opacity
          <TouchableOpacity
            onPress={() => {
              router.back(); // Navigate back when the button is pressed
            }}
            style={{
              position: 'absolute',
              top: height(8),
              left: width(5),
              width: 40,
              borderRadius: 10,
              backgroundColor: '#fff',
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
           
              <Ionicons
                name="arrow-back-sharp"
                style={{
                  fontSize: size(18),
                  color: '#000',
                }}
              />
        
          </TouchableOpacity>
        )}


      
        {/* Scrollable content */}
        <ScrollView contentContainerStyle={{
          paddingBottom: height(25)
        }} style={{
          height: "100%",
          width: "100%",
          paddingTop: height(15), // Add margin/padding to the top to make space for the blur
        }}>
          <Text style={{
            fontSize: size(30),
            marginLeft: width(5),
            width: "90%",
            color: "#F8F9F9",
          }}>
          {t("introductionToCryptoWalletsAndSecurity")}
          </Text>
      
          <Text style={{
            fontSize: size(18),
            marginLeft: width(5),
            marginTop: height(4),
            width: "90%",
            lineHeight: 25,
            color: "#F8F9F9"
          }}>
            {t("cryptoWalletsDescription")}
           </Text>
      
          <LinearGradient colors={["#D9FF9D", "#62DB51"]} 
          style={{
            height: height(30),
            width: "90%",
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: height(4),
            backgroundColor: '#1A1E24',
          }}>
            <Image source={require("../../assets/images/CryptoWalletImage.png")} 
            style={{
              resizeMode: 'contain',
              height: "90%",
              width: "100%",
            }}/>
          </LinearGradient>
      
        
        
      
          {/* Key Features of Bitcoin Section */}
          <View style={{ padding: 10 }}>
            <Text style={{
              marginLeft: width(5),
              marginTop: height(4), 
              fontSize: size(18), 
              width: "90%",
              fontWeight: 'bold', 
              color: "#F8F9F9", 
              marginBottom: height(1),
            }}>
            {t("keyFeaturesCryptoWallets")}
            </Text>
      
            {/* List items */}
            <Text style={{
              marginLeft: width(5),
              marginTop: height(2), 
              fontSize: size(18), 
              color: "#F8F9F9", 
              width: "90%",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              1. <Text style={{
                fontWeight: "bold",
                fontSize: size(18),
                color: "#F8F9F9",
              }}>{t("privateAndPublicKeys")}</Text> {t("privateAndPublicKeysDescription")}
            </Text>
            <Text style={{
              marginLeft: width(5),
              marginTop: height(4), 
              fontSize: size(18), 
              color: "#F8F9F9", 
              width: "90%",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              2. <Text style={{
                fontWeight: "bold",
                fontSize: size(18),
                color: "#F8F9F9",
              }}>{t("typesOfWallets")}</Text> {t("typesOfWalletsDescription")}
            </Text>
            <Text style={{
              marginLeft: width(5),
              marginTop: height(4), 
              fontSize: size(18), 
              width: "90%",
              color: "#F8F9F9", 
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              3. <Text style={{
                fontWeight: "bold",
                fontSize: size(18),
                color: "#F8F9F9",
              }}>{t("backupAndRecovery")}</Text> {t("backupAndRecoveryDescription")}
            </Text>
            <Text style={{
              marginLeft: width(5),
              marginTop: height(4), 
              fontSize: size(18), 
              color: "#F8F9F9", 
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              4. <Text style={{
                fontWeight: "bold",
                fontSize: size(18),
                color: "#F8F9F9",
              }}>{t("multisignatureWallets")}</Text> {t("multisignatureWalletsDescription")}
            </Text>

          </View>
      
          {/* Other Sections */}
          <View style={{ padding: 10 }}>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              marginTop: height(4),
              color: "#F8F9F9",
              width: "90%",
              lineHeight: 25,
              marginBottom: height(1),
              fontWeight: 'bold',
            }}>
            {t("whyCryptoWalletsMatter")}
            </Text>
      
            {/* Continue with text and lists */}
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              1. <Text style={{ fontWeight: 'bold' }}>{t("controlAndOwnership1")}</Text> {t("controlAndOwnership2")}
            </Text>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              marginTop: height(4),
              width: "90%",
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              2. <Text style={{ fontWeight: 'bold' }}>{t("security1")}</Text> {t("security2")}
            </Text>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              3. <Text style={{ fontWeight: 'bold' }}>{t("transactionEase1")}</Text> {t("transactionEase2")}
            </Text>


            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              4. <Text style={{ fontWeight: 'bold' }}>{t("privacy1")}</Text> {t("privacy2")}
            </Text>
      
            {/* Continue with Common Misconceptions and other sections as needed */}
          </View>










          <View style={{ padding: 10 }}>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              marginTop: height(4),
              color: "#F8F9F9",
              width: "90%",
              lineHeight: 25,
              marginBottom: height(1),
              fontWeight: 'bold',
            }}>
            {t("commonMisconceptions")}
            </Text>
      
            {/* Continue with text and lists */}
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              1. <Text style={{ fontWeight: 'bold' }}>{t("cryptoWalletsUse1")}</Text> {t("cryptoWalletsUse2")}
            </Text>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              marginTop: height(4),
              width: "90%",
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              2. <Text style={{ fontWeight: 'bold' }}>{t("onlineWalletsSafe1")}</Text> {t("onlineWalletsSafe2")}
            </Text>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              3. <Text style={{ fontWeight: 'bold' }}>{t("dontNeedWorryLosingKeys1")}</Text> {t("dontNeedWorryLosingKeys2")}
            </Text>


            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              4. <Text style={{ fontWeight: 'bold' }}>{t("cryptoWalletsAreCompletelyAnonymous1")}</Text> {t("cryptoWalletsAreCompletelyAnonymous2")}
            </Text>
      
            {/* Continue with Common Misconceptions and other sections as needed */}
          </View>









          <View style={{ padding: 10 }}>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              marginTop: height(4),
              color: "#F8F9F9",
              width: "90%",
              lineHeight: 25,
              marginBottom: height(1),
              fontWeight: 'bold',
            }}>
            {t("howToChooseSecureCryptoWallet")}
            </Text>
      
            {/* Continue with text and lists */}
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              1. <Text style={{ fontWeight: 'bold' }}>{t("evaluateTheTypeOfWallet")}</Text> {t("evaluateTheTypeOfWalletDesc")}
            </Text>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              marginTop: height(4),
              width: "90%",
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              2. <Text style={{ fontWeight: 'bold' }}>{t("checkForSecurityFeatures")}</Text> {t("checkForSecurityFeaturesDesc")}
            </Text>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              3. <Text style={{ fontWeight: 'bold' }}>{t("readReviewsAndDoResearch")}</Text> {t("readReviewsAndDoResearchDesc")}
            </Text>


            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              4. <Text style={{ fontWeight: 'bold' }}>{t("considerWalletBackups")}:</Text> {t("considerWalletBackupsDesc")}
            </Text>
      
            {/* Continue with Common Misconceptions and other sections as needed */}
          </View>














          <View style={{ padding: 10 }}>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              marginTop: height(2),
              color: "#F8F9F9",
              width: "90%",
              lineHeight: 25,
              marginBottom: height(1),
              fontWeight: 'bold',
            }}>
            {t("howToSecureYourCryptoWallet")}
            </Text>
      
            {/* Continue with text and lists */}
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(2),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              1. <Text style={{ fontWeight: 'bold' }}>{t("enableTwoFactorAuthentication")}</Text> {t("enableTwoFactorAuthenticationDescription")}
            </Text>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              marginTop: height(4),
              width: "90%",
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              2. <Text style={{ fontWeight: 'bold' }}>{t("useStrongUniquePasswords")}</Text> {t("useStrongUniquePasswordsDescription")}
            </Text>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              3. <Text style={{ fontWeight: 'bold' }}>{t("storeRecoveryPhraseOffline")}</Text> {t("storeRecoveryPhraseOfflineDescription")}
            </Text>


            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              4. <Text style={{ fontWeight: 'bold' }}>{t("updateWalletSoftware")}</Text> {t("updateWalletSoftwareDescription")}
            </Text>


            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              4. <Text style={{ fontWeight: 'bold' }}>{t("beWaryOfPhishingScams")}</Text> {t("beWaryOfPhishingScamsDescription")}

            </Text>
      
            {/* Continue with Common Misconceptions and other sections as needed */}
          </View>











          <View style={{ padding: 10 }}>
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              marginTop: height(4),
              color: "#F8F9F9",
              width: "90%",
              lineHeight: 25,
              marginBottom: height(1),
              fontWeight: 'bold',
            }}>
           {t("conclusion")}

            </Text>
      
            {/* Continue with text and lists */}
            <Text style={{
              fontSize: size(18),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
             {t("cryptoWalletConclusion")}
            </Text>

            </View>
       
       
        </ScrollView>
      
        {/* Button at the bottom */}
        <TouchableOpacity onPress={() => {
          router.push("/(learn)/coursePage_CryptoWalletSecurity")
        }}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: "#1653F0",
          position: 'absolute',
          bottom: height(5),
          borderRadius: 20,
          alignSelf: 'center',
          width: "90%",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.37,
          shadowRadius: 7.49,
          elevation: 12,
        }}>
          <Text style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: size(18),
            fontWeight: "bold",
            color: '#fff'
          }}>
            {t("takeQuizButton")}
          </Text>
        </TouchableOpacity>
      
      </View>
    );
  }




export default Artikel_Page