import { StyleSheet, Text, View, SafeAreaView, Image, FlatList, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Footer from '../Components/Footer';
import { GET_USER_DETAILS, UPDATE_USER_DETAILS, IMG_URL } from '../../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


import avatar_1 from '../../assets/images/avatar_1.png';
import avatar_2 from '../../assets/images/avatar_2.png';
import avatar_3 from '../../assets/images/avatar_3.png';
import avatar_4 from '../../assets/images/avatar_4.png';
import avatar_5 from '../../assets/images/avatar_5.png';
import avatar_6 from '../../assets/images/avatar_6.png';
import avatar_7 from '../../assets/images/avatar_7.png';
import avatar_8 from '../../assets/images/avatar_8.png';
import avatar_9 from '../../assets/images/avatar_9.png';
import avatar_10 from '../../assets/images/avatar_10.png';
import avatar_11 from '../../assets/images/avatar_11.png';
import avatar_12 from '../../assets/images/avatar_12.png';
import avatar_13 from '../../assets/images/avatar_13.png';
import avatar_14 from '../../assets/images/avatar_14.png';


const UpdateProfile = () => {

    const navigation = useNavigation();
    useEffect(() => {
        getUserDetails();
    }, [])

    const [collapseVisible, setCollapseVisible] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState({});

    const [userData, setUserData] = useState(null);
    const [payload, setPayload] = useState({
        "name": "",
        "phone_number": "",
        "username": "",
        "avatar": "",
        "user_id": "",
        "email": ""
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const images = [
        { key: "avatar_1", image: avatar_1 },
        { key: "avatar_2", image: avatar_2 },
        { key: "avatar_3", image: avatar_3 },
        { key: "avatar_4", image: avatar_4 },
        { key: "avatar_5", image: avatar_5 },
        { key: "avatar_6", image: avatar_6 },
        { key: "avatar_7", image: avatar_7 },
        { key: "avatar_8", image: avatar_8 },
        { key: "avatar_9", image: avatar_9 },
        { key: "avatar_10", image: avatar_10 },
        { key: "avatar_11", image: avatar_11 },
        { key: "avatar_12", image: avatar_12 },
        { key: "avatar_13", image: avatar_13 },
        { key: "avatar_14", image: avatar_14 }
    ];


    useEffect(() => {
        if (userData) {
            setPayload({
                name: userData.name || "",
                phone_number: userData.phone_number || "",
                username: userData.username || "",
                avatar: userData.avatar || "",
                user_id: userData.user_id || "",
                email: userData.email || ""
            })
            console.log("THIS IS USERDATA", userData)
        }
    }, [userData])

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
        } catch (error) {
            console.log("An Error Occured", error)
        }
    }

    const handleSave = async () => {
        const baseUrlPut = UPDATE_USER_DETAILS;
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await axios.put(baseUrlPut, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })

            if (!response?.data?.error) {
                console.log("BOLNE LAGI")
            } else {
                Alert.alert("Error", "Could not update profile");
            }
        } catch (error) {
            console.log("An Error Occured", error)
        } finally {
            navigation.navigate('Statistics')
        }
    }

    const handleCancel = () => {
        navigation.navigate("Statistics")
    }

    const handleCollapse = (title) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const handleSelectImage = (imageKey) => {
        console.log("Selected image key:", imageKey);
        setPayload((prev) => ({
            ...prev,
            avatar: imageKey,
        }));
        setSelectedImage(imageKey);
        setModalVisible(false);
    };

    // stop stop stop stop stop stop stop stop stop stop sto 
    const RenderItem = ({ title, listHeadings, listItems, fieldKeys }) => {
        const isVisible = collapsedSections[title];

        return (
            <TouchableOpacity style={[styles.titleBox, { backgroundColor: isVisible ? 'white' : "#F5F5F5" }]} onPress={() => handleCollapse(title)}>
                <View style={styles.titleSemiBox}>
                    <View style={styles.titleTextContainer}>
                        <Text style={styles.titleText}>{title}</Text>
                    </View>
                    <View style={styles.arrowDown} >
                        {isVisible ? <AntDesign name="up" size={18} /> : <AntDesign name="down" size={15} />}
                    </View>
                </View>
                {isVisible &&
                    listHeadings.map((item, index) => (
                        <View key={index.toString()} style={styles.infoBoxes}>
                            <View style={styles.section}>
                                <Text style={styles.fieldHeading}>{item}</Text>

                                <TextInput
                                    style={styles.singleField}
                                    value={payload[fieldKeys[index]] || ""}
                                    onChangeText={(text) => setPayload(prev => ({
                                        ...prev,
                                        [fieldKeys[index]]: text
                                    }))}
                                    placeholder={`Enter ${item}`}
                                    placeholderTextColor="#A9A9A9"
                                />

                            </View>
                        </View>
                    ))
                }
            </TouchableOpacity>
        );
    };
    // stop stop stop stop stop stop stop sto pstop stop stop sto p
    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.profileGradientColor1, COLORS.profileGradientColor2, COLORS.profileGradientColor3]}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.topGradient}
            >
                <View style={styles.profileContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <AntDesign name={"arrowleft"} size={27} color={"white"} style={styles.backArrow} />
                    </TouchableOpacity>
                    <Text style={styles.profileText}>Update Profile</Text>
                </View>
            </LinearGradient>
            <View style={styles.imageContainer}>
                <View style={styles.imageWrapper}>
                    <TouchableOpacity style={styles.editIcon} onPress={() => {
                        setModalVisible(true);

                    }}>
                        <MaterialCommunityIcons
                            name={"image-edit-outline"}
                            size={20}
                            color="#000"
                        />
                    </TouchableOpacity>

                    {payload?.avatar ? (
                        <Image
                            source={
                                payload.avatar.includes("avatar_")
                                    ? images.find(img => img.key === payload.avatar)?.image
                                    : { uri: `${IMG_URL}${payload.avatar}` }
                            }
                            style={styles.profileStatisticsImage}
                        />
                    ) : (
                        <Image
                            source={require('../../assets/images/profileStatistics.png')}
                            style={styles.profileStatisticsImage}
                        />
                    )}
                </View>
            </View>

            {
                userData ? (
                    <View style={styles.container}>
                        <ScrollView
                            style={styles.subContainer}
                            contentContainerStyle={{ paddingBottom: hp('10%') }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.masterContainer}>
                                <RenderItem
                                    title={"Basic Student Information"}
                                    listHeadings={["Name", "Username", "Email", "Phone Number"]}
                                    listItems={[userData.name, userData.username, userData.email, userData.phone_number]}
                                    fieldKeys={["name", "username", "email", "phone_number"]}
                                />

                                <RenderItem
                                    title={"Academic Information"}
                                    listHeadings={["High School Name", "SAT Subject Test Preferences", "GPA", "Intended Major"]}
                                    listItems={[userData.high_school_name, userData.sat_subject_test_preferences, userData.gpa, userData.intended_major]}
                                    fieldKeys={["high_school_name", "sat_subject_test_preferences", "gpa", "intended_major"]}
                                />

                                <RenderItem
                                    title={"SAT Exam Details"}
                                    listHeadings={["SAT Registration Number", "Exam Center & Location", "Previous SAT Score", "Target SAT Score"]}
                                    listItems={[userData.sat_registration_number, userData.sat_exam_center, userData.previous_sat_score, userData.target_sat_score]}
                                    fieldKeys={["sat_registration_number", "sat_exam_center", "previous_sat_score", "target_sat_score"]}
                                />

                                <RenderItem
                                    title={"Target College Information"}
                                    listHeadings={["Target College Location", "Intended College Start Year", "Application Type"]}
                                    listItems={[userData.target_college_location, userData.intended_college_start_year, userData.application_type]}
                                    fieldKeys={["target_college_location", "intended_college_start_year", "application_type"]}
                                />

                                <RenderItem
                                    title={"Financial & Scholarship Information"}
                                    listHeadings={["Financial Aid Requirement", "Scholarships Interested In", "Family Annual Income"]}
                                    listItems={[userData.financial_aid_required, userData.scholarships_interested_in, userData.family_annual_income]}
                                    fieldKeys={["financial_aid_required", "scholarships_interested_in", "family_annual_income"]}
                                />

                                <RenderItem
                                    title={"Extracurricular & Other Details"}
                                    listHeadings={["Extra Curricular Activities", "Volunteer Experience", "Internships/Work Experience", "Awards & Achievements"]}
                                    listItems={[userData.extracurricular_activities, userData.volunteer_experience, userData.internships, userData.awards]}
                                    fieldKeys={["extracurricular_activities", "volunteer_experience", "internships", "awards"]}
                                />

                            </View>

                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                    <Text style={styles.saveText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                        <Footer />
                    </View>
                ) : (
                    <ActivityIndicator size="large" color="blue" />
                )
            }


            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>Choose Your Avatar</Text>
                        </View>
                        <FlatList
                            data={images}
                            numColumns={1}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => handleSelectImage(item.key)}
                                        style={styles.imageOption}
                                    >
                                        <Image
                                            source={item.image}
                                            style={styles.imageThumbnail}
                                        />
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={(item) => item.key}
                            showsVerticalScrollIndicator={false}
                        />
                        <TouchableOpacity style={styles.closeModal} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>



        </SafeAreaView>
    )
}

export default UpdateProfile

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    topGradient: {
        height: hp('10%'),
        width: wp('100%'),
        flexDirection: 'row',
        // justifyContent: 'center',
        paddingLeft: wp('4%'),
        paddingTop: hp('1%'),
        // alignItems: 'flex-start'
    },
    profileContainer: {
        // marginTop: hp("1%"),
        flexDirection: 'row',
        alignItems: 'center',
        // marginLeft: wp('5%'),
        justifyContent: 'space-between'
    },
    backArrow: {
        // marginLeft: wp('8%'),
        marginTop: hp('0.5%'),
    },
    profileText: {
        color: 'white',
        fontSize: hp('3.4%'),
        // margin: '2.3%',
        paddingLeft: wp('5%'),
        fontWeight: '600',
        // textDecorationLine: 'underline'

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: wp('80%'),
        maxHeight: hp('80%'),
    },
    imageOption: {
        margin: wp('1%'),
        alignItems: 'center',
        margin: hp('2%')
    },
    imageThumbnail: {
        height: hp('20%'),
        width: hp('20%'),
        borderRadius: 5,
    },
    closeModal: {
        marginTop: hp('2%'),
        alignItems: 'center',
        paddingVertical: hp('1%'),
        backgroundColor: '#26A5E6',
        borderRadius: 10,
    },
    closeText: {
        color: 'white',
        fontSize: hp('2%'),
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
        color: "#2562C1",
        fontWeight: "700"
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
        marginTop: hp("2%"),
        backgroundColor: "white"
    },
    masterContainer: {
        backgroundColor: 'white'
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
    cancelButton: {
        backgroundColor: 'white',
        paddingVertical: hp('0.8%'),
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        elevation: 5,
        paddingVertical: hp('1%'),
        paddingHorizontal: hp("6%")
    },
    saveButton: {
        backgroundColor: 'white',
        paddingVertical: hp('0.8%'),
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        elevation: 5,
        paddingVertical: hp('1%'),
        paddingHorizontal: hp("6%")

    },
    cancelText: {
        textAlign: 'center',
        color: '#737373',
        fontSize: hp('2.3%')
    },
    saveText: {
        textAlign: 'center',
        color: '#26A5E6',
        fontSize: hp('2.3%'),
    },
    editIconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    // editIcon: {
    //     marginRight: wp('0.5%'),
    // },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
        marginTop: hp('5%'),
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp("4%"),
        backgroundColor: 'white'
    },
    imageWrapper: {
        position: 'relative',
    },
    editIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        elevation: 3,
        zIndex: 10,
    },
    profileStatisticsImage: {
        height: hp('18%'),
        width: hp('18%'),
        borderRadius: 8,
    },
    avatarContainer: {
        alignSelf: 'center'

    },
    avatarText: {
        textAlign: 'center',
        color: '#0470B8',
        fontWeight: '700',
        marginBottom: hp('2%'),
        fontSize: hp('2.5%')
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
})
// update profile mai image select ki functionality set karna hai