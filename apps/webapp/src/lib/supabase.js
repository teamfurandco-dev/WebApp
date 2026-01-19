import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase URL or Anon Key. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const logActivity = async (userId, actionType, entityType = null, entityId = null, metadata = {}) => {
  if (!userId) return;

  try {
    const { error } = await supabase.from('user_activity_logs').insert({
      user_id: userId,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      metadata
    });

    if (error) throw error;
  } catch (err) {
    console.error('Failed to log activity:', err);
    // Don't block the UI for logging errors
  }
};
