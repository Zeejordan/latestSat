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

// stop stop stop stop stop stop stop stop stop 
const Statistics = () => {

    const navigation = useNavigation();
    useEffect(() => {
        getUserDetails();
    }, [])

    const [collapseVisible, setCollapseVisible] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState({});


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

    const handleCollapse = (title) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const RenderItem = ({ title, listHeadings, listItems }) => {
        const isVisible = collapsedSections[title];
        return (
            <View style={[styles.titleBox, { backgroundColor: isVisible ? 'white' : "#F5F5F5" }]}>
                <View style={styles.titleSemiBox}>
                    <View style={styles.titleTextContainer}>
                        <Text style={styles.titleText}>{title}</Text>
                    </View>
                    <TouchableOpacity style={styles.arrowDown} onPress={() => handleCollapse(title)}>
                        {isVisible ? <AntDesign name="up" size={18} /> : <AntDesign name="down" size={15} />}
                    </TouchableOpacity>
                </View>
                {isVisible &&
                    listHeadings.map((item, index) => (
                        <View key={index.toString()} style={styles.infoBoxes}>
                            <View style={styles.section}>
                                <Text style={styles.fieldHeading}>{listHeadings[index]}</Text>
                                <View style={styles.singleField}>
                                    <Text style={styles.fieldText}>{listItems[index] || "N/A"}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                }
            </View>
        )
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

                            <View style={styles.masterContainer}>
                                <RenderItem title={"Basic Student Information"} listHeadings={["Name", "Username", "Email", "Phone Number"]} listItems={[userData.name, userData.username, userData.email, userData.phone_number]} />
                                <RenderItem title={"Academic Information"} listHeadings={["High School Name", "SAT Subject Test Preferences", "GPA", "Intended Major"]} listItems={[userData.high_school_name, userData.sat_subject_test_preferences, userData.gpa, userData.intended_major]} />
                                <RenderItem title={"SAT Exam Details"} listHeadings={["SAT Registration Number", "Exam Center & Location", "Previous SAT Score", "Target SAT Score"]} listItems={[userData.sat_registration_number, userData.sat_exam_center, userData.previous_sat_score, userData.target_sat_score]} />
                                <RenderItem title={"Target College Information"} listHeadings={["Target College Location", "Intended College Start Year", "Application Type"]} listItems={[userData.target_college_location, userData.intended_college_start_year, userData.application_type]} />
                                <RenderItem title={"Financial & Scholarship Information"} listHeadings={["Financial Aid Requirement", "Scholarships Interested In", "Family Annual Income"]} listItems={[userData.financial_aid_required, userData.scholarships_interested_in, userData.family_annual_income]} />
                                <RenderItem title={"Extracurricular & Other Details"} listHeadings={["Extra Curricular Activities", "Volunteer Experience", "Internships/Work Experience", "Awards & Achievements"]} listItems={[userData.extracurricular_activities, userData.volunteer_experience, userData.internships, userData.awards]} />
                            </View>

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
        flex: 1,
        backgroundColor: 'white'

    },
    container: {
        flex: 1,
        marginTop: hp("2%"),
        backgroundColor: 'white'
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
    infoBoxes: {
        marginTop: hp('1%')
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
    masterContainer: {

    },
    titleBox: {
        flexDirection: 'column',
        justifyContent: 'center',
        // alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 10,
        elevation: 4,
        marginTop: hp('2%')
    },
    titleSemiBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: '#F5F5F5'
    },
    titleTextContainer: {

    },
    titleText: {
        color: '#3A6EA5',
        fontSize: hp('2.2%'),
        fontWeight: '600'
    },
    arrowDown: {},
})

// < View style = { styles.section } >
//                             <Text style={styles.fieldHeading}>Name</Text>
//                             <View style={styles.singleField}>
//                                 <Text style={styles.fieldText}>{userData.name}</Text>
//                             </View>
//                         </ >
//                         <View style={styles.section}>
//                             <Text style={styles.fieldHeading}>Username</Text>
//                             <View style={styles.singleField}>
//                                 <Text style={styles.fieldText}>{userData.username}</Text>
//                             </View>
//                         </View>
//                         <View style={styles.section}>
//                             <Text style={styles.fieldHeading}>Email</Text>
//                             <View style={styles.singleField}>
//                                 <Text style={styles.fieldText}>{userData.email}</Text>
//                             </View>
//                         </View>
//                         <View style={styles.section}>
//                             <Text style={styles.fieldHeading}>Phone Number</Text>
//                             <View style={styles.singleField}>
//                                 <Text style={styles.fieldText}>{userData.phone_number}</Text>
//                             </View>
//                         </View>
