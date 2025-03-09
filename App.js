import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
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
import EnglishQuizModule1 from './src/Pages/EnglishQuizModule1';
import ModuleGap from './src/Pages/ModuleGap';
import MathsQuiz from './src/Pages/MathsQuiz';
import Statistics from './src/Pages/Statistics';
import SelectSubject from './src/Pages/SelectSubject';
import StatusPage from './src/Components/StatusPage';
import UpdateProfile from './src/Pages/UpdateProfile';
import QuizAnalysisPage from './src/Pages/QuizAnalysisPage';
import { GlobalProvider } from './src/context/GlobalContext';
import WelcomeScreen1 from './src/welcomeScreens/WelcomeScreen1';
import WelcomeScreen2 from './src/welcomeScreens/WelcomeScreen2';
import WelcomeScreen3 from './src/welcomeScreens/WelcomeScreen3';
import WelcomeScreen4 from './src/welcomeScreens/WelcomeScreen4';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Import your i18n config
import SelectLanguage from './src/Pages/SelectLanguage';
import PricingCarousel from './src/Pages/PricingCarousel';

const Stack = createNativeStackNavigator();

const App = () => {
  const initialRoute = 'Welcome-Screen-1';

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="white"
      />

      <I18nextProvider i18n={i18n}>
        <GlobalProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={initialRoute}
              screenOptions={{
                headerShown: false,
              }}>
              {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}
              <Stack.Screen name="Welcome-Screen-1" component={WelcomeScreen1} />
              <Stack.Screen name="Welcome-Screen-2" component={WelcomeScreen2} />
              <Stack.Screen name="Welcome-Screen-3" component={WelcomeScreen3} />
              <Stack.Screen name="Welcome-Screen-4" component={WelcomeScreen4} />
              <Stack.Screen name="Select-Language" component={SelectLanguage} />
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
              <Stack.Screen name="Update-Profile" component={UpdateProfile} />
              <Stack.Screen name="Quiz-Analysis" component={QuizAnalysisPage} />
              <Stack.Screen name="Subscription" component={PricingCarousel} />
            </Stack.Navigator>
          </NavigationContainer>
        </GlobalProvider>
      </I18nextProvider>

    </>
  )
}

export default App;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
