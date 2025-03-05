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
        } catch (error) {
            console.log("An Error Occured", error)
        } finally {
            navigation.navigate('Statistics')
        }
    }

    const handleCancel = () => {
        navigation.navigate("Statistics")
    }

    const handleSelectImage = (imageKey) => {
        console.log("Selected image key:", imageKey);
        setPayload((prev) => ({
            ...prev,
            avatar: imageKey,
        }));
        setSelectedImage(imageKey);
        setModalVisible(false);
    };




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
                    <Text>                       </Text>
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
                            <View style={styles.section}>
                                <Text style={styles.fieldHeading}>Name</Text>
                                <TextInput
                                    style={styles.singleField}
                                    value={payload.name}
                                    editable={true}
                                    onChangeText={(text) =>
                                        setPayload((prev) => ({
                                            ...prev,
                                            name: text
                                        }))
                                    }
                                />
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.fieldHeading}>Username</Text>
                                <TextInput
                                    style={styles.singleField}
                                    value={payload.username}
                                    editable={true}
                                    onChangeText={(text) =>
                                        setPayload((prev) => ({
                                            ...prev,
                                            username: text
                                        }))
                                    }
                                />
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.fieldHeading}>Email</Text>
                                <TextInput
                                    style={styles.singleField}
                                    value={payload.email}
                                    editable={false}
                                />
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.fieldHeading}>Phone Number</Text>
                                <TextInput
                                    style={styles.singleField}
                                    value={payload.phone_number}
                                    editable={true}
                                    keyboardType="phone-pad"
                                    onChangeText={(text) =>
                                        setPayload((prev) => ({
                                            ...prev,
                                            phone_number: text
                                        }))
                                    }
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
        flex: 1
    },
    container: {
        flex: 1,
    },
    topGradient: {
        height: hp('10%'),
        width: wp('100%')
    },
    profileContainer: {
        marginTop: hp("1%"),
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: wp('5%'),
        justifyContent: 'space-between'
    },
    profileText: {
        color: 'white',
        fontSize: hp('3.4%'),
        margin: '2.3%',
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
        marginTop: hp("2%")
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
    }
})
// update profile mai image select ki functionality set karna hai