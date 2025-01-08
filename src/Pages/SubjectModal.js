import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const SubjectModal = () => {
    const [selectedSubject, setSelectedSubject] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [options, setOptions] = useState([]);

    const handleSubjectChange = (subject) => {
        setSelectedSubject(subject);
        setModalVisible(true);

        if (subject === 'English') {
            setOptions([
                'Expression of Ideas',
                'Expression of Ideas',
                'Information and Ideas',
                'Standard English Conventions',
            ]);
        } else if (subject === 'Maths') {
            setOptions([
                'Advanced Math',
                'Problem-Solving and Data Analysis',
                'Algebra',
                'Geometry and Trigonometry',
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Subject</Text>

            {/* Custom Dropdown for Subject Selection */}
            <View style={styles.dropdown}>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.dropdownText}>{selectedSubject || 'Select Subject'}</Text>
                </TouchableOpacity>

                {modalVisible && (
                    <View style={styles.dropdownOptions}>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleSubjectChange('English')}
                        >
                            <Text style={styles.optionText}>English</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleSubjectChange('Maths')}
                        >
                            <Text style={styles.optionText}>Maths</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible && selectedSubject}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{selectedSubject} Options</Text>
                        {options.map((option, index) => (
                            <TouchableOpacity key={index} style={styles.optionButton}>
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    dropdown: {
        width: 200,
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
    },
    dropdownButton: {
        padding: 10,
        backgroundColor: '#f1f1f1',
    },
    dropdownText: {
        fontSize: 16,
    },
    dropdownOptions: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#ddd',
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    optionText: {
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default SubjectModal;
