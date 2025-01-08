import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native';
// import FastImage from 'react-native-fast-image';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS, FONTS } from '../theme';
import { useNavigation } from '@react-navigation/native';

const QuizComplete = ({ route }) => {
    const { totalEnglishScore, totalMathScore, totalScore } = route.params;
    console.log("YEH AHI SAARE TOTAL SCORES ENGLISH", totalEnglishScore) // null
    console.log("YEH AHI SAARE TOTAL SCORES MATH", totalMathScore) // null
    console.log("YEH AHI SAARE TOTAL SCORES ", totalScore) // null
    const navigation = useNavigation();
    const handleNavigation = () => {
        navigation.navigate("HomeScreen")
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.linearGradientColor1, COLORS.linearGradientColor2]}
                style={styles.gradientContainer}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}>

                <View style={styles.container}>
                    <View style={styles.threeStarsContainer}>
                        <Image
                            source={require('../../assets/images/threeStars.png')}
                        />
                    </View>

                    <View style={styles.completedContainer}>
                        <Text style={styles.completedText}>Completed</Text>
                    </View>

                    <View style={styles.girlImageContainer}>
                        <Image
                            source={require('../../assets/images/latest_quiz_complete.gif')}
                            style={styles.girlImage}
                        />
                    </View>

                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>Total Score: {totalScore}</Text>
                        <Text style={styles.scoreText}>Total English Score: {totalEnglishScore}</Text>
                        <Text style={styles.scoreText}>Total Maths Score: {totalMathScore}</Text>
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
        marginTop: hp('2.5%'),
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
    },
    girlImage: {
        resizeMode: 'contain',
        height: hp('30%'),
        width: hp('30%')
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

    },
    scoreText: {
        color: "white",
        textAlign: 'center'
    }
})