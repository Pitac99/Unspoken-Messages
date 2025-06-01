import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppData } from '@/lib/useAppData';
import { storage } from '@/lib/storage';

export default function SettingsScreen() {
  const router = useRouter();
  const { data, updateData } = useAppData();
  const [biometricEnabled, setBiometricEnabled] = useState(data?.settings.biometricEnabled || false);

  const handleBiometricToggle = async (value: boolean) => {
    setBiometricEnabled(value);
    await updateData(currentData => ({
      ...currentData,
      settings: {
        ...currentData.settings,
        biometricEnabled: value
      }
    }));
  };

  const handleExportData = async () => {
    try {
      const exportedData = await storage.exportData();
      Alert.alert(
        'Data Export',
        'Your data has been prepared for export. In a real implementation, this would save to your device or share via email.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your conversations and messages. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.clearAllData();
              router.replace('/intro');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const handleChangePin = () => {
    router.push('/pin-setup');
  };

  const handleAbout = () => {
    Alert.alert(
      'About UNSPOKEN',
      'A safe space for therapeutic writing. Version 1.0.0\n\nCreated to provide a private, secure environment for emotional expression and healing.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Biometric Authentication</Text>
              <Text style={styles.settingDescription}>Use fingerprint or face unlock</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: '#383838', true: '#D49A6A' }}
              thumbColor={biometricEnabled ? '#F5F5F5' : '#B0B0B0'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleChangePin}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Change PIN</Text>
              <Text style={styles.settingDescription}>Update your access PIN</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Export Data</Text>
              <Text style={styles.settingDescription}>Save your conversations</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearAllData}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, styles.dangerText]}>Clear All Data</Text>
              <Text style={styles.settingDescription}>Permanently delete everything</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>About UNSPOKEN</Text>
              <Text style={styles.settingDescription}>App information and version</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statsTitle}>Your Progress</Text>
          <Text style={styles.statsText}>
            {data?.settings.totalMessagesSent || 0} therapeutic messages written
          </Text>
          <Text style={styles.statsText}>
            {data?.contacts.length || 0} conversation{data?.contacts.length !== 1 ? 's' : ''} created
          </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    fontSize: 24,
    color: '#D49A6A',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5F5F5',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F5F5F5',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F5F5F5',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  dangerText: {
    color: '#FF6B6B',
  },
  arrow: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  stats: {
    marginTop: 'auto',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D49A6A',
    marginBottom: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
});