import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    TouchableOpacity,
    BackHandler
} from "react-native";
import axios from "axios";
import { QUIZ_ANSWERS } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

// stop stop stop stop stop stops stop stop stop stop stop 

const QuizAnalysisPage = ({ route }) => {

    const navigation = useNavigation();

    const { userSession } = route.params;
    const [modules, setModules] = useState([]);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [moduleName, setModuleName] = useState("english_module_1")

    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [navigation]);

    useEffect(() => {
        fetchQuizAnswers();
    }, [userSession]);

    const fetchQuizAnswers = async () => {
        setLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem("token");
        const url = `${QUIZ_ANSWERS}${userSession}?module_name=${moduleName}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response?.data?.error) {
                const modulesData = response?.data?.meta?.modules_data || [];
                if (modulesData.length > 0) {
                    setModules(modulesData);
                } else {
                    setError("No modules available.");
                }
            }
        } catch (err) {
            setError("Failed to fetch data. Please try again later.");
            console.log("An Error Occured in get all answers", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchQuizAnswers();
    }, [moduleName])

    const handleQuestionSelect = async (index) => {
        setLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem("token");
        const url = `${QUIZ_ANSWERS}${userSession}?module_name=${moduleName}&index=${index}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response?.data?.error) {
                const modulesData = response?.data?.meta?.modules_data || [];
                if (modulesData.length > 0) {
                    setModules(modulesData);
                } else {
                    setError("No modules available.");
                }
            }
        } catch (err) {
            setError("Failed to fetch data. Please try again later.");
            console.log("An Error Occured in get all answers", err);
        } finally {
            setLoading(false);
        }
    };


    const handleNextModule = async () => {
        let nextModuleName = "";

        if (moduleName === "english_module_1") {
            nextModuleName = "english_module_2";
        } else if (moduleName === "english_module_2") {
            nextModuleName = "math_module_1";
        } else if (moduleName === "math_module_1") {
            nextModuleName = "math_module_2";
        } else {
            return; // Prevent updating if there's no further module
        }

        setModuleName(nextModuleName);

        // Fetch new module data and check if it exists
        await fetchQuizAnswers();
        if (modules.length === 0) {
            setError("No modules available.");
        }
    };


    const handlePreviousModule = async () => {
        let prevModuleName = "";

        if (moduleName === "math_module_2") {
            prevModuleName = "math_module_1";
        } else if (moduleName === "math_module_1") {
            prevModuleName = "english_module_2";
        } else if (moduleName === "english_module_2") {
            prevModuleName = "english_module_1";
        } else {
            return; // Prevent updating if there's no previous module
        }

        setModuleName(prevModuleName);

        // Fetch previous module data and check if it exists
        await fetchQuizAnswers();
        if (modules.length === 0) {
            setError("No modules available.");
        }
    };


    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="##0470B8" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!modules || modules.length === 0) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>No modules available.</Text>
            </View>
        );
    }

    const currentModule = modules[currentModuleIndex] || null;
    const currentQuestion = currentModule ? currentModule.answers[currentQuestionIndex] : null;

    const handleNext = () => {
        let newIndex = currentQuestionIndex + 1;

        while (
            newIndex < currentModule.answers.length &&
            currentModule.answers[newIndex]?.not_attempted
        ) {
            newIndex++;
        }

        if (newIndex < currentModule.answers.length) {
            setCurrentQuestionIndex(newIndex);
        }
    };

    const handlePrevious = () => {
        let newIndex = currentQuestionIndex - 1;

        while (
            newIndex >= 0 &&
            currentModule.answers[newIndex]?.not_attempted
        ) {
            newIndex--;
        }

        if (newIndex >= 0) {
            setCurrentQuestionIndex(newIndex);
        }
    };

    const getOptionStyle = (optionKey) => {
        const correctAnswer = currentQuestion.correct_answer;
        const userAnswer = currentQuestion.user_answer;

        const optionMapping = {
            "OptionA": "A",
            "OptionB": "B",
            "OptionC": "C",
            "OptionD": "D",
        };

        if (!userAnswer || !correctAnswer) {
            return "#FFF";
        }

        if (optionMapping[optionKey] === correctAnswer) {
            return "#33ff99";
        }

        if (optionMapping[optionKey] === userAnswer) {
            return "#ff6666";
        }

        return "#FFF";
    };



    const dynamicFontSize = hp("5%");
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.moduleContainer}>
                    <Text style={styles.moduleText}>
                        Question No.{currentQuestionIndex + 1}
                    </Text>
                    <Text style={styles.moduleText}>
                        SAT {currentQuestion.module_name}
                    </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {Array.from({ length: currentModule.module_name.includes("english") ? 27 : 22 }).map((_, index) => {
                        const answer = currentModule?.answers?.find(answer => answer?.question_no === index + 1);
                        const isClickable = answer && !answer.not_attempted;

                        return (
                            <View key={index} style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={[
                                        styles.questionCircle,
                                        isClickable && styles.activeQuestionCircle,
                                        currentQuestionIndex === index && styles.selectedQuestionCircle,
                                    ]}
                                    onPress={() => {
                                        if (isClickable) {
                                            handleQuestionSelect(index);
                                        }
                                    }}
                                    disabled={!isClickable}
                                >
                                    <Text
                                        style={[
                                            styles.questionCircleText,
                                            isClickable && styles.activeQuestionCircleText,
                                            !isClickable && styles.disabledQuestionCircleText,
                                            currentQuestionIndex === index && styles.selectedQuestionCircleText,
                                        ]}
                                    >
                                        {index + 1}
                                    </Text>
                                </TouchableOpacity>


                                {currentQuestionIndex === index && <View style={styles.trianglePin} />}
                            </View>
                        );
                    })}
                </ScrollView>



                <View style={styles.questionContainer}>

                    {currentQuestion.Stem && (
                        <WebView
                            source={{ html: `<style>body { font-size: ${dynamicFontSize}; }</style>${currentQuestion.Stem}` }}
                            style={styles.webView}
                            originWhitelist={['*']}
                            scalesPageToFit={true}
                            javaScriptEnabled={true}
                        />
                    )}

                    {currentQuestion.Question && (
                        <WebView
                            source={{ html: `<style>body { font-size: ${dynamicFontSize}; }</style>${currentQuestion.Question}` }}
                            style={styles.webView}
                            originWhitelist={['*']}
                            scalesPageToFit={true}
                            javaScriptEnabled={true}
                        />
                    )}

                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.navigateButton} onPress={handlePrevious}>
                        <Text style={styles.navigateText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navigateButton} onPress={handleNext}>
                        <Text style={styles.navigateText}>Next</Text>
                    </TouchableOpacity>
                </View>


                {(currentQuestion.type === "MCQ" || currentQuestion.type === null) ? (
                    <View style={styles.optionsContainer}>
                        {["OptionA", "OptionB", "OptionC", "OptionD"].map((optionKey) => (
                            <View key={optionKey} style={[styles.particularOptionContainer, { backgroundColor: getOptionStyle(optionKey) }]}>
                                <WebView
                                    source={{
                                        html: `<style>
                                            body { 
                                                font-size: ${dynamicFontSize}; 
                                                background-color: ${getOptionStyle(optionKey)}; 
                                                padding: 10px;
                                                border-radius: 8px;
                                            }
                                        </style>${currentQuestion[optionKey] || ""}`
                                    }}
                                    style={styles.webViewOptions}
                                    originWhitelist={['*']}
                                    scalesPageToFit={true}
                                    javaScriptEnabled={true}
                                />
                            </View>
                        ))}
                    </View>

                ) : (

                    <View style={styles.questionContainer}>
                        <Text style={styles.questionContent}>Your Answer: {currentQuestion.user_answer || "N/A"}</Text>
                        <Text style={styles.answerText}>Correct Answer: {currentQuestion.correct_answer || "N/A"}</Text>
                    </View>
                )}


                {/* <View>
                    <View>
                        <Text style={styles.answerText}>
                            {`Your Answer: ${currentQuestion.user_answer || "N/A"}`}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.answerText}>
                            {`Correct Answer: ${currentQuestion.correct_answer || "N/A"}`}
                        </Text>
                    </View>
                </View> */}

                <View style={styles.answerExplanation}>
                    <Text style={styles.answerExplanationText}>Answer Explanation</Text>

                    <View style={styles.explanationTextContainer}>
                        {currentQuestion.rationale && (
                            <WebView
                                source={{ html: `<style>body { font-size: ${dynamicFontSize}; }</style>${currentQuestion.rationale}` }}
                                style={styles.webView}
                                originWhitelist={['*']}
                                scalesPageToFit={true}
                                javaScriptEnabled={true}
                            />
                        )}
                    </View>

                </View>

            </ScrollView>

            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    onPress={handlePreviousModule}
                    style={styles.navButton}
                // disabled={currentModuleIndex === 0}
                >
                    <Text style={styles.navButtonText}>Previous Module</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleNextModule}
                    style={styles.navButton}
                // disabled={currentModuleIndex === modules.length - 1}
                >
                    <Text style={styles.navButtonText}>Next Module</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    scrollContainer: {
        padding: 16,
    },
    moduleContainer: {
        marginBottom: 12,
        padding: 10,
        backgroundColor: "#FFF",
        borderRadius: 8,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    moduleText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        textDecorationLine: 'underline'
    },
    questionContainer: {
        padding: 16,
        backgroundColor: "#FFF",
        borderRadius: 8,
        marginBottom: 12,
        elevation: 5,
    },
    particularOptionContainer: {
        padding: 5,
        backgroundColor: "#FFF",
        borderRadius: 8,
        elevation: 8,
        height: hp('6%')
    },
    questionContent: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    stemContent: {
        fontSize: 14,
        marginBottom: 12,
    },
    optionsContainer: {
        flexDirection: "column",
        gap: hp('4%')
    },
    answerText: {
        fontSize: 14,
        fontWeight: "bold",
        marginVertical: 4,
    },
    answerExplanation: {
        marginTop: hp('3%')
    },
    answerExplanationText: {
        color: 'black',
        fontSize: hp("2.5%"),
        fontWeight: '600'
    },
    explanationTextContainer: {
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#FFF",
        borderColor: '#ccc',
        elevation: 5,
        padding: 5,
        marginTop: hp('2%')
    },

    specialQuestionText: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 12,
    },
    questionNavigation: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 12,
    },
    navigationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
    },
    navButton: {
        backgroundColor: "#0470B8",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 4,
    },
    disabledButton: {
        backgroundColor: "#C0C0C0",
    },
    navButtonText: {
        color: "#FFF",
        fontSize: 14,
        textAlign: "center",
        fontWeight: '700'
    },
    centeredContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        padding: 16,
    },
    horizontalScroll: {
        marginTop: 8,
        flexDirection: "row",
        marginBottom: 10
    },
    questionCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        backgroundColor: "#E0E0E0",
    },
    activeQuestionCircle: {
        backgroundColor: "#0470B8",
    },
    questionCircleText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    activeQuestionCircleText: {
        color: "#FFF",
    },
    trianglePin: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#0470B8',
        marginTop: 5,
    },
    webView: {
        height: hp('20%'),
        width: wp('90%'),
        marginVertical: 10,
        borderRadius: 8,
        backgroundColor: "#FFF",
    },
    webViewOptions: {
        height: hp('2%'),
        width: wp('90%'),
        marginVertical: 5,
        borderRadius: 8,
        backgroundColor: "#FFF",
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'transparent',
        marginBottom: hp('5%')
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
    disabledQuestionCircle: {
        backgroundColor: "#ccc",
        opacity: 0.5,
    },
    disabledQuestionCircleText: {
        color: "#666",
    },

});

export default QuizAnalysisPage;
