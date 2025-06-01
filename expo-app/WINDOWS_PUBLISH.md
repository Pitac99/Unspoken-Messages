# UNSPOKEN - Publicare în Cloud pe Windows

## Pentru Windows PowerShell:

1. **Deschide PowerShell ca Administrator**

2. **Navighează la folderul aplicației:**
```powershell
cd expo-app
```

3. **Instalează dependențele:**
```powershell
npm install
npm install -g @expo/cli eas-cli
```

4. **Setează token-ul de autentificare:**
```powershell
$env:EXPO_TOKEN="ky4l1OHPXTrojZeemFTlRVBQ4Uiq6c6M49Us-4GK"
```

5. **Login în contul Expo:**
```powershell
npx expo login
```

6. **Publică aplicația în cloud:**
```powershell
npx expo publish
```

## Alternativ pentru Command Prompt:

1. **Deschide cmd ca Administrator**

2. **Navighează la folder:**
```cmd
cd expo-app
```

3. **Setează token-ul:**
```cmd
set EXPO_TOKEN=ky4l1OHPXTrojZeemFTlRVBQ4Uiq6c6M49Us-4GK
```

4. **Login și publică:**
```cmd
npx expo login
npx expo publish
```

## După publicare:

Aplicația va fi disponibilă permanent la:
`exp://exp.host/@cristi.david87@gmail.com/unspoken-app`

Oricine cu Expo Go poate accesa aplicația prin acest link, fără a mai avea nevoie de computer pentru rulare.

## Verificare:
- Instalează Expo Go pe telefon
- Scanează QR code-ul generat sau
- Caută "UNSPOKEN" în profilul tău din Expo Go