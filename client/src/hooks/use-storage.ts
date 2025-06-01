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

  const addContact = useCallback((name: string) => {
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

    updateData(data => {
      const newContact: Contact = {
        id: crypto.randomUUID(),
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
      };

      return {
        ...data,
        contacts: [...data.contacts, newContact],
        conversations: [...data.conversations, newConversation],
      };
    });
  }, [updateData]);

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

      return {
        ...data,
        messages: [...data.messages, message],
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
        const aTime = a!.lastMessageAt?.getTime() || 0;
        const bTime = b!.lastMessageAt?.getTime() || 0;
        return bTime - aTime;
      });
  }, [data]);

  return {
    data,
    isLoading,
    addContact,
    addMessage,
    deleteContact,
    updateSettings,
    getContactMessages,
    getConversationsWithContacts,
  };
}
