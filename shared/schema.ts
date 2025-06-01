import { z } from "zod";

// Contact schema
export const contactSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  avatar: z.string(),
  color: z.string(),
  imageUrl: z.string().optional(),
  createdAt: z.date(),
  lastMessageAt: z.date().optional(),
});

export const insertContactSchema = contactSchema.omit({
  id: true,
  createdAt: true,
});

export type Contact = z.infer<typeof contactSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;

// Message schema
export const messageSchema = z.object({
  id: z.string(),
  contactId: z.string(),
  content: z.string().min(1, "Message cannot be empty"),
  timestamp: z.date(),
  isRead: z.boolean().default(true),
});

export const insertMessageSchema = messageSchema.omit({
  id: true,
  timestamp: true,
});

export type Message = z.infer<typeof messageSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Conversation schema
export const conversationSchema = z.object({
  id: z.string(),
  contactId: z.string(),
  lastMessage: z.string().optional(),
  lastMessageAt: z.date().optional(),
  messageCount: z.number().default(0),
  unreadCount: z.number().default(0),
  isClosed: z.boolean().default(false),
});

export type Conversation = z.infer<typeof conversationSchema>;

// Settings schema
export const settingsSchema = z.object({
  pinHash: z.string(),
  biometricEnabled: z.boolean().default(false),
  autoDeleteEnabled: z.boolean().default(false),
  autoDeleteDays: z.number().default(30),
  onboardingCompleted: z.boolean().default(false),
  totalMessagesSent: z.number().default(0),
  donationIntervalsShown: z.array(z.number()).default([]),
});

export type Settings = z.infer<typeof settingsSchema>;

// App data schema
export const appDataSchema = z.object({
  contacts: z.array(contactSchema),
  messages: z.array(messageSchema),
  conversations: z.array(conversationSchema),
  settings: settingsSchema,
  version: z.string().default("1.0.0"),
});

export type AppData = z.infer<typeof appDataSchema>;
