import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ENGLISH_MODULE, ENGLISH_SUBMIT_MODULE_FIRST, ENGLISH_SECOND_MODULE, ENGLISH_SUBMIT_MODULE_SECOND } from '../../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from 'react-native-vector-icons/Octicons';
import { COLORS, FONTS } from '../theme';
import { useNavigation } from '@react-navigation/native';
// import RenderHTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
const EnglishQuizModule1 = () => {


    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [flatlistData, setFlatlistData] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);
    const [questionsAttempted, setQuestionsAttempted] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [moduleName, setModuleName] = useState("");
    const [submitCount, setSubmitCount] = useState(1);

    const [timeLeft, setTimeLeft] = useState(32 * 60);
    const [stopTimer, setStopTimer] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setCurrentQuestion(1);
        setSelectedOption(null);
        setQuestionsAttempted(0);
        setAnswers({});
        setTotalQuestions(0);
        setTimeLeft(32 * 60);
        if (submitCount < 3) {
            setStopTimer(false);

        }
    }, [submitCount])

    useEffect(() => {
        if (stopTimer) {
            return;
        }
        if (timeLeft <= 0) {
            submitCheck("onTimeUp");
            return;
        }

        const timerInterval = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [timeLeft, stopTimer]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getData = async () => {
        const token = await AsyncStorage.getItem('token');
        const baseUrlGet = ENGLISH_MODULE;
        try {
            const response = await axios.get(baseUrlGet, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            if (!response?.data?.error) {
                setData(response?.data?.meta?.questions);

                const singleQuestion = response.data.meta.questions.filter((item) => item.Question_No === 1);
                setFlatlistData(singleQuestion);

                // const newSessionId = response.data.meta.session_id;
                setSessionId(response?.data?.meta?.session_id);

                console.log("Storing Session ID abhi kaam chal raha hai:", response?.data?.meta?.session_id);
                await AsyncStorage.setItem("sessionId", response?.data?.meta?.session_id);

                setTotalQuestions(response?.data?.meta?.Total_Questions);
                setModuleName(response?.data?.meta?.module_name)
            }
        } catch (error) {
            console.log("An Error Occured", error)
        }
    }

    const getNextData = async () => {
        console.log("ab tum getNext function k andar ho")
        const token = await AsyncStorage.getItem('token');
        const baseUrlPost = ENGLISH_SECOND_MODULE;

        const payload = {
            "session_id": sessionId
        };

        try {
            const response = await axios.post(baseUrlPost, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            if (!response?.data?.error) {
                console.log("yaha pe dekh questions ko second module k", response?.data?.meta?.questions);
                setData(response?.data?.meta?.questions);

                const singleQuestion = response?.data?.meta?.questions.filter((item) => item.Question_No === 1);
                console.log("yeh hai single question yaha pe dekh second module", singleQuestion)
                setFlatlistData(singleQuestion);
                console.log("yeh hai flatlist ka data yaha dekh second module", flatlistData);

                setTotalQuestions(response?.data?.meta?.Total_Questions);

                setModuleName(response?.data?.meta?.module_name);
                console.log('yeh hai module ka naam second module', response?.data?.meta?.module_name);
            }
        } catch (error) {
            console.log("An Error Occured", error)
        }
    }

    const submitCheck = (source) => {
        if (source === "onSubmitClick") {
            Alert.alert(
                "Alert",
                "Once the test is submitted then you cannot change the response!",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Submit", onPress: () => SubmitQuestions() }
                ]
            );
        } else {
            Alert.alert("Time Up", "Test Submitted Successfully!");
            SubmitQuestions();
        }
    };
    const SubmitQuestions = async () => {
        setStopTimer(true)
        console.log("yeh hai answers submit function k andar:", answers)
        setSubmitLoading(true);
        const token = await AsyncStorage.getItem('token');
        const baseUrlPost1 = ENGLISH_SUBMIT_MODULE_FIRST;
        const baseUrlPost2 = ENGLISH_SUBMIT_MODULE_SECOND;

        const payload = {
            session_id: sessionId,
            answers,
        }
        console.log("yeh hai submit ka payload : ", payload);
        try {
            const response = await axios.post(submitCount === 2 ? baseUrlPost2 : baseUrlPost1, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            console.log("yeh hai submit ka response:", response?.data?.meta)
            if (!response?.data?.error) {
                Alert.alert("Test Submitted Successfully");
            }
        } catch (error) {
            console.log("An Error Occured", error)
        }
        finally {
            setSubmitLoading(false);
            if (submitCount === 1) {
                getNextData();
            }
            setSubmitCount((prev) => prev + 1)
            submitCount === 2 ? (console.log("yeh hai second module ka submit check")) : (console.log("yeh hai first module ka submit check"))
            if (submitCount === 2) {
                navigation.navigate('Module-Gap')
            }
        }
    }

    const handlePrevious = () => {
        if (currentQuestion > 1) {
            const previousQuestionNo = currentQuestion - 1;

            const previousQuestion = data.filter((item) => item.Question_No === previousQuestionNo);
            setFlatlistData(previousQuestion);

            setCurrentQuestion(previousQuestionNo);
            console.log("yeh hai current question", currentQuestion);

            const previousQuestionId = previousQuestion[0].id;
            setSelectedOption(answers[previousQuestionId] || null);
        }
    };

    const handleNext = () => {
        if (currentQuestion < data.length) {
            const nextQuestionNo = currentQuestion + 1;

            const nextQuestion = data.filter((item) => item.Question_No === nextQuestionNo);
            setFlatlistData(nextQuestion);

            setCurrentQuestion(nextQuestionNo);
            console.log("yeh hai current question", currentQuestion);

            const nextQuestionId = nextQuestion[0].id;
            setSelectedOption(answers[nextQuestionId] || null);
        }
    };

    const handleOptionSelection = (option, questionId) => {
        if (selectedOption === option) {
            setSelectedOption(null);
            if (questionsAttempted > 0) {
                const newStatus = questionsAttempted - 1;
                setQuestionsAttempted(newStatus);
                if (answers[questionId]) {
                    setAnswers((prev) => {
                        const updated = { ...prev }
                        delete updated[questionId]
                        return updated;
                    })
                }
            }
        }
        else {
            setSelectedOption(option);
            if (!answers[questionId]) {
                const newStatus = questionsAttempted + 1;
                setQuestionsAttempted(newStatus);
            }

            setAnswers((prev) => ({
                ...prev, [questionId]: option
            }))
        }

        console.log("yaha dekh answers : ", answers)
    };

    const renderItem = ({ item }) => {
        return (
            <View>
                <View style={styles.questionHeading}>
                    <Text style={styles.questionText}>Question No - {item.Question_No}</Text>
                    <TouchableOpacity>
                        <Octicons name='info' color="black" style={styles.infoIcon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.questionDescription}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: `<html><body style='font-size: 14px; color: black;'>${item.Stem}</body></html>` }}
                        style={{ width: '90%', height: 100 }}
                        scrollEnabled={false}
                    />
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: `<html><body style='font-size: 14px; color: black;'>${item.Question}</body></html>` }}
                        style={{ width: '90%', height: 100 }}
                        scrollEnabled={false}
                    />
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.navigateButton} onPress={handlePrevious}>
                        <Text style={styles.navigateText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navigateButton} onPress={handleNext}>
                        <Text style={styles.navigateText}>Next</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.optionContainer}>
                    {['A', 'B', 'C', 'D'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={selectedOption === option ? styles.selectedOptionBox : styles.optionBox}
                            onPress={() => handleOptionSelection(option, item.id)}
                        >
                            <WebView
                                originWhitelist={['*']}
                                source={{ html: `<html><body style='font-size: 14px; color: black;'>${item[`Option${option}`]}</body></html>` }}
                                style={{ width: '80%', height: 50 }}
                                scrollEnabled={false}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {submitLoading ? (
                    <ActivityIndicator color={COLORS.blueColor} size={"large"} style={styles.submitButtonLoader} />
                ) : (
                    <TouchableOpacity style={styles.submitButton} onPress={() => submitCheck("onSubmitClick")}>
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Text style={styles.topText}>{moduleName}</Text>
                    <Text style={styles.topText}>Questions-{totalQuestions}</Text>
                    <Text style={styles.topText}>Time-{formatTime(timeLeft)}</Text>
                </View>

                <FlatList
                    keyExtractor={(item) => item.id}
                    data={flatlistData}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    )
}

export default EnglishQuizModule1

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: wp('3%'),
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('3%'),
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1%'),
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        elevation: 5,
    },
    flatListContent: {},
    questionHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "transparent",
        // paddingVertical: hp('1%'),
        paddingHorizontal: wp('3%'),
        marginTop: hp('2%'),
    },
    questionText: {
        fontSize: hp('2.5%'),
        fontWeight: '600'
    },
    infoIcon: {
        fontSize: hp('2.6%')
    },
    questionDescription: {
        borderWidth: 1,
        borderColor: '#888888',
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('6%'),
        marginTop: hp('2%'),
    },
    questionDescriptionText: {
        marginTop: hp('1%'),
        fontWeight: '500',
        fontSize: hp('1.8%')
    },
    questionParagraphText: {
        fontWeight: '500',
        fontSize: hp('1.8%')
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'transparent'
    },
    navigateButton: {
        backgroundColor: "#0470B8",
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('3%'),
        marginTop: hp('1.5%'),
        borderRadius: 10,
        width: hp("15%"),
        height: hp("5%"),
    },
    navigateText: {
        fontSize: hp('2.2%'),
        color: 'white',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        fontWeight: '700'
    },
    optionContainer: {
        marginTop: hp('3%'),
        flexDirection: 'column',
        gap: hp('2%'),
    },
    optionBox: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        borderColor: '#D9D9D9',
        backgroundColor: '#fff',
        elevation: 5
    },
    optionText: {
        fontWeight: '500',
        fontSize: hp('1.8%'),
        color: '#7C7C7C',
    },
    selectedOptionBox: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        borderColor: '#D9D9D9',
        backgroundColor: '#C5E6FD',
        elevation: 5
    },
    selectedOptionText: {
        fontWeight: '500',
        fontSize: hp('1.8%'),
        color: 'black',
    },
    submitText: {
        textAlign: "center",
        fontSize: hp('2.5%'),
        color: "#0470B8",
        fontWeight: '600'
    },
    submitButton: {
        backgroundColor: "#C5E6FD",
        marginVertical: hp('4%'),
        paddingVertical: hp('1.8%'),
        marginHorizontal: wp('20%'),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        elevation: 5

    },
    submitButtonLoader: {
        marginVertical: hp('4%'),
    },
    disabledSubmitButton: {
        backgroundColor: '#ccc',
    },
})

