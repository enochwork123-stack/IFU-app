import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { NotionMarkdownArticle } from '../components/content/NotionMarkdownArticle';
import { PageHeader } from '../components/PageHeader';
import forgivenessExtensionAMarkdown from '../content/notion/forgiveness-extension-a.md?raw';
import forgivenessExtensionBMarkdown from '../content/notion/forgiveness-extension-b.md?raw';

const forgivenessScriptures = {
  psalm3818: {
    book: '詩篇',
    reference: 'Psalm 38:18',
    chinese: '我要承認我的罪孽，我要因我的罪憂愁。',
    english: 'I confess my iniquity; I am sorry for my sin.',
  },
  prov2813: {
    book: '箴言',
    reference: 'Prov 28:13',
    chinese: '遮掩自己罪過的，必不亨通。承認離棄罪過的，必蒙憐恤。',
    english:
      'No one who conceals transgressions will prosper, but one who confesses and forsakes them will obtain mercy.',
  },
  rom71819: {
    book: '羅馬書',
    reference: 'Rom 7:18-19',
    chinese:
      '我也知道在我裡頭，就是我肉體之中，沒有良善。因為立志為善由得我，只是行出來由不得我。故此，我所願意的善，我反不作。我所不願意的惡，我倒去作。',
    english:
      'For I know that nothing good dwells within me, that is, in my flesh. I can will what is right, but I cannot do it.',
  },
  eph289: {
    book: '以弗所書',
    reference: 'Eph 2:8-9',
    chinese:
      '你們得救是本乎恩、也因著信，這並不是出於自己，乃是神所賜的，也不是出於行為，免得有人自誇。',
    english:
      'For by grace you have been saved through faith, and this is not your own doing; it is the gift of God - not the result of works, so that no one may boast.',
  },
  eph432: {
    book: '以弗所書',
    reference: 'Eph 4:32',
    chinese:
      '並要以恩慈相待，存憐憫的心，彼此饒恕，正如神在基督裡饒恕了你們一樣。',
    english:
      'Be kind to one another, tenderhearted, forgiving one another, as God in Christ has forgiven you.',
  },
  john1810: {
    book: '約翰一書',
    reference: '1John 1:8-10',
    chinese:
      '我們若說自己無罪，便是自欺，真理不在我們心裡了。我們若認自己的罪，神是信實的、是公義的，必要赦免我們的罪，洗淨我們一切的不義。我們若說自己沒有犯過罪，便是以神為說謊的，他的道也不在我們心裡了。',
    english:
      'If we say that we have no sin, we deceive ourselves, and the truth is not in us. If we confess our sins, he who is faithful and just will forgive us our sins and cleanse us from all unrighteousness.',
  },
  cor521: {
    book: '哥林多後書',
    reference: '2Cor 5:21',
    chinese: '神使那無罪的替我們成為罪，好叫我們在祂裡面成為神的義。',
  },
  john524: {
    book: '約翰福音',
    reference: 'John 5:24',
    chinese:
      '我實實在在地告訴你們：那聽我話又信差我來者的，就有永生，不至於定罪，是已經出死入生了。',
  },
  john316: {
    book: '約翰福音',
    reference: 'John 3:16',
    chinese: '叫一切信祂的，不致滅亡，反得永生。',
  },
  cor1534: {
    book: '哥林多前書',
    reference: '1Cor 15:3-4',
    chinese:
      '基督照聖經所說，為我們的罪死了，而且埋葬了，又照聖經所說第三天復活了。',
  },
};

const reflectionPromptsA = [
  '聖經所說的「犯罪」與現今社會法律上的「犯法」有何分別？',
  '基於什麼我們可以肯定能得到神的赦罪？',
  '信耶穌之後又再犯罪，應該怎麼辦？再認罪是否等於再一次得救？',
  '從這篇關於「赦罪的確據」的延伸學習中，你得到了什麼啟發？',
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

export function ForgivenessAssuranceScreen() {
  return (
    <>
      <PageHeader title="赦罪的確據" backTo="/journey" />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-surface-container-low p-8 shadow-[0_22px_56px_rgba(40,53,28,0.1)]">
          <div className="mb-7 inline-flex rounded-full bg-primary-container px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-white">
            新生命栽培 : (4)
          </div>
          <h2 className="font-headline text-[2.45rem] leading-tight text-primary">
            赦罪的確據
          </h2>
          <p className="mt-3 font-medium text-secondary">
            Assurance of Forgiveness
          </p>
        </section>

        <section className="mt-8 grid gap-5">
          <section className="rounded-[2rem] bg-primary p-6 text-white shadow-[0_26px_68px_rgba(40,53,28,0.22)]">
            <div className="flex items-center gap-3 text-secondary-fixed">
              <Icon name="verified" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                本課金句
              </p>
            </div>
            <p className="mt-5 font-headline text-[1.15rem] leading-9">
              {forgivenessScriptures.john1810.chinese}
            </p>
            <p className="mt-4 text-sm leading-7 text-on-primary-container">
              {forgivenessScriptures.john1810.english}
            </p>
            <p className="mt-5 font-body text-[11px] font-extrabold tracking-[0.22em] text-secondary-fixed">
              約翰一書 1John 1:8-10
            </p>
          </section>

          <QuestionCard
            number="1"
            title="信徒會犯罪嗎？聖經怎樣形容信徒在世上與罪的交戰？羅馬書 7:18-19；約翰一書 1:8"
          >
            <div className="grid gap-3">
              <ScriptureToggle scripture={forgivenessScriptures.rom71819} />
              <ScriptureToggle scripture={forgivenessScriptures.john1810} />
            </div>
            <SavedAnswer storageKey="forgiveness-assurance-q1" />
          </QuestionCard>

          <QuestionCard
            number="2"
            title="你若犯了罪，該怎樣做？神為你安排了什麼解救？約翰一書 1:9-10"
          >
            <ScriptureToggle scripture={forgivenessScriptures.john1810} />
            <SavedAnswer storageKey="forgiveness-assurance-q2" />
          </QuestionCard>

          <QuestionCard
            number="3"
            title="你得赦罪的基礎是什麼？這與你信主時得赦罪的情況一致。以弗所書 2:8-9"
          >
            <ScriptureToggle scripture={forgivenessScriptures.eph289} />
            <SavedAnswer storageKey="forgiveness-assurance-q3" />
          </QuestionCard>

          <QuestionCard number="4" title="認罪的人應該有什麼態度和行動？">
            <div className="grid gap-4">
              {[
                ['詩篇 38:18', forgivenessScriptures.psalm3818],
                ['箴言 28:13', forgivenessScriptures.prov2813],
                ['以弗所書 4:32', forgivenessScriptures.eph432],
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
                    storageKey={`forgiveness-assurance-q4-${scripture.reference}`}
                  />
                </div>
              ))}
            </div>
          </QuestionCard>

          <QuestionCard
            number="5"
            title="你有常常作認罪的禱告嗎？若你有甚麼仍未求神赦免的罪，請立即向神承認，並感謝祂的赦免。"
          >
            <SavedAnswer storageKey="forgiveness-assurance-q5" />
          </QuestionCard>

          <ExtensionCard
            title="《赦罪的確據》延伸學習 (A) : 認罪與赦罪"
            to="/journey/forgiveness-assurance/confession-and-forgiveness"
          />
          <ExtensionCard
            title="《赦罪的確據》延伸學習 (B) : 罪怎能得赦免？"
            to="/journey/forgiveness-assurance/how-can-sin-be-forgiven"
          />
        </section>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/prayer-assurance', label: '禱告的確據' }}
            next={{ to: '/journey/victory-assurance', label: '得勝的確據' }}
          />
        </section>
      </main>
    </>
  );
}

export function ForgivenessConfessionAndForgivenessScreen() {
  return (
    <>
      <PageHeader
        title="認罪與赦罪"
        backTo="/journey/forgiveness-assurance"
      />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《赦罪的確據》延伸學習 (A)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            認罪與赦罪
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            改編自 J.I. Packer、Billy Graham Evangelistic Association、gotquestions.org 及《由初信到成長》。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={reflectionPromptsA}
            storagePrefix="forgiveness-extension-a-reflection"
          />
          <NotionMarkdownArticle markdown={forgivenessExtensionAMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/forgiveness-assurance', label: '赦罪的確據' }}
          />
        </section>
      </main>
    </>
  );
}

export function ForgivenessHowCanSinBeForgivenScreen() {
  return (
    <>
      <PageHeader
        title="罪怎能得赦免？"
        backTo="/journey/forgiveness-assurance"
      />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《赦罪的確據》延伸學習 (B)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            罪怎能得赦免？
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            改編自 Greg Ogden, “The Hope Jesus Offers”。
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={reflectionPromptsB}
            storagePrefix="forgiveness-extension-b-reflection"
          />
          <NotionMarkdownArticle markdown={forgivenessExtensionBMarkdown} />
        </div>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/forgiveness-assurance', label: '赦罪的確據' }}
          />
        </section>
      </main>
    </>
  );
}
