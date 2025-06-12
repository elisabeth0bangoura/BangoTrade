import React, { createContext, useState } from "react";
import { useTranslation } from 'react-i18next';




// Create Context
export const HomeContext = createContext();



// Create Context Provider
export const HomeContextProvider = ({ children }) => {

  const { t } = useTranslation();



// Define months & years
const months = [
  t("Jan"), t("Feb"), t("Mar"), t("Apr"), t("May"), t("Jun"),
  t("Jul"), t("Aug"), t("Sep"), t("Oct"), t("Nov"), t("Dec")
];

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth(); // 0-indexed (Jan = 0, Dec = 11)
const currentMonthName = months[currentMonth]; // Convert index to month name

// Generate 10 years (5 before, 5 after current year)
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

// Combine months & years into a single list
const combinedData = years.flatMap(year => months.map(month => `${month} ${year}`));

// Find the index of the current month & year
const initialSelectedIndex = combinedData.indexOf(`${currentMonthName} ${currentYear}`);

// Function to format the date for Alpaca API
const formatMonthYearToAPI = (monthYear) => {
  if (!monthYear) return { start: "", end: "" }; // Prevent undefined errors

  const [monthName, year] = monthYear.split(" ");
  const monthIndex = months.indexOf(monthName) + 1; // Convert name to index
  const formattedMonth = monthIndex.toString().padStart(2, "0"); // Ensure 2-digit month
  return {
    start: `${year}-${formattedMonth}-01`,
    end: `${year}-${formattedMonth}-31`, // Handles most months, except February
  };
};





  // ✅ Ensure initial value is valid before setting it
  const initialAlpacaDate = formatMonthYearToAPI(combinedData[initialSelectedIndex]);

  const [AlpacaDateFormatStart, setAlpacaDateFormatStart] = useState(initialAlpacaDate.start);
  const [AlpacaDateFormatEnd, setAlpacaDateFormatEnd] = useState(initialAlpacaDate.end);
  const [startDate, setStartDate] = useState(`${months[new Date().getMonth()]} ${currentYear}`);
  const [endDate, setEndDate] = useState(startDate);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

  return (
    <HomeContext.Provider
      value={{
        AlpacaDateFormatStart,
        setAlpacaDateFormatStart,
        AlpacaDateFormatEnd,
        setAlpacaDateFormatEnd,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        selectedIndex,
        setSelectedIndex,
        combinedData, // ✅ Now available in the context
        formatMonthYearToAPI, // ✅ Also available in the context
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
