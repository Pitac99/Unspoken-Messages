import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@/context/ThemeContext";

interface KeypadProps {
  onNumberPress: (number: string) => void;
  onDelete: () => void;
  onBiometric?: () => void;
  showBiometric?: boolean;
  disabled?: boolean;
  style?: any;
  buttonTextStyle?: any;
}

export function Keypad({
  onNumberPress,
  onDelete,
  onBiometric,
  showBiometric = true,
  disabled = false,
  style,
  buttonTextStyle,
}: KeypadProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];

  return (
    <View style={[styles.container, style]}>
      {numbers.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((number) => (
            <TouchableOpacity
              key={number}
              style={[styles.button, disabled && styles.buttonDisabled]}
              onPress={() => onNumberPress(number)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, buttonTextStyle, disabled && styles.textDisabled]}>
                {number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      
      {/* Bottom row */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.button,
            (!showBiometric || disabled) && styles.invisible
          ]}
          onPress={onBiometric}
          disabled={!showBiometric || disabled}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="finger-print" 
            size={24} 
            color={disabled ? "#666666" : "#D49A6A"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={() => onNumberPress("0")}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, buttonTextStyle, disabled && styles.textDisabled]}>
            0
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={onDelete}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="backspace-outline" 
            size={20} 
            color={disabled ? "#666666" : "#A0A0A0"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getStyles(theme: "light" | "dark") {
  return StyleSheet.create({
    container: {
      maxWidth: 300,
      alignSelf: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      gap: 10,
    },
    button: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme === "dark" ? '#2D2D2D' : '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 3,
    },
    buttonDisabled: {
      backgroundColor: theme === "dark" ? '#1E1E1E' : '#E0E0E0',
      opacity: 0.5,
    },
    buttonText: {
      fontSize: 26,
      fontWeight: '500',
      color: theme === "dark" ? '#F5F5F5' : '#232323',
    },
    textDisabled: {
      color: '#666666',
    },
    invisible: {
      opacity: 0,
    },
  });
}
