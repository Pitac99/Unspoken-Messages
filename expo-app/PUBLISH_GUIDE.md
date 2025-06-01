# Publicarea aplicației UNSPOKEN în Expo Go

## Pași pentru publicare

### 1. Instalare dependențe
```bash
cd expo-app
npm install
```

### 2. Login în contul Expo
```bash
npx expo login
# Folosește: cristi.david87@gmail.com
```

### 3. Publicare aplicație
```bash
npx expo publish
```

### 4. Testare în Expo Go
- Descarcă aplicația Expo Go pe telefon
- Scanează QR code-ul generat
- Aplicația va rula pe telefon

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