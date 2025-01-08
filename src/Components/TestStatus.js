import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import React from 'react'
import * as Progress from 'react-native-progress';

const TestStatus = ({ image, task, questions, progress }) => {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={image} style={styles.image} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.task}>{task}</Text>
                    <Text style={styles.questions}>{questions}</Text>
                </View>
                <View style={styles.progress}>
                    <Progress.Circle progress={0.6} size={40} showsText={true} />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default TestStatus

const styles = StyleSheet.create({
    image: {
        objectFit: "cover",
        height: 40,
        width: 40,
        borderWidth: 1,
        borderRadius: 25,
        borderColor: "white"
    },
    imageContainer: {
        padding: 5,
        backgroundColor: "white"
    },
    container: {
        flexDirection: "row",
        // justifyContent:"space-between"
        gap: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: "lightgrey",
        borderRadius: 15
    },
    textContainer: {
        textAlign: "left",
        // backgroundColor:"orange",
        flexDirection: "column",
        gap: 10
    },
    task: {
        color: "#46557B",
        fontSize: 18
    },
    questions: {
        color: "#C6C1E0",
        fontSize: 12
    },
    progress:{
        alignSelf:"flex-end",
    }
})

// #2562C1
