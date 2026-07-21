import React from 'react';
import { useStorage } from '../context/StorageContext';
import { useAuth } from '../context/AuthContext';
import { Icon } from './Icon';

export const StorageToggle: React.FC = () => {
  const { user } = useAuth();
  const { storageMode, setStorageMode, loading, error, syncData } = useStorage();

  if (!user) {
    return (
      <section className="rounded-[1.8rem] bg-surface-container-lowest p-6 shadow-[0_16px_38px_rgba(40,53,28,0.06)] border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/8 text-secondary">
            <Icon name="storage" className="text-xl" />
          </div>
          <div>
            <h3 className="font-headline text-base font-bold text-primary">
              資料儲存模式
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              選擇資料同步與備份的目的地
            </p>
          </div>
        </div>
        
        <div className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/20">
          <p className="text-xs leading-5 text-on-surface-variant font-medium">
            💡 <strong>提示：</strong> 您目前尚未登入。您的所有學習進度與回答僅保存在此瀏覽器的 <strong>本地快取 (LocalStorage)</strong> 中。
          </p>
          <p className="text-xs leading-5 text-on-surface-variant/70 mt-1">
            登入後即可設定同步到個人 Google 雲端硬碟（確保絕對隱私）或雲端資料庫。
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[1.8rem] bg-surface-container-lowest p-6 shadow-[0_16px_38px_rgba(40,53,28,0.06)] border border-outline-variant/30 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/8 text-secondary">
          <Icon name="dns" className="text-xl" />
        </div>
        <div>
          <h3 className="font-headline text-base font-bold text-primary">
            資料儲存目的地
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            選擇您的回答與學習進度要存在哪裡
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/20">
        <button
          onClick={() => setStorageMode('supabase')}
          disabled={loading}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 ${
            storageMode === 'supabase'
              ? 'bg-white text-primary shadow-sm scale-[1.01]'
              : 'text-on-surface-variant/80 hover:bg-white/30 hover:text-primary'
          }`}
        >
          <Icon
            name="cloud"
            filled={storageMode === 'supabase'}
            className="text-base"
          />
          雲端資料庫
        </button>

        <button
          onClick={() => setStorageMode('google_drive')}
          disabled={loading}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 ${
            storageMode === 'google_drive'
              ? 'bg-white text-primary shadow-sm scale-[1.01]'
              : 'text-on-surface-variant/80 hover:bg-white/30 hover:text-primary'
          }`}
        >
          <Icon
            name="add_to_drive"
            filled={storageMode === 'google_drive'}
            className="text-base"
          />
          Google 雲端硬碟
        </button>
      </div>

      {/* Description Context */}
      <div className="text-xs leading-5 text-on-surface-variant/80 space-y-2">
        {storageMode === 'google_drive' ? (
          <p>
            🔒 <strong>Google 雲端硬碟模式：</strong> 資料將上傳至您個人雲端硬碟中專屬的隱藏資料夾（<code>appDataFolder</code>）。本應用程式與任何第三方皆無法讀取您雲端硬碟中的其他檔案，最大化保護您的隱私。
          </p>
        ) : (
          <p>
            🌐 <strong>雲端資料庫模式：</strong> 資料將安全的儲存在我們的 Supabase 資料庫中，方便您在不同裝置間同步，並可接受系統管理員的引導與回饋。
          </p>
        )}
      </div>

      {/* Sync Status / Info */}
      <div className="flex items-center justify-between border-t border-outline-variant/40 pt-4 mt-1 text-xs">
        <div className="flex items-center gap-2">
          {loading ? (
            <>
              <Icon name="sync" className="text-base text-secondary animate-spin" />
              <span className="text-on-surface-variant/80 font-medium">正在進行同步...</span>
            </>
          ) : error ? (
            <>
              <Icon name="error" className="text-base text-red-600" />
              <span className="text-red-600 font-bold max-w-[200px] truncate">{error}</span>
            </>
          ) : (
            <>
              <Icon name="check_circle" className="text-base text-green-600" />
              <span className="text-green-700 font-medium">已同步至最新狀態</span>
            </>
          )}
        </div>

        {!loading && (
          <button
            onClick={syncData}
            className="flex items-center gap-1 font-bold text-secondary hover:underline cursor-pointer"
          >
            <Icon name="sync" className="text-sm" />
            立即同步
          </button>
        )}
      </div>
    </section>
  );
};
