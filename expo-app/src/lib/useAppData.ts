import { useState, useEffect, useCallback } from 'react';
import { AppData, Contact, Message, AvatarColor } from '@/types';
import { storage } from './storage';
import { v4 as uuidv4 } from 'uuid';

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      let appData = await storage.getAppData();
      
      if (!appData) {
        appData = storage.initializeAppData();
        await storage.setAppData(appData);
      }
      
      // Auto-migrate: add missing donationIntervalsShown field
      if (!appData.settings.donationIntervalsShown) {
        appData.settings.donationIntervalsShown = [];
        await storage.setAppData(appData);
      }
      
      setData(appData);
    } catch (error) {
      console.error('Failed to load data:', error);
      const defaultData = storage.initializeAppData();
      setData(defaultData);
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = useCallback(async (updater: (data: AppData) => AppData) => {
    if (!data) return;
    
    try {
      const newData = updater(data);
      setData(newData);
      await storage.setAppData(newData);
    } catch (error) {
      console.error('Failed to update data:', error);
    }
  }, [data]);

  const addContact = useCallback(async (name: string, color: AvatarColor) => {
    if (!data) return;

    const contactId = uuidv4();
    const newContact: Contact = {
      id: contactId,
      name,
      avatar: name.charAt(0).toUpperCase(),
      color,
      createdAt: new Date(),
    };

    const conversationId = uuidv4();
    const newConversation = {
      id: conversationId,
      contactId,
      messageCount: 0,
      isLocked: false,
    };

    await updateData(prevData => ({
      ...prevData,
      contacts: [...prevData.contacts, newContact],
      conversations: [...prevData.conversations, newConversation],
    }));

    return contactId;
  }, [data, updateData]);

  const addMessage = useCallback(async (contactId: string, content: string) => {
    if (!data) return;

    const messageId = uuidv4();
    const message: Message = {
      id: messageId,
      contactId,
      content,
      timestamp: new Date(),
      isRead: true,
    };

    await updateData(prevData => {
      const updatedContacts = prevData.contacts.map(contact =>
        contact.id === contactId
          ? { ...contact, lastMessageAt: new Date() }
          : contact
      );

      const updatedConversations = prevData.conversations.map(conv =>
        conv.contactId === contactId
          ? {
              ...conv,
              lastMessageId: messageId,
              lastMessageAt: new Date(),
              messageCount: conv.messageCount + 1,
            }
          : conv
      );

      return {
        ...prevData,
        contacts: updatedContacts,
        messages: [...prevData.messages, message],
        conversations: updatedConversations,
        settings: {
          ...prevData.settings,
          totalMessagesSent: prevData.settings.totalMessagesSent + 1,
        },
      };
    });

    return messageId;
  }, [data, updateData]);

  const getContactMessages = useCallback((contactId: string) => {
    if (!data) return [];
    return data.messages
      .filter(message => message.contactId === contactId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [data]);

  const shouldShowDonationModal = useCallback(() => {
    if (!data) return { show: false, interval: 0, totalMessages: 0 };
    
    const totalMessages = data.settings.totalMessagesSent || 0;
    const shownIntervals = data.settings.donationIntervalsShown || [];
    
    // Donation intervals: exactly at messages 3, 8, 15, 30
    const intervals = [3, 8, 15, 30];
    
    // For existing users with high message counts, integrate into next cycle
    if (totalMessages > 30 && shownIntervals.length === 0) {
      const remainderInCycle = totalMessages % 30;
      const targetIntervals = [3, 8, 15, 30];
      
      for (const interval of targetIntervals) {
        if (remainderInCycle === interval) {
          return { show: true, interval, totalMessages };
        }
      }
    }
    
    // Check if we've reached an exact interval and haven't shown it yet
    for (const interval of intervals) {
      if (totalMessages === interval && !shownIntervals.includes(interval)) {
        return { show: true, interval, totalMessages };
      }
    }
    
    return { show: false, interval: 0, totalMessages };
  }, [data]);

  const markDonationPromptShown = useCallback(async () => {
    if (!data) return;
    
    const donationCheck = shouldShowDonationModal();
    if (donationCheck.show) {
      await updateData(prevData => ({
        ...prevData,
        settings: {
          ...prevData.settings,
          donationIntervalsShown: [...(prevData.settings.donationIntervalsShown || []), donationCheck.interval],
        }
      }));
    }
  }, [data, updateData, shouldShowDonationModal]);

  const clearAllData = useCallback(async () => {
    try {
      await storage.clearAllData();
      const defaultData = storage.initializeAppData();
      setData(defaultData);
      await storage.setAppData(defaultData);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }, []);

  return {
    data,
    isLoading,
    updateData,
    addContact,
    addMessage,
    getContactMessages,
    shouldShowDonationModal,
    markDonationPromptShown,
    clearAllData,
    reload: loadData,
  };
}