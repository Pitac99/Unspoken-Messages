import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unspoken.app',
  appName: 'Unspoken',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#1E1E1E",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
