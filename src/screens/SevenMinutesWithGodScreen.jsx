import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';

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
    <textarea
      value={answer}
      onChange={handleChange}
      rows={3}
      className="mt-4 min-h-24 w-full resize-y rounded-[1.2rem] border border-outline-variant bg-white/70 p-4 text-base leading-7 text-on-surface outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
      placeholder="在這裡輸入你的答案..."
    />
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
    <blockquote className="rounded-[1.45rem] border-l-4 border-l-secondary bg-secondary-fixed/30 p-5 font-headline text-[1.12rem] leading-8 text-primary">
      {children}
    </blockquote>
  );
}

const reflectionPrompts = [
  '試想你若每天與神獨處，比較沒有這樣做，會如何影響你與神的關係？',
  '你有把握能建立每天與神獨處的習慣嗎？你會如何付諸行動去開始每天靈修？',
  '劍橋七傑的生命，給了你什麼啟發？',
];

const actsSteps = [
  '崇拜 (A - Adoration)：這是最純潔的禱告，因這全是為上帝的——這其中沒有一點是為自己的。若有王族在場你不會冒失的闖到他面前而會以致敬為見面禮。同樣的對於上帝，你要敬拜祂，首先告訴他你愛祂，再頌讚祂的偉大，祂的大能，祂的榮耀及祂的主權。',
  '認罪 (C - Confession)：見了面後，現在要確定每一個罪都被潔淨和離棄。認罪的原意就是「二者同意」的意思。在禱告中，認罪，就是同意神的看法。昨天發生的事，你說是小小的誇大，上帝却說是謊言；你說是激語，上帝却說是賭誓；你說是針對另一會友發表個人的意見，上帝却說是搬弄是非。「我若心裏注重罪孽，主必不聽。」（詩66:18）',
  '謝恩 (T - Thanksgiving)：表示你對上帝的感激，想出一些明確的事件感激上帝：你的家庭，事業，教會，事奉；也為困難的時刻感謝上帝。「凡事謝恩，因為這是神在基督耶穌裏向你們所定的旨意。」（帖前5:18）',
  '祈求 (S - Supplication)：「懇切，謙卑的求」這是禱告中的祈求部份：向上帝陳明你所需要的。先向别人代求再為自己求，為傳道人，為國外的留學生，為遠方的朋友代禱，最重要的是為那些沒有聽過耶穌基督福音的人禱求。',
];

const sevenMinuteRows = [
  ['祈求上帝引導（詩篇 143:8）', '1/2 分鐘'],
  ['讀經（詩篇 119:18）', '4 分鐘'],
  ['禱告\n◦ 崇拜（歷代志上 29:10-11）\n◦ 認罪（約翰一書 1:9）\n◦ 謝恩（以弗所書 5:20）\n◦ 祈求（馬太福音 7:7）', '2 1/2 分鐘'],
];

const sevenNames = [
  'Charles Thomas Studd',
  'Montagu Harry Proctor Beauchamp',
  'Stanley P. Smith',
  'Arthur T. Polhill-Turner',
  'Dixon Edward Hoste',
  'Cecil H. Polhill-Turner',
  'William Wharton Cassels',
];

const ministryNotes = [
  'William Wharton Cassels worked in China for ten years and then returned to England in 1895 where he was consecrated as the new Bishop of a new diocese in Western China. He then returned to Western China – he lived there until his death in 1925.',
  'Stanley Peregrine Smith was sent to North China. Here he learned Chinese language and soon became as fluent a preacher in Chinese as he was in English. He died in China on 31 January 1931.',
  'Charles Studd, one of the famous Studd brothers, who was before his missionary work well known as an England cricketer – having played in the famous Ashes series against Australia, was probably the best known of the Cambridge Seven. He was sent home because of ill health in 1894. Later, he worked in India and Africa and was the founder of World Evangelisation for Christ (WEC International). He died in 1931.',
  'Arthur T. Polhill-Turner was ordained as a minister in 1888 and moved to the densely populated countryside of China to reach as many people as he could. He remained in China throughout the uprisings against foreigners at the turn of the century and did not leave there until 1928, when he retired and returned to England. He died in 1935.',
  'Cecil H. Polhill-Turner stayed in the same province with the others for a while before moving to the northwest, in the direction of Tibet. During a violent riot there he and his wife were both nearly killed in 1892. In 1900, his health failed, and he was sent home to England where he was strongly advised against a return to China. Despite this ban, his heart remained there and throughout the rest of his life, he made seven prolonged missionary visits. In 1908, in Sunderland, he became the leader of the Pentecostal Missionary Union and was greatly used in the formation of the Pentecostal Movement in Britain. He died in England in 1938.',
  'Montagu Harry Proctor Beauchamp was evacuated from China in 1900 because of the uprisings but returned again to China in 1902. He then returned again to England in 1911 and served as a chaplain with the British Army. His son became a second-generation missionary in China. In 1935, he went back to China. He died at his son\'s mission station in 1939.',
  'Dixon Hoste was the only one of the Cambridge Seven who was not educated at Cambridge. He succeeded Hudson Taylor as the Director of the CIM and for thirty years, he led the Mission. He retired in 1935 but remained in China until 1945, when he was interned by the Japanese. He died in London in May 1946 and was the last remaining member of the Cambridge Seven to die.',
];

export function SevenMinutesWithGodScreen() {
  return (
    <>
      <PageHeader title="七分鐘與神獨處" backTo="/journey/quiet-time" />

      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《靈修》延伸學習 (A)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            七分鐘與神獨處
          </h1>
          <p className="mt-5 text-sm leading-7 text-on-primary-container">
            Source: Adapted from "Seven Minutes with God: How To Plan a Daily Quiet Time" by Robert Foster, “Wikipedia”, and “The Evangelisation of the World: A Missionary Band”
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
          <h2 className="font-headline text-[1.55rem] text-primary">
            閱讀以下文章，並思考 :
          </h2>
          <div className="mt-5 grid gap-4">
            {reflectionPrompts.map((prompt, index) => (
              <article key={prompt} className="rounded-[1.45rem] bg-white p-5">
                <p className="font-headline text-[1.1rem] leading-8 text-primary">
                  {index + 1}. {prompt}
                </p>
                <SavedAnswer storageKey={`seven-minutes-reflection-${index + 1}`} />
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <ArticleSection title="1. 晨更的緣起與挑戰">
            <QuoteBlock>1882年，劍橋大學在其校園裏首次給世界興起這個口號：記得守晨更 (morning watch)。</QuoteBlock>
            <p>一些像胡伯和東登的學生發覺他們的日子受到功課，講章，運動和競爭的壓力，生活被狂熱與活動佔有了。這一羣虔誠的信徒不久就看出他們的靈性受到威脅，若不及時援救將會達到不可收拾的地步。</p>
            <p>他們在自我分析後所得的結論就是要守晨更：一個利用每個新的一天的首幾分鐘單獨與神同在讀經禱告的計劃。</p>
            <QuoteBlock>這個主意像點火燎原，原火燃燒的高潮在於七位劍橋的學生 (the Cambridge Seven 劍橋七傑) —— 特出的運動員及富有才華的學者，獻身做宣教，差傳的工作。他們丟下一切到中國為基督傳福音，這是一段值得注意的敎會興起的時期。</QuoteBlock>
            <p>但這一羣人也同時發覺到，要能及時起床守晨更，其困難性與重要性互相媲美。其中的東登決心要把懶惰改成紀律。他設計出一個自動而有効醫治懶惰的秘方：他在床邊安置了一新奇的機械，設計「利用鬧鐘的震動力，發動釣魚竿上的線，把上了鈎的被單吊上半空，遠離睡者」。東登要起身會見他的上帝啊！</p>
          </ArticleSection>

          <ArticleSection title="2. 與神獨處的重要性">
            <p>與上帝親密的交通，必需在每日晨更中重新得到。不論你如何稱呼：那安靜的時刻，個人靈修，晨更，或單獨崇拜 ……。這清晨的神聖幾分鐘解釋了基督教信仰的奧密。它有如一條聯繫被上帝使用的人的金錢，從摩西到大衛利賓士頓 (David Livingstone)；從先知阿摩司到葛培理，富有者與貧窮者，商人與軍人，任何被主重用的人都重視這段時間：與神獨處的時刻。</p>
            <p>大衛在詩57:7說「上帝啊，我心堅定，我心堅定。」一個堅定的心能促成生命的穩定。很少信徒有這樣的心志和生命。其中所缺乏的就是一個「怎樣開始並維持晨更」的計劃。</p>
          </ArticleSection>

          <ArticleSection title="3. 開始你的七分鐘計劃">
            <p>我建議你從七分鐘開始，五分鐘可能太短，十分鐘對初學者可能顯得太長。你願意抽出每早晨的七分鐘嗎？不是七天內的五個早晨，也不是六天裏的六個早晨，而是七天裏的七個早晨！ 祈求上帝幫助你：「上帝啊！我要在每早晨抽出最少七分鐘與你相會，明天鬧鐘在六點十五分响時，我要對你守約。」</p>
            <p>或許你的禱告是這樣的：「耶和華啊！早晨祢必聽我的聲音，早晨我必向祢陳明我的心意，並要儆醒。」（詩5:3）你要怎樣利用這七分鐘呢？起床料理一番後，找一個肅靜的地方，預備好一本聖經，在那兒享受與神獨處的七分鐘 。</p>
            <h3 className="font-headline text-[1.3rem] text-primary">第一階段：預備心（半分鐘）</h3>
            <p>用前三十秒來預備你的心，感謝祂賜你好睡眠，也為新的一天稱謝。</p>
            <p>禱告：「耶和華，潔淨我的心，用祢的道指教我，打開我的心，充滿我心，使我的頭腦清醒，我的靈魂活躍，我的心回應。耶和華啊，此刻以祢的同在圍繞我，阿門」。</p>
            <h3 className="font-headline text-[1.3rem] text-primary">第二階段：讀經（四分鐘）</h3>
            <p>現在用四分鐘讀經，你最大的需要是要聆聽上帝對你說的話，讓祂的道在你的心着火，會見它的作者！ 從福音書着手是比較適合的。從馬可福音開始，一節又一節，一章又一章地唸下去。勿貪快，但也避免鑽牛角尖。勿暫停的研究或查考聖經中的一些字句，思想或問題。讓這時的讀經成為一個暢讀的喜樂，並讓神向你說話。或許一次只唸廿節或一章，當你唸完馬可福音再向約翰福音下手。不久你會順利的唸完整個新約。</p>
            <h3 className="font-headline text-[1.3rem] text-primary">第三階段：禱告（兩分半鐘）</h3>
            <p>當神已藉着聖經向你說話後，你可藉着禱告向祂說話。你現在還有兩分鐘時間可與祂交通，禱告可順以下四個步驟進行：</p>
            <ol className="space-y-3">
              {actsSteps.map((step) => (
                <li key={step} className="rounded-[1.2rem] bg-surface-container-low p-4">
                  {step}
                </li>
              ))}
            </ol>
          </ArticleSection>

          <ArticleSection title="4. 七分鐘流程總結">
            <p>讓我們把這七分鐘簡列如下：</p>
            <div className="overflow-hidden rounded-[1.3rem] bg-surface-container-low">
              <table className="w-full border-collapse text-left">
                <tbody>
                  {sevenMinuteRows.map(([activity, time]) => (
                    <tr key={activity} className="border-t border-outline-variant/45 first:border-t-0">
                      <td className="whitespace-pre-line px-4 py-4 text-primary">{activity}</td>
                      <td className="w-24 px-4 py-4 font-extrabold text-secondary">{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ArticleSection>

          <ArticleSection title="5. 結語與立約">
            <p>七分鐘晨更法不是一成不變的規條，乃是一個指南。不久你會發覺七分鐘的不足，逐漸你會增加到20分鐘，甚至30分鐘的寶貴時刻與上帝獨處，不要忠心於習慣而忠心於上帝。</p>
            <p>不要因别人如此行，你也照做。它不是無味的任務，也不是最終的目的，而是上帝已賜給這最寶貴的交通機會。現在就與神立約維護，培養並維持你七分鐘的晨更。</p>
          </ArticleSection>

          <ArticleSection title="The Cambridge Seven 劍橋七傑">
            <h3 className="font-headline text-[1.25rem] text-primary">The Seven Students Who Became Missionaries to China</h3>
            <p>The Cambridge Seven (劍橋七傑) were seven students from Cambridge University and one from the Royal Military Academy. In 1885, they gave up all wealth and privilege to become missionaries to China through the China Inland Mission (中國內地會 ; now known as The Overseas Missionary Fellowship 海外基督使團).  The seven were:</p>
            <ul className="grid gap-2">
              {sevenNames.map((name) => (
                <li key={name} className="rounded-full bg-surface-container-low px-4 py-2 text-sm font-bold text-primary">
                  {name}
                </li>
              ))}
            </ul>
            <p className="rounded-[1.2rem] bg-surface-container-low p-4 text-sm">The Cambridge Seven in Chinese clothing in 1885.</p>
            <p className="rounded-[1.2rem] bg-surface-container-low p-4 text-sm">Record of the Cambridge Seven’s departure for China, extracted from "The Evangelisation of the World: A Missionary Band".</p>
            <h3 className="font-headline text-[1.25rem] text-primary">Preparation in Britain</h3>
            <p>Having been accepted as missionaries by Hudson Taylor (戴德生) of the China Inland Mission (CIM), the seven were scheduled to leave for China in early February 1885.  Before leaving, the seven held a farewell tour to spread the message across the country – it was during this tour that someone dubbed them "The Cambridge Seven".</p>
            <p>For the next month, the seven toured the University campuses of England and Scotland, holding meetings for the students.  The record of their departure is documented in the book  "The Evangelisation of the World: A Missionary Band".  It became a national bestseller.  Their influence extended to America where it led to the formation of Robert Wilder's Student Volunteer Movement (學生志願運動) .  Even Queen Victoria was pleased to receive the book and hear their testimonies.</p>
            <p>All seven had become born-again Christians and were moved by God to go to China in 1885 to spread their faith and to help the Chinese.  Most remained in or connected to missionary work for the rest of their lives.  They were greatly influenced by Taylor's book "China's Spiritual Need and Claims".  After their acceptance into the CIM, the seven toured England and Scotland, preaching and appealing to their listeners to follow their example and follow Christ.  Charles Studd's brother, Kynaston, helped the seven in their preparations for departure.</p>
            <h3 className="font-headline text-[1.25rem] text-primary">Life and Ministry</h3>
            <p>The conversion and example of the seven was one of the grand gestures of 19th century missions, making them religious forerunners.  As a result, their story was published as "The Evangelisation of the World: A Missionary Band" and was distributed to every YMCA and YWCA throughout the British Empire and the United States.</p>
            <p>Although their time together was brief, they helped catapult the CIM from obscurity to prominence, and their work helped to inspire many recruits for the CIM and other mission societies.  In 1885, when the Seven first arrived in China, the CIM had 163 missionaries.  This had doubled by 1890 and reached some 800 by 1900, which represented one-third of the entire Protestant missionary force.</p>
            <p>The Cambridge Seven arrived in Shanghai on 18 March 1885 and served in a variety of ministries throughout China:</p>
            <ul className="space-y-3">
              {ministryNotes.map((note) => (
                <li key={note} className="rounded-[1.2rem] bg-surface-container-low p-4 text-sm leading-7">
                  {note}
                </li>
              ))}
            </ul>
          </ArticleSection>
        </div>

        <section className="mt-8">
          <JourneyPager previous={{ to: '/journey/quiet-time', label: '靈修' }} />
        </section>
      </main>
    </>
  );
}
