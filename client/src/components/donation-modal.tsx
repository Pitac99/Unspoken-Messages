import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@/context/ThemeContext";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageCount: number;
}

export function DonationModal({ isOpen, onClose, messageCount }: DonationModalProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [slideAnim] = useState(new Animated.Value(-200));

  useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, slideAnim]);

  const handleDonate = () => {
    Linking.openURL("https://buymeacoffee.com/unspokendonations");
    onClose();
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.modal,
          {
            transform: [{ translateY: slideAnim }],
            paddingTop: 25,
          }
        ]}
      >
        <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                Unspoken helped you?
              </Text>
              <Text style={styles.description}>
                If this space brought you peace or clarity, consider supporting us.
              </Text>
            </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleDonate}
              style={[styles.donateButton, styles.fullButton]}
            >
              <Text style={styles.donateButtonText}>Support Unspoken</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.laterButton, styles.fullButton]}
            >
              <Text style={styles.laterButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function getStyles(theme: "light" | "dark") {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      alignItems: 'center',
    },
    modal: {
      margin: 0,
      marginTop: Platform.OS === 'ios' ? 48 : 0,
      width: '100%',
      alignSelf: 'center',
    },
    content: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme === "dark" ? '#2D2D2D' : '#F5F5F5',
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 18,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 2,
      elevation: 2,
      gap: 8,
      minWidth: '100%',
      maxWidth: '100%',
    },
    iconContainer: {
      display: 'none',
    },
    textContainer: {
      alignItems: 'center',
      marginBottom: 6,
      paddingHorizontal: 2,
    },
    title: {
      fontSize: 15,
      fontWeight: '600',
      color: theme === "dark" ? '#FFFFFF' : '#232323',
    },
    description: {
      fontSize: 13,
      color: theme === "dark" ? '#FFFFFF' : '#232323',
      opacity: 0.9,
      marginTop: 2,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 4,
      width: '100%',
    },
    fullButton: {
      flex: 1,
    },
    donateButton: {
      backgroundColor: '#D49A6A',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    donateButtonText: {
      color: '#1E1E1E',
      fontSize: 15,
      fontWeight: '500',
    },
    laterButton: {
      backgroundColor: theme === "dark" ? '#232323' : '#F3F3F3',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    laterButtonText: {
      color: theme === "dark" ? '#F5F5F5' : '#1E1E1E',
      fontSize: 15,
      fontWeight: '500',
    },
  });
}