import { googleDriveHandler } from './googleDriveHandler';
import { supabaseHandler } from './supabaseHandler';
import { StorageMode, StoragePayload } from './types';

const STORAGE_MODE_KEY = 'ifu:storage_preference';
const DEFAULT_STORAGE_MODE: StorageMode = 'supabase';

export function getStorageMode(): StorageMode {
  const mode = localStorage.getItem(STORAGE_MODE_KEY);
  if (mode === 'google_drive' || mode === 'supabase') {
    return mode;
  }
  return DEFAULT_STORAGE_MODE;
}

export function setStorageMode(mode: StorageMode): void {
  localStorage.setItem(STORAGE_MODE_KEY, mode);
}

export async function saveData(
  userId: string,
  payload: StoragePayload,
  googleAccessToken?: string
): Promise<void> {
  const mode = getStorageMode();
  if (mode === 'google_drive') {
    await googleDriveHandler.save(userId, payload, googleAccessToken);
  } else {
    await supabaseHandler.save(userId, payload);
  }
}

export async function loadData(
  userId: string,
  googleAccessToken?: string
): Promise<StoragePayload | null> {
  const mode = getStorageMode();
  if (mode === 'google_drive') {
    return await googleDriveHandler.load(userId, googleAccessToken);
  } else {
    return await supabaseHandler.load(userId);
  }
}
