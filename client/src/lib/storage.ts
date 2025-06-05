import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt, decrypt } from "./encryption";
import type { AppData } from '../types';

export const STORAGE_KEYS = {
  APP_DATA: 'app_data',
  AUTH_SESSION: 'auth_session',
  PIN_HASH: 'pin_hash',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  TERMS_ACCEPTED: 'terms_accepted'
} as const;

// Helper to revive date strings to Date objects in AppData
function reviveAppDataDates(appData: any): AppData {
  // Convert contacts
  appData.contacts = appData.contacts.map((contact: any) => ({
    ...contact,
    createdAt: new Date(contact.createdAt),
  }));
  // Convert messages
  appData.messages = appData.messages.map((message: any) => ({
    ...message,
    timestamp: new Date(message.timestamp),
  }));
  // Convert conversations
  appData.conversations = appData.conversations.map((conversation: any) => ({
    ...conversation,
    lastMessageAt: conversation.lastMessageAt ? new Date(conversation.lastMessageAt) : undefined,
  }));
  return appData;
}

class StorageManager {
  private static instance: StorageManager;

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
      
      // Validate that the decrypted data is valid JSON if it starts with { or [
      if (decryptedData.startsWith('{') || decryptedData.startsWith('[')) {
        try {
          JSON.parse(decryptedData);
        } catch (error: any) {
          console.error(`Invalid JSON data for key ${key}:`, error);
          return null;
        }
      }
      
      return decryptedData;
    } catch (error) {
      console.error(`Failed to get encrypted data for key ${key}:`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      // Validate JSON if the value starts with { or [
      if (value.startsWith('{') || value.startsWith('[')) {
        try {
          JSON.parse(value);
        } catch (error: any) {
          throw new Error(`Invalid JSON data for key ${key}: ${error.message}`);
        }
      }
      
      const encryptedData = await encrypt(value);
      await AsyncStorage.setItem(key, encryptedData);
    } catch (error) {
      console.error(`Failed to set encrypted data for key ${key}:`, error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  }

  async getAppData(): Promise<AppData | null> {
    try {
      const data = await this.getItem(STORAGE_KEYS.APP_DATA);
      if (!data) return null;

      return reviveAppDataDates(JSON.parse(data));
    } catch (error) {
      console.warn("⚠️ Corrupted app data detected. Resetting app_data.");
      await this.removeItem(STORAGE_KEYS.APP_DATA); // sterge datele corupte
      return null; // intoarce null si aplica fallback in App.tsx
    }
  }

  async setAppData(data: AppData): Promise<void> {
    try {
      await this.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(data));
    } catch (error) {
      // console.error("Error setting app data:", error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  }

  // Auth session methods
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

  async clearAuthSession(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }

  // Settings methods
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

  async areTermsAccepted(): Promise<boolean> {
    const value = await this.getItem(STORAGE_KEYS.TERMS_ACCEPTED);
    return value === 'true';
  }

  async setTermsAccepted(): Promise<void> {
    await this.setItem(STORAGE_KEYS.TERMS_ACCEPTED, 'true');
  }

  async exportData(): Promise<string> {
    // Export the current app data as encrypted JSON string
    const appData = await this.getAppData();
    if (!appData) throw new Error('No app data to export');
    // Encrypt the JSON string using the same encryption as setItem
    const json = JSON.stringify(appData);
    const encrypted = await encrypt(json);
    return encrypted;
  }

  async importData(encryptedData: string): Promise<void> {
    // Import app data from an encrypted JSON string
    const decrypted = await decrypt(encryptedData);
    const appData = JSON.parse(decrypted);
    await this.setAppData(appData);
  }

  async exportDataWithPassword(password: string): Promise<string> {
    // Export the current app data as password-encrypted JSON string
    const appData = await this.getAppData();
    if (!appData) throw new Error('No app data to export');
    const json = JSON.stringify(appData);
    // Use password-based encryption
    const { encryptWithPassword } = await import('./encryption');
    const encrypted = await encryptWithPassword(json, password);
    return encrypted;
  }

  async importDataWithPassword(encryptedData: string, password: string): Promise<void> {
    // Import app data from a password-encrypted JSON string
    const { decryptWithPassword } = await import('./encryption');
    const decrypted = await decryptWithPassword(encryptedData, password);
    const appData = JSON.parse(decrypted);
    await this.setAppData(appData);
  }
}

export const storage = StorageManager.getInstance();
