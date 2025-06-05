import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Asset } from 'expo-asset';
import { useTheme } from "@/context/ThemeContext";

// Pre-load the asset
const logoAsset = Asset.fromModule(require('../../../assets/logo_portocaliu.png'));
logoAsset.downloadAsync(); // Start downloading the asset immediately

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;

export default function IntroPage({ navigation }: Props) {
  const [isLogoLoaded, setIsLogoLoaded] = React.useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  React.useEffect(() => {
    // Ensure the logo is loaded
    logoAsset.downloadAsync().then(() => {
      setIsLogoLoaded(true);
    });
  }, []);

  const handleAcceptTerms = () => {
    navigation.navigate('Onboarding');
  };

  const handleViewTerms = () => {
    navigation.navigate('Terms');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image 
              source={require('../../../assets/logo_portocaliu.png')}
              style={[styles.logo, !isLogoLoaded && styles.hiddenLogo]}
              resizeMode="contain"
              onLoad={() => setIsLogoLoaded(true)}
            />
          </View>
          <Text style={styles.title}>UNSPOKEN</Text>
          <Text style={styles.subtitle}>
            A therapeutic space for your thoughts
          </Text>
        </View>

        {/* Welcome Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Express your deepest thoughts in a secure, private environment designed for emotional healing.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleAcceptTerms}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Accept Terms & Continue</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleViewTerms}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>View Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function getStyles(theme: "light" | "dark") {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? '#1E1E1E' : '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    content: {
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 48,
    },
    logoWrapper: {
      width: 128,
      height: 128,
      marginBottom: 24,
    },
    logo: {
      width: '100%',
      height: '100%',
    },
    title: {
      fontSize: 32,
      fontWeight: '600',
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 18,
      color: theme === "dark" ? '#A0A0A0' : '#555',
      fontWeight: '300',
    },
    messageContainer: {
      marginBottom: 48,
    },
    message: {
      color: theme === "dark" ? '#A0A0A0' : '#555',
      textAlign: 'center',
      lineHeight: 24,
    },
    buttonContainer: {
      width: '100%',
      gap: 16,
    },
    primaryButton: {
      backgroundColor: '#D49A6A',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      width: '100%',
      alignItems: 'center',
    },
    primaryButtonText: {
      color: '#1E1E1E',
      fontSize: 16,
      fontWeight: '500',
    },
    secondaryButton: {
      paddingVertical: 12,
      width: '100%',
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: '#D49A6A',
      fontSize: 16,
      fontWeight: '500',
      textDecorationLine: 'underline',
    },
    hiddenLogo: {
      opacity: 0,
    },
  });
}
