import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { ROUTE_REGISTRY } from '../app/routes';

export const ProfileScreen: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
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

  if (!user) {
    return <Navigate to={ROUTE_REGISTRY.LOGIN} replace />;
  }

  const handleSignOut = async () => {
    try {
      setErrorMessage('');
      await signOut();
      navigate(ROUTE_REGISTRY.HOME);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '無法登出此帳號。',
      );
    }
  };

  return (
    <>
      <PageHeader title="個人檔案" backTo="/" />
      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 pb-36 pt-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-primary p-8 text-white shadow-[0_24px_64px_rgba(40,53,28,0.22)]">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-secondary/20 blur-2xl" />
          <div className="relative flex items-center gap-4">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt=""
                className="h-16 w-16 rounded-full border-2 border-white/20 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/12">
                <Icon
                  name="person"
                  filled
                  className="text-4xl text-secondary-fixed"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-headline text-[1.7rem]">
                {profile?.displayName || '同行中的門徒'}
              </p>
              <p className="mt-1 truncate text-sm text-on-primary-container">
                {profile?.email}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          {[
            { label: '登入方式', value: 'Google 帳戶' },
            { label: '帳戶狀態', value: '已登入' },
            { label: '下一步', value: '繼續完成初信栽培課程' },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-[1.7rem] bg-surface-container-lowest p-6 shadow-[0_16px_38px_rgba(40,53,28,0.06)]"
            >
              <p className="font-body text-[11px] font-extrabold tracking-[0.22em] text-secondary/80">
                {item.label}
              </p>
              <p className="mt-3 text-[1rem] leading-7 text-on-surface">
                {item.value}
              </p>
            </article>
          ))}
        </section>

        {errorMessage ? (
          <p className="rounded-xl bg-red-50 p-3 text-sm font-bold leading-6 text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 py-3.5 text-sm font-extrabold text-red-600 transition hover:bg-red-100/60 active:scale-[0.99]"
        >
          <Icon name="logout" className="text-base" />
          登出此帳號
        </button>
      </main>
    </>
  );
};

export default ProfileScreen;
