import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS, FONTS } from '../theme';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN } from '../../config/api';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useTranslation } from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from "../theme"

const LoginPage = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const baseUrlLogin = LOGIN;
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleGetOtp = async () => {
        if (!email) {
            setAlertMessage("Please Enter Your Email!");
            // setShowAlert(true);
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post(baseUrlLogin, { email });
            console.log("Response from server:", response.data.message);
            if (response.data.message) {
                setAlertMessage("OTP has been sent to your email.");
                // setShowAlert(true);
                navigation.navigate('OtpVerification', { email });
            }
        } catch (error) {
            console.error("An Error Occurred:", error);
            setAlertMessage("An error occurred. Please try again.");
            // setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingContainer}
                >
                    <LinearGradient
                        colors={[COLORS.linearGradientColor2, COLORS.linearGradientColor1]}
                        style={styles.gradientContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    >
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <AntDesign name={"arrowleft"} size={27} color={"white"} />
                            </TouchableOpacity>
                            <View style={styles.container}>
                                <View style={styles.loginGifContainer}>
                                    <Image
                                        source={require('../../assets/images/login.gif')}
                                        style={styles.loginGif}
                                    />
                                </View>

                                <View style={styles.secondBox}>
                                    <View style={styles.secondSemi}>
                                        <Text style={styles.loginText}>{t('welcome')}</Text>
                                        <TextInput
                                            placeholder='abc@gmail.com'
                                            style={styles.emailInput}
                                            keyboardType='email-address'
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            value={email}
                                            onChangeText={setEmail}
                                        />
                                    </View>
                                    <View style={styles.getOtpContainer}>
                                        {loading ? (
                                            <ActivityIndicator color="white" size={'large'} />
                                        ) : (
                                            <TouchableOpacity
                                                style={styles.getOtpButton}
                                                onPress={handleGetOtp}
                                            >
                                                <Text style={styles.getOtpText}>{t("SendOtp")}</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </LinearGradient>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
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
                onConfirmPressed={() => setShowAlert(false)}
            />
        </SafeAreaView>
    );
};

export default LoginPage;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    keyboardAvoidingContainer: {
        flex: 1
    },
    gradientContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        // marginTop: hp('6%'),

    },
    emailInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'white',
        paddingLeft: hp('2%')
    },
    loginText: {
        color: "white",
        fontSize: hp('4%'),
        alignSelf: 'center',
        fontWeight: '800',
        fontFamily: 'Poppins'
    },
    loginGifContainer: {
        alignSelf: 'center',
        // marginTop: hp('2%')
    },
    loginGif: {
        height: hp("40%"),
        width: hp("40%"),
        alignSelf: 'center'
    },
    secondBox: {
        marginHorizontal: wp('12%'),
        gap: hp('5%'),
    },
    secondSemi: {
        gap: hp('5%')
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
    },
    backButton: {
        marginLeft: wp('5%'),
        marginTop: hp('2.5%')
    }
});
