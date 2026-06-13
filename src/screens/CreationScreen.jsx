import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';
import { ScriptureCard } from '../components/ScriptureCard';
import { useAppContent } from '../context/ContentContext';

export function CreationScreen() {
  const [showQuote, setShowQuote] = useState(false);
  const { creationCards, customScreenTexts } = useAppContent();

  return (
    <>
      <PageHeader title="神的創造" backTo="/journey" />

      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2rem] bg-surface-container-low p-8 shadow-[0_18px_44px_rgba(40,53,28,0.08)]">
          <div className="flex items-center gap-3 text-secondary">
            <Icon name="menu_book" className="text-[20px]" />
            <p className="font-body text-[11px] font-extrabold tracking-[0.22em]">
              神的話語
            </p>
          </div>
          <p className="mt-6 font-headline text-[1.22rem] leading-9 text-primary">
            「
            <span className="font-black text-secondary">26</span>
            神說：我們要照著我們的形像、按著我們的樣式造人……
            <span className="font-black text-secondary">27</span>
            神就照著自己的形像造人，乃是照著他的形像造男造女。」
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-px w-10 bg-secondary/35" />
            <p className="font-body text-[11px] font-extrabold tracking-[0.22em] text-secondary">
              創世記 1:26-27
            </p>
          </div>
        </section>

        <section className="relative py-12">
          <div className="flex flex-col items-center space-y-10 text-center">
            <div className="relative flex w-full max-w-[20rem] items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-container text-on-primary">
                  <span className="font-headline text-[1.8rem] font-black">神</span>
                </div>
                <span className="mt-4 font-body text-[11px] font-extrabold tracking-[0.22em] text-primary/55">
                  CREATOR
                </span>
              </div>

              <button
                onClick={() => setShowQuote(true)}
                className="absolute left-1/2 top-7 z-10 -translate-x-1/2 rounded-full bg-secondary p-2.5 text-white shadow-[0_10px_28px_rgba(121,89,0,0.28)] ring-4 ring-surface transition-all hover:scale-105 active:scale-95"
                type="button"
              >
                <Icon name="auto_awesome" filled className="text-[17px]" />
              </button>
              <div className="absolute left-1/2 top-10 h-[2px] w-44 -translate-x-1/2 overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full w-full animate-pulse bg-[linear-gradient(90deg,transparent,_#795900,_transparent)]" />
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-high text-primary">
                  <span className="font-headline text-[1.8rem] font-black">人</span>
                </div>
                <span className="mt-4 font-body text-[11px] font-extrabold tracking-[0.22em] text-primary/55">
                  CREATION
                </span>
              </div>
            </div>

            <div className="max-w-[20rem]">
              <h2 className="font-headline text-[2.2rem] leading-tight text-primary">
                {customScreenTexts['creation:hero-title'] || '起初，萬物和諧'}
              </h2>
              <p className="mt-4 leading-7 text-on-surface-variant">
                {customScreenTexts['creation:hero-desc'] || '在世界的起源，創造主與受造物之間存在著一個完美的連結。'}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5">
          {creationCards.map((card, index) => (
            <article
              key={card.title}
              className={`overflow-hidden rounded-[1.75rem] ${
                index === 0 ? 'bg-surface-container-low p-8' : 'bg-surface-container-lowest p-8'
              } shadow-[0_18px_46px_rgba(40,53,28,0.08)]`}
            >
              <div className="flex flex-col gap-7">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Icon name={card.icon} className="text-[22px]" />
                    <span className="font-body text-sm font-extrabold uppercase tracking-[0.18em]">
                      {card.eyebrow}
                    </span>
                  </div>
                  <h3 className="font-headline text-[1.75rem] text-primary">
                    {card.title}
                  </h3>
                  <p className="leading-7 text-on-surface-variant">{card.text}</p>
                  {index === 0 ? (
                    <div className="rounded-r-xl bg-surface/60 p-4">
                      <p className="text-sm italic leading-7 text-on-surface-variant">
                        「諸天述說神的榮耀，穹蒼傳揚他的手段。」(詩篇 19:1)
                      </p>
                    </div>
                  ) : null}
                </div>
                <img
                  src={card.imageSrc}
                  alt=""
                  className={`h-44 w-full rounded-[1.4rem] object-cover ${card.imageStyle}`}
                  loading="lazy"
                />
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12 overflow-hidden rounded-[2.4rem] bg-[radial-gradient(circle_at_center,_#30312e_0%,_#10110f_100%)] shadow-[0_28px_72px_rgba(18,19,17,0.36)]">
          <div className="relative isolate min-h-[33rem]">
            <div className="absolute inset-0 opacity-30">
              <div className="h-full w-full bg-[linear-gradient(135deg,_rgba(255,223,160,0.12),_transparent_35%,_rgba(62,76,49,0.35)_100%)]" />
            </div>
            <div className="absolute left-0 top-0 flex h-full w-[42%] flex-col items-center justify-center bg-[linear-gradient(135deg,_#ffdfa0_0%,_#795900_100%)] px-4 text-center text-white [clip-path:polygon(0_0,100%_0,72%_100%,0_100%)]">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/20">
                <span className="font-headline text-4xl font-black">神</span>
              </div>
              <p className="mt-5 font-body text-[10px] font-extrabold tracking-[0.28em]">
                聖潔 HOLY
              </p>
            </div>
            <div className="absolute right-0 top-0 flex h-full w-[42%] flex-col items-center justify-center bg-[linear-gradient(225deg,_#3e4c31_0%,_#11120f_100%)] px-4 text-center text-primary-fixed [clip-path:polygon(28%_0,100%_0,100%_100%,0_100%)]">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/40 bg-black/35">
                <span className="font-headline text-4xl font-black">人</span>
              </div>
              <p className="mt-5 font-body text-[10px] font-extrabold tracking-[0.28em]">
                罪人 SINNER
              </p>
            </div>
            <div className="absolute inset-0 z-10 flex items-center justify-center px-8 text-center">
              <div className="max-w-xs">
                <h3 className="font-headline text-[1.9rem] leading-relaxed text-white">
                  可惜人選擇了犯罪離開神，像與神分隔在
                  <span className="text-secondary-fixed">懸崖的兩邊。</span>
                </h3>
                <Link
                  to="/journey/problem"
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-secondary px-8 py-4 text-sm font-extrabold tracking-[0.16em] text-white shadow-[0_18px_42px_rgba(121,89,0,0.34)] transition-all hover:brightness-105 active:scale-95"
                >
                  Next: 人的問題
                  <Icon name="arrow_forward" className="text-[18px]" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <JourneyPager next={{ to: '/journey/problem', label: '人的問題' }} />
        </section>
      </main>

      {showQuote ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.8rem] bg-surface-container-lowest p-8 shadow-[0_28px_70px_rgba(20,25,18,0.28)]">
            <div className="mb-6 h-1 w-12 rounded-full bg-secondary" />
            <p className="font-body text-[11px] font-extrabold tracking-[0.22em] text-secondary">
              聖經引錄
            </p>
            <p className="mt-5 font-headline text-[1.25rem] leading-9 text-primary">
              「神說：我們要照著我們的形像、按著我們的樣式造人……神就照著自己的形像造男造女。」
            </p>
            <p className="mt-4 font-body text-sm font-extrabold tracking-[0.18em] text-secondary">
              創世記 1:26-27
            </p>
            <button
              onClick={() => setShowQuote(false)}
              className="mt-8 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all active:scale-95"
              type="button"
            >
              關閉
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
