import React from 'react';
import { Icon } from './Icon';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, loading, isAdmin, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
        <p className="mt-6 font-headline text-lg font-bold text-primary">
          正在加載，請稍候...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
        <section className="w-full max-w-md rounded-[2rem] border border-outline-variant/60 bg-surface-container-lowest p-8 text-center shadow-[0_28px_72px_rgba(40,53,28,0.1)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <Icon name="lock" className="text-3xl" />
          </div>
          <h1 className="mt-6 font-headline text-2xl font-black text-primary">
            需要登錄
          </h1>
          <p className="mt-3 leading-7 text-on-surface-variant">
            請使用 Google 帳戶登錄以繼續。
          </p>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="mt-8 w-full rounded-full bg-primary py-4 text-sm font-extrabold tracking-[0.16em] text-white shadow-[0_12px_24px_rgba(40,53,28,0.2)] transition hover:brightness-105 active:scale-[0.99]"
          >
            使用 Google 帳戶登入
          </button>
        </section>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
        <section className="w-full max-w-md rounded-[2rem] border border-outline-variant/60 bg-surface-container-lowest p-8 text-center shadow-[0_28px_72px_rgba(40,53,28,0.1)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Icon name="gpp_bad" className="text-3xl" />
          </div>
          <h1 className="mt-6 font-headline text-2xl font-black text-primary">
            權限不足
          </h1>
          <p className="mt-3 leading-7 text-on-surface-variant">
            此區域僅限系統管理員訪問。
          </p>
        </section>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
