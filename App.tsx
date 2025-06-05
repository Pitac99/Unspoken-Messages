import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Text } from 'react-native';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './client/src/lib/queryClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

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

// Storage
import { storage } from './client/src/lib/storage';
import { RootStackParamList } from './client/src/types/navigation';

// Pastreaza splash screen activ
SplashScreen.preventAutoHideAsync();
enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        const logoAsset = Asset.fromModule(require('./assets/logo_portocaliu.png'));
        await logoAsset.downloadAsync();

        const data = await storage.getAppData();
        // Decide initial route based on PIN presence
        if (!data?.settings?.pinHash) {
          setInitialRoute('PinSetup');
        } else {
          setInitialRoute('PinAuth');
        }

        await SplashScreen.hideAsync();
        setIsReady(true);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load assets'));
      }
    }

    prepare();
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
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <View style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
            <Stack.Navigator
              initialRouteName={initialRoute as any}
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#1E1E1E' },
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
          </View>
        </NavigationContainer>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
