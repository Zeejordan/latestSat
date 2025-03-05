import { StyleSheet, Text, View, SafeAreaView, Image, FlatList, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Footer from '../Components/Footer';
import { GET_USER_DETAILS, LOGOUT, BASE_URL, IMG_URL } from '../../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const Statistics = () => {

    const navigation = useNavigation();
    useEffect(() => {
        getUserDetails();
    }, [])


    const [userData, setUserData] = useState(null);


    const getUserDetails = async () => {
        const baseUrlGet = GET_USER_DETAILS;
        const token = await AsyncStorage.getItem('token');


        try {
            const response = await axios.get(baseUrlGet, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            setUserData(response?.data?.meta);
            console.log("THIS IS USERDATA PROFILE IMAGE", `${BASE_URL}${userData?.avatar_image_url}`)

        } catch (error) {
            console.log("An Error Occured", error)
        }
    }

    const handleLogout = async () => {
        const token = await AsyncStorage.getItem('token');
        const baseUrlPost = LOGOUT;
        try {
            const response = await axios.get(baseUrlPost, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })

            if (!response?.data?.error) {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.clear();
                navigation.navigate("Login");
            }
        } catch (error) {
            console.log("An Error Occured", error)
        }
    }

    const handleUpdateProfile = () => {
        navigation.navigate('Update-Profile')
    }


    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.profileGradientColor1, COLORS.profileGradientColor2, COLORS.profileGradientColor3]}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.topGradient}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name={"arrowleft"} size={27} color={"white"} style={styles.backArrow} />
                </TouchableOpacity>
                <Text style={styles.profileText}>Profile</Text>
                <Text>                    </Text>
            </LinearGradient>
            <Image source={userData?.avatar_image_url ? { uri: `${IMG_URL}${userData?.avatar_image_url}` } : require('../../assets/images/profileStatistics.png')} style={styles.profileStatisticsImage} onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)} />
            {
                userData ? (
                    <View style={styles.container}>
                        <ScrollView
                            style={styles.subContainer}
                            contentContainerStyle={{ paddingBottom: hp('10%') }}
                            showsVerticalScrollIndicator={false}
                        >
                            <TouchableOpacity style={styles.editIconContainer} onPress={handleUpdateProfile}>
                                <Feather name={"edit"} size={25} style={styles.editIcon} />
                            </TouchableOpacity>
                            <View style={styles.section}>
                                <Text style={styles.fieldHeading}>Name</Text>
                                <View style={styles.singleField}>
                                    <Text style={styles.fieldText}>{userData.name}</Text>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.fieldHeading}>Username</Text>
                                <View style={styles.singleField}>
                                    <Text style={styles.fieldText}>{userData.username}</Text>
                                </View>
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.fieldHeading}>Email</Text>
                                <View style={styles.singleField}>
                                    <Text style={styles.fieldText}>{userData.email}</Text>
                                </View>
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.fieldHeading}>Phone Number</Text>
                                <View style={styles.singleField}>
                                    <Text style={styles.fieldText}>{userData.phone_number}</Text>
                                </View>
                            </View>


                            {/* <Text style={styles.statisticsText}>Statistics</Text>
                                <Text style={styles.levelText}>Level Stats</Text> */}

                            {/* <View style={styles.secondSection}>
                                    <View style={styles.levelSection}>
                                        <Text style={styles.pointsEarnedText}>⭐</Text>
                                        <Text style={styles.pointsEarnedText}>Points Earned</Text>
                                        <Text style={styles.Text50}>50</Text>
                                    </View>
                                    <View style={styles.levelSection}>
                                        <Text style={styles.pointsEarnedText}>Level Completed(ENG)</Text>
                                        <Text style={styles.Text50}>12</Text>
                                    </View>
                                    <View style={styles.levelSection}>
                                        <Text style={styles.pointsEarnedText}>Level Completed(MATH)</Text>
                                        <Text style={styles.Text50}>15</Text>
                                    </View>
                                </View>
                                <Text style={styles.levelText}>Quiz Stats</Text>
                                <View style={styles.secondSection}>
                                    <View style={styles.levelSection}>
                                        <Text style={styles.pointsEarnedText}>✅</Text>
                                        <Text style={styles.pointsEarnedText}>Test Completed</Text>
                                        <Text style={styles.Text50}>50</Text>
                                    </View>
                                    <View style={styles.levelSection}>
                                        <Text style={styles.pointsEarnedText}>❌</Text>
                                        <Text style={styles.pointsEarnedText}>Level Failed</Text>
                                        <Text style={styles.Text50}>12</Text>
                                    </View>
                                    <View style={styles.levelSection}>
                                        <Text style={styles.pointsEarnedText}>✔️</Text>
                                        <Text style={styles.pointsEarnedText}>Level Passed</Text>
                                        <Text style={styles.Text50}>15</Text>
                                    </View>
                                </View> */}
                            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                <Text style={styles.logoutText}>Log Out</Text>
                                <MaterialCommunityIcons name={"logout"} size={22} color={'white'} />
                            </TouchableOpacity>

                        </ScrollView>
                        <Footer />
                    </View>
                ) : (
                    <ActivityIndicator size="large" color="blue" />
                )
            }
        </SafeAreaView>
    )
}

export default Statistics

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        marginTop: hp("2%")
    },
    topGradient: {
        height: hp('12%'),
        width: wp('100%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: wp('4%'),
        paddingTop: hp('1%')
        // alignItems: 'center'
    },
    profileText: {
        color: 'white',
        fontSize: hp('3.4%'),
        marginLeft: wp('8%'),
        marginTop: hp('1%'),
        fontWeight: '600'
    },
    backArrow: {
        // marginLeft: wp('8%'),
        marginTop: hp('1%'),
    },
    profileStatisticsImage: {
        position: 'absolute',
        top: hp('6.5%'),
        left: wp('6.6%'),
        height: hp('10%'),
        width: hp('10%'),
        zIndex: 10
    },
    flatListContent: {
        marginTop: hp('7%'),
        paddingBottom: hp('10%'),
    },
    singleField: {
        borderWidth: 1,
        borderColor: '#7C7C7C',
        borderRadius: 5,
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('4%'),
    },
    fieldHeading: {
        fontSize: hp('2.5%')
    },
    fieldText: {
        color: '#2562C1',
        fontWeight: '700',
        fontSize: hp('2%')
    },
    subContainer: {
        marginHorizontal: wp('7%'),
        flexDirection: 'column',
        gap: hp('10%'),
        marginTop: hp("3%")
    },
    section: {
        gap: hp("0.8%"),
        marginVertical: hp('1%')
    },
    statisticsText: {
        fontSize: hp("4%"),
        marginBottom: hp('1%')
    },
    statisticsContainer: {},
    levelSection: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#7C7C7C',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: hp('2%')
    },
    levelText: {
        fontSize: hp('2%'),
        fontWeight: '600',
        marginTop: hp('2%'),
        marginBottom: hp('1.5%')
    },
    pointsEarnedText: {
        color: "#7C7C7C",
        fontSize: hp('2%'),
    },
    Text50: {
        color: "black",
        fontSize: hp('2%'),
        fontWeight: '500'
    },
    secondSection: {
        gap: hp('2%')
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: 'red',
        marginVertical: hp("6%"),
        marginHorizontal: wp('25%'),
        paddingVertical: hp('0.8%'),
        borderWidth: 1,
        borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        borderRadius: 10
    },
    logoutText: {
        textAlign: 'center',
        color: 'white',
        fontSize: hp('2.3%')
    },
    editIconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    editIcon: {
        marginRight: wp('0.5%'),
    },
})

