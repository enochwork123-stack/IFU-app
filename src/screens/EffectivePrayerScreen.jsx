import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { NotionMarkdownArticle } from '../components/content/NotionMarkdownArticle';
import { PageHeader } from '../components/PageHeader';
import effectivePrayerExtensionAMarkdown from '../content/notion/effective-prayer-extension-a.md?raw';
import effectivePrayerExtensionBMarkdown from '../content/notion/effective-prayer-extension-b.md?raw';

const effectivePrayerScriptures = {
  phil467: {
    book: '腓立比書',
    reference: 'Phil 4:6-7',
    chinese:
      '應當一無掛慮，只要凡事藉著禱告、祈求，和感謝，將你們所要的告訴神。神所賜、出人意外的平安必在基督耶穌裏保守你們的心懷意念。',
  },
  matt7911: {
    book: '馬太福音',
    reference: 'Matt 7:9-11',
    chinese:
      '你們中間誰有兒子求餅，反給他石頭呢？求魚，反給他蛇呢？你們雖然不好，尚且知道拿好東西給兒女，何況你們在天上的父，豈不更把好東西給求他的人嗎？',
  },
  isa5912: {
    book: '以賽亞書',
    reference: 'Isa 59:1-2',
    chinese:
      '耶和華的膀臂並非縮短，不能拯救；耳朵並非發沉，不能聽見。但你們的罪孽使你們與神隔絕；你們的罪惡使他掩面不聽你們。',
  },
  james167: {
    book: '雅各書',
    reference: 'Jam 1:6-7',
    chinese:
      '只要憑著信心求，一點不疑惑；因為那疑惑的人，就像海中的波浪，被風吹動翻騰。這樣的人不要想從主那裏得甚麼。',
  },
  james423: {
    book: '雅各書',
    reference: 'Jam 4:2-3',
    chinese:
      '你們得不著，是因為你們不求。你們求也得不著，是因為你們妄求，要浪費在你們的宴樂中。',
  },
  john157: {
    book: '約翰福音',
    reference: 'John 15:7',
    chinese:
      '你們若常在我裏面，我的話也常在你們裏面，凡你們所願意的，祈求，就給你們成就。',
  },
  john514: {
    book: '約翰一書',
    reference: '1John 5:14',
    chinese:
      '我們若照他的旨意求甚麼，他就聽我們，這是我們向他所存坦然無懼的心。',
  },
};

const prayerBarriers = [
  {
    label: '罪使人與神隔絕',
    scripture: effectivePrayerScriptures.isa5912,
  },
  {
    label: '缺乏信心、心裏疑惑',
    scripture: effectivePrayerScriptures.james167,
  },
  {
    label: '自私或錯誤的動機',
    scripture: effectivePrayerScriptures.james423,
  },
];

const reflectionPromptsA = [
  '為什麼「總而言之，有效的禱告更在乎禱告的人，而非禱告的方式」？',
  '文章指出「有人說禱告其實不是改變神，而是調整自己，更多貼近神的心意。」你認同這個觀點嗎？',
  '從這篇「神悅納的禱告」的延伸學習中，你得到了什麼啟發？',
];

const reflectionPromptsB = [
  '試想若你與神成為好朋友，你的生命狀況以及你與神的關係，跟現在會有什麼分別？',
  '建立友誼需要雙方付出努力。你有努力經營與神的關係嗎？你打算如何加倍努力？',
  '從這篇「成為神的摯友」的延伸學習中，你得到了什麼啟發？',
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

function BarrierCard({ item }) {
  return (
    <article className="rounded-[1.7rem] bg-surface-container-low p-4">
      <div className="mb-4 flex items-center gap-3 text-secondary">
        <Icon name="report" className="text-[20px]" />
        <h4 className="font-headline text-[1.2rem] leading-tight text-primary">
          {item.label}
        </h4>
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

export function EffectivePrayerScreen() {
  return (
    <>
      <PageHeader title="有效的祈禱" backTo="/journey" />
      <main className="px-6 pb-36 pt-8">
        <section className="relative overflow-hidden rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)]" />
          <div className="relative">
            <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
              新生命栽培 : (8)
            </div>
            <h2 className="font-headline text-[2.4rem] leading-tight">
              有效的祈禱
            </h2>
            <p className="mt-2 font-medium text-secondary-fixed font-body">Effective Prayer</p>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container">
              學習有根有基的禱告生活。藉著遵行神的旨意、奉主的名祈求，以及持之以恆的禱告，我們能與神建立更深切的契合。
            </p>
          </div>
        </section>


        <section className="mt-8 grid gap-5">
          <section className="rounded-[2rem] bg-primary p-6 text-white shadow-[0_26px_68px_rgba(40,53,28,0.22)]">
            <div className="flex items-center gap-3 text-secondary-fixed">
              <Icon name="forum" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                本課金句
              </p>
            </div>
            <p className="mt-5 font-headline text-[1.15rem] leading-9">
              {effectivePrayerScriptures.phil467.chinese}
            </p>
            <p className="mt-5 font-body text-[11px] font-extrabold tracking-[0.22em] text-secondary-fixed">
              腓立比書 Phil 4:6-7
            </p>
          </section>

          <QuestionCard
            number="1"
            title="溫習腓立比書 4:6-7。你有恆常禱告嗎？有否經驗神賜你內心的平安，或是答允你所祈求的？"
          >
            <ScriptureToggle scripture={effectivePrayerScriptures.phil467} />
            <SavedAnswer storageKey="effective-prayer-q1" />
          </QuestionCard>

          <QuestionCard
            number="2"
            title="讀馬太福音 7:9-11。神賜給祂的兒女是哪一類的禮物？若你求的是對你不好的東西，愛你的神會否照你所求而行？"
          >
            <ScriptureToggle scripture={effectivePrayerScriptures.matt7911} />
            <SavedAnswer storageKey="effective-prayer-q2" />
          </QuestionCard>

          <QuestionCard
            number="3"
            title="有時神不答允我們所祈求的事，可能有哪些原因？"
          >
            <div className="grid gap-4">
              {prayerBarriers.map((item) => (
                <BarrierCard key={item.label} item={item} />
              ))}
            </div>
            <SavedAnswer
              storageKey="effective-prayer-q3"
              placeholder="按經文歸納：罪、信心、動機等因素如何影響禱告..."
            />
          </QuestionCard>

          <QuestionCard
            number="4"
            title="從約翰福音 15:7 和約翰一書 5:14 歸納出哪些因素會使你的祈求有效。"
          >
            <div className="grid gap-3">
              <ScriptureToggle scripture={effectivePrayerScriptures.john157} />
              <ScriptureToggle scripture={effectivePrayerScriptures.john514} />
            </div>
            <SavedAnswer storageKey="effective-prayer-q4" />
          </QuestionCard>

          <QuestionCard
            number="5"
            title="你的祈禱是否常常都符合聖經的原則？哪些地方要改進？"
          >
            <SavedAnswer storageKey="effective-prayer-q5" />
          </QuestionCard>

          <ExtensionCard
            title="《有效的祈禱》延伸學習 (A) : 神悅納的禱告"
            to="/journey/effective-prayer/acceptable-prayer"
          />
          <ExtensionCard
            title="《有效的祈禱》延伸學習 (B) : 成為神的摯友"
            to="/journey/effective-prayer/friendship-with-god"
          />
        </section>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/bible-intake', label: '持守神的話' }}
            next={{ to: '/journey/fellowship', label: '團契互助' }}
          />
        </section>
      </main>
    </>
  );
}

export function EffectivePrayerAcceptablePrayerScreen() {
  return (
    <>
      <PageHeader title="神悅納的禱告" backTo="/journey/effective-prayer" />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《有效的祈禱》延伸學習 (A)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            神悅納的禱告
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            改編自 GotQuestions.org。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={reflectionPromptsA}
            storagePrefix="effective-prayer-extension-a-reflection"
          />
          <NotionMarkdownArticle markdown={effectivePrayerExtensionAMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/effective-prayer', label: '有效的祈禱' }}
          />
        </section>
      </main>
    </>
  );
}

export function EffectivePrayerFriendshipWithGodScreen() {
  return (
    <>
      <PageHeader title="成為神的摯友" backTo="/journey/effective-prayer" />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《有效的祈禱》延伸學習 (B)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            成為神的摯友
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            改編自 Purpose Driven Life。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={reflectionPromptsB}
            storagePrefix="effective-prayer-extension-b-reflection"
          />
          <NotionMarkdownArticle markdown={effectivePrayerExtensionBMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/effective-prayer', label: '有效的祈禱' }}
          />
        </section>
      </main>
    </>
  );
}
