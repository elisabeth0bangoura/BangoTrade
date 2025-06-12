import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Animated } from 'react-native';
import { fontSize, height, size, width } from 'react-native-responsive-sizes';
import { useTranslation } from 'react-i18next';
import i18n from '../../Languages_Translation_Screens/i18n';
import { useRouter } from 'expo-router';

const LearnScreen = () => {
  const { t } = useTranslation();
  const [UserLang, setUserLang] = useState();

  useEffect(() => {
    if (UserLang && UserLang !== i18n.language) {
      i18n.changeLanguage(UserLang); // Set language dynamically based on UserLang
      console.log('Language set to:', UserLang); // Debugging output
    }
  }, [UserLang]);

  const dropdowns = [
    {
      title: t("cryptoGlossaryBlockchainTitle"),
      content: [t("cryptoGlossaryBlockchainDescription")],
    },
    {
      title: t("cryptoGlossaryBitcoinTitle"),
      content: [t("cryptoGlossaryBitcoinDescription")],
    },
    {
      title: t("cryptoGlossaryEthereumTitle"),
      content: [t("cryptoGlossaryEthereumDescription")],
    },
    {
      title: t("cryptoGlossaryAltcoinsTitle"),
      content: [t("cryptoGlossaryAltcoinsDescription")],
    },
    {
      title: t("cryptoGlossarySmartContractsTitle"),
      content: [t("cryptoGlossarySmartContractsDescription")],
    },
    {
      title: t("cryptoGlossaryWalletTitle"),
      content: [t("cryptoGlossaryWalletDescription")],
    },
    {
      title: t("cryptoGlossaryPrivateKeyTitle"),
      content: [t("cryptoGlossaryPrivateKeyDescription")],
    },
    {
      title: t("cryptoGlossaryPublicKeyTitle"),
      content: [t("cryptoGlossaryPublicKeyDescription")],
    },
    {
      title: t("cryptoGlossaryMiningTitle"),
      content: [t("cryptoGlossaryMiningDescription")],
    },
    {
      title: t("cryptoGlossaryProofOfWorkTitle"),
      content: [t("cryptoGlossaryProofOfWorkDescription")],
    },
    {
      title: t("cryptoGlossaryProofOfStakeTitle"),
      content: [t("cryptoGlossaryProofOfStakeDescription")],
    },
    {
      title: t("cryptoGlossaryDeFiTitle"),
      content: [t("cryptoGlossaryDeFiDescription")],
    },
    {
      title: t("cryptoGlossaryNFTTitle"),
      content: [t("cryptoGlossaryNFTDescription")],
    },
    {
      title: t("cryptoGlossaryTokenTitle"),
      content: [t("cryptoGlossaryTokenDescription")],
    },
    {
      title: t("cryptoGlossaryICOTitle"),
      content: [t("cryptoGlossaryICODescription")],
    },
    {
      title: t("cryptoGlossaryExchangeTitle"),
      content: [t("cryptoGlossaryExchangeDescription")],
    },
    {
      title: t("cryptoGlossaryLiquidityTitle"),
      content: [t("cryptoGlossaryLiquidityDescription")],
    },
    {
      title: t("cryptoGlossaryForkTitle"),
      content: [t("cryptoGlossaryForkDescription")],
    },
    {
      title: t("cryptoGlossaryStablecoinTitle"),
      content: [t("cryptoGlossaryStablecoinDescription")],
    },
    {
      title: t("cryptoGlossaryShardingTitle"),
      content: [t("cryptoGlossaryShardingDescription")],
    },
    {
      title: t("cryptoGlossaryGasFeesTitle"),
      content: [t("cryptoGlossaryGasFeesDescription")],
    },
    {
      title: t("cryptoGlossaryLedgerTitle"),
      content: [t("cryptoGlossaryLedgerDescription")],
    },
    {
      title: t("cryptoGlossaryCEXTitle"),
      content: [t("cryptoGlossaryCEXDescription")],
    },
    {
      title: t("cryptoGlossaryDEXTitle"),
      content: [t("cryptoGlossaryDEXDescription")],
    },
    {
      title: t("cryptoGlossaryStakingTitle"),
      content: [t("cryptoGlossaryStakingDescription")],
    },
    {
      title: t("cryptoGlossaryFiatCurrencyTitle"),
      content: [t("cryptoGlossaryFiatCurrencyDescription")],
    },
    {
      title: t("cryptoGlossaryWhaleTitle"),
      content: [t("cryptoGlossaryWhaleDescription")],
    },
    {
      title: t("cryptoGlossaryHODLTitle"),
      content: [t("cryptoGlossaryHODLDescription")],
    },
    {
      title: t("cryptoGlossaryFOMOTitle"),
      content: [t("cryptoGlossaryFOMODescription")],
    },
    {
      title: t("cryptoGlossaryFUDTitle"),
      content: [t("cryptoGlossaryFUDDescription")],
    },
    {
      title: t("cryptoGlossaryMoonTitle"),
      content: [t("cryptoGlossaryMoonDescription")],
    },
    {
      title: t("cryptoGlossaryPumpAndDumpTitle"),
      content: [t("cryptoGlossaryPumpAndDumpDescription")],
    },
    {
      title: t("cryptoGlossaryWhitepaperTitle"),
      content: [t("cryptoGlossaryWhitepaperDescription")],
    },
    {
      title: t("cryptoGlossaryColdWalletTitle"),
      content: [t("cryptoGlossaryColdWalletDescription")],
    },
    {
      title: t("cryptoGlossaryHotWalletTitle"),
      content: [t("cryptoGlossaryHotWalletDescription")],
    },
    {
      title: t("cryptoGlossaryRugPullTitle"),
      content: [t("cryptoGlossaryRugPullDescription")],
    },
    {
      title: t("cryptoGlossaryAirdropTitle"),
      content: [t("cryptoGlossaryAirdropDescription")],
    },
    {
      title: t("cryptoGlossaryBurningTokensTitle"),
      content: [t("cryptoGlossaryBurningTokensDescription")],
    },
    {
      title: t("cryptoGlossaryMarketCapTitle"),
      content: [t("cryptoGlossaryMarketCapDescription")],
    },
    {
      title: t("cryptoGlossaryTokenomicsTitle"),
      content: [t("cryptoGlossaryTokenomicsDescription")],
    },
    {
      title: t("cryptoGlossaryHalvingTitle"),
      content: [t("cryptoGlossaryHalvingDescription")],
    },
    {
      title: t("cryptoGlossaryDAppTitle"),
      content: [t("cryptoGlossaryDAppDescription")],
    },
    {
      title: t("cryptoGlossaryValidatorTitle"),
      content: [t("cryptoGlossaryValidatorDescription")],
    },
    {
      title: t("cryptoGlossarySyntheticAssetsTitle"),
      content: [t("cryptoGlossarySyntheticAssetsDescription")],
    },
    {
      title: t("cryptoGlossaryDAO_Title"),
      content: [t("cryptoGlossaryDAO_Description")],
    },
    {
      title: t("cryptoGlossaryCrossChainTitle"),
      content: [t("cryptoGlossaryCrossChainDescription")],
    },
  ];

  const Glossary = React.memo(({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current; // Initial value of the slide animation

    const toggleDropdown = () => {
      setIsOpen(!isOpen);

      // Animate the height of the dropdown
      Animated.timing(slideAnim, {
        toValue: isOpen ? 0 : 1, // Slide down if closed, slide up if open
        duration: 300,
        useNativeDriver: false, // Use false because we're animating height
      }).start();
    };

    // Interpolate the slide animation to control the height of the dropdown
    const dropdownHeight = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, content.length * 120], // Adjust 120 to the height of each item
    });

    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity style={styles.dropdownHeader} onPress={toggleDropdown}>
          <Text style={styles.dropdownTitle}>{title}</Text>
          {isOpen ? (
            <MaterialIcons name="keyboard-arrow-up" style={styles.icon} />
          ) : (
            <MaterialIcons name="keyboard-arrow-down" style={styles.icon} />
          )}
        </TouchableOpacity>

        <Animated.View style={[styles.dropdownContent, { height: dropdownHeight }]}>
          {content.map((item, index) => (
            <Text key={index} style={styles.dropdownItem}>
              {item}
            </Text>
          ))}
        </Animated.View>
      </View>
    );
  });

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 70 }} style={{ height: '100%', width: '100%' }}>
      <FlatList
        style={{ height: '100%', width: '100%', backgroundColor: '#0C1014' }}
        data={dropdowns}
        renderItem={({ item }) => <Glossary title={item.title} content={item.content} />}
        keyExtractor={(item) => item.title}
        initialNumToRender={5} // Limit initial renders
        maxToRenderPerBatch={5} // Limit the number of items rendered per batch
        windowSize={5} // Render only items in the viewport + some extra buffer
        removeClippedSubviews={true} // Improve memory performance
      />
      <Text style={styles.footerText}>
        Completing courses does not result in any qualifications. Courses are for informational purposes only.
        {"\n"}{"\n"}Past performance is not a reliable indicator of future results.
        {"\n"}{"\n"}Services are provided by Bango Bank Finanicals LLC, a Capital Markets Services License holder authorized by the Monetary Authority of United States
        (License no. CMS101155).
        {"\n"}{"\n"}View <Text style={styles.linkText}>Terms of business</Text> and <Text style={styles.linkText}>Trading Disclosures.</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#0C1014',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F8F9F9',
  },
  subheader: {
    fontSize: 16,
    color: '#9EA5B0',
    marginVertical: 10,
  },
  dropdownContainer: {
    marginBottom: 10,
    paddingTop: 20,
    paddingLeft: 20,
    borderRadius: 10,
    paddingRight: 20,
    backgroundColor: '#171A1F',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8F9F9',
  },
  icon: {
    fontSize: 20,
    color: '#F8F9F9',
  },
  dropdownContent: {
    overflow: 'hidden', // To make sure the content is clipped when animating
    paddingLeft: 0,
    color: '#9EA5B0',
    paddingVertical: 10,
  },
  dropdownItem: {
    fontSize: 16,
    color: '#9EA5B0',
  },
  footerText: {
    color: '#888',
    marginTop: 20,
    width: '90%',
    fontSize: size(13),
    alignSelf: 'center',
    textAlign: 'center',
  },
  linkText: {
    color: '#3265D0',
  },
});

export default LearnScreen;
