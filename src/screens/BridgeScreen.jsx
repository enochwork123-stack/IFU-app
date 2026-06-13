import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';
import { ScriptureCard } from '../components/ScriptureCard';
import { useAppContent } from '../context/ContentContext';
import { assetPath } from '../utils/assets';

const bridgeVerses = [
  {
    reference: '羅馬書 5:8',
    verse:
      '惟有基督在我們還作罪人的時候為我們死，神的愛就在此向我們顯明了。',
  },
  {
    reference: '哥林多前書 15:3-6',
    verse:
      '基督照聖經所說，為我們的罪死了，而且埋葬了，又照聖經所說，第三天復活了，並且顯給磯法看，然後顯給十二使徒看，後來一時顯給五百多弟兄看。',
  },
  {
    reference: '彼得前書 3:18',
    verse:
      '因基督也曾一次為罪受苦，就是義的代替不義的，為要引我們到神面前。按著肉體說，他被治死；按著靈性說，他復活了。',
  },
];

const responseVerses = [
  {
    reference: '約翰福音 1:12',
    verse: '凡接待他的，就是信他名的人，他就賜他們權柄，作神的兒女。',
  },
  {
    reference: '約翰福音 5:24',
    verse:
      '我實實在在地告訴你們：那聽我話、又信差我來者的，就有永生，不至於定罪，是已經出死入生了。',
  },
];

export function BridgeScreen() {
  return (
    <>
      <PageHeader title="神的拯救" backTo="/journey/problem" />

      <main className="px-6 pb-36 pt-8">
        <section className="overflow-hidden rounded-[2.35rem] bg-surface-container-low p-2 shadow-[0_30px_74px_rgba(40,53,28,0.16)]">
          <figure className="overflow-hidden rounded-[2.15rem] bg-[#1b1c1a]">
            <img
              src={assetPath('assets/神的拯救.png')}
              alt="起死回生的橋梁"
              className="ifu-diagram-image h-auto w-full object-contain object-center"
            />
          </figure>
        </section>

        <section className="mt-6 rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
          <div className="flex items-center gap-3 text-secondary">
            <Icon name="menu_book" className="text-[20px]" />
            <p className="font-body text-[11px] font-extrabold tracking-[0.22em]">
              神拯救人的計劃
            </p>
          </div>
          <div className="mt-5 grid gap-4">
            {bridgeVerses.map((verse) => (
              <article
                key={verse.reference}
                className="rounded-[1.45rem] bg-surface-container-low p-5"
              >
                <p className="font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
                  {verse.reference}
                </p>
                <p className="mt-3 font-headline text-[1.08rem] leading-8 text-primary">
                  {verse.verse}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-secondary" />
            <h3 className="font-headline text-[1.8rem] text-primary">唯一的橋樑</h3>
          </div>
          <div className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <p className="text-[1.05rem] leading-8 text-on-surface">
              然而神與人之間的鴻溝極大，只有神所預備的唯一橋樑才能跨越，把人救贖。
            </p>
            <p className="mt-4 text-[1.05rem] leading-8 text-on-surface">
              神救贖人的計劃是：祂親自以人的身份來到世上，稱為神的兒子耶穌基督，為我們的罪被釘死在十字架上，三日後復活。
            </p>
            <ScriptureCard
              reference="彼得前書 3:18"
              verse="基督也曾一次為罪受苦，就是義的代替不義的，為要引我們到神面前。"
              className="mt-6"
            />
          </div>
        </section>

        <section className="relative mt-10 overflow-hidden rounded-[2.4rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.16),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,0.04),_transparent_54%)]" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <Icon name="volunteer_activism" className="text-3xl text-secondary-fixed" />
              <h3 className="font-headline text-[2rem]">耶穌的救贖</h3>
            </div>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container">
              耶穌以死來替我們擔負罪的刑罰。祂的復活顯明祂是神，而且戰勝了死亡和罪惡。
            </p>
            <ScriptureCard
              reference="哥林多前書 15:3-6"
              verse="基督照聖經所說，為我們的罪死了，而且埋葬了，又照聖經所說，第三天復活了。"
              tone="dark"
              accent="soft"
              className="mt-8 bg-white/10"
            />
          </div>
        </section>

        <section className="mt-10 rounded-[2.4rem] bg-surface-container-high p-8 text-center shadow-inner shadow-primary/5">
          <h3 className="font-headline text-[2rem] text-primary">
            神已建好了救贖的橋樑
          </h3>
          <p className="mx-auto mt-4 max-w-[18rem] leading-7 text-on-surface-variant">
            但到底哪些人才有資格通過？下一步會看聖經如何說明人的回應。
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-[11px] font-extrabold tracking-[0.22em] text-outline/70">
              STEP 3 / 4
            </p>
            <Icon name="expand_more" className="animate-bounce text-3xl text-secondary" />
          </div>
        </section>

        <JourneyPager
          previous={{ to: '/journey/problem', label: '人的問題' }}
          next={{ to: '/journey/response', label: '人的回應' }}
        />
      </main>
    </>
  );
}

export function HumanResponseScreen() {
  const { faithDefinitions, customScreenTexts } = useAppContent();

  return (
    <>
      <PageHeader title="人的回應" backTo="/journey/bridge" />

      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-surface-container-low p-8 shadow-[0_22px_56px_rgba(40,53,28,0.1)]">
          <div className="mb-7 inline-flex rounded-full bg-primary-container px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-white">
            STEP 4 / 4
          </div>
          <h2 className="font-headline text-[2.45rem] leading-tight text-primary">
            人的回應
          </h2>
          <p className="mt-3 font-medium leading-7 text-secondary">
            那些聽到福音、願意悔改歸回神身邊的人，只要信，就是相信並接受，就能得到耶穌的拯救，與神重建關係。
          </p>
        </section>

        <section className="mt-6 rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
          <div className="flex items-center gap-3 text-secondary">
            <Icon name="menu_book" className="text-[20px]" />
            <p className="font-body text-[11px] font-extrabold tracking-[0.22em]">
              經文根基
            </p>
          </div>
          <div className="mt-5 grid gap-4">
            {responseVerses.map((verse) => (
              <article
                key={verse.reference}
                className="rounded-[1.45rem] bg-surface-container-low p-5"
              >
                <p className="font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
                  {verse.reference}
                </p>
                <p className="mt-3 font-headline text-[1.08rem] leading-8 text-primary">
                  {verse.verse}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h3 className="font-headline text-[1.8rem] text-primary">何為「信」？</h3>
          <div className="mt-5 grid gap-4">
            {faithDefinitions.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] bg-surface-container p-6 shadow-[0_16px_34px_rgba(40,53,28,0.06)]"
              >
                <div className="flex items-center gap-2 text-secondary">
                  <Icon name={item.icon} className="text-[20px]" />
                  <p className="font-body text-sm font-extrabold tracking-[0.16em]">
                    {item.title}
                  </p>
                </div>
                <p className="mt-3 text-[1rem] leading-7 text-on-surface">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mt-10 overflow-hidden rounded-[2.4rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.16),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,0.04),_transparent_54%)]" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <Icon name="celebration" className="text-3xl text-secondary-fixed" />
              <h3 className="font-headline text-[2rem]">出死入生</h3>
            </div>
            <img
              src={assetPath('assets/人的回應.png')}
              alt="出死入生"
              className="ifu-diagram-image mt-6 h-auto w-full rounded-[1.6rem] object-contain shadow-[0_20px_48px_rgba(0,0,0,0.24)]"
            />
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container">
              任何人若誠心相信接受耶穌基督的拯救，他便立刻得到這拯救，就是罪得赦免，已經出死入生，成為神的兒女，有永遠與神一起的新生命。
            </p>
            <ScriptureCard
              reference="約翰福音 5:24"
              verse="那聽我話、又信差我來者的，就有永生，不至於定罪，是已經出死入生了。"
              tone="dark"
              accent="soft"
              className="mt-8 bg-white/10"
            />
          </div>
        </section>

        <section className="mt-10 rounded-[2.4rem] bg-surface-container-high p-8 text-center shadow-inner shadow-primary/5">
          <h3 className="font-headline text-[2rem] text-primary">
            {customScreenTexts['bridge:decision-title'] || '輪到你了'}
          </h3>
          <p className="mx-auto mt-4 max-w-[18rem] leading-7 text-on-surface-variant">
            {customScreenTexts['bridge:decision-desc'] || '若你願意相信並接受耶穌基督的救贖，歸回神的身邊，你要向神清楚表明你的決定。'}
          </p>
          <div className="mt-8 rounded-[1.7rem] bg-surface-container-lowest p-5 text-left shadow-[0_16px_34px_rgba(40,53,28,0.06)]">
            <p className="font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
              {customScreenTexts['salvation:prayer-title'] || '決志禱告：接受耶穌基督的拯救'}
            </p>
            <p className="mt-4 font-headline text-[1.05rem] leading-8 text-primary">
              {customScreenTexts['salvation:prayer-body'] ||
                '「神啊，我承認自己是一個有罪的人，違背了你。我知道你愛我，又相信你已藉著耶穌基督為我準備了救贖。我誠心接受耶穌基督為我的救主，求你照你所應許的，赦免我的罪，讓我重新成為你的兒女。又求你今後引導我的生命，讓你賜給我的新生命繼續成長。奉耶穌基督的名禱告，阿們。」'}
            </p>
          </div>
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-[11px] font-extrabold tracking-[0.22em] text-outline/70">
              誠心祈求 · 開啟新生命
            </p>
            <Icon name="expand_more" className="animate-bounce text-3xl text-secondary" />
          </div>
        </section>

        <JourneyPager
          previous={{ to: '/journey/bridge', label: '神的拯救' }}
          next={{ to: '/journey/salvation-assurance', label: '得救的確據' }}
        />
      </main>
    </>
  );
}
