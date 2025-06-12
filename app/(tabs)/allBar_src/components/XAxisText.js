import React from 'react';
import { Text, useFont } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue, withTiming } from 'react-native-reanimated';
import { size } from 'react-native-responsive-sizes';

export default function XAxisText({ x, y, text, Mode_SecNumberText, selectedBar, data, currentYear }) {
  const font = useFont(require('../assets/fonts/Roboto-Bold.ttf'), 13);

  // Ensure currentYear and text are defined before using them
  const safeCurrentYear = currentYear || new Date().getFullYear(); // Fallback to current year if undefined
  const safeText = text || ''; // Fallback to an empty string if text is undefined


  
  // Check if the current month has data
  const hasData = data.some((dataPoint) => dataPoint.label === safeText && dataPoint.value !== 0);

  // Handle color change based on selected bar and if it's static or dynamic
  const color = useDerivedValue(() => {
    // If the month is in the future or has no data, it should not be selectable
    if (!hasData) {
      return withTiming('#565A60'); // Gray color for months with no data
    }

    if (selectedBar.value === safeText) {
      return withTiming('#fff'); // Selected bar color
    } else {
      return withTiming(Mode_SecNumberText); // Color when not selected
    }
  });

  if (!font) {
    return null;
  }

  const fontSize = font.measureText(safeText);

  return <Text font={font} x={x - fontSize.width / 2} y={size(215)} text={safeText} color={color} />;
}
