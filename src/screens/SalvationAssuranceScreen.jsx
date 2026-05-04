import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';
import { ScriptureCard } from '../components/ScriptureCard';
import { assuranceGospelSections } from '../data/appContent';

const assuranceScriptures = {
  john112: {
    book: '約翰福音',
    reference: 'John 1:12',
    chinese: '凡接待他的，就是信他名的人，他就賜他們權柄， 作神的兒女。',
    english:
      'But to all who received him, who believed in his name, he gave power to become children of God.',
  },
  john524: {
    book: '約翰福音',
    reference: 'John 5: 24',
    chinese:
      '我實實在在的告訴你們，那聽我話、又信差我來者的，就有永生，不至於定罪，是已經出死入生了。',
    english:
      'Very truly, I tell you, anyone who hears my word and believes him who sent me has eternal life, and does not come under judgment, but has passed from death to life.',
  },
  cor517: {
    book: '哥林多後書',
    reference: '2Cor 5:17',
    chinese: '若有人在基督裏，他就是新造的人。舊事已過，都變成新的了。',
    english:
      'So if anyone is in Christ, there is a new creation: everything old has passed away; see, everything has become new!',
  },
  john51113: {
    book: '約翰一書',
    reference: '1John 5:11-13',
    chinese:
      '這見證，就是神賜給我們永生，這永生也是在他兒子裡面。 人有了神的兒子就有生命。 沒有神的兒子就沒有生命。 我將這些話寫給你們信奉神兒子之名的人，要叫你們知道自己有永生。',
    english:
      'And this is the testimony: God gave us eternal life, and this life is in his Son. Whoever has the Son has life; whoever does not have the Son of God, does not have life. write these things to you who believe in the name of the Son of God, so that you may know that you have eternal life.',
  },
  john513: {
    book: '約翰一書',
    reference: '1John 5:13',
    chinese: '我將這些話寫給你們信奉神兒子之名的人，要叫你們知道自己有永生。',
    english:
      'I write these things to you who believe in the name of the Son of God, so that you may know that you have eternal life.',
  },
};

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

  return (
    <div className="rounded-[1.45rem] border border-outline-variant/60 bg-surface-container-lowest">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left text-primary"
      >
        <span>
          <span className="block font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
            {scripture.book}
          </span>
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
          <p className="mt-4 text-sm leading-7 text-on-surface-variant">
            {scripture.english}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ReflectionCard({ number, storageKey, scriptureKey, children }) {
  return (
    <article className="rounded-[1.8rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
      <div className="flex items-center gap-3 text-secondary">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed font-body text-sm font-extrabold text-on-secondary-fixed">
          {number}
        </span>
        <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
          回應問題
        </p>
      </div>
      <p className="mt-5 text-[1.05rem] leading-8 text-on-surface">{children}</p>
      {scriptureKey ? (
        <div className="mt-5">
          <ScriptureToggle scripture={assuranceScriptures[scriptureKey]} />
        </div>
      ) : null}
      <SavedAnswer storageKey={storageKey} />
    </article>
  );
}

function VerseStudyCard({ title, scriptureKeys, storageKey }) {
  return (
    <article className="rounded-[1.55rem] bg-surface-container-low p-5">
      <h4 className="font-headline text-[1.25rem] leading-tight text-primary">
        {title}
      </h4>
      <div className="mt-5 grid gap-3">
        {scriptureKeys.map((key) => (
          <ScriptureToggle key={key} scripture={assuranceScriptures[key]} />
        ))}
      </div>
      <SavedAnswer storageKey={storageKey} />
    </article>
  );
}

function GospelSection({ section, index }) {
  return (
    <article className="overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[0_18px_46px_rgba(40,53,28,0.08)]">
      <div className="bg-surface-container-low p-6">
        <div className="flex items-center gap-3 text-primary">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-white">
            <Icon name={section.icon} className="text-[22px]" />
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
        {section.scriptures.map((scripture) => (
          <ScriptureCard
            key={scripture.reference}
            reference={scripture.reference}
            verse={scripture.verse}
            tone={index === 1 ? 'glass' : 'light'}
          />
        ))}

        <div className="grid gap-3">
          {section.truths.map((truth) => (
            <div
              key={truth}
              className="rounded-[1.25rem] bg-surface-container-low p-4"
            >
              <p className="whitespace-pre-line text-sm leading-7 text-on-surface-variant">
                {truth}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-[1.35rem] border-l-4 border-l-secondary bg-secondary-fixed/34 p-4">
          <p className="font-headline text-[1.08rem] leading-8 text-primary">
            {section.note}
          </p>
        </div>
      </div>
    </article>
  );
}

export function SalvationAssuranceScreen() {
  const [showGospelReview, setShowGospelReview] = useState(false);

  return (
    <>
      <PageHeader title="得救的確據" backTo="/journey" />

      <main className="px-6 pb-36 pt-8">
        <section className="relative overflow-hidden rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)]" />
          <div className="relative">
            <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
              新生命栽培 : (1)
            </div>
            <h2 className="font-headline text-[2.4rem] leading-tight">
              得救的確據
            </h2>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container">
              神為我們預備了耶穌基督的救恩。聖經清楚解釋了這救恩，稱之為「福音」。基督徒就是聽了福音、認罪悔改、憑信心接受耶穌基督為救主的人。請溫習
              附件A 的「福音」內容摘要。
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-5">
          <ReflectionCard number="1" storageKey="assurance-q1">
            你何時決定憑信心接受耶穌基督為救主？為什麼你會作此決定？
          </ReflectionCard>

          <article className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <div className="flex items-center gap-3 text-secondary">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed font-body text-sm font-extrabold text-on-secondary-fixed">
                2
              </span>
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                經文研習
              </p>
            </div>
            <h3 className="mt-5 font-headline text-[1.45rem] leading-tight text-primary">
              哥林多後書 5:17 說：
            </h3>
            <div className="mt-5">
              <ScriptureToggle scripture={assuranceScriptures.cor517} />
            </div>
            <p className="mt-5 leading-8 text-on-surface-variant">
              當你接受耶穌基督救恩的那一刻,你的新生命就已經開始了。請記下以下經文如何描述你新生命的狀況。
            </p>
            <div className="mt-6 grid gap-4">
              <VerseStudyCard
                title="約翰福音 5: 24: 關於你的罪和罪所帶來的結果"
                scriptureKeys={['john524']}
                storageKey="assurance-q2-sin"
              />
              <VerseStudyCard
                title="約翰一書 5:11-12 及 約翰福音 1:12 關於你與神的關係"
                scriptureKeys={['john51113', 'john112']}
                storageKey="assurance-q2-relationship"
              />
            </div>
          </article>

          <ReflectionCard
            number="3"
            storageKey="assurance-q3"
            scriptureKey="john513"
          >
            用自己的文字改寫 約翰一書 5:13
          </ReflectionCard>

          <ReflectionCard number="4" storageKey="assurance-q4">
            在 約翰一書 5:13
            中，神不僅應許你已經擁有永生，祂更要你對此有確切的把握。你認為確信自己有永生為什麼如此重要呢？
          </ReflectionCard>
        </section>

        <section className="mt-12 rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
          <div className="flex items-center gap-3 text-secondary">
            <Icon name="article" className="text-[22px]" />
            <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
              附件A
            </p>
          </div>
          <h2 className="mt-4 font-headline text-[1.8rem] text-primary">
            附件A : 與神和好的褔音
          </h2>
          <p className="mt-4 leading-7 text-on-surface-variant">
            請溫習 附件A 的「福音」內容摘要。
          </p>
          <button
            type="button"
            onClick={() => setShowGospelReview(true)}
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
          >
            查看附件
            <Icon name="open_in_full" className="text-[18px]" />
          </button>
        </section>

        <section className="mt-8 rounded-[2rem] bg-surface-container-high p-6">
          <p className="font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
            決志禱告：接受耶穌基督的拯救
          </p>
          <p className="mt-4 font-headline text-[1.08rem] leading-8 text-primary">
            「神啊，我承認自己是一個有罪的人，違背了你。我知道你愛我，又相信你已藉著耶穌基督為我準備了救贖。我誠心接受耶穌基督為我的救主，求你照你所應許的，赦免我的罪，讓我重新成為你的兒女。又求你今後引導我的生命，讓你賜給我的新生命繼續成長。奉耶穌基督的名禱告，阿們。」
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
          <div className="flex items-center gap-3 text-secondary">
            <Icon name="extension" className="text-[22px]" />
            <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
              延伸學習
            </p>
          </div>
          <h3 className="mt-4 font-headline text-[1.55rem] leading-tight text-primary">
            《得救的確據》延伸學習 (A) : 你到底得救了嗎？
          </h3>
          <Link
            to="/journey/salvation-assurance/are-you-saved"
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
          >
            開始延伸學習
            <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </section>

        <section className="mt-8 rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
          <div className="flex items-center gap-3 text-secondary">
            <Icon name="extension" className="text-[22px]" />
            <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
              延伸學習
            </p>
          </div>
          <h3 className="mt-4 font-headline text-[1.55rem] leading-tight text-primary">
            《得救的確據》延伸學習 (B) : 確信 vs 迷信
          </h3>
          <Link
            to="/journey/salvation-assurance/faith-vs-superstition"
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
          >
            開始延伸學習
            <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </section>

        <section className="mt-8">
          <JourneyPager next={{ to: '/journey/quiet-time', label: '靈修' }} />
        </section>
      </main>

      {showGospelReview ? (
        <div className="fixed inset-0 z-50 bg-black/45 px-4 py-6 backdrop-blur-sm">
          <div className="mx-auto flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-surface shadow-[0_28px_80px_rgba(20,25,18,0.32)]">
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
            <div className="overflow-y-auto p-5">
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
