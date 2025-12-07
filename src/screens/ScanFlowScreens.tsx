import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, ScrollView, Alert, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useInventory } from '../context/InventoryContext';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { analyzeReceiptImage, setApiKey, ScannedItemDraft } from '../services/GeminiService';

// --- Screen 1: Camera Real ---
export const ScanCameraScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.message}>We need camera permission</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current && !isCapturing) {
            setIsCapturing(true);
            try {
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false });
                if (photo) {
                    navigation.navigate('ScanProcessing', { imageUri: photo.uri });
                }
            } catch (e) {
                console.error(e);
                Alert.alert("Error", "Failed to take picture");
            } finally {
                setIsCapturing(false);
            }
        }
    };

    return (
        <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <View style={styles.cameraOverlay}>
                    <View style={styles.viewfinderBorder} />
                    <Text style={styles.cameraText}>Align receipt within frame</Text>
                    <View style={styles.cameraControls}>
                        <TouchableOpacity
                            style={styles.shutterButton}
                            onPress={takePicture}
                            disabled={isCapturing}
                        >
                            <View style={styles.shutterInner} />
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </View>
    );
};

// --- Screen 2: Processing ---
export const ScanProcessingScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { imageUri } = route.params || {};
    const [status, setStatus] = useState("Initializing...");

    useEffect(() => {
        const processImage = async () => {
            if (!imageUri) {
                setStatus("No image captured.");
                return;
            }

            // Simple Ask for Key if needed (in a real app, store this in secure storage)
            // For now, we try; if it fails due to key, we mock or ask.
            // Assuming user might hardcode it in the file as per my note, OR we prompt specifically.
            // Let's assume for this specific step, I'll catch the error and ask for manual key entry if it fails?
            // Actually, let's just Try.

            setStatus("Generative AI analyzing receipt...");
            try {
                const items = await analyzeReceiptImage(imageUri);
                navigation.navigate('ScanReview', { items });
            } catch (error: any) {
                console.error(error);
                if (error.message.includes("API Key")) {
                    Alert.alert(
                        "Missing API Key",
                        "Please enter your Gemini API Key to use AI scanning.",
                        [
                            { text: "Cancel", style: "cancel", onPress: () => navigation.goBack() },
                            {
                                text: "Paste Key",
                                onPress: () => {
                                    Alert.prompt("API Key", "Paste your key starting with AIza...", (key) => {
                                        if (key) {
                                            setApiKey(key);
                                            processImage(); // Retry
                                        }
                                    });
                                }
                            }
                        ]
                    );
                } else {
                    Alert.alert("AI Error", "Failed to analyze image. Please try again.");
                    navigation.goBack();
                }
            }
        };

        // Give navigation a moment to settle
        const timer = setTimeout(() => {
            processImage();
        }, 500);
        return () => clearTimeout(timer);
    }, [imageUri]);

    return (
        <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.processingText}>{status}</Text>
        </View>
    );
};

// --- Screen 3: Review Drafts ---
export const ScanReviewScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { addItems } = useInventory();

    // Items passed from processing
    const initialItems = route.params?.items || [];
    const [scannedItems, setScannedItems] = useState<ScannedItemDraft[]>(initialItems);

    const handleConfirm = () => {
        const newItems = scannedItems.map(item => ({
            id: Math.random().toString(36).substr(2, 9),
            name: item.name,
            quantity: 1, // Logic to parse 'item.qty' string to number can be improved here
            expirationDate: new Date(item.expires).toISOString(),
            imageURL: 'https://via.placeholder.com/150',
        }));

        addItems(newItems);

        Alert.alert('Done', 'Items added to inventory!', [
            { text: 'OK', onPress: () => navigation.popToTop() }
        ]);
    };

    return (
        <View style={styles.reviewContainer}>
            <Text style={styles.headerTitle}>Review Drafts</Text>
            <Text style={styles.headerSubtitle}>Tap fields to edit AI suggestions</Text>

            <ScrollView contentContainerStyle={styles.list}>
                {scannedItems.map((item, index) => (
                    <View key={item.id || index} style={styles.itemRow}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Item</Text>
                            <TextInput
                                style={styles.input}
                                value={item.name}
                                onChangeText={(text) => {
                                    const newItems = [...scannedItems];
                                    newItems[index].name = text;
                                    setScannedItems(newItems);
                                }}
                            />
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Qty</Text>
                                <TextInput
                                    style={styles.input}
                                    value={item.qty}
                                    onChangeText={(text) => {
                                        const newItems = [...scannedItems];
                                        newItems[index].qty = text;
                                        setScannedItems(newItems);
                                    }}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 2 }]}>
                                <Text style={styles.label}>Expires</Text>
                                <TextInput
                                    style={styles.input}
                                    value={item.expires}
                                    onChangeText={(text) => {
                                        const newItems = [...scannedItems];
                                        newItems[index].expires = text;
                                        setScannedItems(newItems);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm All</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    // Permission
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    message: { textAlign: 'center', paddingBottom: 10, fontSize: 16 },

    // Camera
    cameraContainer: { flex: 1, backgroundColor: 'black' },
    camera: { flex: 1 },
    cameraOverlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 50 },
    viewfinderBorder: { flex: 1, width: '80%', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 20, marginVertical: 40 },
    cameraText: { color: 'white', fontSize: 18, marginBottom: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 4 },
    cameraControls: { height: 80, justifyContent: 'center', alignItems: 'center' },
    shutterButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
    shutterInner: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'black' },

    // Processing
    processingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
    processingText: { marginTop: 20, fontSize: 18, fontWeight: '600', color: '#555' },

    // Review
    reviewContainer: { flex: 1, backgroundColor: '#F9F9F9', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    headerSubtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
    list: { paddingBottom: 20 },
    itemRow: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
    row: { flexDirection: 'row' },
    inputGroup: { marginBottom: 12 },
    label: { fontSize: 12, color: '#888', marginBottom: 4, textTransform: 'uppercase' },
    input: { fontSize: 16, fontWeight: '500', color: '#333', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 4 },
    confirmButton: { backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    confirmButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
