import React, { useEffect, useState, useRef } from 'react';

export interface SavedAnswerProps {
  storageKey: string;
  placeholder?: string;
  rows?: number;
}

/**
 * PRIVACY GUARD: This component stores user reflection input strictly on the client side
 * via window.localStorage. It must never be configured to sync or transmit this text
 * to any remote database to ensure absolute user privacy for sensitive thoughts.
 */
export const SavedAnswer: React.FC<SavedAnswerProps> = ({
  storageKey,
  placeholder = '在這裡輸入你的答案...',
  rows = 4,
}) => {
  const [answer, setAnswer] = useState('');
  const storageName = `ifu:${storageKey}`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const val = window.localStorage.getItem(storageName);
      setAnswer(val ?? '');
    } catch (e) {
      console.error('Error reading localStorage for key', storageName, e);
    }
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
    try {
      window.localStorage.setItem(storageName, nextAnswer);
    } catch (e) {
      console.error('Error writing localStorage for key', storageName, e);
    }
  };

  return (
    <label className="mt-4 block w-full">
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

export default SavedAnswer;
