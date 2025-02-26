import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect, memo, useRef } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const ModuleGap = () => {
    const navigation = useNavigation();
    const [secondsLeft, setSecondsLeft] = useState(10 * 60);
    const hasNavigated = useRef(false);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    if (!hasNavigated.current) {
                        hasNavigated.current = true;
                        navigation.navigate('Maths-Quiz');
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timerRef.current);
        };
    }, [navigation]);

    const formatTime = (timer) => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };

    const handleNavigateToMath = () => {
        if (!hasNavigated.current) {
            hasNavigated.current = true;
            clearInterval(timerRef.current); // Stop the timer when skipping
            navigation.navigate('Maths-Quiz');
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/images/sandTimer.gif')}
                        style={styles.sandTimerImage}
                    />
                </View>

                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
                </View>

                <TouchableOpacity style={styles.skipButton} onPress={handleNavigateToMath}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default memo(ModuleGap);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    sandTimerImage: {
        height: hp('25%'),
        width: hp('25%'),
    },
    timerText: {
        fontSize: hp('8%'),
        textAlign: 'center',
    },
    timerContainer: {
        marginTop: hp('10%'),
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: hp('10%'),
    },
    skipText: {
        color: 'white',
        textAlign: 'center',
        fontSize: hp('2.5%'),
        fontWeight: '600',
    },
    skipButton: {
        backgroundColor: '#0470B8',
        marginTop: hp('15%'),
        marginHorizontal: wp('20%'),
        paddingVertical: hp('2%'),
        borderRadius: 20,
    },
});
