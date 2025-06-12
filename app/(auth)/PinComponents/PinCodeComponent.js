import { ViewModeContext } from '@/app/Context/ViewModeContext';
import React, {
    useRef,
    forwardRef,
    useImperativeHandle,
    useContext,
    useEffect,
  } from 'react';
  import { StyleSheet, TouchableOpacity, View, Text, Animated } from 'react-native';
  import { size } from 'react-native-responsive-sizes';
  
  const PinCodeComponent = forwardRef(({
    pin,
    handleDeleteButtonPress,
    handleNumberButtonPress,
    pinLength,
    title,
    titleStyle,
    numpadTextStyle,
    bulletStyle,
  }, ref) => {
    const opacityAnimations = useRef([...Array(pinLength)].map(() => new Animated.Value(1))).current;
  
    const { CurrentViewMode, setCurrentViewMode, themes } = useContext(ViewModeContext);

	

    const triggerFadeAnimation = () => {
      const animations = opacityAnimations.map((anim, index) =>
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 150,
            delay: index * 50,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ])
      );
  
      Animated.stagger(50, animations).start();
    };
  
    const reset = () => {
      opacityAnimations.forEach(anim => anim.setValue(1));
    };
  
    useImperativeHandle(ref, () => ({
      animate: triggerFadeAnimation,
      reset,
    }));
  
    useEffect(() => {
      reset(); // Make sure animation is reset every time this mounts
    }, []);



    const styles = StyleSheet.create({
      numpadText: {
        fontSize: 27,
        textAlign: 'center',
      },
      title: {
        fontSize: 20,
      },
      filledDot: {
        backgroundColor: "#fff",
        borderRadius: size(35) / 2,
        height: size(35),
        width: size(35),
      },
      emptyDot: {
        backgroundColor: CurrentViewMode.Mode_Sec_fontColor,
        borderRadius: size(35) / 2,
        height: size(35),
        width: size(35),
      },
    });
  
    return (
      <View style={{ flex: 1, justifyContent: 'space-around' }}>
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        </View>
  
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          {Array.from({ length: pinLength }).map((_, i) => {
            const isFilled = i < pin.length;
            return (
              <View key={i} style={{ marginHorizontal: 6 }}>
                {isFilled ? (
                  <Animated.View
                  style={[
                    styles.filledDot,
                    { backgroundColor: CurrentViewMode.Mode_fontColor, }, // Force white filled dot
                    bulletStyle,
                    { opacity: opacityAnimations[i] }
                  ]}
                />
                
                ) : (
                  <View style={[styles.emptyDot, bulletStyle]} />
                )}
              </View>
            );
          })}
        </View>
  
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'stretch', flex: 2 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
            <View key={number} style={{ flexBasis: '33.3%' }}>
              <TouchableOpacity onPress={() => handleNumberButtonPress(number)}>
                <Text style={[styles.numpadText, numpadTextStyle]}>{number}</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ alignItems: 'center', flexBasis: '33.3%' }} />
          <View style={{ flexBasis: '33.3%' }}>
            <TouchableOpacity onPress={() => handleNumberButtonPress(0)}>
              <Text style={[styles.numpadText, numpadTextStyle]}>0</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexBasis: '33.3%' }}>
            <TouchableOpacity onPress={handleDeleteButtonPress}>
              <Text style={[styles.numpadText, numpadTextStyle]}>{'\u232B'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  });
  

  
  export default PinCodeComponent;
  