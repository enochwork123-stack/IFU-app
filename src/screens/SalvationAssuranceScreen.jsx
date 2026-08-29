import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';
import { ScriptureCard } from '../components/ScriptureCard';
import { useAppContent } from '../context/ContentContext';
import { SavedAnswer } from '../components/SavedAnswer';

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

const salvationQ2Scriptures = {
  john524: {
    book: '約翰福音',
    reference: 'John 5:24',
    chinese: '我實實在在的告訴你們，那聽我話、又信差我來者的，就有永生，不至於定罪，是已經出死入生了。',
    english: 'Very truly, I tell you, anyone who hears my word and believes him who sent me has eternal life, and does not come under judgment, but has passed from death to life.',
  },
  john1st511: {
    book: '約翰一書',
    reference: '1John 5:11-12',
    chinese: '這見證，就是神賜給我們永生，這永生也是在他兒子裡面。人有了神的兒子就有生命。沒有神的兒子就沒有生命。',
    english: 'And this is the testimony: God gave us eternal life, and this life is in his Son. Whoever has the Son has life; whoever does not have the Son of God, does not have life.',
  },
  john112: {
    book: '約翰福音',
    reference: 'John 1:12',
    chinese: '凡接待他的，就是信他名的人，他就賜他們權柄，作神的兒女。',
    english: 'But to all who received him, who believed in his name, he gave power to become children of God.',
  },
};

function SalvationQuestion2Table() {
  return (
    <article className="rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-6 text-primary shadow-[0_18px_42px_rgba(40,53,28,0.08)] md:p-8">
      {/* Question 2 Header / Prompt */}
      <div className="flex items-center gap-3 text-secondary">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed font-body text-sm font-extrabold text-on-secondary-fixed">
          2
        </span>
        <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
          問題 2
        </p>
      </div>
      <h3 className="mt-5 font-headline text-[1.45rem] leading-tight text-primary">
        <span className="font-bold text-secondary">哥林多後書 5:17</span>
        {' 說：「'}
        <span className="font-semibold text-primary">若有人在基督裏，他就是新造的人。舊事已過，都變成新的了。</span>
        {'」在你接受耶穌基督救恩的那一刻，你的新生命已經開始了。請記下以下的經文怎樣描寫你的新生命的狀況。'}
      </h3>

      {/* Table Format matching the layout */}
      <div className="mt-6 overflow-hidden rounded-2xl border-2 border-outline-variant/80 bg-surface-container-lowest shadow-sm">
        {/* Row 1: 關於你的罪和罪所帶來的結果 */}
        <div className="grid grid-cols-1 border-b border-outline-variant/70 divide-y divide-outline-variant/70 md:grid-cols-[1fr_1.8fr] md:divide-x md:divide-y-0">
          <div className="flex items-center bg-surface-container-low/40 p-5">
            <p className="font-headline text-[1.05rem] font-bold leading-7 text-primary">
              關於你的罪和罪所帶來的結果
            </p>
          </div>
          <div className="flex flex-col gap-3.5 bg-surface-container-lowest p-5">
            <ScriptureToggle scripture={salvationQ2Scriptures.john524} />
            <SavedAnswer
              storageKey="assurance-q2-sin"
              placeholder="記下約翰福音 5:24 如何描寫你的新生命狀況..."
              rows={3}
              className="mt-1"
            />
          </div>
        </div>

        {/* Row 2: 關於你與神的關係 */}
        <div className="grid grid-cols-1 divide-y divide-outline-variant/70 md:grid-cols-[1fr_1.8fr] md:divide-x md:divide-y-0">
          <div className="flex items-center bg-surface-container-low/40 p-5">
            <p className="font-headline text-[1.05rem] font-bold leading-7 text-primary">
              關於你與神的關係
            </p>
          </div>
          <div className="flex flex-col gap-3.5 bg-surface-container-lowest p-5">
            <ScriptureToggle scripture={salvationQ2Scriptures.john1st511} />
            <ScriptureToggle scripture={salvationQ2Scriptures.john112} />
            <SavedAnswer
              storageKey="assurance-q2-relationship"
              placeholder="記下約翰一書 5:11-12 及 約翰福音 1:12 如何描寫你與神的關係..."
              rows={3}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export function SalvationAssuranceScreen() {
  const { assuranceGospelSections } = useAppContent();
  const [showGospelReview, setShowGospelReview] = useState(false);

  return (
    <>
      <PageHeader title="得救的確據" backTo="/journey" />

      <main className="px-6 pb-36 pt-8">
        {/* Standard Chapter Hero Banner matching chapters 3, 4, 5 */}
        <section className="relative overflow-hidden rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)]" />
          <div className="relative">
            <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
              新生命栽培 : (1)
            </div>
            <h2 className="font-headline text-[2.4rem] leading-tight">
              得救的確據
            </h2>
            <p className="mt-2 font-medium text-secondary-fixed font-body">Assurance of Salvation</p>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container">
              當你真心相信並接受耶穌基督作你個人的救主時，你就已經得到永生，成為神的兒女。神的話語賜給我們清晰而不可動搖的確據。
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-5">
          {/* Question 1 */}
          <article className="rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <div className="flex items-center gap-3 text-secondary">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed font-body text-sm font-extrabold text-on-secondary-fixed">
                1
              </span>
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                問題 1
              </p>
            </div>
            <h3 className="mt-5 font-headline text-[1.45rem] leading-tight text-primary">
              根據約翰福音 1:12，怎樣的人可以成為神的兒女？
            </h3>
            <div className="mt-5 space-y-4">
              <ScriptureToggle scripture={salvationQ2Scriptures.john112} />
              <SavedAnswer storageKey="ifu:salvation-assurance:john-1-12" />
            </div>
          </article>

          {/* Appendix A Card */}
          <section className="rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <div className="flex items-center gap-3 text-secondary">
              <Icon name="article" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                附件
              </p>
            </div>
            <h2 className="mt-4 font-headline text-[1.8rem] text-primary">
              附件A : 與神和好的褔音
            </h2>
            <button
              type="button"
              onClick={() => setShowGospelReview(true)}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95 cursor-pointer"
            >
              查看附件
              <Icon name="open_in_full" className="text-[18px]" />
            </button>
          </section>

          {/* Question 2 Table */}
          <SalvationQuestion2Table />

          {/* Extension Card A */}
          <section className="rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <div className="flex items-center gap-3 text-secondary">
              <Icon name="extension" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                延伸學習 (A)
              </p>
            </div>
            <h3 className="mt-4 font-headline text-[1.55rem] leading-tight text-primary">
              你到底得救了嗎？
            </h3>
            <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
              延伸學習得救確據的反思、引文與教導架構。
            </p>
            <Link
              to="/journey/salvation-assurance/are-you-saved"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
            >
              開始延伸學習
              <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
          </section>

          {/* Extension Card B */}
          <section className="rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <div className="flex items-center gap-3 text-secondary">
              <Icon name="extension" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                延伸學習 (B)
              </p>
            </div>
            <h3 className="mt-4 font-headline text-[1.55rem] leading-tight text-primary">
              確信 vs 迷信
            </h3>
            <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
              延伸學習信心、確據與迷信之間的分辨。
            </p>
            <Link
              to="/journey/salvation-assurance/faith-vs-superstition"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
            >
              開始延伸學習
              <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
          </section>
        </section>

        <section className="mt-8">
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
