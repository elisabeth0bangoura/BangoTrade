import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Swiper from 'react-native-realistic-deck-swiper';
import { height, size, width } from 'react-native-responsive-sizes';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message'; // Import Toast
import { useRouter } from 'expo-router';
import { firebase } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../Languages_Translation_Screens/i18n';






















const Courses = () => {

  const { t } = useTranslation();
  const swiperRef = useRef(null); // Reference to the swiper component
  const router = useRouter();
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["30%"], []);
  const [sheetIndex, setSheetIndex] = useState(-1); // BottomSheet initially hidden
  const [userAnswer, setUserAnswer] = useState(null);
  const [rightanswerOption, setRightanswerOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false); // Control BottomSheet visibility
  const [CloseInfo, setCloseInfo] = useState(false);
  const [CorrectAnswers, setCorrectAnswers] = useState(0); // Store correct answers count
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);  // Track the current index of the question
  const [user, setUser] = useState(null);  // State to store user info
  const [UserLang, setUserLang] = useState()









   // Listener for authentication state changes
   useEffect(() => {


    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("Hello ", user.uid)
        setUser(user.uid);  // User is signed in
      } else {
        setUser(null);  // No user is signed in
      }
    });
  
    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);
  




  useEffect(() => {
    if (UserLang && UserLang !== i18n.language) {
      i18n.changeLanguage(UserLang); // Set language dynamically based on UserLang
      console.log('Language set to:', UserLang); // Debugging output
    }
  }, [UserLang]);




  const Data = [
    // Light questions
    { 
      id: 1, 
      section: "1",
      question: t("cryptoFutureQuestion1"),
      rightanswer: t("cryptoFutureRightAnswer1"),
      all_answers: [
        t("cryptoFutureA1"),
        t("cryptoFutureB1"),
        t("cryptoFutureC1"),
       t("cryptoFutureD1"),
      ],
      explanation: t("cryptoFutureExplanation1"),
    },
    
    // Medium questions


    { 
      id: 2, 
      section: "2",
      question: t("cryptoFutureQuestion2"),
      rightanswer: t("cryptoFutureRightAnswer2"),
      all_answers: [
       t("cryptoFutureA2"),
       t("cryptoFutureB2"),
        t("cryptoFutureC2"),
        t("cryptoFutureD2"),
      ],
      explanation: t("cryptoFutureExplanation2")
    },
    
    // Hard questions
    { 
      id: 3, 
      section: "3",
      question: t("cryptoFutureQuestion3"),
      rightanswer: t("cryptoFutureRightAnswer3"),
      all_answers: [
        t("cryptoFutureA3"),
        t("cryptoFutureB3"),
        t("cryptoFutureC3"),
        t("cryptoFutureD3")
      ],
      explanation: t("cryptoFutureExplanation3")
    },
    
    { 
      id: 4, 
      section: "4",
      question: t("cryptoFutureQuestion4"),
      rightanswer: t("cryptoFutureRightAnswer4"),
      all_answers: [
        t("cryptoFutureA4"),
        t("cryptoFutureB4"),
        t("cryptoFutureC4"),
        t("cryptoFutureD4")
      ],
      explanation: t("cryptoFutureExplanation4")
    },
  ];
  
  






  const lastItemId = Data[Data.length - 1].id;  // Access last item's id
  const previousItemId = currentIndex > 0 ? Data[currentIndex - 1].id : lastItemId;  // Get the previous item's id

  console.log(previousItemId);  // This should log 3 if the last id is 4
  

  const handleSheetChange = useCallback((index) => {
    console.log("Sheet snapped to:", index);
  }, []);


  
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        onPress={() => {
          // Close the bottom sheet when the backdrop is pressed
        //  sheetRef.current?.close();
          setSheetIndex(-1)
        }}
      />
    ),
    []
  );
  
















  const _renderCard = (item) => {
  
    
    return (
      <View style={{
        width: "100%",
        height: "100%",
        backgroundColor: '#F7F7F7',
        borderRadius: 5,
      }}>
        <Text style={{
          fontSize: size(16),
          fontWeight: "bold",
          color: "#A2A9B4",
          marginLeft: width(5),
          marginTop: height(4)
        }}>
           {t("question")} {item.section} {t("question2")} {previousItemId}
        </Text>
        <Text style={{
          fontSize: size(22),
          width: "90%",
          color: "#000",
          marginLeft: width(5),
          marginTop: height(4)
        }}>
          {item.question}
        </Text>

        {item.all_answers.map((answer, index) => (
          <View key={index} style={{
            paddingVertical: 12,
            top: height(5),
            width: "90%",
            alignSelf: 'center',
            paddingHorizontal: 20,
            backgroundColor: '#fff',
            marginBottom: height(1),
            borderRadius: 5,
          }}>
            <View style={{
              flexDirection: 'row',
              height: "auto",
              alignItems: 'center',
            }}>
             <TouchableOpacity
              style={{
                height: size(25),
                width: size(25),
                borderRadius: size(25) / 2,
                borderWidth: 1,
                borderColor: '#000',
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {



                setSheetIndex(1)

                database()
                .ref(`/users/${user}/Courses/Future_Of_Cryptocurrencies`)
                .set({
                  status: "started",
                  courseName: "Future of Cryptocurrencies",
                  date: new Date().toISOString(),
                })
                .then(() => {
                  console.log('Data set.')
                 
                })

                .catch((err) => {
                  console.log(err)
                })



             // Check if current item is the last item
              if (item.id === Data[Data.length - 1].id) {
                console.log("This is the last item.");
                setCurrentQuestionIndex(true)
              } else {
                console.log("This is not the last item.");
                setCurrentQuestionIndex(false)
              }


                
                // Set the user answer

                setUserAnswer(answer);
                setRightanswerOption(item.rightanswer);
                
                // Check if the answer is correct
                const correct = answer === item.rightanswer;
                setIsCorrect(correct);

                if (correct) {
                  setCorrectAnswers(prev => prev + 1); // Increment correct answers count
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Provide feedback for correct answer
                }

              
                

                // Show toast if the answer is wrong
                if (!correct) {
                  Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: t("QuizErrorText1"),
                    text2: t("QuizErrorText2"),
                    visibilityTime: 10000, // Show for 10 seconds
                    autoHide: true,
                    topOffset: 60, // Position from the top
                  });
                }
              }}
            >
              {/* Render a circle to indicate the selected answer */}
              {userAnswer === answer && (
                <View style={{
                  height: size(10),
                  width: size(10),
                  backgroundColor: '#000',
                  borderRadius: size(10) / 2,
                  alignSelf: 'center',
                }} />
              )}
            </TouchableOpacity>

              <Text style={{
                fontSize: size(16),
                marginLeft: width(3),
                color: '#000',
              }}>
                {answer}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const handleNextLesson = () => {
    if (swiperRef.current) {
      swiperRef.current.goForward(); // Use goForward() to move to the next card
    }
    sheetRef.current?.close(); // Close the BottomSheet after the "Next Lesson" button is pressed
    setIsCorrect(false); // Reset BottomSheet visibility state
    setUserAnswer(null); // Reset selected answer state
  };

  const onSwipe = () => {
    // Reset state when the card is swiped
    setIsCorrect(false); // Reset BottomSheet state when a new card is swiped
    setUserAnswer(null);
  };

  return (
    <>
      <BottomSheetModalProvider>
        <GestureHandlerRootView>


          
          <LinearGradient
            colors={['#FF50AE', '#D9016D']}
            style={{
              height: "100%",
              width: "100%"
            }}
          >
            <TouchableOpacity onPress={() => sheetRef.current?.close()}> 
              <View style={{ flexDirection: 'row', width: 200, height: 50, marginLeft: width(5), marginTop: height(8), alignItems: 'center' }}>
                <View style={{ height: 30, width: 30 }}>
                  <Image
                    source={require("../../assets/images/LogoWhite_white.png")}
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </View>

                <Text style={{
                  fontSize: size(16),
                  fontWeight: "bold",
                  marginLeft: width(2),
                  color: '#fff',
                }}>
                  {t("cryptoBasics")}
                </Text>
              </View>
            </TouchableOpacity>


            

            <View style={{ top: height(5), height: "70%", width: "100%" }}>


              
              <Swiper
                ref={swiperRef}  
                deckSize={2}
                cardsData={Data}
                renderCard={_renderCard}
                currentIndex={0}
                containerStyle={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onSwiped={onSwipe}  
                style={{
                  height: "100%",
                  width: "89%",
                  borderRadius: 10,
                  margin: 20,
                  backgroundColor: "#fff",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.41,
                  shadowRadius: 9.11,
                  elevation: 14,
                }}
              />
            </View>
          </LinearGradient>

        
        


          {/* Show BottomSheet only after the user selects the correct answer */}
          {isCorrect && (
            <BottomSheet
              ref={sheetRef}
              index={1}  // 1 for showing the BottomSheet
              backdropComponent={renderBackdrop}
              snapPoints={["45%"]}
              enablePanDownToClose={true} 
              style={{
                backgroundColor: 'transparent',
                shadowColor: '#000',
                zIndex: 10000,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 20,
                }}
  
              handleIndicatorStyle={{
                backgroundColor: sheetIndex == 1 ? "#fff" : "transparent", 
                height: size(4), 
                width: size(40), 
                marginTop: -25,
                alignSelf: 'center',
                borderRadius: 20,  // Add borderRadius here to make the handle rounded
                }}
                handleStyle={{
                backgroundColor: "#0F1317", 
                borderTopLeftRadius: 50,  // Rounded top-left corner of the handle
                borderTopRightRadius: 50, // Rounded top-right corner of the handle
                }}
                backgroundStyle={{
                backgroundColor: '#0F1317',
                }}>

              <BottomSheetScrollView contentContainerStyle={{
                backgroundColor: '#0F1317',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <LottieView
                  autoPlay
                  loop={false}
                  style={{
                    top: height(-10),
                    width: 100,
                    height: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  source={require("../../assets/Done_Animation.json")}
                />


                  {currentQuestionIndex == false
                  ? 

                  <Text style={{
                  textAlign: 'center',
                  color: "#F8F9F9",
                  lineHeight: 25,
                  fontWeight: "bold",
                  fontSize: size(16),
                  top: height(-4),
                }}>
                 {t("veryGoodMessage1")}
                 {"\n"}
                 {t("veryGoodMessage2")}
                </Text>

                :

                null
              }



                {/* Show buttons only when it's the last item by id */}
                {currentQuestionIndex == true 

                ?
                  <>


                <Text style={{
                  textAlign: 'center',
                  color: "#F8F9F9",
                  lineHeight: 25,
                  fontWeight: "bold",
                  fontSize: size(16),
                  top: height(-9),
                }}>
                  {t("congratulationsMessage1")}
                  {"\n"}
                  {t("congratulationsMessage2")}
                </Text>


                    <TouchableOpacity onPress={() => router.push("/(tabs)/home")} 
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      position: 'absolute',
                      bottom: height(12),
                      backgroundColor: '#fff',
                      borderRadius: 20,
                      width: width(80),
                    }}>
                      <Text style={{
                        fontSize: size(16),
                        alignSelf: 'center',
                        color: '#000',
                        fontWeight: "bold",
                      }}>
                        {t("goToPortfolioButton")}
                      </Text>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => 
               

                    database()
                    .ref(`/users/${user}/Courses/Future_Of_Cryptocurrencies`)
                    .set({
                      status: "done",
                      courseName: "Future of Cryptocurrencies",
                      date: new Date().toISOString(),
                    })
                    .then(() => {
                      console.log('Data set.')
                      router.push("/(learn)/articleCryptoTaxesAccounting")
                    })

                    .catch((err) => {
                      console.log(err)
                    })

                  
                  } 
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      position: 'absolute',
                      bottom: height(5),
                      backgroundColor: '#1653F0',
                      borderRadius: 20,
                      width: width(80),
                    }}>
                      <Text style={{
                        fontSize: size(16),
                        alignSelf: 'center',
                        fontWeight: "bold",
                        color: '#fff',
                      }}>
                       {t("nextLessonButton")}
                      </Text>
                    </TouchableOpacity>
                  </>
                
                  :
                  
                  null
                  
                }
              </BottomSheetScrollView>
            </BottomSheet>
          )}

        </GestureHandlerRootView>
      </BottomSheetModalProvider>
      {/* Toast component for displaying messages */}
      <Toast />
    </>
  );
};

export default Courses;
