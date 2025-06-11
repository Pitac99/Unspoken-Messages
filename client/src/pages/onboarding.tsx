import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import logoPath from "@assets/logo_portocaliu.png";
import { useTheme } from "@/context/ThemeContext";

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingPage({ navigation }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleContinue = () => {
    navigation.navigate('PinSetup');
  };

  const steps = [
    {
      title: "Private & Safe",
      description: "Your messages stay on your device, fully encrypted. No cloud, no accounts — just your words, safe with you.",
      delay: "0s"
    },
    {
      title: "Write It Anyway",
      description: "Angry at your boss? Missing someone who’s gone? Here, you can “send” those messages without actually sending them — and finally let them out.",
      delay: "0.1s"
    },
    {
      title: "Let It Out, Then Let It Go",
      description: "Each message becomes a step forward — not shared, but truly felt. A quiet moment of honesty, just for your own peace.",
      delay: "0.2s"
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={logoPath}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Welcome to Unspoken</Text>
        <Text style={styles.subtitle}>Let’s show you how it works — this space is just for you</Text>
      </View>

      {/* Onboarding Steps */}
      <ScrollView style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepCard}>
            <View style={styles.stepContent}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleContinue}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Set Up Security PIN</Text>
        </TouchableOpacity>
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
    header: {
      alignItems: 'center',
      marginBottom: 32,
      paddingTop: 32,
    },
    logoContainer: {
      width: 80,
      height: 80,
      marginBottom: 16,
    },
    logo: {
      width: '100%',
      height: '100%',
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      marginBottom: 8,
    },
    subtitle: {
      color: theme === "dark" ? '#A0A0A0' : '#555',
      fontSize: 16,
    },
    stepsContainer: {
      flex: 1,
    },
    stepCard: {
      backgroundColor: theme === "dark" ? '#2D2D2D' : '#F5F5F5',
      borderRadius: 16,
      padding: 24,
      marginBottom: 32,
    },
    stepContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 16,
    },
    stepNumber: {
      width: 48,
      height: 48,
      backgroundColor: '#D49A6A',
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNumberText: {
      color: '#1E1E1E',
      fontSize: 18,
      fontWeight: '600',
    },
    stepTextContainer: {
      flex: 1,
    },
    stepTitle: {
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
    },
    stepDescription: {
      color: theme === "dark" ? '#A0A0A0' : '#555',
      fontSize: 14,
      lineHeight: 20,
    },
    buttonContainer: {
      paddingTop: 32,
    },
    button: {
      backgroundColor: '#D49A6A',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      alignItems: 'center',
    },
    buttonText: {
      color: '#1E1E1E',
      fontSize: 16,
      fontWeight: '500',
    },
  });
}
