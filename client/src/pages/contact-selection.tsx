import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import * as Contacts from 'expo-contacts';

type Props = NativeStackScreenProps<RootStackParamList, 'ContactSelection'>;

export default function ContactSelectionPage({ navigation }: Props) {
  const [newContactName, setNewContactName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [phoneContacts, setPhoneContacts] = useState<Contacts.Contact[]>([]);
  const [showPhoneContacts, setShowPhoneContacts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, addContact } = useAppData();
  const { toast } = useToast();

  const handleBack = () => {
    navigation.navigate('Home');
  };

  const handleCreateContact = async () => {
    const name = newContactName.trim();
    if (!name) {
      toast({ title: "Name Required", description: "Please enter a contact name.", variant: "destructive" });
      return;
    }

    if (data?.contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase())) {
      toast({ title: "Contact Exists", description: "A contact with this name already exists.", variant: "destructive" });
      return;
    }

    try {
      const contactId = await addContact(name);
      toast({ title: "Contact Created", description: `${name} has been added.` });
      navigation.navigate('Chat', { contactId });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create contact.", variant: "destructive" });
    }
  };

  const handleAccessPhoneContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name],
        });

        if (data.length > 0) {
          setPhoneContacts(data);
          setShowPhoneContacts(true);
        } else {
          toast({
            title: "No Contacts",
            description: "No contacts found on your device.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Permission Denied",
          description: "Cannot access phone contacts. Please create contacts manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access contacts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePhoneContactSelect = async (contact: Contacts.Contact) => {
    const name = contact.name || 'Unknown Contact';

    try {
      // 🛡️ Doar se copiaza numele local — nu se salveaza in contactele reale
      const contactId = await addContact(name);
      toast({
        title: "Contact Added",
        description: `${name} has been added from your phone contacts.`,
      });
      navigation.replace('Chat', { contactId });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filtered contacts for search
  const filteredContacts = phoneContacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#F5F5F5" />
        </TouchableOpacity>
        <Text style={styles.title}>New Conversation</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {!showCreateForm && !showPhoneContacts ? (
          <View style={styles.centeredOptionsContainer}>
            <Text style={styles.subtitle}>Choose how to add a contact</Text>
            {/* Access phone contacts */}
            <TouchableOpacity
              onPress={handleAccessPhoneContacts}
              style={[styles.button, styles.phoneButton]}
            >
              <Ionicons name="phone-portrait-outline" size={20} color="#F5F5F5" />
              <Text style={styles.buttonText}>Access Phone Contacts</Text>
            </TouchableOpacity>
            {/* Create new contact */}
            <TouchableOpacity
              onPress={() => setShowCreateForm(true)}
              style={[styles.button, styles.createButton]}
            >
              <Ionicons name="person-add-outline" size={20} color="#1E1E1E" />
              <Text style={styles.createButtonText}>Create New Contact</Text>
            </TouchableOpacity>
          </View>
        ) : showCreateForm ? (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Create New Contact</Text>
              <TouchableOpacity
                onPress={() => setShowCreateForm(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={newContactName}
              onChangeText={setNewContactName}
              placeholder="Enter contact name..."
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleCreateContact}
            />
            <TouchableOpacity
              onPress={handleCreateContact}
              style={styles.createContactButton}
            >
              <Text style={styles.createContactButtonText}>Create & Start Conversation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Phone Contacts</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowPhoneContacts(false);
                  setPhoneContacts([]);
                  setSearchTerm("");
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {/* Search input */}
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search contacts..."
              placeholderTextColor="#A0A0A0"
              style={styles.searchInput}
              autoFocus
              returnKeyType="search"
            />
            <ScrollView style={styles.contactsList}>
              {filteredContacts.length === 0 ? (
                <Text style={styles.emptyText}>No contacts found or access denied</Text>
              ) : (
                filteredContacts.map((contact, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePhoneContactSelect(contact)}
                    style={styles.contactItem}
                  >
                    <View style={styles.contactAvatar}>
                      <Text style={styles.contactInitial}>
                        {(contact.name?.[0] || '?').toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.contactName}>
                      {contact.name || 'Unknown Contact'}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E1E' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 12,
    minHeight: 85,
    backgroundColor: '#232323',
    borderBottomWidth: 1,
    borderBottomColor: '#232323',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2D2D2D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F5F5F5',
  },
  content: { flex: 1, paddingHorizontal: 24 },
  centeredOptionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F5F5F5',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 56,
    justifyContent: 'center',
  },
  phoneButton: {
    backgroundColor: '#2D2D2D',
    borderWidth: 1,
    borderColor: '#383838',
  },
  createButton: {
    backgroundColor: '#D49A6A',
  },
  buttonText: { fontSize: 18, color: '#F5F5F5', fontWeight: '500', textAlign: 'center' },
  createButtonText: {
    fontSize: 18,
    color: '#1E1E1E',
    fontWeight: '700',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#2D2D2D',
    borderRadius: 16,
    padding: 16,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  formTitle: { fontSize: 16, fontWeight: '500', color: '#F5F5F5' },
  cancelButton: { padding: 8 },
  cancelButtonText: { fontSize: 14, color: '#A0A0A0' },
  input: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#383838',
    borderRadius: 12,
    padding: 12,
    color: '#F5F5F5',
    fontSize: 16,
    marginBottom: 12,
  },
  createContactButton: {
    backgroundColor: '#D49A6A',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  createContactButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E1E1E',
  },
  contactsList: { maxHeight: 300 },
  emptyText: {
    textAlign: 'center',
    color: '#A0A0A0',
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#383838',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitial: {
    fontSize: 18,
    fontWeight: '500',
    color: '#F5F5F5',
  },
  contactName: { fontSize: 16, color: '#F5F5F5' },
  searchInput: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 12,
    color: '#F5F5F5',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#383838',
  },
});
