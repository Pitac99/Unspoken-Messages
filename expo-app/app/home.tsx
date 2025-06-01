import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppData } from '@/lib/useAppData';
import { DonationModal } from '@/components/DonationModal';

const avatarColors = [
  "from-pink-500 to-rose-600",
  "from-blue-500 to-indigo-600", 
  "from-purple-500 to-violet-600",
  "from-green-500 to-emerald-600",
  "from-orange-500 to-amber-600",
  "from-red-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600"
];

export default function HomeScreen() {
  const router = useRouter();
  const { data, addContact, shouldShowDonationModal, markDonationPromptShown } = useAppData();
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);

  useEffect(() => {
    const donationCheck = shouldShowDonationModal();
    if (donationCheck.show && !donationModalOpen) {
      const timer = setTimeout(() => {
        setDonationModalOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [data?.settings.totalMessagesSent, shouldShowDonationModal, donationModalOpen]);

  const handleAddContact = () => {
    Alert.prompt(
      'New Contact',
      'Enter a name for this conversation:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async (name) => {
            if (name && name.trim()) {
              const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
              const contactId = await addContact(name.trim(), randomColor as any);
              if (contactId) {
                router.push(`/chat?contactId=${contactId}`);
              }
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const renderContact = ({ item }: { item: any }) => {
    const conversation = data?.conversations.find(c => c.contactId === item.id);
    const lastMessage = conversation?.lastMessageId 
      ? data?.messages.find(m => m.id === conversation.lastMessageId)
      : null;

    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => router.push(`/chat?contactId=${item.id}`)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          {lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage.content}
            </Text>
          )}
          {conversation && conversation.messageCount > 0 && (
            <Text style={styles.messageCount}>
              {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        
        <View style={styles.contactActions}>
          {lastMessage && (
            <Text style={styles.timestamp}>
              {lastMessage.timestamp.toLocaleDateString()}
            </Text>
          )}
          {conversation?.isLocked && (
            <Text style={styles.lockIcon}>🔒</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Unspoken</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {data?.contacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first conversation to start expressing your unspoken thoughts
            </Text>
          </View>
        ) : (
          <FlatList
            data={data?.contacts}
            renderItem={renderContact}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => {
          setDonationModalOpen(false);
          markDonationPromptShown();
        }}
        messageCount={data?.settings.totalMessagesSent || 0}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F5F5F5',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F5F5F5',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#2D2D2D',
    borderRadius: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D49A6A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F5F5F5',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  messageCount: {
    fontSize: 12,
    color: '#D49A6A',
  },
  contactActions: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#808080',
    marginBottom: 4,
  },
  lockIcon: {
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#D49A6A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
});