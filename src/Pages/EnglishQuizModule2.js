import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ENGLISH_SECOND_MODULE } from '../../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from 'react-native-vector-icons/Octicons';
import { COLORS, FONTS } from '../theme';
import { useNavigation } from '@react-navigation/native';


// stop stop stop stop stop
const EnglishQuizModule2 = () => {

    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [flatlistData, setFlatlistData] = useState([]);

    const [currentQuestion, setCurrentQuestion] = useState(1);

    const [selectedOption, setSelectedOption] = useState(null);
    const [questionsAttempted, setQuestionsAttempted] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);

    const [answers, setAnswers] = useState({});

    const [submitLoading, setSubmitLoading] = useState(false);

    const [timeLeft, setTimeLeft] = useState(20);

    useEffect(() => {
        setCurrentQuestion(1);
        setSelectedOption(null);
        setQuestionsAttempted(0);
        setSessionId(null);
        setAnswers({});
        setTotalQuestions(0);
        getData();
    }, [])

    useEffect(() => {
        if (timeLeft <= 0) {
            submitCheck("onTimeUp");
            return;
        }

        const timerInterval = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [timeLeft]);

    useEffect(() => {
        loadSession();
    }, [])

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const loadSession = async () => {
        const newSession = await AsyncStorage.getItem('sessionId')
        setSessionId(newSession);
    }

    const getData = async () => {

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
                console.log("yaha pe dekh questions ko", response.data.meta.questions);
                setData(response?.data?.meta?.questions);

                const singleQuestion = response.data.meta.questions.filter((item) => item.Question_No === 1);
                console.log("yeh hai single question yaha pe dekh", singleQuestion)
                setFlatlistData(singleQuestion);
                console.log("yeh hai flatlist ka data yaha dekh", flatlistData);

                setTotalQuestions(response?.data.meta.Total_Questions);
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
        console.log("yeh hai answers submit function k andar:", answers)
        setSubmitLoading(true);
        const token = await AsyncStorage.getItem('token');
        const baseUrlPost = ENGLISH_SUBMIT_MODULE;

        const payload = {
            session_id: sessionId,
            answers,
        }
        console.log("yeh hai submit ka payload : ", payload);
        try {
            const response = await axios.post(baseUrlPost, payload, {
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
            navigation.navigate('EnglishQuizModule2')
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
                    <Text style={styles.questionParagraphText}>{item.Stem.replace(/<[^>]+>/g, '')}</Text>
                    <Text style={styles.questionDescriptionText}>{item.Question.replace(/<[^>]+>/g, '')}</Text>
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
                    <TouchableOpacity
                        style={selectedOption === 'A' ? styles.selectedOptionBox : styles.optionBox}
                        onPress={() => handleOptionSelection("A", item.id)}
                    >
                        <Text style={selectedOption === 'A' ? styles.selectedOptionText : styles.optionText}>
                            {item.OptionA.replace(/<[^>]+>/g, '')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={selectedOption === 'B' ? styles.selectedOptionBox : styles.optionBox}
                        onPress={() => handleOptionSelection("B", item.id)}
                    >
                        <Text style={selectedOption === 'B' ? styles.selectedOptionText : styles.optionText}>
                            {item.OptionB.replace(/<[^>]+>/g, '')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={selectedOption === 'C' ? styles.selectedOptionBox : styles.optionBox}
                        onPress={() => handleOptionSelection("C", item.id)}
                    >
                        <Text style={selectedOption === 'C' ? styles.selectedOptionText : styles.optionText}>
                            {item.OptionC.replace(/<[^>]+>/g, '')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={selectedOption === 'D' ? styles.selectedOptionBox : styles.optionBox}
                        onPress={() => handleOptionSelection("D", item.id)}
                    >
                        <Text style={selectedOption === 'D' ? styles.selectedOptionText : styles.optionText}>
                            {item.OptionD.replace(/<[^>]+>/g, '')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {submitLoading ? (<ActivityIndicator color={COLORS.blueColor} size={"large"} style={styles.submitButtonLoader} />) : (<TouchableOpacity style={styles.submitButton} onPress={() => submitCheck("onSubmitClick")}>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>)}

            </View>
        )
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Text style={styles.topText}>Unit-1 Test-1</Text>
                    <Text style={styles.topText}>Questions-20</Text>
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

export default EnglishQuizModule2

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

