import React, {
	useCallback,
	useEffect,
	useState,
	useMemo,
	useRef,
	useContext,
  } from 'react';
  import {
	Text,
	View,
	StyleSheet,
	KeyboardAvoidingView,
	TextInput,
	Image,
	TouchableWithoutFeedback,
	Keyboard,
	Button,
	Animated,
	Dimensions,
	Platform,
	ActivityIndicator,
	Modal,
	TouchableOpacity,
	FlatList,
	
  } from 'react-native';
  import { Link, useRouter } from 'expo-router';
  import Swiper from 'react-native-swiper';
  import { fontSize, height, size, width } from 'react-native-responsive-sizes';
  import * as Haptics from 'expo-haptics';
  import { GestureHandlerRootView } from 'react-native-gesture-handler';
  import Constants from 'expo-constants';
  import LottieView from 'lottie-react-native';
  import uuid from 'react-native-uuid';

  // ---- 1) Imports for BottomSheet + CountryPicker ----
  import {
	BottomSheetModalProvider,
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetFlashList,
	BottomSheetView,
  } from '@gorhom/bottom-sheet';
  import { CountryPicker, CountryButton } from 'react-native-country-codes-picker';
  import CountryFlag from "react-native-country-flag";
  import { AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
  import { BlurView } from 'expo-blur';
  import debounce from 'lodash.debounce';
import axios from 'axios';
import { Easing } from 'react-native-reanimated'; // Use Easing from react-native-reanimated
import { OtpInput } from "react-native-otp-entry";
import { NetworkInfo } from "react-native-network-info";


import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AnimatedHeader from 'react-native-animated-header';


import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc } from '@react-native-firebase/firestore';
import { getDatabase, ref, set, get, serverTimestamp, remove } from '@react-native-firebase/database';



import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Switch } from 'react-native-switch';
import {
	Onfido,
	OnfidoCaptureType,
	OnfidoCountryCode,
	OnfidoDocumentType,
  } from '@onfido/react-native-sdk'; 
import { color, ribbon } from 'd3';


import * as FileSystem from 'expo-file-system';

import Pin from "./PinComponents/Pin"
import { LogInContext } from '../Context/LogInContext';
import ActionSheet, {useSheetRef, ScrollView, SheetManager} from 'react-native-actions-sheet';
import { useTranslation } from 'react-i18next';
import { ViewModeContext } from '@/app/Context/ViewModeContext';
import LogIn from './LogIn';
import SignUpPin from './PinSignUp/Pin';





// Replace with your Onfido API Token and Document ID
const apiToken = 'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE3MzcyODU2MzUsInBheWxvYWQiOnsiYXBwIjoiMDBkNjI4ZGMtNmI5Zi00ZWVhLThkNDMtOTZhYzllOTM2YzRlIiwiY2xpZW50X3V1aWQiOiJkOGU2NjI0NC00ODgwLTQyMzktODE1OS03NWIyOTZiYTgwMDgiLCJpc19zYW5kYm94Ijp0cnVlLCJpc19zZWxmX3NlcnZpY2VfdHJpYWwiOmZhbHNlLCJpc190cmlhbCI6ZmFsc2UsInJlZiI6IioiLCJzYXJkaW5lX3Nlc3Npb24iOiI0ZTAwZGZlMy1mNDllLTRjMTgtYWMyMi1kZjY0MDcwOTZiMzIifSwidXVpZCI6InBsYXRmb3JtX3N0YXRpY19hcGlfdG9rZW5fdXVpZCIsInVybHMiOnsiZGV0ZWN0X2RvY3VtZW50X3VybCI6Imh0dHBzOi8vc2RrLnVzLm9uZmlkby5jb20iLCJzeW5jX3VybCI6Imh0dHBzOi8vc3luYy5vbmZpZG8uY29tIiwiaG9zdGVkX3Nka191cmwiOiJodHRwczovL2lkLm9uZmlkby5jb20iLCJhdXRoX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJvbmZpZG9fYXBpX3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20iLCJ0ZWxlcGhvbnlfdXJsIjoiaHR0cHM6Ly9hcGkudXMub25maWRvLmNvbSJ9fQ.MIGGAkF0rw7l5fuzZZZvfNFiI1BXeS-gVF0JMCzorclBZ_jTz8lY6ZF05I4fTARsq3BpNw8c6yNMiBmQ_LouZAwsPNuO9wJBMAr-yoT3znJetCdJPGhoV3gAd0cz-KAylkAX-HBSyxoafwrwloIqzaA5UzpzlR7KWd3NC4F3TeTDVb2ZU-9qRdo';  // Replace with your Onfido API token
const documentId = 'b7e0f8af-9e06-4751-b502-a7ac44655e86';  // Example document ID





















  
  export default function SignUp() {



	const { t, i18n } = useTranslation();

	const currentLanguage = i18n.language;
  
  
	const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);
	const SignUp_Sheet = useRef(null)
	


	const EXPO_ALPACA_SANDBOX_AUTH_HEADER = process.env.EXPO_PUBLIC_ALPACA_SANDBOX_AUTH_HEADER;
	const EXPO_UNIT_SANDBOX_API_TOKEN = process.env.EXPO_PUBLIC_UNIT_SANDBOX_API_TOKEN;
	const EXPO_GOOGLE_MAP_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;
	const CRYPTOAPI_KEY = process.env.EXPO_PUBLIC_CRYPTOAPI_KEY;


	const router = useRouter();
	// At the top of your Index component
	const phoneInputRef = useRef(null);
	const phoneInputRefLogIn = useRef(null);
	const searchInputRef = useRef(null);
    const otpInputRef = useRef(null); // Ref to the OTP input
	const otpInputRef2 = useRef(null);
	const otpInputRef3 = useRef(null);
	const otpInputRef4 = useRef(null); 
	const EmailInputRef = useRef(null)
	const FirstNameinputRef = useRef(null)
	const NameinputRef =  useRef(null)
	const SearchBirthinputRef = useRef(null)
	const animation = useRef(null);




	// ---- 2) Regular states ----
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [isSheetOpenLogIn, setIsSheetOpenLogIn] = useState(false)
	const [CoinBottomSheet, setCoinBottomSheet] = useState(false);


	const [unitUserId, setUnitUserId] = useState();
	const [unitIdempotencyKey, setUnitIdempotencyKey] = useState();
	const [onfidoResultData, setOnfidoResultData] = useState(null);
	const [UnitCustomerId, setUnitCustomerId] = useState()
	const [StatusPage16Done, setStatusPage16Done] = useState(false)

	// ---- 3) BottomSheet states + refs ----
	const sheetRef = useRef(null);
	const snapPoints = useMemo(() => [Platform.OS === 'ios' ? '92%' : '90%'], []);
	const snapPointsCountires = useMemo(() => [Platform.OS === 'ios' ? '85%' : '60%'], []);

	const [sheetIndex, setSheetIndex] = useState(-1);
	const [sheetIndexPhonenumber, setsheetIndexPhonenumber] = useState(-1);
	const [isSheetOpenPhoneNumber, setisSheetOpenPhoneNumber] = useState(false);



	const {CurrentCode, setCurrentCode, ISO3Code, setIso3Code} = useContext(LogInContext);

	const [keyboardVisible, setKeyboardVisible] = useState(false);
  
	// ---- 4) CountryPicker states ----
	const [show, setShow] = useState(false);
	const [countryCode, setCountryCode] = useState('');
	// 1. Update searchQuery state
	const [searchQuery, setSearchQuery] = useState('');
	const [phoneNumberInput, setPhoneNumberInput] = useState("")

	const [FirstName, setFirstName] = useState("")
	const [LastName, setLastName] = useState("")
	const [TypedInPinConfirmation, setTypedInPinConfirmation] = useState()
	const [isVisible, setIsVisible] = useState(false);

  // 1. React state to store account ID and Onfido token
  const [AlpacaAccountId, setAlpacaAccountId] = useState(null);
  const [AlpacaUserId, setAlpacaUserId] = useState(null);
  const [TAX_ID, setTAX_ID] = useState()
  
  const [onfidoToken, setOnfidoToken] = useState(null);
  const [status, setStatus] = useState('');
  const [Investment_time_horizon, setInvestment_time_horizon] = useState()
  const [AnnualIncomeMin, setAnnualIncomeMin] = useState()
  const [AnnualIncomeMax, setAnnualIncomeMax] = useState()
  const [LiquidNetWorthOptionsMin, setLiquidNetWorthOptionsMin] = useState()
  const [Visiblefundingsource, setVisiblefundingsource] = useState(false)
  const [ChoosedFunding_Sourced, setChoosedFunding_Sourced] = useState()
  const [ChoosedFunding_SourcedText, setChoosedFunding_SourcedText] = useState()
  const [ChoosedLiquidityNeeds, setChoosedLiquidityNeeds] = useState()
  const [ChoosedLiquidityNeedsText, setChoosedLiquidityNeedsText] = useState()
  const [VisibleLiquidityNeeds, setVisibleLiquidityNeeds] = useState(false)
  const [ChoosedInvestmentExperience, setChoosedInvestmentExperience] = useState()
  const [ChoosedInvestmentExperienceText, setChoosedInvestmentExperienceText] = useState()
  const [VisibleInvestmentExperience, setVisibleInvestmentExperience] = useState(false)
  const [ChoosedInvestmentExperienceOptions, setChoosedInvestmentExperienceOptions] = useState()
  const [ChoosedInvestmentExperienceOptionsText, setChoosedInvestmentExperienceOptionsText] = useState()
  const [VisibleInvestmentExperienceOptions, setVisibleInvestmentExperienceOptions] = useState(false)

  const [ChoosedRiskTolerance, setChoosedRiskTolerance] = useState()
  const [ChoosedRiskToleranceText, setChoosedRiskToleranceText] = useState()
  const [VisibleRiskTolerance, setVisibleRiskTolerance] = useState(false)


  const [ChoosedInvestmentObjective, setChoosedInvestmentObjective] = useState()
  const [ChoosedInvestmentObjectiveText, setChoosedInvestmentObjectiveText] = useState()
  const [VisibleInvestmentObjective, setVisibleInvestmentObjective] = useState(false)

  const [ChoosedInvestmentTimeHorizon, setChoosedInvestmentTimeHorizon] = useState()
  const [ChoosedInvestmentTimeHorizonText, setChoosedInvestmentTimeHorizonText] = useState()
  const [VisibleInvestmentTimeHorizon, setVisibleInvestmentTimeHorizon] = useState(false)

  const [ChoosedMinimumAnnualIncome, setChoosedMinimumAnnualIncome] = useState()
  const [VisibleMinimumAnnualIncome, setVisibleMinimumAnnualIncome] = useState(false)
  const [ChoosedMaximumAnnualIncome, setChoosedMaximumAnnualIncome] = useState()
  const [ChoosedMaximumAnnualIncomeText, setChoosedMaximumAnnualIncomeText] = useState()

  const [ChoosedMinLiquidNetWorth, setChoosedMinLiquidNetWorth] = useState()
  const [ChoosedMaxLiquidNetWorth, setChoosedMaxLiquidNetWorth] = useState()
  const [VisibleLiquidNetWorth, setVisibleLiquidNetWorth] = useState(false)
  const [ChoosedLiquidNetWorthText, setChoosedLiquidNetWorthText] = useState()

  
  const [ChoosedMinTotalNetWorth, setChoosedMinTotalNetWorth] = useState()
  const [ChoosedMaxTotalNetWorth, setChoosedMaxTotalNetWorth] = useState()
  const [VisibleTotalNetWorth, setVisibleTotalNetWorth] = useState(false)
  const [ChoosedTotalNetWorthText, setChoosedTotalNetWorthText] = useState()

  


  const [VisibleEmploymentStatus, setVisibleEmploymentStatus] = useState(false)
  const [ChoosedEmploymentStatusText, setChoosedEmploymentStatusText] = useState()
const [ChoosedEmploymentStatus, setChoosedEmploymentStatus] = useState()
  
  
  const [VisibleControlPosition, setVisibleControlPosition] = useState(false)
  const [ChoosedControlPositionText, setChoosedControlPositionText] = useState()
  const [ChoosedControlPosition, setChoosedControlPosition] = useState()

  
  
  const [VisibleFINRAAffiliation, setVisibleFINRAAffiliation] = useState(false)
  const [ChoosedFINRAAffiliationText, setChoosedFINRAAffiliationText] = useState()
  const [ChoosedFINRAAffiliation, setChoosedFINRAAffiliation] = useState()

  
  const [VisiblePoliticallyExposed, setVisiblePoliticallyExposed] = useState(false)
  const [ChoosedPoliticallyExposedText, setChoosedPoliticallyExposedText] = useState()
  const [ChoosedPoliticallyExposed, setChoosedPoliticallyExposed] = useState()


  const [VisibleFamilyExposure, setVisibleFamilyExposure] = useState(false)
  const [ChoosedFamilyExposureText, setChoosedFamilyExposureText] = useState()
  const [ChoosedFamilyExposure, setChoosedFamilyExposure] = useState()



  const [VisibleTax_id_type, setVisibleTax_id_type] = useState(false)
  const [ChoosedTax_id_type, setChoosedTax_id_type] = useState()

  const {PhonenumberLogIn, setPhonenumberLogIn} = useContext(LogInContext)




  // BottomSheet  

  const sheetRefLogIn = useRef(null);
  const snapPointsLogIn = useMemo(() => [Platform.OS === 'ios' ? '92%' : '90%'], []);
  const [sheetIndexLogIn, setSheetIndexLogIn] = useState(-1);

  

// PIN



const styles = StyleSheet.create({
	input: {
	  marginVertical: 4,
	  height: 50,
	  borderWidth: 1,
	  borderRadius: 4,
	  padding: 10,
	  backgroundColor:CurrentViewMode.Mode_bg,
	},
	wrapper: {},
	slide1: {
	  height: '100%',
	  overflow: 'hidden',
	
	  width: '100%',
	  backgroundColor: CurrentViewMode.Mode_bg,
	},
	slide2: {
	  height: '100%',
	  overflow: 'hidden',
	  width: '100%',
	  backgroundColor: CurrentViewMode.Mode_bg,
	},
	slide3: {
	  height: '100%',
	  overflow: 'hidden',
	  width: '100%',
	  backgroundColor: CurrentViewMode.Mode_bg,
	},
	text: {
	  color: '#000',
	  fontSize: 30,
	  fontWeight: 'bold',
	},
	container: {
	 height: "100%",
	 position: 'absolute',
	 width: "100%"
	},
  });
  


  

  const [searchText, setSearchText] = useState("");
  const Funding_source_Data = [
	{

	  id: "employment_income",
	  item: t("EmploymentIncomeText"),
	},
	{

	  id: "investments",
	  item: t("InvestmentsText"),
	},
	{
	  id: "Inheritance",
	  item: t("InheritanceText"),
	},
	{
	  id: "business_income",
	  item: t("BusinessIncomeText"), 
	},
	{
	  id: "savings",
	  item: t("SavingsText"),  
	},
	{
	  id: "family",
	  item: t("FamilyText"), 
	}
  ];
  

  const [filteredData, setFilteredData] = useState(Funding_source_Data);

  // Search In just a Few more questions

  const handleSearchFewMoreQuestions = (text) => {
	setSearchText(text);
    if (text === "") {
      setFilteredData(Funding_source_Data); // Reset to full data if search text is empty
    } else {
      const newData = Funding_source_Data.filter((item) =>
        item.item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(newData);
    }
  };






  const [searchTextLiquidityNeeds, setSearchTextLiquidityNeeds] = useState("");
  const LiquidityNeeds_Data = [
	{ id: "very_important", item: t("VeryImportantText") },
	{ id: "important", item: t("ImportantText") },
	{ id: "somewhat_important", item: t("SomewhatImportantText")},
	{ id: "does_not_matter", item: t("doesNotMatter") }
  ];
  const [filteredDataLiquidityNeeds, setFilteredDataLiquidityNeeds] = useState(LiquidityNeeds_Data);

  // Search In just a Few more questions

  const handleSearchLiquidityNeeds = (text) => {
	setSearchTextLiquidityNeeds(text);
    if (text === "") {
      setFilteredDataLiquidityNeeds(LiquidityNeeds_Data); // Reset to full data if search text is empty
    } else {
      const newData = LiquidityNeeds_Data.filter((item) =>
        item.item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDataLiquidityNeeds(newData);
    }
  };








  const [searchTextInvestmentExperience, setSearchTextInvestmentExperience] = useState("");
  const InvestmentExperience_Data = [
	{ id: "none", item: t("NoneText") },
	{ id: "1_to_5_years", item: t("OneTo5YearsText")},
	{ id: "over_5_years", item: t("Over5YearsText")},

  ];
  const [filteredDataInvestmentExperience, setFilteredDataInvestmentExperience] = useState(InvestmentExperience_Data);

  // Search In just a Few more questions

  const handleSearchInvestmentExperience = (text) => {
	setSearchTextInvestmentExperience(text);
    if (text === "") {
      setFilteredDataInvestmentExperience(InvestmentExperience_Data); // Reset to full data if search text is empty
    } else {
      const newData = InvestmentExperience_Data.filter((item) =>
        item.item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDataInvestmentExperience(newData);
    }
  };







  const [searchTextInvestmentExperienceOptions, setSearchTextInvestmentExperienceOptions] = useState("");
  const InvestmentExperienceOptions_Data = [
	{ id: "none", item: t("NoneText") },
	{ id: "1_to_5_years", item: t("OneTo5YearsText") },
	{ id: "over_5_years", item:t("Over5YearsText") },

  ];
  const [filteredDataInvestmentExperienceOptions, setFilteredDataInvestmentExperienceOptions] = useState(InvestmentExperienceOptions_Data);

  // Search In just a Few more questions

  const handleSearchInvestmentExperienceOptions = (text) => {
	setSearchTextInvestmentExperienceOptions(text);
    if (text === "") {
      setFilteredDataInvestmentExperienceOptions(InvestmentExperienceOptions_Data); // Reset to full data if search text is empty
    } else {
      const newData = InvestmentExperienceOptions_Data.filter((item) =>
        item.item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDataInvestmentExperienceOptions(newData);
    }
  };

  







  const [searchTextRiskTolerance, setSearchTextRiskTolerance] = useState("");
  const RiskTolerance_Data = [
	{ id: "conservative", item: t("ConservativeText") },
	{ id: "moderate", item: t("ModerateText") },
	{ id: "significant_risk", item: t("SignificantRiskText") },

  ];
  const [filteredDataRiskTolerance, setFilteredRiskTolerance] = useState(RiskTolerance_Data);

  // Search In just a Few more questions

  const handleSearchRiskTolerance = (text) => {
	setSearchTextRiskTolerance(text);
    if (text === "") {
		setSearchTextRiskTolerance(RiskTolerance_Data); // Reset to full data if search text is empty
    } else {
      const newData = RiskTolerance_Data.filter((item) =>
        item.item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRiskTolerance(newData);
    }
  };















  const [searchTextInvestmentObjective, setSearchTextInvestmentObjective] = useState("");
  const InvestmentObjective_Data = [
	{ id: "generate_income", item: t("GenerateIncomeText") },
	{ id: "preserve_wealth", item: t("PreserveWealthText") },
	{ id: "market_speculation", item: t("MarketSpeculationText") },
	{ id: "growth", item:  t("GrowthText") },
	{ id: "balance_preserve_wealth_with_growth", item: t("BalancePreserveWealthWithGrowth") },

  ];
  const [filteredDataInvestmentObjective, setfilteredDataInvestmentObjective] = useState(InvestmentObjective_Data);

  // Search In just a Few more questions

  const handleSearchInvestmentObjective = (text) => {
	setSearchTextInvestmentObjective(text);
    if (text === "") {
		setSearchTextInvestmentObjective(InvestmentObjective_Data); // Reset to full data if search text is empty
    } else {
      const newData = InvestmentObjective_Data.filter((item) =>
        item.item.toLowerCase().includes(text.toLowerCase())
      );
      setfilteredDataInvestmentObjective(newData);
    }
  };











  const [searchTextInvestmentTimeHorizon, setSearchTextInvestmentTimeHorizon] = useState("");
  const InvestmentTimeHorizon_Data = [
	{ id: "less_than_1_year", item: t("LessThan1Year") },
	{ id: "1_to_2_years", item: t("OneTo2Years") },
	{ id: "3_to_5_years", item: t("ThreeTo5Years") },
	{ id: "6_to_10_years", item: t("SixTo10Years") },
	{ id: "more_than_10_years", item: t("MoreThan10Years") },

	

  ];
  const [filteredDataInvestmentTimeHorizon, setfilteredDataInvestmentTimeHorizon] = useState(InvestmentTimeHorizon_Data);

  // Search In just a Few more questions

  const handleSearchInvestmentTimeHorizon = (text) => {
	setSearchTextInvestmentTimeHorizon(text);
    if (text === "") {
		setSearchTextInvestmentTimeHorizon(InvestmentTimeHorizon_Data); // Reset to full data if search text is empty
    } else {
      const newData = InvestmentTimeHorizon_Data.filter((item) =>
        item.item.toLowerCase().includes(text.toLowerCase())
      );
      setfilteredDataInvestmentTimeHorizon(newData);
    }
  };















  
  const [searchTextMinimumAnnualIncome, setSearchTextMinimumAnnualIncome] = useState("");
  const annualIncomeOptionsMinimumAnnualIncome = [
	{ id: 1, min: 0, max: 25000, text: "0 - 25,000" },
	{ id: 2, min: 25000, max: 50000, text: "25,000 - 50,000" },
	{ id: 3, min: 50000, max: 100000, text: "50,000 - 100,000" },
	{ id: 4, min: 100000, max: 200000, text: "100,000 - 200,000" },
	{ id: 5, min: 200000, max: 500000, text: "200,000 - 500,000" },
	{ id: 6, min: 500000, max: 1000000, text: "500,000+" }, // "+" indicates no upper bound
  ];
  

  const [filteredDataMinimumAnnualIncome, setfilteredDataMinimumAnnualIncome] = useState(annualIncomeOptionsMinimumAnnualIncome);

  // Search In just a Few more questions

  const handleSearchMinimumAnnualIncome = (text) => {
	setSearchTextMinimumAnnualIncome(text);
    if (text === "") {
		setSearchTextMinimumAnnualIncome(annualIncomeOptionsMinimumAnnualIncome); // Reset to full data if search text is empty
    } else {
      const newData = annualIncomeOptionsMinimumAnnualIncome.filter((item) =>
        item.item.toLowerCase().includes(text.toLowerCase())
      );
      setfilteredDataMinimumAnnualIncome(newData);
    }
  };













  
  


  const [searchTextLiquidNetWorth, setSearchTextLiquidNetWorth] = useState("");

  const liquidNetWorthOptions_Data = [
	{ id: 1, min: 0, max: 5000, text: "0 - 5,000" },
	{ id: 2, min: 500, max: 25000, text: "5,000 - 25,000" },
	{ id: 3, min: 2500, max: 100000, text: "25,000 - 100,000" },
	{ id: 4, min: 10000, max: 500000, text: "100,000 - 500,000" },
	{ id: 5, min: 50000, max: 1000000, text: "500,000 - 1,000,000" },
	{ id: 6, min: 1000000, max: 2000000, text: "1,000,000+" }, // "+" for no upper bound
  ];
  

  const [filteredDataLiquidNetWorth, setfilteredDataLiquidNetWorth] = useState(liquidNetWorthOptions_Data);

  // Search In just a Few more questions

  const handleSearchLiquidNetWorth = (text) => {
	setSearchTextLiquidNetWorth(text);
    if (text === "") {
		setSearchTextLiquidNetWorth(liquidNetWorthOptions_Data); // Reset to full data if search text is empty
    } else {
      const newData = liquidNetWorthOptions_Data.filter((item) =>
        item.item.toLowerCase().includes(text.toLowerCase())
      );
      setfilteredDataLiquidNetWorth(newData);
    }
  };











  



  const [searchTextTotalNetWorth, setSearchTextTotalNetWorth] = useState("");

  const TotalNetWorthOptions_Data = [
	{ id: 1, min: 0, max: 5000, text: "0 - 5,000" },
	{ id: 2, min: 5000, max: 25000, text: "5,001 - 25,000" },
	{ id: 3, min: 25000, max: 100000, text: "25,000 - 100,000" },
	{ id: 4, min: 100000, max: 500000, text: "100,000 - 500,000" },
	{ id: 5, min: 500000, max: 1000000, text: "500,000 - 1,000,000" },
	{ id: 6, min: 1000000, max: 2000000, text: "1,000,000+" }, // "+" for no upper bound
  ];
  

  const [filteredDataTotalNetWorth, setfilteredDataTotalNetWorth] = useState(liquidNetWorthOptions_Data);

  // Search In just a Few more questions

  const handleSearchTotalNetWorth = (text) => {
	setSearchTextTotalNetWorth(text);
    if (text === "") {
		setSearchTextTotalNetWorth(TotalNetWorthOptions_Data); // Reset to full data if search text is empty
    } else {
      const newData = TotalNetWorthOptions_Data.filter((item) =>
        item.item.toLowerCase().includes(text.toLowerCase())
      );
      setfilteredDataTotalNetWorth(newData);
    }
  };



 




  


  


  const [searchTextEmploymentStatus, setSearchTextEmploymentStatus] = useState("");

  const employmentStatusOptions = [
	{ id: "employed", item: t("EmployedText") },
	{ id: "unemployed", item: t("UnemployedText") },
	{ id: "retired", item:  t("RetiredText") },
	{ id: "student", item:  t("StudentText") },
  ];
  
  const [filteredDataEmploymentStatus, setfilteredDataEmploymentStatus] = useState(employmentStatusOptions);
  
  // Search functionality
  const handleSearchEmploymentStatus = (text) => {
	setSearchTextEmploymentStatus(text); // Update search text state
	if (text === "") {
	  // Reset the filtered data when search is cleared
	  setfilteredDataEmploymentStatus(employmentStatusOptions);
	} else {
	  // Filter the list based on search text
	  const newData = employmentStatusOptions.filter((item) =>
		item.item.toLowerCase().includes(text.toLowerCase())
	  );
	  setfilteredDataEmploymentStatus(newData);
	}
  };
  



















  


 


  const [searchTextControlPosition, setSearchTextControlPosition] = useState("");

  const controlPositionOptions = [
	{ id: true, value: true, item: t("YesText")},
	{ id: false, value: false, item: t("NoText") },
  ];
  
  const [filteredDataControlPosition, setfilteredDataControlPosition] = useState(controlPositionOptions);
  
  // Search functionality
  const handleSearchControlPosition = (text) => {
	setSearchTextControlPosition(text); // Update search text state
	if (text === "") {
	  // Reset the filtered data when search is cleared
	  setfilteredDataControlPosition(controlPositionOptions);
	} else {
	  // Filter the list based on search text
	  const newData = controlPositionOptions.filter((item) =>
		item.item.toLowerCase().includes(text.toLowerCase())
	  );
	  setfilteredDataControlPosition(newData);
	}
  };
  






  






  const [searchTextFINRAAffiliation, setSearchTextFINRAAffiliation] = useState("");

  const exchangeOrFinraAffiliationOptions = [
	{ id: true, value: true, item: t("YesText") },
	{ id: false, value: false, item: t("NoText") },
  ];
  
  const [filteredDataFINRAAffiliation, setfilteredDataFINRAAffiliation] = useState(exchangeOrFinraAffiliationOptions);
  
  // Search functionality
  const handleSearchFINRAAffiliation = (text) => {
	setSearchTextFINRAAffiliation(text); // Update search text state
	if (text === "") {
	  // Reset the filtered data when search is cleared
	  setfilteredDataFINRAAffiliation(exchangeOrFinraAffiliationOptions);
	} else {
	  // Filter the list based on search text
	  const newData = exchangeOrFinraAffiliationOptions.filter((item) =>
		item.item.toLowerCase().includes(text.toLowerCase())
	  );
	  setfilteredDataFINRAAffiliation(newData);
	}
  };














  const [searchTextPoliticallyExposed, setSearchTextPoliticallyExposed] = useState("");

  const exchangeOrPoliticallyExposedOptions = [
	{ id: true, value: true, item: t("YesText") },
	{ id: false, value: false, item: t("NoText") },
  ];
  
  const [filteredDataPoliticallyExposed, setfilteredDataPoliticallyExposed] = useState(exchangeOrPoliticallyExposedOptions);
  
  // Search functionality
  const handleSearchPoliticallyExposed = (text) => {
	setSearchTextPoliticallyExposed(text); // Update search text state
	if (text === "") {
	  // Reset the filtered data when search is cleared
	  setfilteredDataPoliticallyExposed(exchangeOrPoliticallyExposedOptions);
	} else {
	  // Filter the list based on search text
	  const newData = exchangeOrPoliticallyExposedOptions.filter((item) =>
		item.item.toLowerCase().includes(text.toLowerCase())
	  );
	  setfilteredDataPoliticallyExposed(newData);
	}
  };





  




  const [searchTextFamilyExposure, setSearchTextFamilyExposure] = useState("");

  const exchangeOrFamilyExposureOptions = [
	{ id: true, value: true, item: t("YesText")},
	{ id: false, value: false, item: t("NoText")},
  ];
  
  const [filteredDataFamilyExposure, setfilteredDataFamilyExposure] = useState(exchangeOrFamilyExposureOptions);
  
  // Search functionality
  const handleSearchFamilyExposure = (text) => {
	setSearchTextFamilyExposure(text); // Update search text state
	if (text === "") {
	  // Reset the filtered data when search is cleared
	  setfilteredDataFamilyExposure(exchangeOrFamilyExposureOptions);
	} else {
	  // Filter the list based on search text
	  const newData = exchangeOrFamilyExposureOptions.filter((item) =>
		item.item.toLowerCase().includes(text.toLowerCase())
	  );
	  setfilteredDataFamilyExposure(newData);
	}
  };





  


  
  

  const [searchTextTax_id_type, setSearchTextTax_id_type] = useState("");

  const exchangeOrTax_id_typeOptions = [
	{ code: "USA_SSN", description: t("USASocialSecurityNumber") },
		{ code: "ARG_AR_CUIT", description: t("ArgentinaCUIT") },
		{ code: "AUS_TFN", description: t("AustralianTaxFileNumber") },
		{ code: "AUS_ABN", description: t("AustralianBusinessNumber") },
		{ code: "BOL_NIT", description: t("BoliviaNIT") },
		{ code: "BRA_CPF", description: t("BrazilCPF") },
		{ code: "CHL_RUT", description: t("ChileRUT") },
		{ code: "COL_NIT", description: t("ColombiaNIT") },
		{ code: "CRI_NITE", description: t("CostaRicaNITE") },
		{ code: "DEU_TAX_ID", description: t("GermanyTaxIDIdentifikationsnummer") },
		{ code: "DOM_RNC", description: t("DominicanRepublicRNC") },
		{ code: "ECU_RUC", description: t("EcuadorRUC") },
		{ code: "FRA_SPI", description: t("FranceSPIReferenceTaxNumbe") },
		{ code: "GBR_UTR", description: t("UKUTRUniqueTaxpayerReference") },
		{ code: "GBR_NINO", description: t("UKNINONationalInsuranceNumber") },
		{ code: "GTM_NIT", description: t("GuatemalaNIT") },
		{ code: "HND_RTN", description: t("HondurasRTN") },
		{ code: "HUN_TIN", description: t("HungaryTINNumber") },
		{ code: "IDN_KTP", description: t("IndonesiaKTP") },
		{ code: "IND_PAN", description: t("IndiaPANNumber") },
		{ code: "ISR_TAX_ID", description: t("IsraelTaxIDTeudatZehut") },
		{ code: "ITA_TAX_ID", description: t("ItalyTaxIDCodiceFiscale") },
		{ code: "JPN_TAX_ID", description: t("JapanTaxIDKoijinBango") },
		{ code: "MEX_RFC", description: t("MexicoRFC") },
		{ code: "NIC_RUC", description: t("NicaraguaRUC") },
		{ code: "NLD_TIN", description: t("NetherlandsTINNumber") },
		{ code: "PAN_RUC", description: t("PanamaRUC") },
		{ code: "PER_RUC", description: t("PeruRUC") },
		{ code: "PRY_RUC", description: t("ParaguayRUC") },
		{ code: "SGP_NRIC", description: t("SingaporeNRIC") },
		{ code: "SGP_FIN", description: t("SingaporeFIN") },
		{ code: "SGP_ASGD", description: t("SingaporeASGD") },
		{ code: "SGP_ITR", description: t("SingaporeITR") },
		{ code: "SLV_NIT", description: t("ElSalvadorNIT") },
		{ code: "SWE_TAX_ID", description: t("SwedenTaxIDPersonnummer") },
		{ code: "URY_RUT", description: t("UruguayRUT") },
		{ code: "VEN_RIF", description: t("VenezuelaRIF") },
		{ code: "NATIONAL_ID", description: t("NationalIDNumber") },
		{ code: "PASSPORT", description: t("PassportNumber") },
		{ code: "PERMANENT_RESIDENT", description: t("PermanentResidentNumber") },
		{ code: "DRIVER_LICENSE", description: t("DriversLicenseNumber") },
		{ code: "OTHER_GOV_ID", description: t("OtherGovernmentIssuedIdentifier") },
		{ code: "NOT_SPECIFIED", description: t("OtherTaxIDs") },
	  ];



  const [filteredDataTax_id_type, setfilteredDataTax_id_type] = useState(exchangeOrTax_id_typeOptions);
  
  // Search functionality
  const handleSearchTax_id_type = (text) => {
	setSearchTextTax_id_type(text); // Update search text state
	if (text === "") {
	  // Reset the filtered data when search is cleared
	  setfilteredDataTax_id_type(exchangeOrTax_id_typeOptions);
	} else {
	  // Filter the list based on search text
	  const newData = exchangeOrTax_id_typeOptions.filter((item) =>
		item.code.toLowerCase().includes(text.toLowerCase()) ||
      item.description.toLowerCase().includes(text.toLowerCase())
	  );
	  setfilteredDataTax_id_type(newData);
	}
  };








  

  
  const reverseVisibleEmploymentStatus = () => {
	setVisibleEmploymentStatus((vis) => !vis);
  };

  
	const reverseVisible = () => {
		setVisible((vis) => !vis);
	  };

	  const BirthreverseVisible = () => {
		setBirthVisible((vis) => !vis);
	  };
	
	  const reverseVisiblefundingsource = () => {
		setVisiblefundingsource((vis) => !vis);
	  };


	  const reverseVisibleLiquidityNeeds = () => {
		setVisibleLiquidityNeeds((vis) => !vis);
	  };

	  

	  const reverseVisibleInvestmentExperience = () => {
		setVisibleInvestmentExperience((vis) => !vis);
	  };

	  

	    

	  const reverseVisibleInvestmentExperienceOptions = () => {
		setVisibleInvestmentExperienceOptions((vis) => !vis);
	  };



	  const reverseVisibleRiskTolerance = () => {
		setVisibleRiskTolerance((vis) => !vis);
	  };





	  const reverseVisibleInvestmentObjective = () => {
		setVisibleInvestmentObjective((vis) => !vis);
	  };

	
	  
	  const reverseVisibleInvestmentTimeHorizon = () => {
		setVisibleInvestmentTimeHorizon((vis) => !vis);
	  };




	  const reverseVisibleMinimumAnnualIncome = () => {
		setVisibleMinimumAnnualIncome((vis) => !vis);
	  };


	  const reverseVisibleLiquidNetWorth = () => {
		setVisibleLiquidNetWorth((vis) => !vis);
	  };


	  

	  const reverseVisibleTotalNetWorth = () => {
		setVisibleTotalNetWorth((vis) => !vis);
	  };




	

	  const reverseVisibleControlPosition = () => {
		setVisibleControlPosition((vis) => !vis);
	  };



	  const reverseVisibleFINRAAffiliation = () => {
		setVisibleFINRAAffiliation((vis) => !vis);
	  };




	  const reverseVisiblePoliticallyExposed = () => {
		setVisiblePoliticallyExposed((vis) => !vis);
	  };







	  const reverseVisibleFamilyExposure = () => {
		setVisibleFamilyExposure((vis) => !vis);
	  };




	  const reverseVisibleTax_id_type = () => {
		setVisibleTax_id_type((vis) => !vis);
	  };




	  
	  

	const [initializing, setInitializing] = useState(true);

	  // If null, no SMS has been sent
	  const [confirm, setConfirm] = useState(null);

	  const [code, setCode] = useState();
	  const [token, setToken] = useState(null);
	  const [NewPasswordPin, setNewPasswordPin] = useState()

	  const [TokenFromDB, setTokenFromDB] = useState()
	  const [focusTriggered, setFocusTriggered] = useState(false);
	// Add state variables to track focus
	const [isOtpFocused, setIsOtpFocused] = useState(false);
	const [isPhoneFocused, setIsPhoneFocused] = useState(false);
	const [isTextFocused, setIsTextFocused] = useState(false);
	const [isNumberFocused, setisNumberFocused] = useState(false);

	const [OpenSearchAddress, setOpenSearchAddress] = useState(false)
	const [CurrentTypedInVerificationCode, setCurrentTypedInVerificationCode] = useState()

	const [street, setStreet] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [country, setCountry] = useState('');
	const [visible, setVisible] = useState(false);
	const [BirthVisible, setBirthVisible] = useState(false);

	const [Birthcity, setBirthcity] = useState('');
	const [Birthstate, setBirthstate] = useState('');
	const [Birthcountry, setBirthcountry] = useState('');
	const [Birthiso, setBirthiso] = useState('')
	const [OpenBirthSearchAddress, setOpenBirthSearchAddress] = useState('')
	const [CheckAcceptTermsAndConditions, setCheckAcceptTermsAndConditions] = useState(false);
	const [ChecAccountAgreement , setChecAccountAgreement ] = useState(false);
	const [ChechCustomerAgreementt , setChechCustomerAgreementt ] = useState(false);
	const [ChechCryptoAgreement , setChechCryptoAgreement ] = useState(false);
	const [ChechOptionsAgreement , setChechOptionsAgreement ] = useState(false);
	const [ChechCustodialCustomer , setChechCustodialCustomer ] = useState(false);
	const [CheckAcceptTermsAndConditionsOnfido, setCheckAcceptTermsAndConditionsOnfido] = useState(false);

	

	
	


	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [Postal_code, setPostal_code] = useState()

	const [iso, setIso] = useState('')

	const [UserIPAddress, setUserIPAddress] = useState()


	const [facing, setFacing] = useState('back'); // 'back' or 'front' camera
	const [permission, requestPermission] = useCameraPermissions();
	const [Iso3Country, setIso3Country] = useState()
	const [Investment_objective, setInvestment_objective] = useState()
	


	const [ShowNextButtonAfterBirthday, setShowNextButtonAfterBirthday] = useState('')
	const [Birthday, setBirthday] = useState('')
	const [DayBirthday, setDayBirthday] = useState('')
	const [MonthBirthday, setMonthBirthday] = useState('')
	const [YearBirthday, setYearBirthday] = useState('')

	  const [user, setUser] = useState();
	  const [showToast, setShowToast] = React.useState(false);
	  const [currentPage, setCurrentPage] = useState(0); // Track current page
	  const [currentPageLogIn, setcurrentPageLogIn] = useState(0); // Track current page

	  const translateX = useRef(new Animated.Value(0)).current; // Animation value


	  const translateXLogin = useRef(new Animated.Value(0)).current; // Animation value


	  

	  const [isEnabled, setIsEnabled] = useState(false);
	  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

	  const [isEnabledOtherCitizenships, setIsEnabledOtherCitizenships] = useState(false);
	  const toggleSwitchOtherCitizenships = () => setIsEnabledOtherCitizenships(previousState => !previousState);


	  const [istaxedIn, setIstaxedIn] = useState(false);
	  const toggleSwitchistaxedIn = () => setIstaxedIn(previousState => !previousState);

	  const [isEnabledNotaUsPerson, setIsEnabledNotaUsPerson] = useState(false);
	  const toggleSwitchNotaUsPerson = () => setIsEnabledNotaUsPerson(previousState => !previousState);

	  const [isEnabledAdditionalTaxResidencies, setIsEnabledAdditionalTaxResidencies] = useState(false);
	  const toggleSwitchAdditionalTaxResidencies = () => setIsEnabledAdditionalTaxResidencies(previousState => !previousState);




	  // Toggle Agreements


	  const toggleCheckAcceptTermsAndConditionsOnfido = () => {
		setCheckAcceptTermsAndConditionsOnfido(prevState => !prevState);
	  };

	  const toggleCheckAcceptTermsAndConditions = () => {
		setCheckAcceptTermsAndConditions(prevState => !prevState);
	  };

	  const toggleChecAccountAgreement = () => {
		setChecAccountAgreement(prevState => !prevState);
	  };


	  const toggleCustomerAgreement = () => {
		setChechCustomerAgreementt(prevState => !prevState);
	  };

	  const toggleCryptoAgreement = () => {
		setChechCryptoAgreement(prevState => !prevState);
	  };

	  const toggleOptionsAgreement = () => {
		setChechOptionsAgreement(prevState => !prevState);
	  };


	  
	  const toggleCustodialCustomer = () => {
		setChechCustodialCustomer(prevState => !prevState);
	  };

 
	  











	  





  	// Next Page Main Bottomsheet function
	  const slideToNextPage = () => {
		if (currentPage < slides.length - 1) {
		  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		  const nextPage = currentPage + 1;
		  setCurrentPage(nextPage); // update state first!
		  Animated.timing(translateX, {
			toValue: -nextPage * Dimensions.get("window").width,
			duration: 300,
			useNativeDriver: true,
		  }).start();
		}
	  };
	  
	  
	  const slideToPreviousPage = () => {
		if (currentPage > 0) {
		  const previousPage = currentPage - 1;
		  setCurrentPage(previousPage);
		  
		  Animated.timing(translateX, {
			toValue: -previousPage * Dimensions.get("window").width,
			duration: 300,
			useNativeDriver: true,
		  }).start();
		}
	  };
	  












	  // Get user Local Ip address

	  useEffect(()  => {


		NetworkInfo.getIPAddress().then(ipAddress => {
		
			setUserIPAddress(ipAddress)
		  })
		  console.log("Local IP Address:", UserIPAddress);


	  }, [])




	  
	


	
// Birthday

const dayRef = useRef(null);
const monthRef = useRef(null);
const yearRef = useRef(null);



const handleDayChange = (text) => {
    if (text.length === 2) {
      monthRef.current.focus(); // Move to next input (Month)
	  setDayBirthday(text)
    }
  };

  const handleMonthChange = (text) => {
    if (text.length === 2) {
      yearRef.current.focus(); // Move to next input (Year)
	  setMonthBirthday(text)
    }
  };

  const handleYearChange = (text) => {
    // Optionally handle year change or move focus elsewhere if needed
	setBirthday(dayRef+"."+monthRef+"."+yearRef)

	if (text.length === 4) {
	slideToNextPage()
	  }
	  setYearBirthday(text)
  };


// '1990-01-01'


  const extractBirthAddressComponents = (BirthaddressComponents) => {
	let city = '';
	let state = '';
	let country = '';
	let streetNumber = '';
	let iso = '';  // To store the ISO 2 code

	BirthaddressComponents.forEach((component) => {

		if (component.types.includes('locality')) {
		  city = component.long_name;
		}
		if (component.types.includes('administrative_area_level_1')) {
		  state = component.long_name;
		}
		if (component.types.includes('country')) {
		  country = component.long_name;
		}
		if (component.types.includes('country')) {
			country = component.long_name;
			// Get the ISO 2 code (usually available in 'short_name' property)
			iso = component.short_name;  // ISO 2 code (e.g., 'US', 'GB')
		  }
	  });
  
	//  const fullStreet = street + ' ' + streetNumber;
	//  setStreet(fullStreet.trim());
	setBirthcity(city);
	setBirthstate(state);
	setBirthcountry(country);
	setBirthiso(iso);  // Store ISO 2 code
	  // Close the modal by setting the openSearchAddress state to false
	 setOpenBirthSearchAddress(false); // Close the modal
	};



	



  
  
  
	// Function to extract address components
	const sanitizeStreetName = (streetName) => {
		return streetName
		  .replace(/[ü]/g, 'uer')    // Replace ü with uer
		  .replace(/[Ü]/g, 'Uer')    // Replace Ü with Uer
		  .replace(/[öÖ]/g, 'O')     // Replace Ö/ö with O/o
		  .replace(/[äÄ]/g, 'A')     // Replace Ä/ä with A/a
		  .replace(/[ß]/g, 'ss')     // Replace ß with ss
		  .replace(/[^\w\s,-]/g, ''); // Remove other special characters (dots, etc.)
	  };
	  
	  
	  const extractAddressComponents = (addressComponents) => {
		let street = '';
		let city = '';
		let state = '';
		let country = '';
		let streetNumber = '';
		let postalCode = '';
		let iso = '';  // To store the ISO 2 code
	    let iso3Country = ''; // To store the ISO 3 code



		const iso2ToIso3 = {
			'DE': 'DEU',  // Germany
			'US': 'USA',  // United States
			'GB': 'GBR',  // United Kingdom
			// Add more country mappings as needed
		  };

		addressComponents.forEach((component) => {
		  if (component.types.includes('route')) {
			street = component.long_name;
		  }
		  if (component.types.includes('street_number')) {
			streetNumber = component.long_name;
		  }
		  if (component.types.includes('locality')) {
			city = component.long_name;
		  }
		  if (component.types.includes('administrative_area_level_1')) {
			state = component.long_name;
		  }
		  if (component.types.includes('country')) {
			country = component.long_name;
			// Get the ISO 2 code (usually available in 'short_name' property)
			iso = component.short_name;  // ISO 2 code (e.g., 'US', 'GB')
		  }
		    // Extract postal code
			if (component.types.includes('postal_code')) {
			postalCode = component.long_name;
			

			   // If there's an ISO 2 code, map it to the ISO 3 code
			   iso3Country = iso2ToIso3[iso] || '';  // Map ISO 2 to ISO 3
			}
		});
	  
		// Sanitize the street name and combine it with the street number
		const fullStreet = sanitizeStreetName(street + ' ' + streetNumber).trim();
	  
		setStreet(fullStreet);
		setCity(city);
		setState(state);
		setCountry(country);
		setIso3Country(iso3Country); 
		setIso(iso);  // Store ISO 2 code
		setIso3Country(iso3Country);
		setPostal_code(postalCode); 
		setOpenSearchAddress(false); // Close the modal
	  };
	  
  
  




// Function to generate a six-digit number
const generateSixDigitNumber = () => Math.floor(100000 + Math.random() * 900000);

// Function to store token in Firebase Realtime Database
const storeTokenInFirebase = async (token) => {
  try {
    const database = getDatabase(); // Get the database instance
    const tokenPath = `/tokens/${CurrentCode}${code}/`; // Define the database path

    await set(ref(database, tokenPath), {
      token: token,
      createdAt: serverTimestamp(), // Use server timestamp
    });

    console.log("Token stored successfully in Firebase:", token);
  } catch (error) {
    console.error("Error storing token in Firebase:", error);
  }
};
  
  
  




	  


  
  






  // Location Verification

  useEffect(() => {
    async function getCurrentLocation() {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);





  const checkLocationPermission = async () => {
    // Check for current location permissions
    let { status } = await Location.getPermissionsAsync();
    
    if (status === 'granted') {
      setLocationPermission('Permission granted');
	 
    } else {
      setLocationPermission('Permission denied');
    }
  };







// Button function for storing Token
	  const handleGenerateToken = async () => {
		const database = getDatabase();

		  const newToken = generateSixDigitNumber();
		  setToken(newToken);
		  await storeTokenInFirebase(newToken);
		
		  try {
			const snapshot = await get(ref(database, `/tokens/${CurrentCode}${code}/`));
		
			if (snapshot.exists()) {
			  console.log('User data:', snapshot.val().token);
			  setTokenFromDB(snapshot.val().token);
			} else {
			  console.log('No token found.');
			}
		  } catch (error) {
			console.error('Error fetching token:', error);
		  }
		};
		
	  
	











	

  
	// ref
	const bottomSheetModalRefPhoneNumber = useRef(null);
  
	// callbacks
	const handlePresentModalPress = useCallback(() => {
	  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	  setisSheetOpenPhoneNumber(true);
	  bottomSheetModalRefPhoneNumber.current?.present();
	  setsheetIndexPhonenumber(1);
	  // Hide the keyboard when opening the Country Picker modal
	  Keyboard.dismiss();
	}, []);

	

	
	// ---- 6) Focus Phone Input when Main Sheet is Opened ----
	useEffect(() => {
	  if (sheetIndex === 1) { // Adjust based on your sheet index logic
		// Delay to ensure the modal is fully presented
		setTimeout(() => {
		  phoneInputRef.current?.focus();
		}, 500); // 500ms delay; adjust as needed
	  }
	}, [sheetIndex]);
  
	// ---- 7) Keyboard Event Handlers ----
	useEffect(() => {
	  const keyboardShowListener = Keyboard.addListener(
		Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
		() => {
		  setKeyboardVisible(true);
		}
	  );
	  const keyboardHideListener = Keyboard.addListener(
		Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
		() => {
		  setKeyboardVisible(false);
		}
	  );
  
	  // Cleanup listeners on unmount
	  return () => {
		keyboardShowListener.remove();
		keyboardHideListener.remove();
	  };
	}, []);
  
	// ---- 8) Backdrop for BottomSheet ----
	const renderBackdrop = useCallback(
	  (props) => (
		<BottomSheetBackdrop
		  {...props}
		  disappearsOnIndex={-1}
		  appearsOnIndex={1}
		  onPress={() => {
			// Close the BottomSheet when backdrop is pressed
			setSheetIndex(-1);
			setsheetIndexPhonenumber(-1)
		  }}
		/>
	  ),
	  []
	);





		// ---- 8) Backdrop for BottomSheet ----
		const renderBackdropLogIn = useCallback(
			(props) => (
			  <BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={1}
				onPress={() => {
				  // Close the BottomSheet when backdrop is pressed
				  setSheetIndexLogIn(-1);
				
				}}
			  />
			),
			[]
		  );

	


		  
	  
	  // 3. Define handleSearch without debounce for instant filtering
	  const handleSearch = (query) => {
		setSearchQuery(query);
	  };
	  





	  const handlePhoneNumberChange = useCallback((text) => {
		setPhoneNumberInput(text);
		console.log("Parent component re-rendered");

	  }, []);


  
	
	  
	// ---- 10) BottomSheet logic ----
	const handleOpenSheet = useCallback(() => {
	  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

	  SheetManager.show("SignUp_Sheet")
	 // setIsSheetOpen(true);

	 // sheetRef.current?.present();
	 // setSheetIndex(1);
	}, []);



	// ---- 10) BottomSheet logic ----
	const handleOpenSheetLogIn = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		setIsSheetOpenLogIn(true);
  
		SheetManager.show("LogIn_Sheet");
		//sheetRefLogIn.current?.present();
		//setSheetIndexLogIn(1);
	  }, []);
  

  
	// Handle changes for the main BottomSheetModal
	const handleSheetChange = useCallback((index) => {
	  console.log('handleSheetChanges (main modal)', index);
  
	  if (index !== -1) {
		// Modal is opened
		setSheetIndex(1);
		setCoinBottomSheet(false);
		setSheetIndexLogIn(false)
		// Focus the Phone Number TextInput to show the keyboard
		phoneInputRef.current?.focus();
	  } else {
		// Modal is closed
		setIsSheetOpen(false);
		setSheetIndex(-1);
		setCoinBottomSheet(false);
		setSheetIndexLogIn(false)
		// Optionally, dismiss the keyboard if desired
		// Keyboard.dismiss();
	  }
  
	  console.log('Sheet snapped to (main modal):', index);
	}, []);
  

		// Handle changes for the main BottomSheetModal
		const handleSheetChangeLogIn = useCallback((index) => {
			console.log('handleSheetChanges (LogIn modal)', index);
		
			if (index !== -1) {
				// Modal is opened
		setSheetIndexLogIn(1);
		setCoinBottomSheet(false);
	
		// Focus the Phone Number TextInput to show the keyboard
		phoneInputRefLogIn.current?.focus();
	  } else {
		// Modal is closed
		setIsSheetOpen(false);
		setSheetIndexLogIn(-1);
		setCoinBottomSheet(false);
	
		// Optionally, dismiss the keyboard if desired
		// Keyboard.dismiss();
	  }
		
			console.log('Sheet snapped to (LogIn modal):', index);
		  }, []);
		


	
	// Handle changes for the Country Picker BottomSheetModal
	const handleSheetChangePhonenUmber = useCallback((index) => {
	  console.log('handleSheetChanges (country picker modal)', index);
  
	  if (index !== -1) {
		// Country Picker modal is opened
		setsheetIndexPhonenumber(1);
		setisSheetOpenPhoneNumber(true);
		// Hide the keyboard
		Keyboard.dismiss();
	  } else {
		// Country Picker modal is closed
		setisSheetOpenPhoneNumber(false);
		setsheetIndexPhonenumber(-1);
		// Focus the Phone Number TextInput to show the keyboard
		phoneInputRef.current?.focus();
	  }
  
	  console.log('Sheet snapped to (country picker modal):', index);
	}, []);
  

	








	// Render item function
/*	const renderItem = useCallback(({ item }) => (
  <TouchableOpacity
    onPress={() => {
      console.log('Setting CurrentCode to:', item.code); // Debug log
      setCurrentCode(item.code); // Update state
	//  setIso3Code(item.alpha3Code)
      setsheetIndexPhonenumber(-1); // Close the sheet
      bottomSheetModalRefPhoneNumber.current?.close(); // Close modal
    }}
    style={{
      width: width(90),
      alignSelf: 'center',
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#0F1317',
      borderRadius: 10,
      marginVertical: 4,
    }}
    accessibilityLabel={`Select country ${item.name}`}
  >
    <View
      style={{
        height: 20,
        width: 20,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        backgroundColor: '#ccc',
      }}
    >
      <CountryFlag
        isoCode={item.iso2}
        style={{
          alignSelf: 'center',
          height: '100%',
          width: '100%',
        }}
      />
    </View>
    <View style={{ marginLeft: width(7) }}>
      <Text style={{ color: '#F8F9F9', fontWeight: 'bold', fontSize: size(14) }}>
        {item.name}
      </Text>
      <Text style={{ marginTop: 4, color: '#777', fontSize: size(12) }}>
        {item.code}
      </Text>
    </View>
  </TouchableOpacity>
), [setCurrentCode, setsheetIndexPhonenumber, bottomSheetModalRefPhoneNumber]);
*/









// Camera 



  // Toggle between front and back cameras
  const toggleCameraFacing = () => {
	setFacing(current => (current === 'back' ? 'front' : 'back'));
  };


  
  const handlePermissionRequest = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    requestPermission();  // Request camera permission when the button is pressed
	slideToNextPage()
  };
















	  const ToastMessage = ({ message, onClose }) => {
		const translateY = useRef(new Animated.Value(-height(20))).current;
	  
		// Slide-in animation
		const showToast = () => {
		  Animated.timing(translateY, {
			toValue: 0, // Slide down to visible
			duration: 500,
			easing: Easing.out(Easing.ease),
			useNativeDriver: true,
		  }).start(() => {
			// Hide toast after 5 seconds
			setTimeout(() => {
			  Animated.timing(translateY, {
				toValue: -height(20), // Slide back up
				duration: 500,
				easing: Easing.in(Easing.ease),
				useNativeDriver: true,
			  }).start(onClose); // Call onClose callback when animation completes
			}, 5000);
		  });
		};
	  
		React.useEffect(() => {
		  showToast();
		}, []);
	  
		return (
		  <Animated.View
			style={{
			  transform: [{ translateY }],
			  height: height(20),
			  width: "100%",
			  backgroundColor: "#FF006C",
			  position: 'absolute',
			  top: 0,
			  zIndex: 1000,
			}}
		  >
			<View
			  style={{
				marginTop: height(10),
				flexDirection: 'row',
				alignItems: 'center',
			  }}
			>
			  <MaterialIcons
				name="error"
				style={{
				  color: '#000',
				  fontSize: size(25),
				  marginLeft: width(10),
				}}
			  />
			  <Text
				style={{
				  fontSize: size(20),
				  width: "50%",
				  fontWeight: "bold",
				  marginLeft: width(5),
				}}
			  >
				{message}
			  </Text>
			</View>
		  </Animated.View>
		);
	  };







	  useEffect(() => {
		console.log("hello ", currentPageLogIn)
	  }, [])






	  


	  


		  
		  


		  useEffect(() => {
			const timeout = setTimeout(() => {
				if (currentPage === 1 && otpInputRef.current ) {
					console.log("Focusing OTP  test input");
	
						otpInputRef.current.focus();
				
				}


				else if (currentPageLogIn === 0 && phoneInputRefLogIn.current) {
					console.log("Focusing Email input");
					Keyboard.dismiss();
				  }  
				

				else if (currentPageLogIn === 1 && phoneInputRefLogIn.current) {
					console.log("Focusing Email input");
					Keyboard.dismiss();
				  }  
				

				/*else if (currentPage === 1  && isSheetOpenLogIn == true && currentPage === 1 && otpInputRef.current && phoneInputRefLogIn.current) {
					console.log("Focusing Email input");
					Keyboard.dismiss();
				  } 
				  */
				 
				  else if (currentPage === 2 && EmailInputRef.current) {
				console.log("Focusing Email input");
				EmailInputRef.current.focus();
			  }   else if (currentPage === 3 && otpInputRef3.current) {
				console.log("Focusing OTP input here");
				otpInputRef3.current.focus();
			  } else if (currentPage === 4 && otpInputRef4.current) {
				console.log("Focusing OTP input");
				otpInputRef4.current.focus();
			  } else if (currentPage === 5 && otpInputRef3.current) {
				console.log("Not Focusing OTP input");
				Keyboard.dismiss();
			  }else if (currentPage === 6 && FirstNameinputRef.current) {
				console.log("Not Focusing OTP input");
				FirstNameinputRef.current.focus();
			  }else if (currentPage === 7 && FirstNameinputRef.current) {
				console.log("Not Focusing OTP input");
				Keyboard.dismiss();
			  }else if (currentPage === 8 && dayRef.current) {
				console.log("Not Focusing OTP input");
				dayRef.current.focus();
			  }else if (currentPage === 9 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  }else if (currentPage === 10 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  } else if (currentPage === 11 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  } else if (currentPage === 12 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  }else if (currentPage === 13 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  }else if (currentPage === 14 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  } else if (currentPage === 15 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  } else if (currentPage === 16 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  } else if (currentPage === 17 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  } else if (currentPage === 18 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  }else if (currentPage === 19 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  }else if (currentPage === 20 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  }else if (currentPage === 21 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  }else if (currentPage === 22 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  }else if (currentPage === 23 && dayRef.current) {
				console.log("Focusing Text input");
				Keyboard.dismiss();
			  }else if (currentPage === 24 && dayRef.current) {
				console.log("Focusing Text input");
				otpInputRef.current.focus();
			  }
			
			
			}, 500); // Ensure enough delay for slide rendering
		  
			return () => clearTimeout(timeout);
		  }, [currentPage]);
		  

		  

		  
		  




		  useEffect(() => {
			if (EmailInputRef.current) {
			  console.log("EmailInputRef is attached:", EmailInputRef.current);
			} else {
			  console.log("EmailInputRef is NOT attached!");
			}
		  }, [EmailInputRef.current]);
		  





		  // animted Scroll heder for Just a few more questions

		  const scrollY = useRef(new Animated.Value(0)).current;

		  const HEADER_HEIGHT = 80; // Adjust as needed
		  const TITLE_SWITCH_POINT = 50; // Scroll position where title changes
		
		  const headerHeight = scrollY.interpolate({
			inputRange: [0, HEADER_HEIGHT],
			outputRange: [HEADER_HEIGHT, 50],
			extrapolate: "clamp",
		  });
		
		  const titleOpacity = scrollY.interpolate({
			inputRange: [0, TITLE_SWITCH_POINT],
			outputRange: [1, 0],
			extrapolate: "clamp",
		  });
		
		  const newTitleOpacity = scrollY.interpolate({
			inputRange: [TITLE_SWITCH_POINT, TITLE_SWITCH_POINT + 30],
			outputRange: [0, 1],
			extrapolate: "clamp",
		  });
		

		  






// Use the useEffect to dismiss the keyboard when the second slide is active
useEffect(() => {
	if (currentPageLogIn === 1) {
	  Keyboard.dismiss(); // Dismiss keyboard when second slide (id: 2) is active
	}
  }, [currentPageLogIn]);
  

  











		  


	  const slides = useMemo(
		() => [
		{
		  id: 1,
		  content: (
			<View style={{ width: width(100), padding: 16 }}>




			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(10),
				marginTop: height(5),
				fontWeight: 'bold',
				width: width(60),
			  }}
			>
		  		 {t("HeyPhoneNumberTextLogIn")}
			</Text>
			<View
			  style={{
				flexDirection: 'row',
				height: 100,
				alignItems: 'center',
				marginLeft: width(7),
				top: height(2),
			  }}
			>




			  <TouchableOpacity
				onPress={() => {
					SheetManager.show("Country_Sheet")
				}}
				style={{
				  paddingVertical: 14,
				  alignSelf: 'center',
				  paddingHorizontal: 20,
				}}
			  >
				<View style={{ flexDirection: 'row' }}>
				{true && (
					<Text
						style={{
						color: "#666",
						fontSize: 20,
						fontWeight: 'bold',
						}}
					>
						{CurrentCode == null ? "+00" : CurrentCode}
					</Text>
					)}

				  <MaterialIcons
					name="keyboard-arrow-down"
					style={{ color:"#666", fontSize: size(25) }}
				  />
				</View>
			  </TouchableOpacity>
	

	
		

			  <TextInput
			 onFocus={() => setisNumberFocused(true)} // Set phone input focused
			 onBlur={() => setisNumberFocused(false)} // Reset phone input focus
				//value={code}
				onChangeText={(text) => {
					// Remove spaces and non-numeric characters
					const sanitizedText = text.replace(/[^0-9]/g, '');
					setCode(sanitizedText);
				  }}
				ref={phoneInputRef}
				placeholder="1522 81034575"
				placeholderTextColor="#666"
				keyboardType="phone-pad"
				style={{
				  marginLeft: -20,
				  fontSize: 20,
				  fontWeight: 'bold',
				  paddingVertical: 14,
				  color: CurrentViewMode.Mode_fontColor,
				  alignSelf: 'center',
				  paddingHorizontal: 20,
				}}
			  />
			</View>
	
			<KeyboardAvoidingView
			  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			  style={{
				flex: 1,
			  }}
			>
			  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View
				  style={{
					width: '100%',
					marginBottom: height(-24),
					marginLeft: width(55),
					flex: 1,
					justifyContent: 'flex-end',
				  }}
				>


				</View>
			  </TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		  </View>
		 ),
		},



		{
		  id: 2,
		  content: (
			<View style={{ width: width(100), padding: 16 }}>

			<View
				  style={{
					width: '100%',
				
		
				  }}
				>
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(5),
				fontWeight: 'bold',
				width: width(60),
			  }}
			>
			 {t("VerifyYourPhoneNumberSignUp")} 
			</Text>




		 	<OtpInput 
			onFocus={() => setisNumberFocused(true)} // Set OTP input focused
			onBlur={() => setisNumberFocused(false)} // Reset OTP input focus
			ref={otpInputRef}
			numberOfDigits={6}
			focusColor="#000"
			autoFocus={true}
			hideStick={true}
			placeholder=""
			blurOnFilled={false}
			disabled={false}
			type="numeric"
			secureTextEntry={false}
			focusStickBlinkingDuration={500}
			
			onTextChange={(text) => {

				const database = getDatabase();

				console.log(text)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)

			/*	const fetchToken = async () => {
					try {
					  const snapshot = await get(ref(getDatabase(), `/tokens/${CurrentCode}${code}/`));
				  
					  if (snapshot.exists()) {
						console.log('User data:', snapshot.val().token);
						setTokenFromDB(snapshot.val().token);
					  } else {
						console.log('No token found.');
					  }
					} catch (error) {
					  console.error('Error fetching token:', error);
					}
				  };
				  
				  // Call this function wherever you need to fetch the token
				  fetchToken(); */
			}}
			onFilled={async (text) => {

				// 853321
				setCurrentTypedInVerificationCode(text)
				/*if(text == TokenFromDB) {
					console.log(`OTP is is corret`) 
					slideToNextPage(); 
				} */
				
					await axios.post('https://verifyauthcode-jcraafcjna-uc.a.run.app', {
						phoneNumber: '+49015218103719',
						code: text,
					  }).then((res) => {
						console.log(res.data)
						if(res.data.success) {
							slideToNextPage()
						} else {

						}
					  }).catch((err) => {
						console.log(err)
					  })
					  
			
			}}
			textInputProps={{
				accessibilityLabel: "One-Time Password",
			}}
			theme={{
				containerStyle: {
					marginTop: height(5),
					width: width(75),
					alignSelf: 'center',
				},
				pinCodeContainerStyle: {
					//backgroundColor: 'yellow',
				borderWidth: 1,
				borderColor: '#0C1014',
				height: height(5),
				width: height(5),
				//backgroundColor: "#15171C",
				borderRadius: height(5)/2,

				},
				pinCodeTextStyle: {
					color: CurrentViewMode.Mode_fontColor,
				},
				focusStickStyle: styles.focusStick,
				focusedPinCodeContainerStyle: styles.activePinCodeContainer,
				placeholderTextStyle: {
					color: CurrentViewMode.Mode_Third_fontColor,
				},
				filledPinCodeContainerStyle: {
				//backgroundColor: 'yellow',
				borderWidth: 1,
				borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
				//	backgroundColor: "#282828",
					height: height(5),
					width: height(5),
					borderRadius: height(5)/2,
				},
			
			}}
			
			/>



		


			<TouchableOpacity onPress={async () => {
					await axios.post("https://sendauthcode-jcraafcjna-uc.a.run.app", {
			
					}).then((res) => {
		
						console.log(res)
						
					}).catch((err) => {
						console.log(err)
					})
			}}
			style={{
				alignSelf: 'center',
			
				marginTop: height(5),
				flexDirection: 'row',
				alignItems: 'center',
			
		
			}}> 

			
			<Text numberOfLines={1} style={{
				fontSize: size(13),
				color: "#6F7074",

				
			}}>
			 {t("DidntGetTheCodeRequestAgainSignUp")} 
			</Text>

			<MaterialIcons name="arrow-forward-ios" style={{
				color: "#6F7074",
				
			}} />


			</TouchableOpacity>
		
			</View>
		  </View>
	     ),
    },



	{
		id: 3,
		content: (
		  <View style={{ width: width(100), padding: 16 }}>

			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(6),
				marginTop: height(5),
				fontWeight: 'bold',
				width: width(60),
			  }}
			>
			  {t("YourEmailAddressSignUpText")} 
			</Text>


			<Text
			  style={{
				fontSize: size(14),
				color: CurrentViewMode.Mode_Third_fontColor,
				marginLeft: width(6),
				marginTop: height(2),
				fontWeight: 'bold',
				width: width(60),
			  }}>
			 {t("YourEmailAddressSignUpText2")}  
			</Text>




			<TextInput 
			 onFocus={() => {
				console.log("Email Input Focused");
				setIsTextFocused(true);
			  }}
			 onBlur={() => {
				console.log("Email Input Blurred");
				setIsTextFocused(false);
			  }}
			  ref={EmailInputRef} 
			placeholder={t("YourEmailAddressSignUpText")}
			keyboardType="email-address"
			autoCapitalize="none"
			placeholderTextColor={CurrentViewMode.Mode_fontColor}
			onChangeText={(text) => {
				// Remove any spaces and restrict invalid email characters
				const sanitizedText = text.replace(/[^a-zA-Z0-9@._-]/g, "");
				setEmail(sanitizedText); // Update email state
			  }}
			style={{
				paddingVertical: 12,
				paddingHorizontal: 20,
				width: "90%",
				fontSize: size(18),
				color: CurrentViewMode.Mode_fontColor,
				borderRadius: 10,
				alignSelf: 'center',
				top: height(6.5),
				borderWidth: 1,
				borderColor: CurrentViewMode.Mode_ButtonBgColor_Search,
			}} />


		</View>
	   ),
	  },





	{
		id: 4,
		content: (
			<View style={{ width: "100%", height: "100%"}}>

			<View
				  style={{
					width: '100%',
				
		
				  }}
				>
			<Text
			  style={{
				color:  CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(9),
				marginTop: height(5),
				fontWeight: 'bold',
				width: width(60),
			  }}
			>
			 {t("SetAPINSignUpText")}  
			</Text>

			<Text
			  style={{
				fontSize: size(14),
				color: CurrentViewMode.Mode_Third_fontColor,
				marginLeft: width(9),
				marginTop: height(2),
				fontWeight: 'bold',
				width: width(60),
			  }}>
			 {t("SetAPINSignUpText2")}  
		
			</Text>




			<View style={{ flexDirection: 'row', position: 'absolute', marginTop: height(18), alignSelf: 'center', alignItems: 'center' }}>
			


			<OtpInput
			ref={otpInputRef3}
			numberOfDigits={4}
			focusColor={CurrentViewMode.Mode_fontColor}
			autoFocus={true}
			hideStick={true}
			placeholder=""
			blurOnFilled={false}
			disabled={false}
			type="numeric"
			secureTextEntry={false}
			focusStickBlinkingDuration={500}
			onFocus={() => setisNumberFocused(true)} // Set OTP input focused
  			onBlur={() => setisNumberFocused(false)} // Reset OTP input focus
			onTextChange={(text) => {
				console.log(text)
				//Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)

			}}
			onFilled={(text) => {

				setNewPasswordPin(text)
				slideToNextPage()
				
			
			}}
			textInputProps={{
				accessibilityLabel: "One-Time Password",
			}}
			theme={{
				containerStyle: {
					marginTop: height(5),
					width: width(75),
					alignSelf: 'center',
				},
				pinCodeContainerStyle: {
					//backgroundColor: 'yellow',
				borderWidth: 1,
				borderColor: CurrentViewMode.Mode_Third_fontColor,
				height: height(5),
				width: height(5),
				//backgroundColor: "#15171C",
				borderRadius: height(5)/2,

				},
				pinCodeTextStyle: {
					color: CurrentViewMode.Mode_fontColor,
				},
				focusStickStyle: styles.focusStick,
				focusedPinCodeContainerStyle: styles.activePinCodeContainer,
				placeholderTextStyle: {
					color: CurrentViewMode.Mode_Third_fontColor,
				},
				filledPinCodeContainerStyle: {
				//backgroundColor: 'yellow',
				borderWidth: 1,
				borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
				//	backgroundColor: "#282828",
					height: height(5),
					width: height(5),
					borderRadius: height(5)/2,
				},
			
			}}
			
			/>


		</View>

		</View>
		</View>
	   ),
	  },



	  {
		id: 5,
		content: (
			<View style={{ width: width(100), padding: 16 }}>

			<View
				  style={{
					width: '100%',
				
		
				  }}
				>
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(5),
				fontWeight: 'bold',
				width: width(60),
			  }}
			>
			 {t("ConfirmYourPINSignUpText")}   
			</Text>

			<Text
			  style={{
				fontSize: size(14),
				color :CurrentViewMode.Mode_Sec_fontColor,
				marginLeft: width(5),
				marginTop: height(2),
				fontWeight: 'bold',
				width: width(60),
			  }}>

			{t("ConfirmYourPINSignUpText2")}   
		
			</Text>




			<View style={{ flexDirection: 'row', position: 'absolute', marginTop: height(17), alignSelf: 'center', alignItems: 'center' }}>
			


			<OtpInput
			ref={otpInputRef4}
			numberOfDigits={4}
			focusColor={CurrentViewMode.Mode_Sec_fontColor}
			autoFocus={true}
			hideStick={true}
			placeholder=""
			blurOnFilled={false}
			disabled={false}
			type="numeric"
			secureTextEntry={false}
			focusStickBlinkingDuration={500}
			onFocus={() => setisNumberFocused(true)}
			onBlur={() => setisNumberFocused(false)}
			onTextChange={(text) => {
				console.log(text)
				
			}}
			onFilled={(text) => {

				// 853321

				setTypedInPinConfirmation(text)

				if(text == NewPasswordPin) {
					console.log(`Pin is is corret`) 
					 slideToNextPage(); 
				}
				


				
			
			}}
			textInputProps={{
				accessibilityLabel: "One-Time Password",
			}}
			theme={{
				containerStyle: {
					marginTop: height(5),
					width: width(75),
					alignSelf: 'center',
				},
				pinCodeContainerStyle: {
					//backgroundColor: 'yellow',
				borderWidth: 1,
				borderColor: CurrentViewMode.Mode_Third_fontColor,
				height: height(5),
				width: height(5),
				//backgroundColor: "#15171C",
				borderRadius: height(5)/2,

				},
				pinCodeTextStyle: {
					color: CurrentViewMode.Mode_fontColor,
				},
				focusStickStyle: styles.focusStick,
				focusedPinCodeContainerStyle: styles.activePinCodeContainer,
				placeholderTextStyle: {
					color: CurrentViewMode.Mode_Third_fontColor,
				},
				filledPinCodeContainerStyle: {
				//backgroundColor: 'yellow',
				borderWidth: 1,
				borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
				//	backgroundColor: "#282828",
					height: height(5),
					width: height(5),
					borderRadius: height(5)/2,
				},
			
			}}
			
			/>


		</View>

		</View>

		
		</View>
	   ),
	  },






	  {
		id: 6,
		content: (
			<View style={{ width: width(100), padding: 16 }}>

			<View
				  style={{
					width: '100%',
				
		
				  }}>
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(5),
				fontWeight: 'bold',
				width:"90%",
			  }}
			>

			{t("AccountSuccessfullyCreated1")}
		
			</Text>

			<Text
			  style={{
				fontSize: size(14),
				color: CurrentViewMode.Mode_Sec_fontColor,
				marginLeft: width(5),
				marginTop: height(2),
				fontWeight: 'bold',
				width:"90%",
			  }}>
			{t("AccountSuccessfullyCreated2")}
		
			</Text>




		 {/* Steps Container */}
			<View style={{ height: height(40), marginTop: height(5), marginLeft: width(-9), width: "90%", }}>
				

			{
				currentLanguage == "en"
					
				?
				
				<Image source={require("../../assets/Account_creation_Progess_3_WhiteSlide13.png")}
				style={{
					height: "100%",
					width: "100%",
					resizeMode: "contain"
				}} /> 
				
				:

				null
				}



				{
				currentLanguage == "de"
					
				?
				
				<Image source={require("../../assets/Account_creation_Progess_3_White_germanSlide13.png")}
				style={{
					height: "100%",
					width: "100%",
					resizeMode: "contain"
				}} /> 
				
				:

				null
				}


				{
				currentLanguage == "fr"
					
				?
				
				<Image source={require("../../assets/Account_creation_Progess_3_White_frenchSlide13.png")}
				style={{
					height: "100%",
					width: "100%",
					resizeMode: "contain"
				}} /> 
				
				:

				null
				}

			 
				
				</View>





			</View>


			<TouchableOpacity onPress={() => {
					console.log("Hello")
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
					slideToNextPage()
				}}
			
				style={{
					paddingVertical: 12,
					paddingHorizontal: 20,
					width: width(65),
					right: width(5),
					position: 'absolute',
					borderRadius: 10,
					marginTop: height(78),
					backgroundColor: CurrentViewMode.Mode_fontColor,
				}}>
					<Text style={{
						fontSize: size(18),
						alignSelf: 'center',
						fontWeight: "bold",
						color: CurrentViewMode.Mode_bg,
					}}>
				   	 {t("ContinueButtonText")}	
					</Text>
				</TouchableOpacity>

			<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

			}}
		
			style={{
				height: size(48),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor:  CurrentViewMode.Mode_fontColor,
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<MaterialIcons name='arrow-back' style={{
					color: CurrentViewMode.Mode_bg,
					fontSize: size(25)

				}} />
			</TouchableOpacity>
				
		</View>
	   ),
	  },





















	  {
		id: 7,
		content: (
			<View style={{ width: width(100), padding: 16 }}>

			<View
				  style={{
					width: '100%',
				
		
				  }}>
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(5),
				fontWeight: 'bold',
				width:"90%",
			  }}
			>
			 {t("OkayLetsStartText1")} 
			</Text>
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(1),
				fontWeight: 'bold',
				width:"90%",
			  }}
			>
		    {t("OkayLetsStartText2")}  	
			</Text>

			<Text
			  style={{
				fontSize: size(14),
				color: CurrentViewMode.Mode_Sec_fontColor,
				marginLeft: width(5),
				marginTop: height(2),
				fontWeight: 'bold',
				width:"90%",
			  }}>
			   {t("OkayLetsStartText3")}  
			</Text>




		
		

			<TextInput 
			 onFocus={() => {
				console.log("First Name Input Focused");
				setIsTextFocused(true);
			  }}
			 onBlur={() => {
				console.log("First Name Input Blurred");
				setIsTextFocused(false);
			  }}
			  ref={FirstNameinputRef} 
			placeholder={t("LegalFirstNameText")}
			keyboardType="default"
			placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
			onChangeText={(text) => {
				// Remove any spaces and restrict invalid email characters
				const sanitizedText = text.replace(/[^a-zA-Z0-9@._-]/g, "");
				setFirstName(sanitizedText); // Update email state
			  }}
			//  value={FirstName} 
			style={{
				paddingVertical: 12,
				paddingHorizontal: 20,
				width: "90%",
				fontSize: size(18),
				color: CurrentViewMode.Mode_fontColor,
				borderRadius: 10,
				alignSelf: 'center',
				marginTop: height(3),
				borderWidth: 1,
				borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
			}} />


		  <TextInput 
			 onFocus={() => {
				console.log("Email Input Focused");
				setIsTextFocused(true);
			  }}
			 onBlur={() => {
				console.log("Email Input Blurred");
				setIsTextFocused(false);
			  }}
			  ref={NameinputRef} 
			placeholder={t("LegalLastNameText")} 
			keyboardType="default"
			placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
			onChangeText={(text) => {
				// Remove any spaces and restrict invalid email characters
				const sanitizedText = text.replace(/[^a-zA-Z0-9@._-]/g, "");
				setLastName(sanitizedText); // Update email state
			  }}
			//  value={LastName} 
			style={{
				paddingVertical: 12,
				paddingHorizontal: 20,
				width: "90%",
				fontSize: size(18),
				color: CurrentViewMode.Mode_fontColor,
				borderRadius: 10,
				alignSelf: 'center',
				marginTop: height(2),
				borderWidth: 1,
				borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
			}} />





		</View>
		</View>
	   ),
	  },




















	  {
		id: 8,
		content: (
			<View style={{ width: width(100), padding: 16 }}>

			<View
				  style={{
					width: '100%',
				
		
				  }}>
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(5),
				fontWeight: 'bold',
				width:"90%",
			  }}
			>
			 {t("WhereAreYouOfficiallyRegristeredText1")} 
			</Text>
			
			<Text
			  style={{
				fontSize: size(14),
				color: CurrentViewMode.Mode_Sec_fontColor,
				marginLeft: width(5),
				marginTop: height(2),
				fontWeight: 'bold',
				width:"90%",
			  }}>
			  {t("WhereAreYouOfficiallyRegristeredText2")}  
			</Text>


		</View>

		<View style={{
				marginTop: height(5),
			}}> 

			  <TouchableOpacity onPress={() => {
				  reverseVisible()
			  }}
			  style={{
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				paddingVertical: 12,
		
				paddingHorizontal: 20,
			
				width: "90%",
				zIndex: 100,
				alignSelf: 'center',
				borderWidth: 1,
				borderRadius: 10,
				borderColor:  CurrentViewMode.Mode_ButtonColor_Profile,
			  }}>
				<Text style={{
					color: street == '' ? CurrentViewMode.Mode_Third_fontColor : CurrentViewMode.Mode_fontColor,
					fontSize: size(18),
				}}>
			  	 {street == '' ? t("EnterYourAddress") : street}
				</Text>
			  </TouchableOpacity>

	

			  {
				city == ''

				?
				null
				:

			 <View 
			  style={{
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				paddingVertical: 12,
				marginTop: height(1),
				paddingHorizontal: 20,
				
				width: "90%",
				alignSelf: 'center',
				borderWidth: 1,
				borderRadius: 10,
				borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
			  }}>
				<Text style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(18),
				}}>
			  	 {city}
				</Text>
			  </View>

			}

			  {
				state == ''

				?
				null
				:

			  <View 
			  style={{
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				paddingVertical: 12,
				marginTop: height(1),
				paddingHorizontal: 20,
				
				width: "90%",
				alignSelf: 'center',
				borderWidth: 1,
				borderRadius: 10,
				borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
			  }}>
				<Text style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(18),
				}}>
			  	 {state}
				</Text>
			  </View>


			}



{
				country == ''

				?
				null
				:
			  <View 
			  style={{
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				paddingVertical: 12,
				marginTop: height(1),
				paddingHorizontal: 20,
			
				width: "90%",
				alignSelf: 'center',
				borderWidth: 1,
				borderRadius: 10,
				borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
				flexDirection: 'row',
				alignItems: 'center',
			  }}>

				
			
				<View style={{
					height: height(2.2),
					width: height(2.2),
					borderRadius: height(2.2)/2,
					overflow: 'hidden',
					backgroundColor: CurrentViewMode.Mode_ButtonBgColor_Search,
					marginRight: width(4),

				}}> 
			 <CountryFlag
				isoCode={iso}
				style={{
				alignSelf: 'center',
				height: '100%',
				width: '100%',
				}}
			/>	</View> 
			
			

				<Text style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(18),
				}}>
				{country}
				</Text>
			  </View>
			}


			
				</View>

			
			

			

				


				<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={visible}
				>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisible} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(2),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(25),
					marginLeft: width(5),
					marginTop: height(1),
					fontWeight: 'bold',
					width:"90%",
				}}
				>
				 {t("WhereAreYouOfficiallyRegistered")} 
				</Text>
				
	
	
				<GooglePlacesAutocomplete
				placeholder={t("SearchBtnText")}
				placeholderTextColor={t(CurrentViewMode.Mode_Third_fontColor)}
				enablePoweredByContainer={false}
				fetchDetails={true}
				
				onPress={(data, details = null) => {
					console.log('Place Data:', data);
					console.log('Place Details:', details);
					if (details) {
					// Extract and store address components
					extractAddressComponents(details.address_components);
					reverseVisible()
					}
				}}
				query={{
					key: EXPO_GOOGLE_MAP_API_KEY,
					language: currentLanguage,
				}}
				GooglePlacesDetailsQuery={{
					fields: ['formatted_address', 'geometry'],
				}}
				onFail={(error) => console.error('Google Places Error:', error)}
				textInputProps={{
					placeholderTextColor: CurrentViewMode.Mode_Third_fontColor,
					clearButtonMode: 'while-editing',
				}}
				styles={{
					container: {
					flex: 1,
					width: '90%',
					marginTop: 20,
					alignSelf: 'center',
					},
					textInputContainer: {
					borderRadius: 5,
					backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
					paddingHorizontal: 10,
					marginTop: 20,
					},
					textInput: {
					height: 45,
					fontSize: 18,
					color: CurrentViewMode.Mode_fontColor,
					backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
					},
					listView: {
					backgroundColor: CurrentViewMode.Mode_bg,
					zIndex: 100,
					marginTop: 10,
					},
					row: {
					backgroundColor: CurrentViewMode.Mode_bg,
					paddingVertical: 12,
					paddingHorizontal: 20,
					borderBottomColor: CurrentViewMode.Mode_ButtonColor_Profile,
					borderBottomWidth: 1,
					},
					description: {
					color: CurrentViewMode.Mode_fontColor,
					fontSize: 18,
					},
					separator: {
					height: 0.5,
					backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
					},
					poweredContainer: {
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
					},
					powered: {
					tintColor: CurrentViewMode.Mode_fontColor,
					},
				}}
				/>
		</View>
			  </Modal>




			  {
				street == ''

				?

				<TouchableOpacity onPress={() => {
					 setShowToast(true)
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
					
				}}
			
				style={{
					paddingVertical: 12,
					paddingHorizontal: 20,
					width: width(65),
					right: width(5),
					position: 'absolute',
					borderRadius: 10,
					marginTop: height(78),
					backgroundColor: CurrentViewMode.Mode_fontColor,
					opacity: street == '' ? 0.4 : 9,
				}}>
					<Text style={{
						fontSize: size(18),
						color: CurrentViewMode.Mode_bg,
						alignSelf: 'center',
						fontWeight: "bold",
					}}>
				   	{t("ContinueButtonText")}
					</Text>
				</TouchableOpacity>


					:


					<TouchableOpacity onPress={() => {
						
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
						slideToNextPage()
					}}
				
					style={{
						
						paddingVertical: 12,
						paddingHorizontal: 20,
						width: width(65),
						right: width(5),
						position: 'absolute',
						borderRadius: 10,
						marginTop: height(78),
						backgroundColor: CurrentViewMode.Mode_fontColor,
					}}>
						<Text style={{
							color: CurrentViewMode.Mode_bg,
							fontSize: size(18),
							alignSelf: 'center',
							fontWeight: "bold",
						}}>
							{t("ContinueButtonText")}
						</Text>
					</TouchableOpacity>


			  }


			

		

				<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

				
			}}
		
			style={{
				height: size(48),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor: CurrentViewMode.Mode_fontColor,
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<MaterialIcons name='arrow-back' style={{
					color: CurrentViewMode.Mode_bg,
					fontSize: size(25)

				}} />
			</TouchableOpacity>
		</View>
	   ),
	  },









	  {
		id: 9,
		content: (
			<View style={{ width: width(100), padding: 16 }}>

			<View
				  style={{
					width: '100%',
				
		
				  }}>
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(5),
				fontWeight: 'bold',
				width:"90%",
			  }}
			>
			 {t("WhenIsYourBirthday1")}
			</Text>
			
			<Text
			  style={{
				fontSize: size(14),
				color: CurrentViewMode.Mode_Sec_fontColor,
				marginLeft: width(5),
				marginTop: height(2),
				fontWeight: 'bold',
				width:"90%",
			  }}>
			 {t("WhenIsYourBirthday2")} 
			{currentPage}

			</Text>




		</View>

	



			
		<View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: height(10), justifyContent: 'space-between' }}>
      <TextInput
        ref={dayRef}
        style={{ width: 50, fontSize: size(18), color: CurrentViewMode.Mode_fontColor, borderBottomWidth: 1, borderColor: CurrentViewMode.Mode_ButtonColor_Profile, marginRight: width(5), }}
        keyboardType="numeric"
        maxLength={2}
        placeholder={t("DDText")}
		placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
        onChangeText={handleDayChange}
		onFocus={() => {
			console.log("Email Input Focused");
			setisNumberFocused(true);
		  }}
		 onBlur={() => {
			console.log("Email Input Blurred");
			setisNumberFocused(false);
		  }}
      />
      <TextInput
        ref={monthRef}
        style={{ width: 50, borderBottomWidth: 1, color: CurrentViewMode.Mode_fontColor, fontSize: size(18), borderColor:  CurrentViewMode.Mode_ButtonColor_Profile,  marginRight:  width(5),}}
        keyboardType="numeric"
        maxLength={2}
        placeholder={t("MMText")}
		placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
        onChangeText={handleMonthChange}
		onFocus={() => {
			console.log("Email Input Focused");
			setisNumberFocused(true);
		  }}
		 onBlur={() => {
			console.log("Email Input Blurred");
			setisNumberFocused(false);
		  }}
      />
      <TextInput
        ref={yearRef}
        style={{ width: 100, color: CurrentViewMode.Mode_fontColor, borderBottomWidth: 1, fontSize: size(18), borderColor: CurrentViewMode.Mode_ButtonColor_Profile,}}
        keyboardType="numeric"
        maxLength={4}
        placeholder={t("YYYYText")}
		placeholderTextColor={CurrentViewMode.Mode_Sec_fontColor}
        onChangeText={handleYearChange}
		onFocus={() => {
			console.log("Email Input Focused");
			setisNumberFocused(true);
		  }}
		 onBlur={() => {
			console.log("Email Input Blurred");
			setisNumberFocused(false);
		  }}
      />
    </View>

		
	{
	/*

			const [ShowNextButtonAfterBirthday, setShowNextButtonAfterBirthday] = useState('')
			const [Birthday, setBirthday] = useState('')
		

	*/
}



	{/*
		ShowNextButtonAfterBirthday == null

		?
		null

		:

		<TouchableOpacity onPress={() => {
						
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
			//slideToNextPage()
			console.log(currentPage)
		}}
	
		style={{
			paddingVertical: 12,
			paddingHorizontal: 20,
			width: "90%",
			alignSelf: 'center',
			position: 'absolute',
			borderRadius: 10,
			marginTop: height(78),
			backgroundColor: '#fff',
		}}>
			<Text style={{
				fontSize: size(18),
				alignSelf: 'center',
				fontWeight: "bold",
			}}>
				   Continue
			</Text>
		</TouchableOpacity>


	*/}






	</View>
			

	   ),
	  },

















	  {
		id: 10,
		content: (
			<View style={{ width: width(100), padding: 16 }}>

			<View
				  style={{
					width: '100%',
				
		
				  }}>
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(5),
				fontWeight: 'bold',
				width:"90%",
			  }}
			>
		 {t("WhereWereYouBorn")}	
			</Text>
			
			<Text
			  style={{
				fontSize: size(14),
				color: CurrentViewMode.Mode_Sec_fontColor,
				marginLeft: width(5),
				marginTop: height(2),
				fontWeight: 'bold',
				width:"90%",
			  }}>
			 {t("WhereWereYouBorn2")}	 
			</Text>


		</View>

		<View style={{
				marginTop: height(5),
			}}> 

		
		
			 <TouchableOpacity onPress={() => {
				BirthreverseVisible()
			 }}
			  style={{
				backgroundColor:  CurrentViewMode.Mode_ButtonColor_Profile,
				paddingVertical: 12,
				marginTop: height(1),
				paddingHorizontal: 20,
				
				width: "90%",
				alignSelf: 'center',
				borderWidth: 1,
				borderRadius: 10,
				borderColor:  CurrentViewMode.Mode_ButtonColor_Profile,
			  }}>
				<Text style={{
					color: Birthcity == "" ?  CurrentViewMode.Mode_fontColor :  CurrentViewMode.Mode_fontColor,
					fontSize: size(18),
				}}>
			  	 {Birthcity == "" ? "Berlin, Germany" : Birthcity}
				</Text>
			  </TouchableOpacity>

			
			




			  {
				Birthstate == ''

				?
				null
				:

			  <View 
			  style={{
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				paddingVertical: 12,
				marginTop: height(1),
				paddingHorizontal: 20,
				
				width: "90%",
				alignSelf: 'center',
				borderWidth: 1,
				borderRadius: 10,
				borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
			  }}>
				<Text style={{
					color:  CurrentViewMode.Mode_fontColor,
					fontSize: size(18),
				}}>
			  	 {Birthstate}
				</Text>
			  </View>


			}



{
				Birthcountry == ''

				?
				null
				:
			  <View 
			  style={{
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				paddingVertical: 12,
				marginTop: height(1),
				paddingHorizontal: 20,
			
				width: "90%",
				alignSelf: 'center',
				borderWidth: 1,
				borderRadius: 10,
				borderColor:  CurrentViewMode.Mode_ButtonColor_Profile,
				flexDirection: 'row',
				alignItems: 'center',
			  }}>

				
			
				<View style={{
					height: height(2.2),
					width: height(2.2),
					borderRadius: height(2.2)/2,
					overflow: 'hidden',
					backgroundColor: CurrentViewMode.Mode_Third_fontColor,
					marginRight: width(4),

				}}> 
			 <CountryFlag
				isoCode={iso}
				style={{
				alignSelf: 'center',
				height: '100%',
				width: '100%',
				}}
			/>	</View> 
			
			

				<Text style={{
					
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(18),
				}}>
				{Birthcountry}
				</Text>
			  </View>
			}


			
				</View>

			
			

			

			

				<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={BirthVisible}
				>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

			<TouchableOpacity onPress={() => {
				BirthreverseVisible()
			}} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(2),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color:  CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(25),
					marginLeft: width(5),
					marginTop: height(1),
					fontWeight: 'bold',
					width:"90%",
				}}
				>
			   {t("WhereWereYouBorn")}	
				</Text>

				<Text
			  style={{
				fontSize: size(14),
				color: CurrentViewMode.Mode_Sec_fontColor,
				marginLeft: width(5),
				marginTop: height(2),
				fontWeight: 'bold',
				width:"90%",
			  }}>
		     {t("WhereWereYouBorn2Slide10")}
			</Text>
				
	
	
				<GooglePlacesAutocomplete
				ref={SearchBirthinputRef}
				keyboardType="default"
				placeholder="Search"
				placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
				enablePoweredByContainer={false}
				fetchDetails={true}
				onPress={(data, details = null) => {
					console.log('Place Data:', data);
					console.log('Place Details:', details);
					if (details) {
					// Extract and store address components
					extractBirthAddressComponents(details.address_components);
					BirthreverseVisible()
					}
				}}
				query={{
					key: EXPO_GOOGLE_MAP_API_KEY,
					language: currentLanguage,
				}}
				GooglePlacesDetailsQuery={{
					fields: ['formatted_address', 'geometry'],
				}}
				onFail={(error) => console.error('Google Places Error:', error)}
				textInputProps={{
					placeholderTextColor: '#888',
					clearButtonMode: 'while-editing',
				}}
				styles={{
					container: {
					flex: 1,
					width: '90%',
					marginTop: 20,
					alignSelf: 'center',
					},
					textInputContainer: {
					borderRadius: 5,
					backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
					paddingHorizontal: 10,
					marginTop: 20,
					},
					textInput: {
					height: 45,
					fontSize: 18,
					color: CurrentViewMode.Mode_fontColor,
					backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
					},
					listView: {
					backgroundColor: CurrentViewMode.Mode_bg,
					zIndex: 100,
					marginTop: 10,
					},
					row: {
					backgroundColor: CurrentViewMode.Mode_bg,
					paddingVertical: 12,
					paddingHorizontal: 20,
					borderBottomColor: CurrentViewMode.Mode_ButtonColor_Profile,
					borderBottomWidth: 1,
					},
					description: {
					color: CurrentViewMode.Mode_fontColor,
					fontSize: 18,
					},
					separator: {
					height: 0.5,
					backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
					},
					poweredContainer: {
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
					},
					powered: {
					tintColor: CurrentViewMode.Mode_fontColor,
					},
				}}
				/>
		</View>
			  </Modal>




			  {
				 Birthcity == null || Birthcity == "" ||  Birthcountry == null || Birthcountry == ""

				?

				<TouchableOpacity onPress={() => {
					 setShowToast(true)
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

					console.log(currentPage)
					
				}}
			
				style={{
					paddingVertical: 12,
					paddingHorizontal: 20,
					width: width(65),
				   right: width(5),
					position: 'absolute',
					borderRadius: 10,
					marginTop: height(78),
					backgroundColor: CurrentViewMode.Mode_fontColor, 
					opacity: 0.4,
				}}>
					<Text style={{
						color: CurrentViewMode.Mode_bg,
						fontSize: size(18),
						alignSelf: 'center',
						fontWeight: "bold",
					}}>
				   	{t("ContinueButtonText")}
					</Text>
				</TouchableOpacity>


					:


					<TouchableOpacity onPress={() => {
						
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
						slideToNextPage()
					}}
				
					style={{
						paddingVertical: 12,
						paddingHorizontal: 20,
						width: width(65),
					   right: width(5),
						position: 'absolute',
						borderRadius: 10,
						marginTop: height(78),
						backgroundColor: CurrentViewMode.Mode_fontColor, 
					}}>
						<Text style={{
							color: CurrentViewMode.Mode_bg,
							fontSize: size(18),
							alignSelf: 'center',
							fontWeight: "bold",
						}}>
							{t("ContinueButtonText")}
						</Text>
					</TouchableOpacity>


			  }


			
		<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

				
			}}
		
			style={{
				height: size(48),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor: CurrentViewMode.Mode_fontColor, 
				justifyContent: 'center',
				alignItems: 'center'
			}}>
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 
			</TouchableOpacity>


			<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

			
			}}
		
			style={{
				height: size(48),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor: CurrentViewMode.Mode_fontColor,
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<MaterialIcons name='arrow-back' style={{
					color: CurrentViewMode.Mode_bg,
					fontSize: size(25)

				}} />
			</TouchableOpacity>


		</View>
	   ),
	  },


















	  {
		id: 11,
		content: (
			<View style={{ width: width(100), padding: 16 }}>

			<View
				  style={{
					width: '100%',
				
				  }}>
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(1),
				fontWeight: 'bold',
				width:"90%",
			  }}
			>
			{t("WhatsYourCitizenship")}
			</Text>
			
			<Text
			  style={{
				fontSize: size(14),
				color:CurrentViewMode.Mode_Sec_fontColor,
				marginLeft: width(5),
				marginTop: height(2),
				fontWeight: 'bold',
				width:"90%",
			  }}>
		  		{t("WhatsYourCitizenship2")}
			</Text>


		</View>





		<View style={{
			flexDirection: 'row',
			alignItems: 'center',
			width: "90%",
			alignSelf: 'center',
			height: height(9),
			borderBottomWidth: 1,
			zIndex: 5,
			borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
			marginTop: height(5),
			
		}}>


		<Text style={{
			color: CurrentViewMode.Mode_fontColor,
			fontSize: size(18),
			width: "70%",
		}}>
		{t("IamACitizenOf")} {Birthcountry}
		</Text>
	
		 <Switch
           backgroundActive={CurrentViewMode.Mode_ButtonColor_Profile}
		   backgroundInactive={CurrentViewMode.Mode_ButtonColor_Profile}
		   circleActiveColor={CurrentViewMode.Mode_fontColor}
		   circleInActiveColor={CurrentViewMode.Mode_fontColor}
		  activeText={''}
		  inActiveText={''}
		  containerStyle={{
			position: 'absolute',
			right: 0,
		  }}
          onValueChange={() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
			toggleSwitch()
		  }}
          value={isEnabled}
        />

	 </View>




	 <View style={{
			flexDirection: 'row',
			alignItems: 'center',
			height: height(9),
			width: "90%",
			alignSelf: 'center',
			borderBottomWidth: 1,
			borderColor: CurrentViewMode.Mode_ButtonColor_Profile,
		}}>


		<Text style={{
			color: CurrentViewMode.Mode_fontColor,
			fontSize: size(18),
			width: "70%",
		}}>
			{t("IhaveOtherCitizenships")}
		</Text>
	
		 <Switch
           backgroundActive={CurrentViewMode.Mode_ButtonColor_Profile}
		   backgroundInactive={CurrentViewMode.Mode_ButtonColor_Profile}
		   circleActiveColor={CurrentViewMode.Mode_fontColor}
		   circleInActiveColor={CurrentViewMode.Mode_fontColor}
		 activeText={''}
		 inActiveText={''}
		 containerStyle={{
			position: 'absolute',
			right: 0,
		  }} 
          onValueChange={() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
			toggleSwitchOtherCitizenships
		  }}
          value={isEnabledOtherCitizenships}
        />

	 </View>

	
	

			
			
	




			  {
				isEnabled == false && isEnabledOtherCitizenships == false

				?

				<TouchableOpacity onPress={() => {
					// ToastMessage()
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
					setShowToast(true)
					
				}}
			
				style={{
					paddingVertical: 12,
					paddingHorizontal: 20,
					width: width(65),
				   right: width(5),
					position: 'absolute',
					borderRadius: 10,
					marginTop: height(78),
					backgroundColor: CurrentViewMode.Mode_fontColor,
					opacity: 0.4,
				}}>
					<Text style={{
						fontSize: size(18),
						alignSelf: 'center',
						fontWeight: "bold",
						color: CurrentViewMode.Mode_bg,
					}}>
				   		{t("ContinueButtonText")}
					</Text>
				</TouchableOpacity>


					:


					<TouchableOpacity onPress={() => {
						
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
						slideToNextPage()
					}}
				
					style={{
					paddingVertical: 12,
					paddingHorizontal: 20,
					width: width(65),
				   right: width(5),
					position: 'absolute',
					borderRadius: 10,
					marginTop: height(78),
					backgroundColor:  CurrentViewMode.Mode_fontColor,
					}}>
						<Text style={{
							fontSize: size(18),
							alignSelf: 'center',
							fontWeight: "bold",
							color: CurrentViewMode.Mode_bg,
						}}>
							{t("ContinueButtonText")}
						</Text>
					</TouchableOpacity>


			  }


<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

				
			}}
		
			style={{
				height: size(48),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor:  CurrentViewMode.Mode_fontColor,
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<MaterialIcons name='arrow-back' style={{
					color:  CurrentViewMode.Mode_bg,
					fontSize: size(25)

				}} />
			</TouchableOpacity>
		

		</View>
	   ),
	  },



















	  {
		id: 12,
		content: (
			<View style={{ width: width(100), padding: 16 }}>

			<View
				  style={{
					width: '100%',
				
		
				  }}>
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(5),
				fontWeight: 'bold',
				width:"90%",
			  }}
			>
			{t("WhatsYourCitizenshipSlide12")}	
			</Text>
			
			<Text
			  style={{
				fontSize: size(14),
				color:CurrentViewMode.Mode_Sec_fontColor,
				marginLeft: width(5),
				marginTop: height(2),
				fontWeight: 'bold',
				width:"90%",
			  }}>
			   {t("WhatsYourCitizenshipSlide12Text2")}
			</Text>


		</View>

		<View style={{
				marginTop: height(5),
			}}> 







		<View style={{
			flexDirection: 'row',
			alignItems: 'center',
			width: "90%",
			alignSelf: 'center',
			height: height(9),
			borderBottomWidth: 1,
			borderColor:CurrentViewMode.Mode_ButtonBgColor_Search,
		}}>


		<Text style={{
			color: CurrentViewMode.Mode_fontColor,
			fontSize: size(18),
			width: "70%",
		}}>
			{t("ImTaxedIn")} {Birthcountry}
		</Text>
	
		 <Switch
           backgroundActive={CurrentViewMode.Mode_ButtonColor_Profile}
		   backgroundInactive={CurrentViewMode.Mode_ButtonColor_Profile}
		   circleActiveColor={CurrentViewMode.Mode_fontColor}
		   circleInActiveColor={CurrentViewMode.Mode_fontColor}
		  activeText={''}
		  inActiveText={''}
		  containerStyle={{
			position: 'absolute',
			right: 0,
		  }} 
          onValueChange={() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
			toggleSwitchistaxedIn()
		  }}
          value={istaxedIn}
        />

	 </View>




	 <View style={{
			flexDirection: 'row',
			alignItems: 'center',
			height: height(9),
			width: "90%",
			alignSelf: 'center',
			borderBottomWidth: 1,
			borderColor:CurrentViewMode.Mode_ButtonBgColor_Search,
		}}>


		<Text style={{
			color:CurrentViewMode.Mode_fontColor,
			fontSize: size(18),
			width: "70%",
		}}>
		{t("IamNoZaUSPersonMoreInfo")} <Text style={{color: CurrentViewMode.Mode_CashChart_Cash}}>{t("IamNoZaUSPersonMoreInfo2")}</Text>
		</Text>
	
		 <Switch
            backgroundActive={CurrentViewMode.Mode_ButtonColor_Profile}
			backgroundInactive={CurrentViewMode.Mode_ButtonColor_Profile}
			circleActiveColor={CurrentViewMode.Mode_fontColor}
			circleInActiveColor={CurrentViewMode.Mode_fontColor}
		  activeText={''}
		  inActiveText={''}
		  containerStyle={{
			position: 'absolute',
			right: 0,
		  }}  
          onValueChange={() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
			toggleSwitchNotaUsPerson()
		  }}
          value={isEnabledNotaUsPerson}
        />

	 </View>






	 <View style={{
			flexDirection: 'row',
			alignItems: 'center',
			height: height(9),
			width: "90%",
			alignSelf: 'center',
			borderBottomWidth: 1,
			borderColor:CurrentViewMode.Mode_ButtonBgColor_Search,
		}}>


		<Text style={{
			color: CurrentViewMode.Mode_fontColor,
			fontSize: size(18),
			width: "70%",
		}}>
		{t("IhaveAdditionalTaxResidenciesInOtherCountries")}	
		</Text>
	
		 <Switch
         // trackColor={{false: '#25292F', true: '#00FF76'}}
        //  thumbColor={isEnabledAdditionalTaxResidencies ? '#fff' : '#fff'}
		backgroundActive={CurrentViewMode.Mode_ButtonColor_Profile}
		backgroundInactive={CurrentViewMode.Mode_ButtonColor_Profile}
		circleActiveColor={CurrentViewMode.Mode_fontColor}
		circleInActiveColor={CurrentViewMode.Mode_fontColor}
		  activeText={''}
		  inActiveText={''}
		  containerStyle={{
			position: 'absolute',
			right: 0,
		  }} 
          onValueChange={() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
			toggleSwitchAdditionalTaxResidencies()
		  }}
          value={isEnabledAdditionalTaxResidencies}
        />

	 </View>



		</View>

			
			

			
			
	




			  {
				isEnabledAdditionalTaxResidencies == false && istaxedIn == false && isEnabledNotaUsPerson == false 

				?

				<TouchableOpacity onPress={() => {
					// ToastMessage()
					setShowToast(true)
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
					
				}}
			
				style={{
					paddingVertical: 12,
					paddingHorizontal: 20,
					width: width(65),
				   right: width(5),
					position: 'absolute',
					borderRadius: 10,
					marginTop: height(78),
					backgroundColor: CurrentViewMode.Mode_fontColor,
					opacity: 0.4,
				}}>
					<Text style={{
						fontSize: size(18),
						alignSelf: 'center',
						fontWeight: "bold",
						color: CurrentViewMode.Mode_bg,
					}}>
					{t("ContinueButtonText")}
					</Text>
				</TouchableOpacity>


					:


					<TouchableOpacity onPress={() => {
						
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
						slideToNextPage()
					}}
				
					style={{
						paddingVertical: 12,
						paddingHorizontal: 20,
						width: width(65),
					   right: width(5),
						position: 'absolute',
						borderRadius: 10,
						marginTop: height(78),
						backgroundColor: CurrentViewMode.Mode_fontColor,
					}}>
						<Text style={{
							fontSize: size(18),
							alignSelf: 'center',
							fontWeight: "bold",
							color:  CurrentViewMode.Mode_bg,
						}}>
						{t("ContinueButtonText")}
						</Text>
					</TouchableOpacity>


			  }




		<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

				
			}}
		
			style={{
				height: size(48),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor: CurrentViewMode.Mode_fontColor,
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<MaterialIcons name='arrow-back' style={{
					color: CurrentViewMode.Mode_bg,
					fontSize: size(25)

				}} />
			</TouchableOpacity>

			
		

		</View>
	   ),
	  },























	  {
		id: 13,
		content: (
			<View style={{ width: width(100), padding: 16 }}>

			<View
				  style={{
					width: '100%',
				
		
				  }}>
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(5),
				fontWeight: 'bold',
				width:"90%",
			  }}
			>
			{t("WereDoneWithBureaucracy")}
			</Text>
			
			<Text
			  style={{
				fontSize: size(14),
				color: CurrentViewMode.Mode_Sec_fontColor,
				marginLeft: width(5),
				marginTop: height(2),
				fontWeight: 'bold',
				width:"90%",
			  }}>
			  {t("WereDoneWithBureaucracyText2")} 
			</Text>


		</View>

		<View style={{ height: height(40), marginTop: height(5), marginLeft: width(-9), width: "90%", }}>
				
			
		{
				currentLanguage == "en"
					
				?
				
				<Image source={require("../../assets/Account_creation_Progess_3_WhiteSlide13_Correct.png")}
				style={{
					height: "100%",
					width: "100%",
					resizeMode: "contain"
				}} /> 
				
				:

				null
				}



				{
				currentLanguage == "de"
					
				?
				
				<Image source={require("../../assets/Account_creation_Progess_3_White_germanSlide13_Correct.png")}
				style={{
					height: "100%",
					width: "100%",
					resizeMode: "contain"
				}} /> 
				
				:

				null
				}


				{
				currentLanguage == "fr"
					
				?
				
				<Image source={require("../../assets/Account_creation_Progess_3_White_frenchSlide13_Correct.png")}
				style={{
					height: "100%",
					width: "100%",
					resizeMode: "contain"
				}} /> 
				
				:

				null
				}
			
			
				</View>

			
			

			
			
	




			  {
				isEnabled == false && isEnabledOtherCitizenships == false

				?

				<TouchableOpacity onPress={() => {
					// ToastMessage()
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
					
				}}
			
				style={{
					paddingVertical: 12,
					paddingHorizontal: 20,
					width: width(65),
				   right: width(5),
					position: 'absolute',
					borderRadius: 10,
					marginTop: height(78),
					backgroundColor: CurrentViewMode.Mode_fontColor,
					opacity: 0.4,
				}}>
					<Text style={{
						color: CurrentViewMode.Mode_bg,
						fontSize: size(18),
						alignSelf: 'center',
						fontWeight: "bold",
					}}>
				{t("ContinueButtonText")}
					</Text>
				</TouchableOpacity>


					:


					<TouchableOpacity onPress={() => {
						
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
						slideToNextPage()
					}}
				
					style={{
						paddingVertical: 12,
						paddingHorizontal: 20,
						width: width(65),
					   right: width(5),
						position: 'absolute',
						borderRadius: 10,
						marginTop: height(78),
						backgroundColor: CurrentViewMode.Mode_fontColor,
					}}>
						<Text style={{
							color: CurrentViewMode.Mode_bg,
							fontSize: size(18),
							alignSelf: 'center',
							fontWeight: "bold",
						}}>
					 {t("ContinueButtonText")}
						</Text>
					</TouchableOpacity>


			  }





<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

				
			}}
		
			style={{
				height: size(48),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor:  CurrentViewMode.Mode_fontColor,
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<MaterialIcons name='arrow-back' style={{
					color: CurrentViewMode.Mode_bg,
					fontSize: size(25)

				}} />
			</TouchableOpacity>

			
		

		</View>
	   ),
	  },


























 {
   id: 14,
   content: (
  
  
<View style={{ width: width(100), flex: 1, padding: 16 }}>



{

!permission

?


<>

<View
style={{
  width: '100%',
  justifyContent: 'center',
  alignSelf: 'center',
  alignItems: 'center',
  alignContent: 'center',
}}>








<View style={{ height: height(20), alignSelf: 'center', marginTop: height(7),  marginBottom: height(3),  width: "90%", }}>

<Image source={require("../../assets/images/Camera_Icon.png")}
style={{
  height: "100%",
  width: "100%",
  resizeMode: "contain"
}} />
</View>




<Text style={{
  fontSize: size(25),
  color: CurrentViewMode.Mode_fontColor,
  fontWeight: "bold",
  width: width(70),
  marginTop: height(5),
  textAlign: 'center',
  alignSelf: 'center',

}}>
{t("ItsTimeToSnapSomePictures")}

</Text>

<Text style={{
  fontSize: size(14),
  color: CurrentViewMode.Mode_Sec_fontColor,
  marginBottom: height(3),
  textAlign: 'center',
  fontWeight: 'bold',
  width:"90%",
}}>
{t("ItsTimeToSnapSomePictures2")}
</Text>













</View>















  <TouchableOpacity onPress={() => {

slideToNextPage()
  }}

  style={{
	  paddingVertical: 12,
	  paddingHorizontal: 20,
	  width: width(65),
	 right: width(5),
	  position: 'absolute',
	  borderRadius: 10,
	  marginTop: height(78),
	  backgroundColor:  CurrentViewMode.Mode_fontColor,
  }}>
	  <Text style={{
		color: CurrentViewMode.Mode_bg,
		  fontSize: size(18),
		  alignSelf: 'center',
		  fontWeight: "bold",
	  }}>
		 {t("AllowAccessText")} 
	  </Text>
  </TouchableOpacity>



  </>

:

<> 


<View
style={{
  width: '100%',
  justifyContent: 'center',
  alignSelf: 'center',
  alignItems: 'center',
  alignContent: 'center',
}}>








<View style={{ height: height(20), alignSelf: 'center', marginTop: height(7),  marginBottom: height(3),  width: "90%", }}>

<Image source={require("../../assets/images/Camera_Icon.png")}
style={{
  height: "100%",
  width: "100%",
  resizeMode: "contain"
}} />
</View>




<Text style={{
  fontSize: size(25),
  color:  CurrentViewMode.Mode_fontColor,
  fontWeight: "bold",
  width: width(70),
  textAlign: 'center',
  alignSelf: 'center',

}}>
  {t("ItsTimeToSnapSomePictures")} 

</Text>

<Text style={{
  fontSize: size(14),
  color:  CurrentViewMode.Mode_Sec_fontColor,
  marginTop: height(3),
  textAlign: 'center',
  fontWeight: 'bold',
  width:"90%",
}}>
  {t("ItsTimeToSnapSomePictures2")} 
</Text>













</View>















  <TouchableOpacity onPress={() => {
	  
	  //handlePermissionRequest()
	  //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
	  slideToNextPage()
  }}

  style={{
	  paddingVertical: 12,
	  paddingHorizontal: 20,
	  width: width(65),
	 right: width(5),
	  position: 'absolute',
	  borderRadius: 10,
	  marginTop: height(78),
	  backgroundColor: CurrentViewMode.Mode_fontColor,
  }}>
	  <Text style={{
		  fontSize: size(18),
		  color: CurrentViewMode.Mode_bg,
		  alignSelf: 'center',
		  fontWeight: "bold",
	  }}>
		 {t("AllowAccessText")} 
	  </Text>
  </TouchableOpacity>


  </>


}




<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

				
			}}
		
			style={{
				height: size(48),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor: CurrentViewMode.Mode_fontColor,
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<MaterialIcons name='arrow-back' style={{
					color: CurrentViewMode.Mode_bg,
					fontSize: size(25)

				}} />
			</TouchableOpacity>

		</View>
	   ),
	  },






















 {
 id: 15,
 content: (
	   
	   
	 <View style={{ width: width(100), flex: 1, padding: 16 }}>
	 
	 
	 
	 {
	 
	 !permission
	 
	 ?
	 
	 
	 <>
	 
	 <View
	 style={{
	   width: '100%',
	   justifyContent: 'center',
	   alignSelf: 'center',
	   alignItems: 'center',
	   alignContent: 'center',
	 }}>
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 <Text style={{
	   fontSize: size(25),
	   color: CurrentViewMode.Mode_fontColor,
	   fontWeight: "bold",
	   width: width(70),
	   textAlign: 'center',
	   alignSelf: 'center',
	 
	 }}>
	{t("RequiredLocationAccess")}	
	 </Text>
	 
	 <Text style={{
	   fontSize: size(14),
	   color: CurrentViewMode.Mode_Sec_fontColor,
	   marginTop: height(3),
	   textAlign: 'center',
	   fontWeight: 'bold',
	   width:"90%",
	 }}>
	 {t("RequiredLocationAccess2")}	 
	 </Text>
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 </View>
	 
	 
	 
	 
	 
	 
	 
	 
	 

	 
	 
	 
	 
	 
	   <TouchableOpacity onPress={() => {
	
		  // checkLocationPermission();
		   //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		   slideToNextPage()
	   }}
	 
	   style={{
		   paddingVertical: 12,
		   paddingHorizontal: 20,
		   width: width(65),
		   right: width(5),
		   position: 'absolute',
		   borderRadius: 10,
		   marginTop: height(78),
		   backgroundColor: CurrentViewMode.Mode_fontColor,
	   }}>
		   <Text style={{
			color: CurrentViewMode.Mode_bg,
			   fontSize: size(18),
			   alignSelf: 'center',
			   fontWeight: "bold",
		   }}>
			{t("AllowAccessText")}
		   </Text>
	   </TouchableOpacity>
	 
	 
	 
	   </>
	 
	 :
	 
	 <> 
	 
	 
	 <View
	 style={{
	   width: '100%',
	   justifyContent: 'center',
	   alignSelf: 'center',
	   alignItems: 'center',
	   alignContent: 'center',
	 }}>
	 
	 
	 
	 
	 
	 
	 
	 
	 <View style={{ height: height(20), alignSelf: 'center', marginTop: height(7), marginBottom: height(3),  width: "90%", }}>
	 
	 <Image source={require("../../assets/images/Location_Icon.png")}
	 style={{
	   height: "100%",
	   width: "100%",
	   resizeMode: "contain"
	 }} />
	 </View>
	 
	 
	 
	 
	 <Text style={{
	   fontSize: size(25),
	   color:  CurrentViewMode.Mode_fontColor,
	   fontWeight: "bold",
	   width: width(70),
	   textAlign: 'center',
	   alignSelf: 'center',
	 
	 }}>
	{t("RequiredLocationAccess")}
	 </Text>
	 
	 <Text style={{
	   fontSize: size(14),
	   color:  CurrentViewMode.Mode_Sec_fontColor,
	   marginTop: height(3),
	   textAlign: 'center',
	   fontWeight: 'bold',
	   width:"90%",
	 }}>
	 {t("RequiredLocationAccess2")} 
	 </Text>
	 	 
	 </View>
	 





	 
	 
	 
	 
	 
	 
	 
	 
	 

	 <TouchableOpacity onPress={() => {
	  
	 // handlePermissionRequest()
	  //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
	  slideToNextPage()
  }}

  style={{
	paddingVertical: 12,
	paddingHorizontal: 20,
	width: width(65),
	right: width(5),
	position: 'absolute',
	borderRadius: 10,
	marginTop: height(78),
	backgroundColor: CurrentViewMode.Mode_fontColor,
  }}>
	  <Text style={{
		  color: CurrentViewMode.Mode_bg, 
		  fontSize: size(18),
		  alignSelf: 'center',
		  fontWeight: "bold",
	  }}>
		 {t("AllowAccessText")}
	  </Text>
  </TouchableOpacity>

	 
	   </>
	 
	 
	 }
	 

	 <TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

				
			}}
		
			style={{
				height: size(48),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor:  CurrentViewMode.Mode_fontColor,
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<MaterialIcons name='arrow-back' style={{
					color: CurrentViewMode.Mode_bg, 
					fontSize: size(25)

				}} />
			</TouchableOpacity>
	 
 </View>
 ),
 },

















  {
	id: 16,
	content: (
		  
		  
 <View style={{ width: width(100), flex: 1, padding: 16 }}>
		
		
		
	
		<View
		style={{
		  width: '100%',
		  justifyContent: 'center',
		  alignSelf: 'center',
		  alignItems: 'center',
		  alignContent: 'center',
		}}>
		
		
		<View style={{ height: height(20), alignSelf: 'center', marginTop: height(7),  width: "90%", }}>
		
		<Image source={require("../../assets/images/id_icon.png")}
				style={{
					height: "100%",
					width: "100%",
					resizeMode: "contain"
				}} />
		</View>
		
		
		
		
		<Text style={{
		  fontSize: size(25),
		  color: CurrentViewMode.Mode_fontColor,
		  fontWeight: "bold",
		  marginTop: height(5),
		  width: width(70),
		  textAlign: 'center',
		  alignSelf: 'center',
		
		}}>
	     {t("HangTightForABit")}

		</Text>
		
		<Text style={{
		  fontSize: size(14),
		  color: CurrentViewMode.Mode_Sec_fontColor,
		  marginLeft: width(5),
		  marginTop: height(2),
		  textAlign: 'center',
		  fontWeight: 'bold',
		  width:"90%",
		}}>
		  {t("HangTightForABit2")} 

 </Text>
		
		
		
		
		
	
		
		
		
		
 </View>
		
		
		



	{
		StatusPage16Done == true

		?


		<View style={{
			alignSelf: 'center',
			position: 'absolute',
			marginTop: height(78),
			justifyContent: 'center',
			alignItems: 'center',
		}}>


	

		<LottieView
        autoPlay
        ref={animation}
        style={{
          width: 45,
          height: 45,
        }}
        source={require("../../assets/loadibg.json")}
      />


     	<Text style={{
			color:  CurrentViewMode.Mode_fontColor,
			fontWeight: "bold",
			fontSize: size(14)
		}}>
		 95%
		</Text>

		</View>



		:


		<>
		
		
 <TouchableOpacity onPress={() => {
	  
	  // handlePermissionRequest()
	   //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
	   slideToNextPage()
   }}
 
   style={{
	 paddingVertical: 12,
	 paddingHorizontal: 20,
	 width: width(65),
	 right: width(5),
	 position: 'absolute',
	 borderRadius: 10,
	 marginTop: height(78),
	 backgroundColor: CurrentViewMode.Mode_fontColor,
   }}>
	   <Text style={{
		   fontSize: size(18),
		   color: CurrentViewMode.Mode_bg,
		   alignSelf: 'center',
		   fontWeight: "bold",
	   }}>
	  {t("ContinueButtonText")}
	   </Text>
   </TouchableOpacity>
 
	
	  
	  
	  
 
	  <TouchableOpacity onPress={() => {
				 // ToastMessage()
				 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				 slideToPreviousPage()
 
				 
			 }}
		 
			 style={{
				 height: size(48),
				 paddingHorizontal: 20,
				 marginLeft: 20,
				 position: 'absolute',
				 borderRadius: 10,
				 marginTop: height(78),
				 backgroundColor: CurrentViewMode.Mode_fontColor,
				 justifyContent: 'center',
				 alignItems: 'center'
			 }}>
				 <MaterialIcons name='arrow-back' style={{
					 color: CurrentViewMode.Mode_bg,
					 fontSize: size(25)
 
				 }} />
			 </TouchableOpacity>
		
		
		</>

	}


 </View>
	),
	},































	{
		id: 17,
		content: (
			<View style={{ width: width(100), padding: 16 }}>

			<View
				  style={{
					width: '100%',
				
		
				  }}>



					
			<Text
			  style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(25),
				marginLeft: width(5),
				marginTop: height(5),
				fontWeight: 'bold',
				width:"90%",
			  }}
			>
			{t("AlmostReady")}
			</Text>
			
			<Text
			  style={{
				fontSize: size(14),
				color: CurrentViewMode.Mode_Sec_fontColor,
				marginLeft: width(5),
				marginTop: height(2),
				fontWeight: 'bold',
				width:"90%",
			  }}>
			{t("AlmostReady2Text")}
		
			</Text>


		</View>

		<View style={{ height: height(40), marginTop: height(5), marginLeft: width(-9), width: "90%", }}>
				
		{
				currentLanguage == "en"
					
				?
				
				<Image source={require("../../assets/Account_creation_Progess_3_White.png")}
				style={{
					height: "100%",
					width: "100%",
					resizeMode: "contain"
				}} /> 
				
				:

				null
				}



				{
				currentLanguage == "de"
					
				?
				
				<Image source={require("../../assets/Account_creation_Progess_3_White_german.png")}
				style={{
					height: "100%",
					width: "100%",
					resizeMode: "contain"
				}} /> 
				
				:

				null
				}


				{
				currentLanguage == "fr"
					
				?
				
				<Image source={require("../../assets/Account_creation_Progess_3_White_french.png")}
				style={{
					height: "100%",
					width: "100%",
					resizeMode: "contain"
				}} /> 
				
				:

				null
				}
				</View>

			
			

			
			






<TouchableOpacity onPress={() => {
						
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
						slideToNextPage()
					}}
				
					style={{
						paddingVertical: 12,
						paddingHorizontal: 20,
						width: "90%",
					    alignSelf: 'center',
						position: 'absolute',
						borderRadius: 10,
						marginTop: height(78),
						backgroundColor: CurrentViewMode.Mode_fontColor,
					}}>
						<Text style={{
							fontSize: size(18),
							color: CurrentViewMode.Mode_bg,
							alignSelf: 'center',
							fontWeight: "bold",
						}}>
						{t("ContinueButtonText")}
						</Text>
					</TouchableOpacity>

		

		</View>
	   ),
	  },

	
	






















 {
 id: 18,
 content: (
 <View style={{ height: "100%", width: "100%", padding: 10 }}>





<Animated.View
  style={{
   // position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: headerHeight,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: width(10),
    zIndex: 10,
  }}
>
  <Animated.Text
    style={{
      color: CurrentViewMode.Mode_fontColor,
      fontSize: size(25),
      marginTop: height(5),
      fontWeight: "bold",
      opacity: titleOpacity,
    }}
  >
	{t("JustAFewMoreQuestions")}
   
  </Animated.Text>

  <Animated.Text
    style={{
      fontSize: size(14),
      color: CurrentViewMode.Mode_Sec_fontColor,
      marginTop: height(2),
      fontWeight: "bold",
      opacity: titleOpacity,
    }}
  >
	{t("JustAFewMoreQuestions2Text")}
   
  </Animated.Text>



  <Animated.Text
    style={{
      color: CurrentViewMode.Mode_fontColor,
      fontSize: size(18),
	  position: 'absolute',
	  marginTop: height(-1),
	  alignSelf: 'center',
      fontWeight: "bold",
      opacity: newTitleOpacity,
    }}
  >
{t("JustAFewMoreQuestions3Text")}
   
  </Animated.Text>
</Animated.View>


		


 <ScrollView showsVerticalScrollIndicator={false}
  style={{height: "100%", width: "100%",}}
  contentContainerStyle={{
	paddingBlock: height(10),
    paddingTop: HEADER_HEIGHT, // Prevent overlap with header
  //  paddingBottom: height(10), // Space for extra scrolling
  }}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  )}
  scrollEventThrottle={16}
>


















<View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(2),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color: CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
	  	{t("EmploymentStatusText")}	
		</Text>

		<TouchableOpacity onPress={reverseVisibleEmploymentStatus}
		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text numberOfLines={1} style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
				width: "80%"
			}}>
			{ChoosedEmploymentStatusText == null ? t("SelectYourCurrentEmploymentStatus") : ChoosedEmploymentStatusText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleEmploymentStatus}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleEmploymentStatus} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					//marginTop: height(2),
					marginBottom: height(2),
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				 {t("SelectYourEmploymentStatus")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color: CurrentViewMode.Mode_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
				<TextInput placeholder={t("SearchBtnText")+"..."}
				placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
				//value={searchText}
				onChangeText={handleSearchEmploymentStatus}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color: CurrentViewMode.Mode_fontColor,
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				fontSize: size(16),
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			data={filteredDataEmploymentStatus}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedEmploymentStatusText(item.item)
				setChoosedEmploymentStatus(item.id)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleEmploymentStatus()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color:  CurrentViewMode.Mode_fontColor, }}>
					{item.item}
				</Text>

				{
					ChoosedEmploymentStatusText == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color:  CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>









	    <View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(5),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color:  CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		 {t("ControlPosition")} 
		</Text>

		<TouchableOpacity onPress={reverseVisibleControlPosition}
		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor:  CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text numberOfLines={2} style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				width: "80%",
				fontSize: size(16),
				
			}}>
			{ChoosedControlPositionText == null ? t("DoXouHoldaControllingRoleInAPublicCompany") : ChoosedControlPositionText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleControlPosition}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor:  CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleControlPosition} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color:  CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color:  CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					lineHeight: 25,
					fontWeight: 'bold',
				
				}}
				>
				 {t("DoYouHoldaControllingRoleInaPublicCompany2")} 
				</Text>




		
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(5), 
			}}
			data={filteredDataControlPosition}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedControlPositionText(item.item)
				setChoosedControlPosition(item.value)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleControlPosition()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color: CurrentViewMode.Mode_fontColor,}}>
					{item.item}
				</Text>

				{
					ChoosedControlPosition == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color: CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>








		 <View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(5),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color: CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
	   	{t("ExchangeOrFINRAAffiliation")}	 
		</Text>
 
		<TouchableOpacity onPress={reverseVisibleFINRAAffiliation}
		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text numberOfLines={2} style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
				width: "90%"
			}}>
			{ChoosedFINRAAffiliationText == null ?  t("AreYouAffiliatedWithAnyExchangesOrFINRA") : ChoosedFINRAAffiliationText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleFINRAAffiliation}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleFINRAAffiliation} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				{t("AreYouAffiliatedWithAnyExchangesOrFINRA")}
				</Text>




		
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(5), 
			}}
			data={filteredDataFINRAAffiliation}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedFINRAAffiliationText(item.item)
				setChoosedFINRAAffiliation(item.value)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleFINRAAffiliation()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color:  CurrentViewMode.Mode_fontColor,}}>
					{item.item}
				</Text>

				{
					ChoosedFINRAAffiliation == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color: CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>












		<View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(5),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color: CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
	  	{t("PoliticallyExposed")}
		</Text> 
 
		<TouchableOpacity onPress={reverseVisiblePoliticallyExposed}
		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor:  CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text numberOfLines={2} style={{
				color:  CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
				width: "80%"
			}}>
			{ChoosedPoliticallyExposedText == null ? t("AreYouaPoliticallyExposedPerson") : ChoosedPoliticallyExposedText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisiblePoliticallyExposed}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisiblePoliticallyExposed} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				{t("AreYouaPoliticallyExposedPerson")}
				</Text>




		
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(5), 
			}}
			data={filteredDataPoliticallyExposed}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedPoliticallyExposedText(item.item)
				setChoosedPoliticallyExposed(item.value)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisiblePoliticallyExposed()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color:  CurrentViewMode.Mode_fontColor,}}>
					{item.item}
				</Text>

				{
					ChoosedPoliticallyExposed == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color: CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>
















		<View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(5),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color:  CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		 {t("ImmediateFamilyExposure")}
		</Text>  
 
		<TouchableOpacity onPress={reverseVisibleFamilyExposure}
		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor:  CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text style={{
				color:  CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
				width: "95%",
			}}>
			{ChoosedFamilyExposureText == null ? t("IsYourFamilyPoliticallyExposedOrInControl") : ChoosedFamilyExposureText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleFamilyExposure}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleFamilyExposure} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				{t("IsYourFamilyPoliticallyExposedOrInControl")}
				</Text>




		
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(5), 
			}}
			data={filteredDataFamilyExposure}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedFamilyExposureText(item.item)
				setChoosedFamilyExposure(item.value)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleFamilyExposure()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color:  CurrentViewMode.Mode_fontColor, }}>
					{item.item}
				</Text>

				{
					ChoosedFamilyExposure == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color: CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>














		<View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(4),
		}}>




		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color: CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		{t("FundingSource")}
		</Text>

		<TouchableOpacity onPress={reverseVisiblefundingsource}
		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
		 alignItems: 'center',
		 zIndex: 2,
		 flexDirection: 'row',
		}}>
		
			<Text style={{
				color:  CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
			}}>
			{ChoosedFunding_SourcedText == null ? t("SelectYourAccountsFundingSource") : ChoosedFunding_SourcedText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={Visiblefundingsource}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisiblefundingsource} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),

					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					
					fontWeight: 'bold',
				
				}}
				>
				{t("SelectYourAccountsFundingSource")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
			<TextInput placeholder={t("SearchBtnText")+"..."}
			placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
				//value={searchText}
				onChangeText={handleSearchFewMoreQuestions}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(16),
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			 data={filteredData}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedFunding_SourcedText(item.item)
				setChoosedFunding_Sourced(item.id)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisiblefundingsource()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color:  CurrentViewMode.Mode_fontColor, }}>
					{item.item}
				</Text>

				{
					ChoosedFunding_SourcedText == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color: '#fff',
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>
















     <View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(4),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color: CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		{t("LiquidityNeeds")} 
		</Text>

		<TouchableOpacity onPress={reverseVisibleLiquidityNeeds}
		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor:  CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
			}}>
			{ChoosedLiquidityNeedsText == null ? t("SelectYourAccountsLiquidityNeeds") : ChoosedLiquidityNeedsText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleLiquidityNeeds}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleLiquidityNeeds} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color:  CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				{t("LiquidityNeeds")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
				<TextInput placeholder={t("SearchBtnText")+"..."}
				placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
				//value={searchText}
				onChangeText={handleSearchLiquidityNeeds}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color: CurrentViewMode.Mode_fontColor,
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				fontSize: size(16),
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			data={filteredDataLiquidityNeeds}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedLiquidityNeedsText(item.item)
				setChoosedLiquidityNeeds(item.id)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleLiquidityNeeds()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color: CurrentViewMode.Mode_fontColor,}}>
					{item.item}
				</Text>

				{
					ChoosedLiquidityNeedsText == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color: CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>




















		 <View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(4),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color: CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		 {t("InvestmentExperienceWithStocks")}
		</Text>

		<TouchableOpacity onPress={reverseVisibleInvestmentExperience}
		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
			}}>
			{ChoosedInvestmentExperienceText == null ? t("ShareYourExperienceWithUSStocks") : ChoosedInvestmentExperienceText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleInvestmentExperience}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleInvestmentExperience} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color:  CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				{t("ShareYourExperienceWithUSStocks")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color:  CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
				<TextInput placeholder='Search...'
				//value={searchText}
				onChangeText={handleSearchInvestmentExperience}
				placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color:  CurrentViewMode.Mode_fontColor,
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				fontSize: size(16),
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			data={filteredDataInvestmentExperience}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				
				
				reverseVisibleInvestmentExperience()
				setChoosedInvestmentExperienceText(item.item)
				setChoosedInvestmentExperience(item.id) 
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
			
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color: CurrentViewMode.Mode_fontColor, }}>
					{item.item}
				</Text>

				{
					ChoosedInvestmentExperience == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color: CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>






























	    <View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(4),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color: CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		  {t("InvestmentExperienceWithOptions")}
		</Text>

		<TouchableOpacity onPress={reverseVisibleInvestmentExperienceOptions}
	
		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text numberOfLines={1} style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
				width: "80%"
			}}>
			{ChoosedInvestmentExperienceOptionsText == null ? t("ShareYourExperienceWithUSOptions") : ChoosedInvestmentExperienceOptionsText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleInvestmentExperienceOptions}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleInvestmentExperienceOptions} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				{t("ShareYourExperienceWithUSOptions")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
				<TextInput placeholder={t("SearchBtnText")+"..."}
				//value={searchText}
				onChangeText={handleSearchInvestmentExperienceOptions}
				placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color: CurrentViewMode.Mode_fontColor,
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				fontSize: size(16),
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			data={filteredDataInvestmentExperienceOptions}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {

			
				setChoosedInvestmentExperienceOptionsText(item.item)
				setChoosedInvestmentExperienceOptions(item.id)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleInvestmentExperienceOptions()  


			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color: CurrentViewMode.Mode_fontColor,}}>
					{item.item}
				</Text>

				{
					ChoosedInvestmentExperienceOptionsText == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color: CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>
























	  <View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(4),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color:  CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
	 	{t("RiskToleranceText")}	
		</Text>

		<TouchableOpacity onPress={reverseVisibleRiskTolerance}

		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor:  CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
			}}>
			{ChoosedRiskToleranceText == null ? t("YourComfortWithInvestmentRisks") : ChoosedRiskToleranceText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleRiskTolerance}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleRiskTolerance} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				{t("SelectYourRiskTolerance")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
				<TextInput placeholder={t("SearchBtnText")+"..."}
				//value={searchText}
				onChangeText={handleSearchRiskTolerance}
				placeholderTextColor={ CurrentViewMode.Mode_Third_fontColor}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color:  CurrentViewMode.Mode_fontColor,
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				fontSize: size(16),
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			data={filteredDataRiskTolerance}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedRiskToleranceText(item.item)
				setChoosedRiskTolerance(item.id)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleRiskTolerance()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color:  CurrentViewMode.Mode_fontColor,}}>
					{item.item}
				</Text>

				{ 
					ChoosedRiskToleranceText == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color:  CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>
































       <View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(4),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color: CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		{t("InvestmentObjective")}
		</Text>

		<TouchableOpacity onPress={reverseVisibleInvestmentObjective}

		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
			}}>
			{ChoosedInvestmentObjectiveText == null ?t("YourGoalForInvesting") : ChoosedInvestmentObjectiveText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color:  CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleInvestmentObjective}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleInvestmentObjective} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				{t("SelectYourInvestmentObjective")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
				<TextInput placeholder={t("SearchBtnText")+"..."}
				//value={searchText}
				onChangeText={handleSearchInvestmentObjective}
				placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color: CurrentViewMode.Mode_fontColor,
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				fontSize: size(16),
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			data={filteredDataInvestmentObjective}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedInvestmentObjective(item.id)
				setChoosedInvestmentObjectiveText(item.item)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleInvestmentObjective()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color: CurrentViewMode.Mode_fontColor, }}>
					{item.item}
				</Text>

				{ 
					ChoosedInvestmentObjectiveText == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color:CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>





























		<View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(4),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color: CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		 {t("InvestmentTimeHorizon")}
		</Text>

		<TouchableOpacity onPress={reverseVisibleInvestmentTimeHorizon}

		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16), 
			}}>
			{ChoosedInvestmentTimeHorizonText == null ? t("HowLongYouPlanToInvest") : ChoosedInvestmentTimeHorizonText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color:  CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleInvestmentTimeHorizon}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleInvestmentTimeHorizon} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				{t("SelectYourInvestmentTimeHorizon")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
				<TextInput placeholder={t("SearchBtnText")+"..."}
				//value={searchText}
				onChangeText={handleSearchInvestmentTimeHorizon}
				placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color: CurrentViewMode.Mode_fontColor,
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				fontSize: size(16),
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			data={filteredDataInvestmentTimeHorizon}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedInvestmentTimeHorizonText(item.item)
				setChoosedInvestmentTimeHorizon(item.id)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleInvestmentTimeHorizon()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}>
					
				<Text style={{ fontSize: 16, fontWeight: "bold", color: CurrentViewMode.Mode_fontColor, }}>
					{item.item}
				</Text>

				{ 
					ChoosedInvestmentTimeHorizon == item.item 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color: '#fff',
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>































		<View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(4),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color:  CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		{t("AnnualIncome")}
		</Text>

		<TouchableOpacity onPress={reverseVisibleMinimumAnnualIncome}

		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor:  CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text style={{
				color:  CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
			}}>
			{ChoosedMaximumAnnualIncomeText == null ? t("SelectYourAnnualIncome") : ChoosedMaximumAnnualIncomeText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleMinimumAnnualIncome}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleMinimumAnnualIncome} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				{t("SelectYourInvestmentTimeHorizon")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
				<TextInput placeholder={t("SearchBtnText")+"..."}
				//value={searchText}
				onChangeText={handleSearchMinimumAnnualIncome}
				placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color: CurrentViewMode.Mode_fontColor,
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				fontSize: size(16),
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			


				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			data={filteredDataMinimumAnnualIncome}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedMinimumAnnualIncome(item.min)
				setChoosedMaximumAnnualIncomeText(item.text)
				setChoosedMaximumAnnualIncome(item.max)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleMinimumAnnualIncome()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color: CurrentViewMode.Mode_fontColor, }}>
					{item.text}
				</Text>

				{ 
					ChoosedMinimumAnnualIncome == item.text 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color:CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>

























		<View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(4),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color:  CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		{t("LiquidNetWorth")}
		
		</Text>

		<TouchableOpacity onPress={reverseVisibleLiquidNetWorth}

		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text style={{
				color:  CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
			}}>
			{ChoosedLiquidNetWorthText == null ? t("YourEstimatedMinimumLiquidNetWorth") : ChoosedLiquidNetWorthText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleLiquidNetWorth}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleLiquidNetWorth} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				{t("SelectYourLiquidNetWorth")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
				<TextInput placeholder={t("SearchBtnText")+"..."}
				//value={searchText}
				onChangeText={handleSearchLiquidNetWorth}
				placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color:  CurrentViewMode.Mode_fontColor,
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				fontSize: size(16),
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			


				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			data={filteredDataLiquidNetWorth}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedMinLiquidNetWorth(item.min)
				setChoosedLiquidNetWorthText(item.text)
				setChoosedMaxLiquidNetWorth(item.max)

		

				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleLiquidNetWorth()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color: CurrentViewMode.Mode_fontColor,}}>
					{item.text}
				</Text>

				{ 
					ChoosedLiquidNetWorthText == item.text 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color: CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>










		<View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(4),
		}}>


		<Text style={{
			fontSize: size(16),
			fontWeight: "bold",
			color: CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		{t("TotalNetWorth")}
		</Text>
		
		<TouchableOpacity onPress={reverseVisibleTotalNetWorth}

		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(16),
			}}>
			{ChoosedTotalNetWorthText == null ? t("YourEstimatedMinimumTotalNetWorth") : ChoosedTotalNetWorthText} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>
	
	
  


		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleTotalNetWorth}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleTotalNetWorth} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),
					marginBottom: height(2),
					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
				
				}}
				>
				
				{t("SelectYourTotalNetWorth")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
				<TextInput placeholder={t("SearchBtnText")+"..."}
				//value={searchText}
				onChangeText={handleSearchTotalNetWorth}
				placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color: CurrentViewMode.Mode_fontColor,
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				fontSize: size(16),
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			

	




	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			data={filteredDataTotalNetWorth}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
			
				setChoosedTotalNetWorthText(item.text)
	
				setChoosedMinTotalNetWorth(item.min)
				setChoosedMaxTotalNetWorth(item.max)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleTotalNetWorth()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "bold", color: CurrentViewMode.Mode_fontColor, }}>
					{item.text}
				</Text>

				{ 
					ChoosedTotalNetWorthText == item.text 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color: CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>




</ScrollView>
	
	










		<TouchableOpacity onPress={() => {
						
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

						
						slideToNextPage()
					}}
				
					style={{
						
						height: size(50),
						paddingHorizontal: 20,
						width: width(65),
						right: width(5),
						position: 'absolute',
						borderRadius: 10,
						marginTop: height(78),
						backgroundColor: CurrentViewMode.Mode_fontColor,
						justifyContent: 'center',
						alignItems: 'center'
					}}>
						<Text style={{
							color: CurrentViewMode.Mode_bg,
							fontSize: size(18),
							alignSelf: 'center',
							fontWeight: "bold",
						}}>
						{t("ContinueButtonText")}
						</Text>
					</TouchableOpacity>


		
			

		

				<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

				
			}}
		
			style={{
				height: size(50),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor: CurrentViewMode.Mode_fontColor,
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<MaterialIcons name='arrow-back' style={{
					color: CurrentViewMode.Mode_bg,
					fontSize: size(25)

				}} />
			</TouchableOpacity>
		

		</View>
	   ),
	  },











































 {
	id: 20,
	content: (



<View style={{ height: "100%", width: "100%", padding: 10 }}>





<Animated.View
  style={{
   // position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: headerHeight,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: width(10),
    zIndex: 10,
  }}
>
  <Animated.Text
    style={{
      color: CurrentViewMode.Mode_fontColor,
      fontSize: size(25),
      marginTop: height(5),
      fontWeight: "bold",
      opacity: titleOpacity,
    }}
  >
	 {t("AtLast")} ...
   
  </Animated.Text>

  <Animated.Text
    style={{
      fontSize: size(14),
      color: CurrentViewMode.Mode_Sec_fontColor,
      marginTop: height(2),
      fontWeight: "bold",
      opacity: titleOpacity,
    }}
  >
{t("AtLastSubText2")}
   
  </Animated.Text>



  <Animated.Text
    style={{
      color: CurrentViewMode.Mode_fontColor,
      fontSize: size(18),
	  position: 'absolute',
	  marginTop: height(-1),
	  alignSelf: 'center',
      fontWeight: "bold",
      opacity: newTitleOpacity,
    }}
  >
  {t("JustaFewMoreQuestions")}
   
  </Animated.Text>
</Animated.View>


		


 <ScrollView showsVerticalScrollIndicator={false}
  style={{height: "100%", width: "100%",}}
  contentContainerStyle={{
	paddingBlock: height(10),
    paddingTop: HEADER_HEIGHT, // Prevent overlap with header
  //  paddingBottom: height(10), // Space for extra scrolling
  }}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  )}
  scrollEventThrottle={16}
>






   
   
   
	<View style={{
   width: "95%",
   justifyContent: 'center',
   
   }}>
   

<View style={{
	alignItems: 'center',
	flexDirection: 'row',
}}>

   <AntDesign name="filetext1" style={{
	fontSize: size(18),
	color: CurrentViewMode.Mode_fontColor,
	marginLeft: width(5),
   }} />	

   
   <Text style={{
		  color: CurrentViewMode.Mode_fontColor,
		  fontSize: size(16),
		  width: width(70),
		  marginLeft: width(2)
	  }}>

{t("MarginAgreement")}
   </Text>
   </View>
   
	   <Text style={{
			  color: CurrentViewMode.Mode_fontColor,
			  fontSize: size(16),
			  width: width(70),
			  marginTop: height(2),
			  marginLeft: width(5)
				   
			   }}>
		{t("MarginAgreementSubText")}
	   </Text>
   
   
	   <TouchableOpacity
	   onPress={() => {
		toggleCheckAcceptTermsAndConditions();
		   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	   }}
	   style={{
		   borderWidth: 1,
		   borderColor: CurrentViewMode.Mode_fontColor,
		   height: 25,
		   borderRadius: 5,
		   width: 25,
		   position: 'absolute',
		   right: 0,
		   alignItems: 'center',  // Center horizontally
		   justifyContent: 'center',  // Center vertically
		   display: 'flex',  // Ensures the flexbox model is used
	   }}
	   >
	   {CheckAcceptTermsAndConditions ? (
		   <MaterialIcons
		   name="check"
		   style={{
			   color: CurrentViewMode.Mode_CashChart_Cash,
			   fontSize: size(20),
		   }}
		   />
	   ) : null}
	   </TouchableOpacity>
   
   
   </View>		
   

   
   
   
   













      
	<View style={{
   width: "95%",
   justifyContent: 'center',
   marginTop: height(5),
   }}>
   

<View style={{
	alignItems: 'center',
	flexDirection: 'row',
}}>

   <AntDesign name="filetext1" style={{
	fontSize: size(18),
	color: CurrentViewMode.Mode_fontColor,
	marginLeft: width(5),
   }} />	

   
   <Text style={{
		  color: CurrentViewMode.Mode_fontColor,
		  fontSize: size(16),
		  width: width(70),
		  marginLeft: width(2)
	  }}>

{t("AccountAgreement")}
   </Text>
   </View>
   
	   <Text style={{
			  color: CurrentViewMode.Mode_fontColor,
			  fontSize: size(16),
			  width: width(70),
			  marginTop: height(2),
			  marginLeft: width(5)
				   
			   }}>
		 {t("AccountAgreementSubText")}
	   </Text>
   
   
	   <TouchableOpacity
	   onPress={() => {
		toggleChecAccountAgreement();
		   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	   }}
	   style={{
		   borderWidth: 1,
		   borderColor: CurrentViewMode.Mode_fontColor,
		   height: 25,
		   borderRadius: 5,
		   width: 25,
		   position: 'absolute',
		   right: 0,
		   alignItems: 'center',  // Center horizontally
		   justifyContent: 'center',  // Center vertically
		   display: 'flex',  // Ensures the flexbox model is used
	   }}
	   >
	   {ChecAccountAgreement ? (
		   <MaterialIcons
		   name="check"
		   style={{
			   color: CurrentViewMode.Mode_CashChart_Cash,
			   fontSize: size(20),
		   }}
		   />
	   ) : null}
	   </TouchableOpacity>
   
   
   </View>		
   
   
   

   
   
   
   
   
   
   








      
   <View style={{
   width: "95%",
   justifyContent: 'center',
   marginTop: height(5),
   }}>
   

<View style={{
	alignItems: 'center',
	flexDirection: 'row',
}}>

   <AntDesign name="filetext1" style={{
	fontSize: size(18),
	color: CurrentViewMode.Mode_fontColor,
	marginLeft: width(5),
   }} />	

   
   <Text style={{
		  color: CurrentViewMode.Mode_fontColor,
		  fontSize: size(16),
		  width: width(70),
		  marginLeft: width(2)
	  }}>

{t("CustomerAgreement")}
   </Text>
   </View>
   
	   <Text style={{
			  color: CurrentViewMode.Mode_fontColor,
			  fontSize: size(16),
			  width: width(70),
			  marginTop: height(2),
			  marginLeft: width(5)
				   
			   }}>
		 {t("CustomerAgreementSubText")} 
	   </Text>
   
   
	   <TouchableOpacity
	   onPress={() => {
		toggleCustomerAgreement();
		   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	   }}
	   style={{
		   borderWidth: 1,
		   borderColor: CurrentViewMode.Mode_fontColor,
		   height: 25,
		   borderRadius: 5,
		   width: 25,
		   position: 'absolute',
		   right: 0,
		   alignItems: 'center',  // Center horizontally
		   justifyContent: 'center',  // Center vertically
		   display: 'flex',  // Ensures the flexbox model is used
	   }}
	   >
	   {ChechCustomerAgreementt ? (
		   <MaterialIcons
		   name="check"
		   style={{
			   color: CurrentViewMode.Mode_CashChart_Cash,
			   fontSize: size(20),
		   }}
		   />
	   ) : null}
	   </TouchableOpacity>
   
   
   </View>		
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   <View style={{
	   width: "95%",
	   marginTop: height(5),
	   justifyContent: 'center',
   
   }}>
   
   <View style={{
	alignItems: 'center',
	flexDirection: 'row',
}}>

   <AntDesign name="filetext1" style={{
	fontSize: size(18),
	color: CurrentViewMode.Mode_fontColor,
	marginLeft: width(5),
   }} />	

   
	  <Text style={{
		  color: CurrentViewMode.Mode_fontColor,
		  fontSize: size(16),
		  width: width(70),
		  marginLeft: width(2)
	  }}>

    {t("CryptoAgreement")}
   </Text>
   </View>
   
   
   
	   <Text style={{
		   color: CurrentViewMode.Mode_fontColor,
		   fontSize: size(16),
		   width: width(70),
		   marginTop: height(2),
		   marginLeft: width(5)
				   
		 }}>
		  {t("CryptoAgreementSubText")} 
	   </Text>
   
   
	   <TouchableOpacity
	   onPress={() => {
		toggleCryptoAgreement();
		   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	   }}
	   style={{
		   borderWidth: 1,
		   borderColor: CurrentViewMode.Mode_fontColor,
		   height: 25,
		   borderRadius: 5,
		   width: 25,
		   position: 'absolute',
		   right: 0,
		   alignItems: 'center',  // Center horizontally
		   justifyContent: 'center',  // Center vertically
		   display: 'flex',  // Ensures the flexbox model is used
	   }}
	   >
	   {ChechCryptoAgreement ? (
		   <MaterialIcons
		   name="check"
		   style={{
			   color: CurrentViewMode.Mode_CashChart_Cash,
			   fontSize: size(20),
		   }}
		   />
	   ) : null}
	   </TouchableOpacity>
   
   
   </View>		
   
   
   
   
   
   
   
   
   
   
   
   
   <View style={{
	   width: "95%",
	   marginTop: height(5),
	   justifyContent: 'center',
   
   }}>
   
   <View style={{
	alignItems: 'center',
	flexDirection: 'row',
}}>

   <AntDesign name="filetext1" style={{
	fontSize: size(18),
	color: CurrentViewMode.Mode_fontColor,
	marginLeft: width(5),
   }} />	

   <Text style={{
		  color: CurrentViewMode.Mode_fontColor,
		  fontSize: size(16),
		  width: width(70),
		  marginLeft: width(2)
	}}>
 
     {t("OptionsAgreement")}
	   </Text>
   
   </View>
   
   
	   <Text style={{
		   color: CurrentViewMode.Mode_fontColor,
		   fontSize: size(16),
		   width: width(70),
		   marginTop: height(2),
		   marginLeft: width(5)
				   
		 }}>
		 {t("OptionsAgreementSubText")}
	   </Text>
   
   
	   <TouchableOpacity
	   onPress={() => {
		toggleOptionsAgreement();
		   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	   }}
	   style={{
		   borderWidth: 1,
		   borderColor: CurrentViewMode.Mode_fontColor,
		   height: 25,
		   borderRadius: 5,
		   width: 25,
		   position: 'absolute',
		   right: 0,
		   alignItems: 'center',  // Center horizontally
		   justifyContent: 'center',  // Center vertically
		   display: 'flex',  // Ensures the flexbox model is used
	   }}
	   >
	   {ChechOptionsAgreement ? (
		   <MaterialIcons
		   name="check"
		   style={{
			   color: CurrentViewMode.Mode_CashChart_Cash,
			   fontSize: size(20),
		   }}
		   />
	   ) : null}
	   </TouchableOpacity>
   
   
   </View>		
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   <View style={{
	   width: "95%",
	   marginTop: height(5),
	   justifyContent: 'center',
		
   }}>
   

<View style={{
	alignItems: 'center',
	flexDirection: 'row',
}}>

   <AntDesign name="filetext1" style={{
	fontSize: size(18),
	color: CurrentViewMode.Mode_fontColor,
	marginLeft: width(5),
   }} />	

   <Text style={{
		  color: CurrentViewMode.Mode_fontColor,
		  fontSize: size(16),
		  width: width(70),
		  marginLeft: width(2)
	}}>

    {t("CustodialCustomer")}
	   </Text>
   </View>


   
	   <Text style={{
		  color: CurrentViewMode.Mode_fontColor,
		  fontSize: size(16),
		   width: width(70),
		   marginTop: height(2),
		   marginLeft: width(5)
				   
	   }}>
	     {t("CustodialCustomerSubText")} 
	   </Text>
   
   
	   <TouchableOpacity
	   onPress={() => {
		toggleCustodialCustomer();
		   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	   }}
	   style={{
		   borderWidth: 1,
		   borderColor: CurrentViewMode.Mode_fontColor,
		   height: 25,
		   borderRadius: 5,
		   width: 25,
		   position: 'absolute',
		   right: 0,
		   alignItems: 'center',  // Center horizontally
		   justifyContent: 'center',  // Center vertically
		   display: 'flex',  // Ensures the flexbox model is used
	   }}
	   >
	   {ChechCustodialCustomer ? (
		   <MaterialIcons
		   name="check"
		   style={{
			   color: CurrentViewMode.Mode_CashChart_Cash,
			   fontSize: size(20),
		   }}
		   />
	   ) : null}
	   </TouchableOpacity>
   
   
   </View>		
		   
   
   
   
   </ScrollView>
   
   
   
   





{

CheckAcceptTermsAndConditions == false || ChecAccountAgreement == false || ChechCustomerAgreementt == false || ChechCryptoAgreement == false || ChechOptionsAgreement == false || ChechCustodialCustomer == false

?
<TouchableOpacity onPress={() => {
						     
	Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

}}
style={{
	
	height: size(50),
	paddingHorizontal: 20,
	width: width(65),
	right: width(5),
	zIndex: 100,
	position: 'absolute',
	borderRadius: 10,
	marginTop: height(78),
	backgroundColor: CurrentViewMode.Mode_fontColor,
	justifyContent: 'center',
	alignItems: 'center'
}}>
	<Text style={{
	 color: CurrentViewMode.Mode_bg,
		fontSize: size(18),
		alignSelf: 'center',
		fontWeight: "bold",

	}}>
	 {t("ContinueButtonText")}
	</Text>
</TouchableOpacity>


:



<TouchableOpacity onPress={() => {
   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    slideToNextPage()


}}
style={{
	
	height: size(50),
	zIndex: 100,
	paddingHorizontal: 20,
	width: width(65),
	right: width(5),
	position: 'absolute',
	borderRadius: 10,
	marginTop: height(78),
	backgroundColor: CurrentViewMode.Mode_fontColor,
	justifyContent: 'center',
	alignItems: 'center'
}}>
	<Text style={{
	 color: CurrentViewMode.Mode_bg,
		fontSize: size(18),
		alignSelf: 'center',
		fontWeight: "bold",
	}}>
	 {t("ContinueButtonText")}
	</Text>
</TouchableOpacity>


}
   
		 

   
		   
			   
   
		   
   
    <TouchableOpacity onPress={() => {
				   // ToastMessage()
				   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				   slideToPreviousPage()
   
				   
			   }}
		   
			   style={{
				   height: size(50),
				   paddingHorizontal: 20,
				   marginLeft: 20,
				   position: 'absolute',
				   borderRadius: 10,
				   marginTop: height(78),
				   backgroundColor: '#222',
				   justifyContent: 'center',
				   alignItems: 'center'
			   }}>
				   <MaterialIcons name='arrow-back' style={{
					   color: '#fff',
					   fontSize: size(25)
   
				   }} />
			   </TouchableOpacity>
		   
   
</View>

		  ),
		 },





































 {
 id: 21,
 content: (

<>  





 <View style={{width: "90%", alignSelf: 'center'}}>



<Text  style={{
	color: CurrentViewMode.Mode_fontColor,
	fontSize: size(25),
	marginLeft: width(5),
	marginTop: height(5),
	fontWeight: 'bold',
	width:"90%",
 }}>
{t("TaxIdentificationNumber")}
</Text>


<Text  style={{
	fontSize: size(16),
	color: CurrentViewMode.Mode_Sec_fontColor,
	marginLeft: width(5),
	marginTop: height(2),
	fontWeight: 'bold',
	width:"90%",
}}>
{t("TaxIdentificationNumberSubText")}
</Text>





<View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(5),
		}}>


		<Text style={{
			fontSize: size(14),
			fontWeight: "bold",
			color: CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		{t("SelectTheTypeOfIDYouAreProviding")}
		</Text>

		<TouchableOpacity onPress={reverseVisibleTax_id_type}
		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}}>
		
			<Text style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				fontSize: size(14),
			}}>
			{ChoosedTax_id_type == null ? t("NationalIDPassportOrDrivers") : ChoosedTax_id_type} 
			</Text>

			<MaterialIcons name="keyboard-arrow-down" 
			style={{
				color: CurrentViewMode.Mode_Third_fontColor,
				position: 'absolute',
				right: 15,
				fontSize: size(25)
			}}/>
		</TouchableOpacity>
		</View>



		<Modal
				animationType='slide'
				presentationStyle='pageSheet'
				visible={VisibleTax_id_type}>
			
				
					<View style={{
					height: "100%",
					width: "100%",
					backgroundColor: CurrentViewMode.Mode_bg,
					position: 'absolute',
					zIndex: 100,
				  }}>

				<TouchableOpacity onPress={reverseVisibleTax_id_type} style={{
					height: size(40),
					width: size(150),
					//backgroundColor: 'yellow',
					marginTop: height(5),

					marginLeft: width(4),
					justifyContent: 'center',
				
				}}> 
					<MaterialIcons style={{
						fontSize: size(30),
						color: CurrentViewMode.Mode_fontColor,
					}} name='close'
					 /> 

				</TouchableOpacity>

				<Text
				style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(20),
					alignSelf: 'center',
					width: "90%",
					fontWeight: 'bold',
					marginBottom: height(2)
				}}
				>
				{t("SelectYourTaxIdType")}
				</Text>




			<View style={{
				marginTop: height(2),
				width: "90%",
				alignSelf: 'center',
				flexDirection: 'row',
				alignItems: 'center',
			}}>

			<MaterialIcons name="search" style={{
				color: CurrentViewMode.Mode_fontColor,
				position: 'absolute',
				marginLeft: width(5),
				zIndex: 2,
				fontSize: size(20)
				
			}} />
				<TextInput placeholder={t("SearchBtnText")+"..."}
				placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
				//value={searchText}
				onChangeText={handleSearchTax_id_type}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 20,
				color: CurrentViewMode.Mode_fontColor,
				backgroundColor:CurrentViewMode.Mode_ButtonColor_Profile,
				fontSize: size(16),
				borderRadius: 50,
				paddingLeft: size(60),
				width: "100%",
				
			}}
			
			/>
		</View>
			
				
	
			<FlatList style={{
				width: "90%",
				alignSelf: 'center',
				top: height(1), 
			}}
			data={filteredDataTax_id_type}
			contentContainerStyle={{
				paddingBottom: height(10)
			}}  showsVerticalScrollIndicator={false}
			keyExtractor={(item) => item.code.toString()}
			renderItem={({ item }) => (
			<TouchableOpacity onPress={() => {
				setChoosedTax_id_type(item.code)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				reverseVisibleTax_id_type()
			}}
				style={{
				paddingVertical: 16,
				paddingHorizontal: 20,
				marginBottom: 8,
				borderRadius: 8,
				flexDirection: 'center',
				justifyContent: 'center'
				}}
			>
				<Text style={{ fontSize: 16, width: "85%", fontWeight: "bold", color:  CurrentViewMode.Mode_fontColor,}}>
					{item.description}
				</Text>

				{
					ChoosedTax_id_type == item.code 
					
					?
					

					<MaterialIcons name="check-circle" style={{
						color:  CurrentViewMode.Mode_fontColor,
						fontSize: size(22),
						right: size(10),
						position: 'absolute',
					}} />

				

					:
					null

				}
			
			</TouchableOpacity>
			)}
		/>
				
			
		</View>
			  </Modal>













      {ChoosedTax_id_type == null 
			  
			  
      ?

       null


      :


       <View style={{
			width: "90%",
			alignSelf: 'center',
			marginTop: height(5),
		}}>


		<Text style={{
			fontSize: size(14),
			fontWeight: "bold",
			color:  CurrentViewMode.Mode_fontColor,
			marginBottom: height(2),
		}}>
		{t("EnterTheIDNumberFromYourSelectedDocument")}
		</Text>

		<TextInput placeholder='666-55-4321' 
		placeholderTextColor={CurrentViewMode.Mode_Third_fontColor}
		onChangeText={(text) => {

			const sanitizedText = text.replace(/\s+/g, ""); // Removes all spaces
			setTAX_ID(sanitizedText); // Update TAX_ID state without spaces
		  }}
		style={{
		 paddingVertical: 18,
		 paddingHorizontal: 20,
		 borderRadius: 10,
		 color: CurrentViewMode.Mode_fontColor,
		 backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
		 zIndex: 2,
		 alignItems: 'center',
		 flexDirection: 'row',
		}} />
		
		

		</View>


		}



 </View>




 <TouchableOpacity onPress={() => {
						
						slideToNextPage()
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
						
					}}
				
					style={{
						
						height: size(50),
						paddingHorizontal: 20,
						width: width(65),
						right: width(5),
						position: 'absolute',
						borderRadius: 10,
						marginTop: height(78),
						backgroundColor:  CurrentViewMode.Mode_fontColor,
						justifyContent: 'center',
						alignItems: 'center'
					}}>
						<Text style={{
							color:  CurrentViewMode.Mode_bg,
							fontSize: size(18),
							alignSelf: 'center',
							fontWeight: "bold",
						}}>
							{t("ContinueButtonText")}
						</Text>
					</TouchableOpacity>


		
			

		

				<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

				
			}}
		
			style={{
				height: size(50),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor: CurrentViewMode.Mode_fontColor,
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<MaterialIcons name='arrow-back' style={{
					color: CurrentViewMode.Mode_bg,
					fontSize: size(25)

				}} />
			</TouchableOpacity>
		
</>

	   ),
	  },

































 {
	id: 22,
	content: (
		<View style={{ width: width(100), padding: 16 }}>

		<View
			  style={{
				width: '100%',
			
	
			  }}>
		<Text
		  style={{
			color: CurrentViewMode.Mode_fontColor,
			fontSize: size(25),
			marginLeft: width(5),
			marginTop: height(5),
			fontWeight: 'bold',
			width:"90%",
		  }}
		>
		{t("ReadyForaSelfie")}
		</Text>
		
		<Text
		  style={{
			fontSize: size(14),
			color: CurrentViewMode.Mode_Sec_fontColor,
			marginLeft: width(5),
			marginTop: height(2),
			fontWeight: 'bold',
			width:"90%",
		  }}>
		{t("ReadyForaSelfieSubText")}
		
		</Text>




		<View style={{
			marginTop: height(8),
			//backgroundColor: "yellow",
			width: "90%",
			alignSelf: 'center',
			//height: 100,
			flexDirection: 'row',
			alignItems: 'center',
		}}>
			<MaterialIcons name="wifi" style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(20)

			}} />


			<Text style={{
				color: CurrentViewMode.Mode_fontColor,
				marginLeft: width(5),
				fontSize: size(16)
				
			}}>
			{t("GoodInternetConnection")}
			</Text>



			<MaterialIcons name="check" style={{
				color: CurrentViewMode.Mode_CashChart_Cash,
				fontSize: size(20),
				right: 0,
				position: 'absolute',
			}} />
		</View>







		<View style={{
			marginTop: height(5),
			//backgroundColor: "yellow",
			width: "90%",
			alignSelf: 'center',
			//height: 100,
			flexDirection: 'row',
			alignItems: 'center',
		}}>
			<MaterialIcons name="camera-front" style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(20)

			}} />


			<Text style={{
				color: CurrentViewMode.Mode_fontColor,
				marginLeft: width(5),
				fontSize: size(16)
				
			}}>
			{t("DeviceCameraActive")}
			</Text>



			<MaterialIcons name="check" style={{
				color: CurrentViewMode.Mode_CashChart_Cash,
				fontSize: size(20),
				right: 0,
				position: 'absolute',
			}} />
		</View>











		<View style={{
			marginTop: height(5),
			//backgroundColor: "yellow",
			width: "90%",
			alignSelf: 'center',
			//height: 100,
			flexDirection: 'row',
			alignItems: 'center',
		}}>
			<MaterialCommunityIcons name="passport" style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(20)

			}} />


			<Text style={{
				color: CurrentViewMode.Mode_fontColor,
				marginLeft: width(5),
				fontSize: size(16)
				
			}}>
			{t("IDDocumentReady")}
			</Text>



		
			<MaterialIcons name="check" style={{
				color: CurrentViewMode.Mode_CashChart_Cash,
				fontSize: size(20),
				right: 0,
				position: 'absolute',
			}} />
		</View>












		<View style={{
			marginTop: height(5),
			//backgroundColor: "yellow",
			width: "90%",
			alignSelf: 'center',
			//height: 100,
			flexDirection: 'row',
			alignItems: 'center',
		}}>
			<FontAwesome name="smile-o" style={{
				color: CurrentViewMode.Mode_fontColor,
				fontSize: size(20)

			}} />


			<Text style={{
				color:  CurrentViewMode.Mode_fontColor,
				marginLeft: width(5),
				fontSize: size(16)
				
			}}>
			{t("Smile")}
			</Text>



		
			<MaterialIcons name="check" style={{
				color:  CurrentViewMode.Mode_CashChart_Cash,
				fontSize: size(20),
				right: 0,
				position: 'absolute',
			}} />
		</View>








<View style={{
	width: "90%",
	alignSelf: 'center',
	marginTop: height(5),
	flexDirection: 'row',
	alignItems: 'center',

}}>
	<Text style={{
	   color:  CurrentViewMode.Mode_fontColor,
	   fontSize: size(12),
	   width: width(70)
				
    }}>

	{t("TherebyAcceptOnfido")}
	
	</Text>


	<TouchableOpacity
	onPress={() => {
		toggleCheckAcceptTermsAndConditionsOnfido();
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	}}
	style={{
		borderWidth: 1,
		borderColor:  CurrentViewMode.Mode_fontColor,
		height: 25,
		borderRadius: 5,
		width: 25,
		position: 'absolute',
		right: 0,
		alignItems: 'center',  // Center horizontally
		justifyContent: 'center',  // Center vertically
		display: 'flex',  // Ensures the flexbox model is used
	}}
	>
	{CheckAcceptTermsAndConditionsOnfido ? (
		<MaterialIcons
		name="check"
		style={{
			color:  CurrentViewMode.Mode_CashChart_Cash,
			fontSize: size(20),
		}}
		/>
	) : null}
	</TouchableOpacity>


</View>

	</View>




	<View style={{ height: height(6), marginTop: height(7),  width: "90%", }}>
			
			<Image source={require("../../assets/images/onfido-vector-logo.png")}
			style={{
				height: "100%",
				width: "100%",
				resizeMode: "contain"
			}} />
			</View>


	
		
		

			<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				slideToPreviousPage()

				
			}}
		
			style={{
				height: size(48),
				paddingHorizontal: 20,
				marginLeft: 20,
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor: CurrentViewMode.Mode_fontColor,
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<MaterialIcons name='arrow-back' style={{
					color:  CurrentViewMode.Mode_bg,
					fontSize: size(25)

				}} />
			</TouchableOpacity>




		  {
			CheckAcceptTermsAndConditions == false

			?

			<TouchableOpacity onPress={() => {
				// ToastMessage()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)


				
			}}
		
			style={{
				paddingVertical: 12,
				paddingHorizontal: 20,
				width: width(65),
				right: width(5),
				position: 'absolute',
				borderRadius: 10,
				marginTop: height(78),
				backgroundColor:  CurrentViewMode.Mode_fontColor,
				opacity: 0.4,
			}}>
				<Text style={{
					color:  CurrentViewMode.Mode_bg,
					fontSize: size(18),
					alignSelf: 'center',
					fontWeight: "bold",
				}}>
				{t("ContinueButtonText")}
				</Text>
			</TouchableOpacity>


				:


				<TouchableOpacity onPress={async () => {

				
					const database = getDatabase();
					  
				
			    	const newUUid = uuid.v4();
					const userIduuID = uuid.v4();
					const idempotencyKeyUuid = uuid.v4();

		
					const date = new Date();  // Current date and time
					const isoString = date.toISOString(); // Format in ISO 8601 format
				
					


		


			  	try {
						// Step 1: Create the Alpaca account
						setStatus('Creating Alpaca account...');
				  
						const newAccountPayload = {
							contact: {
							  street_address: [street],
							  email_address: email,
							  phone_number: CurrentCode + code,
							  city: city,
							  state: state,
							  postal_code: Postal_code,
							},
							identity: {
								tax_id_type: ChoosedTax_id_type,
								tax_id: TAX_ID,
								funding_source: [ChoosedFunding_Sourced],
								given_name: FirstName,
								family_name: LastName, 
								country_of_citizenship: Iso3Country,
								country_of_birth: Iso3Country,
								country_of_tax_residence: Iso3Country, 
								date_of_birth: `${YearBirthday}-${MonthBirthday}-${DayBirthday}`,
								liquidity_needs: ChoosedLiquidityNeedsText,
								investment_experience_with_stocks: ChoosedInvestmentExperience,
								investment_experience_with_options: ChoosedInvestmentExperienceOptions,
								risk_tolerance: ChoosedRiskTolerance,
								investment_objective: ChoosedInvestmentObjective,
								investment_time_horizon: ChoosedInvestmentTimeHorizon,
								annual_income_min: ChoosedMinimumAnnualIncome,
								annual_income_max: ChoosedMaximumAnnualIncome,
								liquid_net_worth_min: ChoosedMinLiquidNetWorth,
								liquid_net_worth_max: ChoosedMaxLiquidNetWorth,
								total_net_worth_min: ChoosedMinTotalNetWorth,
								total_net_worth_max: ChoosedMaxTotalNetWorth,
		
							},  
							disclosures: {
							  is_control_person: false,
							  is_affiliated_exchange_or_finra: false,
							  is_politically_exposed: false,
							  immediate_family_exposed: false,
							  employment_status: ChoosedEmploymentStatus,
							},
							trusted_contact: {
							  given_name: FirstName,
							  family_name: LastName,
							  email_address: email,
							  phone_number: CurrentCode + code,
							  city: city,
							  state: state,
							  postal_code: Postal_code,
							  country: Iso3Country,
							},
							agreements: [
							  { agreement: 'margin_agreement', signed_at: isoString.split('.')[0] + 'Z', ip_address: UserIPAddress },
							  { agreement: 'account_agreement', signed_at: isoString.split('.')[0] + 'Z', ip_address: UserIPAddress },
							  { agreement: 'customer_agreement', signed_at: isoString.split('.')[0] + 'Z', ip_address: UserIPAddress },
							  { agreement: 'crypto_agreement', signed_at: isoString.split('.')[0] + 'Z', ip_address: UserIPAddress },
							],
							account_type: 'trading',
							account_sub_type: 'traditional',
						  };
				  
						// Create the Alpaca account
					    const createAccountResponse = await axios.post(
						  'https://broker-api.sandbox.alpaca.markets/v1/accounts',
						  newAccountPayload,
						  {
							headers: {
							  accept: 'application/json',
							  'content-type': 'application/json',
							  authorization: EXPO_ALPACA_SANDBOX_AUTH_HEADER

							},
						  }
						);
				  
						const { id: newAccountId, userId: alpacaUserId } = createAccountResponse.data;
				  
						// Store the Alpaca account ID in state
						setAlpacaAccountId(newAccountId);
						setAlpacaUserId(alpacaUserId); // Store the Alpaca user ID
				  
						console.log('New Alpaca Account ID:', newAccountId);
						console.log('Alpaca User ID:', alpacaUserId);
				  
						// Step 2: Fetch Onfido token for KYC
						setStatus('Fetching Onfido token...');
						const getTokenResponse = await axios.get(
						  `https://broker-api.sandbox.alpaca.markets/v1/accounts/${newAccountId}/onfido/sdk/tokens`,
						  {
							headers: {
							  accept: 'application/json',
							  authorization: EXPO_ALPACA_SANDBOX_AUTH_HEADER

							},
						  }
						);
				     
						const { token } = getTokenResponse.data;
						setOnfidoToken(token);
						console.log('Onfido Token:', token);
				 
						// Step 3: Launch Onfido flow for document capture
						setStatus('Launching Onfido flow...');
						const onfidoResult = await Onfido.start({
						  sdkToken: token,
						  flowSteps: {
							welcome: true,
							captureFace: {
							  type: OnfidoCaptureType.PHOTO,
							},
							captureDocument: {
							  docType: OnfidoDocumentType.NATIONAL_IDENTITY_CARD,
							  countryCode: OnfidoCountryCode[ISO3Code],
							},
						  },
						});
				  
						console.log('Onfido success:', onfidoResult);
				
						// Step 4: Store Onfido result data in state
						const kycData = {
						  documentFront: onfidoResult.document.front.id, // Onfido front document ID
						  documentBack: onfidoResult.document.back.id, // Onfido back document ID
						  face: onfidoResult.face.id, // Onfido face ID
						};
				  
						setOnfidoResultData(kycData); // Store Onfido result data in state
				  
					// Step 5: Update Onfido SDK Outcome
					setStatus('Updating Onfido SDK Outcome...');
					try {
						const updateResponse = await axios.patch(
						  `https://broker-api.sandbox.alpaca.markets/v1/accounts/${newAccountId}/onfido/sdk`,
						  {
							outcome: 'USER_COMPLETED',
							reason: 'User completed the KYC process successfully',
							token: token, // Replace with actual Onfido token
						  },
						  {
							headers: {
							  'Content-Type': 'application/json',
							  authorization: EXPO_ALPACA_SANDBOX_AUTH_HEADER // Ensure API key is correct
							},
						  }
						);
					  
						console.log('Onfido SDK Outcome updated successfully:', updateResponse.data);
					  } catch (error) {
						console.error('Error updating Onfido SDK Outcome:', error.response?.data || error.message);
					  }
					  
					  
				


				
					  set(ref(database, `/users/${CurrentCode}+${code}`), {
						Alpaca: newAccountPayload,
						kycData,
					  })
						.then(() => {
						  console.log('Data set.');
						  slideToNextPage();
						})
						.catch((error) => {
						  console.error("Error setting data in Firebase:", error);
						});
					  

					  

					
					

			
				  
					  } catch (error) {
						console.error('Error:', error.response?.data || error.message);
						setStatus('Error in creating account, fetching token, or Onfido flow. Check console.');
					  }  
				



					
					}} 
			
				style={{
					paddingVertical: 12,
					paddingHorizontal: 20,
					width: width(65),
					right: width(5),
					position: 'absolute',
					borderRadius: 10,
					marginTop: height(78),
					backgroundColor: CurrentViewMode.Mode_fontColor,
				}}>
					<Text style={{
						color: CurrentViewMode.Mode_bg,
						fontSize: size(18),
						alignSelf: 'center',
						fontWeight: "bold",
					}}>
				{t("ContinueButtonText")}
					</Text>
				</TouchableOpacity>


		  }


		
	

	</View>
   ),
  },











 {
 id: 23,
 content: (
 <View style={{ width: width(100), paddin: 10 }}>



	<LottieView
		loop={false} 
        autoPlay
        ref={animation}
        style={{
          width: height(15),
          height: height(20),
		  alignItems: 'center',
		  marginTop: height(15),
		  alignSelf: 'center',
		  alignContent: 'center',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('../../assets/Account_Set_new.json')}
      />
      
	  <Text style={{
		marginTop: height(2),
		fontSize: size(30),
		color: CurrentViewMode.Mode_fontColor,
		alignSelf: 'center',
		width: "90%",
		fontWeight: "bold",
		textAlign: 'center',
	  }}>
		{t("AllSet")}
	  </Text>







	  <TouchableOpacity onPress={async () => {



					const auth = getAuth();
						const firestore = getFirestore();
						const database = getDatabase();
						
						const newUUid = uuid.v4();
						const userIduuID = uuid.v4();
						const idempotencyKeyUuid = uuid.v4();
	
			
						const date = new Date();  // Current date and time
						const isoString = date.toISOString(); // Format in ISO 8601 format
					
						

						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

					
					const newAccountPayload = {
						contact: {
						  street_address: [street],
						  email_address: email,
						  phone_number: CurrentCode + code,
						  city: city,
						  state: state,
						  postal_code: Postal_code,
						},
						identity: {
							AlpacaAccountId: AlpacaAccountId,
							tax_id_type: ChoosedTax_id_type,
							tax_id: TAX_ID,
							funding_source: [ChoosedFunding_Sourced],
							given_name: FirstName,
							family_name: LastName, 
							country_of_citizenship: Iso3Country,
							country_of_birth: Iso3Country,
							country_of_tax_residence: Iso3Country, 
							date_of_birth: `${YearBirthday}-${MonthBirthday}-${DayBirthday}`,
							liquidity_needs: ChoosedLiquidityNeedsText,
							investment_experience_with_stocks: ChoosedInvestmentExperience,
							investment_experience_with_options: ChoosedInvestmentExperienceOptions,
							risk_tolerance: ChoosedRiskTolerance,
							investment_objective: ChoosedInvestmentObjective,
							investment_time_horizon: ChoosedInvestmentTimeHorizon,
							annual_income_min: ChoosedMinimumAnnualIncome,
							annual_income_max: ChoosedMaximumAnnualIncome,
							liquid_net_worth_min: ChoosedMinLiquidNetWorth,
							liquid_net_worth_max: ChoosedMaxLiquidNetWorth,
							total_net_worth_min: ChoosedMinTotalNetWorth,
							total_net_worth_max: ChoosedMaxTotalNetWorth,
	
						},  
						disclosures: {
						  is_control_person: false,
						  is_affiliated_exchange_or_finra: false,
						  is_politically_exposed: false,
						  immediate_family_exposed: false,
						  employment_status: ChoosedEmploymentStatus,
						},
						trusted_contact: {
						  given_name: FirstName,
						  family_name: LastName,
						  email_address: email,
						  phone_number: CurrentCode + code,
						  city: city,
						  state: state,
						  postal_code: Postal_code,
						  country: Iso3Country,
						},
						agreements: [
						  { agreement: 'margin_agreement', signed_at: isoString.split('.')[0] + 'Z', ip_address: UserIPAddress },
						  { agreement: 'account_agreement', signed_at: isoString.split('.')[0] + 'Z', ip_address: UserIPAddress },
						  { agreement: 'customer_agreement', signed_at: isoString.split('.')[0] + 'Z', ip_address: UserIPAddress },
						  { agreement: 'crypto_agreement', signed_at: isoString.split('.')[0] + 'Z', ip_address: UserIPAddress },
						],
						account_type: 'trading',
						account_sub_type: 'traditional',
					  };



					  console.log(ChoosedInvestmentExperienceOptionsText)

				
					  auth
					  .createUserWithEmailAndPassword(email, FirstName+LastName+NewPasswordPin)
					  .then(async () => {
						console.log('User account created & signed in!');
					
						const currentUser = auth.currentUser;
					
						if (currentUser) {
						  const userId = currentUser.uid;
						  console.log("Current User ID:", currentUser.uid);


					
						  await setDoc(doc(firestore, 'users', currentUser.uid), {
							Email:email,
							Email_Notification: true,
							Push_Notification: true,
							AlpacaAccountId: AlpacaAccountId,
							userId: currentUser.uid,
							onfidoResultData,
							newAccountPayload,
							Password: FirstName+LastName+NewPasswordPin, 
							AppPin: NewPasswordPin,
						  }); 

						  	 await set(ref(getDatabase(), `/users/${currentUser.uid}/Currentlanguage`), {
								lang: currentLanguage,
							  });
							  SheetManager.hide("SignUp_Sheet")
							  router.replace("/(tabs)/Home/home");






						  const handleWalletCreation = async () => {
							try {
							
							  // Store the wallets in Firestore under the user's ID
							  await setDoc(doc(firestore, 'users', currentUser.uid), {
								AlpacaAccountId: AlpacaAccountId,
								Email_Notification: true,
								Push_Notification: true,
								userId: currentUser.uid,
								onfidoResultData,
								newAccountPayload,
								Password: FirstName+LastName+NewPasswordPin, 
								AppPin: NewPasswordPin,
							  });

					
							 await set(ref(database, `/users/${currentUser.uid}/Currentlanguage`), {
								lang:  currentLanguage,
							  });
										
							
							} catch (error) {
							  console.log(error.message);
							}
						  };
						  handleWalletCreation()
				
						} else {
						  console.error("No user is currently logged in.");
						}
					  })
					  .catch((error) => {
						if (error.code === 'auth/email-already-in-use') {
						  console.log('That email address is already in use!');
						}
					
						if (error.code === 'auth/invalid-email') {
						  console.log('That email address is invalid!');
						}
					
						console.error(error);
					  });
				

						
					}}
				
					style={{
						
						height: size(50),
						paddingHorizontal: 20,
						width: "90%",
						right: width(5),
						position: 'absolute',
						borderRadius: 10,
						marginTop: height(78),
						backgroundColor: CurrentViewMode.Mode_fontColor,
						justifyContent: 'center',
						alignItems: 'center'
					}}>
						<Text style={{
							color: CurrentViewMode.Mode_bg,
							fontSize: size(18),
							alignSelf: 'center',
							fontWeight: "bold",
						}}>
							   Let's Goo
						</Text>
					</TouchableOpacity>




 </View>


)}
	  
], [CurrentCode, otpInputRef, EmailInputRef, toggleSwitch, isNumberFocused, isOtpFocused, isPhoneFocused, isTextFocused, code, handlePresentModalPress, slideToNextPage,]); 





























  
	return (
	
	




		
		
		 
	   <>
		

{/* Error Toast Message */}

	 
{
	currentPage == 0

	?
	showToast && (
        <ToastMessage
          message="Please enter a valid phone numbe"
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}

	 
{
	currentPage == 1

	?
	showToast && (
        <ToastMessage
          message="Wrong Code"
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}



{
	currentPage == 2

	?
	showToast && (
        <ToastMessage
          message="Please enter a valid email address to proceed"
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}


{
	currentPage == 2

	?
	showToast && (
        <ToastMessage
          message="Please enter a valid email address to proceed"
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}



{
	currentPage == 3

	?
	showToast && (
        <ToastMessage
          message="Please enter your PIN to continue."
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}





{
	currentPage == 4

	?
	showToast && (
        <ToastMessage
          message="Please enter the correct PIN to continue."
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}









{
	currentPage == 6 &&  FirstName == "" && LastName == "" 

	?
	showToast && (
        <ToastMessage
          message="Please provide your legal name."
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}








{
	currentPage == 7 

	?
	showToast && (
        <ToastMessage
          message="Please provide your officially registered address."
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}







{
	currentPage == 8

	?
	showToast && (
        <ToastMessage
          message="Please enter your birth date."
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}







{
	currentPage == 9

	?
	showToast && (
        <ToastMessage
          message="Please enter your place of birth."
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}






{
	currentPage == 10

	?
	showToast && (
        <ToastMessage
          message="Please select your citizenship."
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}







{
	currentPage == 11

	?
	showToast && (
        <ToastMessage
          message="Please select where you're taxed."
          onClose={() => setShowToast(false)}
        />
      )

	  :

	  null

}





		
		
		
	
		


<View style={{
	height: "100%",
	width: "100%"
}}>





		
{ 

		  
//isSheetOpenLogIn == false
//  sheetIndex == 1 || sheetIndexPhonenumber == 1 || sheetIndexLogIn == 1 || isSheetOpenLogIn == true || isSheetOpen == true && isSheetOpenPhoneNumber == true

//?

<> 




<View
	style={{
	  width: '90%',
	  position: 'absolute',
	  bottom: height(6),
	  zIndex: 1000,
	  alignSelf: 'center',

	}}
  >



<TouchableOpacity onPress={() => {
	SheetManager.show("SignUpLanguage_Sheet")
}}
style={{

	paddingVertical: 12,
	paddingHorizontal: 20,
	marginTop: height(-13),
	flexDirection: 'row',
	alignItems: 'center',
	marginLeft: width(0)
}}>

<View style={{
height: size(32),
width: size(32),
borderRadius: size(32)/2,
backgroundColor:  CurrentViewMode.Mode_fontColor,
alignSelf: 'center',
justifyContent: 'center',
overflow: 'hidden',

	}}>

{
	 currentLanguage == "en"
	 ?


	<CountryFlag isoCode="us" size={35} />

	:

	null

}


{
	 currentLanguage == "fr"
	 ?

<CountryFlag style={{alignSelf: 'center'}} isoCode="fr" size={31} />

	:

	null

}



{
	 currentLanguage == "de"
	 ?


	<CountryFlag isoCode="de" size={35} />

	:

	null

}
	</View>

	<Text style={{
		color: CurrentViewMode.Mode_fontColor,
		fontWeight: "bold",
		fontSize: size(18),
		marginLeft: width(3)
	}}>
		{t("TitleTextlanguageApp")}
	</Text>
</TouchableOpacity>




  <View
	style={{
	  width: '100%',
	  position: 'absolute',
	//  bottom: height(6),
	  zIndex: 1000,
	  alignSelf: 'center',
	  flexDirection: 'row',
	  marginTop: width(-13)
	}}
  >





<TouchableOpacity
	  onPress={() => {
		
		SheetManager.show("LogIn_Sheet")
		

	
	  }}
	  style={{
		flexDirection: 'row',
		paddingVertical: 15,
		paddingHorizontal: width(5),
		alignItems: 'center',
	//	backgroundColor: '#fff',
		borderRadius: 10,
	/*	shadowColor: '#fff',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 10.32,
		elevation: 16,*/
	  }}
	>
	  <Text
		style={{
			color: CurrentViewMode.Mode_fontColor,
		  fontSize: size(18),
		  fontWeight: 'bold',
		}}
	  >
	{t("LogInText")}	
	  </Text>

	  <MaterialIcons name="arrow-forward-ios" style={{
		color: CurrentViewMode.Mode_fontColor,
		fontSize: size(16),
		marginLeft: width(1),
	  }} />
	</TouchableOpacity>



	<TouchableOpacity
	  onPress={async () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		
		setSheetIndex(1);
		handleOpenSheet(); 
	
	  }}
	  style={{
		paddingVertical: 15,
		paddingHorizontal: width(13),
		backgroundColor:  CurrentViewMode.Mode_fontColor,
		borderRadius: 10,
		position: 'absolute',
		right: width(2),
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 10.32,
		elevation: 16,
	  }}
	>
	  <Text
		style={{
		  fontSize: size(18),
		  color:  CurrentViewMode.Mode_bg,
		  fontWeight: 'bold',
		}}
	  >
		{t("SignUpText")}	 
	  </Text>
	</TouchableOpacity>


  </View>

  </View>

  </>

//:


//null




	}




			

			
			<Swiper autoplay={true} autoplayTimeout={12}
			  style={styles.wrapper}
			  showsButtons={false}
			  paginationStyle={{
				width: '100%',
				height: 50,
				top: height(5),
				alignSelf: 'center',
				position: 'absolute',
			  }}
			  dotStyle={{
				height: 4,
				backgroundColor: CurrentViewMode.Mode_ButtonColor_Profile,
				width: 100,
			  }}
			  activeDot={
				<View
				  style={{
					backgroundColor: CurrentViewMode.Mode_fontColor,
					width: 100,
					height: 4,
					borderRadius: 4,
					marginLeft: 3,
					marginRight: 3,
					marginTop: 3,
					marginBottom: 3,
				  }}
				/>
			  }
			>


				
			  <View style={styles.slide1}>
				<View
				  style={{
				//	position: 'absolute',
					height: size(590),
					width: size(600),
					alignSelf: 'center',
					marginTop: height(12),
				  }}
				>
				  <Image
					source={require('../../assets/Image1SignUO.png')}
					style={{
					  height: '100%',
					//  alignSelf: 'center',
					  marginLeft: width(15),
					  resizeMode: 'contain',
					  width: '100%',
					}}
				  />
				</View>
  
				<Text
				  style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(25),
					marginLeft: width(9),
					marginTop: currentLanguage == "fr"?  height(-10) : height(-7),
					width:  '80%',
					fontWeight: 'bold',
				  }}
				>
					{t("Tab1SignUpAuthHome")}
				</Text>
			  </View>
  
			  <View style={styles.slide2}>
				<View
				  style={{
					height: size(600),
					marginLeft: width(-100),
					width: size(600),
					alignSelf: 'center',
					marginTop: height(5),
					transform: [
						{ rotate: '15deg' }, // rotate counter-clockwise
					  ],
				  }}
				>
				  <Image
					source={require('../../assets/Image1SignUp2.png')}
					style={{
						height: '100%',
						//  alignSelf: 'center',
						  marginLeft: width(15),
						  
						  resizeMode: 'contain',
						  width: '100%',
					}}
				  />
				</View>
  
				<Text
				  style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(25),
					marginLeft: width(9),
					marginTop: height(-4),
					width: '80%',
					fontWeight: 'bold',
				  }}
				>
				{t("Tab2SignUpAuthHome")}
				</Text>
			  </View>
  
			  <View style={styles.slide3}>

			 

			  <View
				  style={{
					height: size(580),
					width: size(580),
					alignSelf: 'center',
					marginTop: height(13),
					marginLeft: width(-10),
					transform: [
						{ rotate: '35deg' }, // rotate counter-clockwise
					  ],
				
				  }}
				>
				  <Image
					source={require('../../assets/Image1SignUp3.png')}
					style={{
						height: '100%',
						//  marginLeft: width(8),
						  resizeMode: 'contain',
						  width: '100%',
						 
					}}
				  />
				</View>
				<Text
				  style={{
					color: CurrentViewMode.Mode_fontColor,
					fontSize: size(25),
					marginLeft: width(9),
					marginTop: height(-9),
					width: '80%',
					fontWeight: 'bold',
				  }}
				>
				{t("Tab3SignUpAuthHome")}
			
				</Text>
			  </View>
			</Swiper>
  




			</View>






























































































 {/* BottomSheet with Main Modal */}
	
 <ActionSheet  
 ref={SignUp_Sheet}
 gestureEnabled={true}
 isModal={true}
 backgroundInteractionEnabled={false}  // ✅ Prevents closing on background tap
 keyboardHandlerEnabled={false} // ✅ Prevents closing when keyboard opens
 
 onClose={() => {
     setIsSheetOpenLogIn(false)
 }}
  CustomHeaderComponent={
  <> 
  <View
   style={{
   backgroundColor: CurrentViewMode.Mode_bg,
   height: height(0.6), // Height of the indicator
   width: width(11),
    borderRadius: 50,
    alignSelf: 'center',
   position: 'absolute',
   top: -15, // Moves the indicator down (distance from the top)
   }}
  />
         
  </>
 }
             
 containerStyle={{

    maxHeight: height(92),
    backgroundColor: CurrentViewMode.Mode_bg,
    height: height(92),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    
  }} 	
  style={{
    height: "100%",
    backgroundColor: CurrentViewMode.Mode_bg,
}}>

         
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={height(16)} // ✅ Moves up more when keyboard opens

      style={{
        height: "100%",
        width: "100%"
      }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{
              height: "100%",
        width: "100%"
        }}>


    {/* Animated View for sliding pages */}
	<Animated.View
          style={{
            flexDirection: 'row',
           width: "100%", height: "100%",
            transform: [{ translateX }],
          }}
        >


			

			
          {slides.map((slide) => (
            <View key={slide.id} style={{ width: "100%", height: "100%" }}>
              {slide.content}
            </View>
          ))}


        </Animated.View>


{
		// Buttons UI and UX 

		(isTextFocused || isNumberFocused) && (
	


			<View
		   style={{
            backgroundColor: CurrentViewMode.Mode_bg,
            paddingHorizontal: size(20),
      
            flexDirection: 'row',
		}}>


			<>




	{

		
		currentPage == 0

		?

		<> 
					
		{slides?.length > 0 && currentPage < slides.length - 1 && (
			
			<TouchableOpacity
			onPress={async () => {
			
				await axios.post("https://sendauthcode-jcraafcjna-uc.a.run.app", {
			
				}).then((res) => {
	
					console.log(res)
					slideToNextPage()
				}).catch((err) => {
					console.log(err)
				})
	
		/*	await axios.post("https://sendauthcode-jcraafcjna-uc.a.run.app", {
			
			}).then((res) => {

				console.log(res)

			}).catch((err) => {
				console.log(err)
			})

*/

			//	handleGenerateToken()
			
			/*	const accountSid = 'AC6217c3d5f3aecec12ba807d88ba12d0d';
				const authToken = token; // replace with your real Auth Token
				const serviceSid = 'VA453aef340f6b9038a97c10476ef54dee';
				const phoneNumber = '+49015218103719'; // recipient phone number

				const sendVerificationUrl = `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`;

				try {
				const response = await axios.post(
					sendVerificationUrl,
					new URLSearchParams({
					To: phoneNumber,
					Channel: 'sms',
					}),
					{
					auth: {
						username: accountSid,
						password: authToken,
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					}
				);

				console.log('Verification SID:', response.data.sid);
				} catch (error) {
				console.error('Error sending verification:', error.response?.data || error.message);
				}

*/






				// Account SID
			//	VA9720ce5c66a161f0ac0b7c2212df3da9

			// Auth Token
			// bca495bc7c22fc96385946947da6d4da


				/*handleGenerateToken()
			//	slideToNextPage();
				console.log(currentPage)
				// Check if phone number has strings in it

			const isAlpha = (str) => /^[a-zA-Z]+$/.test(str);  // Regular expression to match letters only

				console.log(code)

				if(currentPage == 0 && CurrentCode == null || code == null || CurrentCode == "" || isAlpha(code) == true) {
					setShowToast(true)
					
				} else {
					handleGenerateToken()
					slideToNextPage();
				}
				
	 */
			}}
			style={{
					paddingVertical: 12,
				paddingHorizontal: 20,
				marginLeft: width(52),
				
				width: 150,
				borderRadius: 10,
				backgroundColor: CurrentViewMode.Mode_fontColor,
				opacity: !code || !CurrentCode ? 0.4 : 1,
				shadowColor: '#ddd',
				shadowOffset: {
				width: 0,
				height: 4,
				},
				shadowOpacity: 0.3,
				shadowRadius: 4.65,
				elevation: 8,
			}}
			>
			<Text
				style={{
				color: CurrentViewMode.Mode_bg,
				alignSelf: 'center',
				fontSize: size(18),
				fontWeight: 'bold',
				}}>
				{t("ContinueButtonText")}
			</Text>
			</TouchableOpacity>
		)}





{currentPage > 0 && (
  <TouchableOpacity
    onPress={slideToPreviousPage}
	style={{
		marginLeft: width(4),
	
        width: 50,
		height: 50,
        borderRadius: 10,
        backgroundColor:  CurrentViewMode.Mode_fontColor,
        opacity: !code || !CurrentCode ? 0.4 : 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	
      }}
    >
   <MaterialIcons name="arrow-back"
        style={{
          alignSelf: 'center',
          fontSize: size(25),
          fontWeight: 'bold',
		  color: CurrentViewMode.Mode_bg,

        }}
       />
  </TouchableOpacity>
)}

</>



:


	null






	}














{/*
// Confirm Code
		
currentPage == 1

?

<> 
			
{slides?.length > 0 && currentPage < slides.length - 1 && (
	
	<TouchableOpacity
	onPress={() => {

		//slideToNextPage();

	/*	if (CurrentTypedInVerificationCode == TokenFromDB) {

			console.log(currentPage)
			//handleGenerateToken()
			slideToNextPage();
		} else {
			setShowToast(true)
		}

		
	}}
	style={{
	    paddingVertical: 12,
		paddingHorizontal: 20,
		marginLeft: width(52),
		
		width: 150,
		borderRadius: 10,
		backgroundColor: CurrentViewMode.Mode_fontColor,
		opacity: !code || !CurrentCode ? 0.4 : 1,
		shadowColor: '#ddd',
		shadowOffset: {
		width: 0,
		height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	}}
	>
	<Text
		style={{
		color: CurrentViewMode.Mode_bg,
		alignSelf: 'center',
		fontSize: size(18),
		fontWeight: 'bold',
		}}>
		Next
	</Text>
	</TouchableOpacity>
)}





{currentPage > 0 && (
<TouchableOpacity
onPress={slideToPreviousPage}
style={{
marginLeft: width(4),

width: 50,
height: 50,
borderRadius: 10,
backgroundColor: CurrentViewMode.Mode_fontColor,
justifyContent: 'center',
alignItems: 'center',
position: 'absolute',

}}
>
<MaterialIcons name="arrow-back"
style={{
  alignSelf: 'center',
  fontSize: size(25),
  fontWeight: 'bold',
  color: CurrentViewMode.Mode_bg,

}}
/>
</TouchableOpacity>
)}

</>



:


null






*/}











{/*

		
currentPage == 0 && isSheetOpenLogIn == false 

?

<> 


{
		currentPage == 1  

		?

		<> 
					
		{slides?.length > 0 && currentPage < slides.length - 1 && (
			
			<TouchableOpacity
			onPress={() => {

				console.log(currentPage)

				if (CurrentTypedInVerificationCode == TokenFromDB) {
					handleGenerateToken()
					slideToNextPage();
				} else {
					setShowToast(true)
				}
			
				
			}}
			style={{
				paddingVertical: 12,
				paddingHorizontal: 20,
				marginLeft: width(52),
				
				width: 150,
				borderRadius: 10,
				backgroundColor: CurrentViewMode.Mode_fontColor,
				opacity: !code || !CurrentCode ? 0.4 : 1,
				shadowColor: '#ddd',
				shadowOffset: {
				width: 0,
				height: 4,
				},
				shadowOpacity: 0.3,
				shadowRadius: 4.65,
				elevation: 8,
			}}
			>
			<Text
				style={{
				alignSelf: 'center',
				fontSize: size(18),
				fontWeight: 'bold',
				}}>
				Next
			</Text>
			</TouchableOpacity>
		

)}

</>



:


	null






	*/}




{/*currentPage > 0 && (
  <TouchableOpacity
    onPress={slideToPreviousPage}
	style={{
		marginLeft: width(4),
	
        width: 50,
		height: 50,
        borderRadius: 10,
        backgroundColor: '#222',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	
      }}
    >
   <MaterialIcons name="arrow-back"
        style={{
          alignSelf: 'center',
          fontSize: size(25),
          fontWeight: 'bold',
		  color: '#fff',

        }}
       />
  </TouchableOpacity>
)}

</>



:


	null



*/}













{
	// Email Next BTN

		currentPage == 2

		?

		<> 
					
		{slides?.length > 0 && currentPage < slides.length - 1 && (
			
			<TouchableOpacity
			onPress={() => {
				
			if (email == null || email == "" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {

					setShowToast(true)
				} else {
					//handleGenerateToken()
					slideToNextPage();
				} 
			
				
			}}
			style={{

				paddingVertical: 12,
				paddingHorizontal: 20,
				marginLeft: width(52),
				
				width: 150,
				borderRadius: 10,
				backgroundColor: CurrentViewMode.Mode_fontColor,
				opacity: email == null || email == "" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ? 0.4 : 1,
				shadowColor: '#ddd',
				shadowOffset: {
				width: 0,
				height: 4,
				},
				shadowOpacity: 0.3,
				shadowRadius: 4.65,
				elevation: 8,
				
			}}
			>
			<Text
				style={{
				color:  CurrentViewMode.Mode_bg,
				alignSelf: 'center',
				fontSize: size(18),
				fontWeight: 'bold',
				}}>
				{t("ContinueButtonText")}
			</Text>
			</TouchableOpacity>
		)}





{currentPage > 0 && (
  <TouchableOpacity
    onPress={slideToPreviousPage}
	style={{
		marginLeft: width(4),
	
        width: 50,
		height: 50,
        borderRadius: 10,
        backgroundColor:  CurrentViewMode.Mode_fontColor,
        opacity: !code || !CurrentCode ? 0.4 : 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	
      }}
    >
   <MaterialIcons name="arrow-back"
        style={{
          alignSelf: 'center',
          fontSize: size(25),
          fontWeight: 'bold',
		  color:CurrentViewMode.Mode_bg,

        }}
       />
  </TouchableOpacity>
)}

</>



:


	null



}










{/*
	// Code Confirmation

		currentPage == 2 

		?

		<> 
					
		{slides?.length > 0 && currentPage < slides.length - 1 && (
			
			<TouchableOpacity
			onPress={() => {
				
			//	handleGenerateToken()
				console.log(currentPage)

				if (CurrentTypedInVerificationCode == TokenFromDB) {

					console.log(currentPage)
					//handleGenerateToken()
					slideToNextPage();
				} else {
					setShowToast(true)
				}
			

			/*	if (email == null || email == "" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {

					setShowToast(true)
				} else {
					//handleGenerateToken()
					slideToNextPage();
				} */
			
				/*
			}}
			style={{

				paddingVertical: 12,
				paddingHorizontal: 20,
				marginLeft: width(52),
				
				width: 150,
				borderRadius: 10,
				backgroundColor: CurrentViewMode.Mode_fontColor,
				opacity: email == null || email == "" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ? 0.4 : 1,
				shadowColor: '#ddd',
				shadowOffset: {
				width: 0,
				height: 4,
				},
				shadowOpacity: 0.3,
				shadowRadius: 4.65,
				elevation: 8,
				
			}}
			>
			<Text
				style={{
				color:  CurrentViewMode.Mode_bg,
				alignSelf: 'center',
				fontSize: size(18),
				fontWeight: 'bold',
				}}>
				Next lol
			</Text>
			</TouchableOpacity>
		)}





{currentPage > 0 && (
  <TouchableOpacity
    onPress={slideToPreviousPage}
	style={{
		marginLeft: width(4),
	
        width: 50,
		height: 50,
        borderRadius: 10,
        backgroundColor:  CurrentViewMode.Mode_fontColor,
        opacity: !code || !CurrentCode ? 0.4 : 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	
      }}
    >
   <MaterialIcons name="arrow-back"
        style={{
          alignSelf: 'center',
          fontSize: size(25),
          fontWeight: 'bold',
		  color:CurrentViewMode.Mode_bg,

        }}
       />
  </TouchableOpacity>
)}

</>



:


	null



*/}


















{/*
		currentPage == 3 && isSheetOpenLogIn == true 

		?

		<> 
					
		{slides?.length > 0 && currentPage < slides.length - 1 && (
			
			<TouchableOpacity
			onPress={() => {

				console.log(currentPage)

				if (NewPasswordPin == "" || NewPasswordPin == null ) {

					setShowToast(true)
				} else {
					handleGenerateToken()
					slideToNextPage();
				}
			
				
			}}
			style={{
				paddingVertical: 12,
				paddingHorizontal: 20,
				marginLeft: width(58),
				
				width: 150,
				borderRadius: 10,
				backgroundColor: '#fff',
				opacity: NewPasswordPin == "" || NewPasswordPin == null ? 0.4 : 1,
				shadowColor: '#ddd',
				shadowOffset: {
				width: 0,
				height: 4,
				},
				shadowOpacity: 0.3,
				shadowRadius: 4.65,
				elevation: 8,
			}}
			>
			<Text
				style={{
				alignSelf: 'center',
				fontSize: size(18),
				fontWeight: 'bold',
				}}>
				Next
			</Text>
			</TouchableOpacity>
		)}





{currentPage > 0 && (
  <TouchableOpacity
    onPress={slideToPreviousPage}
	style={{
		marginLeft: width(4),
	
        width: 50,
		height: 50,
        borderRadius: 10,
        backgroundColor: '#222',
        opacity: !code || !CurrentCode ? 0.4 : 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	
      }}
    >
   <MaterialIcons name="arrow-back"
        style={{
          alignSelf: 'center',
          fontSize: size(25),
          fontWeight: 'bold',
		  color: '#fff',

        }}
       />
  </TouchableOpacity>
)}

</>



:


	null



*/}




























{/*
		currentPage == 4 && isSheetOpenLogIn == true 

		?

		<> 
					
		{slides?.length > 0 && currentPage < slides.length - 1 && (
			
			<TouchableOpacity
			onPress={() => {

				console.log(currentPage)

				if (NewPasswordPin !== TypedInPinConfirmation || NewPasswordPin == null || NewPasswordPin == "" ) {

					setShowToast(true)
				} else {
					handleGenerateToken()
					slideToNextPage();
				}
			
				
			}}
			style={{
				paddingVertical: 12,
				paddingHorizontal: 20,
				marginLeft: width(58),
				
				width: 150,
				borderRadius: 10,
				backgroundColor: '#fff',
				opacity: NewPasswordPin !== TypedInPinConfirmation || NewPasswordPin == null || NewPasswordPin == "" ? 0.4 : 1,
				shadowColor: '#ddd',
				shadowOffset: {
				width: 0,
				height: 4,
				},
				shadowOpacity: 0.3,
				shadowRadius: 4.65,
				elevation: 8,
			}}
			>
			<Text
				style={{
				alignSelf: 'center',
				fontSize: size(18),
				fontWeight: 'bold',
				}}>
				Next
			</Text>
			</TouchableOpacity>
		)}





{currentPage > 4 && (
  <TouchableOpacity
    onPress={slideToPreviousPage}
	style={{
		marginLeft: width(4),
	
        width: 50,
		height: 50,
        borderRadius: 10,
        backgroundColor: '#222',
        opacity: NewPasswordPin !== TypedInPinConfirmation || NewPasswordPin == null || NewPasswordPin == "" ? 0.4 : 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	
      }}
    >
   <MaterialIcons name="arrow-back"
        style={{
          alignSelf: 'center',
          fontSize: size(25),
          fontWeight: 'bold',
		  color: '#fff',

        }}
       />
  </TouchableOpacity>
)}

</>



:


	null



*/}





















{
		currentPage == 6 

		?

		<> 
					
		{slides?.length > 0 && currentPage < slides.length - 1 && (
			
			<TouchableOpacity
			onPress={() => {
				slideToNextPage();
				console.log(currentPage)

				if (FirstName == "" || FirstName == null|| LastName == "" || LastName == null ) {

					setShowToast(true)
				} else {
					handleGenerateToken()
					slideToNextPage();
				}
			
				
			}}
			style={{
				paddingVertical: 12,
				paddingHorizontal: 20,
				marginLeft: width(52),
				
				width: 150,
				borderRadius: 10,
				backgroundColor:  CurrentViewMode.Mode_fontColor,
				opacity: FirstName == "" || FirstName == null|| LastName == "" || LastName == null ? 0.4 : 1,
				shadowColor: '#ddd',
				shadowOffset: {
				width: 0,
				height: 4,
				},
				shadowOpacity: 0.3,
				shadowRadius: 4.65,
				elevation: 8,
			}}
			>
			<Text
				style={{
				color: CurrentViewMode.Mode_bg,
				alignSelf: 'center',
				fontSize: size(18),
				fontWeight: 'bold',
				}}>
				{t("ContinueButtonText")}
			</Text>
			</TouchableOpacity>
		)}


{currentPage > 0 && (
  <TouchableOpacity
    onPress={slideToPreviousPage}
	style={{
		marginLeft: width(4),
	
        width: 50,
		height: 50,
        borderRadius: 10,
        backgroundColor:  CurrentViewMode.Mode_fontColor,
        opacity: !code || !CurrentCode ? 0.4 : 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	
      }}
    >
   <MaterialIcons name="arrow-back"
        style={{
          alignSelf: 'center',
          fontSize: size(25),
          fontWeight: 'bold',
		  color:CurrentViewMode.Mode_bg,

        }}
       />
  </TouchableOpacity>
)}

</>



:


	null



 }




</>

</View>

)}



	
	





		{/*
		// Buttons UI and UX 

		(isTextFocused || isNumberFocused) && (
	


			<View
		   style={{
            backgroundColor: CurrentViewMode.Mode_bg,
            paddingHorizontal: size(20),
      
            flexDirection: 'row',
		}}>





		
					
{/*slides?.length > 0 && currentPage < slides.length - 1 && (
			
			<TouchableOpacity
			onPress={() => {
				// Check if phone number has strings in it

			

				const isAlpha = (str) => /^[a-zA-Z]+$/.test(str);  // Regular expression to match letters only

				console.log(code)

				if(currentPage == 0 && CurrentCode == null || code == null || CurrentCode == "" || isAlpha(code) == true) {
					setShowToast(true)
					
				} else {
					handleGenerateToken()
					slideToNextPage();
				}

		
			}}
			style={{
				paddingVertical: 12,
				paddingHorizontal: 20,
				marginLeft: width(52),
				
				width: 150,
				borderRadius: 10,
				backgroundColor: CurrentViewMode.Mode_fontColor,
				opacity: !code || !CurrentCode ? 0.4 : 1,
				shadowColor: '#ddd',
				shadowOffset: {
				width: 0,
				height: 4,
				},
				shadowOpacity: 0.3,
				shadowRadius: 4.65,
				elevation: 8,
			}}
			>
			<Text
				style={{
				alignSelf: 'center',
				fontSize: size(18),
                color: CurrentViewMode.Mode_bg,
				fontWeight: 'bold',
				}}>
				Next
			</Text>
			</TouchableOpacity>
		)}





{currentPage > 0 && (
  <TouchableOpacity
    onPress={slideToPreviousPage}
	style={{
		marginLeft: width(4),
	
        width: 50,
		height: 50,
        borderRadius: 10,
        backgroundColor: '#222',
        opacity: !code || !CurrentCode ? 0.4 : 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	
      }}
    >
   <MaterialIcons name="arrow-back"
        style={{
          alignSelf: 'center',
          fontSize: size(25),
          fontWeight: 'bold',
		  color: '#fff',

        }}
       />
  </TouchableOpacity>
)}



</View>

  )*/}



		</View>
		</TouchableWithoutFeedback>
        </KeyboardAvoidingView>

     </ActionSheet>

	
		
		
		
		
		

			</>
	
		  
	
	);



  }
  
  