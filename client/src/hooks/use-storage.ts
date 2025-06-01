import { useState, useEffect, useCallback } from "react";
import { storage } from "../lib/storage";
import type { AppData, Contact, Message, Conversation, AvatarColor } from "../types";

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        let appData = storage.getAppData();
        if (!appData) {
          appData = storage.initializeAppData();
        }
        setData(appData);
      } catch (error) {
        console.error("Failed to load app data:", error);
        // Initialize with default data if loading fails
        const defaultData = storage.initializeAppData();
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateData = useCallback((updater: (data: AppData) => AppData) => {
    setData(currentData => {
      if (!currentData) return null;
      
      const newData = updater(currentData);
      try {
        storage.setAppData(newData);
        return newData;
      } catch (error) {
        console.error("Failed to save app data:", error);
        return currentData;
      }
    });
  }, []);

  const updateDataSync = useCallback((updater: (data: AppData) => AppData): AppData | null => {
    const currentData = data;
    if (!currentData) return null;
    
    const newData = updater(currentData);
    try {
      storage.setAppData(newData);
      setData(newData);
      return newData;
    } catch (error) {
      console.error("Failed to save app data:", error);
      return currentData;
    }
  }, [data]);

  const addContact = useCallback((name: string): string => {
    const avatarColors: AvatarColor[] = [
      "from-pink-500 to-rose-600",
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-violet-600",
      "from-green-500 to-emerald-600",
      "from-orange-500 to-amber-600",
      "from-red-500 to-pink-600",
      "from-cyan-500 to-blue-600",
      "from-violet-500 to-purple-600",
    ];

    const contactId = crypto.randomUUID();

    const updatedData = updateDataSync(data => {
      const newContact: Contact = {
        id: contactId,
        name,
        avatar: name.charAt(0).toUpperCase(),
        color: avatarColors[data.contacts.length % avatarColors.length],
        createdAt: new Date(),
      };

      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        contactId: newContact.id,
        messageCount: 0,
        unreadCount: 0,
        isClosed: false,
      };

      return {
        ...data,
        contacts: [...data.contacts, newContact],
        conversations: [...data.conversations, newConversation],
      };
    });

    if (!updatedData) {
      throw new Error("Failed to create contact");
    }

    return contactId;
  }, [updateDataSync]);

  const addMessage = useCallback((contactId: string, content: string) => {
    updateData(data => {
      const message: Message = {
        id: crypto.randomUUID(),
        contactId,
        content,
        timestamp: new Date(),
        isRead: true,
      };

      const conversationIndex = data.conversations.findIndex(c => c.contactId === contactId);
      const updatedConversations = [...data.conversations];
      
      if (conversationIndex !== -1) {
        updatedConversations[conversationIndex] = {
          ...updatedConversations[conversationIndex],
          lastMessage: content,
          lastMessageAt: new Date(),
          messageCount: updatedConversations[conversationIndex].messageCount + 1,
        };
      }

      // Update total messages count for donation tracking
      const newTotalMessages = data.settings.totalMessagesSent + 1;

      return {
        ...data,
        messages: [...data.messages, message],
        conversations: updatedConversations,
        settings: {
          ...data.settings,
          totalMessagesSent: newTotalMessages,
        }
      };
    });
  }, [updateData]);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    updateData(data => {
      const messageIndex = data.messages.findIndex(m => m.id === messageId);
      if (messageIndex === -1) return data;

      const updatedMessages = [...data.messages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: newContent,
      };

      // Update conversation's last message if this was the most recent message
      const message = updatedMessages[messageIndex];
      const contactMessages = updatedMessages.filter(m => m.contactId === message.contactId);
      const isLastMessage = contactMessages[contactMessages.length - 1].id === messageId;

      let updatedConversations = data.conversations;
      if (isLastMessage) {
        updatedConversations = data.conversations.map(conv => 
          conv.contactId === message.contactId 
            ? { ...conv, lastMessage: newContent }
            : conv
        );
      }

      return {
        ...data,
        messages: updatedMessages,
        conversations: updatedConversations,
      };
    });
  }, [updateData]);

  const deleteContact = useCallback((contactId: string) => {
    updateData(data => ({
      ...data,
      contacts: data.contacts.filter(c => c.id !== contactId),
      messages: data.messages.filter(m => m.contactId !== contactId),
      conversations: data.conversations.filter(c => c.contactId !== contactId),
    }));
  }, [updateData]);

  const updateSettings = useCallback((settings: Partial<AppData['settings']>) => {
    updateData(data => ({
      ...data,
      settings: { ...data.settings, ...settings },
    }));
  }, [updateData]);

  const getContactMessages = useCallback((contactId: string): Message[] => {
    if (!data) return [];
    return data.messages
      .filter(m => m.contactId === contactId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [data]);

  const getConversationsWithContacts = useCallback(() => {
    if (!data) return [];
    
    return data.conversations
      .map(conv => {
        const contact = data.contacts.find(c => c.id === conv.contactId);
        return contact ? { ...conv, contact } : null;
      })
      .filter(Boolean)
      .sort((a, b) => {
        const aTime = a!.lastMessageAt ? new Date(a!.lastMessageAt).getTime() : 0;
        const bTime = b!.lastMessageAt ? new Date(b!.lastMessageAt).getTime() : 0;
        return bTime - aTime;
      });
  }, [data]);

  const shouldShowDonationModal = useCallback(() => {
    if (!data) return { show: false, interval: 0, totalMessages: 0 };
    
    const totalMessages = data.settings.totalMessagesSent || 0;
    
    // Auto-migrate: add missing donationIntervalsShown field
    if (!data.settings.donationIntervalsShown) {
      updateData(prevData => ({
        ...prevData,
        settings: {
          ...prevData.settings,
          donationIntervalsShown: []
        }
      }));
    }
    
    // Ensure we have the new array structure
    let shownIntervals = data.settings.donationIntervalsShown || [];
    
    // Donation intervals: exactly at messages 3, 8, 15, 30
    const intervals = [3, 8, 15, 30];
    
    // For existing users with high message counts, show modal immediately on multiples of 10
    if (totalMessages > 30 && shownIntervals.length === 0) {
      // Show modal every 10 messages for testing
      if (totalMessages % 10 === 0 && totalMessages > 130) {
        return { show: true, interval: totalMessages, totalMessages };
      }
    }
    
    // Check if we've reached an exact interval and haven't shown it yet
    for (const interval of intervals) {
      if (totalMessages === interval && !shownIntervals.includes(interval)) {
        return { show: true, interval, totalMessages };
      }
    }
    
    return { show: false, interval: 0, totalMessages };
  }, [data, updateData]);

  const markDonationPromptShown = useCallback(() => {
    if (!data) return;
    
    const totalMessages = data.settings.totalMessagesSent;
    const intervals = [3, 8, 15, 30];
    
    // Find the current interval and mark it as shown
    const currentInterval = intervals.find(interval => totalMessages === interval);
    
    if (currentInterval) {
      updateData(prevData => {
        const { lastDonationPrompt, ...settings } = prevData.settings as any;
        return {
          ...prevData,
          settings: {
            ...settings,
            donationIntervalsShown: [...(settings.donationIntervalsShown || []), currentInterval],
          }
        };
      });
    }
  }, [data, updateData]);

  const resetDonationCounter = useCallback(() => {
    if (!data) return;
    
    updateData(prevData => {
      const { lastDonationPrompt, ...settings } = prevData.settings as any;
      return {
        ...prevData,
        settings: {
          ...settings,
          totalMessagesSent: 0,
          donationIntervalsShown: [],
        }
      };
    });
  }, [data, updateData]);

  return {
    data,
    isLoading,
    updateData,
    addContact,
    addMessage,
    editMessage,
    deleteContact,
    updateSettings,
    getContactMessages,
    getConversationsWithContacts,
    shouldShowDonationModal,
    markDonationPromptShown,
    resetDonationCounter,
  };
}
