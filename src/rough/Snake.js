import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    FlatList,
    BackHandler,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { LEVELS_PROGRESSION } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');

const Levels = ({ route }) => {
    const navigation = useNavigation();
    const { levels, totalLevels } = route.params;

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [navigation]);

    useEffect(() => {
        if (questions.length > 0) {
            navigation.navigate('TestQuestion', { questions });
        }
    }, [questions, navigation]);

    const handleLevelNavigation = async (id) => {
        const token = await AsyncStorage.getItem('token');
        const baseUrlGet = `${LEVELS_PROGRESSION}${id}`;

        try {
            const response = await axios.get(baseUrlGet, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response?.data?.meta?.questions) {
                setQuestions(response.data.meta.questions);
            }
        } catch (error) {
            console.error('An Error Occurred:', error);
        }
    };

    const renderItem = ({ item, index }) => {
        const groupIndex = Math.floor(index / 3);
        const isEvenGroup = groupIndex % 2 === 0;
        const positionInGroup = index % 3;
        const marginLeft = isEvenGroup
            ? width * 0.2 + positionInGroup * 50
            : width * 0.6 - positionInGroup * 50;

        return (
            <TouchableOpacity
                style={[styles.coin, { marginLeft }]}
                onPress={() => !item.is_locked && handleLevelNavigation(item.id)}
            >
                <Image
                    source={
                        item.is_locked
                            ? require('../../assets/images/silverCoin.jpeg')
                            : require('../../assets/images/coin.png')
                    }
                    style={styles.coinImage}
                />
                <Text style={styles.coinText}>1</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.linearGradientColor1, COLORS.linearGradientColor2]}
                style={styles.gradientContainer}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
                <View style={styles.container}>
                    <FlatList
                        data={levels}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.flatListContent}
                    />
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default Levels;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginHorizontal: wp('5%'),
        marginTop: hp('1%'),
    },
    flatListContent: {
        paddingVertical: 20,
    },
    coinImage: {
        width: 90,
        height: 90,
        borderRadius: 40,
    },
    coin: {
        width: 65,
        height: 65,
        borderRadius: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        alignSelf: 'flex-start',
        position: 'relative', // Ensures proper stacking of children
    },
    coinText: {
        position: 'absolute',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
});
