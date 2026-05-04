import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';
import { ScriptureCard } from '../components/ScriptureCard';
import { faithDefinitions } from '../data/appContent';

export function BridgeScreen() {
  return (
    <>
      <PageHeader title="人的回應" backTo="/journey/problem" />

      <main className="px-6 pb-36 pt-8">
        <section className="overflow-hidden rounded-[2.65rem] bg-surface-container-low p-1 shadow-[0_30px_74px_rgba(40,53,28,0.16)]">
          <div className="bridge-hero relative min-h-[40rem] overflow-hidden rounded-[2.45rem]">
            <img
              src="/assets/bridge-infographic.png"
              alt="Bridge infographic exported from Stitch"
              className="absolute inset-0 h-full w-full object-cover object-top opacity-[0.84]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(251,249,245,0.1)_0%,_rgba(251,249,245,0.24)_12%,_rgba(14,16,14,0.04)_38%,_rgba(251,249,245,0.22)_100%)]" />

            <div className="relative z-10 flex min-h-[40rem] flex-col justify-between px-5 pb-7 pt-9">
              <div className="text-center">
                <h2 className="font-headline text-[2.15rem] text-primary drop-shadow-[0_6px_24px_rgba(255,255,255,0.55)]">
                  The Step of Faith
                </h2>
                <p className="mt-2 text-sm font-semibold tracking-[0.16em] text-on-surface-variant">
                  跨越鴻溝的生命抉擇
                </p>
              </div>

              <div className="pointer-events-none relative h-[25rem]">
                <div className="absolute left-2 top-[5.6rem] max-w-[9rem] rounded-[1.3rem] bg-white/78 p-3 shadow-[0_16px_40px_rgba(40,53,28,0.16)] backdrop-blur-xl">
                  <p className="text-[10px] font-extrabold tracking-[0.18em] text-primary/55">
                    STATUS
                  </p>
                  <p className="mt-1 text-xs italic text-on-surface-variant">
                    深淵的阻隔...
                  </p>
                </div>

                <button
                  type="button"
                  className="pointer-events-auto absolute left-6 top-[11.2rem] rounded-full bg-white/82 px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-primary shadow-[0_16px_36px_rgba(40,53,28,0.18)] backdrop-blur-xl transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  悔改
                </button>

                <button
                  type="button"
                  className="pointer-events-auto absolute right-5 top-[14.9rem] rounded-full bg-white/82 px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-secondary shadow-[0_16px_36px_rgba(40,53,28,0.18)] backdrop-blur-xl transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  信靠
                </button>

                <div className="pointer-events-auto absolute left-4 bottom-20 w-[10.4rem] rounded-[1.45rem] bg-white/72 p-3 shadow-[0_18px_42px_rgba(40,53,28,0.18)] backdrop-blur-xl transition-all hover:-translate-y-0.5">
                  <div className="flex items-start gap-3">
                    <Icon name="auto_stories" className="mt-0.5 text-primary" />
                    <div>
                      <p className="text-[10px] font-extrabold tracking-[0.16em] text-primary/55">
                        Romans 5:8
                      </p>
                      <p className="mt-1 text-[11px] font-semibold leading-5 text-primary">
                        基督為我們死
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-auto absolute right-3 bottom-12 w-[10.8rem] rounded-[1.45rem] bg-white/72 p-3 shadow-[0_18px_42px_rgba(40,53,28,0.18)] backdrop-blur-xl transition-all hover:-translate-y-0.5">
                  <div className="flex items-start gap-3">
                    <Icon name="church" className="mt-0.5 text-secondary" />
                    <div>
                      <p className="text-[10px] font-extrabold tracking-[0.16em] text-secondary/65">
                        1 Peter 3:18
                      </p>
                      <p className="mt-1 text-[11px] font-semibold leading-5 text-primary">
                        引我們到神面前
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-3 right-5 max-w-[9rem] rounded-[1.3rem] bg-primary/88 p-3 text-right shadow-[0_16px_40px_rgba(20,25,18,0.28)] backdrop-blur-xl">
                  <p className="text-[10px] font-extrabold tracking-[0.18em] text-secondary-fixed">
                    NEW BEGINNING
                  </p>
                  <p className="mt-1 text-xs font-bold text-white">神的兒女</p>
                </div>
              </div>
            </div>
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
          <h3 className="font-headline text-[2rem] text-primary">輪到你了</h3>
          <p className="mx-auto mt-4 max-w-[18rem] leading-7 text-on-surface-variant">
            若你願意相信並接受耶穌基督的救贖，歸回神的身邊，你要向神清楚表明你的決定。
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
