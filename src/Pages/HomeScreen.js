import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Footer from "../Components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_UNFINISHED_DETAILS, GET_UPPER_DETAILS, IMG_URL, LEVELS_STARTING, GET_USER_DETAILS } from "../../config/api";
import axios from "axios";
import { useState, useEffect } from "react";
import CircularProgress from 'react-native-circular-progress-indicator';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from "../theme";

const HomeScreen = () => {

  const navigation = useNavigation();

  const [mathUnfinished, setMathUnfinished] = useState([])
  const [englishUnfinished, setEnglishUnfinished] = useState([])
  const [quizStatus, setQuizStatus] = useState([])
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [levels, setLevels] = useState([]);
  const [totalLevels, setTotalLevels] = useState('');
  const [username, setUsername] = useState('');


  useEffect(() => {
    getUserStatus()
  }, [])

  useEffect(() => {
    if (levels.length > 0) {
      navigation.navigate('Levels', { levels, totalLevels });
    }
  }, [levels]);

  useEffect(() => {
    const fetUserDetails = async () => {
      const token = await AsyncStorage.getItem('token');
      const baseUrlGet = GET_USER_DETAILS;

      try {
        const response = await axios.get(baseUrlGet, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        })
        if (!response?.data?.error) {
          const tempUsername = response?.data?.meta?.username;
          setUsername(tempUsername);
        }
      } catch (error) {
        console.log("An Error Occured", error)
      }
    }
    fetUserDetails();
  }, [])

  const getUserStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    const baseUrlGetUnfinished = GET_UNFINISHED_DETAILS;
    const baseUrlGetUPPER = GET_UPPER_DETAILS;

    try {
      const response_02 = await axios.get(baseUrlGetUnfinished, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })

      const response_01 = await axios.get(baseUrlGetUPPER, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })

      if (!response_02?.data?.error) {
        // console.log("yeh hai unfinished ka response:", response_02)
        setMathUnfinished(response_02?.data?.meta?.data?.Math);
        console.log("yeh hai all data of mathUnfinished", mathUnfinished)

        setEnglishUnfinished(response_02?.data?.meta?.data?.Reading_and_Writing);
        console.log("yeh hai all data of english unfinished", englishUnfinished)
        // console.log("yeh hai total levels of homescren", totalLevels_02)
      }
      if (!response_01?.data?.error) {
        console.log("YEH HAI RESPONSE 1 KA RESPONSE:", response_01?.data);
        setQuizStatus(response_01?.data?.meta?.test_scores);
        console.log("YEH AHI QUIZ STATUS", quizStatus)
      }
    } catch (error) {
      console.log("An Error Occured", error)
    }
  }

  const handleLevelNavigation = async (subject, category) => {

    setSubject(() => subject);
    setCategory(() => category);
    console.log("YEH HAI SUBJECT ", subject)
    console.log("YEH HAI CATEGORY ", category)

    if (!subject || !category) return;

    console.log("YEH HAI check1");

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        LEVELS_STARTING,
        { subject, section: category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("THIS IS API RESPONSE IN HOMESCREEN")
      if (response?.data?.meta) {
        setLevels(response.data.meta.levels);
        setTotalLevels(response.data.meta.total_levels);
      }
    } catch (error) {
      if (error.response) {
        console.error('API Error Response:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  const handleQuizNavigation = () => {
    navigation.navigate('Quiz')
  }
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.linearGradientColor2, COLORS.linearGradientColor1]}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.textIconContainer}>
          {username ? (<Text style={styles.text}>Hello, {username}</Text>) : (<Text style={styles.text}>Hello, User</Text>)}
          {/* <Text style={styles.text}>Hello, User</Text> */}
          {/* <Icon name="account-circle" size={25} color="#0651C6" /> */}
          <TouchableOpacity onPress={() => navigation.navigate("Statistics")}>
            <Icon name="account-circle" size={25} color="#0651C6" />
          </TouchableOpacity>
        </View>
        <Text style={styles.bigheading}>What would you like to do today?</Text>

        {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {quizStatus ?
            quizStatus.map((item, index) => (
              <TouchableOpacity key={item.id || index} style={styles.card} onPress={handleQuizNavigation}>
                <Image source={item?.Image_URL ? { uri: `${IMG_URL}${item?.Image_URL}` } : require("../../assets/images/maths.jpeg")} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>SAT {item.Test_Name}</Text>
                    <Text style={styles.cardDescription}>Total Score : {item.Total_Score}</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill]} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
            : (<ActivityIndicator size={'large'} color={"white"} />)
          }
        </ScrollView> */}

        <TouchableOpacity style={styles.imageMockContainer}>
          <Image
            source={require('../../assets/images/writing.jpeg')}
            style={styles.imageMock} // Set width and height
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.showMoreButton} onPress={() => navigation.navigate('Quiz')}>
            <LinearGradient
              colors={['#0651C6', '#0470B8']} // Define gradient colors
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradientContainerOnlyButton}
            >
              <Text style={styles.showMoreText}>Show More</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.mockTestContainer}>
            <Text style={styles.mockTestText}>Mock Test</Text>
          </View>
        </TouchableOpacity>


        <Text style={styles.unfinishheading}>Levels Progress</Text>

        <ScrollView>
          {mathUnfinished ?
            mathUnfinished.map((item, index) => (
              <TouchableOpacity key={item.id || index} style={styles.additionalCard} onPress={() => handleLevelNavigation(item.subject, item.section)}>
                <View style={styles.imageContainer}>
                  <Image source={item?.image ? { uri: `${IMG_URL}${item?.image}` } : require("../../assets/images/maths.jpeg")} style={styles.cardImage2} />
                </View>
                <View style={styles.additionalCardContent}>
                  <Text style={styles.cardTitle2}>{item.section}</Text>
                  <Text style={styles.cardDescription2}>Attempted Levels : {item.attempted_levels}</Text>
                  <Text style={styles.cardDescription2}>Total Levels : {item.total_levels}</Text>
                </View>
                <View style={styles.progressCircleContainer}>
                  <CircularProgress
                    value={item.percentage}
                    activeStrokeWidth={6}
                    inActiveStrokeWidth={6}
                    radius={25}
                    progressValueColor={'#0470B8'}
                    activeStrokeColor={'#26A5E6'}
                    inActiveStrokeColor={'#ccc'}
                  />
                </View>
              </TouchableOpacity>
            ))
            : (<ActivityIndicator size={'large'} color={"white"} />)
          }

          {englishUnfinished ?
            englishUnfinished.map((item, index) => (
              <TouchableOpacity key={item.id || index} style={styles.additionalCard} onPress={() => handleLevelNavigation(item.subject, item.section)}>
                <View style={styles.imageContainer}>
                  <Image source={item?.image ? { uri: `${IMG_URL}${item?.image}` } : require("../../assets/images/writing.jpeg")} style={styles.cardImage2} />
                </View>
                <View style={styles.additionalCardContent}>
                  <Text style={styles.cardTitle2}>{item.section}</Text>
                  <Text style={styles.cardDescription2}>Attempted Levels : {item.attempted_levels}</Text>
                  <Text style={styles.cardDescription2}>Total Levels : {item.total_levels}</Text>
                </View>
                <View style={styles.progressCircleContainer}>
                  <CircularProgress
                    value={item.percentage}
                    activeStrokeWidth={6}
                    inActiveStrokeWidth={6}
                    radius={25}
                    progressValueColor={'#0470B8'}
                    activeStrokeColor={'#26A5E6'}
                    inActiveStrokeColor={'#ccc'}
                  />
                </View>
              </TouchableOpacity>
            ))
            : (<ActivityIndicator size={'large'} color={"white"} />)
          }
        </ScrollView>
      </LinearGradient>

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  textIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    marginTop: 10,
  },
  text: {
    color: "#0470B8",
    fontWeight: "600",
  },
  bigheading: {
    marginTop: 20,
    fontSize: 25,
    width: "80%",
    color: "#0470B8",
    paddingHorizontal: 10,
    fontWeight: "500",
  },
  imageMockContainer: {
    // height: hp("30%"),
    // width: wp('92%'),
    // backgroundColor: "white",
    // width: '100%',
    marginHorizontal: wp('4%'),
    marginBottom: hp("2.5%"),
    position: 'relative',
    marginTop: hp('1%')
  },
  imageMock: {
    width: wp('92%'),
    height: hp('30%'),
    borderRadius: 10,
  },
  showMoreButton: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    borderRadius: 15,
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.1%"),
  },
  gradientContainerOnlyButton: {
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.1%"),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showMoreText: {
    color: 'white',
    fontSize: hp("1.7%"),
    fontWeight: '700'
  },
  mockTestContainer: {
    position: 'absolute',
    top: 3,
    left: 15

  },
  mockTestText: {
    color: '#0470B8',
    fontWeight: '600',
    fontSize: hp('2.5%')
  },
  scrollContainer: {
    marginTop: 5,
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  card: {
    width: 270,
    height: "80%",
    marginRight: 15,
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderColor: "rgba(204, 204, 204, 0.5)",
    borderWidth: 1,
  },
  cardImage: {
    width: "100%",
    height: "80%",
    borderRadius: 10,
    resizeMode: "contain",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 10,
    color: "#888",
  },
  progressBarContainer: {
    width: "50%",
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0651C6",
  },
  progressCircleContainer: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unfinishheading: {
    fontSize: 14,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontWeight: "500",
    color: 'white',
    fontWeight: '700',
    marginLeft: 7
  },
  additionalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    backgroundColor: 'white',
    marginHorizontal: wp("3.5%")
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardImage2: {
    width: 60,
    height: 60,
    borderRadius: 70,
    resizeMode: "contain",
  },
  additionalCardContent: {
    justifyContent: "center",
    flex: 1,

  },
  cardTitle2: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  cardDescription2: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  cardProgress: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0651C6",
    textAlign: "right",
    width: "25%",
  },
  secondscrollContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default HomeScreen;
// Reading_and_Writing pe space ki jagah underscore ho raha hai backend se uske baad bass upar ki flatlist change hogi fir homeScreen khatam