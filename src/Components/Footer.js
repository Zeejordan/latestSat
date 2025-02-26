import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
    const navigation = useNavigation();
    const [isClicked, setIsClicked] = useState('');

    const handleButtonPressed = (option, route) => {
        setIsClicked((prev) => (prev === option ? '' : option));
        if (route) {
            navigation.navigate(route);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.footerOption}
                    onPress={() => handleButtonPressed('home', 'HomeScreen')}
                >
                    <Ionicons
                        name="grid"
                        color={isClicked === 'home' ? '#0470B8' : 'grey'}
                        size={23}
                    />
                    <Text
                        style={isClicked === 'home' ? styles.clickedText : styles.unClickedText}
                    >
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.footerOption}
                    onPress={() => handleButtonPressed('level', 'Select-Subject')}
                >
                    <Feather
                        name="shield"
                        color={isClicked === 'level' ? '#0470B8' : 'grey'}
                        size={23}
                    />
                    <Text
                        style={isClicked === 'level' ? styles.clickedText : styles.unClickedText}
                    >
                        Level
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.footerOption}
                    onPress={() => handleButtonPressed('quiz', 'Quiz')}
                >
                    <MaterialIcons
                        name="castle"
                        color={isClicked === 'quiz' ? '#0470B8' : 'grey'}
                        size={23}
                    />
                    <Text
                        style={isClicked === 'quiz' ? styles.clickedText : styles.unClickedText}
                    >
                        Quiz
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.footerOption}
                    onPress={() => handleButtonPressed('profile', 'Statistics')}
                >
                    <MaterialCommunityIcons
                        name="account"
                        color={isClicked === 'profile' ? '#0470B8' : 'grey'}
                        size={23}
                    />
                    <Text
                        style={isClicked === 'profile' ? styles.clickedText : styles.unClickedText}
                    >
                        Profile
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Footer;

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'flex-end',
        paddingHorizontal: wp('2.5%'),
        paddingVertical: hp('1%'),
    },
    container: {
        flexDirection: 'row',
        height: hp('6%'),
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    footerOption: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    unClickedText: {
        color: 'grey',
    },
    clickedText: {
        color: '#0470B8',
    },
});
