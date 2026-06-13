import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { NotionMarkdownArticle } from '../components/content/NotionMarkdownArticle';
import { PageHeader } from '../components/PageHeader';
import { assetPath } from '../utils/assets';
import bibleAuthorityExtensionAMarkdown from '../content/notion/bible-authority-extension-a.md?raw';
import bibleAuthorityExtensionBMarkdown from '../content/notion/bible-authority-extension-b.md?raw';

const bibleAuthorityScriptures = {
  tim31617: {
    book: '提摩太後書',
    reference: '2Tim 3:16-17',
    chinese:
      '聖經都是神所默示的，於教訓、督責、使人歸正、教導人學義，都是有益的，叫屬神的人得以完全，預備行各樣的善事。',
    english:
      'All scripture is inspired by God and is useful for teaching, for reproof, for correction, and for training in righteousness.',
  },
  luke2444: {
    book: '路加福音',
    reference: 'Luke 24:44',
    chinese:
      '這就是我從前與你們同在之時所告訴你們的話說：摩西的律法、先知的書，和詩篇上所記的，凡指著我的話都必須應驗。',
  },
  matt51719: {
    book: '馬太福音',
    reference: 'Matt 5:17-19',
    chinese:
      '莫想我來要廢掉律法和先知。我來不是要廢掉，乃是要成全。我實在告訴你們，就是到天地都廢去了，律法的一點一畫也不能廢去，都要成全。',
  },
  josh18: {
    book: '約書亞記',
    reference: 'Josh 1:8',
    chinese:
      '這律法書不可離開你的口，總要晝夜思想，好使你謹守遵行這書上所寫的一切話。如此，你的道路就可以亨通，凡事順利。',
  },
  james125: {
    book: '雅各書',
    reference: 'Jam 1:25',
    chinese:
      '惟有詳細察看那全備、使人自由之律法的，並且時常如此，這人既不是聽了就忘，乃是實在行出來，就在他所行的事上必然得福。',
  },
};

const reflectionPromptsA = [
  '歸納哪些因素可證明聖經是超自然的，並非人所能杜撰的。',
  '耶穌基督完全接受舊約聖經是上帝所啟示的真理，這有什麼重要性？',
  '既然確信聖經是上帝所啟示的真理，我們該怎樣對待聖經？',
  '從這篇關於「聖經的權威」的延伸學習中，你得到了什麼啟發？',
];

const reflectionPromptsB = [
  '死海卷軸和聖經的多個版本怎樣支持聖經文本可靠性的說法？',
  '基督對舊約聖經的立場，怎樣有助證實舊約的真確性？這對新約聖經而言，也有助證嗎？',
  '從這篇關於「聖經的權威」的延伸學習中，你得到了什麼啟發？',
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

function ReflectionPromptList({ prompts, storagePrefix }) {
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
        {prompts.map((prompt, index) => (
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

export function BibleAuthorityScreen() {
  return (
    <>
      <PageHeader title="聖經的權威" backTo="/journey" />
      <main className="px-6 pb-36 pt-8">
        <section className="relative overflow-hidden rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)]" />
          <div className="relative">
            <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
              新生命栽培 : (6)
            </div>
            <h2 className="font-headline text-[2.4rem] leading-tight">
              聖經的權威
            </h2>
            <p className="mt-2 font-medium text-secondary-fixed font-body">Authority of the Bible</p>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container">
              聖經是神所默示的話語，是我們生活的最高準則與指引。確信聖經的權威，能裝備我們行各樣的善事，並在人生道路中蒙神賜福。
            </p>
          </div>
        </section>


        <section className="mt-8 grid gap-5">
          <section className="rounded-[2rem] bg-primary p-6 text-white shadow-[0_26px_68px_rgba(40,53,28,0.22)]">
            <div className="flex items-center gap-3 text-secondary-fixed">
              <Icon name="auto_stories" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                本課金句
              </p>
            </div>
            <p className="mt-5 font-headline text-[1.15rem] leading-9">
              {bibleAuthorityScriptures.tim31617.chinese}
            </p>
            <p className="mt-4 text-sm leading-7 text-on-primary-container">
              {bibleAuthorityScriptures.tim31617.english}
            </p>
            <p className="mt-5 font-body text-[11px] font-extrabold tracking-[0.22em] text-secondary-fixed">
              提摩太後書 2Tim 3:16-17
            </p>
          </section>

          <QuestionCard
            number="1"
            title="聖經是甚麼？它能給你甚麼幫助？提摩太後書 3:16-17"
          >
            <ScriptureToggle scripture={bibleAuthorityScriptures.tim31617} />
            <SavedAnswer storageKey="bible-authority-q1" />
          </QuestionCard>

          <figure className="overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <img
              src={assetPath('assets/study-6-bible-inspiration.jpg')}
              alt="聖經的啟示與信徒責任示意圖：神啟示作者記載聖經，信徒研讀並應用。"
              className="ifu-diagram-image w-full bg-white object-contain"
            />
            <figcaption className="px-5 py-4 text-sm leading-7 text-on-surface-variant">
              神藉作者記載聖經，也藉聖經裝備信徒研讀、應用，經歷祂的應許。
            </figcaption>
          </figure>

          <QuestionCard
            number="2"
            title="聖經還有哪些奇妙之處可以印證它是神的話？路加福音 24:44；馬太福音 5:17-19"
          >
            <div className="grid gap-3">
              <ScriptureToggle scripture={bibleAuthorityScriptures.luke2444} />
              <ScriptureToggle scripture={bibleAuthorityScriptures.matt51719} />
            </div>
            <SavedAnswer storageKey="bible-authority-q2" />
          </QuestionCard>

          <QuestionCard
            number="3"
            title="有了聖經，你還要做甚麼才能蒙神所賜的福？約書亞記 1:8；雅各書 1:25"
          >
            <div className="grid gap-3">
              <ScriptureToggle scripture={bibleAuthorityScriptures.josh18} />
              <ScriptureToggle scripture={bibleAuthorityScriptures.james125} />
            </div>
            <SavedAnswer storageKey="bible-authority-q3" />
          </QuestionCard>

          <section className="rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <div className="flex items-center gap-3 text-secondary">
              <Icon name="attach_file" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                參考資料
              </p>
            </div>
            <h3 className="mt-4 font-headline text-[1.55rem] leading-tight text-primary">
              聖經權威延伸資源
            </h3>
            <div className="mt-5 grid gap-3">
              <a
                href={assetPath('assets/bible-inspired-reference.pdf')}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-secondary px-5 py-3 text-sm font-extrabold tracking-[0.08em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
              >
                <Icon name="picture_as_pdf" className="text-[18px]" />
                聖經是神默示的.pdf
              </a>
              <a
                href="https://notebooklm.google.com/notebook/6af73b27-1464-4ba9-9044-566b48e4142d"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-surface-container-lowest px-5 py-3 text-sm font-extrabold tracking-[0.08em] text-primary transition-all hover:bg-surface active:scale-95"
              >
                <Icon name="open_in_new" className="text-[18px]" />
                DT-Chat: Reasons to Believe
              </a>
            </div>
          </section>

          <ExtensionCard
            title="《聖經的權威》延伸學習 (A) : 聖經是否神的話"
            to="/journey/bible-authority/is-the-bible-gods-word"
          />
          <ExtensionCard
            title="《聖經的權威》延伸學習 (B) : 聖經文獻可靠嗎"
            to="/journey/bible-authority/is-the-bible-text-reliable"
          />
        </section>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/victory-assurance', label: '得勝的確據' }}
            next={{ to: '/journey/bible-intake', label: '持守神的話' }}
          />
        </section>
      </main>
    </>
  );
}

export function BibleAuthorityGodsWordScreen() {
  return (
    <>
      <PageHeader
        title="聖經是否神的話"
        backTo="/journey/bible-authority"
      />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《聖經的權威》延伸學習 (A)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            聖經是否神的話
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            改編自 Know Why You Believe 及 DT-Chat “Reasons to Believe”。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={reflectionPromptsA}
            storagePrefix="bible-authority-extension-a-reflection"
          />
          <NotionMarkdownArticle markdown={bibleAuthorityExtensionAMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/bible-authority', label: '聖經的權威' }}
          />
        </section>
      </main>
    </>
  );
}

export function BibleAuthorityTextReliableScreen() {
  return (
    <>
      <PageHeader
        title="聖經文獻可靠嗎"
        backTo="/journey/bible-authority"
      />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《聖經的權威》延伸學習 (B)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            聖經文獻可靠嗎
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            改編自 Know Why You Believe 及 DT-Chat “Reasons to Believe”。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={reflectionPromptsB}
            storagePrefix="bible-authority-extension-b-reflection"
          />
          <NotionMarkdownArticle markdown={bibleAuthorityExtensionBMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/bible-authority', label: '聖經的權威' }}
          />
        </section>
      </main>
    </>
  );
}
