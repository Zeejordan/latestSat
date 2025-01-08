import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Components/Footer';
import { COLORS, FONTS } from '../theme';
import { LEVELS_STARTING } from '../../config/api';

const SelectSubject = () => {
    const navigation = useNavigation();
    const [mathsDropdownStatus, setMathsDropdownStatus] = useState(false);
    const [englishDropdownStatus, setEnglishDropdownStatus] = useState(false);
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [levels, setLevels] = useState([]);
    const [totalLevels, setTotalLevels] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleDropdown = (type) => {
        if (type === 'maths') {
            setMathsDropdownStatus(!mathsDropdownStatus);
            setEnglishDropdownStatus(false);
        } else {
            setEnglishDropdownStatus(!englishDropdownStatus);
            setMathsDropdownStatus(false);
        }
    };

    const selectCategory = (subjectType, categoryType) => {
        setSubject(subjectType);
        setCategory(categoryType);
        setMathsDropdownStatus(false);
        setEnglishDropdownStatus(false);
    };

    useEffect(() => {
        if (levels.length > 0) {
            navigation.navigate('Levels', { levels, totalLevels });
        }
    }, [levels]);

    const startQuiz = async () => {
        if (!subject || !category) return;
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(
                LEVELS_STARTING,
                { subject, section: category },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response?.data?.meta) {
                setLevels(response.data.meta.levels);
                setTotalLevels(response.data.meta.total_levels);
            }
        } catch (error) {
            console.error('Error starting quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.linearGradientColor1, COLORS.linearGradientColor2]}
                style={styles.gradientContainer}
            >
                <Text style={styles.headingText}>Select a Subject to Begin</Text>

                <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                        style={[styles.dropdown, mathsDropdownStatus && styles.dropdownActive]}
                        onPress={() => toggleDropdown('maths')}
                    >
                        <Text style={styles.dropdownText}>{subject === 'Math' ? category : 'Math'}</Text>
                        <Feather name={mathsDropdownStatus ? 'chevron-up' : 'chevron-down'} size={24} color="#26A5E6" />
                    </TouchableOpacity>

                    {mathsDropdownStatus && (
                        <View style={styles.dropdownOptions}>
                            {['Advancement Math', 'Problem-Solving and Data Analysis', 'Algebra', 'Geometry and Trigonometry'].map(
                                (item) => (
                                    <TouchableOpacity key={item} onPress={() => selectCategory('Math', item)}>
                                        <Text style={styles.optionText}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            )}
                        </View>
                    )}
                </View>

                <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                        style={[styles.dropdown, englishDropdownStatus && styles.dropdownActive]}
                        onPress={() => toggleDropdown('english')}
                    >
                        <Text style={styles.dropdownText}>{subject === 'Reading and Writing' ? category : 'Reading and Writing'}</Text>
                        <Feather name={englishDropdownStatus ? 'chevron-up' : 'chevron-down'} size={24} color="#26A5E6" />
                    </TouchableOpacity>

                    {englishDropdownStatus && (
                        <View style={styles.dropdownOptions}>
                            {['Expression of Ideas', 'Craft and Structure', 'Information and Ideas', 'Standard English Conventions'].map(
                                (item) => (
                                    <TouchableOpacity key={item} onPress={() => selectCategory('Reading and Writing', item)}>
                                        <Text style={styles.optionText}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            )}
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.startButton, (!subject || !category) && styles.startButtonDisabled]}
                    onPress={startQuiz}
                    disabled={!subject || !category || loading}
                >
                    {loading ? <ActivityIndicator color="#26A5E6" /> : <Text style={styles.startButtonText}>Start Quiz</Text>}
                </TouchableOpacity>
            </LinearGradient>
            <Footer />
        </SafeAreaView>
    );
};

export default SelectSubject;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    gradientContainer: {
        flex: 1,
        padding: wp('5%'),
    },
    headingText: {
        color: 'white',
        fontSize: hp('3%'),
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: hp('4%'),
    },
    dropdownContainer: {
        marginBottom: hp('2%'),
    },
    dropdown: {
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: wp('4%'),
        borderColor: '#26A5E6',
        borderWidth: 1,
    },
    dropdownActive: {
        borderColor: '#1E90FF',
    },
    dropdownText: {
        fontSize: hp('2.2%'),
        color: '#333',
    },
    dropdownOptions: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: hp('1%'),
        padding: wp('2%'),
        borderColor: '#26A5E6',
        borderWidth: 1,
    },
    optionText: {
        fontSize: hp('2%'),
        color: '#26A5E6',
        paddingVertical: hp('1%'),
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#26A5E6',
        padding: wp('4%'),
        borderRadius: 10,
        alignItems: 'center',
        marginTop: hp('5%'),
    },
    startButtonDisabled: {
        backgroundColor: '#B0E0E6',
    },
    startButtonText: {
        color: 'white',
        fontSize: hp('2.5%'),
        fontWeight: '700',
    },
});
