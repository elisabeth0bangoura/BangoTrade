// sheets.tsx
import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import CoinPage from './app/(coin)/coinPage';
import SearchPage from './app/(tabs)/Search/SearchPage';
import IFollowCoinBottomSheetData  from './app/(tabs)/Home/IFollowAssets/IFollowCoinBottomSheetData';
import SortAfterComponentFollowCoins from './app/(tabs)/Home/IFollowAssets/SortAfterComponentFollowCoins';
import PriceTraackersheet, { OrderTypeSheetPage } from './app/(coin)/PriceTraackersheet';
import BuyConfirmationSheet, {BuyOrderTypeSheetPage} from './app/(coin)/BuyConfirmationSheet';
import Amountsheet, {BuyAmountTypeSheetPage} from './app/(coin)/Amountsheet';
import BuyConfirmationSheetShares from './app/(coin)/BuyConfirmationSheetShares';
import { SellAmountTypeSheetPage, } from './app/(coin)/SellAmountsheet';
import SellAmountsheet from './app/(coin)/SellAmountsheet';


import StockSellConfirmationShares_Sheet from './app/(stock)/Stock_SellConfirmationSheetShares';

import { StockSellAmountTypeSheet } from './app/(stock)/Stock_SellAmountsheet';
import StockSellAmountsSheet from './app/(stock)/Stock_SellAmountsheet';
import StockSellConfirmationSheet, { StockSellOrderTypeSheetPage } from './app/(stock)/Stock_SellConfirmationSheet';
import SellConfirmationSheetShares from './app/(coin)/SellConfirmationSheetShares';
import SellConfirmationSheet, { SellOrderTypeSheetPage } from './app/(coin)/SellConfirmationSheet';

import AnalyticsAssetBottomSheet from './app/(tabs)/Home/Insights/Analytics';
import { OverallPosition_Component } from './app/(tabs)/Home/Insights/AllAssets_Overview';
import { TransactionSheetPage } from './app/(tabs)/Cash/cash';
import Deposit from './app/(tabs)/DepositToPortfolio/Deposit';
import ChooseDepositWay from './app/(tabs)/DepositToPortfolio/ChooseDepositWay';
import Widthraw from './app/(tabs)/WidthrawToPortfolio/Widthraw';
import WidthrawWay from './app/(tabs)/WidthrawToPortfolio/ChooseWidthrawWay';
import { SortMetricsSinceBuy } from './app/(tabs)/Home/home';
import ActivitySheet from './app/(tabs)/Profile/ProfileActivity';
import TotalAssetSheet from './app/(tabs)/Profile/TotalAsset';
import PortfolioStatementsSheet from './app/(tabs)/Profile/Profile_Statement/PortfolioStatementsSheet';
import StatementsDateTypePortfolio from './app/(tabs)/Profile/Profile_Statement/StatementsDateTypePortfolio';
import StatementsDatePickerAccount from './app/(tabs)/Profile/Profile_Statement/StatementsDatePickerAccount';
import StatementsDatePickerCrypto from './app/(tabs)/Profile/Profile_Statement/StatementsDatePickerCrypto';
import StatementsDateTypeCrypto from './app/(tabs)/Profile/Profile_Statement/StatementsDateTypeCrypto';
import { ActivityReportSheet } from './app/(tabs)/Profile/ActivityReportSheet';
import AccountDetailsSheet from './app/(tabs)/Profile/AccountDetails';
import SettingsSheet from './app/(tabs)/Profile/SettingsSheet';
import Personal_DataSheet from './app/(tabs)/Settings/Personal_Data';
import ChnagePhoneNUmber from './app/(tabs)/Settings/ChnagePhoneNUmber';
import ChnageEmailAddress from './app/(tabs)/Settings/ChnageEmailAddress';
import SettingsSecurityDataProtection from './app/(tabs)/Settings/SettingsSecurityDataProtection';
import ChnagePinSettings from './app/(tabs)/Settings/ChnagePinSettings';
import SettingsNotification from "./app/(tabs)/Settings/Notifications"
import OtherServices from './app/(tabs)/Settings/OtherServices';
import LegalDocuments from './app/(tabs)/Settings/LegalDocuments';
import GeneralDocuments, {Inprint } from './app/(tabs)/Settings/ GeneralDocuments';
import CloseDepot from './app/(tabs)/Settings/CloseDepot';
import CloseDepotPart2 from './app/(tabs)/Settings/CloseDepotPart2';
import OrdersHistory from './app/(tabs)/Home/OrdersHistory';
import SellHistory from './app/(tabs)/Home/SellHistory';
import SearchPageTextInput from './app/(tabs)/Search/SearchPageTextInput';
import SearchFilterPage from './app/(tabs)/Search/SearchFilterPage';
import TransactionRecepieBroughtAssets from './app/(tabs)/Cash/TransactionRecepieBroughtAssets';
import TransactionRecepieSoldAssets from './app/(tabs)/Cash/TransactionRecepieSoldAssets';
import TransactionRecepieWidthraw from './app/(tabs)/Cash/TransactionRecepieWidthraw';
import TransactionRecepieDeposit from './app/(tabs)/Cash/TransactionRecepieDeposit';
import Billing from './app/(tabs)/Cash/PdfSheets/Abrechnung';
import TransactionConfirmation from './app/(tabs)/Cash/PdfSheets/TransactionConfirmation';
import ViewMode from './app/(tabs)/Settings/ViewMode/ViewMode';
import ChangeLanguage from './app/(tabs)/Settings/ChangeLanguage';
import LogIn from './app/(auth)/LogIn';
import { ChooseCountry } from './app/(auth)/LogIn';
import SignUp from './app/(auth)/signUp';
import SignUp_Language from './app/(auth)/SignUpLanguage';
import Create_BankRealtionship from './app/(tabs)/Create_BankRealtionship_Sheet';
import BankTypeCodes from './app/(tabs)/BankTypeCodes';
import HelpSheet from './app/(tabs)/Profile/Help/Help';
import AssetSheet from './app/(tabs)/Profile/Help/Asset';

// Register the CoinPage sheet
import PortfolioGrowthPerformanceSheet from './app/(tabs)/Profile/Help/Assets/PortfolioGrowthAndPerformance/PortfolioGrowthPerformance';
import CalculationOfPerformanceSheet from './app/(tabs)/Profile/Help/Assets/PortfolioGrowthAndPerformance/CalculationOfPerformance';
import PortfolioValueDecreasedSheet from './app/(tabs)/Profile/Help/Assets/PortfolioGrowthAndPerformance/PortfolioValueDecreased';
import PositionIsDisplayedIncorrectlyOrNotAtAllSheet from './app/(tabs)/Profile/Help/Assets/PortfolioGrowthAndPerformance/PositionIsDisplayedIncorrectlyOrNotAtAll';
import DifferenceComparedToIndividualItemsSheet from './app/(tabs)/Profile/Help/Assets/PortfolioGrowthAndPerformance/DifferenceComparedToIndividualItemsSheet';
import CapitalManagementSheet from './app/(tabs)/Profile/Help/Assets/CapitalManagement/CapitalManagement';
import AnnualTaxReportSheet from './app/(tabs)/Profile/Help/Assets/CapitalManagement/AnnualTaxReport';
import PortfolioAccountSheet from './app/(tabs)/Profile/Help/Assets/CapitalManagement/PortfolioAccount';
import LegalDocumentsSheet from './app/(tabs)/Profile/Help/Assets/CapitalManagement/LegalDocuments';
import SendInstructionsSheet from './app/(tabs)/Profile/Help/Assets/CapitalManagement/SendInstructions';
import UpcomingCapitalMeasuresSheet from './app/(tabs)/Profile/Help/Assets/CapitalManagement/UpcomingCapitalMeasures';
import ISINChangeAfterCorporateActionSheet from './app/(tabs)/Profile/Help/Assets/CapitalManagement/ISINChangeAfterCorporateAction';
import EffectsOfStockMergerSheet from './app/(tabs)/Profile/Help/Assets/CapitalManagement/EffectsOfStockMerger';
import DividendsSheet from './app/(tabs)/Profile/Help/Assets/Dividends/Dividends';
import DividendEligibilitySheet from './app/(tabs)/Profile/Help/Assets/Dividends/DividendEligibility';
import DividendCancellationsSheet from './app/(tabs)/Profile/Help/Assets/Dividends/DividendCancellations';
import DividendReceiptsSheet from './app/(tabs)/Profile/Help/Assets/Dividends/DividendReceipts';
import MissedDividendsSheet from './app/(tabs)/Profile/Help/Assets/Dividends/MissedDividends';
import CryptoSheet from './app/(tabs)/Profile/Help/Assets/Crypto/Crypto';
import CryptotypesSheet from './app/(tabs)/Profile/Help/Assets/Crypto/Cryptotypes';
import CryptoSecuritySheet from './app/(tabs)/Profile/Help/Assets/Crypto/CryptoSecurity';
import TradabilityOfCryptosAndEventsSheet from './app/(tabs)/Profile/Help/Assets/Crypto/TradabilityOfCryptosAndEvents';
import FailedAndExpiredOrdersSheet from './app/(tabs)/Profile/Help/Assets/FailedAndExpiredOrders/FailedAndExpiredOrders';
import ExpiredOrderSheet from './app/(tabs)/Profile/Help/Assets/FailedAndExpiredOrders/ExpiredOrder';
import FailedOrderExecutionsSheet from './app/(tabs)/Profile/Help/Assets/FailedAndExpiredOrders/FailedOrderExecutions';
import TaxLossPoolsSheet from './app/(tabs)/Profile/Help/Assets/TaxLossPools/TaxLossPools';
import ExemptionOrderFSASheet from './app/(tabs)/Profile/Help/Assets/TaxLossPools/ExemptionOrderFSA';
import TaxCorrectionsAndRefundsSheet from './app/(tabs)/Profile/Help/Assets/TaxLossPools/TaxCorrectionsAndRefunds';
import ProfileHelpSheet from './app/(tabs)/Profile/Help/ProfileHelp/ProfileHelp';
import ManagePersonalInformationSheet from './app/(tabs)/Profile/Help/ProfileHelp/ManagePersonalInformation';
import AccountDetailsHelpSheet from './app/(tabs)/Profile/Help/ProfileHelp/AccountDetailsHelp';
import TotalAssetHelpSheet from './app/(tabs)/Profile/Help/ProfileHelp/TotalAssetHelp';
import CloseAccountSheet from './app/(tabs)/Profile/Help/ProfileHelp/CloseAccountSheet';
import PortfolioStatementsHelpSheet from './app/(tabs)/Profile/Help/ProfileHelp/PortfolioStatementsHelp';
import FurtherStatementsSheet from './app/(tabs)/Profile/Help/ProfileHelp/FurtherStatements';
import DepositSecuritySheet from './app/(tabs)/Profile/Help/ProfileHelp/DepositSecurity';
import DataSecuritySheet from './app/(tabs)/Profile/Help/ProfileHelp/DataSecurity';
import AccountSecuritySheet from './app/(tabs)/Profile/Help/ProfileHelp/AccountSecurity';
import LegalDocumentsHelpSheet from './app/(tabs)/Profile/Help/ProfileHelp/LegalDocuments';
import ChatSheet from './app/(tabs)/Profile/Help/Chat';

// Stock 
import StockPage from './app/(stock)/stockPage';
import StockAmountsheet from './app/(stock)/StockAmountsheet';
import { StockBuyAmountTypeSheetPage } from './app/(stock)/StockAmountsheet';
import StockPriceTraackersheet from './app/(stock)/StockPriceTraackersheet';
import { StockBuyOrderTypeSheetPage } from './app/(stock)/StockBuyConfirmationSheet';
import StockBuyConfirmationSheet from './app/(stock)/StockBuyConfirmationSheet';
import { CurrenciesFilterSheet } from './app/(tabs)/Search/SearchFilter/SearchFilterETFs';
import { ExcahngeFilterSheet } from './app/(tabs)/Search/SearchFilter/SearchFilterETFs';
import { localesFilterSheet } from './app/(tabs)/Search/SearchFilter/SearchFilterETFs';
import { IPOFilterSheet } from './app/(tabs)/Search/SearchFilter/SearchFilterOptions';
import { MarketFilterSheet } from './app/(tabs)/Search/SearchFilter/SearchFilterETFs';

















registerSheet('Stock_SellConfirmation_Sheet', StockSellConfirmationSheet);

registerSheet('Stock_SellConfirmationShares_Sheet', StockSellConfirmationShares_Sheet);

registerSheet('Stock_Sell_OrderType_Sheet', StockSellOrderTypeSheetPage);

registerSheet('Stock_SellAmounts_Sheet', StockSellAmountsSheet);

registerSheet('MarketFilter_Sheet', MarketFilterSheet);
registerSheet('Ipo_Sheet', IPOFilterSheet);
registerSheet('localesFilter_Sheet', localesFilterSheet);
registerSheet('ExcahngeFilter_Sheet', ExcahngeFilterSheet);
registerSheet('CurrenciesFilter_Sheet', CurrenciesFilterSheet);

registerSheet('StockBuyConfirmation_Sheet', StockBuyConfirmationSheet);

registerSheet('StockBuyOrderType_Sheet', StockBuyOrderTypeSheetPage);
registerSheet('StockPriceTracker_Sheet', StockPriceTraackersheet);
registerSheet('StockBuyAmountType_Sheet', StockBuyAmountTypeSheetPage);
registerSheet('StockMoneyAmount_Sheet', StockAmountsheet);
registerSheet('StockPage_Sheet', StockPage);
registerSheet('Chat_Sheet', ChatSheet);
registerSheet('LegalDocumentsHelp_Sheet', LegalDocumentsHelpSheet);
registerSheet('AccountSecurity_Sheet', AccountSecuritySheet);
registerSheet('DataSecurity_Sheet', DataSecuritySheet);
registerSheet('DepositSecurity_Sheet', DepositSecuritySheet);
registerSheet('FurtherStatements_Sheet', FurtherStatementsSheet);
registerSheet('PortfolioStatementsHelp_Sheet', PortfolioStatementsHelpSheet);
registerSheet('CloseAccount_Sheet', CloseAccountSheet);
registerSheet('TotalAssetHelp_Sheet', TotalAssetHelpSheet);
registerSheet('AccountDetailsHelp_Sheet', AccountDetailsHelpSheet);
registerSheet('ProfileHelp_Sheet', ProfileHelpSheet);
registerSheet('TaxCorrectionsAndRefunds_Sheet', TaxCorrectionsAndRefundsSheet);
registerSheet('ExemptionOrderFSA_Sheet', ExemptionOrderFSASheet);
registerSheet('TaxLossPools_Sheet', TaxLossPoolsSheet);
registerSheet('FailedOrderExecutions_Sheet', FailedOrderExecutionsSheet);
registerSheet('ExpiredOrder_Sheet', ExpiredOrderSheet);
registerSheet('FailedAndExpiredOrders_Sheet', FailedAndExpiredOrdersSheet);
registerSheet('TradabilityOfCryptosAndEvents_Sheet', TradabilityOfCryptosAndEventsSheet);
registerSheet('CryptoSecurity_Sheet', CryptoSecuritySheet);
registerSheet('Cryptotypes_Sheet', CryptotypesSheet);
registerSheet('AboutCrypto_Sheet', CryptoSheet);
registerSheet('MissedDividends_Sheet', MissedDividendsSheet);
registerSheet('DividendReceipts_Sheet', DividendReceiptsSheet);
registerSheet('DividendCancellations_Sheet', DividendCancellationsSheet);
registerSheet('DividendEligibility_Sheet', DividendEligibilitySheet);
registerSheet('Dividends_Sheet', DividendsSheet);
registerSheet('EffectsOfStockMerger_Sheet', EffectsOfStockMergerSheet);
registerSheet('ISINChangeAfterCorporateAction_Sheet', ISINChangeAfterCorporateActionSheet);
registerSheet('UpcomingCapitalMeasures_Sheet', UpcomingCapitalMeasuresSheet);
registerSheet('SendInstructions_Sheet', SendInstructionsSheet);
registerSheet('Assets_LegalDocuments_Sheet', LegalDocumentsSheet);
registerSheet('PortfolioAccount_Sheet', PortfolioAccountSheet);
registerSheet('AnnualTaxReport_Sheet', AnnualTaxReportSheet);
registerSheet('CapitalManagement_Sheet', CapitalManagementSheet);
registerSheet('DifferenceComparedToIndividualItems_Sheet', DifferenceComparedToIndividualItemsSheet);
registerSheet('PositionIsDisplayedIncorrectlyOrNotAtAll_Sheet', PositionIsDisplayedIncorrectlyOrNotAtAllSheet);
registerSheet('PortfolioValueDecreased_Sheet', PortfolioValueDecreasedSheet);
registerSheet('CalculationOfPerformance_Sheet', CalculationOfPerformanceSheet);
registerSheet('PortfolioGrowthPerformance_Sheet', PortfolioGrowthPerformanceSheet);
registerSheet('Asset_Sheet', AssetSheet);


registerSheet('Help_Sheet', HelpSheet);
registerSheet('BankTypeCodes_Sheet', BankTypeCodes);
registerSheet('Create_BankRealtionship_Sheet', Create_BankRealtionship);
registerSheet('SignUpLanguage_Sheet', SignUp_Language);
registerSheet('SignUp_Sheet', SignUp);
registerSheet('LogIn_Sheet', LogIn);
registerSheet('Country_Sheet', ChooseCountry);
registerSheet('CoinPage_Sheet', CoinPage);
registerSheet('SearchPage_Sheet', SearchPage);
registerSheet('CoinSIFollow_Sheet', IFollowCoinBottomSheetData);
registerSheet('SortAfterComponentFollowCoins_Sheet', SortAfterComponentFollowCoins);
registerSheet('PriceTracker_Sheet', PriceTraackersheet);
registerSheet('OrderType_Sheet', OrderTypeSheetPage);
registerSheet('MoneyAmount_Sheet', Amountsheet);
registerSheet('BuyConfirmation_Sheet', BuyConfirmationSheet);
registerSheet('BuyAmountType_Sheet', BuyAmountTypeSheetPage);
registerSheet('BuyOrderType_Sheet', BuyOrderTypeSheetPage);
registerSheet('BuyConfirmationShares_Sheet', BuyConfirmationSheetShares);
registerSheet('SellAmountType_Sheet', SellAmountTypeSheetPage);
registerSheet('SellAmounts_Sheet', SellAmountsheet);
registerSheet('Stock_SellAmountType_Sheet', StockSellAmountTypeSheet);


registerSheet('SellConfirmationShares_Sheet', SellConfirmationSheetShares);
registerSheet('SellOrderTypeSheet_Sheet', SellOrderTypeSheetPage);
registerSheet('SellConfirmation_Sheet', SellConfirmationSheet);
registerSheet('Analytics_Sheet', AnalyticsAssetBottomSheet);
registerSheet('OverallPosition_Sheet', OverallPosition_Component);
registerSheet('Transaction_Sheet', TransactionSheetPage);
registerSheet('Deposit_Sheet', Deposit);
registerSheet('ChooseDepositWay_Sheet', ChooseDepositWay);
registerSheet('Widthraw_Sheet', Widthraw);
registerSheet('ChooseWidthrawWay_Sheet', WidthrawWay);
registerSheet('SortMetricsSinceBuy_Sheet', SortMetricsSinceBuy);
registerSheet('Activity_Sheet', ActivitySheet);
registerSheet('TotalAsset_Sheet', TotalAssetSheet);
registerSheet('PortfolioStatements_Sheet', PortfolioStatementsSheet);
registerSheet('StatementsDateTypePortfolio_Sheet', StatementsDateTypePortfolio);
registerSheet('StatementsDatePickerAccount_Sheet', StatementsDatePickerAccount);
registerSheet('StatementsDatePickerCrypto_Sheet', StatementsDatePickerCrypto);
registerSheet('StatementsDateTypeCrypto_Sheet', StatementsDateTypeCrypto);
registerSheet('ActivityReport_Sheet', ActivityReportSheet);
registerSheet('AccountDetails_Sheet', AccountDetailsSheet);
registerSheet('Settings_Sheet', SettingsSheet);
registerSheet('PersonalData_Sheet', Personal_DataSheet);
registerSheet('ChnagePhoneNUmber_Sheet', ChnagePhoneNUmber);
registerSheet('ChnageEmailAddress_Sheet', ChnageEmailAddress);
registerSheet('SettingsSecurityDataProtection_Sheet', SettingsSecurityDataProtection);
registerSheet('ChnagePinSettings_Sheet', ChnagePinSettings);
registerSheet('SettingsNotification_Sheet', SettingsNotification);
registerSheet('OtherServices_Sheet', OtherServices);
registerSheet('LegalDocuments_Sheet', LegalDocuments);
registerSheet('GeneralDocuments_Sheet', GeneralDocuments);
registerSheet('Inprint_Sheet', Inprint);
registerSheet('CloseDepot_Sheet', CloseDepot);
registerSheet('CloseDepotPart2_Sheet', CloseDepotPart2);
registerSheet('OrdersHistory_Sheet', OrdersHistory);
registerSheet('SellHistory_Sheet', SellHistory);
registerSheet('SearchPageTextInput_Sheet', SearchPageTextInput);
registerSheet('SearchFilterPage_Sheet', SearchFilterPage);
registerSheet('TransactionRecepieBroughtAssets_Sheet', TransactionRecepieBroughtAssets);
registerSheet('TransactionRecepieSoldAssets_Sheet', TransactionRecepieSoldAssets);
registerSheet('TransactionRecepieWidthraw_Sheet', TransactionRecepieWidthraw);
registerSheet('TransactionRecepieDeposit_Sheet', TransactionRecepieDeposit);
registerSheet('Billing_Sheet', Billing);
registerSheet('TransactionConfirmation_Sheet', TransactionConfirmation);
registerSheet('ViewMode_Sheet', ViewMode);
registerSheet('ChangeLanguage_Sheet', ChangeLanguage);
registerSheet('ManagePersonalInformation_Sheet', ManagePersonalInformationSheet);












// Extend types for better IntelliSense in TypeScript
declare module 'react-native-actions-sheet' {
  interface Sheets {



    "Stock_SellConfirmationShares_Sheet":  SheetDefinition;
    "Stock_SellConfirmation_Sheet": SheetDefinition;
    "Stock_Sell_OrderType_Sheet": SheetDefinition;
    "Stock_SellAmountType_Sheet": SheetDefinition;
    "Stock_SellAmounts_Sheet": SheetDefinition;


    "MarketFilter_Sheet":  SheetDefinition;
    "Ipo_Sheet": SheetDefinition;
    "localesFilter_Sheet": SheetDefinition;
    "ExcahngeFilter_Sheet": SheetDefinition;
    "CurrenciesFilter_Sheet": SheetDefinition;
    "StockBuyConfirmation_Sheet":  SheetDefinition;
    "StockBuyOrderType_Sheet": SheetDefinition;
    "StockPriceTracker_Sheet": SheetDefinition;
    "StockBuyAmountType_Sheet": SheetDefinition;
    "StockPage_Sheet": SheetDefinition;
    "Chat_Sheet": SheetDefinition;
    "LegalDocumentsHelp_Sheet": SheetDefinition;
    "AccountSecurity_Sheet": SheetDefinition;
    "DataSecurity_Sheet": SheetDefinition;
    "DepositSecurity_Sheet": SheetDefinition;
    "FurtherStatements_Sheet": SheetDefinition;
    "PortfolioStatementsHelp_Sheet": SheetDefinition;
    "CloseAccount_Sheet": SheetDefinition;
    "TotalAssetHelp_Sheet": SheetDefinition;
    "AccountDetailsHelp_Sheet": SheetDefinition;
    "ManagePersonalInformation_Sheet": SheetDefinition;
    "ProfileHelp_Sheet": SheetDefinition;
    "TaxCorrectionsAndRefunds_Sheet": SheetDefinition;
    "ExemptionOrderFSA_Sheet": SheetDefinition;
    "TaxLossPools_Sheet": SheetDefinition;
    "FailedOrderExecutions_Sheet": SheetDefinition;
    "ExpiredOrder_Sheet": SheetDefinition;
    "FailedAndExpiredOrders_Sheet": SheetDefinition;
    "TradabilityOfCryptosAndEvents_Sheet": SheetDefinition;
    "CryptoSecurity_Sheet": SheetDefinition;
    "Cryptotypes_Sheet": SheetDefinition;
    "AboutCrypto_Sheet": SheetDefinition;
    "MissedDividends_Sheet": SheetDefinition;
    "DividendReceipts_Sheet": SheetDefinition;
    "DividendCancellations_Sheet": SheetDefinition;
    "DividendEligibility_Sheet": SheetDefinition;
    "Dividends_Sheet": SheetDefinition;
    "EffectsOfStockMerger_Sheet": SheetDefinition;
    "ISINChangeAfterCorporateAction_Sheet": SheetDefinition;
    "UpcomingCapitalMeasures_Sheet": SheetDefinition;
    "SendInstructions_Sheet": SheetDefinition;
    "Assets_LegalDocuments_Sheet": SheetDefinition;
    "PortfolioAccount_Sheet": SheetDefinition;
    "AnnualTaxReport_Sheet": SheetDefinition;
    "CapitalManagement_Sheet": SheetDefinition;
    "DifferenceComparedToIndividualItems_Sheet": SheetDefinition;
    "PositionIsDisplayedIncorrectlyOrNotAtAll_Sheet": SheetDefinition;
    "PortfolioValueDecreased_Sheet": SheetDefinition;
    "CalculationOfPerformance_Sheet": SheetDefinition;
    "PortfolioGrowthPerformance_Sheet": SheetDefinition;
    "Asset_Sheet": SheetDefinition;
    "Help_Sheet": SheetDefinition;
    "BankTypeCodes_Sheet": SheetDefinition;
    "Create_BankRealtionship_Sheet": SheetDefinition;
    "SignUpLanguage_Sheet": SheetDefinition;
    "SignUp_Sheet": SheetDefinition;
    "Country_Sheet": SheetDefinition;
    "LogIn_Sheet": SheetDefinition;
    'CoinPage_Sheet': SheetDefinition;
    "SearchPage_Sheet": SheetDefinition;
    "CoinSIFollow_Sheet": SheetDefinition;
    "SortAfterComponentFollowCoins_Sheet": SheetDefinition;
    "PriceTracker_Sheet": SheetDefinition;
    "OrderType_Sheet": SheetDefinition;
    "MoneyAmount_Sheet": SheetDefinition;
    "BuyOrderType_Sheet": SheetDefinition;
    "BuyConfirmation_Sheet": SheetDefinition;
    "BuyAmountType_Sheet": SheetDefinition;
    "BuyConfirmationShares_Sheet": SheetDefinition;
    "SellAmountType_Sheet": SheetDefinition;
    "SellAmounts_Sheet": SheetDefinition;
    "SellConfirmationShares_Sheet": SheetDefinition;
    "SellOrderTypeSheet_Sheet": SheetDefinition;
    "SellConfirmation_Sheet": SheetDefinition;
    "Analytics_Sheet":  SheetDefinition;
    "OverallPosition_Sheet": SheetDefinition;
    "Transaction_Sheet": SheetDefinition;
    "Deposit_Sheet": SheetDefinition;
    "ChooseDepositWay_Sheet": SheetDefinition; 
    "Widthraw_Sheet": SheetDefinition; 
    "ChooseWidthrawWay_Sheet": SheetDefinition; 
    "SortMetricsSinceBuy_Sheet": SheetDefinition; 
    "Activity_Sheet": SheetDefinition; 
    "TotalAsset_Sheet": SheetDefinition; 
    "PortfolioStatements_Sheet":  SheetDefinition; 
    "StatementsDateTypePortfolio_Sheet": SheetDefinition; 
    "StatementsDatePickerAccount_Sheet": SheetDefinition; 
    "StatementsDatePickerCrypto_Sheet": SheetDefinition; 
    "StatementsDateTypeCrypto_Sheet": SheetDefinition; 
    "ActivityReport_Sheet": SheetDefinition; 
    "AccountDetails_Sheet": SheetDefinition; 
    "Settings_Sheet": SheetDefinition; 
    "PersonalData_Sheet": SheetDefinition; 
    "ChnagePhoneNUmber_Sheet": SheetDefinition; 
    "ChnageEmailAddress_Sheet": SheetDefinition; 
    "SettingsSecurityDataProtection_Sheet": SheetDefinition; 
    "ChnagePinSettings_Sheet": SheetDefinition; 
    "SettingsNotification_Sheet": SheetDefinition; 
    "OtherServices_Sheet": SheetDefinition; 
    "LegalDocuments_Sheet": SheetDefinition; 
    "GeneralDocuments_Sheet": SheetDefinition; 
    "Inprint_Sheet": SheetDefinition; 
    "CloseDepot_Sheet": SheetDefinition; 
    "CloseDepotPart2_Sheet": SheetDefinition; 
    "OrdersHistory_Sheet": SheetDefinition; 
    "SellHistory_Sheet": SheetDefinition; 
    "SearchPageTextInput_Sheet": SheetDefinition; 
    "SearchFilterPage_Sheet": SheetDefinition; 
    "TransactionRecepieBroughtAssets_Sheet": SheetDefinition; 
    "TransactionRecepieSoldAssets_Sheet": SheetDefinition; 
    "TransactionRecepieWidthraw_Sheet": SheetDefinition; 
    "TransactionRecepieDeposit_Sheet": SheetDefinition; 
    "Billing_Sheet": SheetDefinition; 
    "TransactionConfirmation_Sheet": SheetDefinition; 
    "ViewMode_Sheet": SheetDefinition; 
    "ChangeLanguage_Sheet": SheetDefinition; 
  }
}


// CoinSIFollow_Sheet