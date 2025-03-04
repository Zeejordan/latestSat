import { StyleSheet, Text, View, SafeAreaView, Image, FlatList, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import Footer from '../Components/Footer';
import { GET_USER_DETAILS, LOGOUT, BASE_URL, IMG_URL } from '../../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const detailBlock = () => {


    return (
        <>
            <View style={styles.section}>
                <Text style={styles.fieldHeading}>Name</Text>
                <View style={styles.singleField}>
                    <Text style={styles.fieldText}>{userData.name}</Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.fieldHeading}>Username</Text>
                <View style={styles.singleField}>
                    <Text style={styles.fieldText}>{userData.username}</Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.fieldHeading}>Email</Text>
                <View style={styles.singleField}>
                    <Text style={styles.fieldText}>{userData.email}</Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.fieldHeading}>Phone Number</Text>
                <View style={styles.singleField}>
                    <Text style={styles.fieldText}>{userData.phone_number}</Text>
                </View>
            </View>
        </>
    )
}

export default detailBlock

const styles = StyleSheet.create({
    section: {
        gap: hp("0.8%"),
        marginVertical: hp('1%')
    },
    fieldHeading: {
        fontSize: hp('2.5%')
    },
    singleField: {
        borderWidth: 1,
        borderColor: '#7C7C7C',
        borderRadius: 5,
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('4%'),
    },
    fieldText: {
        color: '#2562C1',
        fontWeight: '700',
        fontSize: hp('2%')
    },
})