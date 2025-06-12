import React, { useContext, useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { HomeChartContext } from "@/app/Context/HomeChartContext";
import { Easing } from "react-native-reanimated";
import { size } from "react-native-responsive-sizes";
import { ViewModeContext } from "@/app/Context/ViewModeContext";
import { CoinPageContext } from "../Context/OpenCoinPageContext";
import { CurrentPriceContext } from "../Context/CurrentCoinPricePageContext";



const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const styles = StyleSheet.create({
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currency: {
    fontSize: size(28),
    fontWeight: "bold",
  },
  price: {
    fontSize: size(28),
    fontWeight: "bold",
  },
});

// ✅ Format number for USD display
const formatCurrency = (value) => {
  if (!value || isNaN(value)) return "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
};

const RollingNumberStocks = () => {
  const { coinData } = useContext(CoinPageContext);
  const { CurrentViewMode } = useContext(ViewModeContext);

  const { currentPrice, setCurrentPrice, percentageChange, setPercentageChange, } = useContext(CurrentPriceContext);

  const [animatedPrice, setAnimatedPrice] = useState(parseFloat(coinData?.price || 0));

  // 👇 Debounced setter
  const debouncedSetAnimatedPrice = useRef(
    debounce((price) => setAnimatedPrice(price), 300)
  ).current;

  // ✅ Update price only if changed significantly (≥ $0.01)
  useEffect(() => {
    const incomingPrice = parseFloat(coinData?.price);
    if (!incomingPrice || isNaN(incomingPrice)) return;
  
    // Only animate if rounded display value is actually different
    const displayValue = parseFloat(formatCurrency(animatedPrice));
    const incomingDisplay = parseFloat(formatCurrency(incomingPrice));
  
    if (incomingDisplay !== displayValue) {
      debouncedSetAnimatedPrice(incomingPrice);
    }
  }, [coinData?.price]);
  

  return (
    <View style={styles.priceContainer}>
      <Text style={[styles.currency, { color: CurrentViewMode.Mode_fontColor }]}>$</Text>

      <AnimatedRollingNumber
        value={formatCurrency(currentPrice)}
        toFixed={0}
        useGrouping={true}
        enableCompactNotation={false}
        showPlusSign={false}
        showMinusSign={true}
        spinningAnimationConfig={{
          duration: 400,
          easing: Easing.out(Easing.ease),
        }}
        textStyle={[styles.price, { color: CurrentViewMode.Mode_fontColor }]}
      />
    </View>
  );
};




export default RollingNumberStocks;
