import React, { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';
import { Path, Skia } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue, withTiming } from 'react-native-reanimated';
import { ViewModeContext } from '@/app/Context/ViewModeContext';


export default function BarPath({ x, y, progress, barWidth, CurrentViewMode, Mode_CashChartColor2,  isEmpty, graphHeight, label, selectedBar, data }) {


  
  // Check if the month has data or is empty
  const hasData = data.some((dataPoint) => dataPoint.label === label && dataPoint.value !== 50);
  
  // Handle color change based on selected bar and if it's static or dynamic
  const color = useDerivedValue(() => {
    // If the month has no data, always return green
    if (isEmpty) {
      return withTiming(Mode_CashChartColor2); // Green color for empty months
    }

    // If no bar is selected, set the color to a default color for all bars
    if (selectedBar.value === null) {
      return withTiming(CurrentViewMode); // Default color for all unselected bars
    }

    // If the current label matches selectedBar, change color to selected color
    if (selectedBar.value === label) {
      return withTiming(CurrentViewMode); // Color when selected
    }

    // Default color for unselected months with data
    return withTiming('#2E2E46');  // Default color for months with data
  });

  // Generate the path for the bar
  const path = useDerivedValue(() => {
    const barPath = Skia.Path.Make();
    barPath.addRRect({
      rect: {
        x: x - barWidth / 2, // Center the bar horizontally
        y: graphHeight,
        width: barWidth,
        height: y * progress.value * -1, // Adjust the height based on progress
      },
      rx: 8,
      ry: 8,
    });
    return barPath;
  });

  return <Path path={path} color={color} />;
}
