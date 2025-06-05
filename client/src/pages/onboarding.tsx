import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import logoPath from "@assets/logo_portocaliu.png";

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingPage({ navigation }: Props) {
  const handleContinue = () => {
    navigation.navigate('PinSetup');
  };

  const steps = [
    {
      title: "Private & Secure",
      description: "Your messages are encrypted locally and never leave your device. Complete privacy guaranteed.",
      delay: "0s"
    },
    {
      title: "Therapeutic Writing",
      description: "Write messages to symbolic contacts - express emotions without expecting responses.",
      delay: "0.1s"
    },
    {
      title: "Emotional Processing",
      description: "Track your mental health journey through organized conversations and insights.",
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
        <Text style={styles.title}>Welcome to Your Safe Space</Text>
        <Text style={styles.subtitle}>Let's set up your therapeutic journey</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
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
    color: '#F5F5F5',
    marginBottom: 8,
  },
  subtitle: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  stepsContainer: {
    flex: 1,
  },
  stepCard: {
    backgroundColor: '#2D2D2D',
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
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  stepDescription: {
    color: '#A0A0A0',
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
