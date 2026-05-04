import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export function PageHeader({
  title,
  backTo,
  backLabel = '返回',
  action,
  compact = false,
}) {
  return (
    <header className="glass-topbar sticky top-0 z-30">
      <div
        className={`flex items-center justify-between px-8 ${
          compact ? 'h-16' : 'h-[4.35rem]'
        }`}
      >
        <div className="flex items-center gap-4">
          {backTo ? (
            <Link
              to={backTo}
              aria-label={backLabel}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary transition-transform active:scale-95"
            >
              <Icon name="arrow_back" className="text-[22px]" />
            </Link>
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Icon name="menu_book" className="text-[20px]" />
            </span>
          )}
          <h1 className="font-headline text-[1.35rem] font-bold tracking-tight text-primary">
            {title}
          </h1>
        </div>
        {action ?? <div className="h-9 w-9" />}
      </div>
      <div className="h-px bg-[rgba(40,53,28,0.05)]" />
    </header>
  );
}
