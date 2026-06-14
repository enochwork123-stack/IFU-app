import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';

interface Scripture {
  book: string;
  reference: string;
  chinese: string;
  english?: string;
}

const spiritualGrowthScriptures = {
  col267: {
    book: '歌羅西書',
    reference: 'Col 2:6-7',
    chinese: '你們既然接受了主基督耶穌，就當遵他而行，在他裡面生根建造，信心堅固，正如你們所領的教訓，感謝的心也更增長了。',
    english: 'As you therefore have received Christ Jesus the Lord, continue to live your lives in him, rooted and built up in him and established in the faith, just as you were taught, abounding in thanksgiving.',
  },
  heb51213: {
    book: '希伯來書',
    reference: 'Heb 5:12-13',
    chinese: '看你們學習的工夫，本該作師傅，誰知還得有人將神聖言小學的開端另教導你們，並且成了那必須吃奶、不能吃乾糧的人。凡只能吃奶的，都不熟練仁義的道理，因為他是嬰孩。',
    english: 'For though by this time you ought to be teachers, you need someone to teach you again the basic elements of the oracles of God. You need milk, not solid food; for everyone who lives on milk, being still an infant, is unskilled in the word of righteousness.',
  },
  tim31617: {
    book: '提摩太後書',
    reference: '2Tim 3:16-17',
    chinese: '聖經都是神所默示的，於教訓、督責、使人歸正、教導人學義都是有益的，叫屬神的人得以完全，預備行各樣的善事。',
  },
  phil467: {
    book: '腓立比書',
    reference: 'Phil 4:6-7',
    chinese: '應當一無掛慮，只要凡事藉著禱告、祈求，和感謝，將你們所要的告訴神。神所賜、出人意外的平安必在基督耶穌裡保守你們的心懷意念。',
  },
  heb102425: {
    book: '希伯來書',
    reference: 'Heb 10:24-25',
    chinese: '又要彼此相顧，激發愛心，勉勵行善。你們不可停止聚會，好像那些停止慣了的人，倒要彼此勸勉，既知道那日子臨近，就更當如此。',
  },
  rom116: {
    book: '羅馬書',
    reference: 'Rom 1:16',
    chinese: '我不以福音為恥；這福音本是神的大能，要救一切相信的，先是猶太人，後是希利尼人。',
  },
  rom1212: {
    book: '羅馬書',
    reference: 'Rom 12:1-2',
    chinese: '所以，弟兄們，我以神的慈悲勸你們，將身體獻上，當作活祭，是聖潔的，是神所喜悅的；你們如此事奉乃是理所當然的。不要效法這個世界，只要心意更新而變化，叫你們察驗何為神的善良、純全、可喜悅的旨意。',
    english: 'I appeal to you therefore, brothers and sisters, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship. Do not be conformed to this world, but be transformed by the renewing of your minds, so that you may discern what is the will of God-- what is good and acceptable and perfect.',
  },
} satisfies Record<string, Scripture>;

interface SavedAnswerProps {
  storageKey: string;
  placeholder?: string;
  rows?: number;
}

const SavedAnswer: React.FC<SavedAnswerProps> = ({
  storageKey,
  placeholder = '在這裡輸入你的答案...',
  rows = 4,
}) => {
  const [answer, setAnswer] = useState('');
  const storageName = `ifu:${storageKey}`;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setAnswer(window.localStorage.getItem(storageName) ?? '');
  }, [storageName]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [answer]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextAnswer = event.target.value;
    setAnswer(nextAnswer);
    window.localStorage.setItem(storageName, nextAnswer);
  };

  return (
    <label className="mt-4 block">
      <span className="sr-only">你的答案</span>
      <textarea
        ref={textareaRef}
        value={answer}
        onChange={handleChange}
        rows={rows}
        className="min-h-24 w-full resize-none overflow-y-hidden rounded-2xl border border-outline-variant bg-surface-container-low/55 p-4 text-base leading-7 text-on-surface outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
        placeholder={placeholder}
      />
      <span className="mt-1 block text-right text-[10px] font-bold tracking-[0.12em] text-on-surface-variant/55">
        已自動儲存
      </span>
    </label>
  );
};

interface FillInTheBlankProps {
  storageKey: string;
  prefixText: string;
  placeholder?: string;
}

const FillInTheBlank: React.FC<FillInTheBlankProps> = ({
  storageKey,
  prefixText,
  placeholder = '填入答案...',
}) => {
  const [value, setValue] = useState('');
  const storageName = `ifu:${storageKey}`;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(window.localStorage.getItem(storageName) ?? '');
  }, [storageName]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    window.localStorage.setItem(storageName, nextValue);
  };

  return (
    <div className="flex flex-col gap-2 mt-3 p-3 rounded-xl bg-surface border border-outline-variant/30 w-full overflow-hidden">
      <span className="font-body text-sm text-primary font-bold block break-words">
        {prefixText}
      </span>
      <div className="flex flex-col gap-1 w-full">
        <textarea
          ref={textareaRef}
          rows={2}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full overflow-y-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-2 text-base text-on-surface outline-none transition focus:border-secondary focus:bg-white resize-none"
        />
        <span className="text-[9px] font-bold tracking-[0.1em] text-on-surface-variant/45 text-right block pr-1">
          已自動儲存
        </span>
      </div>
    </div>
  );
};

interface ScriptureToggleProps {
  scripture: Scripture;
}

const ScriptureToggle: React.FC<ScriptureToggleProps> = ({ scripture }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-sm w-full overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((curr) => !curr)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left text-primary"
      >
        <span>
          <span className="block font-body text-[10px] font-extrabold tracking-[0.2em] text-secondary">
            {scripture.book}
          </span>
          <span className="mt-1 block font-headline text-[1.1rem] leading-tight font-bold">
            {scripture.reference}
          </span>
        </span>
        <Icon
          name={isOpen ? 'expand_less' : 'expand_more'}
          className="shrink-0 text-[24px] text-secondary"
        />
      </button>
      {isOpen && (
        <div className="border-t border-outline-variant/50 px-4 pb-5 pt-4">
          <p className="font-headline text-[1.05rem] leading-8 text-primary break-words">
            {scripture.chinese}
          </p>
          {scripture.english && (
            <p className="mt-2 text-xs leading-5 text-on-surface-variant font-body break-words">
              {scripture.english}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

interface QuestionCardProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ number, title, children }) => {
  return (
    <article className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)] w-full overflow-hidden">
      <div className="flex items-center gap-3 text-secondary">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed font-body text-sm font-extrabold text-on-secondary-fixed">
          {number}
        </span>
        <p className="font-body text-[10px] font-extrabold tracking-[0.2em]">
          問題 {number}
        </p>
      </div>
      <h3 className="mt-4 font-headline text-[1.35rem] leading-snug font-bold text-primary break-words">
        {title}
      </h3>
      <div className="mt-5 space-y-4 w-full">{children}</div>
    </article>
  );
};

type WheelPart = 'hub' | 'rim' | 'word' | 'prayer' | 'fellowship' | 'witness' | null;

interface WheelInfo {
  title: string;
  scripture: string;
  meaning: string;
}

const wheelData: Record<Exclude<WheelPart, null>, WheelInfo> = {
  hub: {
    title: '基督是中心 (Hub - 輪轂)',
    scripture: '林後 5:17; 加 2:20',
    meaning: '基督徒生活的動力源自耶穌基督。祂是生命輪的中心輪轂，藉著聖靈住在你裡面，供應你前行所需的一切力量，並使你所做的一切為要榮耀神。',
  },
  rim: {
    title: '順服基督 (Rim - 輪胎/輪緣)',
    scripture: '羅 12:1-2; 約 14:21',
    meaning: '生命輪的外緣代表我們在日常生活中對基督主權的順服。當我們樂意遵行祂的命令、將身體獻上作為活祭，輪子才能平穩前行，活出見證。',
  },
  word: {
    title: '神的話語 (Word - 輪輻/ spoke)',
    scripture: '提後 3:16; 書 1:8',
    meaning: '垂直的輪輻之一。聖經是我們靈魂的食物與屬靈爭戰的寶劍。藉著讀經、考查與默想，我們與神建立起親密而穩固的連結。',
  },
  prayer: {
    title: '禱告 (Prayer - 輪輻/ spoke)',
    scripture: '約 15:7; 腓 4:6-7',
    meaning: '垂直的另一輪輻，與神的話語相對。禱告是我們與天父的直接交通。藉著傾心吐意與祈求，我們得著供應，並時刻表達對天父的仰望和倚靠。',
  },
  fellowship: {
    title: '團契相交 (Fellowship - 輪輻/ spoke)',
    scripture: '太 18:20; 來 10:24-25',
    meaning: '水平的輪輻之一，關乎我們與信徒的交往。在基督裡相聚能為我們帶來不可或缺的彼此相顧、激發愛心與勉勵行善的動力。',
  },
  witness: {
    title: '見證主 (Witness - 輪輻/ spoke)',
    scripture: '太 4:19; 羅 1:16',
    meaning: '水平的另一輪輻，關乎我們與非信徒的關係。當我們靈修、禱告並經歷團契，我們就預備好將生命經歷與福音真理與他人分享。',
  },
};

export const SpiritualGrowthScreen: React.FC = () => {
  const [activePart, setActivePart] = useState<WheelPart>(null);

  return (
    <>
      <PageHeader title="屬靈生命的成長" backTo="/journey" />
      <main className="px-6 pb-36 pt-8 overflow-x-hidden">
        {/* Course Banner */}
        <section className="relative overflow-hidden rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)] w-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)]" />
          <div className="relative">
            <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
              新生命栽培 : (12)
            </div>
            <h2 className="font-headline text-[2.4rem] leading-tight break-words">
              屬靈生命的成長
            </h2>
            <p className="mt-2 font-medium text-secondary-fixed font-body">Spiritual Growth</p>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container break-words">
              屬靈生命的成長是一生的追求。藉著持守聖經、禱告、團契與見證等「屬靈基要」操練，我們能以順服的心活出基督為中心的豐盛人生。
            </p>
          </div>
        </section>


        {/* Lesson Body */}
        <section className="mt-8 grid gap-6 w-full">
          {/* Question 1: Fill in the blanks */}
          <QuestionCard
            number="1"
            title="以下經文怎樣形容基督徒屬靈生命的成長？"
          >
            <div className="space-y-4 w-full">
              <div className="p-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low w-full">
                <ScriptureToggle scripture={spiritualGrowthScriptures.col267} />
                <FillInTheBlank
                  storageKey="spiritual-growth-q1-good"
                  prefixText="西 2:6-7 (良好的成長)："
                  placeholder="填寫經文描述的良好特徵（例如：在祂裡面生根建造、信心堅固）..."
                />
              </div>

              <div className="p-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low w-full">
                <ScriptureToggle scripture={spiritualGrowthScriptures.heb51213} />
                <FillInTheBlank
                  storageKey="spiritual-growth-q1-bad"
                  prefixText="來 5:12-13 (不良的成長)："
                  placeholder="填寫經文描述的停滯特徵（例如：成了必須吃奶、不能吃乾糧的人/嬰孩）..."
                />
              </div>
            </div>
          </QuestionCard>

          {/* Question 2 */}
          <QuestionCard
            number="2"
            title="那段經文所形容的較近似你的情況？請加以說明："
          >
            <SavedAnswer
              storageKey="spiritual-growth-q2"
              placeholder="反思哪段經文較接近你當前的情況，並加以解釋說明原因..."
            />
          </QuestionCard>

          {/* Question 3: Fill in the blanks */}
          <QuestionCard
            number="3"
            title="請溫習如何藉著實踐以下四方面的「屬靈基要」，去幫助你的新生命成長："
          >
            <div className="space-y-4 w-full">
              <div className="p-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low w-full">
                <ScriptureToggle scripture={spiritualGrowthScriptures.tim31617} />
                <FillInTheBlank
                  storageKey="spiritual-growth-q3-word"
                  prefixText="提後 3:16-17："
                  placeholder="填寫你對聖經/Word實踐的想法或經文摘要..."
                />
              </div>

              <div className="p-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low w-full">
                <ScriptureToggle scripture={spiritualGrowthScriptures.phil467} />
                <FillInTheBlank
                  storageKey="spiritual-growth-q3-prayer"
                  prefixText="腓 4:6-7："
                  placeholder="填寫你對禱告/Prayer實踐的想法或經文摘要..."
                />
              </div>

              <div className="p-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low w-full">
                <ScriptureToggle scripture={spiritualGrowthScriptures.heb102425} />
                <FillInTheBlank
                  storageKey="spiritual-growth-q3-fellowship"
                  prefixText="來 10:24-25："
                  placeholder="填寫你對團契/Fellowship實踐的想法或經文摘要..."
                />
              </div>

              <div className="p-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low w-full">
                <ScriptureToggle scripture={spiritualGrowthScriptures.rom116} />
                <FillInTheBlank
                  storageKey="spiritual-growth-q3-witness"
                  prefixText="羅 1:16："
                  placeholder="填寫你對見證/Witness實踐的想法或經文摘要..."
                />
              </div>
            </div>
          </QuestionCard>

          {/* Question 4 */}
          <QuestionCard
            number="4"
            title="羅 12:1-2 所教導的，與你新生命的成長有何關係？"
          >
            <ScriptureToggle scripture={spiritualGrowthScriptures.rom1212} />
            <SavedAnswer
              storageKey="spiritual-growth-q4"
              placeholder="分享你對活祭奉獻、心意更新與生命成長的關係理解..."
            />
          </QuestionCard>

          {/* Question 5 */}
          <QuestionCard
            number="5"
            title="你打算採取甚麼行動，使你屬靈生命持續成長？"
          >
            <SavedAnswer
              storageKey="spiritual-growth-q5"
              placeholder="例如：制定規律的靈修、參與團契、主動為福音朋友見證等具體行動..."
            />
          </QuestionCard>

          {/* Appendix A: Interactive SVG Life Wheel */}
          <section className="rounded-[2.35rem] bg-surface-container-low p-6 shadow-sm border border-outline-variant/40 flex flex-col items-center w-full">
            <div className="w-full flex items-center gap-3 text-secondary mb-4">
              <Icon name="palette" className="text-[22px]" />
              <h3 className="font-headline text-[1.45rem] font-bold text-primary break-words">
                附件 A : 生命輪 (The 'Wheel' Illustration)
              </h3>
            </div>
            
            <p className="text-sm leading-6 text-on-surface-variant text-center w-full max-w-md mb-6 break-words">
              點擊輪子的不同部分（中心輪轂、外側輪胎、四個輪輻），以探索基督徒屬靈生命的幾項基本基要操練。
            </p>

            {/* SVG Interactive Wheel */}
            <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center my-4 min-w-0 overflow-hidden">
              <svg
                viewBox="0 0 360 360"
                className="w-full h-full select-none"
              >
                <defs>
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#28351c" floodOpacity="0.12" />
                  </filter>
                </defs>

                {/* Rim (Obedience) */}
                <circle
                  cx="180"
                  cy="180"
                  r="140"
                  stroke={activePart === 'rim' ? '#795900' : '#28351c'}
                  strokeWidth={activePart === 'rim' ? '30' : '24'}
                  fill="none"
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => setActivePart('rim')}
                />
                
                {/* Spokes lines (Word, Prayer, Fellowship, Witness) */}
                {/* Word Spoke (Top) */}
                <rect
                  x="162"
                  y="48"
                  width="36"
                  height="82"
                  fill={activePart === 'word' ? '#795900' : '#28351c'}
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => setActivePart('word')}
                />
                
                {/* Prayer Spoke (Bottom) */}
                <rect
                  x="162"
                  y="230"
                  width="36"
                  height="82"
                  fill={activePart === 'prayer' ? '#795900' : '#28351c'}
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => setActivePart('prayer')}
                />

                {/* Fellowship Spoke (Left) */}
                <rect
                  x="48"
                  y="162"
                  width="82"
                  height="36"
                  fill={activePart === 'fellowship' ? '#795900' : '#28351c'}
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => setActivePart('fellowship')}
                />

                {/* Witness Spoke (Right) */}
                <rect
                  x="230"
                  y="162"
                  width="82"
                  height="36"
                  fill={activePart === 'witness' ? '#795900' : '#28351c'}
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => setActivePart('witness')}
                />

                {/* Center Hub (Christ) */}
                <circle
                  cx="180"
                  cy="180"
                  r="56"
                  fill={activePart === 'hub' ? '#795900' : '#3e4c31'}
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  filter="url(#shadow)"
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => setActivePart('hub')}
                />

                {/* SVG Labels */}
                {/* Hub Label */}
                <text
                  x="180"
                  y="186"
                  fill="#ffffff"
                  fontSize="18"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="pointer-events-none font-headline"
                >
                  基督
                </text>

                {/* Rim Labels (Top and Bottom curves) */}
                <text
                  x="180"
                  y="22"
                  fill={activePart === 'rim' ? '#795900' : '#28351c'}
                  fontSize="14"
                  fontWeight="black"
                  textAnchor="middle"
                  className="pointer-events-none font-body uppercase tracking-[0.15em]"
                >
                  順 服 OBEDIENCE
                </text>

                {/* Word Spoke Label */}
                <text
                  x="180"
                  y="95"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="pointer-events-none font-headline"
                >
                  聖經
                </text>

                {/* Prayer Spoke Label */}
                <text
                  x="180"
                  y="277"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="pointer-events-none font-headline"
                >
                  禱告
                </text>

                {/* Fellowship Spoke Label */}
                <text
                  x="89"
                  y="186"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="pointer-events-none font-headline"
                >
                  團契
                </text>

                {/* Witness Spoke Label */}
                <text
                  x="271"
                  y="186"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="pointer-events-none font-headline"
                >
                  見證
                </text>
              </svg>
            </div>

            {/* Description Card */}
            <div className="w-full h-[210px] rounded-2xl bg-surface-container-lowest border border-outline-variant/50 p-5 transition-all duration-300 shadow-inner overflow-y-auto">
              {activePart ? (
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-headline font-bold text-primary text-[1.15rem] break-words">
                      {wheelData[activePart].title}
                    </h4>
                    <span className="text-xs font-bold text-secondary bg-secondary-fixed/50 px-2.5 py-1 rounded-md font-body whitespace-nowrap">
                      {wheelData[activePart].scripture}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-on-surface-variant font-body break-words">
                    {wheelData[activePart].meaning}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <Icon name="touch_app" className="text-secondary text-[28px] animate-bounce mb-2" />
                  <p className="text-sm font-semibold text-secondary">
                    請點選上方生命輪各個區塊以查閱詳情
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Congrats banner */}
          <div className="rounded-[2.35rem] bg-secondary p-8 text-white shadow-[0_22px_56px_rgba(121,89,0,0.22)] mt-4 w-full">
            <h3 className="font-headline text-[1.6rem] font-bold leading-tight flex items-center gap-3">
              <Icon name="workspace_premium" className="text-[28px] text-secondary-fixed" />
              恭喜你！
            </h3>
            <p className="mt-3 text-[1.02rem] leading-7 text-white/90 break-words">
              你已完成《新生命栽培課程》，請盡快加入查考聖經小組，開始《在基督裡的新生命》的查經系列。
            </p>
            <div className="mt-6 border-t border-white/20 pt-4 flex flex-col gap-2 w-full">
              <p className="text-xs italic leading-6 text-white/80 font-headline break-words">
                「有了我的命令又遵守的，這人就是愛我的。愛我的必蒙我父愛他，我也要愛他，並且要向他顯現。」
              </p>
              <p className="text-[10px] font-bold tracking-[0.16em] text-secondary-fixed">
                約翰福音 14:21
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Pager */}
        <section className="mt-8 w-full">
          <JourneyPager
            previous={{ to: '/journey/life-goal', label: '人生目的' }}
            next={{ to: '/journey', label: '返回目錄' }}
          />
        </section>
      </main>
    </>
  );
};
