# UNSPOKEN - Cloud Deployment în Expo

## Publicare în cloud pentru acces global

### Pasul 1: Instalează Expo Go pe telefon
- iOS: App Store → caută "Expo Go"
- Android: Google Play → caută "Expo Go"

### Pasul 2: Configurare și login Expo
```bash
cd expo-app
npm install
npm install -g @expo/cli
npx expo login
# Folosește: cristi.david87@gmail.com
```

### Pasul 3: Publicare în cloud
```bash
npx expo publish --release-channel production
```

### Pasul 4: Acces din Expo Go
După publicare, aplicația va fi disponibilă permanent la:
`exp://exp.host/@cristi.david87@gmail.com/unspoken-app`

Poți accesa aplicația din Expo Go:
- Deschide Expo Go
- Mergi la "Profile" tab
- Caută proiectele tale published
- Selectează "UNSPOKEN"

## Ce vei vedea în aplicație

1. **Intro Screen**: Welcome to UNSPOKEN cu prezentarea features
2. **PIN Setup**: Configurarea unui PIN de 4 cifre pentru securitate
3. **Home Screen**: Dashboard cu conversațiile tale
4. **Chat Screen**: Interfața pentru mesaje terapeutice private
5. **Settings**: Opțiuni biometrice și export date

## Features funcționale

✅ **PIN Authentication** - Securitate locală cu PIN sau biometric
✅ **Encrypted Storage** - Toate datele criptate pe device
✅ **Therapeutic Writing** - Mesaje private care nu se trimit nicăieri
✅ **Donation System** - Integrare cu Buy Me a Coffee
✅ **Dark Theme** - Design anthracite pentru confort vizual

## Troubleshooting

Dacă aplicația nu pornește:
1. Verifică că ai Node.js instalat
2. Rulează `npm install` din nou
3. Încearcă `npx expo start --clear`

Aplicația este configurată pentru contul: cristi.david87@gmail.com