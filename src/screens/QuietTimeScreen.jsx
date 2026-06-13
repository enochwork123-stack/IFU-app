import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';
import { useAppContent } from '../context/ContentContext';

const oldTestamentBooks =
  '創 創世紀 Genesis; 出 出埃及記 Exodus; 利 利未記 Leviticus; 民 民數記 Numbers; 申 申命記 Deuteronomy; 書 約書亞記 Joshua; 士 士師記 Judges; 得 路得記 Ruth; 撒上 撒母耳記上 1 Samuel; 撒下 撒母耳記下 2 Samuel; 王上 列王記上 1 Kings; 王下 列王記下 2 Kings; 代上 歷代志上 1 Chronicles; 代下 歷代志下 2 Chronicles; 拉 以斯拉記 Ezra; 尼 尼希米記 Nehemiah; 斯 以斯帖記 Esther; 伯 約伯記 Job; 詩 詩篇 Psalms; 箴 箴言 Proverbs; 傳 傳道書 Ecclesiastes; 歌 雅歌 Song of Songs; 賽 以賽亞書 Isaiah; 耶 耶利米書 Jeremiah; 哀 耶利米哀歌 Lamentations; 結 以西結書 Ezekiel; 但 但以理書 Daniel; 何 何西阿書 Hosea; 珥 約珥書 Joel; 摩 阿摩司書 Amos; 俄 俄巴底亞書 Obadiah; 拿 約拿書 Jonah; 彌 彌迦書 Micah; 鴻 那鴻書 Nahum; 哈 哈巴谷書 Habakkuk; 番 西番雅書 Zephaniah; 該 哈該書 Haggai; 亞 撒迦利亞 Zechariah; 瑪 瑪拉基書 Malachi';

const newTestamentBooks =
  '太 馬太福音 Matthew; 可 馬可福音 Mark; 路 路加福音 Luke; 約 約翰福音 John; 徒 使徒行傳 Acts; 羅 羅馬書 Romans; 林前 歌林多前書 1 Corinthians; 林後 歌林多後書 2 Corinthians; 加 加拉太書 Galatians; 弗 以弗所書 Ephesians; 腓 腓立比書 Philippians; 西 歌羅西書 Colossians; 帖前 帖撒羅尼迦前書 1 Thessalonians; 帖後 帖撒羅尼迦後書 2 Thessalonians; 提前 提摩太前書 1 Timothy; 提後 提摩太後書 2 Timothy; 多 提多書 Titus; 門 腓利門書 Philemon; 來 希伯來書 Hebrews; 雅 雅各書 James; 彼前 彼得前書 1 Peter; 彼後 彼得後書 2 Peter; 約壹 約翰一書 1 John; 約貳 約翰二書 2 John; 約參 約翰三書 3 John; 猶 猶大書 Jude; 啟 啟示錄 Revelation';

function parseBookRows(bookList) {
  return bookList.split('; ').map((item) => {
    const [abbr, ...nameParts] = item.split(' ');
    const englishStart = nameParts.findIndex((part) => /^[0-9A-Za-z]/.test(part));
    return {
      abbr,
      chinese: nameParts.slice(0, englishStart).join(' '),
      english: nameParts.slice(englishStart).join(' '),
    };
  });
}

const oldTestamentRows = parseBookRows(oldTestamentBooks);
const newTestamentRows = parseBookRows(newTestamentBooks);

function SavedAnswer({ storageKey }) {
  const [answer, setAnswer] = useState('');
  const storageName = `ifu:${storageKey}`;

  useEffect(() => {
    setAnswer(window.localStorage.getItem(storageName) ?? '');
  }, [storageName]);

  function handleChange(event) {
    setAnswer(event.target.value);
    window.localStorage.setItem(storageName, event.target.value);
  }

  return (
    <label className="mt-5 block">
      <span className="sr-only">你的答案</span>
      <textarea
        value={answer}
        onChange={handleChange}
        rows={4}
        className="min-h-28 w-full resize-y rounded-[1.25rem] border border-outline-variant bg-surface-container-low/55 p-4 text-base leading-7 text-on-surface outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
        placeholder="在這裡輸入你的答案..."
      />
      <span className="mt-2 block text-right text-[11px] font-bold tracking-[0.12em] text-on-surface-variant/55">
        已自動儲存
      </span>
    </label>
  );
}

function ScriptureToggle({ scripture }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!scripture) return null;

  return (
    <div className="rounded-[1.45rem] border border-outline-variant/60 bg-surface-container-lowest">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left text-primary"
      >
        <span>
          {scripture.book && (
            <span className="block font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
              {scripture.book}
            </span>
          )}
          <span className="mt-1 block font-headline text-[1.15rem] leading-tight">
            {scripture.reference}
          </span>
        </span>
        <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="shrink-0 text-[24px] text-secondary" />
      </button>
      {isOpen ? (
        <div className="border-t border-outline-variant/50 px-4 pb-5 pt-4">
          <p className="font-headline text-[1.05rem] leading-8 text-primary">
            {scripture.chinese}
          </p>
          {scripture.english && (
            <p className="mt-4 text-sm leading-7 text-on-surface-variant">
              {scripture.english}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function BookTable({ title, rows }) {
  return (
    <div className="overflow-hidden rounded-[1.4rem] bg-surface-container-low shadow-inner shadow-primary/5">
      <div className="bg-primary px-4 py-3">
        <h4 className="font-headline text-[1.25rem] text-white">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[24rem] border-collapse text-left">
          <thead>
            <tr className="bg-surface-container text-[11px] font-extrabold tracking-[0.14em] text-secondary">
              <th className="w-16 px-4 py-3">縮寫</th>
              <th className="px-4 py-3">中文書名</th>
              <th className="px-4 py-3">English</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((book, index) => (
              <tr
                key={`${book.abbr}-${book.english}`}
                className={index % 2 === 0 ? 'bg-white/72' : 'bg-surface/48'}
              >
                <td className="border-t border-outline-variant/45 px-4 py-3 font-headline text-lg font-black text-secondary">
                  {book.abbr}
                </td>
                <td className="border-t border-outline-variant/45 px-4 py-3 font-semibold text-primary">
                  {book.chinese}
                </td>
                <td className="border-t border-outline-variant/45 px-4 py-3 text-sm font-medium text-on-surface-variant">
                  {book.english}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function QuietTimeScreen() {
  const { lessonRoutes } = useAppContent();
  const [showAppendix, setShowAppendix] = useState(false);

  const activeLesson = lessonRoutes.find((r) => r.id === 'lesson-quiet-time');

  if (!activeLesson) {
    return (
      <div className="p-12 text-center text-on-surface-variant font-bold">
        加載中或無此課程...
      </div>
    );
  }

  // Helper to map card styling from presets
  const getCardStyle = (accent) => {
    if (accent === 'primary') {
      return 'bg-primary text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)] p-8 rounded-[2.35rem] relative overflow-hidden';
    }
    if (accent === 'secondary') {
      return 'bg-secondary text-white shadow-[0_28px_72px_rgba(121,89,0,0.22)] p-8 rounded-[2.35rem] relative overflow-hidden';
    }
    if (accent === 'tertiary') {
      return 'bg-surface-container-low p-6 rounded-[2rem] text-primary border border-outline-variant/50 shadow-[0_18px_42px_rgba(40,53,28,0.08)]';
    }
    return 'bg-surface-container-lowest p-6 rounded-[2rem] text-primary border border-outline-variant/30 shadow-[0_18px_42px_rgba(40,53,28,0.08)]';
  };

  return (
    <>
      <PageHeader title={activeLesson.title} backTo="/journey" />

      <main className="px-6 pb-36 pt-8 flex flex-col items-center">
        <div className="w-full space-y-8 flex flex-col items-center">
          {activeLesson.modules.map((mod) => {
            const cardTheme = mod.visual?.accent || 'surface';
            const cardStyle = getCardStyle(cardTheme);
            const sizeClass = mod.visual?.imageStyle || 'max-w-2xl';
            const heightClass = mod.visual?.eyebrow || 'min-h-auto';

            return (
              <section
                key={mod.id}
                className={`w-full ${sizeClass} ${heightClass} ${cardStyle}`}
              >
                {/* Visual ambient gradients for primary green cards */}
                {cardTheme === 'primary' && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)] pointer-events-none" />
                )}

                {/* Card Title Header */}
                {mod.title && mod.kind !== 'extension-card' && mod.kind !== 'appendix' && (
                  <div className={`flex items-center gap-3 mb-5 ${cardTheme === 'primary' ? 'text-secondary-fixed-dim' : 'text-secondary'}`}>
                    {mod.kind === 'reflection-prompt' && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed font-body text-sm font-extrabold text-on-secondary-fixed">
                        {mod.number || 'Q'}
                      </span>
                    )}
                    <h3 className={`font-headline text-[1.45rem] leading-tight ${cardTheme === 'primary' ? 'text-white font-black' : 'text-primary'}`}>
                      {mod.title}
                    </h3>
                  </div>
                )}

                {/* Render different kinds of study modules */}
                {mod.kind === 'content-section' && (
                  <div className="relative">
                    {mod.body && (
                      <p className={`text-[1.08rem] leading-8 ${cardTheme === 'primary' ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                        {mod.body}
                      </p>
                    )}
                    {mod.scriptures && (
                      <div className="mt-5 grid gap-3">
                        {mod.scriptures.map((sc, sIdx) => (
                          <ScriptureToggle key={sIdx} scripture={sc} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {mod.kind === 'reflection-prompt' && (
                  <div className="relative">
                    <p className="text-[1.05rem] leading-8 text-on-surface">{mod.prompt}</p>
                    {mod.scriptures && (
                      <div className="mt-5 grid gap-3">
                        {mod.scriptures.map((sc, sIdx) => (
                          <ScriptureToggle key={sIdx} scripture={sc} />
                        ))}
                      </div>
                    )}
                    <SavedAnswer storageKey={mod.storageKey} />
                  </div>
                )}

                {mod.kind === 'appendix' && (
                  <div className="relative">
                    <div className="flex items-center gap-3 text-secondary">
                      <Icon name="article" className="text-[22px]" />
                      <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                        {mod.title || '附件'}
                      </p>
                    </div>
                    <h2 className="mt-4 font-headline text-[1.8rem] text-primary">
                      {mod.title || '附件'}
                    </h2>
                    {mod.body && (
                      <p className="mt-4 leading-7 text-on-surface-variant">
                        {mod.body}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowAppendix(true)}
                      className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95 cursor-pointer"
                    >
                      查看附件
                      <Icon name="open_in_full" className="text-[18px]" />
                    </button>
                  </div>
                )}

                {mod.kind === 'extension-card' && (
                  <div className="relative">
                    <div className="flex items-center gap-3 text-secondary">
                      <Icon name="extension" className="text-[22px]" />
                      <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                        延伸學習
                      </p>
                    </div>
                    <h3 className="mt-4 font-headline text-[1.55rem] leading-tight text-primary">
                      {mod.title}
                    </h3>
                    {mod.description && (
                      <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                        {mod.description}
                      </p>
                    )}
                    <Link
                      to={mod.route}
                      className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
                    >
                      開始延伸學習
                      <Icon name="arrow_forward" className="text-[18px]" />
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <section className="mt-8 w-full max-w-2xl">
          <JourneyPager
            previous={{ to: '/journey/salvation-assurance', label: '得救的確據' }}
            next={{ to: '/journey/prayer-assurance', label: '禱告的確據' }}
          />
        </section>
      </main>

      {showAppendix ? (
        <div className="fixed inset-0 z-50 bg-black/45 px-4 py-6 backdrop-blur-sm">
          <div className="mx-auto flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-surface shadow-[0_28px_80px_rgba(20,25,18,0.32)] border border-outline-variant/60">
            <div className="flex items-start justify-between gap-4 border-b border-outline-variant/50 bg-surface-container-lowest p-5">
              <div>
                <p className="font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
                  附件A
                </p>
                <h2 className="mt-1 font-headline text-[1.55rem] leading-tight text-primary">
                  聖經書卷目錄與縮寫
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAppendix(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary transition-all active:scale-95"
                aria-label="關閉附件"
              >
                <Icon name="close" className="text-[22px]" />
              </button>
            </div>
            <div className="overflow-y-auto p-5 bg-surface-container-lowest/30">
              <div className="grid gap-6">
                <BookTable
                  title="舊約聖經書卷 (共39)"
                  rows={oldTestamentRows}
                />
                <BookTable
                  title="新約聖經書卷 (共27)"
                  rows={newTestamentRows}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
