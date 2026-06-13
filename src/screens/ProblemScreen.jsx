import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';
import { ScriptureCard } from '../components/ScriptureCard';

import { useAppContent } from '../context/ContentContext';
import { assetPath } from '../utils/assets';

export function ProblemScreen() {
  const { customScreenTexts } = useAppContent();

  return (
    <>
      <PageHeader title="人的問題" backTo="/journey/creation" />

      <main className="gradient-descent px-6 pb-36 pt-0">
        <section className="relative flex min-h-[30rem] flex-col items-center justify-start px-2 pt-14 text-center">
          <div>
            <Icon name="person" className="mb-6 text-6xl text-primary/80" />
            <h2 className="font-headline text-[2.55rem] tracking-tight text-primary">
              {customScreenTexts['problem:hero-title'] || '失落的光輝'}
            </h2>
            <p className="mx-auto mt-4 max-w-[18rem] text-lg leading-8 text-on-surface-variant">
              {customScreenTexts['problem:hero-desc'] || '在造物主最初的計畫中，人本是尊貴的，直到黑暗遮蔽了視線。'}
            </p>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <span className="font-headline text-6xl font-bold tracking-[0.7rem] text-primary/10">
              罪
            </span>
            <div className="mt-3 flex justify-center">
              <Icon name="expand_more" className="animate-bounce text-primary/40" />
            </div>
          </div>
        </section>

        <section className="pb-12">
          <article className="rounded-[2rem] bg-white/62 p-8 shadow-[0_18px_46px_rgba(40,53,28,0.08)] backdrop-blur-xl">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/6">
              <Icon name="auto_stories" className="text-primary" />
            </div>
            <h3 className="font-headline text-[1.8rem] text-primary">
              世人都犯了罪
            </h3>
            <p className="mt-4 leading-7 text-on-surface-variant">
              聖經指出人人人犯了罪，就是在思想和行為上違背神，偏離了祂良善的標準。
            </p>
            <ScriptureCard
              reference="羅馬書 3:23"
              verse="因為世人都犯了罪，虧缺了神的榮耀。"
              className="mt-8"
            />
          </article>
        </section>

        <section className="pb-14">
          <div className="space-y-8 text-center">
            <figure className="overflow-hidden rounded-[2rem] bg-surface-container-lowest p-2 shadow-[0_28px_70px_rgba(20,20,18,0.18)]">
              <img
                src={assetPath('assets/人的問題.png')}
                alt="人的罪使人與神分隔"
                className="ifu-diagram-image h-auto w-full rounded-[1.65rem] object-cover"
              />
            </figure>

            <div>
              <h3 className="font-headline text-[1.9rem] text-primary">
                {customScreenTexts['problem:chasm-title'] || '人的罪使人與神分隔'}
              </h3>
              <p className="mt-3 leading-7 text-on-surface-variant">
                {customScreenTexts['problem:chasm-desc'] || '罪惡就像一道無法逾越的鴻溝，攔阻了我們尋求神，也掩蓋了祂對我們的祝福。'}
              </p>
            </div>

            <ScriptureCard
              reference="以賽亞書 59:2"
              verse="但你們的罪孽使你們與神隔絕；你們的罪惡使他掩面不聽你們。"
            />
          </div>
        </section>

        <section className="rounded-t-[2.5rem] bg-primary px-6 py-14 text-surface">
          <div className="text-center">
            <div className="mb-6 inline-flex rounded-full bg-secondary/20 p-4">
              <Icon name="gavel" className="text-4xl text-secondary-fixed-dim" />
            </div>
            <h3 className="font-headline text-[1.9rem]">
              {customScreenTexts['problem:gavel-title'] || '罪的工價就是死'}
            </h3>
            <p className="mt-4 leading-7 text-surface/72">
              {customScreenTexts['problem:gavel-desc'] || '罪不僅破壞了現世的生命，更帶來了終極的結局。死後，每個人都必須面對造物主公義的審判。'}
            </p>
          </div>
          <div className="mt-10 grid gap-5">
            <ScriptureCard
              reference="羅馬書 6:23"
              verse="因為罪的工價乃是死；惟有神的恩賜，在我們的主基督耶穌裡，乃是永生。"
              tone="dark"
              accent="soft"
            />
            <ScriptureCard
              reference="希伯來書 9:27"
              verse="按著定命，人人人有一死，死後且有審判。"
              tone="dark"
              accent="soft"
            />
          </div>
        </section>

        <section className="rounded-b-[2.5rem] bg-[#171815] px-6 py-16 text-center text-surface">
          <div className="relative">
            <div className="absolute inset-0 flex justify-center opacity-30">
              <div className="h-48 w-48 rounded-full bg-[#ba1a1a] blur-[70px]" />
            </div>
            <div className="relative">
              <Icon
                name="arrow_downward"
                className="mb-4 text-7xl text-[#ff7a7a]/50"
              />
              <h3 className="font-headline text-[2.2rem] tracking-[0.18em]">
                {customScreenTexts['problem:chasm-death-title'] || '永遠沉淪'}
              </h3>
            </div>
          </div>

          <ScriptureCard
            reference="帖撒羅尼迦後書 1:8-9"
            verse="要報應那不認識神和那不聽從我主耶穌福音的人。"
            tone="dark"
            accent="soft"
            className="mx-auto mt-10 max-w-md text-left"
          />

          <h4 className="mt-10 font-headline text-[1.8rem]">
            {customScreenTexts['problem:chasm-death-rescue'] || '無法自救的絕路'}
          </h4>
          <p className="mt-4 leading-7 text-surface/62">
            {customScreenTexts['problem:chasm-death-desc'] || '無論人如何努力，行善、道德或宗教，都無法洗淨靈魂的污點，脫離這必然的結局。'}
          </p>
        </section>

        <section className="bg-[linear-gradient(180deg,_#171815_0%,_#fbf9f5_100%)] px-2 py-14 text-center">
          <Icon name="flare" className="text-5xl text-secondary" />
          <p className="mt-6 font-headline text-[1.9rem] leading-tight text-primary">
            {customScreenTexts['problem:footer-title'] || '縱然人違背了神，神仍是愛人的。'}
          </p>
          <p className="mt-5 leading-7 text-on-surface-variant">
            {customScreenTexts['problem:footer-desc'] || '在黑暗的盡頭，祂為我們預備了一條出路。祂不願一人沉淪，乃願萬人悔改，重新回到祂的懷抱。'}
          </p>
          <Link
            to="/journey/bridge"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-secondary px-7 py-4 text-sm font-extrabold tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(121,89,0,0.24)] transition-all hover:brightness-105 active:scale-95"
          >
            NEXT: 神的拯救
            <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
          <p className="mt-7 font-body text-[11px] font-extrabold tracking-[0.22em] text-primary/35">
            STEP 2 / 4
          </p>
        </section>

        <JourneyPager
          previous={{ to: '/journey/creation', label: '神的創造' }}
          next={{ to: '/journey/bridge', label: '神的拯救' }}
        />
      </main>
    </>
  );
}
