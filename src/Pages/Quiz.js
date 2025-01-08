import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import Footer from '../Components/Footer';
import axios from 'axios';
import { QUIZ_LIST } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Quiz = ({ navigation }) => {

    useEffect(() => {
        quizList();
    }, [])
    const [quizData, setQuizData] = useState([]);
    const [totalTests, setTotalTests] = useState('');

    const quizList = async () => {
        const baseUrlGet = QUIZ_LIST;
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await axios.get(baseUrlGet, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            if (!response?.data?.error) {
                setTotalTests(response?.data?.meta?.total_tests)
                setQuizData(response?.data?.meta?.tests);
            }
        } catch (error) {
            console.error("An Error Occured", error)
        }
    }

    const [isModalVisible, setModalVisible] = useState(false);

    const handleTest = (status) => {
        if (status === 'Unlocked' || status === 'close') {
            setModalVisible(!isModalVisible);
        }
    };

    const handleNavigation = () => {
        navigation.navigate('English-Quiz-1');
    };
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.singleList} onPress={() => handleTest(item.Status)}>
                <View style={styles.firstBox}>
                    <Text style={styles.titleText}>SAT - {item.Test_Name}</Text>
                    <View style={styles.time}>
                        <MaterialCommunityIcons name="timer" color={"grey"} size={17} />
                        <Text style={styles.timeText}>{item.Time}</Text>
                    </View>

                    {item.Status === "Completed" && (
                        <View style={styles.statusContainerCompleted}>
                            <Text style={styles.statusText}>{item.Status}</Text>
                        </View>
                    )}
                    {item.Status === "Unlocked" && (
                        <View style={styles.statusContainerUnlocked}>
                            <Text style={styles.statusText}>{item.Status}</Text>
                        </View>
                    )}
                    {item.Status === "Locked" && (
                        <View style={styles.statusContainerLocked}>
                            <Text style={styles.statusText}>{item.Status}</Text>
                        </View>
                    )}

                </View>

                <View style={styles.hr} />
                <View>
                    <Text style={styles.detailsText}>Test Details - Maths, English(reading - writing)</Text>
                </View>
            </TouchableOpacity>
        )
    }
    return (

        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Text style={styles.quizText}>Quiz</Text>
                    <View style={styles.leftSubBar}>
                        {/* <TouchableOpacity>
                            <AntDesign name='filter' color="grey" style={styles.filterIcon} />
                        </TouchableOpacity> */}
                        <TouchableOpacity>
                            <Octicons name='info' color="black" style={styles.infoIcon} />
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={quizData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContent}
                />

                <Modal isVisible={isModalVisible}>
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContainer}>
                            <View style={styles.topBarModal}>
                                <Text style={styles.testText}>Test Instructions</Text>
                                <TouchableOpacity onPress={() => handleTest('close')}>
                                    <Text>❌</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.instructionsContainer}>
                                <Text style={styles.instructionsText}>
                                    <Text style={styles.sectionTitle}>English</Text>
                                    This section focuses on key reading and writing skills. Each question is based on one or more passages, which may include tables or graphs. Read the passages and questions thoroughly, then choose the best answer based on the information provided.

                                    All questions are multiple-choice with four options, and each has only one correct answer.

                                    {/* Add a gap between English and Maths */}
                                    <Text style={styles.sectionTitle}>Maths</Text>
                                    The questions in this section evaluate key math skills. You are allowed to use a calculator for all questions. The calculator and these instructions are accessible throughout the test.

                                    Unless otherwise specified:

                                    All variables and expressions represent real numbers.
                                    All figures provided are drawn to scale.
                                    All figures lie in a plane.
                                    The domain of a function is the set of all real numbers x for which f(x) is a real number.
                                    For Multiple-Choice Questions:
                                    Solve each problem and select the correct answer from the choices provided. Each question has only one correct answer.

                                    For Student-Produced Response (SPR) Questions:
                                    Solve each problem and enter your answer as follows:

                                    If there are multiple correct answers, enter only one.
                                    If your answer is a fraction that does not fit in the space provided, enter its decimal equivalent. For non-terminating decimals, round to three decimal places.
                                    If your answer is a decimal that does not fit in the space provided, truncate or round it to the third digit.
                                    If your answer is a mixed number (e.g., 5 1/2), enter it as an improper fraction (e.g., 11/2) or its decimal equivalent (e.g., 5.5).

                                    Example Table:
                                    Answer  Acceptable Ways to Enter Answer
                                    3.5     3.5, 7/2
                                    19/9    19/9, 2.111, 2.112
                                    -37/4   -37/4, -9.25
                                    10√(3)  10root(3), 17.320, 17.321
                                    This combined instruction ensures clarity and guidance for both sections.
                                </Text>


                                <TouchableOpacity onPress={handleNavigation} style={styles.quizStartButton}>
                                    <Text style={styles.quizStartButtonText}>Start Quiz</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

            </View>
            <Footer />
        </SafeAreaView>
    )
}

export default Quiz

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 15
    },
    topBar: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'transparent',
        justifyContent: 'space-between'
    },
    leftSubBar: {
        flexDirection: "row",
        gap: wp('2%'),
        justifyContent: "center",
        alignItems: 'center'
    },
    quizText: {
        color: '#46557B',
        fontSize: hp('3.4%'),
        fontWeight: '600'
    },
    filterIcon: {
        fontSize: hp('2.5%'),
    },
    infoIcon: {
        fontSize: hp('2.5%'),
    },
    secondContainer: {

    },
    flatListContent: {
        marginTop: hp('3%'),
        flexDirection: 'column',
        gap: 20
    },
    time: {
        // color: '#ED2024'
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusContainerLocked: {
        borderWidth: 1,
        borderColor: "#ED2024",
        borderRadius: 10,
        paddingHorizontal: wp('2%'),
        backgroundColor: '#FC9C99'
    },
    statusContainerCompleted: {
        borderWidth: 1,
        borderColor: "green",
        borderRadius: 10,
        paddingHorizontal: wp('2%'),
        backgroundColor: 'green'
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15,  // Adjust this value to control the gap between sections
    },
    statusContainerUnlocked: {
        borderWidth: 1,
        borderColor: "#D1BF00",
        borderRadius: 10,
        paddingHorizontal: wp('2%'),
        backgroundColor: '#D1BF00'
    },
    firstBox: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'transparent',
        justifyContent: 'space-between',
        marginBottom: hp('1%')
    },
    statusText: {
        color: 'white',
        fontWeight: '600',

    },
    timeText: {
        color: 'grey',
        fontSize: hp('1.6%')
    },
    singleList: {
        borderWidth: 2,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },  // Only vertical shadow
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
        borderColor: '#ECECEC'

    },
    secondBox: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: 'transparent',
        justifyContent: 'space-between',
    },
    hr: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 10,
        width: '100%',
    },
    titleText: {
        fontSize: hp('2%'),
        fontWeight: '600'
    },
    detailsText: {
        color: '#5D5D5D'
    },
    idText: {
        color: '#737373',
        fontSize: hp('1.6%')
    },
    sectionText: {
        color: '#737373',
        fontSize: hp('1.6%')
    },
    blankText: {
        paddingHorizontal: wp('2%'),
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FC9C99',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    topBarModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    instructionsContainer: {
        marginTop: 10,
    },
    instructionsText: {
        fontSize: 16,
        lineHeight: 24,
    },
    testText: {
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    // quizStartButton: {
    //     backgroundColor: '#26A5E6',
    //     marginHorizontal: wp('20%'),
    //     borderRadius: 10,
    //     marginTop: hp('4%'),
    //     paddingVertical: hp('1%')
    // },
    quizStartButton: {
        backgroundColor: '#26A5E6',
        marginHorizontal: wp('10%'),  // Reduced margin to fit button properly
        borderRadius: 10,
        marginVertical: hp('4%'),
        paddingVertical: hp('1.5%'),  // Adjusted padding for better appearance
    },
    quizStartButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: hp('2%'),
    },
    // instructionsText: {
    //     fontSize: hp('2%')
    // }
})
//5d5d5d