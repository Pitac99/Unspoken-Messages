import { hashPin, verifyPin } from "./encryption";
import { storage } from "./storage";

export class AuthManager {
  private static instance: AuthManager;
  private sessionDuration = 30 * 60 * 1000; // 30 minutes

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  isAuthenticated(): boolean {
    const session = storage.getAuthSession();
    if (!session) return false;
    
    const now = Date.now();
    if (now > session.expiry) {
      storage.clearAuthSession();
      return false;
    }
    
    return true;
  }

  authenticate(pin: string): boolean {
    const appData = storage.getAppData();
    if (!appData?.settings.pinHash) {
      throw new Error("PIN not set up");
    }

    const isValid = verifyPin(pin, appData.settings.pinHash);
    if (isValid) {
      const expiry = Date.now() + this.sessionDuration;
      storage.setAuthSession(expiry);
    }

    return isValid;
  }

  setPin(pin: string): void {
    const appData = storage.getAppData();
    if (!appData) {
      throw new Error("App not initialized");
    }

    appData.settings.pinHash = hashPin(pin);
    appData.settings.onboardingCompleted = true;
    storage.setAppData(appData);
  }

  changePin(currentPin: string, newPin: string): boolean {
    const appData = storage.getAppData();
    if (!appData?.settings.pinHash) {
      throw new Error("PIN not set up");
    }

    if (!verifyPin(currentPin, appData.settings.pinHash)) {
      return false;
    }

    appData.settings.pinHash = hashPin(newPin);
    storage.setAppData(appData);
    return true;
  }

  logout(): void {
    storage.clearAuthSession();
  }

  extendSession(): void {
    if (this.isAuthenticated()) {
      const expiry = Date.now() + this.sessionDuration;
      storage.setAuthSession(expiry);
    }
  }
}

export const auth = AuthManager.getInstance();
