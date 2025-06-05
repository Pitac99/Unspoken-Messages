import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/hooks/use-storage';
import { auth } from '@/lib/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Terms'>;

export default function TermsPage({ navigation }: Props) {
  const { updateSettings } = useAppData();
  const handleBack = () => {
    navigation.goBack();
  };
  const handleWithdrawConsent = () => {
    updateSettings({ onboardingCompleted: false });
    auth.logout();
    navigation.replace('Intro');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#F5F5F5" />
        </TouchableOpacity>
        <Text style={styles.title}>Terms & Conditions</Text>
      </View>

      {/* Terms Content */}
      <ScrollView style={styles.content}>
        <View style={styles.termsContainer}>
          <View style={styles.section}>
            <Text style={styles.lastUpdated}>Last updated: May 28, 2025</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Purpose of the App</Text>
            <Text style={styles.sectionText}>
              Unspoken is a digital space for writing personal, unsent messages to people in your life. 
              Its purpose is emotional release, mental clarity, and self-reflection. This app is not a 
              messaging service and messages are not transmitted to others.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Data Storage and Security</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• All messages and contact data are stored locally on your device.</Text>
              <Text style={styles.bulletPoint}>• Data is secured using encrypted local storage (e.g., Expo SecureStore).</Text>
              <Text style={styles.bulletPoint}>• We do not collect, transmit, or store any personal information, messages, or contact lists on our servers.</Text>
              <Text style={styles.bulletPoint}>• Biometric security (Face ID / Fingerprint) is optionally available for additional protection.</Text>
              <Text style={styles.bulletPoint}>• In case of app removal, phone loss, or reset, all data may be permanently lost. Backups are your responsibility.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Responsibility</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.sectionText}>As data is stored only on your device:</Text>
              <Text style={styles.bulletPoint}>• You are solely responsible for securing your device and access to the app.</Text>
              <Text style={styles.bulletPoint}>• The development team cannot be held liable for unauthorized access or loss of content caused by external factors (e.g., device theft, third-party access, or malware).</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. No Liability for Emotional Outcomes</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.sectionText}>Unspoken is a self-help tool and should not replace professional mental health support.</Text>
              <Text style={styles.sectionText}>We disclaim responsibility for:</Text>
              <Text style={styles.bulletPoint}>• Any psychological or emotional consequences of using the app.</Text>
              <Text style={styles.bulletPoint}>• Actions taken by users based on their messages or app usage.</Text>
              <Text style={styles.bulletPoint}>Please consult a licensed therapist for mental health issues.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Donations</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Donations made via platforms like BuyMeACoffee are optional.</Text>
              <Text style={styles.bulletPoint}>• These contributions support development, hosting, maintenance, and future updates.</Text>
              <Text style={styles.bulletPoint}>• Donations are processed externally and securely via third-party services.</Text>
              <Text style={styles.bulletPoint}>• No user data (e.g., messages or identities) is shared with or linked to donations.</Text>
              <Text style={styles.bulletPoint}>• Donations are non-refundable.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Age Requirement</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• By using this app, you confirm that you are at least 13 years old (or the minimum legal age required in your jurisdiction).</Text>
              <Text style={styles.bulletPoint}>• If you are under 18, parental consent is recommended for use of emotional support tools.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
            <Text style={styles.sectionText}>
              All visual elements, design, and app logic are the property of the Unspoken development team. 
              You may not copy, redistribute, or alter any part of the app without written permission.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Updates and Changes</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>We reserve the right to modify these Terms and Conditions at any time.</Text>
              <Text style={styles.bulletPoint}>Changes will be announced through the app, and the "Last updated" date will be revised accordingly.</Text>
              <Text style={styles.bulletPoint}>Continued use of the app implies acceptance of any new terms.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Contact</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.sectionText}>For questions, feedback, or support:</Text>
              <Text style={styles.bulletPoint}>• Use the contact form or support feature available within the app.</Text>
              <Text style={styles.bulletPoint}>• For donation-related queries, refer to the respective donation platform.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Anonymous Usage Tracking</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.sectionText}>In order to better understand overall usage and improve the app, Unspoken tracks the total number of messages written across all users.</Text>
              <Text style={styles.bulletPoint}>• No content of the messages is collected.</Text>
              <Text style={styles.bulletPoint}>• No personal information, identifiers, or device data is tracked.</Text>
              <Text style={styles.bulletPoint}>• Only the numeric count of messages is incremented anonymously and stored in a secure backend.</Text>
              <Text style={styles.bulletPoint}>• By using the app, you consent to this non-invasive and privacy-respecting tracking.</Text>
            </View>
          </View>

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              By using Unspoken, you confirm that you have read, understood, and agree to these Terms and Conditions.
            </Text>
          </View>

          <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdrawConsent}>
            <Ionicons name="alert-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.withdrawButtonText}>Withdraw Consent</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D2D2D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  termsContainer: {
    backgroundColor: '#2D2D2D',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D49A6A',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#D1D1D1',
    lineHeight: 20,
  },
  bulletPoints: {
    marginTop: 4,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#D1D1D1',
    lineHeight: 20,
    marginBottom: 4,
  },
  disclaimer: {
    backgroundColor: '#383838',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 154, 106, 0.2)',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D49A6A',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 12,
  },
  withdrawButtonText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: '600',
  },
});
