import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';

const prayerScriptures = {
  psalm628: {
    book: '詩篇',
    reference: 'Psalm 62:8',
    chinese: '你們眾民當時時倚靠他，在他面前傾心吐意，神是我們的避難所。',
    english:
      'Trust in him at all times, O people; pour out your heart before him; God is a refuge for us.',
  },
  matt69: {
    book: '馬太福音',
    reference: 'Mat 6:9',
    chinese: '所以你們禱告，要這樣說：我們在天上的父，願人都尊你的名為聖。',
    english:
      'Pray then in this way: Our Father in heaven, hallowed be your name.',
  },
  john157: {
    book: '約翰福音',
    reference: 'John 15:7',
    chinese: '你們若常在我裡面，我的話也常在你們裡面，凡你們所願意的，祈求就給你們成就。',
    english:
      'If you abide in me, and my words abide in you, ask for whatever you wish, and it will be done for you.',
  },
  john1624: {
    book: '約翰福音',
    reference: 'John 16:24',
    chinese: '向來你們沒有奉我的名求甚麼，如今你們求就必得著，叫你們的喜樂可以滿足。',
    english:
      'Until now you have not asked for anything in my name. Ask and you will receive, so that your joy may be complete.',
  },
  phil467: {
    book: '腓立比書',
    reference: 'Phil 4:6-7',
    chinese:
      '應當一無掛慮，只要凡事藉著禱告、祈求、和感謝，將你們所要的告訴神。神所賜出人意外的平安，必在基督耶穌裡保守你們的心懷意念。',
    english:
      'Do not worry about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.',
  },
  thess51618: {
    book: '帖撒羅尼迦前書',
    reference: '1Thess 5:16-18',
    chinese: '要常常喜樂，不住的禱告，凡事謝恩。因為這是神在基督耶穌裡向你們所定的旨意。',
    english:
      'Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you.',
  },
  john119: {
    book: '約翰一書',
    reference: '1John 1:9',
    chinese: '我們若認自己的罪，神是信實的、是公義的，必要赦免我們的罪，洗淨我們一切的不義。',
    english:
      'If we confess our sins, he who is faithful and just will forgive us our sins and cleanse us from all unrighteousness.',
  },
  john51415: {
    book: '約翰一書',
    reference: '1John 5:14-15',
    chinese:
      '我們若照他的旨意求甚麼，他就聽我們，這是我們向他所存坦然無懼的心。既然知道他聽我們一切所求的，就知道我們所求於他的無不得著。',
    english:
      'And this is the boldness we have in him, that if we ask anything according to his will, he hears us. And if we know that he hears us in whatever we ask, we know that we have obtained the requests made of him.',
  },
};

const actsItems = [
  {
    key: 'matt69',
    title: '讚美',
    english: 'Adoration',
    storageKey: 'prayer-assurance-acts-adoration',
  },
  {
    key: 'john119',
    title: '認罪',
    english: 'Confession',
    storageKey: 'prayer-assurance-acts-confession',
  },
  {
    key: 'thess51618',
    title: '感謝',
    english: 'Thanksgiving',
    storageKey: 'prayer-assurance-acts-thanksgiving',
  },
  {
    key: 'phil467',
    title: '祈求',
    english: 'Supplication',
    storageKey: 'prayer-assurance-acts-supplication',
  },
];

const extensionAPrompts = [
  '從這篇關於「禱告」的延伸學習中，你得到了什麼啟發？',
  '你每天有禱告嗎？你在實踐禱告時有遇到什麼困難嗎？',
  '請將這次延伸學習所得應用於你的禱告，並立刻付諸行動 —— 現在就向神傾訴心意。',
];

const extensionBPrompts = [
  'What makes God worthy of worship?',
  'What is confession? Why does it follow adoration?',
  'What is the connection between thanksgiving and remembering?',
  'Note the biblical examples of intercessory prayer. How does this contrast with how we have prayed for one another?',
  'Does this reading convict, challenge or encourage you in any way about praying to God? Why?',
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

function ScriptureToggle({ scriptureKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const scripture = prayerScriptures[scriptureKey];

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

function ReflectionPromptList({ prompts, storagePrefix, placeholder }) {
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
            <SavedAnswer
              storageKey={`${storagePrefix}-${index + 1}`}
              placeholder={placeholder}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

function ArticleSection({ title, children }) {
  return (
    <section className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
      <h2 className="font-headline text-[1.75rem] leading-tight text-primary">
        {title}
      </h2>
      <div className="mt-5 space-y-5 text-[1.02rem] leading-8 text-on-surface-variant">
        {children}
      </div>
    </section>
  );
}

function QuoteBlock({ children }) {
  return (
    <blockquote className="rounded-[1.45rem] border-l-4 border-l-secondary bg-secondary-fixed/30 p-5 font-headline text-[1.08rem] leading-8 text-primary">
      {children}
    </blockquote>
  );
}

function NoteAside({ title, children }) {
  return (
    <aside className="rounded-[1.7rem] bg-secondary-fixed/28 p-5">
      <div className="flex items-center gap-3 text-secondary">
        <Icon name="tips_and_updates" className="text-[22px]" />
        <h3 className="font-headline text-[1.25rem] text-primary">{title}</h3>
      </div>
      <div className="mt-4 space-y-4 text-[0.98rem] leading-8 text-on-surface-variant">
        {children}
      </div>
    </aside>
  );
}

export function PrayerAssuranceScreen() {
  return (
    <>
      <PageHeader title="禱告的確據" backTo="/journey" />
      <main className="px-6 pb-36 pt-8">
        <section className="relative overflow-hidden rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)]" />
          <div className="relative">
            <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
              新生命栽培 : (3)
            </div>
            <h2 className="font-headline text-[2.4rem] leading-tight">
              禱告的確據
            </h2>
            <p className="mt-2 font-medium text-secondary-fixed font-body">Assurance of Prayer</p>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container">
              我們藉禱告向神傾心吐意、倚靠祂、親近祂。禱告是神賜給祂兒女的重要權利，使我們在日常生活中支取屬靈的能力與平安。
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
              {prayerScriptures.psalm628.chinese}
            </p>
            <p className="mt-4 text-sm leading-7 text-on-primary-container">
              {prayerScriptures.psalm628.english}
            </p>
            <p className="mt-5 font-body text-[11px] font-extrabold tracking-[0.22em] text-secondary-fixed">
              詩篇 Psalm 62:8
            </p>
          </section>

          <QuestionCard
            number="1"
            title="神賜給信徒的一個重要權利是甚麼？約翰福音 16:24"
          >
            <ScriptureToggle scriptureKey="john1624" />
            <SavedAnswer storageKey="prayer-assurance-q1" />
          </QuestionCard>

          <QuestionCard
            number="2"
            title="甚麼是祈禱？祈禱為甚麼要「奉耶穌的名」？詩篇 62:8；約翰福音 16:24"
          >
            <div className="grid gap-3">
              <ScriptureToggle scriptureKey="psalm628" />
              <ScriptureToggle scriptureKey="john1624" />
            </div>
            <div className="rounded-[1.55rem] bg-surface-container-low p-5">
              <p className="text-[1.02rem] leading-8 text-on-surface-variant">
                祈禱不是向神或人演講。當你聽見別人口若懸河地禱告，而自己卻難以說出一兩句話，你可能會覺得別人很了不起，也為自己感到羞愧。這想法很常見，但其實並不正確——就像人們以為鍍了金的鑰匙會更容易開鎖一樣。
              </p>
            </div>
            <SavedAnswer storageKey="prayer-assurance-q2" />
          </QuestionCard>

          <QuestionCard
            number="3"
            title="禱告能為你帶來甚麼改變？腓立比書 4:6-7"
          >
            <ScriptureToggle scriptureKey="phil467" />
            <SavedAnswer storageKey="prayer-assurance-q3" />
          </QuestionCard>

          <QuestionCard number="4" title="在甚麼情況下，你所祈求的事會得到神的應允？">
            <div className="rounded-[1.55rem] bg-surface-container-low p-5">
              <h4 className="font-headline text-[1.25rem] leading-tight text-primary">
                約翰福音 15:7
              </h4>
              <div className="mt-5">
                <ScriptureToggle scriptureKey="john157" />
              </div>
              <SavedAnswer storageKey="prayer-assurance-q4-john15" />
            </div>
            <div className="rounded-[1.55rem] bg-surface-container-low p-5">
              <h4 className="font-headline text-[1.25rem] leading-tight text-primary">
                約翰一書 5:14-15
              </h4>
              <div className="mt-5">
                <ScriptureToggle scriptureKey="john51415" />
              </div>
              <SavedAnswer storageKey="prayer-assurance-q4-1john5" />
            </div>
          </QuestionCard>


          <QuestionCard number="5" title="ACTS 禱告操練">
            <div className="grid gap-4">
              {actsItems.map((item) => (
                <div
                  key={item.storageKey}
                  className="rounded-[1.55rem] bg-surface-container-low p-5"
                >
                  <h4 className="font-headline text-[1.25rem] leading-tight text-primary">
                    {item.title} ({item.english})
                  </h4>
                  <div className="mt-5">
                    <ScriptureToggle scriptureKey={item.key} />
                  </div>
                  <SavedAnswer storageKey={item.storageKey} />
                </div>
              ))}
            </div>
          </QuestionCard>

          <ExtensionCard
            title="《禱告的確據》延伸學習 (A) : 向神傾心吐意"
            to="/journey/prayer-assurance/pour-out-your-heart"
          />
          <ExtensionCard
            title="《禱告的確據》延伸學習 (B) : How Do We Pray?"
            to="/journey/prayer-assurance/how-do-we-pray"
          />
        </section>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/quiet-time', label: '靈修' }}
            next={{ to: '/journey/forgiveness-assurance', label: '赦罪的確據' }}
          />
        </section>
      </main>
    </>
  );
}

export function PrayerPourOutYourHeartScreen() {
  return (
    <>
      <PageHeader title="向神傾心吐意" backTo="/journey/prayer-assurance" />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《禱告的確據》延伸學習 (A)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            向神傾心吐意
          </h1>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={extensionAPrompts}
            storagePrefix="prayer-extension-a-reflection"
          />

          <ArticleSection title="1. 引言">
            <p>生命如何有效地成長？筆者有一個堂兄弟生下來便是軟骨的，一直到七歲還未能坐得穩當，更談不上能站立或走路了，甚至連吃飯也須要別人餵他。他到了七歲還不會說話，只會說些單音的字，終於就在那一年離開了世界。</p>
            <p>有許多基督徒已經得救，可惜靈性就像軟骨的孩子一樣，既是軟骨又是低能的，他們站不穩，也不會開口向人作見證；信主雖然多年，卻常要人照顧他們的靈性，常要人用屬靈的糧食餵養他們，不能站立得住。</p>
            <p>為甚麼這些重生的基督徒信主多年，還是像軟骨的孩子？因為他們得救以後忽略了四件事，就是禱告、認識聖經、作見證、參加聚會。</p>
            <p>就讓我們由禱告開始，看看一些實踐的要訣。</p>
          </ArticleSection>

          <ArticleSection title="2. 耶穌的禱告：跟神談話">
            <QuoteBlock>「親愛的弟兄啊，你們卻要在至聖的真道上造就自己，在聖靈裏禱告。」（猶大書 20）</QuoteBlock>
            <p>每一個基督徒信主以後便該有禱告的生活。禱告就好像人屬靈生命的呼吸，人生下來怎樣須要呼吸，重生後的人也照樣須要禱告。</p>
            <p>很多初信的朋友把禱告當作念經，其實禱告和念經是不一樣的。禱告是與神談話，這一件事可以從主耶穌的經驗清楚看出來。</p>
            <p>耶穌在世上與人談話時，常常會忽然轉向天父，與天父說話。祂的禱告絕對不像念經，乃像與親密的朋友說話一樣。</p>
            <p>耶穌的禱告像對人說話一樣，所以我們禱告不應像念經。禱告乃是向天父說話，把心中的情感、意念、思想、憂慮或快樂都告訴神，與祂交通來往。</p>
          </ArticleSection>

          <ArticleSection title="3. 神賜我們向祂禱告的權利">
            <QuoteBlock>「你們奉我的名無論求甚麼，我必成就，叫父因兒子得榮耀。你們若奉我的名求甚麼，我必成就。」（約翰福音 14:13-14）</QuoteBlock>
            <p>每一個基督徒都有禱告的權柄，這權柄是因主耶穌為我們釘十字架而有的。我們就可以奉主的名向天父禱告，把心中所需要的，或是關乎個人、生活、罪惡、試探、家人等一切的事，都可以照着自己的需要求神幫助。</p>
            <p>每一個信徒在信主後，便立即面對一個厲害的仇敵——魔鬼。信徒絕不能憑自己的力量和智慧勝過他。怎樣倚靠勝過魔鬼的耶穌？藉着禱告，禱告能使我們在神面前支取能力。</p>
            <p>小孩子最愛放風箏。風箏怎樣可以在天空飛翔？它被一根很細的線繫着。那根線雖然細小，不容易被人看見，它的作用卻非常大。有了那條繫在放風箏的人手裏的線，風愈大，風箏飄得愈高。</p>
            <p>基督徒在世上也是如此，常會遇到風波，遭遇各樣試探或誘惑。我們憑甚麼能夠站得住？就是藉着禱告，禱告就像一根看不見的線，繫在主耶穌的手中。</p>
            <NoteAside title="奉耶穌的名禱告">
              <p>奉耶穌的名禱告，意思是藉著祂的權威求父神回應我們的禱告，因為我們是奉祂的兒子耶穌的名而來。</p>
              <p>奉耶穌的名禱告，意思是根據神的旨意禱告，也是祈求那些使耶穌得榮耀的事。禱告結束時說「奉耶穌的名」，不會有任何神奇魔力。重要的是奉耶穌的名誠懇禱告，而不是在禱告末了加幾個詞。</p>
            </NoteAside>
            <NoteAside title="為什麼用「阿們」結束我們的禱告">
              <p>翻譯為「阿們」的希伯來語，字面意思是「真正的」或「是這樣」。當基督徒在禱告的最後說「阿們」的時候，我們是在懇求神照我們按祂旨意所禱告的讓事情成就。</p>
              <p>阿們與順服的讚美有關。當我們對神的命令和宣告說「阿們」時，我們的讚美對祂來說是動聽的音樂。</p>
            </NoteAside>
          </ArticleSection>

          <ArticleSection title="4. 在禱告上經驗神的信實和能力">
            <p>有些初信的基督徒常存一種錯誤的觀念，以為牧師或主內長輩的禱告總比他的禱告更有效，因此相信牧師的禱告，卻不相信自己的禱告，這不是聖經的真理。</p>
            <p>要知道每一個基督徒都是主用祂的寶血所買贖的人，他們發出的禱告是有同樣功效的。禱告能否蒙悅納，不在乎信主的資格、年日長久或在教會的職位，乃在乎禱告的人是否真誠，是否有信心，是否順着聖靈禱告。</p>
            <p>只要是聖靈感動我們，便要順着聖靈禱告。也不要等到有空才禱告，因為一天裏不知道會發生甚麼事，也不知道甚麼時候才有空。基督徒信了主以後，便當在一天中騰出時間來禱告。</p>
          </ArticleSection>

          <ArticleSection title="5. 騰出時間禱告">
            <p>攔阻基督徒經歷神在他們身上成就大工的最大因素是甚麼呢？我說是欠缺禱告。很多基督徒壓根兒不明白神兒女是可以將自己實際的需要告訴神，更遑論他們的禱告得着具體而確實可知的答應了。</p>
            <p>你可以盡覽禱告守則，又聆聽別人的祈求，但假若你自己不祈禱，你永遠不會明白禱告的真諦；這正如騎單車或游泳一樣，必須在實踐中學習。</p>
            <p>馬丁路德說：「裁縫的職責是做衣服，鞋匠的職責是補鞋，基督徒的職責是禱告。」請你每天定出個人的禱告時間，開始與神建立相交的生活。</p>
            <p>另一方面，我們在一天當中也該時刻禱告。聖經說：「不住的禱告。」無論何時何地，我們都可以無拘無束地與天父交談。</p>
          </ArticleSection>

          <ArticleSection title="6. 向神傾心吐意">
            <p>侯士庭博士說過：「禱告就是和神交朋友。」禱告只不過是兩個朋友在一起交談。</p>
            <p>禱告是神和我們——祂的兒女——之間的對話。它不是單向、滔滔不絕的獨白，而是趣味盎然的對談。</p>
            <p>我們當向神敬拜、認罪、感恩、以及祈求和代禱，以作為回應。若缺少這四種要素 ACTS，我們的祈禱便會流於片面、不勻稱。</p>
            <p>真正禱告的第一個要素，是敬拜。認罪是在讚美之後。惟有在敬拜和認罪之後，我們才可以向天父祈求。我們禱告的時候，也應該為別人代禱。在我們與神的對話裏，感恩自然而然成為結束部分。</p>
            <p>神不斷推動人跟祂對話。神有否促使你去祈禱？我們現在就停下來，與祂對話吧。</p>
          </ArticleSection>
        </div>

        <section className="mt-8">
          <JourneyPager previous={{ to: '/journey/prayer-assurance', label: '禱告的確據' }} />
        </section>
      </main>
    </>
  );
}

export function PrayerHowDoWePrayScreen() {
  return (
    <>
      <PageHeader title="How Do We Pray?" backTo="/journey/prayer-assurance" />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《禱告的確據》延伸學習 (B)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            How Do We Pray?
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            Adapted from: Discipleship Essentials by Greg Ogden
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <ReflectionPromptList
            prompts={extensionBPrompts}
            storagePrefix="prayer-extension-b-reflection"
            placeholder="Write your response here..."
          />

          <ArticleSection title="1. Relational Conversation with God">
            <p>Prayer is transparent dialogue. It is the way we have an intimate conversation with the Creator of the universe and the Redeemer of our lives, who is wild about spending time with us.</p>
            <p>Prayer represents the place of greatest safety where we can pour out our hearts in an unedited fashion, much like we would to a dear friend who accepts us as we are.</p>
            <QuoteBlock>The Lord is inviting you—and me—to come home, to come home to where we belong, to come home to that for which we were created.</QuoteBlock>
            <p>Prayer is a relationship with the One who has already declared us his beloved children and who wants to be close to us. Using the acronym ACTS introduced earlier, we discuss the four basic parts of prayer: adoration, confession, thanksgiving and supplication.</p>
          </ArticleSection>

          <ArticleSection title="2. Adoration">
            <p>The first movement of the heart in prayer is adoration. Adoration is appreciating who God is himself, whereas thanksgiving is appreciating God for what he has done for us.</p>
            <p>Adoration lifts us out of ourselves to behold the wonder and beauty of God. The psalms, the worship book of the Bible, are effusive and demonstrative in their praise.</p>
            <QuoteBlock>I will exalt you, my God the King; I will praise your name for ever and ever. Great is the Lord and most worthy of praise; his greatness no one can fathom. (Psalm 145:1-3)</QuoteBlock>
            <p>One way to practice adoration is to select an attribute of God and write in your journal the fruits of your imagination. Praise not only expresses our joy, it also completes it.</p>
          </ArticleSection>

          <ArticleSection title="3. Confession">
            <p>When we fill our hearts with the glory of God and pray as Jesus taught us, “Hallowed be your name,” the natural movement of our hearts is to see the darkness of our lives in light of his radiance.</p>
            <p>In Greek, confess means “to agree with.” In confessing to God we are agreeing with God about what he sees. Our prayer is, “Lord, let me see me as you see me.”</p>
            <QuoteBlock>Have mercy on me, O God, according to your unfailing love; according to your great compassion blot out my transgressions. (Psalm 51:1)</QuoteBlock>
            <p>Satan causes us to wallow in unnamed guilt, but God’s conviction is focused and meant to lead us to restoration. There is no condemnation for those who are in Christ Jesus.</p>
          </ArticleSection>

          <ArticleSection title="4. Thanksgiving">
            <p>When we truly understand the rescue that God has performed in snatching us from the guilt and condemnation of our sin, then we will realize that the fundamental motive of Christian living is thanksgiving.</p>
            <p>We so easily lose our sense of gratitude and forget the good things the Lord has done for us. Thanksgiving is the cultivation of a memory. It is prayerfully listing the good that is in our life.</p>
          </ArticleSection>

          <ArticleSection title="5. Supplication">
            <p>Supplication means to ask with intensity, earnestness and perseverance, to ask and keep on asking. Supplication can be broken down into intercession for others and petitions for ourselves.</p>
            <p>Intercession is to stand between two parties and plead the case of one to another. God has given us the great privilege of bringing others into his presence through prayer.</p>
            <p>Our failure to ask is a failure to know Jesus well. Prayer needs no special religious language. We are invited to know and carry on a transparent conversation with the One who accepts us as we are.</p>
            <p>Let your conversation be marked by adoration, confession, thanksgiving and supplication.</p>
          </ArticleSection>
        </div>

        <section className="mt-8">
          <JourneyPager previous={{ to: '/journey/prayer-assurance', label: '禱告的確據' }} />
        </section>
      </main>
    </>
  );
}
