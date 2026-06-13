import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';
import { ScriptureCard } from '../components/ScriptureCard';
import { useAppContent } from '../context/ContentContext';

const bridgeVerses = [
  {
    reference: '羅馬書 5:8',
    verse:
      '惟有基督在我們還作罪人的時候為我們死，神的愛就在此向我們顯明了。',
  },
  {
    reference: '彼得前書 3:18',
    verse:
      '因基督也曾一次為罪受苦，就是義的代替不義的，為要引我們到神面前。按著肉體說，他被治死；按著靈性說，他復活了。',
  },
];

export function BridgeScreen() {
  const { faithDefinitions, customScreenTexts } = useAppContent();

  return (
    <>
      <PageHeader title="人的回應" backTo="/journey/problem" />

      <main className="px-6 pb-36 pt-8">
        <section className="overflow-hidden rounded-[2.35rem] bg-surface-container-low p-1 shadow-[0_30px_74px_rgba(40,53,28,0.16)]">
          <div className="bridge-hero relative min-h-[38rem] overflow-hidden rounded-[2.15rem]">
            <img
              src="/assets/bridge-step-of-faith.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(251,249,245,0.72)_0%,_rgba(251,249,245,0.28)_20%,_rgba(20,24,18,0.04)_44%,_rgba(18,20,17,0.62)_100%)]" />

            <div className="relative z-10 flex min-h-[38rem] flex-col justify-between px-5 pb-8 pt-9">
              <div className="text-center">
                <h2 className="font-headline text-[2rem] leading-tight text-primary drop-shadow-[0_6px_24px_rgba(255,255,255,0.7)]">
                  {customScreenTexts['bridge:hero-title'] || 'The Step of Faith'}
                </h2>
                <p className="mt-2 text-xs font-extrabold tracking-[0.18em] text-primary/70 drop-shadow-[0_4px_16px_rgba(255,255,255,0.75)]">
                  {customScreenTexts['bridge:hero-desc'] || '跨越鴻溝的生命抉擇'}
                </p>
              </div>

              <div className="pointer-events-none relative h-[27rem]">
                <div className="absolute left-2 top-9 max-w-[8.7rem] text-left text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.72)]">
                  <p className="font-body text-[10px] font-extrabold tracking-[0.22em] text-white/70">
                    人的景況
                  </p>
                  <p className="mt-1 font-headline text-[1.25rem] font-black leading-tight">
                    罪使人與神隔絕
                  </p>
                </div>

                <div className="absolute left-[35%] top-[11.8rem] -rotate-6 text-center text-secondary-fixed drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                  <p className="font-body text-[10px] font-black tracking-[0.22em]">
                    悔改
                  </p>
                  <div className="mx-auto mt-2 h-px w-14 bg-secondary-fixed/80" />
                </div>

                <div className="absolute right-[20%] top-[15.4rem] rotate-3 text-center text-secondary-fixed drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                  <p className="font-body text-[10px] font-black tracking-[0.22em]">
                    信靠
                  </p>
                  <div className="mx-auto mt-2 h-px w-14 bg-secondary-fixed/80" />
                </div>

                <div className="absolute bottom-2 right-2 max-w-[9.6rem] text-right text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.72)]">
                  <p className="font-body text-[10px] font-extrabold tracking-[0.22em] text-secondary-fixed">
                    新生命
                  </p>
                  <p className="mt-1 font-headline text-[1.35rem] font-black leading-tight">
                    歸到神面前
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
          <div className="flex items-center gap-3 text-secondary">
            <Icon name="menu_book" className="text-[20px]" />
            <p className="font-body text-[11px] font-extrabold tracking-[0.22em]">
              經文根基
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
            <h3 className="font-headline text-[1.8rem] text-primary">悔改與信靠</h3>
          </div>
          <div className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
            <p className="text-lg leading-8 text-on-surface">
              要走過這救贖的橋樑，你需要悔改並信靠耶穌基督。
            </p>
            <ScriptureCard
              reference="約翰福音 5:24"
              verse="那聽我話、又信差我來者的，就有永生；不至於定罪，是已經出死入生了。"
              className="mt-6"
            />
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
              <h3 className="font-headline text-[2rem]">赦免與新生</h3>
            </div>
            <p className="mt-5 text-[1.08rem] leading-8 text-on-primary-container">
              任何人若誠心相信接受耶穌基督的救贖，他便立刻得到這拯救，就是罪得赦免，已經出死入生，成為神的兒女。
            </p>
            <ScriptureCard
              reference="約翰福音 1:12"
              verse="凡接待他的，就是信他名的人，他就賜他們權柄作神的兒女。"
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
          <button
            type="button"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,_#28351c_0%,_#3e4c31_100%)] px-8 py-5 font-body text-lg font-extrabold tracking-[0.22em] text-white shadow-[0_24px_56px_rgba(40,53,28,0.2)] transition-all duration-300 hover:brightness-105 active:scale-95"
          >
            決定相信
          </button>
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-[11px] font-extrabold tracking-[0.22em] text-outline/70">
              誠心祈求 · 開啟新生命
            </p>
            <Icon name="expand_more" className="animate-bounce text-3xl text-secondary" />
          </div>
        </section>

        <JourneyPager previous={{ to: '/journey/problem', label: '人的問題' }} />
      </main>
    </>
  );
}
