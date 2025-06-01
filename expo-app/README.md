# UNSPOKEN Mobile App

A therapeutic messaging application for secure, private emotional expression - now available for iOS and Android through Expo.

## Features

- **Completely Private**: All data stays on your device, encrypted and secure
- **PIN Authentication**: 4-digit PIN with optional biometric unlock
- **Therapeutic Writing**: Express yourself freely without judgment
- **Organized Conversations**: Create separate spaces for different people or topics
- **Donation Integration**: Support the app through Buy Me a Coffee
- **Cross-Platform**: Available on both iOS and Android

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on device/simulator:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## Building for App Stores

### Prerequisites

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure your project:
```bash
eas build:configure
```

### iOS Build

1. Update `eas.json` with your Apple Developer details:
   - Apple ID
   - Apple Team ID
   - App Store Connect App ID

2. Build for iOS:
```bash
eas build --platform ios
```

3. Submit to App Store:
```bash
eas submit --platform ios
```

### Android Build

1. Create a Google Service Account and download the JSON key
2. Place the key file as `google-service-account.json` in the project root
3. Build for Android:
```bash
eas build --platform android
```

4. Submit to Google Play:
```bash
eas submit --platform android
```

## App Store Requirements

### iOS App Store

- Requires Apple Developer Account ($99/year)
- App must pass App Review guidelines
- Privacy policy required (therapeutic apps have specific requirements)
- Metadata localization recommended

### Google Play Store

- Requires Google Play Console account ($25 one-time)
- App must comply with Google Play policies
- Privacy policy required
- Target API level compliance

## Configuration Files

- `app.json` - Main app configuration
- `eas.json` - Build and submission configuration
- `capacitor.config.ts` - Capacitor configuration (if needed)

## Privacy & Security

- All user data encrypted with device-specific keys
- No data transmission to external servers
- PIN-based access control
- Biometric authentication support
- GDPR/CCPA compliant by design

## Support

For build issues or app store submission help, contact the development team.

## License

Private project - All rights reserved.