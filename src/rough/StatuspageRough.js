import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import axios from "axios";
import { QUIZ_ANSWERS } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QuizAnalysisPage = ({ route }) => {
    const { userSession } = route.params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flatlistData, setFlatlistData] = useState([]);
    const [indexArray, setIndexArray] = useState([]);



    useEffect(() => {
        const fetchQuizAnswers = async () => {
            const token = await AsyncStorage.getItem('token');
            const baseUrlGet = QUIZ_ANSWERS + userSession + "/";
            try {
                const response = await axios.get(baseUrlGet, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (!response?.data?.error) {
                    const modulesData = response?.data?.meta?.modules_data;
                    setData(modulesData);
                    console.log("YHE HAI DATA, OF MODULES", modulesData) // correct

                    if (modulesData) {
                        Object.keys(data).map((item) => {
                            if (item.length > 0) {
                                setFlatlistData(item);
                            }
                        })
                        console.log('YEH AHI FLATLIST DATA', flatlistData) // output : math_module_2

                        if (flatlistData) {
                            const array = []
                            flatlistData.map((item) => {
                                if (item.index) {
                                    array.push(item.index)
                                }
                            })
                            setIndexArray((prev) => prev = array);
                        }
                        console.log('yeh hai index array ', indexArray)
                    }
                }
            } catch (err) {
                console.log(err.response);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuizAnswers();
    }, [userSession]);

    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
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

    // return (
    //     <ScrollView contentContainerStyle={styles.container}>
    //         {Object.keys(data).map((moduleKey) => (
    //             <View key={moduleKey} style={styles.moduleContainer}>
    //                 <Text style={styles.moduleTitle}>{moduleKey.replace(/_/g, ' ').toUpperCase()}</Text>
    //                 {data[moduleKey].map((item, index) => (
    //                     <View key={index} style={styles.questionContainer}>
    //                         <Text style={styles.questionText}>Question {index + 1}:</Text>
    //                         <Text style={styles.content}>{item.Question || "No question provided."}</Text>
    //                         <Text style={styles.answer}>Your Answer: {item.user_answer || "Not Answered"}</Text>
    //                         <Text style={styles.correctAnswer}>Correct Answer: {item.correct_answer || "Not Provided"}</Text>
    //                         <Text style={item.is_correct ? styles.correct : styles.incorrect}>
    //                             {item.is_correct ? "Correct" : "Incorrect"}
    //                         </Text>
    //                     </View>
    //                 ))}
    //             </View>
    //         ))}
    //     </ScrollView>
    // );

    return (
        <SafeAreaView></SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#F9F9F9",
    },
    centeredContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9F9F9",
    },
    moduleContainer: {
        marginBottom: 24,
        backgroundColor: "#FFF",
        borderRadius: 8,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    moduleTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
    },
    questionContainer: {
        marginBottom: 16,
    },
    questionText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#007BFF",
    },
    content: {
        fontSize: 14,
        color: "#555",
        marginTop: 4,
        marginBottom: 8,
    },
    answer: {
        fontSize: 14,
        color: "#FF5722",
        marginBottom: 4,
    },
    correctAnswer: {
        fontSize: 14,
        color: "#4CAF50",
        marginBottom: 4,
    },
    correct: {
        fontSize: 14,
        color: "#4CAF50",
        fontWeight: "600",
    },
    incorrect: {
        fontSize: 14,
        color: "#F44336",
        fontWeight: "600",
    },
    errorText: {
        fontSize: 16,
        color: "#F44336",
        textAlign: "center",
    },
});

export default QuizAnalysisPage;

// useEffect(() => {
//     const fetchQuizAnswers = async () => {
//         const token = await AsyncStorage.getItem('token');
//         const baseUrlGet = QUIZ_ANSWERS + userSession + "/";
//         try {
//             const response = await axios.get(baseUrlGet, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });

//             if (!response?.data?.error) {
//                 const modulesData = response?.data?.meta?.modules_data;
//                 setData(modulesData);
//                 console.log("YHE HAI DATA, OF MODULES", modulesData); // correct

//                 if (modulesData) {
//                     // Collect flatlistData directly
//                     const flatData = Object.keys(modulesData);
//                     setFlatlistData(flatData);
//                     console.log('YEH AHI FLATLIST DATA', flatData);

//                     // Set indexArray based on flatlistData
//                     const array = flatData.map(item => modulesData[item].map(subItem => subItem.index)).flat();
//                     setIndexArray(array);
//                     console.log('yeh hai index array ', array);
//                 }
//             }
//         } catch (err) {
//             console.log(err.response);
//             setError("Failed to fetch data. Please try again later.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchQuizAnswers();
// }, [userSession]);
//  use if for reference