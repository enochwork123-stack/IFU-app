import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { NotionMarkdownArticle } from '../components/content/NotionMarkdownArticle';
import { PageHeader } from '../components/PageHeader';
import victoryExtensionAMarkdown from '../content/notion/victory-extension-a.md?raw';
import victoryExtensionBMarkdown from '../content/notion/victory-extension-b.md?raw';

const victoryScriptures = {
  psalm119911: {
    book: '詩篇',
    reference: 'Psalm 119:9, 11',
    chinese:
      '少年人用甚麼潔淨他的行為呢？是要遵行你的話。我將你的話藏在心裡，免得我得罪你。',
    english:
      'How can young people keep their way pure? By guarding it according to your word. I treasure your word in my heart, so that I may not sin against you.',
  },
  prov41415: {
    book: '箴言',
    reference: 'Prov 4:14-15',
    chinese: '不可行惡人的路，不要走壞人的道。要躲避、不可經過，要轉身而去。',
    english:
      'Do not enter the path of the wicked, and do not walk in the way of evildoers. Avoid it; do not go on it; turn away from it and pass on.',
  },
  isa5912: {
    book: '以賽亞書',
    reference: 'Isa 59:1-2',
    chinese:
      '耶和華的膀臂並非縮短不能拯救，耳朵並非發沉不能聽見。但你們的罪孽使你們與神隔絕，你們的罪惡使他掩面不聽你們。',
    english:
      "See, the Lord's hand is not too short to save, nor his ear too dull to hear. Rather, your iniquities have been barriers between you and your God.",
  },
  cor1013: {
    book: '哥林多前書',
    reference: '1Cor 10:13',
    chinese:
      '你們所遇見的試探，無非是人所能受的。神是信實的，必不叫你們受試探過於所能受的。在受試探的時候，總要給你們開一條出路，叫你們能忍受得住。',
    english:
      'No testing has overtaken you that is not common to everyone. God is faithful, and he will not let you be tested beyond your strength.',
  },
  cor2510: {
    book: '哥林多後書',
    reference: '2Cor 5:10',
    chinese:
      '因為我們眾人必要在基督臺前顯露出來，叫各人按著本身所行的，或善或惡受報。',
    english:
      'For all of us must appear before the judgment seat of Christ, so that each may receive recompense for what has been done in the body.',
  },
  eph42224: {
    book: '以弗所書',
    reference: 'Eph 4:22-24',
    chinese:
      '就要脫去你們從前行為上的舊人。這舊人是因私慾的迷惑，漸漸變壞的。又要將你們的心志改換一新。並且穿上新人，這新人是照著神的形像造的，有真理的仁義和聖潔。',
    english:
      'You were taught to put away your former way of life, your old self, and to be renewed in the spirit of your minds, and to clothe yourselves with the new self.',
  },
  heb31213: {
    book: '希伯來書',
    reference: 'Heb 3:12-13',
    chinese:
      '弟兄們，你們要謹慎，免得你們中間或有人存著不信的惡心，把永生神離棄了。總要趁著還有今日，天天彼此相勸，免得你們中間有人被罪迷惑，心裡就剛硬了。',
    english:
      'Take care, brothers and sisters, that none of you may have an evil, unbelieving heart that turns away from the living God.',
  },
  jam11415: {
    book: '雅各書',
    reference: 'Jam 1:14-15',
    chinese:
      '但各人被試探，乃是被自己的私慾牽引誘惑的。私慾既懷了胎，就生出罪來。罪既長成，就生出死來。',
    english:
      "But one is tempted by one's own desire, being lured and enticed by it; then, when that desire has conceived, it gives birth to sin.",
  },
  john1810: {
    book: '約翰一書',
    reference: '1John 1:8-10',
    chinese:
      '我們若說自己無罪，便是自欺，真理不在我們心裡了。我們若認自己的罪，神是信實的、是公義的，必要赦免我們的罪，洗淨我們一切的不義。',
    english:
      'If we say that we have no sin, we deceive ourselves, and the truth is not in us. If we confess our sins, he who is faithful and just will forgive us our sins.',
  },
};

const reflectionPromptsA = [
  '為何面對試探是讓你變得更好的機會？',
  '你認為理解試探的本質有助於勝過試探嗎？為什麼？',
  '如何依靠神的幫助而非單靠自己面對試探？',
  '若勝過你最常面對的試探，可以培養出哪一種像基督的品格？',
  '從這篇關於「得勝的確據」的延伸學習中，你得到了什麼啟發？',
];

const reflectionPromptsB = [
  '將福音比喻為「傳給後世的產業」的意象對你有何啟示？',
  '為何耶穌的神性是基督在十字架上成就救贖的必要前提？',
  '基督的死如何滿足神的公義並確保給我們憐憫？',
  '耶穌的復活為何對我們的救贖及戰勝罪惡與死亡至關重要？',
  '從這篇關於「赦罪的確據」的延伸學習中，你得到了什麼啟發？',
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

export function VictoryAssuranceScreen() {
  return (
    <>
      <PageHeader title="得勝的確據" backTo="/journey" />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-surface-container-low p-8 shadow-[0_22px_56px_rgba(40,53,28,0.1)]">
          <div className="mb-7 inline-flex rounded-full bg-primary-container px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-white">
            新生命栽培 : (5)
          </div>
          <h2 className="font-headline text-[2.45rem] leading-tight text-primary">
            得勝的確據
          </h2>
          <p className="mt-3 font-medium text-secondary">
            Assurance of Victory
          </p>
        </section>

        <section className="mt-8 grid gap-5">
          <section className="rounded-[2rem] bg-primary p-6 text-white shadow-[0_26px_68px_rgba(40,53,28,0.22)]">
            <div className="flex items-center gap-3 text-secondary-fixed">
              <Icon name="shield" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                本課金句
              </p>
            </div>
            <p className="mt-5 font-headline text-[1.15rem] leading-9">
              {victoryScriptures.cor1013.chinese}
            </p>
            <p className="mt-4 text-sm leading-7 text-on-primary-container">
              {victoryScriptures.cor1013.english}
            </p>
            <p className="mt-5 font-body text-[11px] font-extrabold tracking-[0.22em] text-secondary-fixed">
              哥林多前書 1Cor 10:13
            </p>
          </section>

          <QuestionCard
            number="1"
            title="甚麼是罪惡？雅各書 1:14-15 如何描述人犯罪的過程？"
          >
            <ScriptureToggle scripture={victoryScriptures.jam11415} />
            <SavedAnswer storageKey="victory-assurance-q1" />
          </QuestionCard>

          <QuestionCard number="2" title="犯罪會帶來甚麼嚴重後果？">
            <div className="grid gap-4">
              {[
                ['以賽亞書 59:1-2', victoryScriptures.isa5912],
                ['哥林多後書 5:10', victoryScriptures.cor2510],
              ].map(([label, scripture]) => (
                <div
                  key={label}
                  className="rounded-[1.55rem] bg-surface-container-low p-5"
                >
                  <h4 className="font-headline text-[1.25rem] leading-tight text-primary">
                    {label}
                  </h4>
                  <div className="mt-5">
                    <ScriptureToggle scripture={scripture} />
                  </div>
                  <SavedAnswer
                    storageKey={`victory-assurance-q2-${scripture.reference}`}
                  />
                </div>
              ))}
            </div>
          </QuestionCard>

          <QuestionCard
            number="3"
            title="當我們在罪上失足時，神給了我們甚麼方法去處理，使我們可以得到最終的勝利？約翰一書 1:8-10"
          >
            <ScriptureToggle scripture={victoryScriptures.john1810} />
            <SavedAnswer storageKey="victory-assurance-q3" />
          </QuestionCard>

          <QuestionCard number="4" title="面對試探時，神給你甚麼幫助？">
            <div className="rounded-[1.55rem] bg-surface-container-low p-5">
              <h4 className="font-headline text-[1.25rem] leading-tight text-primary">
                (a) 當你遇到試探時，神應許給你甚麼幫助？哥林多前書 10:13
              </h4>
              <div className="mt-5">
                <ScriptureToggle scripture={victoryScriptures.cor1013} />
              </div>
              <SavedAnswer storageKey="victory-assurance-q4a" />
            </div>

            <div className="rounded-[1.55rem] bg-surface-container-low p-5">
              <h4 className="font-headline text-[1.25rem] leading-tight text-primary">
                (b) 甚麼能幫助你應付試探、對抗罪惡？
              </h4>
              <div className="mt-5 grid gap-3">
                <ScriptureToggle scripture={victoryScriptures.psalm119911} />
                <ScriptureToggle scripture={victoryScriptures.heb31213} />
                <ScriptureToggle scripture={victoryScriptures.prov41415} />
                <ScriptureToggle scripture={victoryScriptures.eph42224} />
              </div>
              <SavedAnswer storageKey="victory-assurance-q4b" />
            </div>
          </QuestionCard>

          <QuestionCard
            number="5"
            title="哪些引誘或罪惡經常纏擾你？試想想你可能的「出路」是什麼。"
          >
            <SavedAnswer storageKey="victory-assurance-q5" />
          </QuestionCard>

          <ExtensionCard
            title="《得勝的確據》延伸學習 (A) : 在試探中成長"
            to="/journey/victory-assurance/growing-through-temptation"
          />
          <ExtensionCard
            title="《得勝的確據》延伸學習 (B) : 戰勝試探"
            to="/journey/victory-assurance/overcoming-temptation"
          />
        </section>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/forgiveness-assurance', label: '赦罪的確據' }}
            next={{ to: '/journey/bible-authority', label: '聖經的權威' }}
          />
        </section>
      </main>
    </>
  );
}

export function VictoryGrowingThroughTemptationScreen() {
  return (
    <>
      <PageHeader
        title="在試探中成長"
        backTo="/journey/victory-assurance"
      />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《得勝的確據》延伸學習 (A)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            在試探中成長
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            改編自 Purpose Driven Life by Nick Warren。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={reflectionPromptsA}
            storagePrefix="victory-extension-a-reflection"
          />
          <NotionMarkdownArticle markdown={victoryExtensionAMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/victory-assurance', label: '得勝的確據' }}
          />
        </section>
      </main>
    </>
  );
}

export function VictoryOvercomingTemptationScreen() {
  return (
    <>
      <PageHeader
        title="戰勝試探"
        backTo="/journey/victory-assurance"
      />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《得勝的確據》延伸學習 (B)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            戰勝試探
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            依照匯入的 Notion Markdown 原文呈現。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={reflectionPromptsB}
            storagePrefix="victory-extension-b-reflection"
          />
          <NotionMarkdownArticle markdown={victoryExtensionBMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/victory-assurance', label: '得勝的確據' }}
          />
        </section>
      </main>
    </>
  );
}
