import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';

export const LoginScreen: React.FC = () => {
  const { user, signInWithGoogle, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
        <p className="mt-6 font-headline text-lg font-bold text-primary animate-pulse">
          讀取中...
        </p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <>
      <PageHeader title="會員登錄" backTo="/" />
      <main className="px-6 pb-36 pt-8 flex flex-col items-center">
        <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] bg-surface-container-lowest p-8 shadow-[0_24px_64px_rgba(40,53,28,0.08)] border border-outline-variant/60">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="account_circle" className="text-4xl" />
            </div>
            <h2 className="mt-5 font-headline text-[1.8rem] font-bold text-primary">
              開啟你的屬靈旅程
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              登錄後即可同步與保存您的個人進度
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {[
              {
                icon: 'auto_stories',
                title: '同步學習進度',
                desc: '完整記錄福音旅程及栽培的閱讀足跡。',
              },
              {
                icon: 'event_repeat',
                title: '建立每日 QT 習慣',
                desc: '持續累計每日安靜時間，培養與神的親密關係。',
              },
              {
                icon: 'explore',
                title: '保存生命輪測評',
                desc: '記錄你在屬靈生命成長盤上的評分與心得筆記。',
              },
            ].map((benefit, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/8 text-secondary">
                  <Icon name={benefit.icon} className="text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-sm">{benefit.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={signInWithGoogle}
            className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-primary py-4 text-sm font-extrabold tracking-[0.16em] text-white shadow-[0_12px_24px_rgba(40,53,28,0.2)] hover:brightness-105 active:scale-98 transition"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            使用 Google 帳號登錄
          </button>
        </div>
      </main>
    </>
  );
};

export default LoginScreen;
