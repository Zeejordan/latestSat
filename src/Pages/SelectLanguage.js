import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, I18nManager, Alert, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
// import { theme } from "../theme/theme";
import i18n from "../../i18n";

const SelectLanguage = () => {
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const loadLanguage = async () => {
            const savedLanguage = await AsyncStorage.getItem("appLanguage");
            if (savedLanguage) {
                setSelectedLanguage(savedLanguage);
                I18nManager.forceRTL(savedLanguage === "ar");
                i18n.changeLanguage(savedLanguage);
            } else {
                setSelectedLanguage("en");
                i18n.changeLanguage("en");
            }
        };
        loadLanguage();
    }, []);

    const handleLanguageSelect = async (language) => {
        setSelectedLanguage(language);
        await AsyncStorage.setItem("appLanguage", language);
        I18nManager.forceRTL(language === "ar");
        i18n.changeLanguage(language);
    };

    const handleNext = () => {
        if (selectedLanguage) {
            navigation.navigate("Login");
        } else {
            Alert.alert("Error", "Please select a language to proceed.");
        }
    };

    return (
        <View
            style={styles.container}

        >
            <View style={styles.contentContainer}>

                <Text style={styles.heading}>Select Language</Text>
                <View style={styles.languageButtonsContainer}>
                    <Text style={styles.instructionText}>
                        Choose your preferred language
                    </Text>
                    <Text style={styles.instructionText}>(اختر لغتك المفضلة)</Text>
                    <TouchableOpacity
                        style={[
                            styles.languageButton,
                            selectedLanguage === "ar" && styles.selectedButton,
                        ]}
                        onPress={() => handleLanguageSelect("ar")}>
                        <Text style={styles.languageText}>English</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.languageButton,
                            selectedLanguage === "en" && styles.selectedButton,
                        ]}
                        onPress={() => handleLanguageSelect("en")}
                    >
                        <Text style={styles.languageText}>العربية</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    contentContainer: {
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 20,
        width: "90%",
        height: 450
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: '#0470B8',
        marginBottom: 20,
    },
    instructionText: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5,
        textAlign: "center",
    },
    languageButtonsContainer: {
        width: "100%",
        marginBottom: 30,
    },
    languageButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        marginTop: 10,
    },
    languageText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    selectedButton: {
        backgroundColor: '#0470B8',
    },
    nextButton: {
        width: "80%",
        height: 50,
        backgroundColor: '#0470B8',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
    nextButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default SelectLanguage;