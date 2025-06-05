import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from "date-fns";
import { Ionicons } from '@expo/vector-icons';
import type { Message } from "../types";
import { useTheme } from "@/context/ThemeContext";

interface MessageBubbleProps {
  message: Message;
  style?: any;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  isEditMode?: boolean;
  isEditing?: boolean;
}

export function MessageBubble({ message, style, onEdit, onDelete, isEditMode = true, isEditing = false }: MessageBubbleProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const timeStr = format(new Date(message.timestamp), "h:mm a");

  const handlePress = () => {
    if (isEditMode && onEdit) {
      onEdit(message.id, message.content);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.bubbleContainer}>
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.messageBubble,
            isEditMode && styles.editableBubble,
            isEditing && { borderWidth: 2, borderColor: '#D49A6A' }
          ]}
          activeOpacity={isEditMode ? 0.7 : 1}
        >
          <Text style={styles.messageText}>{message.content}</Text>
          <Text style={styles.messageNote}>
            (This message was released. It was not sent.)
          </Text>
          <View style={styles.messageTail} />
        </TouchableOpacity>
        <Text style={styles.timestamp}>{timeStr}</Text>
      </View>
    </View>
  );
}

function getStyles(theme: "light" | "dark") {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 16,
    },
    bubbleContainer: {
      maxWidth: '80%',
    },
    messageBubble: {
      backgroundColor: theme === "dark" ? '#D49A6A' : '#F5F5F5',
      borderRadius: 16,
      borderBottomRightRadius: 4,
      padding: 12,
      position: 'relative',
    },
    editableBubble: {
      opacity: 1,
    },
    messageText: {
      color: theme === "dark" ? '#1E1E1E' : '#232323',
      fontSize: 14,
      lineHeight: 20,
    },
    messageNote: {
      color: theme === "dark" ? '#8B5A2B' : '#A0A0A0',
      fontSize: 12,
      fontStyle: 'italic',
      marginTop: 4,
    },
    messageTail: {
      position: 'absolute',
      bottom: 0,
      right: -8,
      width: 0,
      height: 0,
      borderLeftWidth: 8,
      borderLeftColor: theme === "dark" ? '#D49A6A' : '#F5F5F5',
      borderBottomWidth: 8,
      borderBottomColor: 'transparent',
    },
    timestamp: {
      color: theme === "dark" ? '#A0A0A0' : '#555',
      fontSize: 12,
      textAlign: 'right',
      marginTop: 4,
    },
  });
}
