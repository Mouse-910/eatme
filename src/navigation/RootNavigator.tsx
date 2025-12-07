import { createStackNavigator } from '@react-navigation/stack';
import { Dashboard } from '../components/Dashboard';
import { AddItemChoiceScreen } from '../screens/AddItemChoiceScreen';
import { ManualAddScreen } from '../screens/ManualAddScreen';
import { ScanCameraScreen, ScanProcessingScreen, ScanReviewScreen } from '../screens/ScanFlowScreens';
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

export const RootNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Dashboard">
            <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={({ navigation }) => ({
                    title: 'My Fridge',
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('AddItemChoice')}
                            style={{ marginRight: 16 }}
                        >
                            <Text style={{ fontSize: 16, color: '#007AFF', fontWeight: 'bold' }}>+ Add</Text>
                        </TouchableOpacity>
                    )
                })}
            />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="AddItemChoice" component={AddItemChoiceScreen} options={{ title: 'Add New Item' }} />
                <Stack.Screen name="ManualAdd" component={ManualAddScreen} options={{ title: 'Manual Entry' }} />
                <Stack.Screen name="ScanCamera" component={ScanCameraScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ScanProcessing" component={ScanProcessingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ScanReview" component={ScanReviewScreen} options={{ title: 'Verify Items', headerLeft: () => null }} />
            </Stack.Group>
        </Stack.Navigator>
    );
};
