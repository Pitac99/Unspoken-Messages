# UNSPOKEN - Cloud Deployment în Expo

## Publicare permanentă în cloud pentru acces global

Aplicația UNSPOKEN va fi publicată în cloud-ul Expo și va fi accesibilă oricând prin Expo Go de pe orice telefon.

### 🔑 Conturi necesare
- Cont Expo configurat: cristi.david87@gmail.com
- Acces la platforma Expo pentru publishing

### 📱 Pasul 1: Pregătire telefon
1. Instalează Expo Go:
   - iOS: App Store → "Expo Go"
   - Android: Google Play → "Expo Go"

### 💻 Pasul 2: Configurare locală
```bash
cd expo-app
npm install
```

### 🚀 Pasul 3: Login și publicare
```bash
# Login în contul Expo
npx expo login
# Email: cristi.david87@gmail.com

# Publicare în cloud
npx expo publish --release-channel production
```

### 🌐 Pasul 4: Acces cloud permanent
După publicare, aplicația va fi disponibilă la:
**URL Expo:** `exp://exp.host/@cristi.david87@gmail.com/unspoken-app`

### 📲 Cum accesezi aplicația published:

**Metoda 1 - Din Expo Go:**
1. Deschide Expo Go pe telefon
2. Mergi la tab-ul "Profile"
3. Caută proiectele tale published
4. Selectează "UNSPOKEN"

**Metoda 2 - Link direct:**
1. Deschide browser pe telefon
2. Accesează: `exp://exp.host/@cristi.david87@gmail.com/unspoken-app`
3. Se va deschide în Expo Go automat

### ✅ Avantajele cloud deployment:
- Aplicația rămâne online permanent
- Accesibilă de pe orice telefon cu Expo Go
- Nu necesită computer pentru rulare
- Actualizări instantanee când republici
- Partajare ușoară cu alții prin link

### 🔄 Pentru actualizări:
```bash
cd expo-app
# Fă modificările necesare în cod
npx expo publish --release-channel production
```

Aplicația se va actualiza automat în Expo Go la următoarea deschidere.

### 📋 Status aplicație:
- ✅ Configurată pentru cloud deployment
- ✅ Cont Expo: cristi.david87@gmail.com
- ✅ Ready pentru publishing permanent
- ✅ Accesibilă global prin Expo Go

Aplicația UNSPOKEN este gata pentru deployment în cloud!