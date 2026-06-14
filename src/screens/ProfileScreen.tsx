import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';
import { supabase } from '../lib/supabase';
import { assetPath } from '../utils/assets';
import { quietTimeEntries } from '../data/quietTimeData';

interface ProgressStats {
  quietTimes: number;
  bibleStudies: number;
  discipleshipSteps: number;
}

export const ProfileScreen: React.FC = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ProgressStats>({
    quietTimes: 0,
    bibleStudies: 0,
    discipleshipSteps: 0,
  });
  const [streak, setStreak] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

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
          .select('type, reference_id, completed_at');

        if (!error && data) {
          // Count unique quiet times completed
          const uniqueQuietTimes = new Set(
            data
              .filter((log) => log.type === 'quiet_time')
              .map((log) => log.reference_id)
          );

          const counts = data.reduce(
            (acc, curr) => {
              if (curr.type === 'bible_study') acc.bibleStudies++;
              else if (curr.type === 'discipleship_step') acc.discipleshipSteps++;
              return acc;
            },
            { quietTimes: uniqueQuietTimes.size, bibleStudies: 0, discipleshipSteps: 0 }
          );
          setStats(counts);

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
  }, [user]);

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

          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3.5 text-sm font-extrabold text-red-600 border border-red-100 hover:bg-red-100/40 active:scale-98 transition"
          >
            <Icon name="logout" className="text-base" />
            登出此帳號
          </button>
        </section>
      </main>
    </>
  );
};

export default ProfileScreen;
