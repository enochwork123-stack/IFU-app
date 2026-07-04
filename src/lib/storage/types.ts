export type StorageMode = 'google_drive' | 'supabase';

export interface StoragePayload {
  answers: Record<string, string>;
  updatedAt: string;
}

export interface StorageHandler {
  save(userId: string, payload: StoragePayload, accessToken?: string): Promise<void>;
  load(userId: string, accessToken?: string): Promise<StoragePayload | null>;
}
