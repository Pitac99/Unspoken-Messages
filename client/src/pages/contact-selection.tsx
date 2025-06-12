import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import * as Contacts from 'expo-contacts';
import { useTheme } from "@/context/ThemeContext";
import ProgressBarAndroid from '@react-native-community/progress-bar-android';
import Clipboard from '@react-native-clipboard/clipboard';
import PushNotificationIOS from '@react-native-community/push-notification-ios';



type Props = NativeStackScreenProps<RootStackParamList, 'ContactSelection'>;

export default function ContactSelectionPage({ navigation }: Props) {
  const [newContactName, setNewContactName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [phoneContacts, setPhoneContacts] = useState<Contacts.Contact[]>([]);
  const [showPhoneContacts, setShowPhoneContacts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, addContact } = useAppData();
  const { toast } = useToast();
  const { theme } = useTheme();
  const styles = getStyles(theme);

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
      const { status, canAskAgain } = await Contacts.getPermissionsAsync();
  
      // Daca nu avem permisiune, o cerem din nou
      if (status !== 'granted' && canAskAgain) {
        const { status: newStatus } = await Contacts.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          toast({
            title: "Permission Denied",
            description: "Cannot access phone contacts. Please create contacts manually.",
            variant: "destructive",
          });
          return;
        }
      }
  
      // Daca permisiunea a fost deja data, dar doar partial, cerem utilizatorului sa mearga in settings
      
      // Daca totul e OK, incarcam contactele
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
        <Text style={styles.title}>Unspoken message to...</Text>
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
              <Text style={styles.createContactButtonText}>Begin your expressive writing</Text>
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
            <Text style={styles.reassuranceText}>
  Don’t worry — selecting a contact does not send anything or create a real connection. Only the name is copied locally.
</Text>
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
            <View style={{ paddingTop: 20, alignItems: 'center' }}>
    <Text style={{ color: '#A0A0A0', textAlign: 'center', marginBottom: 8 }}>
    Manage Contacts permissions from Phone Settings
  </Text></View>
          </View>
        )}
      </View>
    </View>
  );
}

function getStyles(theme: "light" | "dark") {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? '#1E1E1E' : '#FFFFFF',
    },
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
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      textAlign: 'left',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    subtitle: {
      fontSize: 16,
      color: theme === "dark" ? '#A0A0A0' : '#555',
      marginBottom: 24,
      textAlign: 'center',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#D49A6A',
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 24,
      marginBottom: 12,
    },
    phoneButton: {
      backgroundColor: theme === "dark" ? '#D49A6A' : '#FFC785',
    },
    createButton: {
      backgroundColor: theme === "dark" ? '#F5F5F5' : '#232323',
    },
    buttonText: {
      color: theme === "dark" ? '#1E1E1E' : '#232323',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    createButtonText: {
      color: theme === "dark" ? '#232323' : '#F5F5F5',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    centeredOptionsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    formContainer: {
      backgroundColor: theme === "dark" ? '#2D2D2D' : '#F5F5F5',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
    },
    formHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    formTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme === "dark" ? '#F5F5F5' : '#232323',
    },
    cancelButton: {
      padding: 8,
    },
    cancelButtonText: {
      color: theme === "dark" ? '#A0A0A0' : '#555',
      fontSize: 16,
    },
    input: {
      backgroundColor: theme === "dark" ? '#1E1E1E' : '#FFFFFF',
      borderWidth: 1,
      borderColor: theme === "dark" ? '#383838' : '#E0E0E0',
      borderRadius: 8,
      padding: 12,
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      fontSize: 16,
      marginBottom: 16,
    },
    createContactButton: {
      backgroundColor: '#D49A6A',
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    createContactButtonText: {
      color: '#1E1E1E',
      fontSize: 16,
      fontWeight: '600',
    },
    searchInput: {
      backgroundColor: theme === "dark" ? '#1E1E1E' : '#FFFFFF',
      borderWidth: 1,
      borderColor: theme === "dark" ? '#383838' : '#E0E0E0',
      borderRadius: 8,
      padding: 12,
      color: theme === "dark" ? '#F5F5F5' : '#232323',
      fontSize: 16,
      marginBottom: 16,
    },
    contactsList: {
      maxHeight: 300,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? '#383838' : '#E0E0E0',
    },
    emptyText: {
      color: theme === "dark" ? '#A0A0A0' : '#555',
      textAlign: 'center',
      marginTop: 24,
    },
    backButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#2D2D2D',
      justifyContent: 'center',
      alignItems: 'center',
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
    reassuranceText: {
      fontSize: 13,
      color: theme === "dark" ? '#A0A0A0' : '#555',
      marginBottom: 12,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    contactName: { fontSize: 16, color: theme === "dark" ? '#F5F5F5' : '#232323', marginLeft: 10,},
  });
}
