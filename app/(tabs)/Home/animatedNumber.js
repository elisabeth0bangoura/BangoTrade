import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { HomeChartContext } from "@/app/Context/HomeChartContext";
import { Easing } from "react-native-reanimated";
import { size } from "react-native-responsive-sizes";
import { ViewModeContext } from "@/app/Context/ViewModeContext";



const RollingNumber = () => {
  const { currentPrice, setCurrentPrice, selectedPeriod } = useContext(HomeChartContext);

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const styles = StyleSheet.create({
    priceContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    currency: {
      fontSize: size(36),
      fontWeight: "bold",
      color:  CurrentViewMode.Mode_fontColor,
    },
    price: {
      fontSize: size(36),
      fontWeight: "bold",
      color:  CurrentViewMode.Mode_fontColor,
    },
  });
  



// ✅ Correct formatting function (Fixes extra 0 issue)
const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "0.00"; // ✅ Prevents NaN or undefined
  
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2, // ✅ Always show 2 decimal places
      maximumFractionDigits: 2, // ✅ Prevents extra decimals
      useGrouping: true, // ✅ Ensures correct comma formatting
    }).format(value);
  };

  

  return (
    <View style={styles.priceContainer}>
      <Text style={styles.currency}>$</Text>

      <AnimatedRollingNumber
            value={formatCurrency(parseFloat(currentPrice))} // ✅ Ensure it's a number

        toFixed={0} // ✅ Always show two decimal places (e.g., 2,380.67)
        useGrouping={true} // ✅ Formats as 2,343.98 instead of 2343.98
     
        enableCompactNotation={false} // ✅ Prevents 1K, 1M, etc.
        showPlusSign={false} // ✅ No extra signs
        showMinusSign={true} // ✅ Allows negative values
        spinningAnimationConfig={{
          duration: 500,
          easing: Easing.out(Easing.ease),
        }}
        textStyle={styles.price}
      />
    </View>
  );
};




export default RollingNumber;
