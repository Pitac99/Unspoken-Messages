import { storage, STORAGE_KEYS } from "./storage";
import type { AppData } from "../types";
import * as Crypto from 'expo-crypto';

export class AuthManager {
  private static instance: AuthManager;
  private sessionDuration = 30 * 60 * 1000; // 30 minutes

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }
  async clearAuthSession(): Promise<void> {
    await storage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }
  async isAuthenticated(): Promise<boolean> {
    const session = await storage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!session) return false;
    
    try {
      const sessionData = JSON.parse(session);
      const now = Date.now();
      if (now > sessionData.expiry) {
        await storage.removeItem(STORAGE_KEYS.AUTH_SESSION);
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async extendSession(): Promise<void> {
    try {
      const session = await storage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (!session) return;

      const expiry = Date.now() + this.sessionDuration;
      await storage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({ expiry }));
    } catch (error) {
      console.error("Error extending session:", error);
    }
  }

  async authenticate(pin: string): Promise<boolean> {
    try {
      const appData = await storage.getAppData();
      if (!appData?.settings.pinHash) {
        throw new Error("PIN not set up");
      }

      const isValid = await this.verifyPinHash(pin, appData.settings.pinHash);
      
      if (isValid) {
        const expiry = Date.now() + this.sessionDuration;
        await storage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({ expiry }));
      }

      return isValid;
    } catch (error) {
      return false;
    }
  }

  async setPin(pin: string): Promise<void> {
    try {
      let appData = await storage.getAppData();
      
      // Initialize with default data if not exists
      if (!appData) {
        const defaultData: AppData = {
          settings: {
            pinHash: "",
            biometricEnabled: false,
            autoDeleteEnabled: false,
            autoDeleteDays: 30,
            onboardingCompleted: false,
            totalMessagesSent: 0,
            donationIntervalsShown: [],
          },
          contacts: [],
          messages: [],
          conversations: [],
          version: "1.0.0"
        };
        
        await storage.setAppData(defaultData);
        appData = defaultData;
      }

      // Set the PIN hash
      appData.settings.pinHash = await this.hashPin(pin);
      appData.settings.onboardingCompleted = true;
      await storage.setAppData(appData);

      // Verify the data was saved correctly
      const verifyData = await storage.getAppData();
      if (!verifyData?.settings.pinHash) {
        throw new Error("Failed to verify PIN setup");
      }
    } catch (error) {
      throw new Error("Failed to set PIN: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }

  async changePin(currentPin: string, newPin: string): Promise<boolean> {
    try {
      const appData = await storage.getAppData();
      if (!appData?.settings.pinHash) {
        throw new Error("PIN not set up");
      }

      const isValid = await this.verifyPinHash(currentPin, appData.settings.pinHash);
      if (!isValid) {
        return false;
      }

      appData.settings.pinHash = await this.hashPin(newPin);
      await storage.setAppData(appData);
      return true;
    } catch (error) {
      return false;
    }
  }

  async logout(): Promise<void> {
    await storage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }

  private async hashPin(pin: string): Promise<string> {
    try {
      // Add a salt to the PIN before hashing
      const salt = await Crypto.getRandomBytesAsync(16);
      const saltBase64 = Array.from(salt)
        .map(byte => String.fromCharCode(byte))
        .join('');
      const saltedPin = pin + btoa(saltBase64);
      
      // Hash the salted PIN
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        saltedPin
      );

      // Combine salt and hash
      return btoa(saltBase64) + ':' + hash;
    } catch (error) {
      throw error;
    }
  }

  private async verifyPinHash(pin: string, storedHash: string): Promise<boolean> {
    try {
      const [storedSaltBase64, storedHashValue] = storedHash.split(':');
      if (!storedSaltBase64 || !storedHashValue) return false;

      const saltedPin = pin + storedSaltBase64;
      
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        saltedPin
      );

      return hash === storedHashValue;
    } catch (error) {
      return false;
    }
  }
}

export const auth = AuthManager.getInstance();
