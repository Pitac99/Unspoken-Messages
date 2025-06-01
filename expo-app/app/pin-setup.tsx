import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Keypad } from '@/components/Keypad';
import { PinDots } from '@/components/PinDots';
import { storage } from '@/lib/storage';

export default function PinSetupScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleNumberPress = (number: string) => {
    if (isConfirming) {
      if (confirmPin.length < 4) {
        const newConfirmPin = confirmPin + number;
        setConfirmPin(newConfirmPin);
        
        if (newConfirmPin.length === 4) {
          verifyPins(pin, newConfirmPin);
        }
      }
    } else {
      if (pin.length < 4) {
        const newPin = pin + number;
        setPin(newPin);
        
        if (newPin.length === 4) {
          setIsConfirming(true);
        }
      }
    }
  };

  const handleDelete = () => {
    if (isConfirming) {
      setConfirmPin(prev => prev.slice(0, -1));
    } else {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const verifyPins = async (originalPin: string, confirmedPin: string) => {
    if (originalPin === confirmedPin) {
      try {
        await storage.setPin(originalPin);
        const initialData = storage.initializeAppData();
        await storage.setAppData(initialData);
        router.replace('/home');
      } catch (error) {
        Alert.alert('Error', 'Failed to save PIN. Please try again.');
        resetPins();
      }
    } else {
      Alert.alert('PIN Mismatch', 'The PINs do not match. Please try again.');
      resetPins();
    }
  };

  const resetPins = () => {
    setPin('');
    setConfirmPin('');
    setIsConfirming(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isConfirming ? 'Confirm Your PIN' : 'Create Your PIN'}
          </Text>
          <Text style={styles.subtitle}>
            {isConfirming 
              ? 'Enter your PIN again to confirm'
              : 'Choose a 4-digit PIN to secure your messages'
            }
          </Text>
        </View>

        <View style={styles.pinContainer}>
          <PinDots 
            length={4} 
            filled={isConfirming ? confirmPin.length : pin.length} 
          />
        </View>

        <View style={styles.keypadContainer}>
          <Keypad
            onNumberPress={handleNumberPress}
            onDelete={handleDelete}
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
  keypadContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
});