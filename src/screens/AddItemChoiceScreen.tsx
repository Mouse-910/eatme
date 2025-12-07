import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const AddItemChoiceScreen: React.FC = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Item</Text>
            <Text style={styles.subtitle}>Choose an input method</Text>

            <TouchableOpacity
                style={[styles.card, styles.manualCard]}
                onPress={() => navigation.navigate('ManualAdd')}
            >
                <Text style={styles.cardTitle}>Manual Entry</Text>
                <Text style={styles.cardDesc}>Quickly add items by hand</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.card, styles.scanCard]}
                onPress={() => navigation.navigate('ScanCamera')}
            >
                <Text style={styles.cardTitle}>Scan Receipt (AI)</Text>
                <Text style={styles.cardDesc}>Auto-detect items & text</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    card: {
        padding: 24,
        borderRadius: 16,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    manualCard: {
        backgroundColor: '#E3F2FD', // Light Blue
    },
    scanCard: {
        backgroundColor: '#E8F5E9', // Light Green
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    cardDesc: {
        fontSize: 14,
        color: '#555',
    },
});
