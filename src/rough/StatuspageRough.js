import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const StatusPage = ({ route, navigation }) => {
    const { statusData, SubmitCheck } = route.params; // Retrieve SubmitCheck function

    return (
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
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.navigateText}>Go Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navigateButton}
                    onPress={() => {
                        SubmitCheck("onSubmitClick"); // Call SubmitCheck function
                        navigation.navigate('English-Quiz-1'); // Navigate back to EnglishQuizModule1
                    }}
                >
                    <Text style={styles.navigateText}>Finish</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default StatusPage;

const styles = StyleSheet.create({
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
});

// stop stop stop stop stop stop stop
// finish pe submit ki functionality properly achieve karni hai

