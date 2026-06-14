import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';

interface Scripture {
  book: string;
  reference: string;
  chinese: string;
  english?: string;
}

const witnessingScriptures = {
  matt516: {
    book: '馬太福音',
    reference: 'Matt 5:16',
    chinese: '你們的光也當這樣照在人前，叫他們看見你們的好行為，便將榮耀歸給你們在天上的父。',
    english: 'In the same way, let your light shine before others, so that they may see your good works and give glory to your Father in heaven.',
  },
  matt103233: {
    book: '馬太福音',
    reference: 'Matt 10:32-33',
    chinese: '凡在人面前認我的，我在我天上的父面前，也必認他。凡在人面前不認我的，我在我天上的父面前，也必不認他。',
    english: 'Everyone therefore who acknowledges me before others, I also will acknowledge before my Father in heaven; but whoever denies me before others, I also will deny before my Father in heaven.',
  },
  mark51920: {
    book: '馬可福音',
    reference: 'Mark 5:19-20',
    chinese: '耶穌不許，卻對他說：「你回家去，到你的親屬那裡，將主為你所作的是何等大的事，是怎樣憐憫你，都告訴他們。」他就走了，在低加坡里傳揚耶穌為他做了何等大的事，眾人就都希奇。',
    english: 'But Jesus refused, and said to him, "Go home to your friends, and tell them how much the Lord has done for you, and what mercy he has shown you." And he went away and began to proclaim in the Decapolis how much Jesus has done for him; and everyone was amazed.',
  },
  john925: {
    book: '約翰福音',
    reference: 'John 9:25',
    chinese: '他說：「他是個罪人不是，我不知道；有一件事我知道，從前我是眼瞎的，如今能看見了。」',
    english: 'He answered, "I do not know whether he is a sinner. One thing I do know, that though I was blind, now I see."',
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

export const WitnessingScreen: React.FC = () => {
  return (
    <>
      <PageHeader title="見證主" backTo="/journey" />
      <main className="px-6 pb-36 pt-8 overflow-x-hidden">
        {/* Course Banner */}
        <section className="relative overflow-hidden rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)] w-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)]" />
          <div className="relative">
            <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
              新生命栽培 : (10)
            </div>
            <h2 className="font-headline text-[2.4rem] leading-tight break-words">
              見證主
            </h2>
            <p className="mt-2 font-medium text-secondary-fixed font-body">Witnessing</p>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container break-words">
              見證主就是向別人表明你是基督徒，已靠主耶穌成為神的兒女。神要我們以好行為與真誠的言詞在人面前承認祂，引導人認識主。
            </p>
          </div>
        </section>


        {/* Lesson Body */}
        <section className="mt-8 grid gap-6 w-full">

          {/* Question 1: Fill in the blanks + Open reflection */}
          <QuestionCard
            number="1"
            title="見證主就是向別人表明你是基督徒，已靠著主耶穌成為了神的兒女。神要我們作祂的見證人以："
          >
            <div className="space-y-4 w-full">
              <div className="p-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low w-full">
                <ScriptureToggle scripture={witnessingScriptures.matt103233} />
                <FillInTheBlank
                  storageKey="witnessing-q1-a"
                  prefixText="太 10:32 向人承認："
                  placeholder="請填寫經文對應答案（例如：耶穌/祂）..."
                />
              </div>
              
              <div className="p-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low w-full">
                <ScriptureToggle scripture={witnessingScriptures.mark51920} />
                <FillInTheBlank
                  storageKey="witnessing-q1-b"
                  prefixText="可 5:19-20 幫助其他人："
                  placeholder="請填寫經文對應答案（例如：將主所作的事告訴他們）..."
                />
              </div>

              <div className="p-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low w-full">
                <ScriptureToggle scripture={witnessingScriptures.matt516} />
                <FillInTheBlank
                  storageKey="witnessing-q1-c"
                  prefixText="太 5:16 以你的言行讓神得："
                  placeholder="請填寫經文對應答案（例如：榮耀）..."
                />
              </div>

            </div>

            <div className="mt-6 border-t border-outline-variant/35 pt-5 w-full">
              <h4 className="font-headline text-[1.15rem] font-bold text-primary break-words">
                在這三方面你是否一個好的見證人？有遇到甚麼困難嗎？
              </h4>
              <SavedAnswer
                storageKey="witnessing-q1-d"
                placeholder="分享你在此三方面的個人反思與挑戰..."
              />
            </div>
          </QuestionCard>

          {/* Question 2 */}
          <QuestionCard
            number="2"
            title="太 10:32-33 試想神為何那麼重視我們要在人面前承認祂？你有否在人面前承認神？"
          >
            <ScriptureToggle scripture={witnessingScriptures.matt103233} />
            <SavedAnswer storageKey="witnessing-q2" />
          </QuestionCard>

          {/* Question 3 */}
          <QuestionCard
            number="3"
            title="約 9:25 這個開口作見證的人沒有特別學識和地位，也沒有接受過訓練，但他作了一個簡單而有力的見證。他講了哪兩件事？"
          >
            <ScriptureToggle scripture={witnessingScriptures.john925} />
            <SavedAnswer
              storageKey="witnessing-q3"
              placeholder="提示：講出之前和之後的改變..."
            />
          </QuestionCard>

          {/* Personal Testimony Guidance Card (Instruction block only - no answer box) */}
          <section className="rounded-[2rem] bg-surface-container-low p-6 border border-outline-variant/30 shadow-sm w-full">
            <div className="flex items-center gap-3 text-secondary">
              <Icon name="info" className="text-[22px]" />
              <p className="font-body text-[10px] font-extrabold tracking-[0.2em]">
                見證指引
              </p>
            </div>
            <h3 className="mt-4 font-headline text-[1.35rem] font-bold text-primary break-words">
              撰寫個人得救見證
            </h3>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant break-words">
              正如 約 9:25 的例子，講述個人得救的經歷是個有力的方法去見證神。請寫下你的得救見證，包括信主前的境況、信主的經過和信主後的改變三部分（見附件 A）。
            </p>
            <div className="mt-4 rounded-xl bg-surface/50 p-4 text-xs leading-5 text-on-surface-variant space-y-1 w-full">
              <p className="font-bold text-secondary">原則與要求：</p>
              <p>1. 要精簡，可在三至五分鐘內講完（約 300 至 500 字）。</p>
              <p>2. 重點是把主耶穌在你身上所做的告訴人，不要像講道一般教訓人。</p>
              <p>3. 儘量用第一人稱「我」而不是「你」或「我們」。</p>
              <p>4. 適當時可引用一兩節經文。要謙卑坦誠，真誠道出遭遇，不要誇張失實。</p>
            </div>
            <Link
              to="/journey/witnessing/personal-testimony"
              className="mt-5 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
            >
              開始填寫見證
              <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
          </section>

          {/* Question 4 */}
          <QuestionCard
            number="4"
            title="你認為在你身邊的人，誰可能是神會使用你的見證去幫助他們認識主耶穌？"
          >
            <SavedAnswer
              storageKey="witnessing-q4"
              placeholder="寫下他們的姓名或關係，並在心裡為他們代禱（例如：家人、好友、同事等）..."
            />
          </QuestionCard>
        </section>

        {/* Navigation Pager */}
        <section className="mt-8 w-full">
          <JourneyPager
            previous={{ to: '/journey/fellowship', label: '團契互助' }}
            next={{ to: '/journey/life-goal', label: '人生目的' }}
          />
        </section>
      </main>
    </>
  );
};
