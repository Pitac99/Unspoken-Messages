# UNSPOKEN - Quick Start în Expo Go

## Metoda cea mai simplă pentru testare

### Pasul 1: Instalează Expo Go pe telefon
- iOS: App Store → caută "Expo Go"
- Android: Google Play → caută "Expo Go"

### Pasul 2: Pe computer, în terminal
```bash
cd expo-app
npm install
npx expo start
```

### Pasul 3: Conectează telefonul
- În terminal va apărea un QR code
- Deschide Expo Go pe telefon
- Scanează QR code-ul din terminal
- Aplicația UNSPOKEN va rula instant pe telefon

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