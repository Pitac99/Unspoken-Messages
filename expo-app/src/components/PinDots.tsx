import { View, StyleSheet } from 'react-native';

interface PinDotsProps {
  length: number;
  filled: number;
}

export function PinDots({ length, filled }: PinDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index < filled ? styles.filledDot : styles.emptyDot,
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
    alignItems: 'center',
    gap: 16,
    marginVertical: 32,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  emptyDot: {
    borderColor: '#383838',
    backgroundColor: 'transparent',
  },
  filledDot: {
    borderColor: '#D49A6A',
    backgroundColor: '#D49A6A',
  },
});