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
import { GET_UNFINISHED_DETAILS, GET_UPPER_DETAILS } from "../../config/api";
import axios from "axios";
import { useState, useEffect } from "react";

const HomeScreen = () => {

  const [mathUnfinished, setMathUnfinished] = useState([])
  const [englishUnfinished, setEnglishUnfinished] = useState([])

  const quizData = [
    {
      id: "1",
      title: "SAT Quiz 1",
      description: "20 Questions",
      image: require("../../assets/images/maths.jpeg"),
      progress: "70%",
    },
    {
      id: "2",
      title: "SAT Quiz 2",
      description: "20 Questions",
      image: require("../../assets/images/writing.jpeg"),
      progress: "50%",
    },
    {
      id: "3",
      title: "SAT Quiz 3",
      description: "20 Questions",
      image: require("../../assets/images/sports.png"),
      progress: "80%",
    },
  ];

  const additionalData = [
    {
      id: "1",
      title: "Math Quiz 1",
      description: "10 Questions",
      image: require("../../assets/images/cube.png"),
      progress: "40%",
    },
    {
      id: "2",
      title: "Science Quiz 1",
      description: "15 Questions",
      image: require("../../assets/images/chemistry.png"),
      progress: "60%",
    },
    {
      id: "3",
      title: "History Quiz 1",
      description: "12 Questions",
      image: require("../../assets/images/fox.png"),
      progress: "80%",
    },
    {
      id: "5",
      title: "History Quiz 1",
      description: "12 Questions",
      image: require("../../assets/images/game.png"),
      progress: "80%",
    },
    {
      id: "6",
      title: "History Quiz 1",
      description: "12 Questions",
      image: require("../../assets/images/sports.png"),
      progress: "80%",
    },
    {
      id: "7",
      title: "History Quiz 1",
      description: "12 Questions",
      image: require("../../assets/images/sports.png"),
      progress: "80%",
    },
    {
      id: "8",
      title: "History Quiz 1",
      description: "12 Questions",
      image: require("../../assets/images/sports.png"),
      progress: "80%",
    },
  ];

  useEffect(() => {
    getUserStatus()
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
        console.log("yeh hai unfinished ka response:", response_02)
        setMathUnfinished(response_02?.data?.meta?.data?.Math);
        console.log("yeh hai all data of mathUnfinished", mathUnfinished)

        setEnglishUnfinished(response_02?.data?.meta?.data?.Reading_and_Writing);
        console.log("yeh hai all data of english unfinished", englishUnfinished)
        console.log("yeh hai total levels of homescren", totalLevels_02)
      }
      if (!response_01?.data?.error) {
        console.log("yeh hai upar ka response:", response_01)
      }
    } catch (error) {
      console.log("An Error Occured", error)
    }
  }

  const renderCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: item.progress }]} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAdditionalCard = ({ item }) => (
    <TouchableOpacity style={styles.additionalCard}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.cardImage2} />
      </View>
      <View style={styles.additionalCardContent}>
        <Text style={styles.cardTitle2}>{item.title}</Text>
        <Text style={styles.cardDescription2}>{item.description}</Text>
      </View>
      <Text style={styles.cardProgress}>{item.progress}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textIconContainer}>
        <Text style={styles.text}>Hello, Moss</Text>
        <Icon name="account-circle" size={25} color="#0651C6" />
      </View>
      <Text style={styles.bigheading}>What would you like to play today?</Text>

      <FlatList
        data={quizData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      />
      <Text style={styles.unfinishheading}>Unfinished Test</Text>

      {/* <FlatList
        data={additionalData}
        renderItem={renderAdditionalCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.secondscrollContainer}
      /> */}

      <ScrollView>
        {mathUnfinished ?
          mathUnfinished.map((item) => (
            <TouchableOpacity style={styles.additionalCard}>
              <View style={styles.imageContainer}>
                <Image source={require('../../assets/images/writing.jpeg')} style={styles.cardImage2} />
              </View>
              <View style={styles.additionalCardContent}>
                <Text style={styles.cardTitle2}>{item.section}</Text>
                <Text style={styles.cardDescription2}>Attempted Levels : {item.attempted_levels}</Text>
                <Text style={styles.cardDescription2}>Total Levels : {item.total_levels}</Text>

              </View>
              <Text style={styles.cardProgress}>{item.percentage}</Text>
            </TouchableOpacity>
          ))
          : (<ActivityIndicator size={'large'} color={"white"} />)}

        {englishUnfinished ?
          englishUnfinished.map((item) => (
            <TouchableOpacity style={styles.additionalCard}>
              <View style={styles.imageContainer}>
                <Image source={require('../../assets/images/maths.jpeg')} style={styles.cardImage2} />
              </View>
              <View style={styles.additionalCardContent}>
                <Text style={styles.cardTitle2}>{item.section}</Text>
                <Text style={styles.cardDescription2}>Attempted Levels : {item.attempted_levels}</Text>
                <Text style={styles.cardDescription2}>Total Levels : {item.total_levels}</Text>

              </View>
              <Text style={styles.cardProgress}>{item.percentage}</Text>
            </TouchableOpacity>
          ))
          : (<ActivityIndicator size={'large'} color={"white"} />)}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
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
    color: "#46557B",
    fontWeight: "600",
  },
  bigheading: {
    marginTop: 20,
    fontSize: 25,
    width: "80%",
    color: "#46557B",
    paddingHorizontal: 10,
    fontWeight: "500",
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

  unfinishheading: {
    fontSize: 14,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontWeight: "500",
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