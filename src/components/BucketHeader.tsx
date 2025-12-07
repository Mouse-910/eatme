import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BucketType } from '../utils/inventoryLogic';

interface Props {
    title: string;
    type: BucketType;
}

export const BucketHeader: React.FC<Props> = ({ title, type }) => {
    const getBackgroundColor = () => {
        switch (type) {
            case 'Red': return '#D32F2F';
            case 'Yellow': return '#FBC02D';
            case 'Green': return '#388E3C';
            default: return '#9E9E9E';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
            <Text style={[styles.title, type === 'Yellow' ? styles.darkText : styles.lightText]}>
                {title}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 0,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    lightText: {
        color: '#FFFFFF',
    },
    darkText: {
        color: '#333333',
    },
});
