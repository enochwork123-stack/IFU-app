import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';

const scriptureMap = {
  john112: {
    book: '約翰福音',
    reference: 'John 1:12',
    chinese: '凡接待他的，就是信他名的人，他就賜他們權柄，作神的兒女。',
  },
  james48: {
    book: '雅各書',
    reference: 'Jam 4:8',
    chinese: '你們親近神，神就必親近你們。',
    english: 'Draw near to God, and he will draw near to you.',
  },
  isa4031: {
    book: '以賽亞',
    reference: 'Isa 40:31',
    chinese: '但那等候耶和華的 , 必從新得力，他們必如鷹展翅上騰，他們奔跑卻不困倦，行走卻不疲乏。',
    english: 'But those who wait for the Lord shall renew their strength, they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.',
  },
  john155: {
    book: '約翰福音',
    reference: 'John 15:5',
    chinese: '我是葡萄樹，你們是枝子，常在我裡面的，我也常在他裡面，這人就多結果子，因為離了我，你們就不能作甚麼。',
    english: 'I am the vine, you are the branches. Those who abide in me and I in them bear much fruit, because apart from me you can do nothing.',
  },
  tim31617: { book: '提摩太後書', reference: '2Tim 3:16-17', chinese: '聖經都是神所默示的，於教訓、督責、使人歸正、教導人學義，都是有益的，叫屬神的人得以完全，預備行各樣的善事。' },
  john1624: { book: '約翰福音', reference: 'John 16:24', chinese: '向來你們沒有奉我的名求甚麼， 如今你們求就必得著，叫你們的喜樂可以滿足。', english: 'Until now you have not asked for anything in my name. Ask and you will receive, so that your joy may be complete.' },
  phil467: { book: '腓立比書', reference: 'Phil 4:6-7', chinese: '應當一無掛慮，只要凡事藉著禱告、祈求、和感謝，將你們所要的告訴神。 神所賜出人意外的平安，必在基督耶穌裡保守你們的心懷意念。', english: 'Do not worry about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.' },
  mark135: { book: '馬可福音', reference: 'Mark 1:35', chinese: '次日早晨，天未亮的時候，耶穌起來到曠野地方去，在那裡禱告。', english: 'In the morning, while it was still very dark, he got up and went out to a deserted place, and there he prayed.' },
};

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

function ScriptureToggle({ scriptureKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const scripture = scriptureMap[scriptureKey];

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
        <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="shrink-0 text-[24px] text-secondary" />
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
  const [showAppendix, setShowAppendix] = useState(false);

  return (
    <>
      <PageHeader title="靈修" backTo="/journey" />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-surface-container-low p-8 shadow-[0_22px_56px_rgba(40,53,28,0.1)]">
          <div className="mb-7 inline-flex rounded-full bg-primary-container px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-white">
            新生命栽培 : (2)
          </div>
          <h2 className="font-headline text-[2.45rem] leading-tight text-primary">
            靈修
          </h2>
        </section>

        <section className="mt-8 grid gap-5">
          <QuestionCard
            number="1"
            title="約翰福音 1:12 說 : 凡接待他的，就是信他名的人，他就賜他們權柄，作神的兒女。"
          >
            <ScriptureToggle scriptureKey="john112" />
            <p className="text-[1.05rem] leading-8 text-on-surface-variant">
              藉著接受耶穌基督的救贖，你已成為神的兒女，但對神的認識仍不夠深。神希望你與祂建立深厚的關係,認識祂的真理,活出敬虔的生命。
            </p>
            <p className="text-[1.05rem] leading-8 text-on-surface">
              從以下經文可見，親近神和遠離神的生活會帶來甚麼不同的結果？
            </p>
            <div className="grid gap-3">
              <ScriptureToggle scriptureKey="james48" />
              <ScriptureToggle scriptureKey="isa4031" />
              <ScriptureToggle scriptureKey="john155" />
            </div>
            <SavedAnswer storageKey="quiet-time-q1" />
          </QuestionCard>

          <section className="overflow-hidden rounded-[2rem] bg-primary text-white shadow-[0_26px_68px_rgba(40,53,28,0.22)]">
            <div className="p-7">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                <Icon name="auto_stories" className="text-[24px]" />
              </div>
              <h3 className="font-headline text-[1.8rem]">甚麼是「靈修」？</h3>
              <p className="mt-5 text-[1.05rem] leading-8 text-on-primary-container">
                「靈修」是指基督徒透過讀聖經和禱告親近神，與神溝通。有規律的靈修能幫助你與神建立更親密的關係，促進新生命成長。
              </p>
            </div>
          </section>

          <QuestionCard number="2" title="你可以透過讀聖經和禱告來親近神：">
            <div className="rounded-[1.55rem] bg-surface-container-low p-5">
              <h4 className="font-headline text-[1.25rem] leading-tight text-primary">
                (a) 聖經記載了甚麼？研讀聖經能給你甚麼幫助？ 提摩太後書 3:16-17
              </h4>
              <div className="mt-5">
                <ScriptureToggle scriptureKey="tim31617" />
              </div>
              <SavedAnswer storageKey="quiet-time-q2a" />
            </div>
            <div className="rounded-[1.55rem] bg-surface-container-low p-5">
              <h4 className="font-headline text-[1.25rem] leading-tight text-primary">
                (b) 什麼是禱告?你為什麼要向神禱告？ 約翰福音 16:24；腓立比書 4:6-7
              </h4>
              <div className="mt-5 grid gap-3">
                <ScriptureToggle scriptureKey="john1624" />
                <ScriptureToggle scriptureKey="phil467" />
              </div>
              <SavedAnswer storageKey="quiet-time-q2b" />
            </div>
          </QuestionCard>

          <QuestionCard number="3" title="從 馬可福音 1:35，可見主耶穌如何親近神：">
            <ScriptureToggle scriptureKey="mark135" />
            <div className="rounded-[1.55rem] bg-surface-container-low p-5">
              <h4 className="font-headline text-[1.25rem] leading-tight text-primary">
                時間、地方
              </h4>
              <SavedAnswer storageKey="quiet-time-q3-time-place" />
            </div>
            <div className="rounded-[1.55rem] bg-surface-container-low p-5">
              <h4 className="font-headline text-[1.25rem] leading-tight text-primary">
                方式、處境
              </h4>
              <SavedAnswer storageKey="quiet-time-q3-method-context" />
            </div>
          </QuestionCard>

          <QuestionCard number="4" title="聖經書卷目錄與縮寫見 附件A">
            <button
              type="button"
              onClick={() => setShowAppendix((current) => !current)}
              className="inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
            >
              附件A : 聖經書卷目錄與縮寫
              <Icon name={showAppendix ? 'expand_less' : 'expand_more'} className="text-[18px]" />
            </button>
            {showAppendix ? (
              <div className="mt-5 grid gap-4">
                <BookTable
                  title="舊約聖經書卷 (共39)"
                  rows={oldTestamentRows}
                />
                <BookTable
                  title="新約聖經書卷 (共27)"
                  rows={newTestamentRows}
                />
              </div>
            ) : null}
            <SavedAnswer storageKey="quiet-time-q4" />
          </QuestionCard>

          <section className="rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <div className="flex items-center gap-3 text-secondary">
              <Icon name="extension" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                延伸學習
              </p>
            </div>
            <h3 className="mt-4 font-headline text-[1.55rem] leading-tight text-primary">
              《靈修》延伸學習 (A) : 七分鐘與神獨處
            </h3>
            <Link
              to="/journey/quiet-time/seven-minutes-with-god"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
            >
              開始延伸學習
              <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
          </section>

          <section className="rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <div className="flex items-center gap-3 text-secondary">
              <Icon name="extension" className="text-[22px]" />
              <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
                延伸學習
              </p>
            </div>
            <h3 className="mt-4 font-headline text-[1.55rem] leading-tight text-primary">
              《靈修》延伸學習 (B) : If Quiet Time is New to You
            </h3>
            <Link
              to="/journey/quiet-time/new-to-you"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-extrabold tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
            >
              開始延伸學習
              <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
          </section>
        </section>

        <section className="mt-8">
          <JourneyPager
            previous={{ to: '/journey/salvation-assurance', label: '得救的確據' }}
            next={{ to: '/journey', label: '返回目錄' }}
          />
        </section>
      </main>
    </>
  );
}
