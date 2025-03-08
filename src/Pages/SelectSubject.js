import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet, Text, View, SafeAreaView, TouchableOpacity,
    ActivityIndicator, Image, ScrollView
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Components/Footer';
import { COLORS } from '../theme';
import { LEVELS_STARTING } from '../../config/api';

const SelectSubject = () => {
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);

    const [subjectDropdownStatus, setSubjectDropdownStatus] = useState(false);
    const [categoryDropdownStatus, setCategoryDropdownStatus] = useState(false);
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [levels, setLevels] = useState([]);
    const [totalLevels, setTotalLevels] = useState('');
    const [loading, setLoading] = useState(false);

    const subjects = ['Math', 'Reading and Writing'];
    const categories = {
        Math: ['Advanced Math', 'Problem-Solving and Data Analysis', 'Algebra', 'Geometry and Trigonometry'],
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

        // Scroll up when category is selected
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 200, animated: true });
        }, 100);
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
            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.gradientContainer}>
                    <Text style={styles.headingText}>Choose a Subject to Get Started</Text>

                    <View style={styles.girlImageContainer}>
                        <Image
                            source={require("../../assets/images/subjectGirl.png")}
                            resizeMode='cover'
                            style={styles.image}
                        />
                    </View>

                    <View style={styles.selectSubject}>
                        <Text style={styles.selectSubjectText}>
                            Select Subject And Category
                        </Text>
                    </View>

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
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

export default SelectSubject;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: 'white'
    },
    gradientContainer: {
        padding: 20,
        backgroundColor: 'white',
    },
    headingText: {
        color: '#0470B8',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    girlImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        height: 200,
        width: 200,
    },
    selectSubject: {
        marginBottom: 10,
    },
    selectSubjectText: {
        textAlign: 'center',
        color: '#0470B8',
        fontWeight: '700',
        fontSize: 18,
    },
    dropdownContainer: {
        marginBottom: 15,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1.5,
        borderBottomWidth: 5,
        borderColor: '#0470B8',
        elevation: 5,
    },
    dropdownActive: {
        borderColor: COLORS.secondary,
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownOptions: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        borderColor: COLORS.primary,
        borderWidth: 1,
        marginTop: 5,
    },
    optionText: {
        fontSize: 16,
        color: COLORS.primary,
        paddingVertical: 10,
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#0470B8',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    startButtonDisabled: {
        backgroundColor: '#ccc',
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
