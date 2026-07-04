import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { StorageMode, StoragePayload } from '../lib/storage/types';
import { getStorageMode, setStorageMode as saveStorageModePref, saveData, loadData } from '../lib/storage/storageEngine';
import { GoogleDrivePermissionError } from '../lib/storage/googleDriveHandler';

interface StorageContextType {
  storageMode: StorageMode;
  loading: boolean;
  error: string | null;
  setStorageMode: (mode: StorageMode) => Promise<void>;
  syncData: () => Promise<void>;
  triggerIncrementalAuth: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [storageMode, setStorageModeState] = useState<StorageMode>('supabase');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize storage mode preference from localStorage
  useEffect(() => {
    setStorageModeState(getStorageMode());
  }, []);

  // Sync function helper
  const performSync = async (mode: StorageMode, currentUserId: string) => {
    try {
      setError(null);
      let accessToken: string | undefined;

      if (mode === 'google_drive') {
        const { data: { session } } = await supabase.auth.getSession();
        accessToken = session?.provider_token || undefined;
        if (!accessToken) {
          throw new GoogleDrivePermissionError('Google access token not found. Please log in again.');
        }
      }

      const answers: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ifu:') && key !== 'ifu:storage_preference' && key !== 'ifu:local_updated_at') {
          const val = localStorage.getItem(key);
          if (val !== null) {
            answers[key] = val;
          }
        }
      }

      const payload: StoragePayload = {
        answers,
        updatedAt: localStorage.getItem('ifu:local_updated_at') || new Date().toISOString(),
      };

      await saveData(currentUserId, payload, accessToken);
    } catch (err) {
      if (err instanceof GoogleDrivePermissionError) {
        setError('Google Drive access not authorized. Requesting permissions...');
        await triggerIncrementalAuth();
      } else {
        console.error('Error syncing response data:', err);
        setError(err instanceof Error ? err.message : 'Sync failed');
      }
    }
  };

  const syncData = async () => {
    if (!user) return;
    setLoading(true);
    await performSync(storageMode, user.id);
    setLoading(false);
  };

  // Debounced sync function for auto-saving
  const triggerDebouncedSync = () => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(() => {
      if (user) {
        performSync(storageMode, user.id).catch((err) => {
          console.error('Auto-sync failed:', err);
        });
      }
    }, 2000); // Debounce for 2 seconds
  };

  // Hook into localStorage.setItem to auto-sync changes
  useEffect(() => {
    const originalSetItem = window.localStorage.setItem;

    window.localStorage.setItem = function (key: string, value: string) {
      originalSetItem.apply(this, [key, value]);
      if (
        key.startsWith('ifu:') &&
        key !== 'ifu:storage_preference' &&
        key !== 'ifu:local_updated_at'
      ) {
        originalSetItem.apply(this, ['ifu:local_updated_at', new Date().toISOString()]);
        triggerDebouncedSync();
      }
    };

    return () => {
      window.localStorage.setItem = originalSetItem;
    };
  }, [storageMode, user]);

  // Load remote data on login or storage mode switch
  const loadRemoteData = async (mode: StorageMode, currentUserId: string) => {
    setLoading(true);
    setError(null);
    try {
      let accessToken: string | undefined;

      if (mode === 'google_drive') {
        const { data: { session } } = await supabase.auth.getSession();
        accessToken = session?.provider_token || undefined;
        if (!accessToken) {
          throw new GoogleDrivePermissionError('Google access token not found.');
        }
      }

      const remotePayload = await loadData(currentUserId, accessToken);
      if (remotePayload && remotePayload.answers) {
        // Merge strategy: if local is newer than remote, keep local and sync to remote.
        // Otherwise, overwrite local with remote.
        const localUpdatedAt = localStorage.getItem('ifu:local_updated_at');
        const remoteUpdatedAt = remotePayload.updatedAt;

        const localTime = localUpdatedAt ? new Date(localUpdatedAt).getTime() : 0;
        const remoteTime = remoteUpdatedAt ? new Date(remoteUpdatedAt).getTime() : 0;

        if (remoteTime >= localTime) {
          // Disable setItem interceptor temporarily while loading to prevent loops
          const originalSetItem = window.localStorage.setItem;
          Object.entries(remotePayload.answers).forEach(([key, val]) => {
            originalSetItem.apply(localStorage, [key, val]);
          });
          if (remotePayload.updatedAt) {
            originalSetItem.apply(localStorage, ['ifu:local_updated_at', remotePayload.updatedAt]);
          }
          // Force components to re-read localStorage by dispatching storage event
          window.dispatchEvent(new Event('storage'));
        } else {
          // Local is newer, trigger save to remote
          await performSync(mode, currentUserId);
        }
      }
    } catch (err) {
      if (err instanceof GoogleDrivePermissionError) {
        setError('Google Drive access not authorized. Requesting permissions...');
        await triggerIncrementalAuth();
      } else {
        console.error('Error loading remote data:', err);
        setError(err instanceof Error ? err.message : 'Load failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch remote data when user logging in or initial load
  useEffect(() => {
    if (user) {
      loadRemoteData(storageMode, user.id);
    }
  }, [user]);

  const triggerIncrementalAuth = async () => {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/drive.appdata',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: window.location.origin + '/profile',
      },
    });
    if (authError) {
      console.error('Failed to trigger Google OAuth:', authError);
      setError(authError.message);
    }
  };

  const handleSetStorageMode = async (mode: StorageMode) => {
    saveStorageModePref(mode);
    setStorageModeState(mode);

    if (user) {
      await loadRemoteData(mode, user.id);
    }
  };

  return (
    <StorageContext.Provider
      value={{
        storageMode,
        loading,
        error,
        setStorageMode: handleSetStorageMode,
        syncData,
        triggerIncrementalAuth,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
