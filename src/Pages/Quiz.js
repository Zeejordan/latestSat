import React, { useState, useEffect, useRef, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Modal
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet"; // Importing Bottom Sheet
import AntDesign from "react-native-vector-icons/AntDesign";
import Octicons from "react-native-vector-icons/Octicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Footer from "../Components/Footer";
import axios from "axios";
import { QUIZ_LIST, QUIZ_LIST_COMPLETE } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GlobalContext } from '../context/GlobalContext';

const Quiz = ({ navigation }) => {
    const [quizData, setQuizData] = useState([]);
    const [filterOption, setFilterOption] = useState("All");
    const [totalTests, setTotalTests] = useState("");
    const [instructions, setInstructions] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [progressId, setProgressId] = useState('');
    const [totalScore, setTotalScore] = useState('');
    const [englishScore, setEnglishScore] = useState('');
    const [mathScore, setMathScore] = useState('');
    const [userSession, setUserSession] = useState('');
    const [modal, setModal] = useState(false);
    const bottomSheetRef = useRef(); // Ref to manage Bottom Sheet visibility

    const { mode, setMode } = useContext(GlobalContext);

    useEffect(() => {
        quizList();
    }, []);

    const quizList = async () => {
        const baseUrlGet = QUIZ_LIST;
        const token = await AsyncStorage.getItem("token");
        try {
            const response = await axios.get(baseUrlGet, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response?.data?.error) {
                setTotalTests(response?.data?.meta?.total_tests);
                setQuizData(response?.data?.meta?.tests);
            }
        } catch (error) {
            console.error("An Error Occurred", error);
        }
    };

    const handleCompleteScoreDisplay = async (progressId) => {
        const token = await AsyncStorage.getItem('token');
        const baseUrlGet = QUIZ_LIST_COMPLETE + progressId + "/";
        try {
            const response = await axios.get(baseUrlGet, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response?.data?.error) {
                setTotalScore(response?.data?.meta.total_score);
                setEnglishScore(response?.data?.meta.total_rw_score);
                setMathScore(response?.data?.meta.total_math_score);
                setUserSession(response?.data?.meta?.session_id);
            }
        } catch (error) {
            console.error("An Error Occurred", error);
        } finally {
            bottomSheetRef.current.open(); // Open the bottom sheet after data is fetched
        }
    };

    const handleTest = (status, item) => {
        if (status === "Unlocked" || status === "close") {
            setInstructions(true);
        }
        if (status === "Completed") {
            const tempId = item?.progress_id;
            setProgressId(tempId);
            setTimeout(() => {
                handleCompleteScoreDisplay(tempId);
            }, 0);
        }
    };

    const handleNavigation = () => {
        setModal(true)
    };

    const handleNextNavigation = (mode) => {
        setMode(mode)
        setModal(false);
        navigation.navigate("English-Quiz-1");
    }

    const handleQuizClose = () => {
        setInstructions(false)
    };

    const handleAnalysisNavigation = () => {
        bottomSheetRef.current.close();
        if (userSession) {
            console.log('THIS IS USERSESSUIB', userSession)
            navigation.navigate('Quiz-Analysis', { userSession })
        }
    };

    const renderItem = ({ item }) => {
        const opacity = item.Status === "Locked" ? 0.5 : 1;

        return (
            <TouchableOpacity
                style={[styles.singleList, { opacity }]}
                onPress={() => handleTest(item.Status, item)}
                disabled={item.Status === "Locked"}
            >
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
                <Text style={styles.detailsText}>
                    Test Details - Maths, English (reading - writing)
                </Text>
            </TouchableOpacity>
        );
    };

    const getFilteredData = () => {
        if (filterOption === "Unlocked") {
            return quizData.filter((item) => item.Status === "Unlocked");
        } else if (filterOption === "Locked") {
            return quizData.filter((item) => item.Status === "Locked");
        } else if (filterOption === "Completed") {
            return quizData.filter((item) => item.Status === "Completed");
        }

        return quizData;
    };

    const handleBack = () => {
        navigation.navigate('HomeScreen')
    }

    const handleFilterSelection = (filter) => {
        setFilterOption(filter);
        setFilterVisible(false);
    };

    const renderFilterDropdown = () => (
        <View style={styles.dropdownContainer}>
            <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => handleFilterSelection("All")}
            >
                <Text style={styles.dropdownText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => handleFilterSelection("Completed")}
            >
                <Text style={styles.dropdownText}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => handleFilterSelection("Unlocked")}
            >
                <Text style={styles.dropdownText}>Unlocked</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => handleFilterSelection("Locked")}
            >
                <Text style={styles.dropdownText}>Locked</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#0470B8"
                translucent={false}
            />
            {instructions ? (
                <View style={styles.instructionsContainer}>
                    <View style={styles.semiInstructions}>
                        <Text style={styles.quizHeading}>Quiz Instructions</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.sectionTitle}>Reading And Writing:</Text>
                        <Text style={styles.paragraph}>
                            This section focuses on key reading and writing skills. Each question
                            is based on one or more passages, which may include tables or
                            graphs. Read the passages and questions thoroughly, then choose
                            the best answer based on the information provided. All questions
                            are multiple-choice with four options, and each has only one
                            correct answer.
                        </Text>

                        <Text style={styles.sectionTitle}>Maths:</Text>
                        <Text style={styles.paragraph}>
                            The questions in this section evaluate key math skills.{"\n\n"}
                            You are allowed to use a calculator for all questions. The
                            calculator and these instructions are accessible throughout the
                            test.{"\n\n"}
                            Unless otherwise specified:{"\n"}- All variables and expressions
                            represent real numbers.{"\n"}- All figures provided are drawn to
                            scale.{"\n"}- All figures lie in a plane.{"\n"}- The domain of a
                            function is the set of all real numbers x for which f(x) is a real
                            number.{"\n\n"}
                        </Text>

                        <Text style={styles.paragraph}>
                            For Multiple-Choice Questions: {"\n"}
                            Solve each problem and select the correct answer from the choices provided. Each question has only one correct answer.{"\n\n"}

                            For Student-Produced Response (SPR) Questions: {"\n"}
                            Solve each problem and enter your answer as follows: {"\n"}
                            - If there are multiple correct answers, enter only one. {"\n"}
                            - If your answer is a fraction that does not fit in the space provided, enter its decimal equivalent. For non-terminating decimals, round to three decimal places. {"\n"}
                            - If your answer is a decimal that does not fit in the space provided, truncate or round it to the third digit. {"\n"}
                            - If your answer is a mixed number (eg. 5 1/2), enter it as an improper fraction (eg. 11/2) or its decimal equivalent (eg. 5.5).{"\n\n"}

                            Here’s the example presented as a table for clarity: {"\n\n"}

                            Acceptable Ways to Enter Answer       {"\n"}
                            --------------------------------------------------------------------------{"\n"}
                            3.5     =        3.5, 7/2                                  {"\n"}
                            19/9    =      19/9, 2.111, 2.112                        {"\n"}
                            -37/4    =     -37/4, -9.25                              {"\n"}
                            10√(3)   =     10root(3), 17.320, 17.321                 {"\n"}
                        </Text>

                        <View style={styles.buttonsContainer}>

                            <TouchableOpacity style={styles.quizStartButton} onPress={handleQuizClose}>
                                <Text style={styles.quizStartButtonText}>Go Back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleNavigation}
                                style={styles.quizStartButton}
                            >
                                <Text style={styles.quizStartButtonText}>Start Quiz</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.topBar}>
                        <View style={styles.miniContainer}>
                            <TouchableOpacity onPress={handleBack}>
                                <AntDesign name={"arrowleft"} size={25} color={'#46557B'} />
                            </TouchableOpacity>
                            <Text style={styles.quizText}>Quiz</Text>
                        </View>
                        <View style={styles.leftSubBar}>
                            <TouchableOpacity onPress={() => setInstructions((prev) => !prev)}>
                                <Octicons name="info" color="black" style={styles.infoIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setFilterVisible((prev) => !prev)}>
                                <AntDesign name="filter" color="black" style={styles.infoIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {filterVisible && renderFilterDropdown()}

                    <FlatList
                        data={getFilteredData()}
                        keyExtractor={(item, index) => item.id || index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.flatListContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}

            {modal && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modal}
                    onRequestClose={() => setModal(false)}
                >
                    <View style={styles.newModal}>
                        <View style={styles.newModalContainer}>
                            <Text style={styles.newModalText}>Select Mode</Text>

                            <View style={styles.modeContainer}>
                                <TouchableOpacity
                                    style={styles.newModalButton}
                                    onPress={() => handleNextNavigation('practice_mode')}
                                >
                                    <Text style={styles.newModalButtonText}>Practise Mode</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.newModalButton}
                                    onPress={() => handleNextNavigation('exam_mode')}
                                >
                                    <Text style={styles.newModalButtonText}>Exam Mode</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            <Footer />

            <RBSheet
                ref={bottomSheetRef}
                height={350}
                closeOnDragDown={true}
                customStyles={{
                    container: {
                        padding: 20,
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                    },
                }}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.quizCompletedText}>Quiz Completed</Text>
                    <View style={styles.scoresContainer}>
                        <Text style={styles.scoreText}>Your Total Score: {totalScore}</Text>
                        <Text style={styles.scoreText}>Reading & Writing Score: {englishScore}</Text>
                        <Text style={styles.scoreText}>Math Score: {mathScore}</Text>
                    </View>

                    <View style={styles.modalButtonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleAnalysisNavigation}>
                            <Text style={styles.buttonText}>Analysis</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => bottomSheetRef.current.close()}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>
        </SafeAreaView>
    );
};

export default Quiz;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 15,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    miniContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: wp("4%")
    },
    leftSubBar: {
        flexDirection: "row",
        gap: wp("2%"),
        justifyContent: "center",
        alignItems: "center",
    },
    quizText: {
        color: "#46557B",
        fontSize: hp("3.4%"),
        fontWeight: "600",
    },
    flatListContent: {
        marginTop: hp("3%"),
        gap: 20,
    },
    time: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusContainerLocked: {
        borderWidth: 1,
        borderColor: "#ED2024",
        borderRadius: 10,
        paddingHorizontal: wp("2%"),
        backgroundColor: "#FC9C99",
    },
    statusContainerCompleted: {
        borderWidth: 1,
        borderColor: "green",
        borderRadius: 10,
        paddingHorizontal: wp("2%"),
        backgroundColor: "green",
    },
    sectionTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    statusContainerUnlocked: {
        borderWidth: 1,
        borderColor: "#D1BF00",
        borderRadius: 10,
        paddingHorizontal: wp("2%"),
        backgroundColor: "#D1BF00",
    },
    firstBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: hp("1%"),
    },
    statusText: {
        color: "white",
        fontWeight: "600",
    },
    timeText: {
        color: "grey",
        fontSize: hp("1.6%"),
    },
    singleList: {
        borderWidth: 2,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
        borderColor: "#ECECEC",
    },
    hr: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        marginVertical: 10,
        width: "100%",
    },
    titleText: {
        fontSize: hp("2%"),
        fontWeight: "600",
    },
    detailsText: {
        color: "#5D5D5D",
    },
    instructionsContainer: {
        flex: 1,
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("3%"),
    },
    semiInstructions: {
        textAlign: "center",
    },
    quizHeading: {
        textAlign: 'center',
        fontWeight: '700',
        color: '#0470B8',
        fontSize: hp("3%"),
        textDecorationLine: 'underline',
        marginBottom: hp('2%')
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 10,
        paddingHorizontal: wp('1%')
    },
    quizStartButton: {
        backgroundColor: "#26A5E6",
        // marginHorizontal: wp("10%"),
        borderRadius: 10,
        // marginVertical: hp("4%"),
        paddingVertical: hp("1.5%"),
        paddingHorizontal: wp("8%"),
    },
    quizStartButtonText: {
        textAlign: "center",
        color: "white",
        fontWeight: "700",
        fontSize: hp("2%"),
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        marginTop: hp('3%'),
        borderColor: 'transparent'
    },
    infoIcon: {
        fontSize: hp('2.8%')
    },
    dropdownContainer: {
        position: "absolute",
        right: 15,
        top: 60,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        width: 150,
        zIndex: 10,
    },
    dropdownOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dropdownText: {
        fontSize: 16,
        color: "#333",
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '100%',
        paddingTop: hp("3%"),
        paddingHorizontal: wp("5%"),
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        flex: 1
    },
    quizModalHeading: {
        marginBottom: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    quizCompletedText: {
        fontSize: hp('4%'),
        fontWeight: '700',
        color: '#0470B8',
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    scoreContainer: {
        width: '100%',
        marginVertical: 10,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    scoreText: {
        fontSize: hp('2.2%'),
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
        marginVertical: 5,
    },
    scoresContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: hp("1%"),
        marginTop: hp("2%")
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('6%'),
        width: '100%',
    },
    button: {
        backgroundColor: '#0470B8',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('7%'),
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: hp('2%'),
        fontWeight: '600',
    },
    newModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    newModalContainer: {
        width: '80%',
        height: '28%',
        paddingTop: hp("3%"),
        paddingHorizontal: wp("5%"),
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    newModalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    modeContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: hp('2%')
    },
    newModalButton: {
        backgroundColor: '#0470B8',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('7%'),
        borderRadius: 8,
        alignItems: 'center',
        width: wp('60%')
    },
    newModalButtonText: {
        color: '#FFFFFF',
        fontSize: hp('2%'),
        fontWeight: '600',
    },
});
