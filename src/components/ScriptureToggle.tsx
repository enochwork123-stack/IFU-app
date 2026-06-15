import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from './Icon';
import type { ScriptureReference } from '../types/content';

interface ScriptureToggleProps {
  scripture: ScriptureReference;
}

export const ScriptureToggle: React.FC<ScriptureToggleProps> = ({ scripture }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, translateText } = useLanguage();

  if (!scripture) return null;

  // Localize book name
  const bookText = scripture.book ? translateText(scripture.book) : '';
  const refText = scripture.reference;

  // Localize Chinese verse
  const chineseText = scripture.chinese ? translateText(scripture.chinese) : '';
  const englishText = scripture.english || '';

  // Order based on language preference
  const showEnglishFirst = language === 'en';

  return (
    <div className="rounded-[1.45rem] border border-outline-variant/60 bg-surface-container-lowest">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left text-primary cursor-pointer w-full"
      >
        <span>
          {bookText && (
            <span className="block font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
              {bookText}
            </span>
          )}
          <span className="mt-1 block font-headline text-[1.15rem] leading-tight">
            {refText}
          </span>
        </span>
        <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="shrink-0 text-[24px] text-secondary" />
      </button>
      {isOpen ? (
        <div className="border-t border-outline-variant/50 px-4 pb-5 pt-4">
          {showEnglishFirst ? (
            <>
              {englishText && (
                <p className="text-sm font-medium leading-7 text-primary">
                  {englishText}
                </p>
              )}
              {chineseText && (
                <p className="mt-4 font-headline text-[1.05rem] leading-8 text-on-surface-variant">
                  {chineseText}
                </p>
              )}
            </>
          ) : (
            <>
              {chineseText && (
                <p className="font-headline text-[1.05rem] leading-8 text-primary">
                  {chineseText}
                </p>
              )}
              {englishText && (
                <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                  {englishText}
                </p>
              )}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};
export default ScriptureToggle;
