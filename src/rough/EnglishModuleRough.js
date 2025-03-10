import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Alert, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ENGLISH_MODULE, ENGLISH_SUBMIT_MODULE_FIRST, ENGLISH_SECOND_MODULE, ENGLISH_SUBMIT_MODULE_SECOND } from '../../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS, FONTS } from '../theme';
import { useNavigation } from '@react-navigation/native';
// import RenderHTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';

// stop stop stop stop stop stop stop 
// stop stop stop stop stop HORIZONTAL SCROLL BAR QUESTION FUNCTIONALITY IS HERE
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

    const [statusData, setStatusData] = useState([]);
    const [showStatus, setShowStatus] = useState(false);

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

    const handleGoBack = () => {
        setShowStatus(false);
    }
    const [markedForReview, setMarkedForReview] = useState({});

    const handleMarkForReview = (questionId) => {
        setMarkedForReview((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
        }));
    };

    const renderHorizontalScroll = () => {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContainer}
            >
                {Array.from({ length: totalQuestions }, (_, index) => index + 1).map((questionNo) => {
                    const questionId = data.find((item) => item.Question_No === questionNo)?.id;
                    const isAttempted = Object.keys(answers).includes(questionId?.toString() || "");
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
                                    const selectedQuestionId = selectedQuestion[0]?.id;
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


    const renderItem = ({ item }) => {
        const handleStatusPageDisplay = () => {
            const statusDataTemp = Array.from({ length: totalQuestions }, (_, index) => {
                const questionNo = index + 1;
                const questionId = data.find((item) => item.Question_No === questionNo)?.id;

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
                            onPress={() => handleMarkForReview(item.id)}
                        >
                            <Entypo
                                name={markedForReview[item.id] ? "bookmarks" : "bookmark"}
                                size={20}
                                color={markedForReview[item.id] ? "red" : "#ccc"}
                            />
                            <Text style={styles.markText}>
                                {markedForReview[item.id] ? "Unmark Review" : "Mark For Review"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Octicons name="info" color="black" style={styles.infoIcon} />
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
                    keyExtractor={(item) => item.id}
                    data={flatlistData}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={false}
                />

            </View>)}


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
    questionBox: {
        width: 40, // Adjust the size as needed
        height: 40,
        borderRadius: 20, // Half of width/height for perfect circle
        backgroundColor: '#0470B8', // Example background color
        alignItems: 'center',
        justifyContent: 'center',
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    navigateButton: {
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#0470B8',
    },
    navigateText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    questionsBox: {
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderColor: '#ccc',
        borderRadius: 10,
    },
})

// iss code mai mai chahta hoon ki jab showStatus activate ho tab statusPage poore page pe display ho jo ki abhi nahi ho raha

// {
//     "message": "Request was successful",
//         "error": false,
//             "meta": {
//         "session_id": "810a6667-1242-48c2-b41d-a7cfa80e134b",
//             "created_at": "2025-01-05T06:19:56.616520Z",
//                 "modules_data": [
//                     {
//                         "module_name": "english_module_1",
//                         "answers": [
//                             {
//                                 "question_id": "e624b368-77c8-4783-bce9-f63ed6fcc104",
//                                 "Question": "<p>Which choice completes the text with the most logical transition?</p>",
//                                 "Stem": "<p>When one looks at the dark craggy vistas in Hitoshi Fugo&rsquo;s evocative photo series, one&rsquo;s mind might wander off to the cratered surfaces of faraway planets. <span aria-hidden=\"true\">______</span><span class=\"sr-only\">blank</span> it&rsquo;s the series&rsquo; title, <em>Flying Frying Pan</em>, that brings one back to Earth, reminding the viewer that each photo is actually a close-up view of a familiar household object: a frying pan.</p>",
//                                 "user_answer": "C",
//                                 "correct_answer": "C",
//                                 "is_correct": true,
//                                 "marks_awarded": 20.0,
//                                 "rationale": "<p>Choice C is the best answer. The first sentence describes an experience that the viewer has when they&rsquo;re looking at the photos: they imagine other planets. This sentence describes an experience that the viewer has afterward: the title reminds them that the photos are of frying pans, bringing them back to reality. &ldquo;Ultimately&rdquo; is a transition that means &ldquo;eventually&rdquo; or &ldquo;in the end,&rdquo; so it fits the context perfectly. </p><p>Choice A is incorrect. This choice uses a cause-and-effect transition, which doesn&rsquo;t make sense here. The viewer imagining other planets when they&rsquo;re looking at the photos doesn&rsquo;t cause the title to bring them back to reality. Choice B is incorrect. This choice uses a transition that indicates another option or possibility, which doesn&rsquo;t make sense here. Rather, the viewer has both experiences: first the viewer imagines that they&rsquo;re looking at another planet, and then the title reminds them that it&rsquo;s just a frying pan. Choice D is incorrect. This choice uses a transition that indicates the addition of an agreeing idea. But the viewer&rsquo;s experience in the second sentence is actually the opposite of the viewer&rsquo;s experience in the first sentence. In the first sentence, the viewer is imagining that they&rsquo;re seeing a landscape from another planet. In the second sentence, the viewer is reminded that they&rsquo;re looking at a frying pan. </p>",
//                                 "created_at": "2025-01-18T16:11:54.423063Z",
//                                 "module_name": "English Module 1",
//                                 "index": 2,
//                                 "type": null,
//                                 "OptionA": "<p>A. Consequently,</p>",
//                                 "OptionB": "<p>B. Alternatively,</p>",
//                                 "OptionC": "<p>C. Ultimately,</p>",
//                                 "OptionD": "<p>D. Additionally,</p>"
//                             },
//                             {
//                                 "question_id": "d3598b8b-ed73-426d-b855-2edd94b08abb",
//                                 "Question": "<p>Which choice completes the text so that it conforms to the conventions of Standard English?</p>",
//                                 "Stem": "<p>In 2000, Nora de Hoyos Comstock, herself an owner of a successful consulting firm, sought to increase Latina representation in corporate <span aria-hidden=\"true\">______</span><span class=\"sr-only\">blank</span> founded<em> </em>Las Comadres para las Americas, an international community that for over two decades has served as a resource and information network for Latina business professionals.</p>",
//                                 "user_answer": "B",
//                                 "correct_answer": "D",
//                                 "is_correct": false,
//                                 "marks_awarded": 0.0,
//                                 "rationale": "<p>Choice D is the best answer. It appropriately uses a period to mark the end of one independent clause (\"In 2000&hellip;settings\") and the start of another (\"She founded&hellip;professionals\").</p><p>Choice A is incorrect. This choice results in a run-on sentence error. Both the clause before the blank (\"In 2000&hellip;settings\") and the clause after the blank (\"she&hellip;professionals\") are independent clauses, so they need to be separated by punctuation. Choice B is incorrect. This choice results in a comma splice error. It incorrectly joins two independent clauses with just a comma. Linking two independent clauses with a comma also requires the use of a coordinating conjunction (like<em> for</em>, <em>and</em>, <em>nor</em>, <em>but</em>, <em>or</em>, <em>yet</em>, or <em>so</em>). Choice C is incorrect. This choice results in a run-on sentence, an error caused when two independent clauses are joined without punctuation or appropriate conjunctions. Since both the clause before the blank (\"In 2000&hellip;settings\") and the clause after the blank (\"she&hellip;professionals\") are independent, a comma would be required in addition to the coordinating conjunction \"and.\"</p>",
//                                 "created_at": "2025-01-18T16:11:54.408312Z",
//                                 "module_name": "English Module 1",
//                                 "index": 3,
//                                 "type": null,
//                                 "OptionA": "<p>A. settings she</p>",
//                                 "OptionB": "<p>B. settings, she</p>",
//                                 "OptionC": "<p>C. settings and she</p>",
//                                 "OptionD": "<p>D. settings. She</p>"
//                             },
//                         ]
//                     },
//                     {
//                         "module_name": "english_module_2",
//                         "answers": []
//                     },
//                     {
//                         "module_name": "math_module_1",
//                         "answers": []
//                     },
//                     {
//                         "module_name": "math_module_2",
//                         "answers": []
//                     }
//                 ]
//     }
// }