import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';
import { supabase } from '../lib/supabase';
import { assetPath } from '../utils/assets';
import { useAppContent } from '../context/ContentContext';
import { AnswerBackupModal } from '../components/AnswerBackupModal';
import {
  isCloudSyncEnabled,
  setCloudSyncEnabled,
  uploadAllLocalAnswersToSupabase,
  deleteUserAnswersFromSupabase,
} from '../utils/answerSync';

interface ProgressStats {
  quietTimes: number;
  bibleStudies: number;
  discipleshipSteps: number;
}

export const ProfileScreen: React.FC = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { quietTimeEntries, discipleshipSteps } = useAppContent();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ProgressStats>({
    quietTimes: 0,
    bibleStudies: 0,
    discipleshipSteps: 0,
  });
  const [streak, setStreak] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [cloudSync, setCloudSync] = useState<boolean>(isCloudSyncEnabled());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleToggleCloudSync = () => {
    const nextVal = !cloudSync;
    setCloudSync(nextVal);
    setCloudSyncEnabled(nextVal);
    setSyncMessage({
      type: 'success',
      text: nextVal ? '已啟用雲端端對端加密同步。' : '已關閉雲端同步，作答僅保存在本機。',
    });
    setTimeout(() => setSyncMessage(null), 4000);
  };

  const handleManualSync = async () => {
    if (!user) {
      alert('請先登入以同步作答紀錄！');
      return;
    }
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const count = await uploadAllLocalAnswersToSupabase(user.id);
      setSyncMessage({
        type: 'success',
        text: `🎉 成功加密同步 ${count} 筆作答至 Supabase 雲端！`,
      });
    } catch (err: any) {
      setSyncMessage({
        type: 'error',
        text: `同步失敗：${err?.message || '請確認網路或資料庫連線'}`,
      });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const handleDeleteCloudAnswers = async () => {
    if (!user) return;
    if (
      !window.confirm(
        '確定要清除存放在 Supabase 雲端的加密作答紀錄嗎？\n（您在此瀏覽器本機的作答不會被刪除）'
      )
    ) {
      return;
    }
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      await deleteUserAnswersFromSupabase(user.id);
      setSyncMessage({
        type: 'success',
        text: '已成功清除 Supabase 雲端的所有加密作答備份。',
      });
    } catch (err: any) {
      setSyncMessage({
        type: 'error',
        text: `清除失敗：${err?.message || '未知錯誤'}`,
      });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const calculateQuietTimeStreak = (qtLogs: { completed_at: string }[]): number => {
    if (qtLogs.length === 0) return 0;

    // Extract unique dates and sort descending
    const uniqueDates = Array.from(
      new Set(qtLogs.map(log => log.completed_at))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (uniqueDates.length === 0) return 0;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    const mostRecent = uniqueDates[0];

    // If the most recent quiet time is not today or yesterday, the streak is 0
    if (mostRecent !== todayStr && mostRecent !== yesterdayStr) {
      return 0;
    }

    let currentStreak = 1;
    let current = new Date(mostRecent);

    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i]);
      const diffTime = Math.abs(current.getTime() - prev.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        current = prev;
      } else if (diffDays > 1) {
        break; // Streak is broken
      }
    }

    return currentStreak;
  };

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const { data, error } = await supabase
          .from('user_progress')
          .select('type, reference_id, completed_at')
          .eq('user_id', user.id);

        if (!error && data) {
          // Count unique quiet times completed
          const uniqueQuietTimes = new Set(
            data
              .filter((log) => log.type === 'quiet_time')
              .map((log) => log.reference_id)
          );

          // Only count the 12 real journey steps — gospel pages (creation/problem/
          // bridge/response) are also stored as discipleship_step but are not steps.
          const stepIds = new Set(discipleshipSteps.map((s) => s.id));
          const uniqueSteps = new Set(
            data
              .filter((log) => log.type === 'discipleship_step' && stepIds.has(log.reference_id))
              .map((log) => log.reference_id)
          );
          const bibleStudies = data.filter((log) => log.type === 'bible_study').length;
          setStats({
            quietTimes: uniqueQuietTimes.size,
            bibleStudies,
            discipleshipSteps: uniqueSteps.size,
          });

          const qtLogs = data.filter(log => log.type === 'quiet_time');
          const calculatedStreak = calculateQuietTimeStreak(qtLogs);
          setStreak(calculatedStreak);
        }
      } catch (err) {
        console.error('Error fetching progress stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user, discipleshipSteps]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <>
      <PageHeader title="個人檔案" backTo="/" />
      <main className="px-6 pb-36 pt-8 flex flex-col gap-6 max-w-xl mx-auto w-full">
        {/* User Card */}
        <section className="rounded-[2rem] bg-primary p-8 text-white shadow-[0_24px_64px_rgba(40,53,28,0.22)] flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] h-32 w-32 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <img
              src={profile?.avatar_url || assetPath('assets/default_avatar.png')}
              alt={profile?.display_name || 'User'}
              className="h-16 w-16 rounded-full object-cover border-2 border-white/20 bg-white/10"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-headline text-[1.5rem] font-bold truncate">
                  {profile?.display_name || '同行中的門徒'}
                </p>
                {isAdmin && (
                  <span className="rounded-full bg-secondary/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-secondary uppercase border border-secondary/30">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-on-primary-container truncate mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="border-t border-white/10 pt-4 mt-2 relative z-10 flex gap-3">
              <Link
                to="/admin"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-xs font-bold tracking-wider text-white shadow-lg shadow-secondary/15 hover:brightness-105 active:scale-98 transition"
              >
                <Icon name="admin_panel_settings" className="text-base" />
                進入內容管理後台
              </Link>
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-3 gap-3">
          {[
            {
              label: '靈修卡片',
              value: loadingStats ? '...' : `${stats.quietTimes}/${quietTimeEntries.length}`,
              icon: 'auto_stories',
            },
            {
              label: '栽培進度',
              value: loadingStats ? '...' : `${stats.discipleshipSteps}/12`,
              icon: 'signpost',
            },
            {
              label: '每日靈修',
              value: loadingStats ? '...' : `${streak} 天`,
              icon: 'event_repeat',
            },
          ].map((stat, i) => (
            <article
              key={i}
              className="rounded-[1.5rem] bg-surface-container-lowest p-4 text-center shadow-[0_12px_28px_rgba(40,53,28,0.04)] border border-outline-variant/30 flex flex-col items-center justify-center"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/8 text-secondary mb-2">
                <Icon name={stat.icon} className="text-base" />
              </div>
              <p className="text-[10px] font-extrabold tracking-[0.12em] text-secondary/80">
                {stat.label}
              </p>
              <p className="mt-1 font-headline text-[1.2rem] font-bold text-primary">
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        {/* Details & Actions List */}
        <section className="rounded-[1.8rem] bg-surface-container-lowest p-6 shadow-[0_16px_38px_rgba(40,53,28,0.06)] border border-outline-variant/30 flex flex-col gap-5">
          <h3 className="font-headline text-base font-bold text-primary border-b border-outline-variant/40 pb-3">
            帳戶設定與資訊
          </h3>
          
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-bold text-primary">語系偏好 (Language)</p>
              <p className="text-xs text-on-surface-variant mt-0.5">目前系統所顯示的語言</p>
            </div>
            <span className="rounded-full bg-surface-container-low px-3 py-1.5 text-xs font-semibold text-primary">
              繁體中文 (ZH)
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-bold text-primary">加入時間</p>
              <p className="text-xs text-on-surface-variant mt-0.5">您開始使用此門徒訓練系統的日期</p>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '剛加入'}
            </span>
          </div>

          <div className="h-px bg-outline-variant/40 my-1" />

          {/* Cloud Encrypted Sync Setting */}
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-primary">雲端端對端加密同步 (E2EE)</p>
                  {cloudSync ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 border border-green-200">
                      <Icon name="lock" className="text-[12px]" />
                      已加密保護
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2 py-0.5 text-[10px] font-bold text-on-surface-variant">
                      僅限本機
                    </span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  登入時自動將作答紀錄以 AES-256 加密儲存至 Supabase 雲端（他人與管理者皆無法看見原文）。
                  關閉後將停止上傳至雲端，作答僅保留於本機瀏覽器。
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={cloudSync}
                onClick={handleToggleCloudSync}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  cloudSync ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    cloudSync ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {user && cloudSync && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handleManualSync}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Icon name="sync" className={`text-[14px] ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? '同步中...' : '立即同步至雲端'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCloudAnswers}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition active:scale-95 cursor-pointer"
                >
                  <Icon name="delete" className="text-[14px]" />
                  <span>清除雲端作答</span>
                </button>
              </div>
            )}
            {syncMessage && (
              <div className="space-y-2">
                <p className={`text-xs font-medium ${syncMessage.type === 'success' ? 'text-green-700' : 'text-amber-800 font-bold'}`}>
                  {syncMessage.text}
                </p>
                {syncMessage.type === 'error' && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs space-y-2 text-amber-900">
                    <p>若提示資料表不存在，請複製以下 SQL 語句並至 Supabase Dashboard -&gt; SQL Editor 貼上執行即可啟用雲端加密資料表：</p>
                    <button
                      type="button"
                      onClick={() => {
                        const sql = `CREATE TABLE IF NOT EXISTS public.user_answers (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,\n  storage_key text NOT NULL,\n  encrypted_content text NOT NULL,\n  iv text NOT NULL,\n  updated_at timestamptz DEFAULT now() NOT NULL,\n  UNIQUE (user_id, storage_key)\n);\n\nALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Users can manage their own answers"\n  ON public.user_answers FOR ALL\n  USING (auth.uid() = user_id)\n  WITH CHECK (auth.uid() = user_id);`;
                        navigator.clipboard.writeText(sql);
                        alert('已複製 SQL 語句至剪貼簿！請在 Supabase SQL Editor 中貼上並執行。');
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-800 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-900 cursor-pointer"
                    >
                      <Icon name="content_copy" className="text-[13px]" />
                      複製 user_answers 建表 SQL
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="h-px bg-outline-variant/40 my-1" />

          {/* Data Backup & Restore */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-bold text-primary">學習手冊與檔案備份</p>
              <p className="text-xs text-on-surface-variant mt-0.5">匯出 PDF / Word / JSON 學習手冊或還原檔案</p>
            </div>
            <button
              type="button"
              onClick={() => setIsBackupOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-secondary/30 bg-secondary/10 px-3.5 py-2 text-xs font-bold text-secondary hover:bg-secondary/20 transition active:scale-95 cursor-pointer"
            >
              <Icon name="save" className="text-[16px]" />
              <span>手冊與載入</span>
            </button>
          </div>

          <div className="h-px bg-outline-variant/40 my-1" />

          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3.5 text-sm font-extrabold text-red-600 border border-red-100 hover:bg-red-100/40 active:scale-98 transition"
          >
            <Icon name="logout" className="text-base" />
            登出此帳號
          </button>
        </section>
      </main>

      <AnswerBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
    </>
  );
};

export default ProfileScreen;

