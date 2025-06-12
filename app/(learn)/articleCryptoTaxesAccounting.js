import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-realistic-deck-swiper'
import { fontSize, height, size, width } from 'react-native-responsive-sizes'
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { color } from 'd3';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useRouter from expo-router
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
  const title = useLocalSearchParams();
  const router = useRouter();
  const [UserLang, setUserLang] = useState()






  useEffect(() => {
    if (UserLang && UserLang !== i18n.language) {
      i18n.changeLanguage(UserLang); // Set language dynamically based on UserLang
      console.log('Language set to:', UserLang); // Debugging output
    }
  }, [UserLang]);







  console.log(title.title)
  

    return (

      <View style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#0C1014",
        position: 'relative', // Ensure the parent view can hold positioned elements
      }}>




      
        {/* Fixed BlurView at the top */}
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
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center', // Make sure the content is centered
            zIndex: 2, // Ensure TouchableOpacity is above other elements
        }}
        >
        <BlurView
        experimentalBlurMethod="dimezisBlurView"
            intensity={80} // Adjust blur intensity as needed
            style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 10,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center', // Center the icon inside the blur
            }}>

              
            <Ionicons
            name="arrow-back-sharp"
            style={{
                fontSize: size(18),
                color: '#fff',
            }}
            />
        </BlurView>
        </TouchableOpacity>


      
        {/* Scrollable content */}
        <ScrollView contentContainerStyle={{
          paddingBottom: height(13)
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
        
           {t("cryptoTaxHeader")}
          </Text>
      
          <Text style={{
            fontSize: size(18),
            marginLeft: width(5),
            marginTop: height(4),
            width: "90%",
            lineHeight: 25,
            color: "#F8F9F9"
          }}>
           {t("cryptoTaxDescription")}
          </Text>
      
          <LinearGradient colors={["#8676AA", "#2F0088"]} 
          style={{
            height: height(30),
            width: "90%",
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: height(4),
            justifyContent: 'center',
            backgroundColor: '#1A1E24',
          }}>
            <Image source={require("../../assets/images/CryptoTax.png")} 
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
              fontSize: 18, 
              width: "90%",
              fontWeight: 'bold', 
              color: "#F8F9F9", 
              marginBottom: height(1),
            }}>
              {t("cryptoTaxFeaturesHeader")}
            </Text>
      
            {/* List items */}
            <Text style={{
              marginLeft: width(5),
              marginTop: height(4), 
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
              }}>{t("cryptoTaxCapitalGainsHeader")}</Text> {t("cryptoTaxCapitalGainsDescription")}
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
              2. <Text style={{
                fontWeight: "bold",
                fontSize: size(18),
                color: "#F8F9F9",
              }}>{t("cryptoTaxIncomeHeader")}</Text> {t("cryptoTaxIncomeDescription")}
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
              }}>{t("cryptoTaxCryptoToCryptoHeader")}</Text> {t("cryptoTaxCryptoToCryptoDescription")}
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
              }}>{t("cryptoTaxReportingPlatformsHeader")}</Text> {t("cryptoTaxReportingPlatformsDescription")}
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
             {t("cryptoTaxImportanceHeader")}

            </Text>
      
            {/* Continue with text and lists */}
            <Text style={{
              fontSize: size(16),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              1. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxAvoidLegalIssues")}</Text> {t("cryptoTaxAvoidLegalIssuesDesc")}
            </Text>
            <Text style={{
              fontSize: size(16),
              marginLeft: width(5),
              marginTop: height(4),
              width: "90%",
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              2. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxMaximizeEfficiency")}</Text> {t("cryptoTaxMaximizeEfficiencyDesc")}
            </Text>
            <Text style={{
              fontSize: size(16),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              3. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxAccurateReporting")}</Text> {t("cryptoTaxAccurateReportingDesc")}
            </Text>


            <Text style={{
              fontSize: size(16),
              marginLeft: width(5),
              width: "90%",
              marginTop: height(4),
              color: "#F8F9F9",
              lineHeight: 25,
              marginBottom: height(1),
            }}>
              4. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxProfessionalAccounting")}</Text> {t("cryptoTaxProfessionalAccountingDesc")}
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
             {t("cryptoTaxCommonMisconceptions")}
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
              1. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxMisconception1Header")}</Text> {t("cryptoTaxMisconception1Description")}
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
              2. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxMisconception2Header")}</Text> {t("cryptoTaxMisconception2Description")}
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
              3. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxMisconception3Header")}</Text> {t("cryptoTaxMisconception3Description")}
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
              4. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxMisconception4Header")}</Text> {t("cryptoTaxMisconception4Description")}

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
              {t("cryptoTaxEvolutionHeader")}
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
              1. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxEvolutionIncreasedRegulationHeader")}</Text> {t("cryptoTaxEvolutionIncreasedRegulationDescription")}
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
              2. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxEvolutionTrackingAndReportingHeader")}</Text> {t("cryptoTaxEvolutionTrackingAndReportingDescription")}

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
              3. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxEvolutionDeFiStakingTaxationHeader")}</Text> {t("cryptoTaxEvolutionDeFiStakingTaxationDescription")}

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
              4. <Text style={{ fontWeight: 'bold' }}>Global Coordination:</Text> As cryptocurrencies are global assets, cross-border tax compliance has become a priority for tax authorities. Governments are working together through organizations like the OECD to develop global standards for crypto tax reporting. This will help standardize how crypto is taxed worldwide.

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
              {t("cryptoTaxStayInformedHeader")}
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
              1. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxStayInformedFollowRegulatoryChangesHeader")}</Text> {t("cryptoTaxStayInformedFollowRegulatoryChangesDescription")}
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
              2. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxStayInformedKeepDetailedRecordsHeader")}</Text> {t("cryptoTaxStayInformedKeepDetailedRecordsDescription")}
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
              3. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxStayInformedConsultTaxProfessionalHeader")}</Text> {t("cryptoTaxStayInformedConsultTaxProfessionalDescription")}

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
              4. <Text style={{ fontWeight: 'bold' }}>{t("cryptoTaxStayInformedUseTaxSoftwareHeader")}</Text> {t("cryptoTaxStayInformedUseTaxSoftwareDescription")}

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
           {t("cryptoTaxConclusion")}

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
             {t("cryptoTaxConclusionText")}
            </Text>

            </View>
       
       
        </ScrollView>
      
        {/* Button at the bottom */}
        <TouchableOpacity onPress={() => {
          router.push("/(learn)/coursePage_CrytoTaxAccounting")
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