import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useInventory } from '../context/InventoryContext';

export const ManualAddScreen: React.FC = () => {
    const navigation = useNavigation();
    const { addItem } = useInventory();

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [expirationDate, setExpirationDate] = useState<Date | null>(null);

    const adjustQty = (amount: number) => {
        setQuantity(Math.max(1, quantity + amount));
    };

    const setSmartDate = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        setExpirationDate(date);
    };

    const handleSave = () => {
        if (!name || !expirationDate) {
            Alert.alert('Missing Info', 'Please enter a name and expiration date.');
            return;
        }

        addItem({
            id: Math.random().toString(36).substr(2, 9),
            name,
            quantity,
            expirationDate: expirationDate.toISOString(),
            imageURL: 'https://via.placeholder.com/150', // Default image for manual entry
        });

        Alert.alert('Success', `Added ${quantity}x ${name}`, [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Name Input */}
                <View style={styles.section}>
                    <Text style={styles.label}>Item Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Cheddar Cheese"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />
                </View>

                {/* Quantity Stepper */}
                <View style={styles.section}>
                    <Text style={styles.label}>Quantity</Text>
                    <View style={styles.stepperContainer}>
                        <TouchableOpacity onPress={() => adjustQty(-1)} style={styles.stepperButton}>
                            <Text style={styles.stepperText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{quantity}</Text>
                        <TouchableOpacity onPress={() => adjustQty(1)} style={styles.stepperButton}>
                            <Text style={styles.stepperText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Expiration Smart Buttons */}
                <View style={styles.section}>
                    <Text style={styles.label}>Expires</Text>
                    {expirationDate && (
                        <Text style={styles.dateDisplay}>
                            {expirationDate.toLocaleDateString()}
                        </Text>
                    )}
                    <View style={styles.smartButtonsRow}>
                        <TouchableOpacity style={styles.smartButton} onPress={() => setSmartDate(3)}>
                            <Text style={styles.smartButtonText}>+3 Days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smartButton} onPress={() => setSmartDate(7)}>
                            <Text style={styles.smartButtonText}>+1 Week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smartButton} onPress={() => setSmartDate(14)}>
                            <Text style={styles.smartButtonText}>+2 Weeks</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
                    <Text style={styles.confirmButtonText}>Add to Fridge</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    input: {
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingVertical: 8,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepperButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepperText: {
        fontSize: 24,
        color: '#333',
        fontWeight: 'bold',
    },
    qtyValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 24,
        minWidth: 40,
        textAlign: 'center',
    },
    dateDisplay: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    smartButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smartButton: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 8,
        alignItems: 'center',
    },
    smartButtonText: {
        color: '#2E7D32',
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        backgroundColor: '#FFF',
    },
    confirmButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
