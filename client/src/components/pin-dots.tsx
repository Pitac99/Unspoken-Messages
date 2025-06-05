import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from "@/context/ThemeContext";

interface PinDotsProps {
  length: number;
  filled: number;
  style?: any;
}

export function PinDots({ length, filled, style }: PinDotsProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index < filled ? styles.filledDot : styles.emptyDot
          ]}
        />
      ))}
    </View>
  );
}

function getStyles(theme: "light" | "dark") {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
    },
    dot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2,
    },
    filledDot: {
      backgroundColor: '#D49A6A',
      borderColor: '#D49A6A',
    },
    emptyDot: {
      borderColor: theme === "dark" ? '#767577' : '#A0A0A0',
    },
  });
}
