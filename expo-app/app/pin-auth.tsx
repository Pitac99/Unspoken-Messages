import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Keypad } from '@/components/Keypad';
import { PinDots } from '@/components/PinDots';
import { storage } from '@/lib/storage';

export default function PinAuthScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [canUseBiometric, setCanUseBiometric] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setCanUseBiometric(hasHardware && isEnrolled);
  };

  const handleNumberPress = (number: string) => {
    if (pin.length < 4) {
      const newPin = pin + number;
      setPin(newPin);
      
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const verifyPin = async (enteredPin: string) => {
    try {
      const isValid = await storage.verifyPin(enteredPin);
      
      if (isValid) {
        router.replace('/home');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setPin('');
        
        if (newAttempts >= 3) {
          Alert.alert(
            'Too Many Attempts',
            'Please try again later or use biometric authentication.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Incorrect PIN',
            `Please try again. ${3 - newAttempts} attempts remaining.`,
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify PIN. Please try again.');
      setPin('');
    }
  };

  const handleBiometric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your messages',
        fallbackLabel: 'Use PIN',
      });
      
      if (result.success) {
        router.replace('/home');
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>U</Text>
            </View>
          </View>
          
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Enter your PIN to access your private messages
          </Text>
        </View>

        <View style={styles.pinContainer}>
          <PinDots length={4} filled={pin.length} />
          
          {attempts > 0 && (
            <Text style={styles.errorText}>
              {3 - attempts} attempts remaining
            </Text>
          )}
        </View>

        <View style={styles.keypadContainer}>
          <Keypad
            onNumberPress={handleNumberPress}
            onDelete={handleDelete}
            onBiometric={canUseBiometric ? handleBiometric : undefined}
            showBiometric={canUseBiometric}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 60,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D49A6A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F5F5F5',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
  },
  pinContainer: {
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 16,
  },
  keypadContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
});