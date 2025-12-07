import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { InventoryItem, BucketType } from '../utils/inventoryLogic';
import { Ionicons } from '@expo/vector-icons';
import { useInventory } from '../context/InventoryContext';

interface Props {
    item: InventoryItem;
    bucketType: BucketType;
}

export const InventoryItemRow: React.FC<Props> = ({ item, bucketType }) => {
    const { deleteItem } = useInventory();
    const isUrgent = bucketType === 'Red';

    const handleDelete = () => {
        Alert.alert(
            'Consume Item',
            `Mark ${item.name} as consumed?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Consume', onPress: () => deleteItem(item.id) }
            ]
        );
    };

    return (
        <View style={[styles.container, isUrgent && styles.urgentContainer]}>
            <Image source={{ uri: item.imageURL }} style={[styles.image, isUrgent && styles.urgentImage]} />
            <View style={styles.infoContainer}>
                <Text style={[styles.name, isUrgent && styles.urgentName]}>{item.name}</Text>
                <Text style={styles.details}>
                    Qty: {item.quantity} • Expires: {new Date(item.expirationDate).toLocaleDateString()}
                </Text>
            </View>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="restaurant-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        alignItems: 'center',
    },
    urgentContainer: {
        backgroundColor: '#FFEBEE', // Light Red background for urgent items
        paddingVertical: 16, // Slightly larger touch area/visual weight
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    urgentImage: {
        width: 60,
        height: 60, // Larger image for urgent items
        borderWidth: 2,
        borderColor: '#D32F2F',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    urgentName: {
        fontSize: 18, // Larger font for emphasis
        color: '#D32F2F',
        fontWeight: 'bold',
    },
    details: {
        fontSize: 14,
        color: '#757575',
    },
    deleteButton: {
        padding: 8,
    },
});
