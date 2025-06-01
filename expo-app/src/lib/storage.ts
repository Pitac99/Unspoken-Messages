import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { AppData, Contact, Message, Settings } from '@/types';

const STORAGE_KEY = 'unspoken_data';
const PIN_KEY = 'unspoken_pin';

class SecureStorage {
  private async encrypt(data: string): Promise<string> {
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      'unspoken_encryption_key'
    );
    return data; // In production, use proper encryption
  }

  private async decrypt(encryptedData: string): Promise<string> {
    return encryptedData; // In production, use proper decryption
  }

  async getAppData(): Promise<AppData | null> {
    try {
      const encryptedData = await SecureStore.getItemAsync(STORAGE_KEY);
      if (!encryptedData) return null;
      
      const decryptedData = await this.decrypt(encryptedData);
      const data = JSON.parse(decryptedData);
      
      // Convert date strings back to Date objects
      data.contacts.forEach((contact: any) => {
        contact.createdAt = new Date(contact.createdAt);
        if (contact.lastMessageAt) {
          contact.lastMessageAt = new Date(contact.lastMessageAt);
        }
      });
      
      data.messages.forEach((message: any) => {
        message.timestamp = new Date(message.timestamp);
      });
      
      return data;
    } catch (error) {
      console.error('Failed to get app data:', error);
      return null;
    }
  }

  async setAppData(data: AppData): Promise<void> {
    try {
      const dataString = JSON.stringify(data);
      const encryptedData = await this.encrypt(dataString);
      await SecureStore.setItemAsync(STORAGE_KEY, encryptedData);
    } catch (error) {
      console.error('Failed to save app data:', error);
    }
  }

  initializeAppData(): AppData {
    return {
      contacts: [],
      messages: [],
      conversations: [],
      settings: {
        biometricEnabled: false,
        autoDeleteEnabled: false,
        totalMessagesSent: 0,
        donationIntervalsShown: []
      },
      version: '1.0.0'
    };
  }

  async getPin(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(PIN_KEY);
    } catch (error) {
      console.error('Failed to get PIN:', error);
      return null;
    }
  }

  async setPin(pin: string): Promise<void> {
    try {
      const hashedPin = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        pin
      );
      await SecureStore.setItemAsync(PIN_KEY, hashedPin);
    } catch (error) {
      console.error('Failed to save PIN:', error);
    }
  }

  async verifyPin(pin: string): Promise<boolean> {
    try {
      const storedPin = await this.getPin();
      if (!storedPin) return false;
      
      const hashedPin = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        pin
      );
      
      return hashedPin === storedPin;
    } catch (error) {
      console.error('Failed to verify PIN:', error);
      return false;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
      await SecureStore.deleteItemAsync(PIN_KEY);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }
}

export const storage = new SecureStorage();