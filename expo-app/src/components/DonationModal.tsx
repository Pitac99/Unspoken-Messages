import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageCount: number;
}

export function DonationModal({ isOpen, onClose, messageCount }: DonationModalProps) {
  const handleDonate = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://buymeacoffee.com/unspokendonations');
      onClose();
    } catch (error) {
      console.error('Failed to open donation link:', error);
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>❤️</Text>
          </View>
          
          <Text style={styles.title}>Unspoken helped you?</Text>
          
          <Text style={styles.message}>
            If this space brought you peace or clarity, consider supporting us
          </Text>
          
          <Text style={styles.stats}>
            You've written {messageCount} therapeutic message{messageCount !== 1 ? 's' : ''}
          </Text>
          
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
              <Text style={styles.donateButtonText}>Support Unspoken</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modal: {
    backgroundColor: '#2D2D2D',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5F5F5',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  stats: {
    fontSize: 14,
    color: '#D49A6A',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  donateButton: {
    backgroundColor: '#D49A6A',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  donateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  closeButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#B0B0B0',
  },
});