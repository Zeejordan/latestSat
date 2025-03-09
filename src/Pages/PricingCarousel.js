import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
// import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { SUBSCRIPTION } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from "../theme";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const PricingCarousel = () => {

    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [data, setData] = useState([]);

    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        const token = await AsyncStorage.getItem('token');
        const baseUrlGet = SUBSCRIPTION;

        try {
            const response = await axios.get(baseUrlGet, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })

            if (!response?.data?.error) {
                setData(response?.data?.meta);
            }
        } catch (error) {
            console.log("An Error Occurred", error);
        }
    }

    return (
        <>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#0470B8"
            />
            <LinearGradient
                colors={[COLORS.linearGradientColor2, COLORS.linearGradientColor1]}
                // locations={[0, 0.5, 1]}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.container}>

                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.pop(1)}>
                        <AntDesign name={"arrowleft"} color={'white'} size={30} />
                    </TouchableOpacity>
                    <Text style={styles.chooseText}>CHOOSE YOUR PLAN</Text>
                </View>
                <FlatList
                    ref={flatListRef}
                    data={data}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    snapToAlignment="center"
                    snapToInterval={wp("80%") + 20} // Width of card + margin
                    decelerationRate="fast"
                    contentContainerStyle={{ alignItems: 'center' }} // Helps with vertical centering
                    renderItem={({ item }) => (
                        <LinearGradient
                            colors={[COLORS.semiGradient2, COLORS.semiGradient1]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.card}
                        >
                            <View style={styles.semiCart}>
                                <Text style={styles.planTitle}>{item.name}</Text>
                                <Text style={styles.price}>{item.amount}</Text>
                                <Text style={styles.planTitle}>{item.duration === '1_month' ? "1 Month" : "1 Year"}</Text>
                                <Text style={styles.price}>Quiz Limit : {item.quiz_limit}</Text>
                                <Text style={styles.price}>Levels Limit : {item.level_limit}</Text>
                                <Text style={styles.subtitle}>Basic SAT preparation essentials</Text>
                            </View>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Get Started</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    )}
                    keyExtractor={(_, index) => index.toString()}
                />

                <View style={styles.indicatorContainer}>
                    {data.map((_, index) => (
                        <Entypo
                            key={index}
                            name="dot-single"
                            size={40}
                            color={currentIndex === index ? "#fff" : "gray"}
                            style={{ marginHorizontal: 5 }}
                        />
                    ))}
                </View>
            </LinearGradient>
        </>
    );
};

export default PricingCarousel;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0470B8",
        paddingVertical: hp("3%"),
    },
    topBar: {
        flexDirection: 'row',
        alignItems: "center",
        gap: wp('5%'),
        justifyContent: 'flex-start'
    },
    chooseText: {
        fontSize: hp("3.5%"),
        color: "#fff",
        fontWeight: "bold",
        // marginBottom: hp("1%"),
    },
    card: {
        width: wp("80%"),
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
        marginHorizontal: 10,
        height: hp("70%"),
        paddingTop: hp('12%'),
        marginTop: hp('4%')

    },
    semiCart: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: hp('2%')
    },
    planTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#007bff",
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 5,
    },
    subtitle: {
        fontSize: 14,
        color: "gray",
        marginBottom: 10,
    },
    feature: {
        fontSize: 14,
        color: "black",
        marginVertical: 2,
    },
    excluded: {
        fontSize: 14,
        color: "red",
        marginVertical: 2,
    },
    button: {
        marginTop: hp('8%'),
        backgroundColor: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: hp('2.5%')
    },
    indicatorContainer: {
        flexDirection: "row",
        marginTop: 5,
    },
});
