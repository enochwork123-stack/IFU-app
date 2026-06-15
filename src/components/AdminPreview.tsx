import React, { useState } from 'react';
import { useAppContent } from '../context/ContentContext';
import type { StudyModule, ScriptureReference } from '../types/content';
import { useLanguage, Language } from '../context/LanguageContext';

// Simple Material Icon mimic if not loaded (though we have Icon / Material Icons font loaded globally)
const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

// Accent class matching HomeScreen.jsx
const accentClass = (accent: string) => {
  if (accent === 'secondary') {
    return 'bg-secondary-fixed text-on-secondary-fixed';
  }
  if (accent === 'primary') {
    return 'bg-primary-fixed text-on-primary-fixed';
  }
  return 'bg-surface-container text-primary';
};

// Card styles matching SalvationAssuranceScreen / QuietTimeScreen
const getCardStyle = (accent?: string) => {
  if (accent === 'primary') {
    return 'bg-primary text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)] p-8 rounded-[2.35rem] relative overflow-hidden';
  }
  if (accent === 'secondary') {
    return 'bg-secondary text-white shadow-[0_28px_72px_rgba(121,89,0,0.22)] p-8 rounded-[2.35rem] relative overflow-hidden';
  }
  if (accent === 'tertiary') {
    return 'bg-surface-container-low p-6 rounded-[2rem] text-primary border border-outline-variant/50 shadow-[0_18px_42px_rgba(40,53,28,0.08)]';
  }
  return 'bg-surface-container-lowest p-6 rounded-[2rem] text-primary border border-outline-variant/30 shadow-[0_18px_42px_rgba(40,53,28,0.08)]';
};

// Reusable mock Scripture reveal accordion
const ScriptureToggle: React.FC<{ scripture: ScriptureReference; language?: Language }> = ({ scripture, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { translateText, language: currentLang } = useLanguage();
  if (!scripture) return null;

  const lang = language || currentLang;

  // Localize book name
  const bookText = scripture.book ? translateText(scripture.book, lang) : '';
  const refText = scripture.reference;

  // Localize Chinese verse
  const chineseText = scripture.chinese ? translateText(scripture.chinese, lang) : '';
  const englishText = scripture.english || '';

  // Order based on language preference
  const showEnglishFirst = lang === 'en';

  return (
    <div className="rounded-[1.45rem] border border-outline-variant/60 bg-surface-container-lowest text-on-surface">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left text-primary"
      >
        <span>
          {bookText && (
            <span className="block font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
              {bookText}
            </span>
          )}
          <span className="mt-1 block font-headline text-[1.15rem] leading-tight text-primary">
            {refText}
          </span>
        </span>
        <Icon
          name={isOpen ? 'expand_less' : 'expand_more'}
          className="shrink-0 text-[24px] text-secondary"
        />
      </button>
      {isOpen && (
        <div className="border-t border-outline-variant/50 px-4 pb-5 pt-4">
          {showEnglishFirst ? (
            <>
              {englishText && (
                <p className="text-sm font-medium leading-7 text-primary">
                  {englishText}
                </p>
              )}
              {chineseText && (
                <p className="mt-4 font-headline text-[1.05rem] leading-8 text-on-surface-variant">
                  {chineseText}
                </p>
              )}
            </>
          ) : (
            <>
              {chineseText && (
                <p className="font-headline text-[1.05rem] leading-8 text-primary">
                  {chineseText}
                </p>
              )}
              {englishText && (
                <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                  {englishText}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// 1. Home Preview (Header, Hero Section, Cards list, CTA, and Footer)
export const HomePreview: React.FC<{ language?: Language }> = ({ language }) => {
  const { homeCards, customScreenTexts } = useAppContent();
  const { t, tContent } = useLanguage();

  const activeLang = language || 'zh-TW';

  return (
    <div className="w-full bg-surface text-on-surface select-none pb-24 font-sans">
      <header className="sticky top-0 z-30 border-b border-[rgba(40,53,28,0.05)] bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <Icon name="menu_book" className="text-xl text-primary" />
            <p className="font-headline text-sm font-bold tracking-tight text-primary truncate max-w-[140px] sm:max-w-xs">
              {tContent(customScreenTexts, 'home:hero-title', activeLang) || t('基督門徒訓練', activeLang)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-secondary">
              <Icon name="admin_panel_settings" className="text-[16px]" />
            </div>
            <button className="flex h-7 items-center gap-1 rounded-full bg-surface-container-lowest px-3 text-[10px] font-semibold text-on-surface ring-1 ring-[rgba(40,53,28,0.06)] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              {t('登錄', activeLang)}
            </button>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden px-5 pt-8">
        <div className="pointer-events-none absolute inset-x-0 top-3 z-0 flex justify-center">
          <div className="h-36 w-36 rounded-full bg-secondary/10 blur-[64px]" />
        </div>

        <section className="relative z-10 mx-auto mb-10 mt-2 text-center">
          <h1 className="font-headline text-3xl font-black leading-tight tracking-tight text-primary">
            {tContent(customScreenTexts, 'home:hero-title', activeLang) || t('基督門徒訓練', activeLang)}
          </h1>
          <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-6 text-on-surface-variant">
            {tContent(customScreenTexts, 'home:hero-subtitle', activeLang) || t('在信仰中成長的旅程，一步一腳印。', activeLang)}
          </p>
        </section>

        <section className="relative z-10 space-y-4 max-w-xl mx-auto">
          {homeCards.map((card) => (
            <div
              key={card.id}
              className="group block overflow-hidden rounded-[1.5rem] bg-white p-5 border border-outline-variant/30 shadow-sm transition hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accentClass(
                    card.accent,
                  )}`}
                >
                  <Icon name={card.icon} className="text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-headline text-lg font-bold text-primary truncate">
                    {tContent(card, 'title', activeLang)}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-on-surface-variant line-clamp-2">
                    {tContent(card, 'description', activeLang)}
                  </p>
                </div>
                <Icon
                  name="arrow_forward"
                  className="self-center text-lg text-secondary"
                />
              </div>
            </div>
          ))}
        </section>

        <section className="relative z-10 mt-10 text-center">
          <button
            type="button"
            className="inline-flex items-center rounded-full bg-secondary px-6 py-3 text-xs font-extrabold tracking-widest text-white shadow-md active:scale-95"
          >
            {t('開啟你的旅程', activeLang)}
          </button>
          <p className="mt-3 text-[10px] font-extrabold tracking-widest text-primary/40">
            {tContent(customScreenTexts, 'home:footer-text', activeLang) || t('每週更新課程', activeLang)}
          </p>
        </section>
      </main>
    </div>
  );
};

// 2. Journey Path Preview (Visual 12 steps flow)
export const JourneyPreview: React.FC<{ language?: Language }> = ({ language }) => {
  const { discipleshipSteps, customScreenTexts } = useAppContent();
  const { t, tContent } = useLanguage();

  const activeLang = language || 'zh-TW';
  const sortedSteps = [...discipleshipSteps].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full bg-surface text-on-surface pb-24 font-sans select-none">
      <header className="p-5 border-b border-[rgba(40,53,28,0.05)] bg-white/80 backdrop-blur-md">
        <h1 className="font-headline text-2xl font-black text-primary">
          {tContent(customScreenTexts, 'journey:title', activeLang) || t('門徒生命成長路徑', activeLang)}
        </h1>
        <p className="text-xs font-bold text-secondary">
          {tContent(customScreenTexts, 'journey:subtitle', activeLang) || t('Discipleship Journey', activeLang)}
        </p>
      </header>

      <main className="px-5 pt-6 max-w-xl mx-auto">
        <div className="relative">
          {/* Central connector line */}
          <div className="absolute bottom-4 left-9 top-4 -z-10 w-0.5 bg-outline-variant/60" />

          {sortedSteps.map((step) => {
            const isLocked = step.status === 'locked';
            const isActive = step.status === 'active';
            const isComplete = step.status === 'complete';

            return (
              <div
                key={step.id}
                className={`relative mb-3.5 flex w-full items-center rounded-2xl border p-4 text-left bg-white shadow-sm border-outline-variant/30 ${
                  isLocked ? 'opacity-55 grayscale' : ''
                } ${isActive ? 'ring-2 ring-secondary' : ''}`}
              >
                <div
                  className={`mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    isActive
                      ? 'bg-secondary text-white'
                      : isComplete
                      ? 'bg-green-100 text-green-700'
                      : 'bg-surface-container-high text-primary'
                  }`}
                >
                  <Icon name={isLocked ? 'lock' : step.icon} className="text-lg" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-secondary">
                      Step {step.order}
                    </span>
                    {isComplete && (
                      <Icon name="check_circle" className="text-xs text-green-600" />
                    )}
                  </div>
                  <h3 className="font-headline text-sm font-bold leading-tight text-primary truncate">
                    {tContent(step, 'title', activeLang)}
                  </h3>
                  <p className="truncate text-[10px] text-on-surface-variant/70">
                    {tContent(step, 'subtitle', activeLang)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

// 3. Lesson Preview (Previewing dynamic card composition: Headers, script reveals, reflection worksheets)
interface LessonPreviewProps {
  lessonId: string;
}

export const LessonPreview: React.FC<LessonPreviewProps & { language?: Language }> = ({ lessonId, language }) => {
  const { lessonRoutes } = useAppContent();
  const { t, tContent } = useLanguage();

  const activeLang = language || 'zh-TW';
  const activeLesson = lessonRoutes.find((r) => r.id === lessonId);

  if (!activeLesson) {
    return (
      <div className="p-8 text-center text-xs font-bold text-on-surface-variant">
        {t('加載中或無此課程...', activeLang)}
      </div>
    );
  }

  return (
    <div className="w-full bg-surface text-on-surface pb-32 font-sans select-none">
      {/* Page header mock */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-outline-variant/30 bg-white/95 px-4 py-3">
        <div className="flex items-center gap-2 text-primary">
          <Icon name="arrow_back" className="text-lg cursor-pointer" />
          <h2 className="font-headline text-sm font-black leading-tight">
            {tContent(activeLesson, 'title', activeLang)}
          </h2>
        </div>
        <span className="text-[10px] font-bold text-secondary font-mono bg-surface-container px-2 py-0.5 rounded">
          {activeLesson.id.replace('lesson-', '')}
        </span>
      </div>

      {/* Cards list */}
      <div className="px-4 py-6 space-y-6 flex flex-col items-center">
        {activeLesson.modules.map((mod: StudyModule) => {
          const cardTheme = mod.visual?.accent || 'surface';
          const cardStyle = getCardStyle(cardTheme);
          const sizeClass = mod.visual?.imageStyle || 'max-w-2xl';
          const heightClass = mod.visual?.eyebrow || 'min-h-auto';

          return (
            <section
              key={mod.id}
              className={`w-full ${sizeClass} ${heightClass} ${cardStyle} relative border-outline-variant/30`}
            >
              {cardTheme === 'primary' && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.15),_transparent_35%)] pointer-events-none" />
              )}

              {/* Title display */}
              {tContent(mod, 'title', activeLang) && mod.kind !== 'extension-card' && mod.kind !== 'appendix' && (
                <div
                  className={`flex items-center gap-2 mb-3.5 ${
                    cardTheme === 'primary' ? 'text-secondary-fixed-dim' : 'text-secondary'
                  }`}
                >
                  {mod.kind === 'reflection-prompt' && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-fixed text-[10px] font-extrabold text-on-secondary-fixed">
                      {(mod as any).number || 'Q'}
                    </span>
                  )}
                  <h3
                    className={`font-headline text-base font-bold leading-snug ${
                      cardTheme === 'primary' ? 'text-white' : 'text-primary'
                    }`}
                  >
                    {tContent(mod, 'title', activeLang)}
                  </h3>
                </div>
              )}

              {/* Kind based content rendering */}
              {mod.kind === 'content-section' && (
                <div className="space-y-3">
                  {tContent(mod, 'body', activeLang) && (
                    <p
                      className={`text-xs leading-6 whitespace-pre-wrap ${
                        cardTheme === 'primary' ? 'text-on-primary-container' : 'text-on-surface-variant'
                      }`}
                    >
                      {tContent(mod, 'body', activeLang)}
                    </p>
                  )}
                  {mod.scriptures && mod.scriptures.length > 0 && (
                    <div className="mt-3.5 space-y-2">
                      {mod.scriptures.map((sc, sIdx) => (
                        <ScriptureToggle key={sIdx} scripture={sc} language={activeLang} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {mod.kind === 'reflection-prompt' && (
                <div className="space-y-3 text-on-surface">
                  <p className="text-xs font-semibold leading-5 text-on-surface">
                    {tContent(mod, 'prompt', activeLang)}
                  </p>
                  {(mod as any).scriptures && (mod as any).scriptures.length > 0 && (
                    <div className="space-y-2">
                      {(mod as any).scriptures.map((sc: ScriptureReference, sIdx: number) => (
                        <ScriptureToggle key={sIdx} scripture={sc} language={activeLang} />
                      ))}
                    </div>
                  )}
                  <div className="mt-3">
                    <textarea
                      disabled
                      rows={2}
                      className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-low/50 p-2.5 text-xs text-on-surface-variant outline-none"
                      placeholder={t('在這裡輸入你的答案... (預覽模式不可輸入)', activeLang)}
                    />
                    <span className="mt-1 block text-right text-[9px] font-extrabold text-on-surface-variant/40">
                      {t('已自動儲存', activeLang)}
                    </span>
                  </div>
                </div>
              )}

              {mod.kind === 'summary-card' && (
                <div className="space-y-3">
                  {tContent(mod, 'body', activeLang) && (
                    <p
                      className={`text-xs leading-6 whitespace-pre-wrap ${
                        cardTheme === 'primary' ? 'text-on-primary-container' : 'text-on-surface-variant'
                      }`}
                    >
                      {tContent(mod, 'body', activeLang)}
                    </p>
                  )}
                </div>
              )}

              {mod.kind === 'prayer' && (
                <p
                  className={`font-headline text-xs font-bold leading-6 ${
                    cardTheme === 'primary' ? 'text-white' : 'text-primary'
                  }`}
                >
                  {tContent(mod, 'body', activeLang)}
                </p>
              )}

              {mod.kind === 'appendix' && (
                <div className="text-on-surface">
                  <div className="flex items-center gap-2 text-secondary">
                    <Icon name="article" className="text-lg" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider">
                      {t('附件', activeLang)}
                    </span>
                  </div>
                  <h4 className="mt-2 font-headline text-base font-bold text-primary">
                    {tContent(mod, 'title', activeLang) || t('附件標題', activeLang)}
                  </h4>
                  {tContent(mod, 'body', activeLang) && (
                    <p className="mt-2 text-xs leading-5 text-on-surface-variant">
                      {tContent(mod, 'body', activeLang)}
                    </p>
                  )}
                  <button
                    type="button"
                    className="mt-3 flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-[10px] font-extrabold text-white"
                  >
                    {t('查看附件', activeLang)}
                    <Icon name="open_in_full" className="text-[12px]" />
                  </button>
                </div>
              )}

              {mod.kind === 'extension-card' && (
                <div className="text-on-surface">
                  <div className="flex items-center gap-2 text-secondary">
                    <Icon name="extension" className="text-lg" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider">
                      {t('延伸學習', activeLang)}
                    </span>
                  </div>
                  <h4 className="mt-2 font-headline text-base font-bold text-primary">
                    {tContent(mod, 'title', activeLang)}
                  </h4>
                  {tContent(mod, 'description', activeLang) && (
                    <p className="mt-1 text-[10px] leading-4 text-on-surface-variant">
                      {tContent(mod, 'description', activeLang)}
                    </p>
                  )}
                  <button
                    type="button"
                    className="mt-3.5 flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-[10px] font-extrabold text-white"
                  >
                    {t('開始延伸學習', activeLang)}
                    <Icon name="arrow_forward" className="text-[12px]" />
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
