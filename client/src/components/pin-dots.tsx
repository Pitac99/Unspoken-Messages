import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PinDotsProps {
  length: number;
  filled: number;
  style?: any;
}

export function PinDots({ length, filled, style }: PinDotsProps) {
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

const styles = StyleSheet.create({
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
    borderColor: '#767577',
  },
});
