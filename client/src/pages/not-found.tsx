import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@/context/ThemeContext";

export default function NotFound() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="alert-circle" size={32} color="#EF4444" />
          <Text style={styles.title}>404 Page Not Found</Text>
        </View>

        <Text style={styles.description}>
          Did you forget to add the page to the router?
        </Text>
      </View>
    </View>
  );
}

function getStyles(theme: "light" | "dark") {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? '#1E1E1E' : '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    card: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      marginBottom: 16,
    },
    description: {
      marginTop: 16,
      fontSize: 14,
      color: theme === "dark" ? '#A0A0A0' : '#555',
    },
  });
}
