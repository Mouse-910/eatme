# EatMe: Smart Refrigerator Inventory 🍎

EatMe is a mobile application designed to help you manage your refrigerator inventory with a "Traffic Light" system, ensuring you eat food before it expires. It features AI-powered receipt scanning to quickly add items.

## ✨ Features

- **🚦 Traffic Light Dashboard**:
  - **Red (Urgent)**: Expires in < 72 hours.
  - **Yellow (Soon)**: Expires in 3-7 days.
  - **Green (Safe)**: Expires in > 7 days.
  
- **🤖 Artificial Intelligence**:
  - **Receipt Scanning**: Snap a photo of a receipt or food items.
  - **Gemini Integration**: Powered by Google's Gemini 1.5 Flash model to automatically extract item names, quantities, and estimate expiration dates.

- **➕ Flexible Input**:
  - **Smart Manual Entry**: Quick-add items with "+3 Days" or "+1 Week" smart buttons.
  - **Camera Scan**: Uses the real device camera.

- **❄️ Custom Design**:
  - Clean, modern UI.
  - Custom generated App Icon.

## 📱 Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **AI**: Google Generative AI SDK (`@google/generative-ai`)
- **Camera**: `expo-camera`
- **Navigation**: `react-navigation`

## 🚀 How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the App**:
    ```bash
    npx expo start
    ```

3.  **Run on Device**:
    - Download **Expo Go** on Android/iOS.
    - Scan the QR code from the terminal.

## 📦 Building the APK (Android)

To install the standalone app (required to see the custom app icon):

1.  Install EAS CLI: `npm install -g eas-cli`
2.  Login: `npx eas-cli login`
3.  Build:
    ```bash
    npx eas-cli build -p android --profile development
    ```
4.  Download and install the APK from the link provided.

## 🔑 API Key

The app requires a **Google Gemini API Key** for the scanning feature.
- On the first valid scan attempt, the app will prompt you to paste your API Key.
- You can get a key from [Google AI Studio](https://aistudio.google.com/).
