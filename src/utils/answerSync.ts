/**
 * Answer Cloud Synchronization Engine with Supabase & Client-Side Encryption
 */

import { supabase } from '../lib/supabase';
import { encryptAnswer, decryptAnswer } from './answerEncryption';
import { getAllUserAnswers, SYSTEM_STORAGE_KEYS } from './answerBackup';

export const CLOUD_SYNC_STORAGE_KEY = 'ifu:cloud_sync_enabled';

/**
 * Check if the user has cloud sync enabled (defaults to true)
 */
export function isCloudSyncEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const val = window.localStorage.getItem(CLOUD_SYNC_STORAGE_KEY);
  if (val === null) return true; // Default enabled
  return val === 'true';
}

/**
 * Update cloud sync preference
 */
export function setCloudSyncEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CLOUD_SYNC_STORAGE_KEY, enabled ? 'true' : 'false');
  window.dispatchEvent(
    new CustomEvent('ifu-cloud-sync-pref-changed', {
      detail: { enabled },
    })
  );
}

// In-memory debounce timers per storage key
const debounceTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

/**
 * Debounced single-answer sync to Supabase
 */
export function syncAnswerToSupabaseDebounced(
  userId: string,
  storageKey: string,
  plainText: string,
  delayMs = 1500
): void {
  if (!isCloudSyncEnabled()) return;

  const timerKey = `${userId}:${storageKey}`;
  if (debounceTimers.has(timerKey)) {
    clearTimeout(debounceTimers.get(timerKey)!);
  }

  const timer = setTimeout(async () => {
    debounceTimers.delete(timerKey);
    try {
      await syncAnswerToSupabaseImmediate(userId, storageKey, plainText);
    } catch (err) {
      console.warn(`[CloudSync] Auto-sync for ${storageKey} deferred:`, err);
    }
  }, delayMs);

  debounceTimers.set(timerKey, timer);
}

/**
 * Immediate single-answer sync to Supabase with AES-GCM encryption
 */
export async function syncAnswerToSupabaseImmediate(
  userId: string,
  storageKey: string,
  plainText: string
): Promise<void> {
  if (!userId || !isCloudSyncEnabled()) return;

  // Broadcast sync starting
  window.dispatchEvent(
    new CustomEvent('ifu-cloud-sync-status', {
      detail: { status: 'syncing', key: storageKey },
    })
  );

  try {
    const cleanKey = storageKey.startsWith('ifu:') ? storageKey : `ifu:${storageKey}`;

    if (!plainText || plainText.trim().length === 0) {
      // If answer was deleted/emptied, remove from Supabase
      const { error } = await supabase
        .from('user_answers')
        .delete()
        .eq('user_id', userId)
        .eq('storage_key', cleanKey);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
    } else {
      // Encrypt answer content client-side
      const encrypted = await encryptAnswer(userId, plainText);

      // Upsert into user_answers
      const { error } = await supabase.from('user_answers').upsert(
        {
          user_id: userId,
          storage_key: cleanKey,
          encrypted_content: encrypted.cipherText,
          iv: encrypted.iv,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,storage_key' }
      );

      if (error) throw error;
    }

    window.dispatchEvent(
      new CustomEvent('ifu-cloud-sync-status', {
        detail: { status: 'synced', key: storageKey },
      })
    );
  } catch (err: any) {
    console.error(`[CloudSync] Failed to sync ${storageKey}:`, err);
    window.dispatchEvent(
      new CustomEvent('ifu-cloud-sync-status', {
        detail: { status: 'error', key: storageKey, error: err?.message },
      })
    );
    throw err;
  }
}

/**
 * Pull and decrypt all remote answers from Supabase and merge with localStorage
 */
export async function pullAndMergeAnswersFromSupabase(
  userId: string
): Promise<{ loaded: number; updated: number }> {
  if (!userId || !isCloudSyncEnabled()) return { loaded: 0, updated: 0 };

  try {
    const { data, error } = await supabase
      .from('user_answers')
      .select('storage_key, encrypted_content, iv, updated_at')
      .eq('user_id', userId);

    if (error) {
      // If table doesn't exist yet or permission error, handle gracefully
      console.warn('[CloudSync] Could not pull answers from Supabase:', error.message);
      return { loaded: 0, updated: 0 };
    }

    if (!data || data.length === 0) {
      // If cloud is empty but user has local answers, upload local to cloud
      const localAnswers = getAllUserAnswers();
      const localCount = Object.keys(localAnswers).length;
      if (localCount > 0) {
        await uploadAllLocalAnswersToSupabase(userId);
      }
      return { loaded: 0, updated: 0 };
    }

    let loadedCount = 0;
    let updatedCount = 0;
    const modifiedKeys: string[] = [];

    for (const row of data) {
      try {
        const decrypted = await decryptAnswer(userId, {
          cipherText: row.encrypted_content,
          iv: row.iv,
        });

        const currentLocal = window.localStorage.getItem(row.storage_key);
        if (currentLocal !== decrypted) {
          window.localStorage.setItem(row.storage_key, decrypted);
          modifiedKeys.push(row.storage_key);
          updatedCount++;
        }
        loadedCount++;
      } catch (decryptErr) {
        console.error(`[CloudSync] Decryption failed for key ${row.storage_key}:`, decryptErr);
      }
    }

    if (modifiedKeys.length > 0) {
      window.dispatchEvent(
        new CustomEvent('ifu-answers-updated', {
          detail: { count: updatedCount, keys: modifiedKeys },
        })
      );
      window.dispatchEvent(new Event('storage'));
    }

    return { loaded: loadedCount, updated: updatedCount };
  } catch (err) {
    console.error('[CloudSync] Unexpected error in pullAndMergeAnswersFromSupabase:', err);
    return { loaded: 0, updated: 0 };
  }
}

/**
 * Upload all local user answers to Supabase (bulk / manual sync)
 */
export async function uploadAllLocalAnswersToSupabase(userId: string): Promise<number> {
  if (!userId || !isCloudSyncEnabled()) return 0;

  const localAnswers = getAllUserAnswers();
  const entries = Object.entries(localAnswers).filter(
    ([key]) => !SYSTEM_STORAGE_KEYS.has(key)
  );

  if (entries.length === 0) return 0;

  let successCount = 0;

  for (const [key, val] of entries) {
    if (val && val.trim().length > 0) {
      try {
        const encrypted = await encryptAnswer(userId, val);
        const { error } = await supabase.from('user_answers').upsert(
          {
            user_id: userId,
            storage_key: key,
            encrypted_content: encrypted.cipherText,
            iv: encrypted.iv,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,storage_key' }
        );

        if (!error) successCount++;
      } catch (err) {
        console.warn(`[CloudSync] Failed to upload ${key}:`, err);
      }
    }
  }

  return successCount;
}

/**
 * Delete all encrypted answers belonging to the user from Supabase
 */
export async function deleteUserAnswersFromSupabase(userId: string): Promise<void> {
  if (!userId) return;

  const { error } = await supabase
    .from('user_answers')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}
