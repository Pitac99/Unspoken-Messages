// ... restul importurilor
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { encrypt, decrypt } from "./encryption";
import type { AppData } from '../types';

export const STORAGE_KEYS = {
  APP_DATA: 'app_data',
  APP_DATA_BACKUP: 'app_data_backup',
  AUTH_SESSION: 'auth_session',
  PIN_HASH: 'pin_hash',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  TERMS_ACCEPTED: 'terms_accepted'
} as const;

// Revive date functions
function reviveAppDataDates(appData: any): AppData | null {
  if (!appData) return null;
  try {
    if (Array.isArray(appData.contacts)) {
      appData.contacts = appData.contacts.map((contact: any) => ({
        ...contact,
        createdAt: new Date(contact.createdAt),
      }));
    }
    if (Array.isArray(appData.messages)) {
      appData.messages = appData.messages.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      }));
    }
    if (Array.isArray(appData.conversations)) {
      appData.conversations = appData.conversations.map((conversation: any) => ({
        ...conversation,
        lastMessageAt: conversation.lastMessageAt ? new Date(conversation.lastMessageAt) : undefined,
      }));
    }
    return appData as AppData;
  } catch (error) {
    return null;
  }
}

class StorageManager {
  private static instance: StorageManager;
  private constructor() {}
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const encryptedData = await AsyncStorage.getItem(key);
      if (!encryptedData) return null;
      const decryptedData = await decrypt(encryptedData);
      if (decryptedData.startsWith('{') || decryptedData.startsWith('[')) {
        try {
          JSON.parse(decryptedData);
        } catch (error: any) {
          return null;
        }
      }
      return decryptedData;
    } catch (error) {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (key === STORAGE_KEYS.AUTH_SESSION) {
    }
    try {
      if (value.startsWith('{') || value.startsWith('[')) {
        JSON.parse(value);
      }
      const encryptedData = await encrypt(value);
      await AsyncStorage.setItem(key, encryptedData);
      if (key === STORAGE_KEYS.APP_DATA) {
        await AsyncStorage.setItem(STORAGE_KEYS.APP_DATA_BACKUP, encryptedData);
      }
    } catch (error) {
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    if (key === STORAGE_KEYS.AUTH_SESSION) {
    }
    await AsyncStorage.removeItem(key);
  }

  async getAppData(): Promise<AppData | null> {
    try {
      const data = await this.getItem(STORAGE_KEYS.APP_DATA);
      if (data) {
        const parsedData = reviveAppDataDates(JSON.parse(data));
        if (parsedData) return parsedData;
      }
      const backupData = await AsyncStorage.getItem(STORAGE_KEYS.APP_DATA_BACKUP);
      if (backupData) {
        const decryptedBackup = await decrypt(backupData);
        const parsedBackup = reviveAppDataDates(JSON.parse(decryptedBackup));
        if (parsedBackup) {
          await this.setAppData(parsedBackup);
          return parsedBackup;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async setAppData(data: AppData): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await this.setItem(STORAGE_KEYS.APP_DATA, jsonData);
      try {
        await SecureStore.setItemAsync(STORAGE_KEYS.APP_DATA, jsonData);
      } catch (secureError) {
      }
    } catch (error) {
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    await AsyncStorage.clear();
    await SecureStore.deleteItemAsync(STORAGE_KEYS.APP_DATA);
  }

  async getAuthSession(): Promise<{ expiry: number } | null> {
    try {
      const session = await this.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (!session) return null;
      return JSON.parse(session);
    } catch {
      return null;
    }
  }

  async setAuthSession(expiry: number): Promise<void> {
    await this.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({ expiry }));
  }

  async getPinHash(): Promise<string | null> {
    return this.getItem(STORAGE_KEYS.PIN_HASH);
  }

  async setPinHash(hash: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.PIN_HASH, hash);
  }

  async isOnboardingComplete(): Promise<boolean> {
    const value = await this.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  }

  async setOnboardingComplete(): Promise<void> {
    await this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  }

  async clearAuthSession(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }

  async areTermsAccepted(): Promise<boolean> {
    const value = await this.getItem(STORAGE_KEYS.TERMS_ACCEPTED);
    return value === 'true';
  }

  async setTermsAccepted(value: boolean = true): Promise<void> {
    const storedValue = value ? 'true' : 'false';
    await this.setItem(STORAGE_KEYS.TERMS_ACCEPTED, storedValue);
  }

  // ✅ NOU: Reseteaza doar setarile (nu sterge contacte, mesaje, etc.)
  async resetAppSettings(): Promise<void> {
    const currentData = await this.getAppData();
    const resetSettings: AppData["settings"] = {
      pinHash: "",
      onboardingCompleted: false,
      biometricEnabled: false,
      autoDeleteEnabled: false,
      autoDeleteDays: 30,
      totalMessagesSent: 0,
      donationCycleIndex: 0,
      donationNextAt: 5,
      donationIntervalsShown: [],
    };
    await this.setAppData({
      contacts: currentData?.contacts ?? [],
    messages: currentData?.messages ?? [],
    conversations: currentData?.conversations ?? [],
    version: currentData?.version ?? "1.0.0",
    settings: resetSettings,
    });
  }

  async exportData(): Promise<string> {
    const appData = await this.getAppData();
    if (!appData) throw new Error('No app data to export');
    const json = JSON.stringify(appData);
    return await encrypt(json);
  }

  async importData(encryptedData: string): Promise<void> {
    const decrypted = await decrypt(encryptedData);
    const appData = JSON.parse(decrypted);
    await this.setAppData(appData);
  }

  async exportDataWithPassword(password: string): Promise<string> {
    const appData = await this.getAppData();
    if (!appData) throw new Error('No app data to export');
    const json = JSON.stringify(appData);
    const { encryptWithPassword } = await import('./encryption');
    return await encryptWithPassword(json, password);
  }

  async importDataWithPassword(encryptedData: string, password: string): Promise<void> {
    const { decryptWithPassword } = await import('./encryption');
    const decrypted = await decryptWithPassword(encryptedData, password);
    const appData = JSON.parse(decrypted);
    await this.setAppData(appData);
  }
}

export const storage = StorageManager.getInstance();
