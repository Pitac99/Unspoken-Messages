import * as Crypto from 'expo-crypto';
import { encode as encodeBase64, decode as decodeBase64 } from 'base-64';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY_STORAGE = 'encryption_key';

// Generate a secure encryption key
async function generateKey(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  return encodeBase64(Array.from(randomBytes).map(byte => String.fromCharCode(byte)).join(''));
}

// Get or create encryption key, persisted in SecureStore
let ENCRYPTION_KEY: string | null = null;

async function getEncryptionKey(): Promise<string> {
  if (!ENCRYPTION_KEY) {
    ENCRYPTION_KEY = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORAGE);
    if (!ENCRYPTION_KEY) {
      ENCRYPTION_KEY = await generateKey();
      await SecureStore.setItemAsync(ENCRYPTION_KEY_STORAGE, ENCRYPTION_KEY);
    }
  }
  return ENCRYPTION_KEY;
}

function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

function uint8ArrayToString(array: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(array);
}

export async function encrypt(data: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const iv = await Crypto.getRandomBytesAsync(16);
    const salt = await Crypto.getRandomBytesAsync(16);
    
    // Create a unique key for this encryption using PBKDF2
    const derivedKey = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      key + encodeBase64(Array.from(salt).map(byte => String.fromCharCode(byte)).join(''))
    );
    
    // Convert the data to bytes using TextEncoder
    const dataBytes = stringToUint8Array(data);
    
    // Use XOR encryption
    const encrypted = new Uint8Array(dataBytes.length);
    const keyBytes = new Uint8Array(derivedKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    
    for (let i = 0; i < dataBytes.length; i++) {
      encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    // Combine IV, salt, and encrypted data
    const combined = new Uint8Array(iv.length + salt.length + encrypted.length);
    combined.set(iv);
    combined.set(salt, iv.length);
    combined.set(encrypted, iv.length + salt.length);
    
    // Convert to base64 for storage
    return encodeBase64(Array.from(combined).map(byte => String.fromCharCode(byte)).join(''));
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
}

export async function decrypt(encryptedData: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const data = new Uint8Array(decodeBase64(encryptedData).split('').map(char => char.charCodeAt(0)));
    
    // Extract IV, salt and encrypted data
    const iv = data.slice(0, 16);
    const salt = data.slice(16, 32);
    const encrypted = data.slice(32);
    
    // Recreate the key using PBKDF2
    const derivedKey = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      key + encodeBase64(Array.from(salt).map(byte => String.fromCharCode(byte)).join(''))
    );
    
    // Decrypt using XOR
    const decrypted = new Uint8Array(encrypted.length);
    const keyBytes = new Uint8Array(derivedKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length];
    }
    
    // Convert bytes back to string using TextDecoder
    return uint8ArrayToString(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}

export async function hashPin(pin: string): Promise<string> {
  // Add a salt to the PIN before hashing
  const salt = await Crypto.getRandomBytesAsync(16);
  const saltString = encodeBase64(String.fromCharCode(...new Uint8Array(salt)));
  const saltedPin = pin + saltString;
  
  // Hash the salted PIN
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    saltedPin
  );

  // Combine salt and hash
  return saltString + ':' + hash;
}

export async function verifyPinHash(pin: string, storedHash: string): Promise<boolean> {
  try {
    const [storedSalt, storedHashValue] = storedHash.split(':');
    if (!storedSalt || !storedHashValue) return false;

    const saltedPin = pin + storedSalt;
    
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

// --- Password-based encryption for export/import using AES+PBKDF2 ---

/**
 * Encrypts data with a user-provided password using PBKDF2-derived AES key.
 * Returns a base64 string containing salt + iv + ciphertext (all base64-encoded, JSON-wrapped).
 */
export async function encryptWithPassword(data: string, password: string): Promise<string> {
  // Generate random salt and iv
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);
  // Derive key from password + salt
  const key = CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 100000 });
  // Encrypt
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv });
  // Return JSON-wrapped base64
  return JSON.stringify({
    salt: CryptoJS.enc.Base64.stringify(salt),
    iv: CryptoJS.enc.Base64.stringify(iv),
    ciphertext: encrypted.toString(),
  });
}

/**
 * Decrypts data with a user-provided password using PBKDF2-derived AES key.
 * Expects a base64 string containing salt + iv + ciphertext (JSON-wrapped).
 */
export async function decryptWithPassword(encryptedData: string, password: string): Promise<string> {
  try {
    const { salt, iv, ciphertext } = JSON.parse(encryptedData);
    const saltWA = CryptoJS.enc.Base64.parse(salt);
    const ivWA = CryptoJS.enc.Base64.parse(iv);
    const key = CryptoJS.PBKDF2(password, saltWA, { keySize: 256/32, iterations: 100000 });
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: ivWA });
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    if (!plaintext) throw new Error('Wrong password or corrupted data');
    return plaintext;
  } catch (e) {
    throw new Error('Could not decrypt or import the backup. Wrong password?');
  }
}
