import React, { createContext, useState, useContext, ReactNode } from 'react';
import { InventoryItem } from '../utils/inventoryLogic';

// Initial Dummy Data
const generateDummyData = (): InventoryItem[] => {
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    return [
        {
            id: '1',
            name: 'Milk',
            imageURL: 'https://via.placeholder.com/150',
            quantity: 1,
            expirationDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: '2',
            name: 'Leftover Pizza',
            imageURL: 'https://via.placeholder.com/150',
            quantity: 3,
            expirationDate: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: '3',
            name: 'Yogurt',
            imageURL: 'https://via.placeholder.com/150',
            quantity: 2,
            expirationDate: new Date(now.getTime() + 4 * dayMs).toISOString(),
        },
        {
            id: '99',
            name: 'Old Salad',
            imageURL: 'https://via.placeholder.com/150',
            quantity: 1,
            expirationDate: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // Expired
        },
    ];
};

interface InventoryContextType {
    items: InventoryItem[];
    addItem: (item: InventoryItem) => void;
    addItems: (items: InventoryItem[]) => void;
    deleteItem: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<InventoryItem[]>(generateDummyData());

    const addItem = (item: InventoryItem) => {
        setItems((prev) => [...prev, item]);
    };

    const addItems = (newItems: InventoryItem[]) => {
        setItems((prev) => [...prev, ...newItems]);
    };

    const deleteItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <InventoryContext.Provider value={{ items, addItem, addItems, deleteItem }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};
