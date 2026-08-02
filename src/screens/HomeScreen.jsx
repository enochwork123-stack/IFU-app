import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ROUTE_REGISTRY } from '../app/routes';
import { useAppContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { assetPath } from '../utils/assets';
import { supabase } from '../lib/supabase';

function accentClass(accent) {
  if (accent === 'secondary') {
    return 'bg-secondary-fixed text-on-secondary-fixed';
  }
  if (accent === 'primary') {
    return 'bg-primary-fixed text-on-primary-fixed';
  }
  return 'bg-surface-container text-primary';
}

export function HomeScreen() {
  const { homeCards, customScreenTexts } = useAppContent();
  const { user, profile } = useAuth();

  // Wishlist Feature Submission State
  const [showWishForm, setShowWishForm] = useState(false);
  const [wishTitle, setWishTitle] = useState('');
  const [wishDesc, setWishDesc] = useState('');
  const [submittingWish, setSubmittingWish] = useState(false);
  const [wishStatus, setWishStatus] = useState(null);
  const [userWishes, setUserWishes] = useState([]);

  const handleSubmitWish = async (e) => {
    e.preventDefault();
    if (!wishTitle.trim() || !wishDesc.trim()) return;

    try {
      setSubmittingWish(true);
      setWishStatus(null);

      // 1. Insert wish to Supabase database table
      const { data: dbData, error: dbError } = await supabase
        .from('feature_wishes')
        .insert({
          title: wishTitle.trim(),
          description: wishDesc.trim(),
          user_id: user ? user.id : null
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 2. If user is logged in, attempt to invoke the Edge Function for GitHub issue sync
      if (user) {
        try {
          await supabase.functions.invoke('submit-wishlist', {
            body: { title: wishTitle.trim(), description: wishDesc.trim() }
          });
        } catch (gitErr) {
          console.warn('Could not sync wish to GitHub Issues directly:', gitErr);
        }
      }

      // 3. Save to in-memory transient list so user sees it during this session
      const transientWish = {
        id: dbData?.id || Math.random().toString(),
        title: wishTitle.trim(),
        description: wishDesc.trim(),
        createdAt: dbData?.created_at || new Date().toISOString()
      };

      setUserWishes(prev => [transientWish, ...prev]);
      setWishTitle('');
      setWishDesc('');
      setShowWishForm(false);
      setWishStatus({ type: 'success', message: '提交成功！感謝您的寶貴提案。' });
    } catch (err) {
      console.error('Error submitting feature wish:', err);
      setWishStatus({
        type: 'warning',
        message: '提交失敗，請檢查網路連線後重試。'
      });
    } finally {
      setSubmittingWish(false);
    }
  };

  const handleRemoveWish = (id) => {
    if (window.confirm('確定要從本次顯示清單中移除此願望嗎？（這不會影響已提交至資料庫的內容）')) {
      setUserWishes(prev => prev.filter(w => w.id !== id));
    }
  };

  return (
    <>
      <header className="glass-topbar sticky top-0 z-30">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Icon name="menu_book" className="text-[18px] sm:text-[22px] text-primary shrink-0" />
            <p className="font-headline text-sm sm:text-base md:text-xl font-bold tracking-tight text-primary whitespace-nowrap no-truncate-on-mobile">
              {customScreenTexts['home:hero-title'] || '基督門徒訓練'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {user ? (
              <Link
                to={ROUTE_REGISTRY.PROFILE}
                className="inline-flex h-7 sm:h-9 items-center gap-1.5 rounded-full bg-surface-container-lowest px-3 sm:px-4 text-[10px] sm:text-sm font-semibold text-on-surface shadow-[0_8px_22px_rgba(40,53,28,0.08)] ring-1 ring-[rgba(40,53,28,0.06)] transition-all active:scale-95 whitespace-nowrap"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="h-4 w-4 sm:h-5 sm:w-5 rounded-full object-cover shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = assetPath('assets/default_avatar.png');
                    }}
                  />
                ) : (
                  <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-secondary shrink-0" />
                )}
                {profile?.display_name || '個人檔案'}
              </Link>
            ) : (
              <Link
                to={ROUTE_REGISTRY.LOGIN}
                className="inline-flex h-7 sm:h-9 items-center gap-1.5 rounded-full bg-surface-container-lowest px-3 sm:px-4 text-[10px] sm:text-sm font-semibold text-on-surface shadow-[0_8px_22px_rgba(40,53,28,0.08)] ring-1 ring-[rgba(40,53,28,0.06)] transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-secondary shrink-0" />
                登錄
              </Link>
            )}
          </div>
        </div>
        <div className="h-px bg-[rgba(40,53,28,0.05)]" />
      </header>

      <main className="relative overflow-hidden px-6 pb-36 pt-10">
        <div className="pointer-events-none absolute inset-x-0 top-3 z-0 flex justify-center">
          <div className="h-44 w-44 rounded-full bg-secondary/10 blur-[84px]" />
        </div>

        <section className="relative z-10 mx-auto mb-14 mt-2 max-w-xl text-center">
          <h1 className="font-headline text-[3.2rem] leading-[1.06] tracking-tight text-primary">
            {customScreenTexts['home:hero-title'] || '基督門徒訓練'}
          </h1>
          <p className="mx-auto mt-5 max-w-[18rem] text-lg leading-8 text-on-surface-variant">
            {customScreenTexts['home:hero-subtitle'] || '在信仰中成長的旅程，一步一腳印。'}
          </p>
        </section>

        {/* 功能許願池 (Feature Wishlist) Section */}
        <section className="relative z-10 mb-10">
          <div className="rounded-[1.7rem] bg-surface-container-lowest p-8 shadow-[0_20px_55px_rgba(40,53,28,0.08)] border border-outline-variant/30">
            <div className="relative flex items-start gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-700">
                <Icon name="lightbulb" className="text-[30px]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-headline text-[1.9rem] text-primary whitespace-nowrap">
                  新功能許願池
                </h2>
                <div className="mt-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWishForm(!showWishForm);
                      setWishStatus(null);
                    }}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary/5 px-4 text-xs font-bold text-primary transition hover:bg-primary/10 active:scale-95 cursor-pointer"
                  >
                    <Icon name={showWishForm ? "close" : "edit"} className="text-sm" />
                    {showWishForm ? '收起願望' : '我要許願'}
                  </button>
                </div>
              </div>
            </div>

            {/* Success/Error Feedback */}
            {wishStatus && (
              <div className={`mt-4 flex items-start gap-2.5 rounded-2xl p-4 text-xs font-semibold leading-relaxed border ${
                wishStatus.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <Icon name={wishStatus.type === 'success' ? 'check_circle' : 'warning'} className="text-base shrink-0 mt-0.5" />
                <div>{wishStatus.message}</div>
              </div>
            )}

            {/* Wish Submission Form */}
            {showWishForm && (
              <form onSubmit={handleSubmitWish} className="mt-5 space-y-4 pt-4 border-t border-outline-variant/35 animate-slide-down">
                <div>
                  <label className="block text-xs font-extrabold text-secondary uppercase tracking-wider">需求標題 (Title)</label>
                  <input
                    type="text"
                    required
                    placeholder="例如: 增加新課程進度重置功能"
                    value={wishTitle}
                    onChange={(e) => setWishTitle(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low/40 p-3 text-sm outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-secondary uppercase tracking-wider">詳細描述 (Description)</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="請詳細說明您想看到的功能，或者想要解決的問題。我們會將此想法同步至 GitHub 專案！"
                    value={wishDesc}
                    onChange={(e) => setWishDesc(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low/40 p-3 text-sm outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10 font-sans leading-relaxed resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWishForm(false)}
                    className="rounded-full border border-outline-variant px-5 py-2 text-xs font-bold text-on-surface-variant hover:bg-outline-variant/10 active:scale-95 transition cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={submittingWish}
                    className="rounded-full bg-primary px-6 py-2 text-xs font-extrabold tracking-widest text-white shadow-sm hover:brightness-105 active:scale-98 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {submittingWish ? (
                      <>
                        <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        提交中...
                      </>
                    ) : (
                      <>
                        <Icon name="send" className="text-xs" />
                        提交需求
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* User Submitted Wishes List */}
            {userWishes.length > 0 && (
              <div className="mt-5 pt-4 border-t border-outline-variant/35">
                <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="stars" className="text-amber-500 text-sm" />
                  已提交的提案 ({userWishes.length})
                </h4>
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto scrollbar-none pr-1">
                  {userWishes.map((wish) => (
                    <div key={wish.id} className="flex items-start justify-between gap-3 rounded-xl bg-surface-container-low/40 p-3 border border-outline-variant/20 hover:bg-surface-container-low transition-all">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-primary truncate">{wish.title}</p>
                        <p className="text-[10px] text-on-surface-variant/75 mt-0.5 leading-relaxed break-words">{wish.description}</p>
                        <p className="text-[8px] text-on-surface-variant/45 mt-1">
                          {new Date(wish.createdAt).toLocaleDateString('zh-TW', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveWish(wish.id)}
                        className="text-on-surface-variant/40 hover:text-red-500 transition p-1 cursor-pointer shrink-0"
                        title="刪除本地記錄"
                      >
                        <Icon name="delete" className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="relative z-10 space-y-5">
          {homeCards.map((card) => (
            <Link
              key={card.id || card.title}
              to={card.route}
              className="group block overflow-hidden rounded-[1.7rem] bg-surface-container-lowest p-8 shadow-[0_20px_55px_rgba(40,53,28,0.08)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_28px_62px_rgba(40,53,28,0.12)]"
            >
              <div className="absolute" />
              <div className="relative flex items-start gap-6">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${accentClass(
                    card.accent,
                  )}`}
                >
                  <Icon name={card.icon} className="text-[30px]" />
                </div>
                <div className="flex-1">
                  <h2 className="font-headline text-[1.9rem] text-primary">
                    {card.title}
                  </h2>
                  <p className="mt-2 leading-7 text-on-surface-variant">
                    {card.description}
                  </p>
                </div>
                <Icon
                  name="arrow_forward"
                  className="translate-x-3 self-center text-[22px] text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </div>
            </Link>
          ))}
        </section>

        <section className="relative z-10 mt-14 text-center">
          <Link
            to={ROUTE_REGISTRY.JOURNEY}
            className="inline-flex items-center rounded-full bg-secondary px-8 py-4 font-body text-sm font-extrabold tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(121,89,0,0.24)] transition-all duration-300 hover:brightness-105 active:scale-95"
          >
            開啟你的旅程
          </Link>
          <p className="mt-4 font-body text-[11px] font-extrabold tracking-[0.22em] text-primary/40">
            {customScreenTexts['home:footer-text'] || '每週更新課程'}
          </p>
        </section>
      </main>
    </>
  );
}

