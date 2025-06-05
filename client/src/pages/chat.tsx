import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { MessageBubble } from "@/components/message-bubble";
import { Keypad } from "@/components/keypad";
import { PinDots } from "@/components/pin-dots";
import { DonationModal } from "@/components/donation-modal";
import { useAppData } from "@/hooks/use-storage";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/auth";
import type { AvatarColor } from "@/types";
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from "@/context/ThemeContext";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

function getStyles(theme: "light" | "dark") {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme === "dark" ? '#1E1E1E' : '#FFFFFF' },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 12,
      minHeight: 85,
      backgroundColor: theme === "dark" ? '#232323' : '#F5F5F5',
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? '#232323' : '#E0E0E0',
    },
    backButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme === "dark" ? '#2D2D2D' : '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#D49A6A',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerAvatarText: {
      color: '#1E1E1E',
      fontSize: 22,
      fontWeight: '700',
    },
    headerTextContainer: {
      flex: 1,
      justifyContent: 'center',
      minWidth: 0,
    },
    headerSubtitle: {
      color: theme === "dark" ? '#A0A0A0' : '#555',
      fontSize: 13,
      marginTop: 2,
    },
    contactName: { fontSize: 18, fontWeight: '600', color: theme === "dark" ? '#F5F5F5' : '#232323' },
    messagesContainer: { flex: 1 },
    messagesContent: { padding: 16 },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingBottom: 0,
      paddingTop: 5,
      
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: 8,
    },
    input: {
      flex: 1,
      minHeight: 56,
      maxHeight: 140,
      backgroundColor: theme === "dark" ? '#2D2D2D' : '#FFFFFF',
      borderRadius: 10,
      paddingHorizontal: 18,
      paddingVertical: 16,
      marginRight: 12,
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      fontSize: 17,
      borderWidth: 1,
      borderColor: theme === "dark" ? '#383838' : '#E0E0E0',
    },
    sendButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#D49A6A',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: { opacity: 0.5 },
    unlockDialog: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme === "dark" ? '#1E1E1E' : '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    unlockTitle: { fontSize: 20, fontWeight: '600', color: theme === "dark" ? '#F5F5F5' : '#232323', marginBottom: 24 },
    headerMoreButton: {
      padding: 8,
      marginLeft: 16,
    },
    optionsModalContent: {
      backgroundColor: theme === "dark" ? '#232323' : '#F5F5F5',
      borderRadius: 20,
      padding: 24,
      width: '90%',
      maxWidth: 350,
      alignItems: 'stretch',
    },
    optionsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 10,
      marginBottom: 8,
      backgroundColor: theme === "dark" ? '#2D2D2D' : '#E0E0E0',
    },
    optionsButtonText: {
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      fontSize: 16,
      fontWeight: '500',
    },
    optionsCancelButton: {
      marginTop: 8,
      backgroundColor: 'transparent',
      alignItems: 'center',
      paddingVertical: 12,
      borderRadius: 10,
    },
    optionsCancelButtonText: {
      color: theme === "dark" ? '#A0A0A0' : '#555',
      fontSize: 16,
      fontWeight: '500',
    },
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      marginBottom: 24,
    },
    saveButton: {
      backgroundColor: '#D49A6A',
      paddingVertical: 12,
      marginTop: 8,
      borderRadius: 10,
      alignItems: 'center',
    },
    saveButtonDisabled: { opacity: 0.5 },
    saveButtonText: {
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      fontSize: 16,
      fontWeight: '500',
    },
    unlockButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#D49A6A',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginTop: 24,
    },
    unlockButtonText: {
      color: '#1E1E1E',
      fontSize: 16,
      fontWeight: '600',
    },
  });
}

export default function ChatPage({ navigation, route }: Props) {
  const { contactId } = route.params;
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [unlockPin, setUnlockPin] = useState("");
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data, addMessage, editMessage, getContactMessages, updateData, shouldShowDonationModal, markDonationPromptShown, reloadData, deleteMessage } = useAppData();
  const { toast } = useToast();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigation.replace('PinAuth');
      return;
    }
    auth.extendSession();
  }, [navigation]);

  // Reload data when the chat page comes into focus
  useFocusEffect(
    React.useCallback(() => {
      reloadData();
    }, [reloadData])
  );

  const contact = data?.contacts.find(c => c.id === contactId);
  const conversation = data?.conversations.find(c => c.contactId === contactId);
  const messages = getContactMessages(contactId || "");
  const isClosed = conversation?.isClosed || false;

  useEffect(() => {
    if (!contactId || typeof contactId !== 'string') {
      navigation.navigate('Home');
      return;
    }
  }, [contactId, navigation]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Donation modal logic
  useEffect(() => {
    const { show } = shouldShowDonationModal();
    if (show) {
      setDonationModalOpen(true);
    }
  }, [data?.settings.totalMessagesSent]);

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !contactId || isLoading) return;
    setIsLoading(true);
    try {
      setMessage("");
      await addMessage(contactId, trimmedMessage);
      await reloadData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const displayContact = contact || {
    id: contactId,
    name: "New Contact",
    avatar: "?",
    color: "from-blue-500 to-indigo-600",
    imageUrl: undefined,
  };

  // Modal state for options
  const openOptionsModal = () => {
    Keyboard.dismiss();
    setOptionsDialogOpen(true);
  };
  const closeOptionsModal = () => setOptionsDialogOpen(false);

  // Delete all messages for this contact
  const handleDeleteAllMessages = () => {
    updateData(data => ({
      ...data,
      messages: data.messages.filter(m => m.contactId !== contactId),
    }));
    toast({ title: 'Messages Deleted', description: 'All messages have been deleted.' });
    closeOptionsModal();
  };

  // Rename contact (reuse modal logic)
  const handleRenameFromOptions = () => {
    closeOptionsModal();
    setRenameDialogOpen(true);
  };

  // Change avatar color
  const handleChangeAvatar = () => {
    if (!contact) return;
    const colors: AvatarColor[] = [
      "from-pink-500 to-rose-600",
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-violet-600",
      "from-green-500 to-emerald-600",
      "from-orange-500 to-amber-600",
      "from-red-500 to-pink-600",
      "from-cyan-500 to-blue-600",
      "from-violet-500 to-purple-600",
    ];
    const currentColorIndex = colors.indexOf(contact.color as AvatarColor);
    const nextColorIndex = (currentColorIndex + 1) % colors.length;
    const newColor = colors[nextColorIndex] as AvatarColor;
    updateData(data => ({
      ...data,
      contacts: data.contacts.map(c =>
        c.id === contact.id ? { ...c, color: newColor } : c
      )
    }));
    toast({ title: 'Avatar Updated', description: 'Contact avatar color has been changed.' });
    closeOptionsModal();
  };

  // Change avatar image
  const handleUploadImage = async () => {
    if (!contact) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0].uri) {
        updateData(data => ({
          ...data,
          contacts: data.contacts.map(c =>
            c.id === contact.id ? { ...c, imageUrl: result.assets[0].uri } : c
          )
        }));
        toast({ title: 'Success', description: 'Avatar image updated successfully.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update avatar image.' });
    }
    closeOptionsModal();
  };

  // Remove avatar image
  const handleRemovePicture = () => {
    if (!contact) return;
    updateData(data => ({
      ...data,
      contacts: data.contacts.map(c =>
        c.id === contact.id ? { ...c, imageUrl: undefined } : c
      )
    }));
    toast({ title: 'Picture Removed', description: 'Avatar picture removed. Default avatar restored.' });
    closeOptionsModal();
  };

  // Mark conversation as closed
  const handleClosure = () => {
    updateData(data => ({
      ...data,
      conversations: data.conversations.map(conv =>
        conv.contactId === contactId ? { ...conv, isClosed: true } : conv
      )
    }));
    toast({ title: 'Conversation Closed', description: 'This conversation is now closed.' });
    closeOptionsModal();
  };

  // Unlock conversation
  const handleUnlock = () => {
    setUnlockDialogOpen(true);
    setUnlockPin("");
  };

  // Unlock PIN logic
  useEffect(() => {
    const tryUnlock = async () => {
      if (unlockDialogOpen && unlockPin.length === 4) {
        if (!contact) return;
        const ok = await auth.authenticate(unlockPin);
        if (ok) {
          updateData(data => ({
            ...data,
            conversations: data.conversations.map(conv =>
              conv.contactId === contactId ? { ...conv, isClosed: false } : conv
            )
          }));
          setUnlockDialogOpen(false);
          setUnlockPin("");
          toast({ title: 'Conversation Unlocked', description: 'You can now continue this conversation.' });
        } else {
          toast({ title: 'Incorrect PIN', description: 'The PIN you entered is incorrect.', variant: 'destructive' });
          setUnlockPin("");
        }
      }
    };
    tryUnlock();
  }, [unlockPin, unlockDialogOpen]);

  // --- Modal for renaming contact ---
  const renderRenameModal = () => (
    renameDialogOpen && (
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => {
          setRenameDialogOpen(false);
          setNewContactName("");
        }}
      >
        <TouchableOpacity
          style={styles.optionsModalContent}
          activeOpacity={1}
          onPress={e => e.stopPropagation && e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>Rename Contact</Text>
          <TextInput
            style={styles.input}
            value={newContactName || (contact?.name ?? '')}
            onChangeText={setNewContactName}
            maxLength={32}
            placeholder="Enter new name"
            placeholderTextColor="#A0A0A0"
            autoFocus
          />
          <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
            <TouchableOpacity
              style={[styles.optionsCancelButton, { flex: 1, borderWidth: 1, borderColor: '#383838', alignItems: 'center', justifyContent: 'center' }]}
              onPress={() => {
                setRenameDialogOpen(false);
                setNewContactName("");
              }}
            >
              <Text style={styles.optionsCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, (!newContactName.trim()) && styles.saveButtonDisabled, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}
              onPress={() => {
                if (!contact || !newContactName.trim()) return;
                updateData(data => ({
                  ...data,
                  contacts: data.contacts.map(c =>
                    c.id === contact.id
                      ? { ...c, name: newContactName.trim(), avatar: newContactName.trim().charAt(0).toUpperCase() }
                      : c
                  )
                }));
                toast({
                  title: "Contact Renamed",
                  description: `Contact renamed to ${newContactName.trim()}`,
                });
                setRenameDialogOpen(false);
                setNewContactName("");
              }}
              disabled={!newContactName.trim()}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  );

  // --- Modal for options ---
  const renderOptionsModal = () => (
    optionsDialogOpen && (
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={closeOptionsModal}
      >
        <TouchableOpacity
          style={styles.optionsModalContent}
          activeOpacity={1}
          onPress={e => e.stopPropagation && e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>Conversation Options</Text>
          <TouchableOpacity style={styles.optionsButton} onPress={handleDeleteAllMessages}>
            <Ionicons name="trash" size={18} color="#FF5A5A" style={{ marginRight: 10 }} />
            <Text style={[styles.optionsButtonText, { color: '#FF5A5A' }]}>Delete All Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionsButton} onPress={handleRenameFromOptions}>
            <Ionicons name="pencil" size={18} color="#D49A6A" style={{ marginRight: 10 }} />
            <Text style={styles.optionsButtonText}>Rename</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionsButton} onPress={handleUploadImage}>
            <Ionicons name="image" size={18} color="#D49A6A" style={{ marginRight: 10 }} />
            <Text style={styles.optionsButtonText}>Change Picture</Text>
          </TouchableOpacity>
          {contact?.imageUrl && (
            <TouchableOpacity style={styles.optionsButton} onPress={handleRemovePicture}>
              <Ionicons name="close-circle" size={18} color="#D49A6A" style={{ marginRight: 10 }} />
              <Text style={styles.optionsButtonText}>Remove Picture</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.optionsButton} onPress={handleClosure}>
            <Ionicons name="lock-closed" size={18} color="#D49A6A" style={{ marginRight: 10 }} />
            <Text style={styles.optionsButtonText}>Closure</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionsCancelButton} onPress={closeOptionsModal}>
            <Text style={styles.optionsCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  );

  // Editing message logic
  const inputRef = useRef<TextInput>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // When editing, set input and focus
  const handleEditMessage = (msgId: string, content: string) => {
    setEditingMessageId(msgId);
    setMessage(content);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Save edited message
  const handleSaveEdit = async () => {
    if (editingMessageId && message.trim()) {
      await editMessage(editingMessageId, message.trim());
      setEditingMessageId(null);
      setMessage("");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setMessage("");
  };

  // Helper to map AvatarColor to real color value
  const getAvatarBgColor = (color: AvatarColor | undefined) => {
    switch (color) {
      case 'from-pink-500 to-rose-600': return '#EC4899';
      case 'from-blue-500 to-indigo-600': return '#3B82F6';
      case 'from-purple-500 to-violet-600': return '#8B5CF6';
      case 'from-green-500 to-emerald-600': return '#10B981';
      case 'from-orange-500 to-amber-600': return '#F59E42';
      case 'from-red-500 to-pink-600': return '#EF4444';
      case 'from-cyan-500 to-blue-600': return '#06B6D4';
      case 'from-violet-500 to-purple-600': return '#7C3AED';
      default: return '#D49A6A';
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
    toast({ title: 'Message Deleted', description: 'The message has been deleted.' });
    if (editingMessageId === messageId) {
      setEditingMessageId(null);
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        Platform.OS === 'android' && { paddingBottom: 25 }
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#F5F5F5" />
        </TouchableOpacity>
        {/* Avatar */}
        <TouchableOpacity onPress={handleUploadImage} activeOpacity={0.7}>
          {displayContact.imageUrl ? (
            <Image
              source={{ uri: displayContact.imageUrl }}
              style={styles.headerAvatar}
            />
          ) : (
            <View style={[styles.headerAvatar, { backgroundColor: getAvatarBgColor(displayContact.color) }]}> 
              <Text style={styles.headerAvatarText}>{displayContact.avatar}</Text>
            </View>
          )}
        </TouchableOpacity>
        {/* Name and subtitle */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.contactName}>{displayContact.name}</Text>
          <Text style={styles.headerSubtitle}>Therapeutic Conversation</Text>
        </View>
        {/* Three dots button */}
        <TouchableOpacity style={styles.headerMoreButton} onPress={openOptionsModal}>
          <Ionicons name="ellipsis-vertical" size={22} color="#A0A0A0" />
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {isClosed ? (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onEdit={handleEditMessage}
                isEditMode={!isClosed}
                isEditing={editingMessageId === msg.id}
                onDelete={!isClosed ? handleDeleteMessage : undefined}
              />
            ))}
            <View style={{ backgroundColor: '#2D2D2D', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 20 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ color: '#fff', fontSize: 24 }}>✓</Text>
              </View>
              <Text style={{ color: '#F5F5F5', fontSize: 18, marginBottom: 4 }}>We are glad you found closure</Text>
              <Text style={{ color: '#A0A0A0', fontSize: 14 }}>This therapeutic conversation has reached its closure.</Text>
            </View>
            {/* Unlock button */}
            <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
              <Ionicons name="lock-open" size={20} color="#1E1E1E" style={{ marginRight: 8 }} />
              <Text style={styles.unlockButtonText}>Unlock</Text>
            </TouchableOpacity>
          </View>
        ) : messages.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#D49A6A', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ color: '#1E1E1E', fontSize: 24 }}>{displayContact.avatar}</Text>
            </View>
            <Text style={{ fontSize: 18, color: theme === 'dark' ? '#F5F5F5' : '#1E1E1E', marginBottom: 8, textAlign: 'center' }}>Start your conversation with {"\n"} {displayContact.name}</Text>
            <Text style={{ color: '#A0A0A0', fontSize: 14, textAlign: 'center' }}>This is a safe space to express your thoughts and feelings.</Text>
          </View>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onEdit={handleEditMessage}
              isEditMode={!isClosed}
              isEditing={editingMessageId === msg.id}
              onDelete={!isClosed ? handleDeleteMessage : undefined}
            />
          ))
        )}
      </ScrollView>

      {!isClosed && (
        <>
          <View style={{ height: 1, backgroundColor: theme === 'dark' ? '#383838' : '#E0E0E0', width: '100%' }} />
          <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              placeholderTextColor="#A0A0A0"
              multiline
              maxLength={2000}
              returnKeyType={editingMessageId ? 'done' : 'default'}
              onSubmitEditing={editingMessageId ? handleSaveEdit : undefined}
            />
            {editingMessageId ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                <TouchableOpacity
                  style={[styles.sendButton, (!message.trim() || isLoading) && styles.sendButtonDisabled, { width: 40, height: 40, borderRadius: 20 }]}
                  onPress={handleSaveEdit}
                  disabled={!message.trim() || isLoading}
                >
                  <Ionicons name="checkmark" size={18} color="#1E1E1E" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: '#A0A0A0', marginLeft: 6, width: 40, height: 40, borderRadius: 20 }]}
                  onPress={handleCancelEdit}
                >
                  <Ionicons name="close" size={18} color="#1E1E1E" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: '#EF4444', marginLeft: 6, width: 40, height: 40, borderRadius: 20 }]}
                  onPress={() => handleDeleteMessage(editingMessageId)}
                >
                  <Ionicons name="trash" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.sendButton, (!message.trim() || isLoading) && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!message.trim() || isLoading}
              >
                {isLoading ? <ActivityIndicator color="#1E1E1E" size="small" /> : <Ionicons name="send" size={20} color="#1E1E1E" />}
              </TouchableOpacity>
            )}
          </View>
          
        </>
      )}

      {unlockDialogOpen && (
        <View style={styles.unlockDialog}>
          <Text style={styles.unlockTitle}>Enter PIN to Unlock</Text>
          <PinDots length={4} filled={unlockPin.length} />
          <View style={{ height: 24 }} />
          <Keypad onNumberPress={(n) => {
            if (unlockPin.length < 4) setUnlockPin(prev => prev + n);
          }} onDelete={() => setUnlockPin(prev => prev.slice(0, -1))} />
        </View>
      )}

      {donationModalOpen && (
        <DonationModal
          isOpen={donationModalOpen}
          onClose={() => {
            setDonationModalOpen(false);
            markDonationPromptShown();
          }}
          messageCount={data?.settings.totalMessagesSent || 0}
        />
      )}

      {/* Rename Modal */}
      {renderRenameModal()}
      {/* Options Modal */}
      {renderOptionsModal()}
    </KeyboardAvoidingView>
  );
}
