import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
// import FastImage from 'react-native-fast-image';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS, FONTS } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { REGISTER_PROFILE } from '../../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileDetails = ({ navigation }) => {

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');

    const [loading, setLoading] = useState(false);

    const registerProfileUrl = REGISTER_PROFILE;

    const handleRegister = async () => {
        if (!name.trim()) {
            Alert.alert("Invalid Name", "Please enter a valid name.");
            return;
        }

        if (!username.trim()) {
            Alert.alert("Invalid Username", "Please enter a valid username.");
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phone.trim() || !phoneRegex.test(phone)) {
            Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
            return;
        }

        setLoading(true);

        try {
            const userId = await AsyncStorage.getItem('userId');
            const token = await AsyncStorage.getItem('token');

            console.log("User ID:", userId);
            console.log("Token:", token);

            const payload = {
                "user_id": userId,
                "name": name.trim(),
                "username": username.trim(),
                "phone_number": phone.trim(),
            };

            const response = await axios.post(registerProfileUrl, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log(response.data.message);
            if (response.data.message === "Profile created successfully.") {
                navigation.navigate('HomeScreen');
            } else {
                Alert.alert("Error", response.data.message || "An error occurred.");
            }
        } catch (error) {
            console.log("An error occurred:", error);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleNavigation = () => {
        navigation.navigate("HomeScreen")
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.linearGradientColor1, COLORS.linearGradientColor2]}
                style={styles.gradientContainer}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
                <View style={styles.container}>
                    <View style={styles.profileImageContainer}>
                        <Image source={require('../../assets/images/profileImage.gif')} style={styles.profileImage} />
                    </View>

                    <View style={styles.profileContainer}>
                        <Text style={styles.profileText}>Profile Details</Text>
                    </View>

                    <View style={styles.semiContainer}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.inputfieldText}>Name</Text>
                            <TextInput
                                placeholder='Name'
                                style={styles.inputPlaceholder}
                                value={name}
                                onChangeText={(text) => {
                                    setName(text)
                                }}
                            />
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.inputfieldText}>Phone Number</Text>
                            <TextInput
                                placeholder='Phone Number'
                                style={styles.inputPlaceholder}
                                value={phone}
                                onChangeText={(text) => {
                                    setPhone(text)
                                }}
                            />
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.inputfieldText}>Username</Text>
                            <TextInput
                                placeholder='Username'
                                style={styles.inputPlaceholder}
                                value={username}
                                onChangeText={(text) => {
                                    setUsername(text)
                                }}
                            />
                        </View>
                    </View>


                    {loading ? (<ActivityIndicator color="white" size={'large'} style={styles.signInLoader} />) : (<TouchableOpacity style={styles.signInButton} onPress={handleRegister}>
                        <Text style={styles.signInText}>SIGN IN</Text>
                    </TouchableOpacity>)}

                    <TouchableOpacity style={styles.skipButton} onPress={handleNavigation}>
                        <Text style={styles.skipText}>skip this page</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default ProfileDetails

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        paddingHorizontal: wp('12%'),
        // paddingVertical:hp('')
    },
    gradientContainer: {
        flex: 1
    },
    profileImageContainer: {
        justifyContent: "center",
        alignItems: 'center',
        // backgroundColor: "orange",
        height: hp('34%'),
        widht: hp('34%'),
    },
    profileImage: {
        height: hp('32%'),
        width: hp('32%')
    },
    profileContainer: {},
    profileText: {
        color: "#D1EFFF",
        fontSize: hp('3%'),
        textAlign: 'center',
        fontWeight: '700'
    },
    inputPlaceholder: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        paddingLeft: wp('3.5%'),
        borderBottomColor: 'black',
        borderBottomWidth: 5
    },
    fieldContainer: {
        flexDirection: 'column',
        gap: hp('1%'),
    },
    inputfieldText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: hp('2%')
    },
    semiContainer: {
        flexDirection: 'column',
        marginTop: hp('5%'),
        gap: hp('2%')
    },
    signInButton: {
        backgroundColor: '#0470B8',
        paddingVertical: hp('1%'),
        borderWidth: 1,
        borderColor: '#0470B8',
        borderRadius: 5,
        marginTop: hp('6%')
    },
    signInText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: hp('1.8%')
    },
    signInLoader: {
        marginTop: hp('6%')
    },
    skipButton: {
        marginTop: hp('2%')
    },
    skipText: {
        textAlign: 'center',
        color: "white",
        fontWeight: '600',
        fontSize: hp('1.8%'),
        textDecorationLine: 'underline'
    }
})