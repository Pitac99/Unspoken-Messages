import { supabase } from './supabase';

// Call this with a unique user ID (could be device ID, or a random UUID per install)
export async function incrementConversation(userId: string) {
  // Upsert: if user row exists, increment; else, create with 1 conversation
  const { data, error } = await supabase.rpc('increment_conversations', { user_id_param: userId });
  if (error) {
    console.error('Error incrementing conversations:', error);
  }
  return data;
}

export async function incrementMessage(userId: string) {
  const { data, error } = await supabase.rpc('increment_messages', { user_id_param: userId });
  if (error) {
    console.error('Error incrementing messages:', error);
  }
  return data;
}