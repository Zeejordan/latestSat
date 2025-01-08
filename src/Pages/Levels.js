import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { LEVELS_STARTING, LEVELS_PROGRESSION } from '../../config/api';
import Footer from '../Components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// stop stop stop stop stops stop stop 
const Levels = ({ route }) => {

    const navigation = useNavigation();
    const { levels, totalLevels } = route.params;

    const [myData, setMyData] = useState([]);
    const [level, setLevel] = useState(levels);
    const [total, setTotal] = useState(totalLevels);
    const [questions, setQuestions] = useState([]);


    const data = Array.from({ length: total }, (_, index) => ({
        id: `${index + 1}`,
        label: `${index + 1}`,
    }));


    useEffect(() => {
        if (questions.length > 0) {
            navigation.navigate("TestQuestion", { questions })
        }
    }, [questions])
    const handleLevelNavigation = async (id) => {

        const token = await AsyncStorage.getItem('token');
        const baseUrlGet = LEVELS_PROGRESSION + id;

        try {
            const response = await axios.get(baseUrlGet, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            if (!response?.data?.error) {
                setQuestions(response?.data?.meta?.questions)
            }
        } catch (error) {
            console.error("An Error Occured", error)
        }

    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={!item.is_locked ? styles.levelContainer : styles.lockedLevelContainer} onPress={() => handleLevelNavigation(item.id)} disabled={item.is_locked}>
            <Text style={styles.coinText}>{item.level_number}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.linearGradientColor1, COLORS.linearGradientColor2]}
                style={styles.gradientContainer}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
                <View style={styles.container}>

                    <View style={styles.coinContainer}>
                        <FlatList
                            data={level}
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                            renderItem={renderItem}
                        // contentContainerStyle={styles.flatListContent}
                        />
                    </View>
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
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    semiTopContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    textAll: {
        fontSize: hp('2.5%'),
    },
    flatListContent: {
        paddingVertical: 20,
    },
    coinContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: hp('1%')
    },
    coinImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    coinText: {
        position: 'absolute',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center'
    },
    dropdownContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    subSecContainer: {

    },
    subSecText: {
        textAlign: 'center',
        color: 'white'
    },
    levelContainer: {
        marginVertical: hp('2%'),
        height: hp('10%'),
        width: hp('18%'),
        backgroundColor: '#FFD24B',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'transparent',
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow transparency
        shadowRadius: 3.84, // Shadow blur radius
    },
    lockedLevelContainer: {
        marginVertical: hp('2%'),
        height: hp('10%'),
        width: hp('18%'),
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'transparent',
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow transparency
        shadowRadius: 3.84, // Shadow blur radius
    }
});
