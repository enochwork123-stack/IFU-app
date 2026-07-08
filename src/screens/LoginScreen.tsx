import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { ROUTE_REGISTRY } from '../app/routes';

export const LoginScreen: React.FC = () => {
  const { user, loading, isConfigured, signInWithGoogle } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState('');

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
        <p className="mt-6 font-headline text-lg font-bold text-primary">
          讀取中...
        </p>
      </div>
    );
  }

  if (user) {
    return <Navigate to={ROUTE_REGISTRY.PROFILE} replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage('');
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '無法使用 Google 登入。',
      );
    }
  };

  return (
    <main className="flex min-h-full items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-[2rem] border border-outline-variant/60 bg-surface-container-lowest p-8 shadow-[0_24px_64px_rgba(40,53,28,0.1)]">
        <Link
          to={ROUTE_REGISTRY.HOME}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary transition active:scale-95"
          aria-label="返回首頁"
        >
          <Icon name="arrow_back" className="text-xl" />
        </Link>

        <div className="mt-8">
          <p className="font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
            GOOGLE ACCOUNT
          </p>
          <h1 className="mt-3 font-headline text-3xl font-black text-primary">
            登錄
          </h1>
          <p className="mt-3 leading-7 text-on-surface-variant">
            使用 Google 帳戶登入，延續你的屬靈旅程與個人設定。
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={!isConfigured}
          className="mt-8 flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-[#dadce0] bg-white px-4 text-sm font-bold text-[#3c4043] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition hover:bg-[#f8f8f8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          使用 Google 帳戶登入
        </button>

        {!isConfigured ? (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold leading-6 text-red-700">
            Google 登入尚未設定。請加入 VITE_SUPABASE_URL 和
            VITE_SUPABASE_ANON_KEY。
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold leading-6 text-red-700">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </main>
  );
};

export default LoginScreen;
