import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';

const CalculatorModal = ({ showCalculator, setShowCalculator }) => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    const handlePress = (value) => {
        if (value === 'C') {
            setInput('');
            setResult('');
        } else if (value === '=') {
            try {
                const evalResult = eval(input);
                setResult(evalResult.toString());
            } catch (error) {
                setResult('Error');
            }
        } else if (value === '√') {
            try {
                const evalResult = Math.sqrt(eval(input));
                setResult(evalResult.toString());
            } catch (error) {
                setResult('Error');
            }
        } else {
            setInput((prev) => prev + value);
        }
    };

    const buttons = [
        ['7', '8', '9', '/'],
        ['4', '5', '6', '*'],
        ['1', '2', '3', '-'],
        ['C', '0', '√', '+'],
        ['='],
    ];

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showCalculator}
            onRequestClose={() => setShowCalculator(false)}
        >
            <View style={styles.calculatorContainer}>
                <Text style={styles.calculatorTitle}>Calculator</Text>

                <View style={styles.displayContainer}>
                    <Text style={styles.inputText}>{input || '0'}</Text>
                    <Text style={styles.resultText}>{result || 'Result'}</Text>
                </View>

                <View style={styles.buttonsGrid}>
                    {buttons.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.buttonRow}>
                            {row.map((buttonValue) => (
                                <TouchableOpacity
                                    key={buttonValue}
                                    style={[
                                        styles.button,
                                        buttonValue === 'C' || buttonValue === '=' || buttonValue === '√'
                                            ? styles.actionButton
                                            : styles.defaultButton,
                                    ]}
                                    onPress={() => handlePress(buttonValue)}
                                >
                                    <Text style={styles.buttonText}>{buttonValue}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowCalculator(false)}
                >
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    calculatorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 20
    },
    calculatorTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    displayContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: '#0470B8',
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    inputText: {
        fontSize: 24,
        color: 'white',
        textAlign: 'right',
    },
    resultText: {
        fontSize: 32,
        color: 'white',
        textAlign: 'right',
        marginTop: 10,
    },
    buttonsGrid: {
        width: '90%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        flex: 1,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    defaultButton: {
        backgroundColor: '#0470B8',
    },
    actionButton: {
        backgroundColor: '#0470B8',
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: '#0470B8',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
});

export default CalculatorModal;
