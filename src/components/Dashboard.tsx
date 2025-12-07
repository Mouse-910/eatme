import React, { useMemo } from 'react';
import { View, SectionList, StyleSheet, SafeAreaView, StatusBar, Text } from 'react-native';
import { categorizeInventory, BucketSection } from '../utils/inventoryLogic'; // Removed InventoryItem import as it is inferred
import { InventoryItemRow } from './InventoryItemRow';
import { BucketHeader } from './BucketHeader';
import { useInventory } from '../context/InventoryContext';

export const Dashboard: React.FC = () => {
    // Use data from Context
    const { items } = useInventory();

    const sections = useMemo(() => categorizeInventory(items), [items]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Refrigerator Inventory</Text>
            </View>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item, section }) => (
                    <InventoryItemRow item={item} bucketType={(section as unknown as BucketSection).type} />
                )}
                renderSectionHeader={({ section: { title, type } }) => (
                    <BucketHeader title={title} type={type} />
                )}
                stickySectionHeadersEnabled={true}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No items. Add some!</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 24,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#888',
        marginTop: 20,
    },
});
