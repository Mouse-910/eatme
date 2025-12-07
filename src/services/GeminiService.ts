import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from 'expo-file-system/legacy';

// TODO: Replace with your actual API Key or use a secure way to fetch it (e.g. backend proxy)
// For this demo, we'll strip it or expect it passed in, but hardcoding for user convenience if they edit it.
// Key is now hidden. The app will prompt for it at runtime.
let API_KEY = "";

export const setApiKey = (key: string) => {
    API_KEY = key;
};

export interface ScannedItemDraft {
    id: string;
    name: string;
    qty: string;
    expires: string; // YYYY-MM-DD
}

export const analyzeReceiptImage = async (imageUri: string): Promise<ScannedItemDraft[]> => {
    if (!API_KEY) {
        throw new Error("API Key not set. Please provide a Gemini API Key.");
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // Using flash for faster receipt scanning
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Read file as base64
        const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });

        const prompt = `
        Analyze this refrigerator receipt or food photo. 
        Extract a list of distinct food items.
        For each item, identify:
        1. Name (concise, e.g. "Cheddar Cheese")
        2. Quantity (e.g. "1 block", "200g", "x2")
        3. Expiration Date: ESTIMATE a conservative expiration date based on the food type assuming bought today. Format YYYY-MM-DD.
        
        Return ONLY a raw JSON array of objects with keys: name, qty, expires.
        Do not include markdown code fences or other text.
        `;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        const text = response.text();

        // Cleanup potential markdown fences if the model ignores instruction
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const json = JSON.parse(cleanText);

        // Add random IDs
        return json.map((item: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: item.name || "Unknown Item",
            qty: item.qty || "1",
            expires: item.expires || new Date().toISOString().split('T')[0]
        }));

    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw error;
    }
};
