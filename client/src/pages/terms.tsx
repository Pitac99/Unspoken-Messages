import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput, Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/hooks/use-storage';
import { auth } from '@/lib/auth';
import { useTheme } from "@/context/ThemeContext";
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Terms'>;

export default function TermsPage({ navigation, route }: Props) {
  const { updateSettings } = useAppData();
  const { theme } = useTheme();
  const { toast } = useToast();
  const styles = getStyles(theme);
  const fromSettings = route.params?.fromSettings ?? false;

  
  // Add PIN modal state
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleWithdrawConsent = () => {
    setPinInput("");
    setPinError("");
    setPinModalVisible(true);
  };

  const handlePinSubmit = async () => {
    setIsProcessing(true);
    setPinError("");
  
    try {
      const isValid = await auth.authenticate(pinInput);
      if (isValid) {
        setPinModalVisible(false);
  
        // ✅ Resetam doar setarile, pastram restul datelor intacte
        await storage.setTermsAccepted(false);
        await storage.resetAppSettings(); // inlocuieste updateSettings + logout
  
        navigation.replace("Intro");
      } else {
        setPinError("Incorrect PIN. Please try again.");
      }
    } catch (error) {
      setPinError("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
      <Text style={styles.lastUpdated}>Last updated: May 28, 2025</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Purpose of the App</Text>
        <Text style={styles.sectionText}>
          Unspoken is a digital space for writing personal, unsent messages to people in your life.
          Its purpose is emotional release, mental clarity, and self-reflection. This app is not a
          messaging service and messages are not transmitted to others.
        </Text>
        <Text style={styles.sectionText}>
          ⚠️ Unspoken is not a replacement for therapy or professional mental health services.
          If you are experiencing emotional distress or need support, we strongly encourage seeking help from a licensed therapist or mental health provider.
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
          <Text style={styles.bulletPoint}>• Encrypted data can be exported by the user; however, due to the high level of encryption, restoring this data on another device may not be possible.</Text>
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
          <Text style={styles.sectionText}>
            In order to better understand overall usage and improve the app, Unspoken tracks the total number of messages and conversations written across all users.
          </Text>
          <Text style={styles.bulletPoint}>• No content of the messages is collected.</Text>
          <Text style={styles.bulletPoint}>• No personal information, identifiers, or device data is tracked.</Text>
          <Text style={styles.bulletPoint}>• Only the numeric count of messages and conversations is incremented anonymously and stored in a secure backend.</Text>
          <Text style={styles.bulletPoint}>• By using the app, you consent to this non-invasive and privacy-respecting tracking.</Text>
        </View>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          By using Unspoken, you confirm that you have read, understood, and agree to these Terms and Conditions.
        </Text>
      </View>

          {fromSettings && (
            <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdrawConsent}>
              <Ionicons name="alert-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.withdrawButtonText}>Withdraw Consent</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Accept Terms Button */}
      {!fromSettings && (
        <TouchableOpacity
          style={{
            backgroundColor: '#D49A6A',
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 24,
            alignSelf: 'center',
            marginTop: 24,
            marginBottom: 16,
          }}
          onPress={async () => {
            await storage.setTermsAccepted();
            navigation.replace('Onboarding');
          }}
        >
          <Text style={{ color: '#1E1E1E', fontSize: 16, fontWeight: '600' }}>
            Accept Terms & Continue
          </Text>
        </TouchableOpacity>
      )}

      {/* PIN Modal */}
      {pinModalVisible && (
        <View style={styles.modal}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ width: '100%', maxWidth: 400 }}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter PIN to Withdraw Consent</Text>
              <TextInput
                style={styles.input}
                value={pinInput}
                onChangeText={setPinInput}
                maxLength={4}
                keyboardType="numeric"
                secureTextEntry
                placeholder="Enter your 4-digit PIN"
                placeholderTextColor="#A0A0A0"
                editable={!isProcessing}
              />
              {pinError ? <Text style={styles.errorText}>{pinError}</Text> : null}
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setPinModalVisible(false);
                    setPinInput("");
                    setPinError("");
                  }} 
                  disabled={isProcessing}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.confirmButton, (!pinInput || isProcessing) && styles.confirmButtonDisabled]} 
                  onPress={handlePinSubmit} 
                  disabled={!pinInput || isProcessing}
                >
                  <Text style={styles.confirmButtonText}>
                    {isProcessing ? 'Verifying...' : 'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
}

function getStyles(theme: "light" | "dark") {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? '#1E1E1E' : '#FFFFFF',
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
      backgroundColor: theme === "dark" ? '#2D2D2D' : '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme === "dark" ? '#F5F5F5' : '#232323',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    termsContainer: {
      backgroundColor: theme === "dark" ? '#2D2D2D' : '#F5F5F5',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    },
    lastUpdated: {
      fontSize: 14,
      color: theme === "dark" ? '#A0A0A0' : '#555',
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
      color: theme === "dark" ? '#D1D1D1' : '#232323',
      lineHeight: 20,
    },
    bulletPoints: {
      marginTop: 4,
    },
    bulletPoint: {
      fontSize: 14,
      color: theme === "dark" ? '#D1D1D1' : '#232323',
      lineHeight: 20,
      marginBottom: 4,
    },
    disclaimer: {
      backgroundColor: theme === "dark" ? '#383838' : '#F5F5F5',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(212, 154, 106, 0.2)',
    },
    disclaimerText: {
      fontSize: 14,
      color: theme === "dark" ? '#A0A0A0' : '#555',
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
    modal: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalContent: {
      backgroundColor: theme === "dark" ? '#2D2D2D' : '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      marginBottom: 16,
      textAlign: 'center',
    },
    input: {
      backgroundColor: theme === "dark" ? '#1E1E1E' : '#F5F5F5',
      borderRadius: 8,
      padding: 12,
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      fontSize: 16,
      marginBottom: 16,
      textAlign: 'center',
    },
    errorText: {
      color: '#D49A6A',
      fontSize: 14,
      marginBottom: 16,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      backgroundColor: theme === "dark" ? '#1E1E1E' : '#E0E0E0',
      alignItems: 'center',
    },
    cancelButtonText: {
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      fontSize: 16,
      fontWeight: '500',
    },
    confirmButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      backgroundColor: '#D49A6A',
      alignItems: 'center',
    },
    confirmButtonDisabled: {
      opacity: 0.5,
    },
    confirmButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '500',
    },
  });
}
