import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppData } from '@/lib/useAppData';

export default function ChatScreen() {
  const router = useRouter();
  const { contactId } = useLocalSearchParams();
  const { data, addMessage } = useAppData();
  const [messageText, setMessageText] = useState('');

  const contact = data?.contacts.find(c => c.id === contactId);
  const conversation = data?.conversations.find(c => c.contactId === contactId);
  const messages = data?.messages
    .filter(m => m.contactId === contactId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handleSendMessage = async () => {
    if (messageText.trim() && contactId) {
      await addMessage(contactId as string, messageText.trim());
      setMessageText('');
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={styles.messageContainer}>
      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  if (!contact) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Contact not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <View style={styles.contactInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{contact.avatar}</Text>
            </View>
            <View>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.messageCount}>
                {conversation?.messageCount || 0} message{conversation?.messageCount !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Start your conversation</Text>
              <Text style={styles.emptySubtitle}>
                This is your private space to express thoughts and feelings to {contact.name}
              </Text>
            </View>
          ) : (
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Write your unspoken message..."
            placeholderTextColor="#808080"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: messageText.trim() ? 1 : 0.5 }]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#383838',
  },
  backButton: {
    fontSize: 24,
    color: '#D49A6A',
    fontWeight: 'bold',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D49A6A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F5F5F5',
    marginBottom: 2,
  },
  messageCount: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  placeholder: {
    width: 24,
  },
  messagesContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F5F5F5',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBubble: {
    backgroundColor: '#2D2D2D',
    borderRadius: 16,
    padding: 16,
    maxWidth: '85%',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: '#F5F5F5',
    lineHeight: 22,
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#808080',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#383838',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2D2D2D',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#F5F5F5',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#D49A6A',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 100,
  },
});