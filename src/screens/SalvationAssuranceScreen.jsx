import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';
import { ScriptureCard } from '../components/ScriptureCard';
import { useAppContent } from '../context/ContentContext';

function SavedAnswer({ storageKey }) {
  const [answer, setAnswer] = useState('');
  const storageName = `ifu:${storageKey}`;

  useEffect(() => {
    setAnswer(window.localStorage.getItem(storageName) ?? '');
  }, [storageName]);

  function handleChange(event) {
    const nextAnswer = event.target.value;
    setAnswer(nextAnswer);
    window.localStorage.setItem(storageName, nextAnswer);
  }

  return (
    <label className="mt-5 block">
      <span className="sr-only">你的答案</span>
      <textarea
        value={answer}
        onChange={handleChange}
        rows={4}
        className="min-h-28 w-full resize-y rounded-[1.25rem] border border-outline-variant bg-surface-container-low/55 p-4 text-base leading-7 text-on-surface outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
        placeholder="在這裡輸入你的答案..."
      />
      <span className="mt-2 block text-right text-[11px] font-bold tracking-[0.12em] text-on-surface-variant/55">
        已自動儲存
      </span>
    </label>
  );
}

function ScriptureToggle({ scripture }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!scripture) return null;

  return (
    <div className="rounded-[1.45rem] border border-outline-variant/60 bg-surface-container-lowest">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left text-primary"
      >
        <span>
          {scripture.book && (
            <span className="block font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
              {scripture.book}
            </span>
          )}
          <span className="mt-1 block font-headline text-[1.15rem] leading-tight">
            {scripture.reference}
          </span>
        </span>
        <Icon
          name={isOpen ? 'expand_less' : 'expand_more'}
          className="shrink-0 text-[24px] text-secondary"
        />
      </button>
      {isOpen ? (
        <div className="border-t border-outline-variant/50 px-4 pb-5 pt-4">
          <p className="font-headline text-[1.05rem] leading-8 text-primary">
            {scripture.chinese}
          </p>
          {scripture.english && (
            <p className="mt-4 text-sm leading-7 text-on-surface-variant">
              {scripture.english}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function GospelSection({ section, index }) {
  return (
    <article className="overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[0_18px_46px_rgba(40,53,28,0.08)]">
      <div className="bg-surface-container-low p-6">
        <div className="flex items-center gap-3 text-primary">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-white">
            <Icon name={section.icon || 'star'} className="text-[22px]" />
          </div>
          <div>
            <p className="font-body text-[10px] font-extrabold tracking-[0.2em] text-secondary">
              福音內容摘要
            </p>
            <h3 className="mt-1 font-headline text-[1.45rem] text-primary">
              {section.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        {section.scriptures?.map((scripture) => (
          <ScriptureCard
            key={scripture.reference}
            reference={scripture.reference}
            verse={scripture.verse || scripture.chinese}
            tone={index === 1 ? 'glass' : 'light'}
          />
        ))}

        <div className="grid gap-3">
          {section.truths?.map((truth, tIdx) => (
            <div
              key={tIdx}
              className="rounded-[1.25rem] bg-surface-container-low p-4"
            >
              <p className="whitespace-pre-line text-sm leading-7 text-on-surface-variant">
                {typeof truth === 'string' ? truth : truth.text}
              </p>
            </div>
          ))}
        </div>

        {section.note && (
          <div className="rounded-[1.35rem] border-l-4 border-l-secondary bg-secondary-fixed/34 p-4">
            <p className="font-headline text-[1.08rem] leading-8 text-primary">
              {section.note}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

export function SalvationAssuranceScreen() {
  const { lessonRoutes, assuranceGospelSections } = useAppContent();
  const [showGospelReview, setShowGospelReview] = useState(false);

  const activeLesson = lessonRoutes.find((r) => r.id === 'lesson-salvation-assurance');

  if (!activeLesson) {
    return (
      <div className="p-12 text-center text-on-surface-variant font-bold">
        加載中或無此課程...
      </div>
    );
  }

  // Helper to map card styling from presets
  const getCardStyle = (accent) => {
    if (accent === 'primary') {
      return 'bg-primary text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)] p-8 rounded-[2.35rem] relative overflow-hidden';
    }
    if (accent === 'secondary') {
      return 'bg-secondary text-white shadow-[0_28px_72px_rgba(121,89,0,0.22)] p-8 rounded-[2.35rem] relative overflow-hidden';
    }
    if (accent === 'tertiary') {
      return 'bg-surface-container-low p-6 rounded-[2rem] text-primary border border-outline-variant/50 shadow-[0_18px_42px_rgba(40,53,28,0.08)]';
    }
    // Default surface/white theme
    return 'bg-surface-container-lowest p-6 rounded-[2rem] text-primary border border-outline-variant/30 shadow-[0_18px_42px_rgba(40,53,28,0.08)]';
  };

  return (
    <>
      <PageHeader title={activeLesson.title} backTo="/journey" />

      <main className="px-6 pb-36 pt-8 flex flex-col items-center">
        <div className="w-full space-y-8 flex flex-col items-center">
          {activeLesson.modules.map((mod) => {
            const cardTheme = mod.visual?.accent || 'surface';
            const cardStyle = getCardStyle(cardTheme);
            const sizeClass = mod.visual?.imageStyle || 'max-w-2xl'; // width
            const heightClass = mod.visual?.eyebrow || 'min-h-auto'; // height

            return (
              <section
                key={mod.id}
                className={`w-full ${sizeClass} ${heightClass} ${cardStyle}`}
              >
                {/* Visual ambient gradients for primary green cards */}
                {cardTheme === 'primary' && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)] pointer-events-none" />
                )}

                {/* Card Title Header */}
                {mod.title && mod.kind !== 'extension-card' && mod.kind !== 'appendix' && (
                  <div className={`flex items-center gap-3 mb-5 ${cardTheme === 'primary' ? 'text-secondary-fixed-dim' : 'text-secondary'}`}>
                    {mod.kind === 'reflection-prompt' && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed font-body text-sm font-extrabold text-on-secondary-fixed">
                        {mod.number || 'Q'}
                      </span>
                    )}
                    <h3 className={`font-headline text-[1.45rem] leading-tight ${cardTheme === 'primary' ? 'text-white font-black' : 'text-primary'}`}>
                      {mod.title}
                    </h3>
                  </div>
                )}

                {/* Render different kinds of study modules */}
                {mod.kind === 'content-section' && (
                  <div className="relative">
                    {mod.body && (
                      <p className={`text-[1.08rem] leading-8 ${cardTheme === 'primary' ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                        {mod.body}
                      </p>
                    )}
                    {mod.scriptures && (
                      <div className="mt-5 grid gap-3">
                        {mod.scriptures.map((sc, sIdx) => (
                          <ScriptureToggle key={sIdx} scripture={sc} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {mod.kind === 'reflection-prompt' && (
                  <div className="relative">
                    <p className="text-[1.05rem] leading-8 text-on-surface">{mod.prompt}</p>
                    {mod.scriptures && (
                      <div className="mt-5 grid gap-3">
                        {mod.scriptures.map((sc, sIdx) => (
                          <ScriptureToggle key={sIdx} scripture={sc} />
                        ))}
                      </div>
                    )}
                    <SavedAnswer storageKey={mod.storageKey} />
                  </div>
                )}

                {mod.kind === 'prayer' && (
                  <div className="relative">
                    <p className={`font-headline text-[1.08rem] leading-8 ${cardTheme === 'primary' ? 'text-white' : 'text-primary'}`}>
                      {mod.body}
                    </p>
                  </div>
                )}

                {mod.kind === 'appendix' && (
                  <div className="relative">
                    <div className="flex items-center gap-3 text-secondary">
                      <Icon name="article" className="text-[22px]" />
                      <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                        {mod.title || '附件'}
                      </p>
                    </div>
                    <h2 className="mt-4 font-headline text-[1.8rem] text-primary">
                      {mod.title || '附件'}
                    </h2>
                    {mod.body && (
                      <p className="mt-4 leading-7 text-on-surface-variant">
                        {mod.body}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowGospelReview(true)}
                      className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95 cursor-pointer"
                    >
                      查看附件
                      <Icon name="open_in_full" className="text-[18px]" />
                    </button>
                  </div>
                )}

                {mod.kind === 'extension-card' && (
                  <div className="relative">
                    <div className="flex items-center gap-3 text-secondary">
                      <Icon name="extension" className="text-[22px]" />
                      <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                        延伸學習
                      </p>
                    </div>
                    <h3 className="mt-4 font-headline text-[1.55rem] leading-tight text-primary">
                      {mod.title}
                    </h3>
                    {mod.description && (
                      <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                        {mod.description}
                      </p>
                    )}
                    <Link
                      to={mod.route}
                      className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
                    >
                      開始延伸學習
                      <Icon name="arrow_forward" className="text-[18px]" />
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <section className="mt-8 w-full max-w-2xl">
          <JourneyPager next={{ to: '/journey/quiet-time', label: '靈修' }} />
        </section>
      </main>

      {showGospelReview ? (
        <div className="fixed inset-0 z-50 bg-black/45 px-4 py-6 backdrop-blur-sm">
          <div className="mx-auto flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-surface shadow-[0_28px_80px_rgba(20,25,18,0.32)] border border-outline-variant/60">
            <div className="flex items-start justify-between gap-4 border-b border-outline-variant/50 bg-surface-container-lowest p-5">
              <div>
                <p className="font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
                  附件A
                </p>
                <h2 className="mt-1 font-headline text-[1.55rem] leading-tight text-primary">
                  與神和好的褔音
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowGospelReview(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary transition-all active:scale-95"
                aria-label="關閉附件"
              >
                <Icon name="close" className="text-[22px]" />
              </button>
            </div>
            <div className="overflow-y-auto p-5 bg-surface-container-lowest/30">
              <div className="grid gap-6">
                {assuranceGospelSections.map((section, index) => (
                  <GospelSection
                    key={section.title}
                    section={section}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
