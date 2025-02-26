import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native';
// import FastImage from 'react-native-fast-image';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS, FONTS } from '../theme';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MATHS_SECOND_MODULE_SUBMIT } from '../../config/api';

const QuizComplete = ({ route }) => {
    const { answers } = route.params;
    console.log("YEH Ahai ANSWERS IN QUIZ COMPLETE", answers) // null

    const [totalScore, setTotalScore] = useState(null)
    const [EnglishScore, setEnglishScore] = useState(null)
    const [MathScore, setMathScore] = useState(null)

    const navigation = useNavigation();
    const handleNavigation = () => {
        navigation.navigate("HomeScreen")
    }

    useEffect(() => {
        const SubmitQuestions = async () => {
            const token = await AsyncStorage.getItem('token');
            const baseUrlPost2 = MATHS_SECOND_MODULE_SUBMIT
            const sessionId = await AsyncStorage.getItem("sessionId");
            console.log('yeh hai session id in quiz complete', sessionId)

            const payload = {
                session_id: sessionId,
                answers,
            }
            console.log("yeh hai submit ka payload : ", payload);
            try {
                const response = await axios.post(baseUrlPost2, payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                if (!response?.data?.error) {
                    console.log("EVERTHING IS FINE ")
                    const ts = response.data.meta.final_scores.Total_score;
                    const es = response.data.meta.final_scores.Total_English_score;
                    const ms = response.data.meta.final_scores.Total_Math_score;

                    setTotalScore(ts);
                    setEnglishScore(es);
                    setMathScore(ms);
                }

            } catch (error) {
                console.log("An Error Occured", error)
            }
        }

        SubmitQuestions()
    }, [])
    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.linearGradientColor1, COLORS.linearGradientColor2]}
                style={styles.gradientContainer}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}>

                <View style={styles.container}>
                    {/* <View style={styles.threeStarsContainer}>
                        <Image
                            source={require('../../assets/images/threeStars.png')}
                        />
                    </View> */}

                    <View style={styles.completedContainer}>
                        <Text style={styles.completedText}>Completed</Text>
                    </View>

                    <View style={styles.girlImageContainer}>
                        <Image
                            source={require('../../assets/images/goldenTrophy.png')}
                            style={styles.girlImage}
                        />
                    </View>

                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>Total Score: {totalScore}</Text>
                        <Text style={styles.scoreText}>Total English Score: {EnglishScore}</Text>
                        <Text style={styles.scoreText}>Total Maths Score: {MathScore}</Text>
                    </View>

                    <View style={styles.bottomButtonsContainer}>
                        <TouchableOpacity style={styles.bottomButtonsNext} onPress={handleNavigation}><Text style={styles.nextText}>Finish</Text></TouchableOpacity>
                    </View>

                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default QuizComplete

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    gradientContainer: {
        flex: 1
    },
    container: {
        flex: 1
    },
    threeStarsContainer: {
        marginTop: hp('4.5%'),
        justifyContent: 'center',
        alignItems: "center"
    },
    levelText: {
        color: 'white',
        fontSize: hp('4%'),
        fontWeight: '700',
        textAlign: 'center',
    },

    completedContainer: {
        marginTop: hp('5%'),
        justifyContent: 'center',
        alignItems: 'center',

    },
    completedText: {
        color: '#6ADA65',
        fontSize: hp('5%'),
        fontWeight: '700',
        textAlign: 'center',
    },

    pointsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('2%')
    },
    pointsText: {
        color: 'white',
        fontWeight: '600',
        fontSize: hp('2.5%'),
        textAlign: 'center'
    },
    fiftyText: {
        color: 'black',
        fontWeight: '600',
        fontSize: hp('4%'),
        textAlign: 'center'
    },
    girlImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp('3%'),
    },
    girlImage: {
        resizeMode: 'contain',
        height: hp('40%'),
        width: hp('40%')
    },
    nextText: {
        color: '#26A5E6',
        fontSize: hp('3.2%'),
        fontWeight: '500'
    },
    bottomButtonsContainer: {
        alignItems: 'center',
        marginTop: hp('4%'),
        paddingHorizontal: wp('4.5%'),
    },
    bottomButtonsNext: {
        backgroundColor: 'white',
        paddingHorizontal: wp('12%'),
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        paddingVertical: hp('0.2%')
    },
    bottomButtonsRetake: {
        backgroundColor: 'white',
        paddingHorizontal: wp('10%'),
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        paddingVertical: hp('0.2%')
    },
    scoreContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('8%'),
        marginTop: hp('3%'),
        alignSelf: 'center',
        width: '80%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    scoreText: {
        color: "white",
        fontSize: hp('2.5%'),
        fontWeight: '600',
        textAlign: 'center',
        marginVertical: hp('0.5%'),
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },


})