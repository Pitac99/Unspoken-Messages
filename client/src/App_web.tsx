import React, { useEffect, useState } from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import 'react-native-get-random-values';
import { Keyboard } from 'react-native';
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme === 'dark' ? '#FFFFFF' : '#FFFFFF', paddingBottom: 0 }
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

function AppWrapper() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  return (
    <View style={{
      flex: 1,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      borderWidth: 4,
      borderColor: 'red',
    }}>
      <AppNavigator />
    </View>
  );
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
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ThemeProvider>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <AppWrapper />
            </NavigationContainer>
          </QueryClientProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
