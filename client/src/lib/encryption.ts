import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = "unspoken-app-key-2024";

export function encrypt(data: string): string {
  try {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
}

export function decrypt(encryptedData: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error("Decryption returned empty string");
    }
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}

export function hashPin(pin: string): string {
  return CryptoJS.SHA256(pin + ENCRYPTION_KEY).toString();
}

export function verifyPin(pin: string, hash: string): boolean {
  return hashPin(pin) === hash;
}
