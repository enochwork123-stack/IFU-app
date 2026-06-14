import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ROUTE_REGISTRY } from '../app/routes';
import { useAppContent } from '../context/ContentContext';

function accentClass(accent) {
  if (accent === 'secondary') {
    return 'bg-secondary-fixed text-on-secondary-fixed';
  }
  if (accent === 'primary') {
    return 'bg-primary-fixed text-on-primary-fixed';
  }
  return 'bg-surface-container text-primary';
}

export function HomeScreen() {
  const { homeCards, customScreenTexts } = useAppContent();

  return (
    <>
      <header className="glass-topbar sticky top-0 z-30">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Icon name="menu_book" className="text-[18px] sm:text-[22px] text-primary shrink-0" />
            <p className="font-headline text-sm sm:text-base md:text-xl font-bold tracking-tight text-primary whitespace-nowrap no-truncate-on-mobile">
              {customScreenTexts['home:hero-title'] || '基督門徒訓練'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              to="/admin"
              aria-label="管理後台"
              title="管理後台"
              className="inline-flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-secondary hover:bg-surface-container-low transition active:scale-95 whitespace-nowrap"
            >
              <Icon name="admin_panel_settings" className="text-[16px] sm:text-[20px]" />
            </Link>
            <button className="inline-flex h-7 sm:h-9 items-center gap-1.5 rounded-full bg-surface-container-lowest px-3 sm:px-4 text-[10px] sm:text-sm font-semibold text-on-surface shadow-[0_8px_22px_rgba(40,53,28,0.08)] ring-1 ring-[rgba(40,53,28,0.06)] transition-all active:scale-95 whitespace-nowrap">
              <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-secondary shrink-0" />
              登錄
            </button>
          </div>
        </div>
        <div className="h-px bg-[rgba(40,53,28,0.05)]" />
      </header>

      <main className="relative overflow-hidden px-6 pb-36 pt-10">
        <div className="pointer-events-none absolute inset-x-0 top-3 z-0 flex justify-center">
          <div className="h-44 w-44 rounded-full bg-secondary/10 blur-[84px]" />
        </div>

        <section className="relative z-10 mx-auto mb-14 mt-2 max-w-xl text-center">
          <h1 className="font-headline text-[3.2rem] leading-[1.06] tracking-tight text-primary">
            {customScreenTexts['home:hero-title'] || '基督門徒訓練'}
          </h1>
          <p className="mx-auto mt-5 max-w-[18rem] text-lg leading-8 text-on-surface-variant">
            {customScreenTexts['home:hero-subtitle'] || '在信仰中成長的旅程，一步一腳印。'}
          </p>
        </section>

        <section className="relative z-10 space-y-5">
          {homeCards.map((card) => (
            <Link
              key={card.id || card.title}
              to={card.route}
              className="group block overflow-hidden rounded-[1.7rem] bg-surface-container-lowest p-8 shadow-[0_20px_55px_rgba(40,53,28,0.08)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_28px_62px_rgba(40,53,28,0.12)]"
            >
              <div className="absolute" />
              <div className="relative flex items-start gap-6">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${accentClass(
                    card.accent,
                  )}`}
                >
                  <Icon name={card.icon} className="text-[30px]" />
                </div>
                <div className="flex-1">
                  <h2 className="font-headline text-[1.9rem] text-primary">
                    {card.title}
                  </h2>
                  <p className="mt-2 leading-7 text-on-surface-variant">
                    {card.description}
                  </p>
                </div>
                <Icon
                  name="arrow_forward"
                  className="translate-x-3 self-center text-[22px] text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </div>
            </Link>
          ))}
        </section>

        <section className="relative z-10 mt-14 text-center">
          <Link
            to={ROUTE_REGISTRY.JOURNEY}
            className="inline-flex items-center rounded-full bg-secondary px-8 py-4 font-body text-sm font-extrabold tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(121,89,0,0.24)] transition-all duration-300 hover:brightness-105 active:scale-95"
          >
            開啟你的旅程
          </Link>
          <p className="mt-4 font-body text-[11px] font-extrabold tracking-[0.22em] text-primary/40">
            {customScreenTexts['home:footer-text'] || '每週更新課程'}
          </p>
        </section>
      </main>
    </>
  );
}

