import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { syncAnswerToSupabaseDebounced, isCloudSyncEnabled } from '../utils/answerSync';
import { Icon } from './Icon';

export interface SavedAnswerProps {
  storageKey: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  textareaClassName?: string;
  hideStatus?: boolean;
}

export const SavedAnswer: React.FC<SavedAnswerProps> = ({
  storageKey,
  placeholder = '在這裡輸入你的答案...',
  rows = 4,
  className = '',
  textareaClassName = '',
  hideStatus = false,
}) => {
  const { user } = useAuth();
  const [answer, setAnswer] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'local'>('idle');
  const storageName = storageKey.startsWith('ifu:') ? storageKey : `ifu:${storageKey}`;

  useEffect(() => {
    // Initial read from localStorage
    setAnswer(window.localStorage.getItem(storageName) ?? '');

    // Listen for custom ifu-answers-updated events triggered by Load / Import / Cloud Pull
    const handleAnswersUpdated = () => {
      setAnswer(window.localStorage.getItem(storageName) ?? '');
    };

    // Listen for cross-tab storage events
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === storageName) {
        setAnswer(window.localStorage.getItem(storageName) ?? '');
      }
    };

    // Listen for cloud sync status events
    const handleCloudSyncStatus = (e: CustomEvent<{ status: string; key: string; error?: string }>) => {
      if (e.detail?.key === storageName) {
        if (e.detail.status === 'syncing') {
          setSyncStatus('syncing');
        } else if (e.detail.status === 'synced') {
          setSyncStatus('synced');
          setTimeout(() => setSyncStatus('idle'), 3000);
        } else if (e.detail.status === 'error') {
          setSyncStatus('error');
        } else {
          setSyncStatus('local');
        }
      }
    };

    window.addEventListener('ifu-answers-updated', handleAnswersUpdated);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('ifu-cloud-sync-status', handleCloudSyncStatus as EventListener);

    return () => {
      window.removeEventListener('ifu-answers-updated', handleAnswersUpdated);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('ifu-cloud-sync-status', handleCloudSyncStatus as EventListener);
    };
  }, [storageName]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextAnswer = event.target.value;
    setAnswer(nextAnswer);
    window.localStorage.setItem(storageName, nextAnswer);

    // If user is authenticated and cloud sync is enabled, trigger debounced encrypted sync
    if (user?.id && isCloudSyncEnabled()) {
      setSyncStatus('syncing');
      syncAnswerToSupabaseDebounced(user.id, storageName, nextAnswer);
    } else {
      setSyncStatus('local');
    }
  };

  const containerClass = className.includes('mt-') ? className : `mt-5 ${className}`.trim();

  return (
    <label className={`block ${containerClass}`}>
      <span className="sr-only">你的答案</span>
      <textarea
        value={answer}
        onChange={handleChange}
        rows={rows}
        className={
          textareaClassName ||
          "min-h-28 w-full resize-y rounded-[1.25rem] border border-outline-variant bg-surface-container-low/55 p-4 text-base leading-7 text-on-surface outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
        }
        placeholder={placeholder}
      />
      {!hideStatus && (
        <div className="mt-2 flex items-center justify-end gap-1.5 text-[11px] font-bold tracking-[0.12em] text-on-surface-variant/65">
          {syncStatus === 'syncing' ? (
            <span className="inline-flex items-center gap-1 text-secondary animate-pulse">
              <Icon name="sync" className="text-[13px] animate-spin" />
              端對端加密同步中...
            </span>
          ) : syncStatus === 'synced' ? (
            <span className="inline-flex items-center gap-1 text-green-700">
              <Icon name="lock" className="text-[13px]" />
              已加密儲存於雲端
            </span>
          ) : syncStatus === 'error' ? (
            <span className="inline-flex items-center gap-1 text-amber-700">
              <Icon name="warning" className="text-[13px]" />
              已儲存於本機 (雲端連線失敗)
            </span>
          ) : user && isCloudSyncEnabled() ? (
            <span className="inline-flex items-center gap-1">
              <Icon name="lock" className="text-[12px] text-secondary/70" />
              已自動儲存 (E2EE)
            </span>
          ) : (
            <span>已儲存於本機</span>
          )}
        </div>
      )}
    </label>
  );
};

export default SavedAnswer;

