import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '@/lib/storage';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    try {
      // Check if user has completed onboarding
      const appData = await storage.getAppData();
      const hasPin = await storage.getPin();
      
      if (!appData || !hasPin) {
        // First time user - go to intro
        router.replace('/intro');
      } else {
        // Returning user - go to PIN authentication
        router.replace('/pin-auth');
      }
    } catch (error) {
      console.error('Failed to check initial route:', error);
      router.replace('/intro');
    }
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#1E1E1E', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <ActivityIndicator size="large" color="#D49A6A" />
      <Text style={{ 
        color: '#F5F5F5', 
        fontSize: 18, 
        fontWeight: '600', 
        marginTop: 20 
      }}>
        Unspoken
      </Text>
    </View>
  );
}