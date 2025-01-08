import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native';
// import FastImage from 'react-native-fast-image';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';
import { COLORS, FONTS } from '../theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

// stop stop stop stop stop 
const LevelComplete = ({ route }) => {
    const navigation = useNavigation();
    const { percentage, message } = route.params;
    // console.log("YEH HAI PERCENTAGE IN LEVEL COMPLETE", percentage)  
    const [score, setScore] = useState(null);

    // setScore((prev) => {
    //     prev = percentage.toFixed(2)
    // })
    const handleNavigation = () => {
        navigation.navigate('HomeScreen');
    }

    useEffect(() => {
        const trimmedScore = parseFloat(percentage.toFixed(2));
        setScore(trimmedScore);
    }, [percentage]);
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

                    <View style={styles.levelContainer}>
                        <Text style={styles.levelText}>Level 1</Text>
                    </View>

                    <View style={styles.completedContainer}>
                        <Text style={styles.completedText}>{message}</Text>
                    </View>

                    <View style={styles.pointsContainer}>
                        <Text style={styles.pointsText}>Your Points</Text>
                        <View style={styles.fiftyBackground}>
                            {/* <AntDesign name={"caretright"} size={50} color={"#26A5E6"} style={styles.arrowText} /> */}
                            <Text style={styles.fiftyText}>{score}</Text>
                            {/* <AntDesign name={"caretleft"} size={50} color={"#26A5E6"} style={styles.arrowText} /> */}

                        </View>
                    </View>

                    <View style={styles.girlImageContainer}>
                        <Image
                            source={require('../../assets/images/girl.png')}
                            style={styles.girlImage}
                        />
                    </View>

                    <View style={styles.bottomButtonsContainer}>
                        <TouchableOpacity style={styles.bottomButtonsNext} onPress={handleNavigation}><Text style={styles.nextText}>Next</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.bottomButtonsRetake}><Text style={styles.nextText}>Retake</Text></TouchableOpacity>
                    </View>

                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default LevelComplete

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
    levelContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedContainer: {
        marginTop: hp('2.5%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    completedText: {
        color: '#6ADA65',
        fontSize: hp('5%'),
        fontWeight: '700',
        textAlign: 'center'
    },

    pointsContainer: {
        justifyContent: 'center',
        marginTop: hp('2%'),
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
        marginTop: hp('2%')
    },
    girlImage: {
        resizeMode: 'contain',
        height: hp('25%'),
        width: hp('25%')
    },
    nextText: {
        color: '#26A5E6',
        fontSize: hp('3.2%'),
        fontWeight: '500'
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('4%'),
        paddingHorizontal: wp('4.5%'),
        // backgroundColor:'green'
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
    fiftyBackground: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: wp("25%"),
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    arrowText: {
        // backgroundColor: 'red',

    }
})

// retake ki api lagani hai , or 