import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Alert, ActivityIndicator, TextInput, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { memo, useState, useContext } from 'react'
import { useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MATHS_FIRST_MODULE, MATHS_FIRST_MODULE_SUBMIT, MATHS_SECOND_MODULE, MATHS_SECOND_MODULE_SUBMIT } from '../../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS, FONTS } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import CalculatorModal from '../Components/CalculatorModal';
import Tooltip from 'react-native-walkthrough-tooltip';
import { GlobalContext } from '../context/GlobalContext';

const MathsQuiz = () => {

     const { mode, setMode } = useContext(GlobalContext);

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

    const [timeLeft, setTimeLeft] = useState(35 * 60);
    const [stopTimer, setStopTimer] = useState(false);
    const [questionType, setQuestionType] = useState(null);
    const [sprInput, setSprInput] = useState('');

    const [totalEnglishScore, setTotalEnglishScore] = useState(null);
    const [totalMathScore, setTotalMathScore] = useState(null);
    const [totalScore, setTotalScore] = useState(null);
    const [showStatus, setShowStatus] = useState(false);
    const [statusData, setStatusData] = useState([]);

    const [showCalculator, setShowCalculator] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(true);


    useEffect(() => {
        const fetchSessionId = async () => {
            try {
                const storedSessionId = await AsyncStorage.getItem('sessionId');
                if (storedSessionId) {
                    setSessionId(storedSessionId);
                    console.log('Session ID fetched successfully:', storedSessionId);
                    console.log('Session ID fetched successfully or yeh hai session id useState in math module:', sessionId);
                }
                console.log("Session ID in the math module:", storedSessionId);
            } catch (error) {
                console.error("Error fetching session ID:", error);
            }
        };

        fetchSessionId();
    }, []);

    useEffect(() => {
        if (sessionId !== null) {
            console.log('Updated sessionId state async ki wajah waali dikkat dekh:', sessionId); // correct
            getData();
        }
    }, [sessionId]);

    useEffect(() => {
        setCurrentQuestion(1);
        setSelectedOption(null);
        setQuestionsAttempted(0);
        setAnswers({});
        setTotalQuestions(0);
        setTimeLeft(35 * 60);
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
        console.log("abhi hum getData function k andar hai")
        const token = await AsyncStorage.getItem('token');
        const baseUrlGet = `${MATHS_FIRST_MODULE}?mode=${mode}`;

        console.log("yeh hai token: ", token, "yeh hai sessionId", sessionId)

        const payload = {
            "session_id": sessionId
        }

        try {
            console.log("this is the PAYLOAD BEING SENT", payload)
            const response = await axios.post(baseUrlGet, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            if (!response?.data?.error) {
                setData(response?.data?.meta?.questions);
                console.log("yeh hai data", data)

                const singleQuestion = response?.data?.meta?.questions.filter((item) => item.Question_No === 1);
                setFlatlistData(singleQuestion);

                AsyncStorage.setItem("sessionId", sessionId)
                setTotalQuestions(response?.data?.meta?.Total_Questions);
                setModuleName(response?.data?.meta?.module_name);
            }
        } catch (error) {
            if (error.response) {
                console.log("Server responded with an error:", error.response.data);
                console.log("Status code:", error.response.status);
                console.log("Headers:", error.response.headers);
            } else if (error.request) {
                console.log("No response received. Request sent:", error.request);
            } else {
                console.log("Error setting up the request:", error.message);
            }
        }
    }

    const getNextData = async () => {
        console.log("ab tum getNext function k andar ho")
        const token = await AsyncStorage.getItem('token');
        const baseUrlPost = `${MATHS_SECOND_MODULE}?mode=${mode}`;

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
        console.log("yeh hai answers submit function k andar MATHS MODULE:", answers) // correct
        setSubmitLoading(true);
        const token = await AsyncStorage.getItem('token');
        const baseUrlPost1 = MATHS_FIRST_MODULE_SUBMIT;
        const baseUrlPost2 = MATHS_SECOND_MODULE_SUBMIT

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
                console.log('yeh hai maths first k submit ka response', response.data.meta)
                if (response?.data?.meta?.final_scores?.Total_English_score) {
                    const tempEng = response?.data?.meta?.final_scores?.Total_English_score;
                    setTotalEnglishScore((prev) => prev = tempEng);
                    console.log('yeh ahi english ka score jaane se pehle', totalEnglishScore)
                }

                if (response?.data?.meta?.final_scores?.Total_Math_score) {
                    const tempMath = response?.data?.meta?.final_scores?.Total_Math_score;
                    setTotalMathScore((prev) => prev = tempMath);
                    console.log('yeh ahi maths ka score jaane se pehle', totalMathScore)
                }

                if (response?.data?.meta?.final_scores?.Total_score) {
                    const tempScore = response?.data?.meta?.final_scores?.Total_score;
                    setTotalScore((prev) => prev = tempScore);
                    console.log('yeh ahi total ka score jaane se pehle', totalScore)
                }
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
                navigation.navigate('QuizComplete', { answers })
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

            const previousQuestionId = previousQuestion[0].externalid;
            setSelectedOption(answers[previousQuestionId] || null);
            setSprInput(answers[previousQuestionId] || "")
        }
    };

    const handleNext = () => {
        if (currentQuestion < data.length) {
            const nextQuestionNo = currentQuestion + 1;

            const nextQuestion = data.filter((item) => item.Question_No === nextQuestionNo);
            setFlatlistData(nextQuestion);

            setCurrentQuestion(nextQuestionNo);
            console.log("yeh hai current question", currentQuestion);

            const nextQuestionId = nextQuestion[0].externalid;
            setSelectedOption(answers[nextQuestionId] || null);
            setSprInput(answers[nextQuestionId] || "")
        }
    };

    const handleOptionSelection = (option, questionId) => {
        const question = data.find((item) => item.externalid === questionId);
        const questionNo = question?.Question_No;

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
                ...prev,
                [questionId]: {
                    answer: option,
                    index: questionNo,
                },
            }));
        }

        console.log("yaha dekh answers : ", answers)
    };

    const handleSprInput = (text, questionId) => {
        setSprInput(text);
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: text,
        }));
    };

    const toggleTooltip = () => {
        setTooltipVisible((prev) => !prev)
    }

    const [markedForReview, setMarkedForReview] = useState({});

    const handleMarkForReview = (questionId) => {
        setMarkedForReview((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
        }));
    };

    const handleGoBack = () => {
        setShowStatus(false);
    }

    const renderHorizontalScroll = () => {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContainer}
            >
                {Array.from({ length: totalQuestions }, (_, index) => index + 1).map((questionNo) => {
                    const question = data.find((item) => item.Question_No === questionNo);
                    const questionId = question?.externalid;
                    const isAttempted =
                        Object.keys(answers).includes(questionId?.toString() || "") &&
                        (question?.type === "SPR" ? answers[questionId]?.trim() : true);
                    const isMarked = markedForReview[questionId];

                    return (
                        <View key={questionNo} style={{ alignItems: 'center' }}>
                            <TouchableOpacity
                                style={[
                                    styles.questionCircle,
                                    currentQuestion === questionNo && styles.currentQuestionCircle,
                                    isAttempted && styles.attemptedQuestionCircle, // Light-blue for attempted
                                ]}
                                onPress={() => {
                                    const selectedQuestion = data.filter(
                                        (item) => item.Question_No === questionNo
                                    );
                                    setFlatlistData(selectedQuestion);
                                    setCurrentQuestion(questionNo);
                                    const selectedQuestionId = selectedQuestion[0]?.externalid;
                                    setSelectedOption(answers[selectedQuestionId] || null);
                                }}
                            >
                                {isMarked && (
                                    <View style={styles.bookmarkIconContainer}>
                                        <Entypo name="bookmarks" size={14} color="red" />
                                    </View>
                                )}
                                <Text
                                    style={
                                        currentQuestion === questionNo
                                            ? [styles.questionText, styles.currentQuestionText]
                                            : styles.questionText
                                    }
                                >
                                    {questionNo}
                                </Text>
                            </TouchableOpacity>
                            {currentQuestion === questionNo && (
                                <View style={styles.pin} />
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        );
    };

    const handleTooltipContentPress = (e) => {
        e.stopPropagation();
    };

const dynamicFontSize = hp("5%");

    const renderItem = ({ item }) => {
        const handleStatusPageDisplay = () => {
            const statusDataTemp = Array.from({ length: totalQuestions }, (_, index) => {
                const questionNo = index + 1;
                const questionId = data.find((item) => item.Question_No === questionNo)?.externalid;

                return {
                    questionNo,
                    isAttempted: Object.keys(answers).includes(questionId?.toString() || ""),
                    isMarked: markedForReview[questionId] || false,
                };
            });

            setStatusData(statusDataTemp);
            setShowStatus(true);
        };
        return (
            <View>
                {renderHorizontalScroll()}
                <View style={styles.questionHeading}>
                    <View style={styles.questionTextReview}>
                        <View style={styles.questionBox}>
                            <Text style={styles.questionTextMain}>{item.Question_No}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.markForReviewContainer}
                            onPress={() => handleMarkForReview(item.externalid)}
                        >
                            <Entypo
                                name={markedForReview[item.externalid] ? "bookmarks" : "bookmark"}
                                size={20}
                                color={markedForReview[item.externalid] ? "red" : "#ccc"}
                            />
                            <Text style={styles.markText}>
                                {markedForReview[item.externalid] ? "Unmark Review" : "Mark For Review"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.calculatorInfoContainer}>
                        <TouchableOpacity onPress={() => setShowCalculator(true)}>
                            <Entypo name='calculator' color="black" style={styles.infoIcon} />
                        </TouchableOpacity>

                        <Tooltip
                            isVisible={tooltipVisible}
                            content={
                                <TouchableWithoutFeedback onPress={() => { }}>
                                    <ScrollView style={styles.tooltipContent}>
                                        <Text style={styles.tooltipText}>
                                            {'\n'}
                                            {'You are allowed to use a calculator for all questions.'}
                                            {'\n'}
                                            {'The calculator and these instructions are accessible throughout the test.'}
                                            {'\n'}
                                            {'Unless otherwise specified:'}
                                            {'\n'}
                                            {'- All variables and expressions represent real numbers.'}
                                            {'\n'}
                                            {'- All figures provided are drawn to scale.'}
                                            {'\n'}
                                            {'- All figures lie in a plane.'}
                                            {'\n'}
                                            {'- The domain of a function is the set of all real numbers x for which f(x) is a real number.'}
                                            {'\n'}
                                            {'\n'}
                                            {'For Multiple-Choice Questions:'}
                                            {'\n'}
                                            {'Solve each problem and select the correct answer from the choices provided. Each question has only one correct answer.'}
                                            {'\n'}
                                            {'\n'}
                                            {'For Student-Produced Response (SPR) Questions:'}
                                            {'\n'}
                                            {'Solve each problem and enter your answer as follows:'}
                                            {'\n'}
                                            {'- If there are multiple correct answers, enter only one.'}
                                            {'\n'}
                                            {'- If your answer is a fraction that does not fit in the space provided, enter its decimal equivalent. For non-terminating decimals, round to three decimal places.'}
                                            {'\n'}
                                            {'- If your answer is a decimal that does not fit in the space provided, truncate or round it to the third digit.'}
                                            {'\n'}
                                            {'- If your answer is a mixed number (eg. 5 1/2), enter it as an improper fraction (eg. 11/2) or its decimal equivalent (eg. 5.5).'}
                                            {'\n'}
                                            {'\n'}
                                            {'Here’s the example presented as a table for clarity:'}
                                            {'\n'}
                                            {'\n'}
                                            {'| **Answer**   | **Acceptable Ways to Enter Answer**       |'}
                                            {'\n'}
                                            {'|--------------|-------------------------------------------|'}
                                            {'\n'}
                                            {'| 3.5          | 3.5, 7/2                                  |'}
                                            {'\n'}
                                            {'| 19/9         | 19/9, 2.111, 2.112                        |'}
                                            {'\n'}
                                            {'| -37/4        | -37/4, -9.25                              |'}
                                            {'\n'}
                                            {'| 10√(3)       | 10root(3), 17.320, 17.321                 |'}
                                        </Text>
                                    </ScrollView>
                                </TouchableWithoutFeedback>
                            }
                            placement="bottom"
                            onClose={() => setTooltipVisible(false)} // Close when tapping outside
                            showChildInTooltip={false}
                            backgroundStyle={styles.tooltipBackground}
                        >
                            <TouchableOpacity onPress={toggleTooltip}>
                                <Octicons name="info" color="black" style={styles.infoIcon} />
                            </TouchableOpacity>
                        </Tooltip>
                        <CalculatorModal showCalculator={showCalculator} setShowCalculator={setShowCalculator} />
                    </View>
                </View>

                <View style={styles.questionDescription}>
                    <View style={{ height: hp('30%'), overflow: 'hidden' }}>
                        <WebView
                                                originWhitelist={['*']}
                                                source={{ html: `<style>body { font-size: ${dynamicFontSize}; padding:40px;}</style>${item.stem}` }}
                                                style={[styles.webView, { flex: 1 }]}
                                                scalesPageToFit={true}
                                                javaScriptEnabled={true}
                                            />
                    </View>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.navigateButton} onPress={handlePrevious}>
                        <Text style={styles.navigateText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navigateButton} onPress={handleNext}>
                        <Text style={styles.navigateText}>Next</Text>
                    </TouchableOpacity>
                </View>

                {/* {item.type === 'MCQ' ? setQuestionType('MCQ') : setQuestionType('SPR')} */}

                {item.type === 'MCQ' ? (
                    <View style={styles.optionContainer}>
                        <View style={styles.optionSubRows}>
                            {['A', 'B', 'C', 'D'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={selectedOption === option ? styles.selectedOptionBox : styles.optionBox}
                                    onPress={() => handleOptionSelection(option, item.externalid)}
                                >
                                    <View style={{ height: hp('5%') }}>
                                        <WebView
                                                                        source={{ html: `<style>body { font-size: ${dynamicFontSize}; background-color: ${selectedOption === option ? '#C5E6FD' : 'transparent'};}</style>${item[`Option${option}`]}` }}
                                                                        style={styles.webViewOptions}
                                                                        originWhitelist={['*']}
                                                                        scalesPageToFit={true}
                                                                        javaScriptEnabled={true}
                                                                    />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View>
                        <TextInput
                            value={sprInput}
                            onChangeText={(text) => handleSprInput(text, item.externalid)}
                            style={styles.sprInputStyling}
                        />
                    </View>
                )}

                {submitLoading ? (
                    <ActivityIndicator color={COLORS.blueColor} size={"large"} style={styles.submitButtonLoader} />
                ) : (
                    <TouchableOpacity style={styles.submitButton} onPress={handleStatusPageDisplay}>
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.mainContainer}>

            {showStatus ? (
                <View style={styles.statusPageContainer}>
                    <View style={styles.questionsBox}>
                        <Text style={styles.statusPageHeader}>Summary</Text>

                        <View style={styles.statusSummary}>
                            {statusData.map((question) => (
                                <View
                                    key={question.questionNo}
                                    style={[
                                        styles.statusItem,
                                        { backgroundColor: question.isAttempted ? '#0470B8' : '#ccc' },
                                    ]}
                                >
                                    {question.isMarked && (
                                        <Entypo
                                            name="bookmarks"
                                            size={14}
                                            color="red"
                                            style={styles.bookmarkIcon}
                                        />
                                    )}
                                    <Text style={styles.statusText}>{question.questionNo}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.navigateButton}
                            onPress={handleGoBack}
                        >
                            <Text style={styles.navigateText}>Go Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navigateButton}
                            onPress={() => {
                                setShowStatus(false)
                                submitCheck("onSubmitClick");
                            }}
                        >
                            <Text style={styles.navigateText}>Finish</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (<View style={styles.container}>
                <View style={styles.topBar}>
                    <Text style={styles.topText}>{moduleName}</Text>
                    <Text style={styles.topText}>Questions-{totalQuestions}</Text>
                    <Text style={styles.topText}>Time-{formatTime(timeLeft)}</Text>
                </View>

                <FlatList
                    keyExtractor={(item) => item.externalid}
                    data={flatlistData}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={false}
                />

            </View>)}


        </SafeAreaView>
    )
}

export default memo(MathsQuiz)

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
        // paddingVertical: hp('2%'),
        // paddingHorizontal: wp('6%'),
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
        borderColor: 'transparent',
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
    sprContainer: {
        marginTop: hp('3%'),
    },
    optionContainer: {
        marginTop: hp('3%'),
        flexDirection: 'column',
        gap: hp('2%'),
    },
    webView: {
        height: hp('20%'),
        width: wp('90%'),
        marginVertical: 0,
        borderRadius: 8,
        backgroundColor: "#FFF",
    },
    webViewOptions: {
        height: hp('5%'),
        width: wp('90%'),
        marginVertical: 10,
        borderRadius: 8,
        backgroundColor: "#FFF",
    },
    optionBox: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        borderColor: '#D9D9D9',
        backgroundColor: '#fff',
        elevation: 5,
        width: '100%',
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
        elevation: 5,
        width: '100%'
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
    optionSubRows: {
        flexDirection: 'column',
        gap: hp('2%'),
        justifyContent: "center",
        alignItems: 'center'
    },
    sprInputStyling: {
        height: hp('8%'),
        width: '100%',
        borderWidth: 2,
        borderColor: '#0470B8',
        marginTop: hp("8%"),
        borderRadius: 10
    },
    statusPageContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    statusPageHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        textDecorationLine: 'underline',
        color: '#0470B8',
    },
    statusSummary: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    statusItem: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderWidth: 1,
        borderRadius: 25,
        borderColor: '#ccc',
        position: 'relative', // Necessary for absolute positioning of the bookmark icon
    },
    bookmarkIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff', // Text color set to white for better contrast
    },
    horizontalScrollContainer: {
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('2%'),
        backgroundColor: 'white',
        marginTop: hp('2%'),
        flexDirection: 'row',
        gap: 10
    },
    questionCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    currentQuestionCircle: {
        borderColor: '#3498db',
        borderWidth: 2,
    },
    pin: {
        width: 0,
        height: 0,
        borderLeftWidth: wp('2%'),
        borderRightWidth: wp('2%'),
        borderBottomWidth: wp('3%'),
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#3498db',
        alignSelf: 'center',
        marginTop: wp('1%'),
    },
    attemptedQuestionCircle: {
        backgroundColor: 'lightblue',
        borderColor: 'lightblue',
    },
    bookmarkIconContainer: {
        position: 'absolute',
        top: -5,
        right: -5,
    },
    questionTextReview: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    questionBox: {
        width: 40, // Adjust the size as needed
        height: 40,
        borderRadius: 20, // Half of width/height for perfect circle
        backgroundColor: '#0470B8', // Example background color
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionsBox: {
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderColor: '#ccc',
        borderRadius: 10,
    },
    questionTextMain: {
        fontSize: hp('2.5%'),
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
        // borderWidth: 1,
        borderColor: '#0470B8',
    },
    markForReviewContainer: {
        flexDirection: 'row',
        gap: 5
    },
    calculatorInfoContainer: {
        flexDirection: 'row',
        gap: wp('2%')
    },


    calculatorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    calculatorText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    displayContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    inputText: {
        fontSize: 20,
        color: '#000',
        textAlign: 'right',
    },
    resultText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'right',
    },
    buttonsGrid: {
        width: '90%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        flex: 1,
        margin: 5,
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tooltipText: {
        fontSize: 14,
        lineHeight: 22,
    },
    tooltipContent: {
        padding: 10,
        maxHeight: 300,  // To make sure the content doesn't overflow the screen
    },
    tooltipBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 5,
    },
    scrollViewContainer: {
        padding: 10,
    },
})

// till now everything is correct
// in this code there is a slight change in answers state, previously the answer state was like this { 
//     "session_id": "7ba91f7e-ed93-4421-82d2-f83596fe082f",
//     "answers": {
  
//     }
//   }   and now i want that the answer state should change to this {
//       "session_id": "7ba91f7e-ed93-4421-82d2-f83596fe082f",
//       "answers": {
//           "b0187476-48d4-42d1-ba1c-5db3ca3fc327" :  {
//         "answer": "A",
//         "index": 1
//       }
//       }
//   }  the index here is the "Question_No" which coming from the api and i want the index to be set the value of "Question_No"