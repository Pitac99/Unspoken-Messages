import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Keypad } from "@/components/keypad";
import { PinDots } from "@/components/pin-dots";
import { auth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@/context/ThemeContext";

type Props = NativeStackScreenProps<RootStackParamList, 'PinSetup'>;

export default function PinSetupPage({ navigation }: Props) {
  const [pin, setPin] = useState("");
  const [confirmedPin, setConfirmedPin] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [status, setStatus] = useState("Enter your PIN");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleNumberPress = async (number: string) => {
    if (pin.length < 4 && !isProcessing) {
      const newPin = pin + number;
      setPin(newPin);

      if (newPin.length === 4) {
        if (!isConfirming) {
          // First PIN entry
          setConfirmedPin(newPin);
          setPin("");
          setIsConfirming(true);
          setStatus("Confirm your PIN");
        } else {
          // Confirmation
          if (newPin === confirmedPin) {
            setIsProcessing(true);
            setStatus("Setting up your PIN...");
            
            try {
              await auth.setPin(newPin);
              setStatus("PIN set successfully!");
              toast({
                title: "PIN Setup Complete",
                description: "Your PIN has been set successfully.",
              });
              setTimeout(() => navigation.navigate('PinAuth'), 1000);
            } catch (error) {
              console.error('Error setting PIN:', error);
              setStatus("Failed to save PIN. Try again.");
              toast({
                title: "Error",
                description: "Failed to set up PIN. Please try again.",
                variant: "destructive",
              });
              resetPin();
            } finally {
              setIsProcessing(false);
            }
          } else {
            setStatus("PINs do not match. Try again.");
            resetPin();
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isProcessing) {
      setPin(pin.slice(0, -1));
      if (status !== "Enter your PIN" && status !== "Confirm your PIN") {
        setStatus(isConfirming ? "Confirm your PIN" : "Enter your PIN");
      }
    }
  };

  const resetPin = () => {
    setPin("");
    setConfirmedPin("");
    setIsConfirming(false);
    setStatus("Enter your PIN");
  };

  const handleBiometric = () => {
    setBiometricEnabled(!biometricEnabled);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Ionicons name="lock-closed" size={32} color="#1E1E1E" />
        </View>
      </View>

      {/* Heading and Subheading */}
      <View style={{ marginBottom: 24 }}>
        <Text style={styles.heading}>Create your PIN</Text>
        <Text style={styles.subheading}>Choose a 4-digit code to secure your app</Text>
      </View>

      {/* PIN Dots and Status */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <PinDots length={4} filled={pin.length} />
        <Text style={[styles.status, isProcessing && styles.processingStatus, { marginTop: 20 }]}> 
          {status}
        </Text>
      </View>

      {/* Keypad */}
      <View style={{ marginBottom: 24 }}>
        <Keypad
          onNumberPress={handleNumberPress}
          onDelete={handleDelete}
          onBiometric={handleBiometric}
          showBiometric={true}
          disabled={isProcessing}
        />
      </View>

      {/* Biometric Option */}
      <View style={styles.biometricContainer}>
        <View style={styles.biometricRow}>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: '#767577', true: '#D49A6A' }}
            thumbColor={biometricEnabled ? '#f4f3f4' : '#f4f3f4'}
            disabled={isProcessing}
          />
          <Text style={styles.biometricText}>
            Enable biometric authentication
          </Text>
        </View>
      </View>
    </View>
  );
}

function getStyles(theme: "light" | "dark") {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? '#1E1E1E' : '#FFFFFF',
      padding: 24,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 48,
      paddingTop: 80,
    },
    logoWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#D49A6A',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
    },
    heading: {
      fontSize: 22,
      fontWeight: '700',
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      textAlign: 'center',
      marginBottom: 4,
    },
    subheading: {
      color: theme === "dark" ? '#A0A0A0' : '#555',
      fontSize: 16,
      textAlign: 'center',
    },
    pinDisplay: {
      alignItems: 'center',
      marginBottom: 8,
    },
    pinDots: {
      marginBottom: 0,
    },
    status: {
      fontSize: 14,
      color: theme === "dark" ? '#A0A0A0' : '#555',
      textAlign: 'center',
    },
    statusSpacing: {
      marginBottom: 24,
    },
    processingStatus: {
      color: '#D49A6A',
    },
    keypadContainer: {
      justifyContent: 'center',
      marginBottom: 24,
    },
    biometricContainer: {
      paddingTop: 0,
      marginBottom: 0,
    },
    biometricRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    biometricText: {
      fontSize: 14,
      color: theme === "dark" ? '#A0A0A0' : '#555',
    },
  });
}
