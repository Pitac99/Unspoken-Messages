import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import 'react-native-get-random-values';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { Keyboard } from 'react-native';

// Import all pages
import IntroPage from "@/pages/intro";
import OnboardingPage from "@/pages/onboarding";
import PinSetupPage from "@/pages/pin-setup";
import PinAuthPage from "@/pages/pin-auth";
import HomePage from "@/pages/home";
import ContactSelectionPage from "@/pages/contact-selection";
import ChatPage from "@/pages/chat";
import SettingsPage from "@/pages/settings";
import TermsPage from "@/pages/terms";
import NotFound from "@/pages/not-found";

// Import storage and auth
import { storage } from "./lib/storage";
import { auth } from "./lib/auth";
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1E1E1E' }
      }}
    >
      <Stack.Screen name="Intro" component={IntroPage} />
      <Stack.Screen name="Onboarding" component={OnboardingPage} />
      <Stack.Screen name="PinSetup" component={PinSetupPage} />
      <Stack.Screen name="PinAuth" component={PinAuthPage} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="ContactSelection" component={ContactSelectionPage} />
      <Stack.Screen name="Chat" component={ChatPage} />
      <Stack.Screen name="Settings" component={SettingsPage} />
      <Stack.Screen name="Terms" component={TermsPage} />
    </Stack.Navigator>
  );
}

// Set Android navigation bar color as early as possible
if (Platform.OS === 'android') {
  SystemUI.setBackgroundColorAsync('#232323');
}

function App() {
  // Track keyboard visibility for Android
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Initialize app data if it doesn't exist
      const appData = await storage.getAppData();
      // If you have an initializeAppData method, call it here
      // await storage.initializeAppData();
      // Or set default data as needed

      // Check authentication status and redirect accordingly
      if (appData?.settings.onboardingCompleted) {
        if (await auth.isAuthenticated()) {
          // Use navigation instead of window.location
          // This will be implemented with proper navigation
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
      const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: '#1E1E1E',
              paddingBottom:
                Platform.OS === 'android'
                  ? (keyboardVisible ? 0 : 25)
                  : 25,
            }}
            edges={['bottom', 'left', 'right']}
          >
            <AppNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
