import { encrypt, decrypt } from "./encryption";
import type { AppData, Contact, Message, Settings, Conversation } from "../types";

const STORAGE_KEYS = {
  APP_DATA: "unspoken_app_data",
  AUTH_SESSION: "unspoken_auth_session",
} as const;

class SecureStorage {
  private getEncryptedItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Failed to read from localStorage:", error);
      return null;
    }
  }

  private setEncryptedItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Failed to write to localStorage:", error);
      throw new Error("Storage quota exceeded or localStorage unavailable");
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove from localStorage:", error);
    }
  }

  getAppData(): AppData | null {
    try {
      const encrypted = this.getEncryptedItem(STORAGE_KEYS.APP_DATA);
      if (!encrypted) return null;
      
      const decrypted = decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Failed to get app data:", error);
      return null;
    }
  }

  setAppData(data: AppData): void {
    try {
      const serialized = JSON.stringify(data);
      const encrypted = encrypt(serialized);
      this.setEncryptedItem(STORAGE_KEYS.APP_DATA, encrypted);
    } catch (error) {
      console.error("Failed to save app data:", error);
      throw new Error("Failed to save data");
    }
  }

  initializeAppData(): AppData {
    const defaultData: AppData = {
      contacts: [],
      messages: [],
      conversations: [],
      settings: {
        pinHash: "",
        biometricEnabled: false,
        autoDeleteEnabled: false,
        autoDeleteDays: 30,
        onboardingCompleted: false,
      },
      version: "1.0.0",
    };

    this.setAppData(defaultData);
    return defaultData;
  }

  getAuthSession(): { expiry: number } | null {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error("Failed to get auth session:", error);
      return null;
    }
  }

  setAuthSession(expiry: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({ expiry }));
    } catch (error) {
      console.error("Failed to set auth session:", error);
    }
  }

  clearAuthSession(): void {
    this.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }

  exportData(): string {
    const data = this.getAppData();
    if (!data) {
      throw new Error("No data to export");
    }
    
    return encrypt(JSON.stringify(data));
  }

  clearAllData(): void {
    this.removeItem(STORAGE_KEYS.APP_DATA);
    this.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }
}

export const storage = new SecureStorage();
