import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS, FONTS } from '../theme';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN } from '../../config/api';
// import FastImage from 'react-native-fast-image';
import AwesomeAlert from 'react-native-awesome-alerts';

const LoginPage = () => {

    const navigation = useNavigation();

    const baseUrlLogin = LOGIN;
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleGetOtp = async () => {
        if (!email) {
            setAlertMessage("Please Enter Your Email!");
            setShowAlert(true);
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post(baseUrlLogin, { email });
            console.log("Response from server:", response.data.message);
            if (response.data.message) {
                setAlertMessage("OTP has been sent to your email.");
                setShowAlert(true);
                navigation.navigate('OtpVerification', { email });
            }
        } catch (error) {
            console.error("An Error Occurred:", error);
            setAlertMessage("An error occurred. Please try again.");
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.linearGradientColor1, COLORS.linearGradientColor2]}
                style={styles.gradientContainer}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
                <View style={styles.container}>
                    <View style={styles.loginGifContainer}>
                        <Image
                            source={require('../../assets/images/login.gif')}
                            style={styles.loginGif}
                        />
                    </View>

                    <View style={styles.secondBox}>
                        <View style={styles.secondSemi}>
                            <View>
                                <Text style={styles.loginText}>Log in</Text>
                            </View>
                            <View style={styles.orContainer}>
                                <TextInput
                                    placeholder='abc@gmail.com'
                                    style={styles.emailInput}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    value={email}
                                    onChangeText={(text) => {
                                        console.log("input text: ", text);
                                        setEmail(text);
                                    }}
                                />
                            </View>
                        </View>
                        <View style={styles.getOtpContainer}>
                            {loading ? (
                                <ActivityIndicator color="white" size={'large'} />
                            ) : (
                                <TouchableOpacity
                                    style={styles.getOtpButton}
                                    onPress={() => {
                                        console.log('get otp button pressed');
                                        handleGetOtp();
                                    }}
                                >
                                    <Text style={styles.getOtpText}>Send OTP</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </LinearGradient>
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Notice"
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#0470B8"
                contentContainerStyle={{ backgroundColor: '#FFFFFF' }}
                titleStyle={{ fontWeight: 'bold' }}
                messageStyle={{ fontWeight: 'bold' }}
                onConfirmPressed={() => {
                    setShowAlert(false);
                }}
            />
        </SafeAreaView>
    );
};

export default LoginPage;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    gradientContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        paddingVertical: hp(''),
    },
    emailContainer: {
        paddingHorizontal: hp('1%')
    },
    emailInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'white',
        paddingLeft: hp('2%')
    },
    loginText: {
        color: "#D1EFFF",
        fontSize: hp('4%'),
        alignSelf: 'center',
        fontWeight: '800'
    },
    loginPage: {
        gap: hp('4%'),
        marginTop: hp('30%'),
        marginHorizontal: wp('2%')
    },
    bottomButtonsNext: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        paddingVertical: hp('1.3%')
    },
    nextText: {
        color: COLORS.blueColor,
        fontSize: hp('2%'),
        fontWeight: '500',
        textAlign: 'center'
    },
    getButtonContainer: {
        marginHorizontal: wp('25%')
    },
    loginGifContainer: {
        alignSelf: 'center',
        marginTop: hp('2%')

    },
    loginGif: {
        height: hp("32%"),
        width: hp("40%"),
        alignSelf: 'center'
    },
    secondBox: {
        marginHorizontal: wp('12%'),
        gap: hp('20%')
    },
    secondSemi: {
        gap: hp('5%')
    },
    orText: {
        color: 'white',
        textAlign: 'center'
    },
    orContainer: {
        gap: hp('2%')
    },
    getOtpText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: '700'
    },
    getOtpButton: {
        backgroundColor: "#0470B8",
        borderWidth: 1,
        borderColor: '#0470B8',
        borderRadius: 10,
        paddingVertical: hp('1.2%'),
    }
});
