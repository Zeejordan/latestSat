// import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native'
// import React from 'react'
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import SplashScreen from './src/Pages/SplashScreen'
// import LevelScreenV2 from './src/Pages/LevelScreenV2'
// import TestQuestion from './src/Pages/TestQuestion'
// import LevelComplete from './src/Pages/LevelComplete'
// import QuizComplete from './src/Pages/QuizComplete'
// import GoogleSplashScreen from './src/Pages/SplashScreen2'
// import LoginPage from './src/Pages/LoginPage'
// import HomeScreen from './src/Pages/HomeScreen'
// import OtpVerification from './src/Pages/OtpVerification'
// import GoogleAuth from './src/Pages/GoogleAuth';
// import ProfileDetails from './src/Pages/ProfileDetails';
// // import Infinite from './src/Pages/Infinite';
// import Footer from './src/Components/Footer';
// // import Levels from './src/Pages/Infinite';
// import Quiz from './src/Pages/Quiz';
// import Statistics from './src/Pages/Statistics';
// import MathsQuiz from './src/Pages/MathsQuiz';
// import ModuleGap from './src/Pages/ModuleGap';
// import SubjectModal from './src/Pages/SubjectModal';
// import SelectSubject from './src/Pages/SelectSubject';

// // const Stack = createNativeStackNavigator();

// const App = () => {
//   return (
//     <SafeAreaView style={styles.mainContainer}>
//       {/* <SplashScreen /> */}
//       {/* <GoogleSplashScreen/> */}
//       {/* <TestQuestion /> */}
//       {/* <LevelComplete /> */}
//       <QuizComplete />
//       {/* <LoginPage/> */}
//       {/* <HomeScreen /> */}
//       {/* <OtpVerification/> */}
//       {/* <GoogleAuth/> */}
//       {/* <ProfileDetails /> */}
//       {/* <Levels /> */}
//       {/* <SubjectModal /> */}
//       {/* <Quiz /> */}
//       {/* <EnglishQuiz /> */}
//       {/* <EnglishQuizQuestion /> */}
//       {/* <Statistics /> */}
//       {/* <ModuleGap /> */}
//       {/* <MathsQuiz /> */}
//       {/* <SelectSubject /> */}
//       {/* <Footer /> */}
//     </SafeAreaView>
//   )
// }

// export default App

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1
//   }
// })

//-------------------------------------------------------------------------------------------------------------------
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native'
import React, { useState } from 'react'

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import SplashScreen from './src/Pages/SplashScreen'
import LevelScreenV2 from './src/Pages/LevelScreenV2'
import TestQuestion from './src/Pages/TestQuestion'
import LevelComplete from './src/Pages/LevelComplete'
import QuizComplete from './src/Pages/QuizComplete'
import GoogleSplashScreen from './src/Pages/SplashScreen2'
import LoginPage from './src/Pages/LoginPage'
import HomeScreen from './src/Pages/HomeScreen'
import OtpVerification from './src/Pages/OtpVerification'
import ProfileDetails from './src/Pages/ProfileDetails';
import Levels from './src/Pages/Levels';
import Quiz from './src/Pages/Quiz';
import EnglishQuiz from './src/Pages/EnglishQuizModule1';
import EnglishQuizModule1 from './src/Pages/EnglishQuizModule1';
import EnglishQuizModule2 from './src/Pages/EnglishQuizModule2';
import ModuleGap from './src/Pages/ModuleGap';
import MathsQuiz from './src/Pages/MathsQuiz';
import Statistics from './src/Pages/Statistics';
import SelectSubject from './src/Pages/SelectSubject';
import StatusPage from './src/Components/StatusPage';

const Stack = createNativeStackNavigator();

const App = () => {
  const initialRoute = 'SplashScreen';
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="GoogleLogin" component={GoogleSplashScreen} />
        <Stack.Screen name="TestQuestion" component={TestQuestion} />
        <Stack.Screen name="LevelComplete" component={LevelComplete} />
        <Stack.Screen name="QuizComplete" component={QuizComplete} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="OtpVerification" component={OtpVerification} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
        <Stack.Screen name="Levels" component={Levels} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="English-Quiz-1" component={EnglishQuizModule1} />
        <Stack.Screen name="Module-Gap" component={ModuleGap} />
        <Stack.Screen name="Maths-Quiz" component={MathsQuiz} />
        <Stack.Screen name="Statistics" component={Statistics} />
        <Stack.Screen name="Select-Subject" component={SelectSubject} />
        <Stack.Screen name="StatusPage" component={StatusPage} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  }
})
