import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { NotionMarkdownArticle } from '../components/content/NotionMarkdownArticle';
import { PageHeader } from '../components/PageHeader';
import bibleIntakeExtensionAMarkdown from '../content/notion/bible-intake-extension-a.md?raw';
import bibleIntakeExtensionBMarkdown from '../content/notion/bible-intake-extension-b.md?raw';

const bibleIntakeScriptures = {
  tim31617: {
    book: '提摩太後書',
    reference: '2Tim 3:16-17',
    chinese:
      '聖經都是神所默示的，於教訓、督責、使人歸正、教導人學義，都是有益的，叫屬神的人得以完全，預備行各樣的善事。',
    english:
      'All scripture is inspired by God and is useful for teaching, for reproof, for correction, and for training in righteousness.',
  },
  col316: {
    book: '歌羅西書',
    reference: 'Col 3:16',
    chinese:
      '當用各樣的智慧，把基督的道理豐豐富富地存在心裏，用詩章、頌詞、靈歌，彼此教導，互相勸戒，心被恩感，歌頌神。',
  },
  psalm123: {
    book: '詩篇',
    reference: 'Ps 1:2-3',
    chinese:
      '惟喜愛耶和華的律法，晝夜思想，這人便為有福！他要像一棵樹栽在溪水旁，按時候結果子，葉子也不枯乾。凡他所做的盡都順利。',
  },
  psalm119911: {
    book: '詩篇',
    reference: 'Ps 119:9,11',
    chinese:
      '少年人用甚麼潔淨他的行為呢？是要遵行你的話。我將你的話藏在心裏，免得我得罪你。',
  },
  acts1711: {
    book: '使徒行傳',
    reference: 'Acts 17:11',
    chinese:
      '這地方的人賢於帖撒羅尼迦的人，甘心領受這道，天天考查聖經，要曉得這道是與不是。',
  },
  rev13: {
    book: '啟示錄',
    reference: 'Rev 1:3',
    chinese:
      '念這書上預言的和那些聽見又遵守其中所記載的，都是有福的，因為日期近了。',
  },
  rom1017: {
    book: '羅馬書',
    reference: 'Rom 10:17',
    chinese: '可見信道是從聽道來的，聽道是從基督的話來的。',
  },
  james125: {
    book: '雅各書',
    reference: 'Jam 1:25',
    chinese:
      '惟有詳細察看那全備、使人自由之律法的，並且時常如此，這人既不是聽了就忘，乃是實在行出來，就在他所行的事上必然得福。',
  },
};

const bibleHandMethods = [
  {
    finger: '大拇指',
    method: '默想',
    english: 'Meditate',
    scripture: bibleIntakeScriptures.psalm123,
  },
  {
    finger: '食指',
    method: '背誦',
    english: 'Memorize',
    scripture: bibleIntakeScriptures.psalm119911,
  },
  {
    finger: '中指',
    method: '查考',
    english: 'Study',
    scripture: bibleIntakeScriptures.acts1711,
  },
  {
    finger: '無名指',
    method: '閱讀',
    english: 'Read',
    scripture: bibleIntakeScriptures.rev13,
  },
  {
    finger: '尾指',
    method: '聽',
    english: 'Hear',
    scripture: bibleIntakeScriptures.rom1017,
  },
  {
    finger: '掌心',
    method: '遵行',
    english: 'Obey',
    scripture: bibleIntakeScriptures.james125,
  },
];

const reflectionPrompts = [
  '聽別人講解聖經，與自己閱讀或查考聖經，有什麼分別？',
  '閱讀聖經與查考聖經有何不同？在幫助我們掌握神的話方面，兩者各有什麼作用？',
  '短片介紹的五種掌握聖經的方法中，你認為哪一種是基督徒最常使用的？哪一種最容易被忽略？',
  '從這短片中，你得到什麼啟發？',
];

function SavedAnswer({ storageKey, placeholder = '在這裡輸入你的答案...' }) {
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
        placeholder={placeholder}
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
          {scripture.english ? (
            <p className="mt-4 text-sm leading-7 text-on-surface-variant">
              {scripture.english}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function QuestionCard({ number, title, children }) {
  return (
    <article className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
      <div className="flex items-center gap-3 text-secondary">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed font-body text-sm font-extrabold text-on-secondary-fixed">
          {number}
        </span>
        <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
          問題 {number}
        </p>
      </div>
      <h3 className="mt-5 font-headline text-[1.45rem] leading-tight text-primary">
        {title}
      </h3>
      <div className="mt-5 space-y-4">{children}</div>
    </article>
  );
}

function MethodCard({ item }) {
  return (
    <article className="rounded-[1.7rem] bg-surface-container-low p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
            {item.finger}
          </p>
          <h4 className="mt-1 font-headline text-[1.35rem] leading-tight text-primary">
            {item.method}
          </h4>
        </div>
        <span className="rounded-full bg-secondary-fixed px-3 py-1 text-xs font-extrabold text-on-secondary-fixed">
          {item.english}
        </span>
      </div>
      <ScriptureToggle scripture={item.scripture} />
    </article>
  );
}

function ExtensionCard({ title, to }) {
  return (
    <section className="rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
      <div className="flex items-center gap-3 text-secondary">
        <Icon name="extension" className="text-[22px]" />
        <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
          延伸學習
        </p>
      </div>
      <h3 className="mt-4 font-headline text-[1.55rem] leading-tight text-primary">
        {title}
      </h3>
      <Link
        to={to}
        className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
      >
        開始延伸學習
        <Icon name="arrow_forward" className="text-[18px]" />
      </Link>
    </section>
  );
}

function ReflectionPromptList({ storagePrefix }) {
  return (
    <section className="rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
      <div className="flex items-center gap-3 text-secondary">
        <Icon name="psychology_alt" className="text-[22px]" />
        <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
          閱讀反思
        </p>
      </div>
      <h2 className="mt-4 font-headline text-[1.65rem] leading-tight text-primary">
        閱讀以下文章，並思考：
      </h2>
      <div className="mt-6 grid gap-5">
        {reflectionPrompts.map((prompt, index) => (
          <article
            key={prompt}
            className="rounded-[1.55rem] bg-surface-container-lowest p-5"
          >
            <p className="text-[1.02rem] leading-8 text-on-surface">
              {index + 1}. {prompt}
            </p>
            <SavedAnswer storageKey={`${storagePrefix}-${index + 1}`} />
          </article>
        ))}
      </div>
    </section>
  );
}

export function BibleIntakeScreen() {
  return (
    <>
      <PageHeader title="持守神的話" backTo="/journey" />
      <main className="px-6 pb-36 pt-8">
        <section className="relative overflow-hidden rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)]" />
          <div className="relative">
            <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
              新生命栽培 : (7)
            </div>
            <h2 className="font-headline text-[2.4rem] leading-tight">
              持守神的話
            </h2>
            <p className="mt-2 font-medium text-secondary-fixed font-body">Intake of the Bible</p>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container">
              建立恆常讀經、聆聽、查考、背記和默想神話語的習慣，將神的話藏在心裡，使我們的新生命有根有基，不斷成長。
            </p>
          </div>
        </section>


        <section className="mt-8 grid gap-5">
          <section className="rounded-[2rem] bg-primary p-6 text-white shadow-[0_26px_68px_rgba(40,53,28,0.22)]">
            <div className="flex items-center gap-3 text-secondary-fixed">
              <Icon name="auto_stories" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                本課主題
              </p>
            </div>
            <p className="mt-5 font-headline text-[1.15rem] leading-9">
              {bibleIntakeScriptures.col316.chinese}
            </p>
            <p className="mt-5 font-body text-[11px] font-extrabold tracking-[0.22em] text-secondary-fixed">
              歌羅西書 Col 3:16
            </p>
          </section>

          <QuestionCard
            number="1"
            title="請溫習提摩太後書 3:16-17，你認同聖經是你人生的指南嗎？為甚麼？"
          >
            <ScriptureToggle scripture={bibleIntakeScriptures.tim31617} />
            <SavedAnswer storageKey="bible-intake-q1" />
          </QuestionCard>

          <QuestionCard
            number="2"
            title="神要我們用各種方法，好好掌握祂的話語。你能想到哪些方法可以把基督的道理豐豐富富地存在心裏？"
          >
            <ScriptureToggle scripture={bibleIntakeScriptures.col316} />
            <div className="grid gap-4">
              {bibleHandMethods.map((item) => (
                <MethodCard key={item.finger} item={item} />
              ))}
            </div>
            <SavedAnswer
              storageKey="bible-intake-q2"
              placeholder="寫下你想更常使用的讀經、查考、背誦、默想或遵行方法..."
            />
          </QuestionCard>

          <figure className="overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <img
              src="/assets/bible-hand.png"
              alt="聖經手圖解：聽、讀、查考、背誦、默想與遵行神的話。"
              className="w-full bg-white object-contain p-4"
            />
            <figcaption className="px-5 py-4 text-sm leading-7 text-on-surface-variant">
              五種掌握聖經的方法好比五隻手指；若加上掌心的實踐，神的話更穩妥地握在生命中。
            </figcaption>
          </figure>

          <section className="rounded-[2rem] bg-secondary-fixed/35 p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <div className="flex items-center gap-3 text-secondary">
              <Icon name="tips_and_updates" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                學習提示
              </p>
            </div>
            <div className="mt-5 space-y-4 text-[1.02rem] leading-8 text-primary">
              <p>
                這五種方法好比五隻手指。你若只用一隻或兩隻手指去拿聖經，它會很容易掉下來；若用整隻手去拿，便會更穩妥。
              </p>
              <p>
                大拇指象徵默想，它要與另外四隻手指合在一起才可緊握東西。掌心則提醒我們，把神的話實在行出來。
              </p>
            </div>
          </section>

          <QuestionCard
            number="3"
            title="你想在哪方面增強對聖經的掌握？"
          >
            <SavedAnswer storageKey="bible-intake-q3" />
          </QuestionCard>

          <ExtensionCard
            title="《持守神的話》延伸學習 (A) : 聖經手"
            to="/journey/bible-intake/word-hand"
          />
          <ExtensionCard
            title="《持守神的話》延伸學習 (B) : 掌握神的話"
            to="/journey/bible-intake/grasping-gods-word"
          />
        </section>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/bible-authority', label: '聖經的權威' }}
            next={{ to: '/journey/effective-prayer', label: '有效的祈禱' }}
          />
        </section>
      </main>
    </>
  );
}

export function BibleIntakeWordHandScreen() {
  return (
    <>
      <PageHeader title="聖經手" backTo="/journey/bible-intake" />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《持守神的話》延伸學習 (A)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            聖經手
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            改編自 The Navigators “The Word Hand”。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList storagePrefix="bible-intake-extension-a-reflection" />
          <NotionMarkdownArticle markdown={bibleIntakeExtensionAMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/bible-intake', label: '持守神的話' }}
          />
        </section>
      </main>
    </>
  );
}

export function BibleIntakeGraspingGodsWordScreen() {
  return (
    <>
      <PageHeader title="掌握神的話" backTo="/journey/bible-intake" />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《持守神的話》延伸學習 (B)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            掌握神的話
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            改編自 The Navigators “The Word Hand”。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList storagePrefix="bible-intake-extension-b-reflection" />
          <NotionMarkdownArticle markdown={bibleIntakeExtensionBMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/bible-intake', label: '持守神的話' }}
          />
        </section>
      </main>
    </>
  );
}
