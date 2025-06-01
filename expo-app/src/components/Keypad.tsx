import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

interface KeypadProps {
  onNumberPress: (number: string) => void;
  onDelete: () => void;
  onBiometric?: () => void;
  showBiometric?: boolean;
}

export function Keypad({ onNumberPress, onDelete, onBiometric, showBiometric = false }: KeypadProps) {
  const handlePress = (number: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNumberPress(number);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete();
  };

  const handleBiometric = () => {
    if (onBiometric) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onBiometric();
    }
  };

  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];

  return (
    <View style={styles.container}>
      {numbers.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.numberButton}
              onPress={() => handlePress(number)}
              activeOpacity={0.7}
            >
              <Text style={styles.numberText}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      
      {/* Bottom row */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={showBiometric ? handleBiometric : undefined}
          activeOpacity={showBiometric ? 0.7 : 1}
        >
          {showBiometric && <Text style={styles.biometricText}>👤</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handlePress('0')}
          activeOpacity={0.7}
        >
          <Text style={styles.numberText}>0</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 300,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  numberButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#2D2D2D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F5F5F5',
  },
  deleteText: {
    fontSize: 20,
    color: '#B0B0B0',
  },
  biometricText: {
    fontSize: 24,
    color: '#D49A6A',
  },
});