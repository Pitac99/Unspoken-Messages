import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Text, Platform, Keyboard } from 'react-native';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './client/src/lib/queryClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as SystemUI from 'expo-system-ui';
import { ThemeProvider, useTheme } from './client/src/context/ThemeContext';


// Pagini
import IntroPage from './client/src/pages/intro';
import OnboardingPage from './client/src/pages/onboarding';
import PinSetupPage from './client/src/pages/pin-setup';
import PinAuthPage from './client/src/pages/pin-auth';
import HomePage from './client/src/pages/home';
import ContactSelectionPage from './client/src/pages/contact-selection';
import ChatPage from './client/src/pages/chat';
import SettingsPage from './client/src/pages/settings';
import TermsPage from './client/src/pages/terms';
import NotFound from './client/src/pages/not-found';

// Storage
import { storage } from './client/src/lib/storage';
import { auth } from './client/src/lib/auth';
import { RootStackParamList } from './client/src/types/navigation';

// Pastreaza splash screen activ
SplashScreen.preventAutoHideAsync();
enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();


function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' }
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

if (Platform.OS === 'android') {
  SystemUI.setBackgroundColorAsync('#232323');
}

function AppWithTheme() {
  const { theme } = useTheme();
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: theme === "dark" ? '#1E1E1E' : '#FFFFFF',
            }}
            edges={['left', 'right']}
          >
            <AppNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const logoAsset = Asset.fromModule(require('./assets/logo_portocaliu.png'));
        await logoAsset.downloadAsync();

        const data = await storage.getAppData();

        // 1. Show onboarding/terms if not completed
        if (!data?.settings?.onboardingCompleted) {
          setInitialRoute('Onboarding');
        }
        // 2. Show PIN setup if no PIN
        else if (!data?.settings?.pinHash) {
          setInitialRoute('PinSetup');
        }
        // 3. Show PIN auth if not authenticated
        else if (!(await auth.isAuthenticated())) {
          setInitialRoute('PinAuth');
        }
        // 4. Otherwise, go to Home
        else {
          setInitialRoute('Home');
        }

        await SplashScreen.hideAsync();
        setIsReady(true);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load assets'));
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const init = async () => {
      const appData = await storage.getAppData();
      if (appData?.settings.onboardingCompleted) {
        if (await auth.isAuthenticated()) {
          // Navigation logic here
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

  if (!isReady || !initialRoute) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E1E1E' }}>
        <ActivityIndicator size="large" color="#FF5733" />
        <Text style={{ color: '#FFFFFF', marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E1E1E' }}>
        <Text style={{ color: '#FFFFFF' }}>Error loading app: {error.message}</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}
