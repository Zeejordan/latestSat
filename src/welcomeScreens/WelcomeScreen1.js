import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
const WelcomeScreen1 = () => {
    const navigation = useNavigation();
    const handleNavigation = () => {
        navigation.navigate('Welcome-Screen-2')
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>

                <View style={styles.firstView}>
                    <View style={styles.circle}>
                        <Image
                            source={require('../../assets/images/Logomark.png')}
                            style={styles.fourImages}
                        />
                    </View>
                    <View>
                        <Text style={styles.welcomeText}>Welcome to <Text style={styles.SatifyText}>Satify</Text></Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}>Your Ultimate SAT prep starts here. Access real SAT papers, practise smarter, and boost your score with ease.</Text>
                    </View>
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/images/Group.png')}
                    />
                </View>


                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleNavigation}>
                        <Text style={styles.getStartedText}>Get Started</Text>
                        <AntDesign name={"arrowright"} size={25} style={styles.arrow} />
                    </TouchableOpacity>
                </View>


            </View>
        </SafeAreaView>
    )
}

export default WelcomeScreen1

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginHorizontal: wp('4.2%')
    },
    firstView: {
        marginTop: hp('9%'),
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        gap: hp("1.6%")
    },
    circle: {
        height: hp('8%'),
        width: hp('8%'),
        backgroundColor: "#EAE9E7",
        borderWidth: 1,
        borderColor: "#EAE9E7",
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: "center"
    },
    welcomeText: {
        color: '#5D5D5D',
        fontSize: hp("3.3%"),
        fontWeight: '700'
    },

    SatifyText: {
        color: '#0470B8'
    },
    descriptionContainer: {

    },
    description: {
        color: '#736B66',
        fontSize: hp('2.2%'),
        textAlign: 'center',
        lineHeight: 25
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: hp('2%'),
    },
    button: {
        backgroundColor: "#0470B8",
        width: wp('45%'),
        paddingVertical: hp("1.7%"),
        borderWidth: 1,
        borderColor: "#0470B8",
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: wp('3%')
    },
    buttonContainer: {
        alignSelf: 'center',
        marginTop: hp('5%')
    },
    getStartedText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: hp('2%'),
    },
    arrow: {
        alignSelf: 'center',
        marginTop: hp('0.3%'),
        color: 'white'
    }
})