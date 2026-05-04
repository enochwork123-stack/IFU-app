import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { discipleshipSteps } from '../data/appContent';

function JourneyCard({ step, isLast }) {
  const isActive = step.status === 'active';
  const isAvailable = isActive || step.status === 'available';

  const body = (
    <div
      className={`relative z-10 flex gap-5 ${!isLast ? 'journey-path' : ''}`}
    >
      <div
        className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-surface ${
          isActive
            ? 'bg-secondary text-white shadow-[0_0_20px_rgba(121,89,0,0.3)]'
            : isAvailable
              ? 'bg-primary-container text-white shadow-[0_0_18px_rgba(40,53,28,0.16)]'
            : 'bg-surface-container-high text-outline'
        }`}
      >
        <Icon name={step.icon} filled={isAvailable} className="text-[22px]" />
      </div>
      <div
        className={`flex-1 rounded-[1.55rem] p-5 ${
          isActive
            ? 'bg-surface-container-lowest shadow-[0_16px_44px_rgba(40,53,28,0.08)] ring-1 ring-[rgba(121,89,0,0.08)]'
            : isAvailable
              ? 'bg-surface-container-lowest shadow-[0_14px_38px_rgba(40,53,28,0.06)]'
            : 'bg-surface-container-low opacity-80'
        }`}
      >
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h3
              className={`font-headline text-xl ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {step.title}
            </h3>
            <p className="mt-1 text-xs font-medium text-on-surface-variant/70">
              ({step.subtitle})
            </p>
          </div>
          {isActive ? (
            <span className="rounded-full bg-secondary-fixed px-2 py-0.5 text-[10px] font-extrabold tracking-[0.16em] text-on-secondary-fixed">
              ACTIVE
            </span>
          ) : isAvailable ? (
            <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-[10px] font-extrabold tracking-[0.16em] text-primary">
              OPEN
            </span>
          ) : (
            <Icon name="lock" className="text-[18px] text-outline" />
          )}
        </div>
        <p className="text-sm leading-7 text-on-surface-variant/85">
          {step.description}
        </p>
        {isAvailable ? (
          <div className="mt-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-bold text-white shadow-[0_14px_36px_rgba(121,89,0,0.2)]">
              開始學習
              <Icon name="arrow_forward" className="text-[18px]" />
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (isAvailable && step.route) {
    return (
      <Link to={step.route} className="block">
        {body}
      </Link>
    );
  }

  return body;
}

export function JourneyOverviewScreen() {
  return (
    <>
      <PageHeader
        title="新生命栽培"
        backTo="/"
        action={
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container">
            <Icon name="account_circle" className="text-[22px] text-primary" />
          </div>
        }
      />

      <main className="px-6 pb-36 pt-8">
        <section className="mb-9 text-center">
          <div className="inline-block rounded-full bg-primary-container px-4 py-1 text-[11px] font-extrabold tracking-[0.22em] text-on-primary">
            CHAPTER 1
          </div>
          <h2 className="mt-5 font-headline text-[2.3rem] text-primary">
            初信栽培
          </h2>
          <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-7 text-on-surface-variant">
            建立與基督穩固的聯結，開展屬靈成長的旅程。
          </p>
        </section>

        <div className="space-y-6">
          {discipleshipSteps.map((step, index) => (
            <JourneyCard
              key={step.title}
              step={step}
              isLast={index === discipleshipSteps.length - 1}
            />
          ))}
        </div>

        <section className="relative mt-14 overflow-hidden rounded-[2rem] bg-primary p-6 text-white shadow-[0_26px_70px_rgba(40,53,28,0.22)]">
          <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full bg-primary-container/30 blur-3xl" />
          <div className="relative">
            <h3 className="font-headline text-xl">Journey Progress</h3>
            <div className="mt-5 flex items-center justify-between text-xs">
              <span className="text-white/70">Overall Completion</span>
              <span className="font-extrabold text-secondary-fixed">8%</span>
            </div>
            <div className="mt-3 flex gap-2">
              <div className="h-2 flex-1 rounded-full bg-secondary-fixed shadow-[0_0_10px_rgba(255,223,160,0.55)]" />
              <div className="h-2 flex-1 rounded-full bg-white/20" />
              <div className="h-2 flex-1 rounded-full bg-white/20" />
              <div className="h-2 flex-1 rounded-full bg-white/20" />
            </div>
            <div className="mt-3 flex justify-between text-[10px] font-extrabold tracking-[0.18em] text-white/55">
              <span>STAGE 1</span>
              <span>STAGE 2</span>
              <span>STAGE 3</span>
              <span>STAGE 4</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
