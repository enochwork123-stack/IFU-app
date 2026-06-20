import React, { useEffect, useState, useRef } from 'react';

export interface FillInTheBlankProps {
  storageKey: string;
  prefixText: string;
  placeholder?: string;
}

/**
 * PRIVACY GUARD: This component stores user reflection input strictly on the client side
 * via window.localStorage. It must never be configured to sync or transmit this text
 * to any remote database to ensure absolute user privacy for sensitive thoughts.
 */
export const FillInTheBlank: React.FC<FillInTheBlankProps> = ({
  storageKey,
  prefixText,
  placeholder = '填入答案...',
}) => {
  const [value, setValue] = useState('');
  const storageName = `ifu:${storageKey}`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const val = window.localStorage.getItem(storageName);
      setValue(val ?? '');
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
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    try {
      window.localStorage.setItem(storageName, nextValue);
    } catch (e) {
      console.error('Error writing localStorage for key', storageName, e);
    }
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
        <span className="text-[9px] font-bold text-on-surface-variant/40 text-right uppercase tracking-wider block">
          已自動儲存
        </span>
      </div>
    </div>
  );
};

export default FillInTheBlank;
