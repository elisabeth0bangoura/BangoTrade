import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, FlatList, StyleSheet, Image, ScrollView } from 'react-native';
import { fontSize, height, size, width } from 'react-native-responsive-sizes'
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../Languages_Translation_Screens/i18n';












// Mapping image names to actual require() calls
const imageMap = {
  'btcIcon.png': require("../../assets/images/btcIcon.png"),
  'ethBlockchainIcon.png': require("../../assets/images/Eth_blockchain.png"),
  'altcoins.png': require("../../assets/images/Altcoins.png"),
  'defi.png': require("../../assets/images/Defi.png"),
  'crypto_wallet.png': require("../../assets/images/CryptoWalletImage.png"),
  'NFT.png': require("../../assets/images/NFT.png"),
  'Crypto_trading.png': require("../../assets/images/Crypto_trading.png"),
  'Crypto_Regulation.png': require("../../assets/images/Crypto_Regulation.png"),
  'Crypto_future.png': require("../../assets/images/Crypto_future.png"),
  'CryptoTax.png': require("../../assets/images/CryptoTax.png"),
  
  // Add other images here if necessary
};



const options = {
  method: 'GET',
  headers: {
    accept: 'image/png',
    'APCA-API-KEY-ID': 'CKI8H1WSHVDTQR2S3XFM',
    'APCA-API-SECRET-KEY': 'mu2KNiyZXAkcxDiDPHZNqUpLptg7y2S0g5cS3MtC'
  }
};




const Courses = () => {


  




  const { t } = useTranslation();
  const router = useRouter();
  const [UserLang, setUserLang] = useState()










  useEffect(() => {
    if (UserLang && UserLang !== i18n.language) {
      i18n.changeLanguage(UserLang); // Set language dynamically based on UserLang
      console.log('Language set to:', UserLang); // Debugging output
    }
  }, [UserLang]);










// Your courses array with image names
const courses = [
  {
    title: t("bitcoinIntroHeader"),
    image: 'btcIcon.png',
    lessionText: "2 " + t("lessons"),
    Level: 1,
  
  },
  {
    title: t("ethereumSmartContractsHeader"),
    image: 'ethBlockchainIcon.png',
    lessionText: "3 " + t("lessons"),
    Level: 1,
  },
  {
    title: t("understandingAltcoinsHeader"),
    image: 'altcoins.png',
    lessionText: "4 " + t("lessons"),
    Level: 2,
  },
  {
    title: t("defiHeader"),
    image: 'defi.png',
    lessionText: "3 " + t("lessons"),
    Level: 2,
  },
  {
    title: t("cryptoWalletsSecurityHeader"),
    image: 'crypto_wallet.png',
    lessionText: "4 " + t("lessons"),
    Level: 2,
  },
  {
    title: t("nftsDigitalArtHeader"),
    image: 'NFT.png',
    lessionText: "4 " + t("lessons"),
    Level: 3,
  },
  {
    title: t("cryptoTradingBasicsHeader"),
    image: "Crypto_trading.png",
    lessionText: "4 " + t("lessons"),
    Level: 3,
  },
  {
    title: t("blockchainCryptoRegulationHeader"),
    image: "Crypto_Regulation.png",
    lessionText: "4 " + t("lessons"),
    Level: 4,
  },
  {
    title: t("cryptoFutureHeader"),
    image: "Crypto_future.png",
    lessionText: "4 " + t("lessons"),
    Level: 4,
  },
  {
    title: t("cryptoTaxHeader"),
    image: "CryptoTax.png",
    lessionText: "4 " + t("lessons"),
    Level: 4,
  },
];






const MAX_FLAMES = 4;
  const CourseItem = React.memo(({ title, item, lessionText, Level, content, image }) => (
  
      
    
      <LinearGradient
        // Background Linear Gradient
        colors={['#1821FC', '#0122D9']}
        style={styles.courseContainer}>
    





    <Entypo name='news' style={{
        position: 'absolute',
        right: 20,
        fontSize: size(25),
        bottom: height(2),
        color: "#fff"
      }} />

  {/* Render up to 4 flames: if index < Level => flame else => flame-outline */}
  <View style={{ flexDirection: 'row', top: height(3), right: width(4), position: 'absolute',  }}>
          {[...Array(MAX_FLAMES)].map((_, index) => (
            <Ionicons
              key={index}
              name={index < Level ? 'flame' : 'flame-outline'}
              size={20}
              color="#fff"
              style={{ marginRight: 4 }}
            />
          ))}
        </View>

    {/* Image container */}
    <View style={{
      height: "70%",
      marginTop: height(4),
      width:  "70%",
      alignSelf: 'center',
    // backgroundColor: '#'
    }}>

   
      {/* Image source resolved using the imageMap */}
      <Image source={imageMap[image]} style={{
        height: "100%",
        width: "100%",
        resizeMode: 'contain' 
      }} />
    </View>


    <Text style={{
      fontSize: size(16),
      color: '#F8F9F9',
      marginTop: height(-2)

    }}>
     {lessionText}
    </Text>

    <Text style={styles.courseTitle}>{title}</Text>

      
    </LinearGradient>
      
));




  return (


    <ScrollView contentContainerStyle={{paddingBottom: 70,}} 
    style={{
      height: "100%",
      width: "100%"
    }}> 
<FlatList
    style={{ height: "100%", width: "100%", backgroundColor: "#0C1014" }}
    contentContainerStyle={{ paddingBottom: height(4) }}
    data={courses}  // Use courses for the Courses component
    renderItem={({ item }) => (

     
      <TouchableOpacity 
      onPress={() => {
        if( item.title == t("bitcoinIntroHeader")) {
          router.push({ pathname: `/artikelPageBTC/`, params: {title: item.title, content: item.content} });
        }
        if( item.title == t("ethereumSmartContractsHeader")) {
          router.push({ pathname: `/artikelPageETH_SmartContracts/`, params: {title: item.title, content: item.content} });
        }

        if(item.title == t("understandingAltcoinsHeader")) {
          router.push({ pathname: `/artikelUnderstandingAltcoins/`, params: {title: item.title, content: item.content} });
        }


        if(item.title == t("defiHeader")) {
          router.push({ pathname: `/artikelDeFi/`, params: {title: item.title, content: item.content} });
        }
      

        if(item.title == t("cryptoWalletsSecurityHeader")) {
          router.push({ pathname: `/artikelCryptoWalletsSecurity/`, params: {title: item.title, content: item.content} });
        }
      

        if(item.title == t("nftsDigitalArtHeader")) {
          router.push({ pathname: `/artikelNFTsandDigitalArt/`, params: {title: item.title, content: item.content} });
        }

       
        if(item.title == t("cryptoTradingBasicsHeader")) {
          router.push({ pathname: `/artikelCryptoTradingBasics/`, params: {title: item.title, content: item.content} });
        }

        
        if(item.title == t("blockchainCryptoRegulationHeader")) {
          router.push({ pathname: `/artikelBlockchainCryptoRegulation/`, params: {title: item.title, content: item.content} });
        }


        if(item.title == t("cryptoFutureHeader")) {
          router.push({ pathname: `/artikelFutureCryptocurrencies/`, params: {title: item.title, content: item.content} });
        }



        if(item.title == t("cryptoTaxHeader")) {
          router.push({ pathname: `/articleCryptoTaxesAccounting/`, params: {title: item.title, content: item.content} });
        }

        
        
        }}> 
        <CourseItem title={item.title} lessionText={item.lessionText}  Level={item.Level} content={item.content} image={item.image} />

        </TouchableOpacity>
    
        
    )}
    keyExtractor={(item) => item.title}
    initialNumToRender={10} // Limit initial renders to 10 items
    maxToRenderPerBatch={10} // Limit number of items rendered per batch
    windowSize={5} // Adjust this to control how many items are rendered at a time
    removeClippedSubviews={true} // Unmount components when they're off-screen
/>

<Text style={{
  color: '#888',
  width: "90%",
  alignSelf: 'center',
  fontSize: size(13),
  textAlign: 'center',
}}>
Completing courses does not result in any qualifications. Courses are for informational purposes only.
{"\n"}{"\n"}
Past performance is not a reliable indicator of future results.
{"\n"}{"\n"}
Services are provided by Bango Bank Finanicals LLC, a Capital Markets Services License holder authorized by the Monetary Authority of United States 
(License no. CMS101155).
{"\n"}{"\n"}
View <Text style={{color: "#3265D0"}}>Terms of business</Text> and <Text style={{color: "#3265D0"}}>Trading Disclosures.</Text>
</Text>


</ScrollView>

  );
};

const styles = StyleSheet.create({
  courseContainer: {
    marginBottom: 10,
    backgroundColor: '#171A1F',
    padding: 20,
    height: height(39),
    width: "90%",
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  courseTitle: {
    fontSize: 18,
    width: "80%",
    marginTop: height(1),
    fontWeight: 'bold',
    color: '#F8F9F9',
  },
  icon: {
    fontSize: 20,
    color: '#F8F9F9',
  },
  courseContent: {
    fontSize: 16,
    color: '#9EA5B0',
    paddingVertical: 5,
  },



  courseContainer: {
    marginBottom: 10,
    backgroundColor: '#171A1F',
    padding: 20,
    height: height(39),
    width: "90%",
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  courseTitle: {
    fontSize: 18,
    width: "80%",
    marginTop: height(1),
    fontWeight: 'bold',
    color: '#F8F9F9',
  },
  flamesContainer: {
    width: 100,
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    top: 15,
    justifyContent: 'flex-end',
  },
  flameIcon: {
    fontSize: 22,
    marginLeft: 5,
  },
});

export default Courses;
