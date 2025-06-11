import * as Sentry from '@sentry/react-native';
import { SENTRY_DSN } from '@env';

export const initSentry = () => {
  // În development, dezactivăm majoritatea funcționalităților Sentry
  if (__DEV__) {
    console.log('[Sentry] Running in development mode - minimal logging enabled');
    
    Sentry.init({
      dsn: SENTRY_DSN,
      debug: false, // Dezactivăm debug mode pentru a reduce zgomotul
      enabled: false, // Dezactivăm Sentry complet în development
      tracesSampleRate: 0
    });
    
    return;
  }

  // În producție, activăm Sentry cu toate funcționalitățile
  Sentry.init({
    dsn: SENTRY_DSN,
    debug: false,
    enabled: true,
    enableAutoSessionTracking: true,
    tracesSampleRate: 1.0,
    // Configurări suplimentare pentru producție
    attachStacktrace: true,
    autoSessionTracking: true,
    // Ignorăm anumite tipuri de erori care nu sunt relevante
    ignoreErrors: [
      'Network request failed', // Erori comune de rețea
      'Aborted', // Requeste anulate
      'Canceled' // Operațiuni anulate de utilizator
    ]
  });
};

export const logError = (error: Error, context?: { [key: string]: any }) => {
  if (__DEV__) {
    // În development, doar afișăm în consolă
    console.error('[Dev Error]:', error, context);
    return;
  }
  
  Sentry.captureException(error, {
    extra: context
  });
};

export const logMessage = (message: string, level: Sentry.SeverityLevel = 'info', context?: { [key: string]: any }) => {
  if (__DEV__) {
    // În development, doar afișăm în consolă
    console.log(`[Dev ${level}]:`, message, context);
    return;
  }

  Sentry.captureMessage(message, {
    level,
    extra: context
  });
};

export const setUserContext = (userId: string, email?: string, username?: string) => {
  if (__DEV__) {
    console.log('[Dev User Context]:', { userId, email, username });
    return;
  }

  Sentry.setUser({
    id: userId,
    email,
    username
  });
};

export const addBreadcrumb = (message: string, category?: string, level: Sentry.SeverityLevel = 'info') => {
  if (__DEV__) {
    console.log('[Dev Breadcrumb]:', { message, category, level });
    return;
  }

  Sentry.addBreadcrumb({
    message,
    category,
    level,
  });
};

// Helper pentru a marca începutul unei operațiuni importante
export const startTransaction = (name: string, operation: string) => {
  return Sentry.startTransaction({
    name,
    op: operation,
  });
};

// Helper pentru a marca un eveniment de performanță
export const markPerformanceEvent = (name: string, data?: { [key: string]: any }) => {
  const span = Sentry.getCurrentHub()?.getScope()?.getTransaction()?.startChild({
    op: 'performance',
    description: name,
  });

  if (span && data) {
    Object.entries(data).forEach(([key, value]) => {
      span.setData(key, value);
    });
  }

  span?.finish();
}; 