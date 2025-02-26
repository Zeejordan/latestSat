import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Components/Footer';
import { COLORS } from '../theme';
import { LEVELS_STARTING } from '../../config/api';
import AntDesign from "react-native-vector-icons/AntDesign";

const SelectSubject = () => {
    const navigation = useNavigation();
    const [subjectDropdownStatus, setSubjectDropdownStatus] = useState(false);
    const [categoryDropdownStatus, setCategoryDropdownStatus] = useState(false);
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [levels, setLevels] = useState([]);
    const [totalLevels, setTotalLevels] = useState('');
    const [loading, setLoading] = useState(false);

    const subjects = ['Math', 'Reading and Writing'];

    const categories = {
        Math: ['Advancement Math', 'Problem-Solving', 'Algebra', 'Geometry'],
        'Reading and Writing': ['Expression of Ideas', 'Craft and Structure', 'Information and Ideas', 'Standard English Conventions'],
    };


    const toggleSubjectDropdown = () => {
        setSubjectDropdownStatus(!subjectDropdownStatus);
        setCategoryDropdownStatus(false);
    };

    const toggleCategoryDropdown = () => {
        setCategoryDropdownStatus(!categoryDropdownStatus);
    };


    const selectSubject = (selectedSubject) => {
        setSubject(selectedSubject);
        setCategory('');
        setSubjectDropdownStatus(false);
        setCategoryDropdownStatus(false);
    };

    const selectCategory = (selectedCategory) => {
        setCategory(selectedCategory);
        setCategoryDropdownStatus(false);
    };

    useEffect(() => {
        if (levels.length > 0) {
            navigation.navigate('Levels', { levels, totalLevels });
        }
    }, [levels]);

    const startQuiz = async () => {
        if (!subject || !category) return;
        setLoading(true);
        console.log('YEH HAI LEVLES STARTING', LEVELS_STARTING);
        console.log('YEH HAI SUBJECT AND CATEGORY', { subject, section: category });

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
            if (!response?.data?.error) {
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
            <LinearGradient colors={[COLORS.linearGradientColor1, COLORS.linearGradientColor2]} style={styles.gradientContainer}>
                <Text style={styles.headingText}>Select a Subject to Begin</Text>

                <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                        style={[styles.dropdown, subjectDropdownStatus && styles.dropdownActive]}
                        onPress={toggleSubjectDropdown}
                    >
                        <Text style={styles.dropdownText}>{subject || 'Select Subject'}</Text>
                        <Feather name={subjectDropdownStatus ? 'chevron-up' : 'chevron-down'} size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    {subjectDropdownStatus && (
                        <View style={styles.dropdownOptions}>
                            {subjects.map((item) => (
                                <TouchableOpacity key={item} onPress={() => selectSubject(item)}>
                                    <Text style={styles.optionText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {subject && (
                    <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                            style={[styles.dropdown, categoryDropdownStatus && styles.dropdownActive]}
                            onPress={toggleCategoryDropdown}
                        >
                            <Text style={styles.dropdownText}>{category || 'Select Category'}</Text>
                            <Feather name={categoryDropdownStatus ? 'chevron-up' : 'chevron-down'} size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                        {categoryDropdownStatus && (
                            <View style={styles.dropdownOptions}>
                                {categories[subject].map((item) => (
                                    <TouchableOpacity key={item} onPress={() => selectCategory(item)}>
                                        <Text style={styles.optionText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.startButton, (!subject || !category) && styles.startButtonDisabled]}
                    onPress={startQuiz}
                    disabled={!subject || !category || loading}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.startButtonText}>Start Quiz</Text>}
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
    },
    gradientContainer: {
        flex: 1,
        padding: wp('5%'),
        justifyContent: 'center',
    },
    headingText: {
        color: '#fff',
        fontSize: hp('3.5%'),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: hp('4%'),
        textDecorationLine: 'underline'
    },
    dropdownContainer: {
        marginBottom: hp('2%'),
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: wp('4%'),
        borderWidth: 1.5,
        borderBottomWidth: 5,
        borderColor: 'black',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5
    },
    dropdownActive: {
        borderColor: COLORS.secondary,
    },
    dropdownText: {
        fontSize: hp('2.2%'),
        color: '#333',
    },
    dropdownOptions: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: wp('2%'),
        borderColor: COLORS.primary,
        borderWidth: 1,
        marginTop: hp('1%'),
    },
    optionText: {
        fontSize: hp('2%'),
        color: COLORS.primary,
        paddingVertical: hp('1.2%'),
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: 'white',
        padding: wp('4%'),
        borderRadius: 12,
        alignItems: 'center',
        marginTop: hp('5%'),
    },
    startButtonDisabled: {
        backgroundColor: '#ccc',
    },
    startButtonText: {
        color: COLORS.blueColor,
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
    },
});
