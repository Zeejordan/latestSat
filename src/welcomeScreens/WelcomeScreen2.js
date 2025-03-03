import { StyleSheet, Text, View, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen2 = () => {
    const navigation = useNavigation();
    const handleNavigation = () => {
        navigation.navigate('Welcome-Screen-3')
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>

                <View style={styles.imageContainer}>
                    <ImageBackground
                        source={require('../../assets/images/secondScreen.png')}
                        style={styles.image}
                        resizeMode="cover"
                    >
                        <View style={styles.secondView}>
                            <Text style={styles.aceText}>
                                Ace the <Text style={styles.satText}>SAT</Text> with {"\n"}confidence!
                            </Text>

                            <TouchableOpacity style={styles.buttonContainer} onPress={handleNavigation}>
                                <AntDesign name={"arrowright"} size={30} style={styles.arrow} />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default WelcomeScreen2;

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
        marginTop: hp("10%"),
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
