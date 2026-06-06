import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';

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

interface SavedInputProps {
  storageKey: string;
  label: string;
  placeholder?: string;
}

const SavedInput: React.FC<SavedInputProps> = ({
  storageKey,
  label,
  placeholder = '',
}) => {
  const [value, setValue] = useState('');
  const storageName = `ifu:${storageKey}`;

  useEffect(() => {
    setValue(window.localStorage.getItem(storageName) ?? '');
  }, [storageName]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    window.localStorage.setItem(storageName, nextValue);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-bold text-secondary uppercase tracking-wider">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-low/55 p-3 text-base text-on-surface outline-none transition focus:border-secondary focus:bg-white"
      />
    </div>
  );
};

export const PersonalTestimonyScreen: React.FC = () => {
  return (
    <>
      <PageHeader title="我的個人得救見證" backTo="/journey/witnessing" />
      <main className="px-6 pb-36 pt-8 w-full overflow-x-hidden">
        {/* Banner */}
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)] w-full">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《見證主》附件 A
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight font-bold">
            我的個人得救見證
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            講述個人得救的經歷是個有力的方法去見證神。請寫下你的得救見證。
          </p>
        </section>

        {/* Form Worksheet Container */}
        <section className="mt-8 rounded-[2rem] bg-surface-container-low p-6 border border-outline-variant/40 shadow-sm space-y-6 w-full">
          <div className="flex items-center gap-3 text-secondary">
            <Icon name="assignment" className="text-[22px]" />
            <h2 className="font-headline text-[1.45rem] font-bold text-primary">
              得救見證工作表
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <SavedInput storageKey="witnessing-profile-name" label="姓名" placeholder="你的姓名" />
            <SavedInput storageKey="witnessing-profile-date" label="信主日期" placeholder="YYYY-MM-DD" />
          </div>

          <hr className="border-outline-variant/40" />

          <div className="space-y-6 w-full">
            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/20">
              <h3 className="text-base font-bold text-primary mb-2">1. 信主前的境況</h3>
              <p className="text-xs text-on-surface-variant leading-5 mb-3 break-words">
                當時的處境，生活方式，價值觀或人生所追求的事物等，以帶出信主的背景和在罪裡的情況，例如心中沒有平安、生命沒有意義、被罪綑綁等。這也有助聽者思考他的境況。
              </p>
              <SavedAnswer storageKey="witnessing-profile-before" placeholder="我信主前..." rows={5} />
            </div>

            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/20">
              <h3 className="text-base font-bold text-primary mb-2">2. 信主的經過</h3>
              <p className="text-xs text-on-surface-variant leading-5 mb-3 break-words">
                你如何接觸、了解和接受福音，決志悔改，成為基督徒。藉此部分，你可扼要地解釋福音的內容。這也有助聽者知道如何得到神的拯救。
              </p>
              <SavedAnswer storageKey="witnessing-profile-process" placeholder="後來我..." rows={5} />
            </div>

            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/20">
              <h3 className="text-base font-bold text-primary mb-2">3. 信主後的改變</h3>
              <p className="text-xs text-on-surface-variant leading-5 mb-3 break-words">
                你在信主後的重要轉變，例如對罪惡的態度，生活的方式，人生的目標，神給你的引領與幫助等。可與信主前的境況作對比，也可助聽者了解基督徒的生活是怎樣的。
              </p>
              <SavedAnswer storageKey="witnessing-profile-after" placeholder="信主後，我現在..." rows={5} />
            </div>
          </div>
        </section>

        {/* Navigation Pager */}
        <section className="mt-8 w-full">
          <JourneyPager
            previous={{ to: '/journey/witnessing', label: '見證主' }}
          />
        </section>
      </main>
    </>
  );
};
