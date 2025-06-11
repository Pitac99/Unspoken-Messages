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

  async isAuthenticated(): Promise<boolean> {
    const session = await storage.getItem(STORAGE_KEYS.AUTH_SESSION);
    console.log('[DEBUG] isAuthenticated: sesiune citită', session);
    if (!session) return false;
    
    try {
      const sessionData = JSON.parse(session);
      const now = Date.now();
      if (now > sessionData.expiry) {
        console.log('[DEBUG] isAuthenticated: sesiunea a expirat');
        await storage.removeItem(STORAGE_KEYS.AUTH_SESSION);
        return false;
      }
      console.log('[DEBUG] isAuthenticated: sesiunea este validă');
      return true;
    } catch (error) {
      console.error('[DEBUG] isAuthenticated: Error parsing session:', error);
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
      console.log('[DEBUG] authenticate: appData', appData);
      if (!appData?.settings.pinHash) {
        throw new Error("PIN not set up");
      }

      const isValid = await this.verifyPinHash(pin, appData.settings.pinHash);
      console.log('[DEBUG] authenticate: pin valid?', isValid);
      
      if (isValid) {
        const expiry = Date.now() + this.sessionDuration;
        await storage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({ expiry }));
        console.log('[DEBUG] authenticate: sesiune setată cu expiry', expiry);
      }

      return isValid;
    } catch (error) {
      console.error('[DEBUG] authenticate: Authentication error:', error);
      return false;
    }
  }

  async setPin(pin: string): Promise<void> {
    try {
      let appData = await storage.getAppData();
      console.log('[DEBUG] setPin: appData inițial', appData);
      
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
        console.log('[DEBUG] setPin: defaultData creat și salvat');
      }

      // Set the PIN hash
      appData.settings.pinHash = await this.hashPin(pin);
      appData.settings.onboardingCompleted = true;
      await storage.setAppData(appData);
      console.log('[DEBUG] setPin: pinHash și onboardingCompleted setate', appData);

      // Verify the data was saved correctly
      const verifyData = await storage.getAppData();
      if (!verifyData?.settings.pinHash) {
        throw new Error("Failed to verify PIN setup");
      }
      console.log('[DEBUG] setPin: verificare după salvare', verifyData);
    } catch (error) {
      console.error('[DEBUG] setPin: Error in setPin:', error);
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
      console.error("Change PIN error:", error);
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
      console.error("Error in hashPin:", error);
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
      console.error("PIN verification error:", error);
      return false;
    }
  }
}

export const auth = AuthManager.getInstance();
