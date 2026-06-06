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

const lifeGoalScriptures: Record<string, Scripture> = {
  john1010: {
    book: '約翰福音',
    reference: 'John 10:10',
    chinese: '盜賊來，無非要偷竊、殺害、毀壞；我來了，是要叫羊（或作人）得生命，並且得的更豐盛。',
    english: 'The thief comes only to steal and kill and destroy. I came that they may have life, and have it abundantly.',
  },
  gal220: {
    book: '加拉太書',
    reference: 'Gal 2:20',
    chinese: '我已經與基督同釘十字架，現在活著的不再是我，乃是基督在我裡面活著；並且我如今在肉身活著，是因信神的兒子而活；他是愛我，為我捨己。',
    english: 'I have been crucified with Christ, and it is no longer I who live, but it is Christ who lives in me. And the life I now live in the flesh I live by faith in the Son of God, who loved me and gave himself for me.',
  },
  matt633: {
    book: '馬太福音',
    reference: 'Matt 6:33',
    chinese: '你們要先求他的國和他的義，這些東西都要加給你們了。',
    english: 'But strive first for the kingdom of God and his righteousness, and all these things will be given to you as well.',
  },
  matt281920: {
    book: '馬太福音',
    reference: 'Matt 28:19-20',
    chinese: '所以，你們要去，使萬民作我的門徒，奉父、子、聖靈的名給他們施洗。凡我所吩咐你們的，都教訓他們遵守，我就常與你們同在，直到世界的末了。',
    english: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything that I have commanded you. And remember, I am with you always, to the end of the age.',
  },
  eph42224: {
    book: '以弗所書',
    reference: 'Eph 4:22-24',
    chinese: '就要脫去你們從前行為上的舊人，這舊人是因私慾的迷惑漸漸變壞的；又要將你們的心志改換一新，並且穿上新人；這新人是照著神的形像造的，有真理的仁義和聖潔。',
    english: 'You were taught to put away your former way of life, your old self, corrupt and deluded by its lusts, and to be renewed in the spirit of your minds, and to clothe yourselves with the new self, created according to the likeness of God in true righteousness and holiness.',
  },
  john1421: {
    book: '約翰福音',
    reference: 'John 14:21',
    chinese: '有了我的命令又遵守的，這人就是愛我的；愛我的必蒙我父愛他，我也要愛他，並且要向他顯現。',
    english: 'They who have my commandments and keep them are those who love me; and those who love me will be loved by my Father, and I will love them and reveal myself to them.',
  },
};

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

interface ScriptureToggleProps {
  scripture: Scripture;
}

const ScriptureToggle: React.FC<ScriptureToggleProps> = ({ scripture }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-sm">
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
          <p className="font-headline text-[1.05rem] leading-8 text-primary">
            {scripture.chinese}
          </p>
          {scripture.english && (
            <p className="mt-2 text-xs leading-5 text-on-surface-variant font-body">
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
    <article className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
      <div className="flex items-center gap-3 text-secondary">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed font-body text-sm font-extrabold text-on-secondary-fixed">
          {number}
        </span>
        <p className="font-body text-[10px] font-extrabold tracking-[0.2em]">
          問題 {number}
        </p>
      </div>
      <h3 className="mt-4 font-headline text-[1.35rem] leading-snug font-bold text-primary">
        {title}
      </h3>
      <div className="mt-5 space-y-4">{children}</div>
    </article>
  );
};

export const LifeGoalScreen: React.FC = () => {
  return (
    <>
      <PageHeader title="人生目的" backTo="/journey" />
      <main className="px-6 pb-36 pt-8">
        {/* Course Banner */}
        <section className="relative overflow-hidden rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)]" />
          <div className="relative">
            <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
              新生命栽培 : (11)
            </div>
            <h2 className="font-headline text-[2.4rem] leading-tight">
              人生目的
            </h2>
            <p className="mt-2 font-medium text-secondary-fixed font-body">Life Goal</p>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container">
              主耶穌答應跟隨祂的人，能得豐盛的生命（約 10:10）。這是我們人生的正確方向。聖經教導我們該怎樣過這一生，為神的獨特呼召而活。
            </p>
          </div>
        </section>

        {/* Lesson Body */}
        <section className="mt-8 grid gap-6">


          {/* Question 1 */}
          <QuestionCard
            number="1"
            title="加 2:20 為何而活？"
          >
            <ScriptureToggle scripture={lifeGoalScriptures.gal220} />
            <SavedAnswer
              storageKey="life-goal-q1"
              placeholder="分享你對經文的理解與反思..."
            />
          </QuestionCard>

          {/* Question 2 */}
          <QuestionCard
            number="2"
            title="太 6:33 主吩咐我們在人生中要追求那兩樣東西？其他的事又怎樣？"
          >
            <ScriptureToggle scripture={lifeGoalScriptures.matt633} />
            <SavedAnswer
              storageKey="life-goal-q2"
              placeholder="列出主吩咐我們要先求的兩樣東西，以及你對「這些東西都要加給你們了」的信心與看法..."
            />
          </QuestionCard>

          {/* Question 3 */}
          <QuestionCard
            number="3"
            title="尋求「神的國」是甚麼意思？請查考 太 28:19-20："
          >
            <ScriptureToggle scripture={lifeGoalScriptures.matt281920} />
            <SavedAnswer
              storageKey="life-goal-q3"
              placeholder="根據經文，尋求神的國與大使命的關係..."
            />
          </QuestionCard>

          {/* Question 4 */}
          <QuestionCard
            number="4"
            title="尋求「神的義」是甚麼意思？請查考 弗 4:22-24; 約 14:21："
          >
            <div className="grid gap-3">
              <ScriptureToggle scripture={lifeGoalScriptures.eph42224} />
              <ScriptureToggle scripture={lifeGoalScriptures.john1421} />
            </div>
            <SavedAnswer
              storageKey="life-goal-q4"
              placeholder="結合「脫去舊人、穿上新人」以及「遵守命令以表達愛祂」，談談什麼是尋求神的義..."
            />
          </QuestionCard>

          {/* Question 5 */}
          <QuestionCard
            number="5"
            title="你是否立志為神給你所定的正確人生目的而活？你需要甚麼幫助去實踐為神而活？"
          >
            <SavedAnswer
              storageKey="life-goal-q5"
              placeholder="寫下你的立志與實踐中所需的幫助..."
            />
          </QuestionCard>
        </section>

        {/* Navigation Pager */}
        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/witnessing', label: '見證主' }}
            next={{ to: '/journey/spiritual-growth', label: '屬靈生命的成長' }}
          />
        </section>
      </main>
    </>
  );
};
