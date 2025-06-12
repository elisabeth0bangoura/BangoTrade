import { View } from 'react-native';
import React, { useEffect, useContext, useState } from 'react';

import { SharedValue, useDerivedValue, runOnUI } from 'react-native-reanimated';
import { Canvas, Text, useFont } from '@shopify/react-native-skia';
import { ViewModeContext } from '@/app/Context/ViewModeContext';

// Move the format logic into a Reanimated-compatible worklet
const formatNumber = (value: number): string => {
  'worklet'; // Mark this function as a worklet
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

type Props = {
  selectedValue: SharedValue<number>;
};

const AnimatedText = ({ selectedValue }: Props) => {

  const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);


  const font = useFont(require('../assets/fonts/Roboto-Bold.ttf'), 30);

  // Use useDerivedValue and format inside the worklet
  const animatedText = useDerivedValue(() => {
    return formatNumber(selectedValue.value);
  });

  if (!font) {
    return <View />;
  }

  const fontSize = font.measureText('2');

  return (
    <Canvas style={{ height: fontSize.height + 40 }}>
      <Text text={'$'} font={font} color={CurrentViewMode.Mode_fontColor} y={fontSize.height + 20} x={0} />
      <Text text={animatedText} font={font} color={CurrentViewMode.Mode_fontColor} y={fontSize.height + 20} x={30} />
    </Canvas>
  );
};

export default AnimatedText;
