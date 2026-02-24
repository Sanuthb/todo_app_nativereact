# FocusTask - Premium Task Management App

FocusTask is a state-of-the-art task management application built with **React Native (Expo)**, **Firebase**, and **TypeScript**. It features a stunning **Glassmorphism UI** and powerful organization tools to help you master your day with clarity.

![FocusTask Preview](https://via.placeholder.com/800x400?text=FocusTask+Premium+UI)

## ✨ Features

- **Premium Glassmorphism UI**: A modern, vibrant design with blurred backgrounds, sleek gradients, and smooth animations.
- **Secure Authentication**: User accounts powered by Firebase Auth (Log In / Sign Up).
- **Real-time Synchronization**: Your tasks are synced across devices instantly using Firebase Firestore.
- **Advanced Task Management**:
    - **Dynamic Sorting**: Tasks are automatically organized by Priority (High/Medium/Low), Deadline, and Completion status.
    - **Detailed Fields**: Set priorities, categories, and deadlines for every task.
- **Multi-View Experience**:
    - **Dashboard (Inbox)**: Quick overview of your stats and task list.
    - **Schedule**: Timeline-based view of your upcoming day.
    - **Stats**: Visual analysis of your productivity.
    - **Settings**: Personalized app controls.

## 🚀 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (Typed Routes)
- **Backend/Database**: [Firebase](https://firebase.google.com/) (Auth & Firestore)
- **Styling**: Vanilla CSS with Glassmorphism principles
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Icons**: [Ionicons](https://ionicons.com/) via `@expo/vector-icons`

## 🛠️ Getting Started

### 1. Prerequisites

- Node.js (Latest LTS)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### 2. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 3. Firebase Configuration

Create a `.env` file in the root directory and add your Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Running the App

Start the Expo development server:

```bash
npm run start
```

- Press **`a`** for Android emulator
- Press **`i`** for iOS simulator
- Press **`w`** for web browser
- Scan the QR code with **Expo Go** to run on a physical device

## 📁 Project Structure

- `app/`: Main application routes (Expo Router)
- `components/ui/`: Premium reusable UI components (TaskCard, GlassButton, etc.)
- `contexts/`: React Contexts for global state management (Auth, etc.)
- `lib/`: Configuration files and utility functions (Firebase, Tasks API)
- `assets/`: Images, fonts, and local resources

---

*Master your day with FocusTask.*
