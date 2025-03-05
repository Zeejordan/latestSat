import { StyleSheet, Text, View, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen4 = () => {
    const navigation = useNavigation();
    const handleNavigation = () => {
        navigation.navigate('Select-Language')
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>

                <View style={styles.imageContainer}>
                    <ImageBackground
                        source={require('../../assets/images/girlScreen2.png')}
                        style={styles.image}
                        resizeMode="cover"
                    >
                        <View style={styles.secondView}>
                            <View style={styles.thirdView}>
                                <Text style={styles.aceText}>
                                    Your <Text style={styles.satText}>SAT</Text> success story{"\n"} starts <Text style={styles.satText}>here!.</Text>
                                </Text>

                                <TouchableOpacity style={styles.buttonContainer} onPress={handleNavigation}>
                                    <AntDesign name={"arrowright"} size={30} style={styles.arrow} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default WelcomeScreen4;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        resizeMode: 'cover',
        height: hp("45%"),
        width: hp("49%"),
        marginTop: hp("7%"),
    },
    secondView: {
        backgroundColor: 'white',
        marginTop: hp("35%"),
        height: hp('80%'),
        width: wp('100%'),
        borderTopLeftRadius: 130,
        borderTopRightRadius: 130,
        alignItems: 'center',
        paddingTop: hp('8%'),
    },
    thirdView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('5%')
    },
    aceText: {
        textAlign: 'center',
        fontSize: hp('3.5%'),
        color: '#4F3422',
        fontWeight: '600',
        lineHeight: 35,
    },
    satText: {
        color: '#0470B8',
        fontWeight: '700',
    },
    arrow: {
        color: 'white',
    },
    buttonContainer: {
        marginTop: hp('5%'),
        backgroundColor: '#0470B8',
        width: hp("10%"),
        height: hp("10%"),
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
