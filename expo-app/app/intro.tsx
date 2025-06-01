import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function IntroScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/pin-setup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo placeholder */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>U</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome to UNSPOKEN</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          A safe space for your thoughts and feelings that need to be expressed, 
          but don't need to be sent.
        </Text>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>🔒 Completely Private</Text>
            <Text style={styles.featureText}>Your messages stay on your device, encrypted and secure</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>💭 Therapeutic Writing</Text>
            <Text style={styles.featureText}>Express yourself freely without judgment</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>🎯 Organized Conversations</Text>
            <Text style={styles.featureText}>Create separate spaces for different people or topics</Text>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          Your privacy is our priority. All data remains on your device.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D49A6A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F5F5F5',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  features: {
    marginBottom: 40,
  },
  feature: {
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D49A6A',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#D49A6A',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  footer: {
    fontSize: 12,
    color: '#808080',
    textAlign: 'center',
    lineHeight: 16,
  },
});