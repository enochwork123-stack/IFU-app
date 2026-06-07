import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { NotionMarkdownArticle } from '../components/content/NotionMarkdownArticle';
import { PageHeader } from '../components/PageHeader';
import fellowshipExtensionAMarkdown from '../content/notion/fellowship-extension-a.md?raw';
import fellowshipExtensionBMarkdown from '../content/notion/fellowship-extension-b.md?raw';

const fellowshipScriptures = {
  eph219: {
    book: '以弗所書',
    reference: 'Eph 2:19',
    chinese:
      '這樣，你們不再作外人和客旅，是與聖徒同國，是神家裏的人了。',
  },
  heb102425: {
    book: '希伯來書',
    reference: 'Heb 10:24-25',
    chinese:
      '又要彼此相顧，激發愛心，勉勵行善。你們不可停止聚會，好像那些停止慣了的人，倒要彼此勸勉；既知道那日子臨近，就更當如此。',
  },
  phil234: {
    book: '腓立比書',
    reference: 'Phil 2:3-4',
    chinese:
      '凡事不可結黨，不可貪圖虛浮的榮耀；只要存心謙卑，各人看別人比自己強。各人不要單顧自己的事，也要顧別人的事。',
  },
  john133435: {
    book: '約翰福音',
    reference: 'John 13:34-35',
    chinese:
      '我賜給你們一條新命令，乃是叫你們彼此相愛；我怎樣愛你們，你們也要怎樣相愛。你們若有彼此相愛的心，眾人因此就認出你們是我的門徒了。',
  },
  eph41116: {
    book: '以弗所書',
    reference: 'Eph 4:11-16',
    chinese:
      '他所賜的，有使徒，有先知，有傳福音的，有牧師和教師，為要成全聖徒，各盡其職，建立基督的身體，直等到我們眾人在真道上同歸於一。',
  },
  heb31213: {
    book: '希伯來書',
    reference: 'Heb 3:12-13',
    chinese:
      '弟兄們，你們要謹慎，免得你們中間或有人存著不信的惡心，把永生神離棄了。總要趁著還有今日，天天彼此相勸，免得你們中間有人被罪迷惑，心裏就剛硬了。',
  },
};

const fellowshipHelp = [
  {
    label: '謙卑顧念別人',
    scripture: fellowshipScriptures.phil234,
  },
  {
    label: '彼此相愛作見證',
    scripture: fellowshipScriptures.john133435,
  },
  {
    label: '相顧、激發愛心、勉勵行善',
    scripture: fellowshipScriptures.heb102425,
  },
  {
    label: '各盡其職，建立基督身體',
    scripture: fellowshipScriptures.eph41116,
  },
  {
    label: '天天彼此相勸',
    scripture: fellowshipScriptures.heb31213,
  },
];

const reflectionPromptsA = [
  '「二人勝過一人」乃聖經真理。此真理如何應用於你？你能從基督徒同伴中獲益何處？又能為他們貢獻什麼？',
  '將「教會等同教堂」這誤解，可能引發哪些問題？',
  '你是否與一群基督徒同儕實踐著聖經所教導的團契？你將如何深化這份團契？',
  '從這篇「不該孤單」的延伸學習中，你得到了什麼啟發？',
];

const reflectionPromptsB = [
  '教會與團契有什麼關係？文章為什麼把它們形容為「家庭」？',
  '對你而言，你實際上是與哪些人一起團契互助？你所屬的地方教會是什麼？',
  '你在地方教會有好好發揮你的角色嗎？你打算如何改進？',
  '從這篇「教會家庭」的延伸學習中，你得到了什麼啟發？',
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

function FellowshipActionCard({ item }) {
  return (
    <article className="rounded-[1.7rem] bg-surface-container-low p-4">
      <div className="mb-4 flex items-center gap-3 text-secondary">
        <Icon name="groups" className="text-[20px]" />
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

export function FellowshipScreen() {
  return (
    <>
      <PageHeader title="團契互助" backTo="/journey" />
      <main className="px-6 pb-36 pt-8 overflow-x-hidden">
        <section className="relative overflow-hidden rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)]" />
          <div className="relative">
            <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
              新生命栽培 : (9)
            </div>
            <h2 className="font-headline text-[2.4rem] leading-tight">
              團契互助
            </h2>
            <p className="mt-2 font-medium text-secondary-fixed font-body">Fellowship</p>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container">
              基督徒的生活不是單打獨鬥。神召我們進入教會家庭，在信徒社群中彼此相愛、互相扶持，共同在基督裡成長。
            </p>
          </div>
        </section>


        <section className="mt-8 grid gap-5">
          <section className="rounded-[2rem] bg-primary p-6 text-white shadow-[0_26px_68px_rgba(40,53,28,0.22)]">
            <div className="flex items-center gap-3 text-secondary-fixed">
              <Icon name="diversity_3" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                本課主題
              </p>
            </div>
            <p className="mt-5 font-headline text-[1.15rem] leading-9">
              {fellowshipScriptures.heb102425.chinese}
            </p>
            <p className="mt-5 font-body text-[11px] font-extrabold tracking-[0.22em] text-secondary-fixed">
              希伯來書 Heb 10:24-25
            </p>
          </section>

          <QuestionCard
            number="1"
            title="神想祂的兒女獨自過基督徒的生活，還是與其他弟兄姊妹一起呢？"
          >
            <div className="grid gap-3">
              <ScriptureToggle scripture={fellowshipScriptures.eph219} />
              <ScriptureToggle scripture={fellowshipScriptures.heb102425} />
            </div>
            <SavedAnswer storageKey="fellowship-q1" />
          </QuestionCard>

          <QuestionCard
            number="2"
            title="與弟兄姊妹的團契互助對基督徒生活尤其重要。神要我們如何彼此幫助？"
          >
            <div className="grid gap-4">
              {fellowshipHelp.map((item) => (
                <FellowshipActionCard key={item.label} item={item} />
              ))}
            </div>
            <SavedAnswer
              storageKey="fellowship-q2"
              placeholder="按經文歸納：謙卑、相愛、勸勉、建立、彼此相顧..."
            />
          </QuestionCard>

          <QuestionCard
            number="3"
            title="你有照著上面經文的教導，時常與其他信徒團契互助嗎？時常與你團契互助的信徒是誰？"
          >
            <SavedAnswer storageKey="fellowship-q3" />
          </QuestionCard>

          <QuestionCard
            number="4"
            title="你會如何改進與弟兄姊妹的團契互助？"
          >
            <SavedAnswer storageKey="fellowship-q4" />
          </QuestionCard>

          <ExtensionCard
            title="《團契互助》延伸學習 (A) : 不要獨行"
            to="/journey/fellowship/do-not-walk-alone"
          />
          <ExtensionCard
            title="《團契互助》延伸學習 (B) : 教會家庭"
            to="/journey/fellowship/church-family"
          />
        </section>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/effective-prayer', label: '有效的祈禱' }}
            next={{ to: '/journey', label: '返回目錄' }}
          />
        </section>
      </main>
    </>
  );
}

export function FellowshipDoNotWalkAloneScreen() {
  return (
    <>
      <PageHeader title="不要獨行" backTo="/journey/fellowship" />
      <main className="px-6 pb-36 pt-8 overflow-x-hidden">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《團契互助》延伸學習 (A)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            不要獨行
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            改編自 Crosswalk 及 GotQuestions.org。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={reflectionPromptsA}
            storagePrefix="fellowship-extension-a-reflection"
          />
          <NotionMarkdownArticle markdown={fellowshipExtensionAMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/fellowship', label: '團契互助' }}
          />
        </section>
      </main>
    </>
  );
}

export function FellowshipChurchFamilyScreen() {
  return (
    <>
      <PageHeader title="教會家庭" backTo="/journey/fellowship" />
      <main className="px-6 pb-36 pt-8 overflow-x-hidden">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《團契互助》延伸學習 (B)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            教會家庭
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            改編自 Crosswalk 及 GotQuestions.org。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={reflectionPromptsB}
            storagePrefix="fellowship-extension-b-reflection"
          />
          <NotionMarkdownArticle markdown={fellowshipExtensionBMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/fellowship', label: '團契互助' }}
          />
        </section>
      </main>
    </>
  );
}
