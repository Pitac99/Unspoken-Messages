import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform, ErrorUtils } from 'react-native';

const LOG_STORAGE_KEY = 'app_logs';
const MAX_LOG_SIZE = 1024 * 1024; // 1MB
const LOG_FILE = `${FileSystem.documentDirectory}app.log`;

interface PromiseRejectionEvent {
  reason: any;
  promise: Promise<any>;
}

declare global {
  var onunhandledrejection: ((event: PromiseRejectionEvent) => void) | null;
}

class Logger {
  private static instance: Logger;
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      // Verifică dacă fișierul de log există
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE);
      if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(LOG_FILE, '');
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize logger:', error);
    }
  }

  private async writeToFile(message: string) {
    try {
      await this.init();
      
      const timestamp = new Date().toISOString();
      const logEntry = `${timestamp} - ${message}\n`;
      
      // Verifică dimensiunea fișierului
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE, { size: true });
      if (fileInfo.exists && (fileInfo as any).size > MAX_LOG_SIZE) {
        // Dacă fișierul e prea mare, șterge prima jumătate
        const content = await FileSystem.readAsStringAsync(LOG_FILE);
        const lines = content.split('\n');
        const newContent = lines.slice(Math.floor(lines.length / 2)).join('\n');
        await FileSystem.writeAsStringAsync(LOG_FILE, newContent);
      }
      
      // Adaugă noua intrare folosind concatenare
      const currentContent = await FileSystem.readAsStringAsync(LOG_FILE);
      await FileSystem.writeAsStringAsync(LOG_FILE, currentContent + logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  async error(error: Error | string, context?: string) {
    const errorMessage = error instanceof Error ? error.stack || error.message : error;
    const contextStr = context ? ` [${context}]` : '';
    const message = `ERROR${contextStr}: ${errorMessage}`;
    
    console.error(message);
    await this.writeToFile(message);
  }

  async info(message: string, context?: string) {
    const contextStr = context ? ` [${context}]` : '';
    const logMessage = `INFO${contextStr}: ${message}`;
    
    console.log(logMessage);
    await this.writeToFile(logMessage);
  }

  async warn(message: string, context?: string) {
    const contextStr = context ? ` [${context}]` : '';
    const logMessage = `WARN${contextStr}: ${message}`;
    
    console.warn(logMessage);
    await this.writeToFile(logMessage);
  }

  async getLogs(): Promise<string> {
    try {
      await this.init();
      return await FileSystem.readAsStringAsync(LOG_FILE);
    } catch (error) {
      console.error('Failed to read logs:', error);
      return 'Failed to read logs';
    }
  }

  async clearLogs(): Promise<void> {
    try {
      await this.init();
      await FileSystem.writeAsStringAsync(LOG_FILE, '');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  // Funcție pentru a captura erorile negestionate
  setupErrorHandling() {
    const errorHandler = (error: Error, isFatal?: boolean) => {
      this.error(error, `Unhandled Error (Fatal: ${isFatal})`);
    };

    // Setează handler pentru erori negestionate
    ErrorUtils.setGlobalHandler(errorHandler);

    // Setează handler pentru promise-uri negestionate
    const self = this;
    const handleRejection = (event: PromiseRejectionEvent) => {
      self.error(event.reason, 'Unhandled Promise Rejection');
    };

    const originalHandler = global.onunhandledrejection;
    global.onunhandledrejection = (event: PromiseRejectionEvent) => {
      handleRejection(event);
      if (originalHandler) {
        originalHandler(event);
      }
    };
  }
}

export const logger = Logger.getInstance(); 