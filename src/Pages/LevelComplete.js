import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS, FONTS } from '../theme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const LevelComplete = ({ route }) => {
    const navigation = useNavigation();
    const { percentage, message, questions } = route.params;
    const [score, setScore] = useState(null);

    const handleNavigation = () => {
        navigation.navigate('HomeScreen');
    };

    const handleRetake = () => {
        navigation.navigate('TestQuestion', { questions });
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                // Prevent back navigation
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            // Clean up the event listener when the screen loses focus
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [])
    );

    useEffect(() => {
        const trimmedScore = parseFloat(percentage.toFixed(2));
        setScore(trimmedScore);
    }, [percentage]);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.linearGradientColor1, COLORS.linearGradientColor2]}
                style={styles.gradientContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}>

                <View style={styles.container}>
                    <View style={styles.levelContainer}>
                        <Text style={styles.levelText}>Completed</Text>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/goldenTrophy.png')}
                            style={styles.image}
                        />
                    </View>

                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>{message}</Text>
                    </View>

                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreLabel}>Your Points</Text>
                        <View style={styles.scoreBox}>
                            <Text style={styles.scoreText}>{score}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleNavigation}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleRetake}>
                            <Text style={styles.buttonText}>Retake</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default LevelComplete;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
    },
    levelContainer: {
        marginBottom: hp('3%'),
    },
    levelText: {
        color: '#6ADA65',
        fontSize: hp('4.5%'),
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp('3%'),
    },
    image: {
        resizeMode: 'contain',
        height: hp('40%'),
        width: hp('40%'),
    },
    messageContainer: {
        marginVertical: hp('2%'),
    },
    messageText: {
        color: '#0470B8',
        fontSize: hp('3.5%'),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    scoreContainer: {
        marginVertical: hp('2%'),
        alignItems: 'center',
    },
    scoreLabel: {
        color: '#0470B8',
        fontSize: hp('2.5%'),
        fontWeight: '700',
    },
    scoreBox: {
        backgroundColor: '#26A5E6',
        marginTop: hp('1%'),
        paddingHorizontal: wp('8%'),
        paddingVertical: hp('2%'),
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    scoreText: {
        color: 'white',
        fontSize: hp('5%'),
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: hp('4%'),
    },
    button: {
        backgroundColor: 'white',
        paddingHorizontal: wp('10%'),
        paddingVertical: hp('1%'),
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#26A5E6',
        fontSize: hp('3%'),
        fontWeight: '500',
    },
});


