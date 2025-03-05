import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { LEVELS_PAGINATION_API } from '../../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestQuestion = ({ route }) => {
    const { questions } = route.params;
    const navigation = useNavigation();
    const [question, setQuestion] = useState(questions);
    const [flatlistData, setFlatlistData] = useState([]);
    const [optionSelected, setOptionSelected] = useState(false);
    const [optionChoosen, setOptionChoosen] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentOption, setCurrentOption] = useState(null)
    const [sprValue, setSprValue] = useState('');
    const [percentage, setPercentage] = useState(null);
    const [message, setMessage] = useState('');
    const progress = 5;

    const [levelId, setLevelId] = useState('');

    useEffect(() => {
        setFlatlistData([question[currentQuestionIndex]]);
    }, [currentQuestionIndex, question]);

    const handleOption = (option) => {
        setOptionChoosen(option);
        setOptionSelected(true);
    };

    useEffect(() => {
        console.log("yeh hai questions ko dekh test questionsmai", question);
        if (question) {
            setLevelId(question[currentQuestionIndex]?.data?.level_id);
            console.log("yeh hai level id test questionsmai", levelId);
        }
    }, [question]);



    const handleNextQuestion = async (index, type) => {

        const optionMapping = {
            'optiona': "A",
            'optionb': "B",
            'optionc': "C",
            'optiond': "D",
        }
        const token = await AsyncStorage.getItem('token');
        const baseUrlPost = `${LEVELS_PAGINATION_API}${index}`;

        const payload = {
            "level_id": levelId,
            "chosen": type === "SPR" ? sprValue : optionMapping[currentOption]

        };

        console.log("yeh ahiapayload", payload)

        try {
            const response = await axios.post(baseUrlPost, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("yeh hai response of pagination submit", response?.data)
            if (response?.data?.meta?.percentage) {
                setPercentage(response?.data?.meta?.percentage);
            }
            if (response?.data?.message) {
                setMessage(response?.data?.message)
            }
        } catch (error) {
            console.error("An Error Occurred", error);
        }

        if (currentQuestionIndex === questions.length - 1) {
            // navigation.navigate('LevelComplete', { percentage });
            if (percentage && message) {
                navigation.navigate('LevelComplete', { percentage, message, questions });
            }
        } else {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setOptionSelected(false);
            setOptionChoosen('');
            setSprValue("");
        }
    };


    useEffect(() => {
        const temp = question.filter((item) => item.index === 0);
        setFlatlistData(temp);
    }, [question]);

    const dynamicFontSize = hp("5%");

    const renderItem = ({ item }) => (
        <View style={styles.container}>
            {/* Top Bar */}
            {/* <View style={styles.topBar}>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>

                <View style={styles.heartAndScore}>
                    <Image
                        source={require('../../assets/images/heart.png')}
                        style={styles.heartImage}
                    />
                    <Text style={styles.score}>10</Text>
                </View>
            </View> */}

            <View style={styles.questionContainer}>
                {/* <WebView
                    originWhitelist={['*']}
                    source={{ html: `<p style="font-size: 22px; color: black;">${item.data.stem}</p>` }}
                    style={styles.webView}
                    scrollEnabled={false}
                /> */}
                <WebView
                    source={{ html: `<style>body { font-size: ${dynamicFontSize}; color:#0470B8; font-weight: bold; }</style>${item.data.stem}` }}
                    style={styles.webView}
                    originWhitelist={['*']}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                />

            </View>

            {item?.data?.question && (
                <View style={styles.questionContainer}>
                    {/* <WebView
                        originWhitelist={['*']}
                        source={{ html: `<p style="font-size: 22px; color: black;">${item.data.question}</p>` }}
                        style={styles.webView}
                        scrollEnabled={false}
                    /> */}
                    <WebView
                        source={{ html: `<style>body { font-size: ${dynamicFontSize};  color:#0470B8; font-weight: bold;}</style>${item.data.question}` }}
                        style={styles.webView}
                        originWhitelist={['*']}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                    />

                </View>
            )}

            {item?.data?.type && item?.data?.type === "SPR" ? (
                <View style={styles.sprContainer}>
                    <TextInput
                        style={styles.sprInput}
                        value={sprValue}
                        placeholder="Enter Your Answer"
                        onChangeText={(text) => setSprValue(text)}
                    />
                </View>
            ) : (
                <View style={styles.optionsContainer}>
                    {['optiona', 'optionb', 'optionc', 'optiond'].map((option, index) => {
                        const isSelected = optionChoosen === option;
                        return (
                            <TouchableOpacity
                                key={`${option}-${index}`}
                                style={[styles.singleOption, isSelected && styles.optionTicked]}
                                onPress={() => {
                                    handleOption(option);
                                    setCurrentOption(option);
                                }}
                            >
                                <View style={styles.webViewWrapper}>
                                    <WebView
                                        source={{ html: `<style>body { font-size: 16px; color: black; text-align: center;  }</style>${item.data[option] || ''}` }}
                                        style={styles.webViewOptions}
                                        originWhitelist={['*']}
                                        scalesPageToFit={false}
                                        javaScriptEnabled={true}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>


            )}

            <TouchableOpacity
                style={[
                    styles.unClickedContinueButton
                ]}
                disabled={
                    (item.data.type === "MCQ" && !optionSelected) || (item.data.type === "SPR" && !sprValue)
                }
                onPress={() => {
                    handleNextQuestion(item.index, item.data.type);
                }}
            >
                <Text style={optionSelected || sprValue ? styles.clickedContinueText : styles.unClikedContinueText}>
                    {item.index === questions.length - 1 ? "Finish" : "Next"}
                </Text>
            </TouchableOpacity>


        </View>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.linearGradientColor1, COLORS.linearGradientColor2]}
                style={styles.gradientContainer}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}>

                <FlatList
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item?.data?.id ? item.data.id.toString() : `index-${index}`}
                    data={flatlistData}
                    showsVerticalScrollIndicator={false}
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

export default TestQuestion;


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    gradientContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        paddingHorizontal: wp('4%')
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginTop: hp('4.5%')
    },
    progressBarBackground: {
        height: 8,
        width: 200,
        backgroundColor: 'white',
        borderRadius: 4,
        overflow: 'hidden'
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: 'blue',
    },
    heartImage: {
        height: hp('2.3%'),
        width: hp('2.3%')
    },
    heartAndScore: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: wp('1%')
    },
    score: {
        color: 'white',
        fontSize: hp('2%')
    },
    speaker: {
        height: hp('3%'),
        width: hp('3%')
    },
    speakerContainer: {
        marginTop: hp('2%')
    },
    questionText: {
        color: 'white',
        fontSize: hp('2.5%')
    },
    questionContainer: {
        marginTop: hp('5%'),
    },
    optionsContainer: {
        flexDirection: 'column',
        gap: hp('2.8%'),
        marginTop: hp('3.5%')
    },
    webView: {
        height: hp('20%'),
        width: wp('90%'),
        marginVertical: 10,
        borderRadius: 8,
        backgroundColor: "#FFF",
    },
    webViewWrapper: {
        width: '100%',
        height: hp('7%'),
        overflow: 'hidden',
        justifyContent: 'center',
    },
    webViewOptions: {
        flex: 1,
        backgroundColor: 'transparent',
        maxHeight: hp('10%'),
    },
    singleOption: {
        backgroundColor: 'white',
        paddingVertical: hp('1%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 7,
        marginHorizontal: wp('3.5%'),
        minHeight: hp('8%'),
        overflow: 'hidden',
    },
    optionTicked: {
        backgroundColor: '#26A5E6',
        borderColor: '#0470B8',
    },
    optionText: {
        fontSize: hp('3%'),
        fontWeight: '600',
    },
    choosenOptionText: {
        fontSize: hp('3%'),
        fontWeight: '600',
        color: 'white'
    },
    unClickedContinueButton: {
        backgroundColor: 'white',
        paddingVertical: hp('1%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 7,
        marginHorizontal: wp('3.5%'),
        marginTop: hp('13%'),
        elevation: 10
    },
    unClikedContinueText: {
        color: COLORS.lightText,
        textAlign: 'center',
        fontSize: hp('3%'),
        fontWeight: '600'
    },
    clickedContinueButton: {},
    clickedContinueText: {
        textAlign: 'center',
        fontSize: hp('3%'),
        fontWeight: '600',
        color: '#26A5E6'
    },
    webView: {
        height: 50,
        backgroundColor: 'transparent',
    },
    sprContainer: {},
    sprInput: {
        backgroundColor: 'white',
        height: hp("10%"),
        borderRadius: 10,
    }
});

// retake ki api lagani hai levelcomplete waale page pe

