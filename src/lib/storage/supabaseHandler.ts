import { supabase } from '../supabase';
import { StorageHandler, StoragePayload } from './types';

export const supabaseHandler: StorageHandler = {
  async save(userId: string, payload: StoragePayload): Promise<void> {
    const { error } = await supabase
      .from('user_responses')
      .upsert({
        user_id: userId,
        payload: payload,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Supabase save error:', error);
      throw error;
    }
  },

  async load(userId: string): Promise<StoragePayload | null> {
    const { data, error } = await supabase
      .from('user_responses')
      .select('payload')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Supabase load error:', error);
      throw error;
    }

    if (data && data.payload) {
      return data.payload as StoragePayload;
    }

    return null;
  },
};
