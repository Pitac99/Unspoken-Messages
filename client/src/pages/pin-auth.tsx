import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { Keypad } from "@/components/keypad";
import { PinDots } from "@/components/pin-dots";
import { auth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from "@/context/ThemeContext";

type Props = NativeStackScreenProps<RootStackParamList, 'PinAuth'>;

export default function PinAuthPage({ navigation }: Props) {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState("Enter PIN");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleNumberPress = async (number: string) => {
    if (pin.length < 4 && !isProcessing) {
      const newPin = pin + number;
      setPin(newPin);

      if (newPin.length === 4) {
        await validatePin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isProcessing) {
      setPin(pin.slice(0, -1));
      if (status !== "Enter PIN") {
        setStatus("Enter PIN");
      }
    }
  };

  const validatePin = async (pinToValidate: string) => {
    setIsProcessing(true);
    setStatus("Verifying...");

    try {
      const isValid = await auth.authenticate(pinToValidate);
      
      if (isValid) {
        setStatus("Access granted");
        setTimeout(() => navigation.replace('Home'), 500);
      } else {
        setStatus("Incorrect PIN");
        setPin("");
        toast({
          title: "Authentication Failed",
          description: "Please check your PIN and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setStatus("Authentication error");
      setPin("");
      toast({
        title: "Error",
        description: "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBiometric = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setStatus("Authenticating...");

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        throw new Error('Biometric authentication not available');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Unspoken',
        fallbackLabel: 'Use PIN instead',
      });

      if (result.success) {
        setStatus("Access granted");
        setTimeout(() => navigation.replace('Home'), 500);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error("Biometric error:", error);
      setStatus("Biometric authentication failed");
      toast({
        title: "Biometric Failed",
        description: "Please use your PIN instead.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
          showBiometric={false}
          disabled={isProcessing}
          buttonTextStyle={{ fontSize: 32 }}
        />
      </View>

      {/* Biometric Button */}
      <TouchableOpacity
        style={styles.biometricButton}
        onPress={handleBiometric}
        disabled={isProcessing}
        activeOpacity={0.7}
      >
        <Ionicons name="finger-print" size={28} color="#D49A6A" style={{ marginRight: 8 }} />
        <Text style={styles.biometricText}>Enable biometric authentication</Text>
      </TouchableOpacity>
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
      color: '#F5F5F5',
      textAlign: 'center',
      marginBottom: 4,
    },
    subheading: {
      color: '#A0A0A0',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 24,
    },
    pinContainer: {
      alignItems: 'center',
      marginBottom: 48,
    },
    status: {
      marginTop: 24,
      fontSize: 14,
      color: '#A0A0A0',
    },
    processingStatus: {
      color: '#D49A6A',
    },
    biometricButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: '#232323',
    },
    biometricText: {
      color: '#D49A6A',
      fontSize: 16,
      fontWeight: '500',
    },
  });
}
