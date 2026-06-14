import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icon';
import { assetPath } from '../utils/assets';

export const LoginScreen: React.FC = () => {
  const { user, signInWithGoogle, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-surface p-8">
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
    <div className="h-full w-full bg-surface-container-lowest flex flex-col relative overflow-hidden font-body">
      {/* Back Button */}
      <Link
        to="/"
        className="absolute left-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-primary shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-outline-variant/20 hover:scale-105 active:scale-95 transition"
        aria-label="返回首頁"
      >
        <Icon name="arrow_back" className="text-xl" />
      </Link>

      {/* Hero Image - taking exactly 55% of container height */}
      <div className="relative w-full h-[55%] overflow-hidden shrink-0">
        <img
          src={assetPath('assets/login_hero.png')}
          alt="晨光穿過彩色玻璃窗灑在打開的聖經上"
          className="w-full h-full object-cover object-top"
        />
        {/* Subtle bottom overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-container-lowest to-transparent pointer-events-none" />
      </div>

      {/* Content Card - taking remaining 45% container height */}
      <div className="relative flex-1 bg-surface-container-lowest px-[28px] pt-8 pb-10 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <h2 className="font-headline text-[26px] md:text-[30px] font-bold text-primary leading-tight">
            延續你的屬靈旅程
          </h2>

          {/* Description */}
          <p className="text-[15px] leading-relaxed text-on-surface-variant font-body">
            登入以獲取靈修資源，神的話語正等待著你。
          </p>
        </div>

        {/* Sign in with Google Button */}
        <div className="mt-8 shrink-0">
          <button
            onClick={signInWithGoogle}
            className="w-full h-[52px] rounded-[10px] bg-white border border-[#DADCE0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex items-center justify-center gap-3.5 hover:bg-[#F8F8F8] hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all cursor-pointer font-body text-[15px] font-medium text-[#3c4043] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
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
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
