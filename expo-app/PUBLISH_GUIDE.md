# Publicarea aplicației UNSPOKEN în Expo Go

## Pași pentru publicare

### 1. Instalare dependențe
```bash
cd expo-app
npm install
```

### 2. Configurare EAS (Expo Application Services)
```bash
npm install -g @expo/cli
npm install -g eas-cli
```

### 3. Login în contul Expo
```bash
npx expo login
# Folosește: cristi.david87@gmail.com
```

### 4. Configurare EAS
```bash
eas build:configure
```

### 5. Start development server pentru testare
```bash
npx expo start --tunnel
```

### 6. Testare în Expo Go
- Descarcă aplicația Expo Go pe telefon
- Scanează QR code-ul generat din terminal
- Aplicația va rula pe telefon în timp real

### Alternativă: Publicare cu EAS Update
```bash
eas update --branch main
```

## Structura aplicației

✅ **Screens configurate:**
- Intro - Prezentarea aplicației
- PIN Setup - Configurarea securității
- PIN Auth - Autentificare
- Home - Lista conversațiilor
- Chat - Interfața de mesaje
- Settings - Configurări aplicație

✅ **Features implementate:**
- Autentificare PIN cu biometric
- Storage criptat local
- Sistema de donații
- Interfață terapeutică
- Cross-platform compatibility

## URL aplicație
După publicare, aplicația va fi disponibilă la:
`exp://exp.host/@cristi.david87@gmail.com/unspoken-app`

## Note importante
- Aplicația este configurată pentru contul: cristi.david87@gmail.com
- Toate datele rămân local pe device
- Nu necesită server backend
- Compatibilă iOS și Android